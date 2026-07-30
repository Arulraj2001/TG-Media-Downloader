import os
import humanize
from PySide6.QtWidgets import (
    QDialog, QVBoxLayout, QHBoxLayout, QLabel, 
    QPushButton, QTabWidget, QWidget, QScrollArea,
    QCheckBox, QFrame, QSizePolicy, QLineEdit, QDateEdit,
    QGridLayout, QToolButton
)
from PySide6.QtCore import Qt, Signal, QDate, QRegularExpression
from PySide6.QtGui import QIcon
from resource_utils import get_resource_path

class SelectableMediaRow(QWidget):
    stateChanged = Signal(bool)

    def __init__(self, msg, parent=None):
        super().__init__(parent)
        self.msg = msg
        self.setObjectName("SelectableRow")
        self.setAttribute(Qt.WA_StyledBackground, True)
        # remove fixed height to allow wrapping if text is long
        self.setMinimumHeight(64)
        self.setup_ui()

    def setup_ui(self):
        layout = QHBoxLayout(self)
        layout.setContentsMargins(16, 12, 16, 12)
        layout.setSpacing(16)

        # 1. Checkbox
        self.cb = QCheckBox()
        self.cb.setCursor(Qt.PointingHandCursor)
        self.cb.stateChanged.connect(self.on_cb_state_changed)
        layout.addWidget(self.cb)

        # 1.5 Icon/Type Badge
        self.lbl_icon = QLabel()
        self.lbl_icon.setFixedWidth(40)
        self.lbl_icon.setAlignment(Qt.AlignCenter)
        self.lbl_icon.setObjectName("MediaKindBadge")
        
        icon_emoji = "DOC"
        if getattr(self.msg, 'is_mock', False):
            cat = getattr(self.msg, 'media_type', '').lower()
            if cat == 'media': icon_emoji = "MED"
            elif cat == 'zips': icon_emoji = "ZIP"
            elif cat == 'music': icon_emoji = "AUD"
            elif cat == 'voice': icon_emoji = "VOC"
            elif cat == 'links': icon_emoji = "URL"
            elif cat == 'gifs': icon_emoji = "GIF"
            elif cat == 'chat': icon_emoji = "TXT"
        else:
            mime = getattr(self.msg.document, 'mime_type', '') if getattr(self.msg, 'document', None) else ""
            if getattr(self.msg, 'photo', None):
                icon_emoji = "IMG"
            elif getattr(self.msg, 'video', None) or mime.startswith('video/'):
                # Detect Round Video
                if hasattr(self.msg, 'video') and getattr(self.msg.video, 'round', False):
                    icon_emoji = "VID"
                else:
                    icon_emoji = "VID"
            elif getattr(self.msg, 'audio', None) or mime.startswith('audio/'):
                icon_emoji = "AUD"
            elif getattr(self.msg, 'voice', None) or mime.startswith('audio/ogg'):
                 icon_emoji = "VOC"
            elif getattr(self.msg, 'gif', None) or mime == 'video/mp4' and 'animated' in str(self.msg.media).lower():
                icon_emoji = "GIF"
            elif mime in ["application/zip", "application/x-rar-compressed", "application/x-7z-compressed"]:
                icon_emoji = "ZIP"
            elif getattr(self.msg, 'web_preview', None):
                icon_emoji = "URL"
            
        self.lbl_icon.setText(icon_emoji)
        layout.addWidget(self.lbl_icon)

        # 2. Information Stack
        info_stack = QVBoxLayout()
        info_stack.setSpacing(6)

        # Better size detection for ALL media types
        msg_size = 0
        if getattr(self.msg, 'is_mock', False):
            msg_size = getattr(self.msg, 'size', 0)
        elif getattr(self.msg, 'file', None):
            msg_size = self.msg.file.size
        elif getattr(self.msg, 'document', None):
            msg_size = self.msg.document.size
        elif getattr(self.msg, 'photo', None):
            # Photos have multiple sizes, pick the largest
            try: msg_size = self.msg.photo.sizes[-1].size
            except: msg_size = 0
            
        size_str = humanize.naturalsize(msg_size) if msg_size else "0 B"
        date_str = ""
        m_date = getattr(self.msg, 'date', None)
        if m_date:
            from datetime import datetime
            if isinstance(m_date, str):
                date_str = m_date[:16] # Use string slice for common format
            else:
                date_str = m_date.strftime("%Y-%m-%d %H:%M")
        
        # Prioritize filename over caption for clearer identification
        title_text = ""
        if getattr(self.msg, 'is_mock', False):
            title_text = getattr(self.msg, 'message', '')
        elif getattr(self.msg, 'file', None) and getattr(self.msg.file, 'name', None):
            title_text = self.msg.file.name
        elif getattr(self.msg, 'message', None):
            title_text = self.msg.message.replace('\n', ' ').strip()
        
        if not title_text:
            title_text = f"Msg #{self.msg.id}"

        self.lbl_title = QLabel(title_text)
        self.lbl_title.setObjectName("MediaItemTitle")
        self.lbl_title.setWordWrap(True) # Ensure long titles wrap properly
        info_stack.addWidget(self.lbl_title)

        # Row 2: Badge & Date
        meta_row = QHBoxLayout()
        meta_row.setSpacing(12)
        
        self.lbl_size = QLabel(size_str)
        self.lbl_size.setObjectName("SizeBadge")
        
        self.lbl_date = QLabel(date_str)
        self.lbl_date.setObjectName("MediaItemMeta")
        
        meta_row.addWidget(self.lbl_size)
        meta_row.addWidget(self.lbl_date)
        meta_row.addStretch()
        
        info_stack.addLayout(meta_row)
        layout.addLayout(info_stack)
        layout.addStretch()

    def on_cb_state_changed(self, state):
        is_checked = (state == Qt.Checked)
        self.setProperty("checked", "true" if is_checked else "false")
        self.style().unpolish(self)
        self.style().polish(self)
        self.stateChanged.emit(is_checked)

    def mousePressEvent(self, event):
        # Toggle checkbox on click anywhere in row
        self.cb.setChecked(not self.cb.isChecked())
        super().mousePressEvent(event)

    def setChecked(self, state):
        self.cb.setChecked(state)

    def isChecked(self):
        return self.cb.isChecked()

class MediaBrowserDialog(QDialog):
    fetch_requested = Signal()

    def __init__(self, channel_title, messages_dict, parent=None, previous_selected_ids=None, is_dark=True):
        super().__init__(parent)
        self.setWindowTitle(f"Choose files - {channel_title}")
        self.previous_selected_ids = previous_selected_ids or []
        self.is_dark = is_dark
        icon_path = get_resource_path(os.path.join("assets", "logo.ico"))
        if os.path.exists(icon_path):
            self.setWindowIcon(QIcon(icon_path))
            
        self.setMinimumSize(750, 500)
        self.messages = messages_dict or {}
        self.selected_messages = []
        self.rows = {} # tab_name -> list of SelectableMediaRow
        
        self.setup_ui(channel_title)

    def setup_ui(self, channel_title):
        self.setObjectName("MediaBrowserDialog")
        
        layout = QVBoxLayout(self)
        layout.setContentsMargins(22, 22, 22, 20)
        layout.setSpacing(14)
        
        # Bottom Actions (Initialize early because tabs depend on them)
        self.lbl_selected_count = QLabel("0 files selected")
        self.lbl_selected_count.setObjectName("DialogStatus")

        # Header
        header = QFrame()
        header.setObjectName("BrowserHero")
        header_layout = QHBoxLayout(header)
        header_layout.setContentsMargins(20, 16, 20, 16)
        header_layout.setSpacing(16)
        header_text = QVBoxLayout()
        header_text.setSpacing(3)
        header_kicker = QLabel("MEDIA SELECTION")
        header_kicker.setObjectName("Eyebrow")
        header_lbl = QLabel(channel_title)
        header_lbl.setObjectName("DialogTitle")
        header_copy = QLabel(
            "Choose categories now or load the file list for exact selection."
        )
        header_copy.setObjectName("MutedText")
        header_copy.setWordWrap(True)
        header_text.addWidget(header_kicker)
        header_text.addWidget(header_lbl)
        header_text.addWidget(header_copy)
        header_layout.addLayout(header_text, stretch=1)
        header_layout.addWidget(self.lbl_selected_count, 0, Qt.AlignTop)
        layout.addWidget(header)

        # 🔍 Search Bar
        toolbar = QFrame()
        toolbar.setObjectName("BrowserToolbar")
        search_layout = QHBoxLayout(toolbar)
        search_layout.setContentsMargins(12, 10, 12, 10)
        search_layout.setSpacing(10)
        
        self.inp_search = QLineEdit()
        self.inp_search.setPlaceholderText("Search by file name...")
        self.inp_search.setMinimumHeight(40)
        self.inp_search.textChanged.connect(self.filter_rows)
        
        self.btn_toggle_filters = QToolButton()
        self.btn_toggle_filters.setText("Show advanced settings")
        self.btn_toggle_filters.setCheckable(True)
        self.btn_toggle_filters.setChecked(True)
        self.btn_toggle_filters.setToolButtonStyle(Qt.ToolButtonTextBesideIcon)
        self.btn_toggle_filters.setMinimumHeight(40)
        self.btn_toggle_filters.clicked.connect(self.toggle_filters_area)
        
        search_layout.addWidget(self.inp_search, stretch=1)
        search_layout.addWidget(self.btn_toggle_filters)
        layout.addWidget(toolbar)

        # ⚙️ Advanced Filters Area (Collapsible)
        self.filters_area = QFrame(self)
        self.filters_area.setObjectName("FilterPanel")
        self.filters_area.setVisible(True)
        self.filters_area.setMinimumHeight(140) # Ensure it has enough room
        layout.addWidget(self.filters_area)
        
        f_layout = QGridLayout(self.filters_area)
        f_layout.setContentsMargins(16, 16, 16, 16)
        f_layout.setSpacing(12)
        
        # Row 1: Date Range
        lbl_d = QLabel("Date range")
        f_layout.addWidget(lbl_d, 0, 0)
        self.date_start = QDateEdit()
        self.date_start.setCalendarPopup(True)
        self.date_start.setDate(QDate.currentDate().addYears(-10))
        self.date_start.dateChanged.connect(self.filter_rows)
        
        self.date_end = QDateEdit()
        self.date_end.setCalendarPopup(True)
        self.date_end.setDate(QDate.currentDate())
        self.date_end.dateChanged.connect(self.filter_rows)
        
        date_range_layout = QHBoxLayout()
        date_range_layout.addWidget(self.date_start)
        date_range_layout.addWidget(QLabel("to"))
        date_range_layout.addWidget(self.date_end)
        f_layout.addLayout(date_range_layout, 0, 1)
        
        # Row 2: Size Range (MB)
        lbl_s = QLabel("Size (MB)")
        f_layout.addWidget(lbl_s, 1, 0)
        self.size_min = QLineEdit()
        self.size_min.setPlaceholderText("Min MB")
        self.size_min.textChanged.connect(self.filter_rows)
        self.size_max = QLineEdit()
        self.size_max.setPlaceholderText("Max MB")
        self.size_max.textChanged.connect(self.filter_rows)
        
        size_layout = QHBoxLayout()
        size_layout.addWidget(self.size_min)
        size_layout.addWidget(QLabel("-"))
        size_layout.addWidget(self.size_max)
        f_layout.addLayout(size_layout, 1, 1)
        
        # Row 3: Regex
        lbl_r = QLabel("File name pattern")
        f_layout.addWidget(lbl_r, 2, 0)
        self.inp_regex = QLineEdit()
        self.inp_regex.setPlaceholderText(r"e.g. ^IMG_.*\.jpg$")
        self.inp_regex.textChanged.connect(self.filter_rows)
        f_layout.addWidget(self.inp_regex, 2, 1)
        
        # Reset Filters Button
        self.btn_reset_filters = QPushButton("Reset filters")
        self.btn_reset_filters.setObjectName("SecondaryButton")
        self.btn_reset_filters.clicked.connect(self.reset_filters)
        f_layout.addWidget(self.btn_reset_filters, 2, 2)
        
        # Stacked Widget to support Bulk vs Tabs
        from PySide6.QtWidgets import QStackedWidget
        self.main_stack = QStackedWidget()

        # --- Bulk View ---
        self.bulk_view = QWidget()
        self.bulk_view.setObjectName("BulkView")
        bulk_layout = QVBoxLayout(self.bulk_view)
        bulk_layout.setContentsMargins(30, 24, 30, 24)
        bulk_layout.setSpacing(14)
        
        lbl_bulk = QLabel("Download by category")
        lbl_bulk.setObjectName("DialogTitle")
        
        lbl_desc = QLabel(
            "Download whole categories without loading the file list first.\n"
            "Use the button below when you want to choose individual files."
        )
        lbl_desc.setObjectName("MutedText")
        lbl_desc.setWordWrap(True)
        
        bulk_layout.addWidget(lbl_bulk)
        bulk_layout.addWidget(lbl_desc)
        
        options_panel = QFrame()
        options_panel.setObjectName("BulkOptions")
        cat_layout = QVBoxLayout(options_panel)
        cat_layout.setContentsMargins(14, 12, 14, 12)
        cat_layout.setSpacing(8)
        self.bulk_checkboxes = {}
        
        # Container for checkboxes to keep them centered together
        cb_container = QWidget()
        cb_layout = QVBoxLayout(cb_container)
        cb_layout.setSpacing(8)
        cb_layout.setContentsMargins(0, 0, 0, 0)
        
        # We only need the main categories for bulk
        categories = [
            ("All media (images and videos)", 6),
            ("Images only", 1),
            ("Videos only", 2),
            ("Files and documents", 3),
            ("Audio and voice", 5)
        ]
        for i, (name, media_id) in enumerate(categories):
            cb = QCheckBox(name)
            # Default check "All Media"
            if media_id == 6: cb.setChecked(True)
            self.bulk_checkboxes[media_id] = cb
            cb_layout.addWidget(cb)

        # "All Media" already contains images and videos. Make it exclusive
        # with those two choices to avoid duplicate downloads, while still
        # allowing Files or Audio to be selected alongside it.
        def keep_bulk_choices_distinct(changed_media_id, checked):
            if not checked:
                return
            if changed_media_id == 6:
                self.bulk_checkboxes[1].setChecked(False)
                self.bulk_checkboxes[2].setChecked(False)
            elif changed_media_id in {1, 2}:
                self.bulk_checkboxes[6].setChecked(False)

        for media_id, checkbox in self.bulk_checkboxes.items():
            checkbox.toggled.connect(
                lambda checked, selected_id=media_id:
                    keep_bulk_choices_distinct(selected_id, checked)
            )
            
        cat_layout.addWidget(cb_container)
        
        bulk_layout.addWidget(options_panel)
        
        self.btn_load_specific = QPushButton("Load and select specific files")
        self.btn_load_specific.setObjectName("SecondaryButton")
        self.btn_load_specific.setMinimumHeight(44)
        self.btn_load_specific.clicked.connect(lambda: self.fetch_requested.emit())
        
        btn_layout = QHBoxLayout()
        btn_layout.addWidget(self.btn_load_specific)
        btn_layout.addStretch()
        bulk_layout.addLayout(btn_layout)
        bulk_layout.addStretch()
        
        self.main_stack.addWidget(self.bulk_view)

        # --- Tabs View ---
        self.tabs = QTabWidget()
        self.tabs.setObjectName("MediaTabs")

        self.tab_all   = self.build_tab("all")
        self.tab_media = self.build_tab("media")
        self.tab_files = self.build_tab("files")
        self.tab_music = self.build_tab("music")
        self.tab_zips  = self.build_tab("zips")
        self.tab_voice = self.build_tab("voice")
        self.tab_links = self.build_tab("links")
        self.tab_gifs  = self.build_tab("gifs")
        self.tab_chat  = self.build_tab("chat")

        self.tabs.addTab(self.tab_all,   f"All ({len(self.messages.get('all', []))})")
        self.tabs.addTab(self.tab_media, f"Media ({len(self.messages.get('media', []))})")
        self.tabs.addTab(self.tab_files, f"Files ({len(self.messages.get('files', []))})")
        self.tabs.addTab(self.tab_music, f"Music ({len(self.messages.get('music', []))})")
        self.tabs.addTab(self.tab_zips,  f"Archives ({len(self.messages.get('zips', []))})")
        self.tabs.addTab(self.tab_voice, f"Voice ({len(self.messages.get('voice', []))})")
        self.tabs.addTab(self.tab_links, f"Links ({len(self.messages.get('links', []))})")
        self.tabs.addTab(self.tab_gifs,  f"GIFs ({len(self.messages.get('gifs', []))})")
        self.tabs.addTab(self.tab_chat,  f"Chat ({len(self.messages.get('chat', []))})")

        self.main_stack.addWidget(self.tabs)
        layout.addWidget(self.main_stack, stretch=1)
        
        # Determine initial view
        if not self.messages or len(self.messages.get("all", [])) == 0:
            self.main_stack.setCurrentIndex(0)
            self.lbl_selected_count.setText("Choose one or more categories")
            self.inp_search.setEnabled(False)
            self.btn_toggle_filters.setEnabled(False)
        else:
            self.main_stack.setCurrentIndex(1)

        footer = QFrame()
        footer.setObjectName("DialogFooter")
        bottom_layout = QHBoxLayout(footer)
        bottom_layout.setContentsMargins(12, 10, 12, 10)
        
        self.btn_cancel = QPushButton("Cancel")
        self.btn_cancel.setObjectName("SecondaryButton")
        self.btn_cancel.setFixedWidth(100)
        self.btn_cancel.clicked.connect(self.reject)
        
        self.btn_download = QPushButton("Download selected")
        self.btn_download.setObjectName("SuccessButton")
        self.btn_download.clicked.connect(self.accept)

        footer_note = QLabel("Selections are kept when you return to this task.")
        footer_note.setObjectName("MutedText")
        bottom_layout.addWidget(footer_note)
        bottom_layout.addStretch()
        bottom_layout.addWidget(self.btn_cancel)
        bottom_layout.addWidget(self.btn_download)

        layout.addWidget(footer)
        self.inp_search.setFocus()

    def build_tab(self, tab_key):
        tab_widget = QWidget()
        layout = QVBoxLayout(tab_widget)
        layout.setContentsMargins(0, 0, 0, 0) # Tabs should handle their own internal margins
        layout.setSpacing(0)
        
        # Tools bar
        tools = QWidget()
        tools.setFixedHeight(50)
        t_layout = QHBoxLayout(tools)
        t_layout.setContentsMargins(16, 0, 16, 0)
        
        btn_all = QPushButton("Select all")
        btn_all.setObjectName("SecondaryButton")
        btn_visible = QPushButton("Select visible")
        btn_visible.setObjectName("SecondaryButton")
        btn_none = QPushButton("Clear all")
        btn_none.setObjectName("SecondaryButton")
        
        btn_all.clicked.connect(lambda: self.set_all_rows(tab_key, True))
        btn_visible.clicked.connect(lambda: self.set_rows_visible(tab_key, True))
        btn_none.clicked.connect(lambda: self.set_all_rows(tab_key, False))
        
        t_layout.addWidget(btn_all)
        t_layout.addWidget(btn_visible)
        t_layout.addWidget(btn_none)
        t_layout.addStretch()
        layout.addWidget(tools)

        # Scrollable list
        scroll = QScrollArea()
        scroll.setWidgetResizable(True)
        scroll.setFrameShape(QFrame.NoFrame)
        
        list_container = QWidget()
        list_layout = QVBoxLayout(list_container)
        list_layout.setContentsMargins(16, 16, 16, 16) # Add padding so cards don't touch edges
        list_layout.setSpacing(10) # 10px spacing between cards
        list_layout.setAlignment(Qt.AlignTop)
        
        self.rows[tab_key] = []
        messages = self.messages.get(tab_key, [])
        for msg in messages:
            row = SelectableMediaRow(msg)
            if msg.id in self.previous_selected_ids:
                row.setChecked(True)
            row.stateChanged.connect(self.update_selected_count)
            self.rows[tab_key].append(row)
            list_layout.addWidget(row)
        
        self.update_selected_count()

        scroll.setWidget(list_container)
        layout.addWidget(scroll)
        
        return tab_widget

    def set_all_rows(self, tab_key, state):
        for row in self.rows.get(tab_key, []):
            row.setChecked(state)

    def set_rows_visible(self, tab_key, state):
        for row in self.rows.get(tab_key, []):
            if row.isVisible():
                row.setChecked(state)

    def toggle_filters_area(self, checked):
        self.filters_area.setVisible(checked)
        # We allow it to size dynamically without forcing a rigid pixel boundary which helps on 768p
        self.adjustSize()

    def reset_filters(self):
        self.inp_search.clear()
        self.inp_regex.clear()
        self.size_min.clear()
        self.size_max.clear()
        self.date_start.setDate(QDate.currentDate().addYears(-10))
        self.date_end.setDate(QDate.currentDate())
        self.btn_toggle_filters.setChecked(False)
        self.filters_area.setVisible(False)
        self.filter_rows()

    def filter_rows(self, _=None):
        search_text = self.inp_search.text().lower().strip()
        regex_text = self.inp_regex.text().strip()
        
        # Date limits
        start_date = self.date_start.date().toPython()
        end_date = self.date_end.date().toPython()
        
        # Size limits (Convert MB to Bytes)
        try:
            min_bytes = float(self.size_min.text()) * 1024 * 1024 if self.size_min.text() else 0
        except ValueError: min_bytes = 0
        try:
            max_bytes = float(self.size_max.text()) * 1024 * 1024 if self.size_max.text() else float('inf')
        except ValueError: max_bytes = float('inf')

        regex = None
        if regex_text:
            regex = QRegularExpression(regex_text, QRegularExpression.CaseInsensitiveOption)

        for tab_rows in self.rows.values():
            for row in tab_rows:
                msg = row.msg
                visible = True
                
                # 1. Quick Search Name
                title = row.lbl_title.text().lower()
                if search_text and search_text not in title:
                    visible = False
                    
                # 2. Regex
                if visible and regex:
                    match = regex.match(row.lbl_title.text())
                    if not match.hasMatch():
                        visible = False
                        
                # 3. Date Range
                if visible:
                    m_date = None
                    raw_date = getattr(msg, 'date', None)
                    if isinstance(raw_date, str) and len(raw_date) >= 10:
                        try:
                            from datetime import datetime
                            m_date = datetime.strptime(raw_date[:10], "%Y-%m-%d").date()
                        except: pass
                    elif raw_date:
                        try: m_date = raw_date.date()
                        except: pass
                        
                    if m_date:
                        if m_date < start_date or m_date > end_date:
                            visible = False
                            
                # 4. Size Range
                if visible:
                    m_size = 0
                    if getattr(msg, 'file', None):
                        m_size = msg.file.size
                    elif getattr(msg, 'document', None):
                        m_size = msg.document.size
                    elif getattr(msg, 'photo', None):
                        try: m_size = msg.photo.sizes[-1].size
                        except: m_size = 0
                        
                    if m_size < min_bytes or m_size > max_bytes:
                        visible = False
                            
                row.setVisible(visible)

    def update_selected_count(self):
        count = 0
        self.selected_messages.clear()
        
        for tab_rows in self.rows.values():
            for row in tab_rows:
                if row.isChecked():
                    count += 1
                    self.selected_messages.append(row.msg)
                    
        self.lbl_selected_count.setText(f"{count} files selected")

        # Visual feedback: Turn text green if > 0
        if count > 0:
            self.lbl_selected_count.setStyleSheet("color: #4CAF50; font-weight: bold;")
        else:
            self.lbl_selected_count.setStyleSheet("")

    def get_selected_messages(self):
        return self.selected_messages

    def is_bulk_mode(self):
        return self.main_stack.currentIndex() == 0

    def get_bulk_selections(self):
        selected_media_ids = []
        if hasattr(self, 'bulk_checkboxes'):
            for media_id, cb in self.bulk_checkboxes.items():
                if cb.isChecked():
                    selected_media_ids.append(media_id)
        return selected_media_ids

    def refresh_content(self, messages_dict):
        """Refreshes the message list while attempting to preserve selection state."""
        # 1. Save current selected IDs
        current_selected = [m.id for m in self.get_selected_messages()]
        if self.previous_selected_ids:
            current_selected.extend(self.previous_selected_ids)
        self.previous_selected_ids = list(set(current_selected))
        
        # 2. Update messages
        self.messages = messages_dict
        
        # 3. Clear existing tabs
        self.tabs.clear()
        self.rows = {}
        
        # 4. Rebuild everything (this is simpler than merging)
        self.tab_all   = self.build_tab("all")
        self.tab_media = self.build_tab("media")
        self.tab_files = self.build_tab("files")
        self.tab_music = self.build_tab("music")
        self.tab_zips  = self.build_tab("zips")
        self.tab_voice = self.build_tab("voice")
        self.tab_links = self.build_tab("links")
        self.tab_gifs  = self.build_tab("gifs")
        self.tab_chat  = self.build_tab("chat")

        self.tabs.addTab(self.tab_all,   f"All ({len(self.messages.get('all', []))})")
        self.tabs.addTab(self.tab_media, f"Media ({len(self.messages.get('media', []))})")
        self.tabs.addTab(self.tab_files, f"Files ({len(self.messages.get('files', []))})")
        self.tabs.addTab(self.tab_music, f"Music ({len(self.messages.get('music', []))})")
        self.tabs.addTab(self.tab_zips,  f"Archives ({len(self.messages.get('zips', []))})")
        self.tabs.addTab(self.tab_voice, f"Voice ({len(self.messages.get('voice', []))})")
        self.tabs.addTab(self.tab_links, f"Links ({len(self.messages.get('links', []))})")
        self.tabs.addTab(self.tab_gifs,  f"GIFs ({len(self.messages.get('gifs', []))})")
        self.tabs.addTab(self.tab_chat,  f"Chat ({len(self.messages.get('chat', []))})")
        
        self.update_selected_count()
        self.main_stack.setCurrentIndex(1)
        self.inp_search.setEnabled(True)
        self.btn_toggle_filters.setEnabled(True)
        self.btn_load_specific.setText("Refresh specific files")
        self.btn_load_specific.setEnabled(True)
