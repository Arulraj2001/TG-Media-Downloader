from PySide6.QtWidgets import (
    QWidget, QVBoxLayout, QHBoxLayout, QLabel,
    QScrollArea, QFrame, QPushButton, QSizePolicy
)
from PySide6.QtCore import Qt, Signal
import os


class CompletedDownloadRow(QFrame):
    def __init__(self, title, folder_name, parent_view):
        super().__init__()
        self.title = title
        self.folder_name = folder_name
        self.parent_view = parent_view
        self.task_id = getattr(parent_view, "_last_task_id", None)
        self.setObjectName("HistoryRow")
        self.setContextMenuPolicy(Qt.CustomContextMenu)
        self.customContextMenuRequested.connect(self.show_context_menu)
        self.setup_ui()

    def setup_ui(self):
        layout = QHBoxLayout(self)
        layout.setContentsMargins(16, 12, 16, 12)
        layout.setSpacing(14)

        state = QLabel("DONE")
        state.setObjectName("CompletedMark")
        state.setAlignment(Qt.AlignCenter)
        layout.addWidget(state)

        text_layout = QVBoxLayout()
        text_layout.setSpacing(2)
        title_label = QLabel(self.title)
        title_label.setObjectName("CardTitle")
        title_label.setWordWrap(True)
        folder_label = QLabel(self.folder_name)
        folder_label.setObjectName("MutedText")
        folder_label.setToolTip(os.path.abspath(self.folder_name))
        text_layout.addWidget(title_label)
        text_layout.addWidget(folder_label)
        layout.addLayout(text_layout, stretch=1)

        open_button = QPushButton("Open folder")
        open_button.setObjectName("SecondaryButton")
        open_button.setCursor(Qt.PointingHandCursor)
        open_button.clicked.connect(
            lambda: self.parent_view.open_folder(self.folder_name)
        )
        layout.addWidget(open_button)

    def show_context_menu(self, pos):
        from PySide6.QtWidgets import QMenu, QApplication

        menu = QMenu(self)
        action_open = menu.addAction("Open folder")
        action_copy = menu.addAction("Copy full path")
        action_refetch = None
        if self.task_id:
            menu.addSeparator()
            action_refetch = menu.addAction("Download from this channel again")
        menu.addSeparator()
        action_remove = menu.addAction("Remove from history")

        action = menu.exec(self.mapToGlobal(pos))
        if action == action_open:
            self.parent_view.open_folder(self.folder_name)
        elif action == action_copy:
            QApplication.clipboard().setText(os.path.abspath(self.folder_name))
        elif action == action_refetch:
            channel_id = self.task_id.rsplit("_", 1)[0]
            self.parent_view.reFetchRequested.emit(channel_id)
        elif action == action_remove:
            self.deleteLater()
            if self.parent_view.history_layout.count() <= 1:
                self.parent_view.empty_state.show()


class DownloadsView(QWidget):
    reFetchRequested = Signal(str)

    def __init__(self, parent=None):
        super().__init__(parent)
        self.setup_ui()

    def setup_ui(self):
        page_layout = QVBoxLayout(self)
        page_layout.setContentsMargins(0, 0, 0, 0)

        self.scroll_area = QScrollArea()
        self.scroll_area.setWidgetResizable(True)
        self.scroll_area.setFrameShape(QFrame.NoFrame)
        self.scroll_area.setHorizontalScrollBarPolicy(Qt.ScrollBarAlwaysOff)

        self.content_container = QWidget()
        self.content_layout = QVBoxLayout(self.content_container)
        self.content_layout.setContentsMargins(32, 28, 32, 40)
        self.content_layout.setSpacing(16)
        self.content_layout.setAlignment(Qt.AlignTop)

        # ── Page header ──────────────────────────────────────────────────
        header_row = QHBoxLayout()
        header_stack = QVBoxLayout()
        header_stack.setSpacing(2)
        page_title = QLabel("Download Queue")
        page_title.setObjectName("PageTitle")
        page_subtitle = QLabel("Live speed and file progress")
        page_subtitle.setObjectName("PageSubtitle")
        header_stack.addWidget(page_title)
        header_stack.addWidget(page_subtitle)
        header_row.addLayout(header_stack)
        header_row.addStretch()

        # Global controls (hidden until there are active downloads)
        controls = QHBoxLayout()
        controls.setSpacing(8)
        self.btn_pause_all = QPushButton("Pause all")
        self.btn_pause_all.setObjectName("SecondaryButton")
        self.btn_pause_all.setCursor(Qt.PointingHandCursor)
        self.btn_resume_all = QPushButton("Resume all")
        self.btn_resume_all.setObjectName("PrimaryButton")
        self.btn_resume_all.setCursor(Qt.PointingHandCursor)
        controls.addWidget(self.btn_pause_all)
        controls.addWidget(self.btn_resume_all)
        self.btn_pause_all.hide()
        self.btn_resume_all.hide()
        header_row.addLayout(controls)
        self.content_layout.addLayout(header_row)

        # ── Active downloads section ──────────────────────────────────────
        active_section = QFrame()
        active_section.setObjectName("QueueSection")
        active_section_layout = QVBoxLayout(active_section)
        active_section_layout.setContentsMargins(20, 16, 20, 18)
        active_section_layout.setSpacing(12)

        active_header = QHBoxLayout()
        active_mark = QLabel("LIVE")
        active_mark.setObjectName("LiveMark")
        active_mark.setAlignment(Qt.AlignCenter)
        self.lbl_active = QLabel("Active downloads")
        self.lbl_active.setObjectName("SectionHeader")
        active_header.addWidget(active_mark)
        active_header.addWidget(self.lbl_active)
        active_header.addStretch()
        active_section_layout.addLayout(active_header)

        self.active_empty = QFrame()
        self.active_empty.setObjectName("EmptyState")
        active_empty_layout = QVBoxLayout(self.active_empty)
        active_empty_layout.setContentsMargins(16, 14, 16, 14)
        active_empty_title = QLabel("The queue is ready")
        active_empty_title.setObjectName("OptionTitle")
        active_empty_copy = QLabel(
            "Choose media on the Home page and active downloads will appear here."
        )
        active_empty_copy.setObjectName("MutedText")
        active_empty_copy.setWordWrap(True)
        active_empty_layout.addWidget(active_empty_title)
        active_empty_layout.addWidget(active_empty_copy)
        active_section_layout.addWidget(self.active_empty)

        self.active_container = QWidget()
        self.active_layout = QVBoxLayout(self.active_container)
        self.active_layout.setAlignment(Qt.AlignTop)
        self.active_layout.setContentsMargins(0, 0, 0, 0)
        self.active_layout.setSpacing(8)
        active_section_layout.addWidget(self.active_container)
        self.content_layout.addWidget(active_section)

        # ── Completed downloads section ───────────────────────────────────
        history_section = QFrame()
        history_section.setObjectName("QueueSection")
        history_section_layout = QVBoxLayout(history_section)
        history_section_layout.setContentsMargins(20, 16, 20, 18)
        history_section_layout.setSpacing(12)

        completed_header = QHBoxLayout()
        history_mark = QLabel("LOG")
        history_mark.setObjectName("HistoryMark")
        history_mark.setAlignment(Qt.AlignCenter)
        self.lbl_completed = QLabel("Completed downloads")
        self.lbl_completed.setObjectName("SectionHeader")
        self.lbl_completed.setSizePolicy(QSizePolicy.Ignored, QSizePolicy.Preferred)
        self.btn_clear_history = QPushButton("Clear history")
        self.btn_clear_history.setObjectName("LinkButton")
        self.btn_clear_history.setCursor(Qt.PointingHandCursor)
        self.btn_clear_history.clicked.connect(self.clear_history)
        completed_header.addWidget(history_mark)
        completed_header.addWidget(self.lbl_completed)
        completed_header.addStretch()
        completed_header.addWidget(self.btn_clear_history)
        history_section_layout.addLayout(completed_header)

        self.empty_state = QFrame()
        self.empty_state.setObjectName("EmptyState")
        empty_layout = QVBoxLayout(self.empty_state)
        empty_layout.setContentsMargins(16, 14, 16, 14)
        self.empty_lbl = QLabel("No completed downloads")
        self.empty_lbl.setObjectName("OptionTitle")
        empty_copy = QLabel("Finished folders will stay listed here for quick access.")
        empty_copy.setObjectName("MutedText")
        empty_copy.setWordWrap(True)
        empty_layout.addWidget(self.empty_lbl)
        empty_layout.addWidget(empty_copy)
        history_section_layout.addWidget(self.empty_state)

        self.history_container = QWidget()
        self.history_layout = QVBoxLayout(self.history_container)
        self.history_layout.setAlignment(Qt.AlignTop)
        self.history_layout.setContentsMargins(0, 0, 0, 0)
        self.history_layout.setSpacing(8)
        history_section_layout.addWidget(self.history_container)
        self.content_layout.addWidget(history_section)
        self.content_layout.addStretch()

        self.scroll_area.setWidget(self.content_container)
        page_layout.addWidget(self.scroll_area)

    def set_controls_visible(self, visible):
        self.btn_pause_all.setVisible(visible)
        self.btn_resume_all.setVisible(visible)
        self.active_empty.setVisible(not visible)

    def add_completed_item(self, title, folder_name, task_id=None):
        self.empty_state.hide()
        row = CompletedDownloadRow(title, folder_name, self)
        row.task_id = task_id
        self.history_layout.insertWidget(0, row)

    def open_folder(self, path):
        if os.path.exists(path):
            from PySide6.QtGui import QDesktopServices
            from PySide6.QtCore import QUrl
            QDesktopServices.openUrl(QUrl.fromLocalFile(os.path.abspath(path)))

    def clear_history(self):
        while self.history_layout.count():
            item = self.history_layout.takeAt(0)
            widget = item.widget()
            if widget:
                widget.deleteLater()
        self.empty_state.show()
