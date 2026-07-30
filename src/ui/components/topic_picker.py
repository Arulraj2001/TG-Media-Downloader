import os
from PySide6.QtWidgets import (
    QDialog, QVBoxLayout, QHBoxLayout, QLabel,
    QPushButton, QWidget, QFrame,
    QListWidget, QListWidgetItem
)
from PySide6.QtCore import Qt, Signal
from PySide6.QtGui import QIcon
from resource_utils import get_resource_path


class TopicPickerDialog(QDialog):
    """
    Dialog that shows all available forum topics for a group/channel.
    The user can select one topic to filter by, or choose to download
    all content without topic filtering.
    """
    topic_selected = Signal(object)  # Emits topic_id (int) or None for "all"

    def __init__(self, channel_title, topics, parent=None, is_dark=True):
        super().__init__(parent)
        self.setWindowTitle(f"Select topic - {channel_title}")
        self.topics = topics
        self.is_dark = is_dark
        self.selected_topic_id = None

        icon_path = get_resource_path(os.path.join("assets", "logo.ico"))
        if os.path.exists(icon_path):
            self.setWindowIcon(QIcon(icon_path))

        self.setMinimumSize(480, 380)
        self.setup_ui(channel_title)

    def setup_ui(self, channel_title):
        self.setObjectName("TopicPickerDialog")

        layout = QVBoxLayout(self)
        layout.setContentsMargins(0, 0, 0, 0)
        layout.setSpacing(0)

        # ── Simple Header ──
        header = QFrame()
        header.setObjectName("TopicHeader")
        header_layout = QVBoxLayout(header)
        header_layout.setContentsMargins(24, 20, 24, 16)
        header_layout.setSpacing(4)

        title_lbl = QLabel("Select a topic")
        title_lbl.setObjectName("TopicTitle")
        header_layout.addWidget(title_lbl)

        desc = QLabel(
            f"Choose which topic to download from in \"{channel_title}\""
        )
        desc.setObjectName("TopicDesc")
        desc.setWordWrap(True)
        header_layout.addWidget(desc)
        layout.addWidget(header)

        # ── Topic List ──
        list_container = QFrame()
        list_container.setObjectName("TopicListFrame")
        list_layout = QVBoxLayout(list_container)
        list_layout.setContentsMargins(16, 8, 16, 8)
        list_layout.setSpacing(0)

        self.list_widget = QListWidget()
        self.list_widget.setObjectName("TopicList")
        self.list_widget.setFrameShape(QFrame.NoFrame)
        self.list_widget.setSpacing(2)

        # "All topics" option (no filter)
        all_item = QListWidgetItem("All topics")
        all_item.setData(Qt.UserRole, None)
        self.list_widget.addItem(all_item)

        # Individual topics
        for topic in self.topics:
            topic_id = topic.get("id")
            topic_title = topic.get("title", f"Topic {topic_id}")
            item = QListWidgetItem(topic_title)
            item.setData(Qt.UserRole, topic_id)
            item.setToolTip(f"Topic ID: {topic_id}")
            self.list_widget.addItem(item)

        # Select first item by default
        self.list_widget.setCurrentRow(0)
        self.list_widget.itemClicked.connect(self.accept)
        list_layout.addWidget(self.list_widget)

        layout.addWidget(list_container, stretch=1)

        # ── Simple Footer ──
        footer = QFrame()
        footer.setObjectName("TopicFooter")
        bottom_layout = QHBoxLayout(footer)
        bottom_layout.setContentsMargins(16, 12, 16, 12)

        self.btn_cancel = QPushButton("Cancel")
        self.btn_cancel.setObjectName("TopicCancelBtn")
        self.btn_cancel.setFixedWidth(90)
        self.btn_cancel.clicked.connect(self.reject)

        bottom_layout.addStretch()

        self.btn_continue = QPushButton("Continue")
        self.btn_continue.setObjectName("TopicContinueBtn")
        self.btn_continue.setFixedWidth(110)
        self.btn_continue.clicked.connect(self.accept)

        bottom_layout.addWidget(self.btn_cancel)
        bottom_layout.addWidget(self.btn_continue)
        layout.addWidget(footer)

    def get_selected_topic_id(self):
        current = self.list_widget.currentItem()
        if current:
            return current.data(Qt.UserRole)
        return None

    def accept(self):
        self.selected_topic_id = self.get_selected_topic_id()
        self.topic_selected.emit(self.selected_topic_id)
        super().accept()