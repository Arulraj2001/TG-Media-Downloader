import os
from PySide6.QtWidgets import (
    QMainWindow, QWidget, QVBoxLayout, QHBoxLayout, 
    QStackedWidget, QListWidget, QListWidgetItem,
    QLabel, QPushButton, QLineEdit, QScrollArea, QFrame,
    QMessageBox, QToolButton, QSizePolicy, QSystemTrayIcon, QMenu, QStatusBar,
    QGridLayout, QDialog
)
from PySide6.QtCore import Qt, QSize, QUrl, QTimer
from PySide6.QtGui import QIcon, QPixmap, QDesktopServices
from ui.components.download_card import DownloadCard
from ui.components.media_browser import MediaBrowserDialog
from ui.components import auth_dialogs
from ui.views.settings_view import SettingsView
from ui.views.downloads_view import DownloadsView
from ui.views.login_view import LoginView
from PySide6.QtGui import QCloseEvent, QAction
from resource_utils import get_resource_path
from utils.update_checker import UpdateChecker

class MainWindow(QMainWindow):
    def __init__(self, telegram_worker, version="unknown"):
        super().__init__()
        print("DEBUG: MainWindow __init__ started")
        self.worker = telegram_worker
        self.version = version
        self.setWindowTitle(f"TG Media Downloader {version}")
        self.resize(1100, 700)
        self.setMinimumSize(750, 500)
        self._is_authenticating = False
        self._tasks_loaded = False
        self._reselect_task_id = None # Current task being re-selected
        self._active_media_browser = None # Current open browser dialog
        self._pending_channel_input = None # Channel input while waiting for topic fetch
        self._pending_topic_id = None # Selected topic ID to pass to media fetch

        print("DEBUG: Setting up UI")
        self.setup_ui()
        print("DEBUG: Connecting signals")
        self.connect_signals()
        print("DEBUG: Setting up tray")
        self.setup_tray()
        self._session_downloaded = 0
        self._last_speed_check = 0
        print("DEBUG: Checking for updates")
        self.check_for_updates()
        print("DEBUG: MainWindow __init__ DONE")

    def check_for_updates(self):
        self.update_checker = UpdateChecker(self.version, self)
        self.update_checker.update_available.connect(self.show_update_notification)
        self.update_checker.start()

    def show_update_notification(self, latest_version, download_url):
        # We'll just show a tray message and update the About button text maybe?
        self.tray_icon.showMessage(
            "New Update Available!",
            f"Version {latest_version} is now available on GitHub.\nClick here to download.",
            QSystemTrayIcon.Information,
            5000
        )
        self.tray_icon.messageClicked.connect(lambda: QDesktopServices.openUrl(QUrl(download_url)))

        # Also update the About item to have an exclamation
        self.btn_about.setText("About")
        self.btn_about.setToolTip(f"A new version ({latest_version}) is available!")

    def show_about_dialog(self):
        dialog = QDialog(self)
        dialog.setObjectName("AboutDialog")
        dialog.setWindowTitle("About TG Media Downloader")
        dialog.setMinimumSize(620, 500)

        layout = QVBoxLayout(dialog)
        layout.setContentsMargins(28, 26, 28, 24)
        layout.setSpacing(16)

        header = QFrame()
        header.setObjectName("AboutHero")
        header_layout = QHBoxLayout(header)
        header_layout.setContentsMargins(22, 20, 22, 20)
        header_layout.setSpacing(16)

        logo = QLabel()
        logo_path = get_resource_path(os.path.join("assets", "logo.png"))
        if os.path.exists(logo_path):
            logo.setPixmap(
                QPixmap(logo_path).scaled(
                    68, 68, Qt.KeepAspectRatio, Qt.SmoothTransformation
                )
            )
        header_layout.addWidget(logo)

        title_stack = QVBoxLayout()
        title_stack.setSpacing(3)
        eyebrow = QLabel("LOCAL TELEGRAM MEDIA TOOL")
        eyebrow.setObjectName("Eyebrow")
        title = QLabel("TG Media Downloader")
        title.setObjectName("AboutTitle")
        copy = QLabel("Find, choose, and download media with live progress.")
        copy.setObjectName("MutedText")
        title_stack.addWidget(eyebrow)
        title_stack.addWidget(title)
        title_stack.addWidget(copy)
        header_layout.addLayout(title_stack, stretch=1)

        version = QLabel(f"VERSION {self.version}")
        version.setObjectName("SecureBadge")
        header_layout.addWidget(version, 0, Qt.AlignTop)
        layout.addWidget(header)

        features = QGridLayout()
        features.setSpacing(10)
        feature_specs = (
            ("01", "Choose exact files", "Browse by type, date, name, and size."),
            ("02", "Watch live progress", "See queue speed and each file move."),
            ("03", "Continue later", "Saved tasks can resume after reopening."),
            ("04", "Keep control local", "Your Telegram session stays on this computer."),
        )
        for index, (number, label, detail) in enumerate(feature_specs):
            card = QFrame()
            card.setObjectName("AboutFeature")
            card_layout = QVBoxLayout(card)
            card_layout.setContentsMargins(14, 13, 14, 13)
            card_layout.setSpacing(4)
            number_label = QLabel(number)
            number_label.setObjectName("Eyebrow")
            title_label = QLabel(label)
            title_label.setObjectName("OptionTitle")
            detail_label = QLabel(detail)
            detail_label.setObjectName("MutedText")
            detail_label.setWordWrap(True)
            card_layout.addWidget(number_label)
            card_layout.addWidget(title_label)
            card_layout.addWidget(detail_label)
            features.addWidget(card, index // 2, index % 2)
        layout.addLayout(features)

        project_note = QLabel(
            "Open the source code, report an issue, or support continued development."
        )
        project_note.setObjectName("DescriptionText")
        project_note.setWordWrap(True)
        layout.addWidget(project_note)

        actions = QHBoxLayout()
        github_button = QPushButton("Open GitHub")
        github_button.setObjectName("SecondaryButton")
        support_button = QPushButton("Buy me a coffee")
        support_button.setObjectName("PrimaryButton")
        close_button = QPushButton("Close")
        close_button.setObjectName("LinkButton")
        github_button.clicked.connect(
            lambda: QDesktopServices.openUrl(
                QUrl("https://github.com/Arulraj2001/TG-Downloader-")
            )
        )
        support_button.clicked.connect(
            lambda: QDesktopServices.openUrl(
                QUrl("https://buymeacoffee.com/x4kqsd0lka")
            )
        )
        close_button.clicked.connect(dialog.accept)
        actions.addWidget(github_button)
        actions.addWidget(support_button)
        actions.addStretch()
        actions.addWidget(close_button)
        layout.addLayout(actions)

        license_label = QLabel("MIT License  /  Arulraj2001")
        license_label.setObjectName("DialogStatus")
        layout.addWidget(license_label)
        dialog.exec()

    def setup_tray(self):
        self.tray_icon = QSystemTrayIcon(self)
        
        icon_path = get_resource_path(os.path.join("assets", "logo.ico"))
        if os.path.exists(icon_path):
            self.tray_icon.setIcon(QIcon(icon_path))
        
        # Tray Menu
        tray_menu = QMenu(self)
        action_show = tray_menu.addAction("Restore window")
        action_show.triggered.connect(self.showNormal)
        action_show.triggered.connect(self.activateWindow)
        
        tray_menu.addSeparator()
        action_pause = tray_menu.addAction("Pause all")
        action_pause.triggered.connect(self.pause_all_downloads)
        action_resume = tray_menu.addAction("Resume all")
        action_resume.triggered.connect(self.resume_all_downloads)

        tray_menu.addSeparator()
        action_quit = tray_menu.addAction("Quit app")
        action_quit.triggered.connect(self.force_quit)
        
        self.tray_icon.setContextMenu(tray_menu)
        self.tray_icon.activated.connect(self.on_tray_activated)
        self.tray_icon.show()

    def on_tray_activated(self, reason):
        if reason == QSystemTrayIcon.DoubleClick:
            self.showNormal()
            self.activateWindow()

    def changeEvent(self, event):
        if event.type() == event.Type.WindowStateChange:
            if self.isMinimized():
                # Minimize to tray logic
                self.hide()
                self.tray_icon.showMessage(
                    "TG Media Downloader",
                    "Application minimized to tray. Double-click icon to restore.",
                    QSystemTrayIcon.Information,
                    2000
                )
        super().changeEvent(event)

    def force_quit(self):
        self.tray_icon.hide()
        self.close()

    def closeEvent(self, event: QCloseEvent):
        # 🟢 Optional: Warn if tasks are active
        if self.card_widgets:
            reply = QMessageBox.question(self, "Exit", "Downloads are still in progress. Are you sure you want to exit?", QMessageBox.Yes | QMessageBox.No)
            if reply == QMessageBox.No:
                event.ignore()
                return

        # 🟢 Clean up Update Checker
        if hasattr(self, 'update_checker') and self.update_checker.isRunning():
            self.update_checker.wait(500)
            if self.update_checker.isRunning():
                self.update_checker.terminate()
            
        if self.worker:
            self.worker.stop()
            if not self.worker.wait(2000):
                pass 
                
        event.accept()

    def setup_ui(self):
        main_widget = QWidget()
        main_widget.setObjectName("CentralWidget")
        self.setCentralWidget(main_widget)
        main_layout = QVBoxLayout(main_widget)
        main_layout.setContentsMargins(0, 0, 0, 0)
        main_layout.setSpacing(0)

        # ---------------------------------------------------------
        # Floating top navigation
        # ---------------------------------------------------------
        nav_host = QWidget()
        nav_host.setObjectName("FloatingNavHost")
        nav_host_layout = QVBoxLayout(nav_host)
        nav_host_layout.setContentsMargins(24, 14, 24, 6)
        nav_host_layout.setSpacing(0)

        self.sidebarWidget = QWidget()
        self.sidebarWidget.setObjectName("FloatingNav")
        self.sidebarWidget.setFixedHeight(60)
        
        sidebar_layout = QHBoxLayout(self.sidebarWidget)
        sidebar_layout.setContentsMargins(12, 8, 12, 8)
        sidebar_layout.setSpacing(4)

        # Brand
        self.logo_container = QWidget()
        self.logo_container.setObjectName("BrandBlock")
        logo_layout = QHBoxLayout(self.logo_container)
        logo_layout.setContentsMargins(2, 0, 12, 0)
        logo_layout.setSpacing(8)

        self.lbl_logo_img = QLabel()
        self.lbl_logo_img.setObjectName("BrandLogo")
        self.lbl_logo_img.setAlignment(Qt.AlignCenter)
        brand_logo_path = get_resource_path(os.path.join("assets", "logo.png"))
        if os.path.exists(brand_logo_path):
            self.lbl_logo_img.setPixmap(
                QPixmap(brand_logo_path).scaled(
                    36, 36, Qt.KeepAspectRatio, Qt.SmoothTransformation
                )
            )
        logo_layout.addWidget(self.lbl_logo_img)
        brand_text = QVBoxLayout()
        brand_text.setSpacing(0)
        brand_name = QLabel("TG MEDIA DOWNLOADER")
        brand_name.setObjectName("BrandName")
        brand_text.addWidget(brand_name)
        logo_layout.addLayout(brand_text)
        sidebar_layout.addWidget(self.logo_container)

        # Page navigation
        self.btn_home = self._create_nav_button("Home", "nav-home.svg", True)
        self.btn_queue = self._create_nav_button("Queue", "nav-download.svg")
        self.btn_settings = self._create_nav_button("Settings", "nav-settings.svg")
        self.btn_about = self._create_nav_button("About", "nav-info.svg")

        self.btn_home.clicked.connect(lambda: self.switch_page("Home", 0))
        self.btn_queue.clicked.connect(lambda: self.switch_page("Queue", 1))
        self.btn_settings.clicked.connect(lambda: self.switch_page("Settings", 2))
        self.btn_about.clicked.connect(lambda: self.switch_page("About", -1))

        sidebar_layout.addWidget(self.btn_home)
        sidebar_layout.addWidget(self.btn_queue)
        sidebar_layout.addWidget(self.btn_settings)
        sidebar_layout.addStretch()
        sidebar_layout.addWidget(self.btn_about)

        # Theme and account actions
        self.btn_theme = self._create_nav_button("Theme", "nav-sun.svg")
        self.btn_theme.setAutoExclusive(False) # Theme toggle isn't part of nav group
        self.btn_theme.setCheckable(False)
        self.btn_theme.clicked.connect(self.toggle_theme)
        self.update_theme_icon() # Set initial icon
        sidebar_layout.addWidget(self.btn_theme)

        self.btn_logout = self._create_nav_button("Logout", "nav-logout.svg")
        self.btn_logout.setObjectName("LogoutBtn")
        self.btn_logout.setAutoExclusive(False)
        self.btn_logout.setCheckable(False)
        self.btn_logout.clicked.connect(self.logout)
        sidebar_layout.addWidget(self.btn_logout)
        nav_host_layout.addWidget(self.sidebarWidget)
        main_layout.addWidget(nav_host)
        
        # Window Icon
        icon_path = get_resource_path(os.path.join("assets", "logo.ico"))
        if os.path.exists(icon_path):
            self.setWindowIcon(QIcon(icon_path))

        # ---------------------------------------------------------
        # Main Content Layout
        # ---------------------------------------------------------
        content_wrapper = QWidget()
        content_layout = QVBoxLayout(content_wrapper)
        content_layout.setContentsMargins(0, 0, 0, 0)
        content_layout.setSpacing(0)

        # Top Header Area
        self.header = QFrame()
        self.header.setObjectName("TopBar")
        self.header.setFixedHeight(76)
        h_layout = QHBoxLayout(self.header)
        h_layout.setContentsMargins(36, 16, 36, 12)

        header_stack = QVBoxLayout()
        header_stack.setSpacing(1)
        self.lbl_page_title = QLabel("Downloads")
        self.lbl_page_title.setObjectName("MainHeader")
        self.lbl_page_subtitle = QLabel("Find and download Telegram media")
        self.lbl_page_subtitle.setObjectName("MutedText")
        header_stack.addWidget(self.lbl_page_title)
        header_stack.addWidget(self.lbl_page_subtitle)
        h_layout.addLayout(header_stack)
        h_layout.addStretch()
        support_button = QPushButton("Buy me a coffee")
        support_button.setObjectName("SupportButton")
        support_button.setCursor(Qt.PointingHandCursor)
        support_button.clicked.connect(
            lambda: QDesktopServices.openUrl(
                QUrl("https://buymeacoffee.com/x4kqsd0lka")
            )
        )
        h_layout.addWidget(support_button)
        secure_badge = QLabel("LOCAL SESSION")
        secure_badge.setObjectName("SecureBadge")
        h_layout.addWidget(secure_badge)

        content_layout.addWidget(self.header)

        # Stacked Pages
        self.stacked_widget = QStackedWidget()
        self.setup_home_page()
        
        self.page_queue = DownloadsView()
        self.page_settings = SettingsView()
        self.page_login = LoginView()
        
        self.stacked_widget.addWidget(self.page_home)   # Index 0
        self.stacked_widget.addWidget(self.page_queue)  # Index 1
        self.stacked_widget.addWidget(self.page_settings) # Index 2
        self.stacked_widget.addWidget(self.page_login)  # Index 3
        
        # Connect Login signals
        self.page_login.login_started.connect(self.worker.start_login)
        self.page_login.code_submitted.connect(self.worker.submit_code)
        self.page_login.password_submitted.connect(self.worker.submit_password)
        
        # Connect Queue Global Buttons
        self.page_queue.btn_pause_all.clicked.connect(self.pause_all_downloads)
        self.page_queue.btn_resume_all.clicked.connect(self.resume_all_downloads)
        self.page_queue.reFetchRequested.connect(self.re_fetch_from_history)
        
        content_layout.addWidget(self.stacked_widget)

        # Build Main View
        main_layout.addWidget(content_wrapper)
        
        # 🟢 Global Status Bar (Refined for right alignment and styling)
        self.status_bar = QStatusBar()
        self.status_bar.setObjectName("GlobalStatusBar")
        self.setStatusBar(self.status_bar)
        
        self.lbl_status_msg = QLabel("Ready")
        self.status_bar.addPermanentWidget(self.lbl_status_msg)

    def _create_nav_button(self, text, icon_name=None, is_checked=False):
        btn = QToolButton()
        btn.setText(text)
        if icon_name:
            icon_path = get_resource_path(os.path.join("assets", "icons", icon_name))
            if os.path.exists(icon_path):
                btn.setIcon(QIcon(icon_path))
        btn.setIconSize(QSize(20, 20))
        btn.setCheckable(True)
        btn.setAutoExclusive(True)
        btn.setChecked(is_checked)
        btn.setCursor(Qt.PointingHandCursor)
        btn.setToolButtonStyle(Qt.ToolButtonTextBesideIcon)
        btn.setSizePolicy(QSizePolicy.Preferred, QSizePolicy.Fixed)
        if len(text) >= 8:
            btn.setFixedWidth(96)
        elif len(text) >= 6:
            btn.setFixedWidth(84)
        else:
            btn.setFixedWidth(76)
        return btn

    def setup_home_page(self):
        self.page_home = QScrollArea()
        self.page_home.setWidgetResizable(True)
        self.page_home.setFrameShape(QFrame.NoFrame)
        self.page_home.setHorizontalScrollBarPolicy(Qt.ScrollBarAlwaysOff)
        home_content = QWidget()
        home_content.setObjectName("HomeContent")
        layout = QVBoxLayout(home_content)
        layout.setContentsMargins(36, 16, 36, 36)
        layout.setSpacing(18)

        hero = QFrame()
        hero.setObjectName("HeroCard")
        hero_layout = QHBoxLayout(hero)
        hero_layout.setContentsMargins(30, 28, 30, 28)
        hero_layout.setSpacing(30)

        hero_copy = QVBoxLayout()
        hero_copy.setSpacing(8)
        kicker = QLabel("TELEGRAM MEDIA DOWNLOADER")
        kicker.setObjectName("Eyebrow")
        kicker.setSizePolicy(QSizePolicy.Ignored, QSizePolicy.Preferred)
        hero_title = QLabel("Your downloads, in one place.")
        hero_title.setObjectName("HeroTitle")
        hero_title.setWordWrap(True)
        hero_title.setSizePolicy(QSizePolicy.Ignored, QSizePolicy.Preferred)
        hero_body = QLabel(
            "Find media from a channel or group, choose the files you want, "
            "and follow every download live."
        )
        hero_body.setObjectName("DescriptionText")
        hero_body.setWordWrap(True)
        hero_body.setSizePolicy(QSizePolicy.Ignored, QSizePolicy.Preferred)
        hero_copy.addWidget(kicker)
        hero_copy.addWidget(hero_title)
        hero_copy.addWidget(hero_body)
        hero_copy.addStretch()
        hero_layout.addLayout(hero_copy, stretch=3)

        metrics = QFrame()
        metrics.setObjectName("MetricsPanel")
        metrics.setMinimumWidth(0)
        metrics_layout = QGridLayout(metrics)
        metrics_layout.setContentsMargins(20, 18, 20, 18)
        metrics_layout.setHorizontalSpacing(24)
        metrics_layout.setVerticalSpacing(6)
        metric_specs = [
            ("THROUGHPUT", "home_speed_value", "0 B/s"),
            ("ACTIVE QUEUE", "home_queue_value", "0"),
            ("SESSION DATA", "home_session_value", "0 B"),
        ]
        for column, (label, attr_name, value) in enumerate(metric_specs):
            metric_label = QLabel(label)
            metric_label.setObjectName("MetricLabel")
            metric_label.setSizePolicy(QSizePolicy.Ignored, QSizePolicy.Preferred)
            metric_value = QLabel(value)
            metric_value.setObjectName("MetricValue")
            metric_value.setSizePolicy(QSizePolicy.Ignored, QSizePolicy.Preferred)
            setattr(self, attr_name, metric_value)
            metrics_layout.addWidget(metric_label, 0, column)
            metrics_layout.addWidget(metric_value, 1, column)
        hero_layout.addWidget(metrics, stretch=2)
        layout.addWidget(hero)

        workflow = QFrame()
        workflow.setObjectName("WorkflowStrip")
        workflow_layout = QGridLayout(workflow)
        workflow_layout.setContentsMargins(12, 10, 12, 10)
        workflow_layout.setSpacing(8)
        workflow_steps = (
            ("01", "Enter source", "Paste a channel or group link."),
            ("02", "Choose media", "Pick categories or exact files."),
            ("03", "Track download", "Watch live speed and progress."),
        )
        workflow_positions = ((0, 0, 1, 2), (1, 0, 1, 1), (1, 1, 1, 1))
        for index, (number, title, detail) in enumerate(workflow_steps):
            step = QFrame()
            step.setObjectName("WorkflowStep")
            step_layout = QHBoxLayout(step)
            step_layout.setContentsMargins(12, 10, 12, 10)
            step_layout.setSpacing(10)
            step_number = QLabel(number)
            step_number.setObjectName("SectionIndex")
            step_text = QVBoxLayout()
            step_text.setSpacing(1)
            step_title = QLabel(title)
            step_title.setObjectName("OptionTitle")
            step_title.setSizePolicy(QSizePolicy.Ignored, QSizePolicy.Preferred)
            step_detail = QLabel(detail)
            step_detail.setObjectName("MutedText")
            step_detail.setWordWrap(True)
            step_detail.setSizePolicy(QSizePolicy.Ignored, QSizePolicy.Preferred)
            step_text.addWidget(step_title)
            step_text.addWidget(step_detail)
            step_layout.addWidget(step_number)
            step_layout.addLayout(step_text, stretch=1)
            row, column, row_span, column_span = workflow_positions[index]
            workflow_layout.addWidget(step, row, column, row_span, column_span)
        workflow_layout.setColumnStretch(0, 1)
        workflow_layout.setColumnStretch(1, 1)
        layout.addWidget(workflow)

        search_card = QWidget()
        search_card.setObjectName("SourcePanel")
        sc_layout = QVBoxLayout(search_card)
        sc_layout.setContentsMargins(26, 22, 26, 24)
        sc_layout.setSpacing(10)
        
        lbl_search_title = QLabel("Find media")
        lbl_search_title.setObjectName("SectionHeader")
        lbl_search_desc = QLabel(
            "Enter a channel name, Telegram link, private channel ID, or forum topic link."
        )
        lbl_search_desc.setObjectName("MutedText")
        lbl_search_desc.setWordWrap(True)
        lbl_search_desc.setSizePolicy(QSizePolicy.Ignored, QSizePolicy.Preferred)
        
        search_input_layout = QHBoxLayout()
        self.input_channel = QLineEdit()
        self.input_channel.setPlaceholderText("@channel, https://t.me/channel, or -100...")
        self.input_channel.setMinimumHeight(48)
        self.input_channel.setMinimumWidth(0)
        
        self.btn_fetch = QPushButton("Find media")
        self.btn_fetch.setObjectName("PrimaryButton")
        self.btn_fetch.setMinimumHeight(48)
        self.btn_fetch.clicked.connect(self.on_fetch_clicked)
        
        search_input_layout.addWidget(self.input_channel, stretch=1)
        search_input_layout.addWidget(self.btn_fetch)
        
        lbl_hint = QLabel(
            "Your Telegram account must already have access to private groups."
        )
        lbl_hint.setObjectName("MutedText")
        lbl_hint.setWordWrap(True)
        lbl_hint.setSizePolicy(QSizePolicy.Ignored, QSizePolicy.Preferred)
        
        sc_layout.addWidget(lbl_search_title)
        sc_layout.addWidget(lbl_search_desc)
        sc_layout.addLayout(search_input_layout)
        sc_layout.addWidget(lbl_hint)

        layout.addWidget(search_card)

        layout.addStretch()
        self.page_home.setWidget(home_content)
        
        self.card_widgets = {} # task_id -> DownloadCard

    def on_sidebar_changed(self, current_btn):
        # This was for QListWidget, we can keep it empty or remove it.
        # Buttons now use connected switch_page calls directly.
        pass

    def switch_page(self, item_text, index):
        # Update button states visually if needed (AutoExclusive handles checking)
        if "Home" in item_text:
            self.header.show()
            self.lbl_page_title.setText("Downloads")
            self.lbl_page_subtitle.setText("Find and download Telegram media")
            self.stacked_widget.setCurrentIndex(0)
            self.btn_home.setChecked(True)
        elif "Queue" in item_text:
            self.header.show()
            self.lbl_page_title.setText("Download queue")
            self.lbl_page_subtitle.setText("Live speed and file progress")
            self.stacked_widget.setCurrentIndex(1)
            self.btn_queue.setChecked(True)
        elif "Settings" in item_text:
            self.header.show()
            self.lbl_page_title.setText("Settings")
            self.lbl_page_subtitle.setText("Folders, network, and download limits")
            self.stacked_widget.setCurrentIndex(2)
            self.btn_settings.setChecked(True)
        elif "About" in item_text:
            self.show_about_dialog()
            # Restore previous check state
            curr = self.stacked_widget.currentIndex()
            if curr == 0: self.btn_home.setChecked(True)
            elif curr == 1: self.btn_queue.setChecked(True)
            elif curr == 2: self.btn_settings.setChecked(True)
        else:
            self.header.hide()

    def toggle_theme(self):
        # 🛡️ Optimization: Block signals to avoid massive redraw cascades while QSS is applying
        self.setUpdatesEnabled(False)
        try:
            import ui.app as main_app
            from ui.views.settings_view import load_config
            cfg = load_config()
            is_dark = not cfg.get("dark_mode", False)
            main_app.apply_theme(is_dark)
            self.update_theme_icon()
        finally:
            self.setUpdatesEnabled(True)
            self.repaint() # Force a clean refresh at the end

    def update_theme_icon(self):
        from ui.views.settings_view import load_config
        cfg = load_config()
        is_dark = cfg.get("dark_mode", False)
        icon_name = "nav-moon.svg" if is_dark else "nav-sun.svg"
        icon_path = get_resource_path(os.path.join("assets", "icons", icon_name))
        if os.path.exists(icon_path):
            self.btn_theme.setIcon(QIcon(icon_path))
            self.btn_theme.setText("Dark" if is_dark else "Light")

    # ---------------------------------------------------------
    # Actions & Signals
    # ---------------------------------------------------------
    def connect_signals(self):
        self.worker.signals.auth_needed.connect(self.prompt_login)
        self.worker.signals.code_needed.connect(self.prompt_code)
        self.worker.signals.password_needed.connect(self.prompt_password)
        self.worker.signals.auth_success.connect(self.on_auth_success)
        self.worker.signals.auth_error.connect(self.show_auth_error)
        
        self.worker.signals.media_list_fetched.connect(self.show_media_browser)
        self.worker.signals.forum_topics_fetched.connect(self.on_forum_topics_fetched)
        self.worker.signals.channel_fetched.connect(self.add_download_card)
        self.worker.signals.download_progress.connect(self.update_progress)
        self.worker.signals.file_progress.connect(self.update_file_progress)
        self.worker.signals.file_completed.connect(self.on_file_completed)
        self.worker.signals.file_failed.connect(self.on_file_failed)
        self.worker.signals.task_incomplete.connect(self.on_task_incomplete)
        self.worker.signals.download_completed.connect(self.on_download_completed)
        self.worker.signals.error_occurred.connect(self.on_fetch_error)
        
        self.page_settings.logoutRequested.connect(self.logout)
        # sidebar signals are now handled by button connects

    def on_download_completed(self, task_id, folder_name):
        if task_id in self.card_widgets:
            card = self.card_widgets[task_id]
            title = card.lbl_title.text()
            self.page_queue.active_layout.removeWidget(card)
            card.deleteLater()
            del self.card_widgets[task_id]
            self.page_queue.add_completed_item(title, folder_name, task_id)
            
            # Tray notification
            self.tray_icon.showMessage(
                "Download completed",
                f"Successfully downloaded: {title}",
                QSystemTrayIcon.Information,
                3000
            )

    def prompt_login(self):
        self._is_authenticating = True
        self.sidebarWidget.hide()
        self.header.hide()
        self.page_login.reset_to_start()
        self.stacked_widget.setCurrentWidget(self.page_login)

    def prompt_code(self, phone):
        self.page_login.show_otp_step()

    def prompt_password(self):
        self.page_login.show_pwd_step()
        
    def show_auth_error(self, err_msg):
        auth_dialogs.show_auth_error(self, err_msg)
        self.page_login.reset_to_start()
            
    def on_auth_success(self):
        if self._is_authenticating:
            self.sidebarWidget.show()
            self.switch_page("Home", 0)
            self._is_authenticating = False
            auth_dialogs.show_auth_success(self)
        self.load_active_tasks_from_worker()
        
    def load_active_tasks_from_worker(self):
        print("DEBUG: load_active_tasks_from_worker started")
        if self._tasks_loaded:
            print("DEBUG: tasks already loaded, skipping")
            return
        self._tasks_loaded = True
        
        try:
            from core_downloader import load_active_tasks, save_active_tasks
            tasks = load_active_tasks()
            if not isinstance(tasks, list):
                print(f"Warning: active_tasks.json is not a list. Type: {type(tasks)}")
                tasks = []
                
            # Initial deduplication
            seen = set()
            deduped = []
            for t in tasks:
                if not isinstance(t, dict): continue
                key = (str(t.get("channel_input")), t.get("media_id"))
                if key not in seen:
                    seen.add(key)
                    deduped.append(t)
            
            if len(deduped) != len(tasks):
                save_active_tasks(deduped)
                tasks = deduped
            
            # 🟢 Smart Startup Loader
            for i, t in enumerate(tasks):
                if not isinstance(t, dict): continue
                chan = t.get("channel_input")
                media = t.get("media_id", 6)
                print(f"DEBUG: Processing task {i}: {chan}_{media}")
                if not chan: continue
                
                is_paused = bool(t.get("paused", True))
                
                # If it's paused, just show the card (no network)
                if is_paused:
                    # In UI, we don't 'clean' the ID anymore, we use what's in the task
                    # but ensure we handle the -100 prefix consistently.
                    ch_id_full = str(chan)
                    m_id = t.get('media_id', 6)
                    self.add_download_card({
                        "task_id": f"{ch_id_full}_{m_id}",
                        "title": t.get("title") or f"Saved Task: {chan}",
                        "is_paused": True,
                        "download_path": t.get("download_path", "downloads"),
                        "download_limit": t.get("download_limit", 5),
                        "max_speed_kb": t.get("max_speed_kb", 0),
                        "media_type": m_id,
                        "completed": t.get("completed", 0),
                        "folder_name": t.get("folder_name") or t.get("download_path", "downloads")
                    }, t.get("total_items", 0))
                else:
                    # Stagger starts to avoid UI choking
                    def delayed_start(t_data=t):
                        try:
                            self.worker.start_download(
                                channel_input=t_data.get("channel_input"),
                                media_id=t_data.get("media_id", 6),
                                download_path=t_data.get("download_path", "downloads"),
                                download_limit=t_data.get("download_limit", 5),
                                max_speed_kb=t_data.get("max_speed_kb", 0),
                                is_paused=False,
                                selected_message_ids=t_data.get("selected_message_ids", None)
                            )
                        except Exception as e:
                            print(f"Startup task error: {e}")
                            
                    QTimer.singleShot(max(10, i * 500), delayed_start)
                    
        except Exception as startup_err:
            print(f"Critical startup loading error: {startup_err}")
            import traceback
            traceback.print_exc()
        
    def on_fetch_clicked(self):
        channel = self.input_channel.text().strip()
        if not channel: return
        
        # 🟡 Step 1: Reset any pending topic state
        self._pending_channel_input = None
        self._pending_topic_id = None
        
        # 🟢 Step 2: Check if the input already contains a topic ID (e.g., "channel_123").
        # If so, skip the forum topics check and go directly to media browser.
        from core_downloader import parse_channel_input
        _, existing_topic_id = parse_channel_input(channel)
        if existing_topic_id is not None:
            # Input already has a topic ID — skip topic check, go straight to media
            self.btn_fetch.setText("Find media")
            self.btn_fetch.setEnabled(True)
            self.show_media_browser(channel, None, None)
            return
        
        # 🟢 Step 3: Update UI to show we're working
        self.btn_fetch.setText("Checking...")
        self.btn_fetch.setEnabled(False)
        
        # 🟡 Step 4: Check if this is a forum group by fetching topics.
        # This ensures topic filtering works even when cached data exists.
        self._pending_channel_input = channel
        self.worker.fetch_forum_topics(channel)

    def on_forum_topics_fetched(self, channel_input, channel_obj, topics):
        """Callback when forum topics (or confirmation it's not a forum) are fetched."""
        try:
            # If the dialog was already shown via cache, channel_obj might be None
            title = channel_input
            if channel_obj:
                title = getattr(channel_obj, 'title', None)
                if not title:
                    first = getattr(channel_obj, 'first_name', '') or ''
                    last = getattr(channel_obj, 'last_name', '') or ''
                    title = f"{first} {last}".strip()
                if not title:
                    title = getattr(channel_obj, 'username', None)
                if not title:
                    title = getattr(channel_obj, 'id', str(channel_input))
                title = str(title)
            
            # 🟢 Check if this is a forum with topics
            if topics and len(topics) > 0:
                # Show topic picker dialog
                from ui.views.settings_view import load_config
                cfg = load_config()
                is_dark = cfg.get("dark_mode", False)
                
                # Create a non-blocking topic dialog
                from ui.components.topic_picker import TopicPickerDialog
                topic_dialog = TopicPickerDialog(title, topics, self, is_dark=is_dark)
                
                # Store channel_input so we can use it after dialog closes
                self._pending_channel_input = channel_input
                
                if topic_dialog.exec():
                    selected_topic_id = topic_dialog.get_selected_topic_id()
                    self._pending_topic_id = selected_topic_id
                    
                    # If a topic was selected, append it to the channel input
                    # so the downstream fetch uses it
                    if selected_topic_id is not None:
                        topic_channel_input = f"{channel_input}_{selected_topic_id}"
                        self.input_channel.setText(topic_channel_input)
                        # Use the topic-appended input for the media browser so
                        # the topic_id flows through to the download call
                        self.show_media_browser(topic_channel_input, channel_obj, None)
                    else:
                        self.input_channel.setText(channel_input)
                        # No topic filter, use original input
                        self.show_media_browser(channel_input, channel_obj, None)
                else:
                    # User cancelled topic selection
                    self.btn_fetch.setText("Find media")
                    self.btn_fetch.setEnabled(True)
                    self._pending_channel_input = None
                    self._pending_topic_id = None
            else:
                # Not a forum (no topics), proceed directly to media browser
                # Use the original pending input if we have it, otherwise use the input
                ch_input = self._pending_channel_input or channel_input
                
                # Restore the input field with the original channel input
                self.input_channel.setText(ch_input)
                
                # Proceed to show the media browser without topic filtering
                self.show_media_browser(ch_input, channel_obj, None)
        except Exception as e:
            print(f"Error in on_forum_topics_fetched: {e}")
            # Fallback: proceed without topic filtering
            self.btn_fetch.setText("Find media")
            self.btn_fetch.setEnabled(True)
            self.show_media_browser(channel_input, channel_obj, None)

    def show_media_browser(self, channel_input, channel_obj, messages_dict):
        # 🔄 Update existing dialog if it's already open (Instant Loading Flow)
        if self._active_media_browser and self._active_media_browser.isVisible():
            self._active_media_browser.refresh_content(messages_dict)
            return

        # 🔄 Selection Persistence Reset
        if self._reselect_task_id and self._reselect_task_id in self.card_widgets:
            self.card_widgets[self._reselect_task_id].set_reselect_loading(False)
            
        self.btn_fetch.setText("Find media")
        self.btn_fetch.setEnabled(True)
        self.input_channel.clear()
        
        # If we came from cache, channel_obj might be None
        if not channel_obj:
            title = str(channel_input)
        else:
            title = getattr(channel_obj, 'title', None)
            if not title:
                first = getattr(channel_obj, 'first_name', '') or ''
                last = getattr(channel_obj, 'last_name', '') or ''
                title = f"{first} {last}".strip()
            if not title:
                title = getattr(channel_obj, 'username', None)
            if not title:
                title = getattr(channel_obj, 'id', str(channel_input))
            title = str(title)
        
        # 🌙 Theme Support
        from ui.views.settings_view import load_config
        cfg = load_config()
        is_dark = cfg.get("dark_mode", False)

        # 🔄 Selection Persistence for Re-select from SQLite
        existing_ids = []
        if self._reselect_task_id:
            from database import get_task_db
            try:
                ch_in, m_id_str = self._reselect_task_id.rsplit('_', 1)
                task_data = get_task_db(ch_in, int(m_id_str))
                if task_data:
                    existing_ids = task_data.get("selected_message_ids", [])
            except: pass
            
        dialog = MediaBrowserDialog(title, messages_dict, self, previous_selected_ids=existing_ids, is_dark=is_dark)
        self._active_media_browser = dialog
        
        dialog.fetch_requested.connect(lambda: self._trigger_specific_fetch(channel_input, dialog))

        # Cached rows make the browser open immediately, but always refresh
        # them from Telegram in the background so new/older content is not
        # silently omitted. A None entity identifies the instant/cache path.
        if channel_obj is None:
            QTimer.singleShot(
                0,
                lambda: self._trigger_specific_fetch(channel_input, dialog)
            )
        
        if dialog.exec():
            if dialog.is_bulk_mode():
                bulk_media_ids = dialog.get_bulk_selections()
                if not bulk_media_ids:
                    self._active_media_browser = None
                    return
                for m_id in bulk_media_ids:
                    self.worker.start_download(
                        channel_input=channel_input, 
                        media_id=m_id, 
                        download_path=cfg.get("download_path", "downloads"), 
                        download_limit=cfg.get("download_limit", 5), 
                        max_speed_kb=cfg.get("max_speed_kb", 0),
                        selected_message_ids=None, # This triggers the unbounded limit=None bulk fetch
                        task_id=None
                    )
            else:
                selected_msgs = dialog.get_selected_messages()
                if not selected_msgs:
                    self._active_media_browser = None
                    return # they selected nothing
                    
                selected_ids = [m.id for m in selected_msgs]
                
                # If re-selecting, we use existing task_id
                target_task_id = self._reselect_task_id
                self._reselect_task_id = None # Clear context
                
                self.worker.start_download(
                    channel_input=channel_input, 
                    media_id=6, # 6 is ALL
                    download_path=cfg.get("download_path", "downloads"), 
                    download_limit=cfg.get("download_limit", 5), 
                    max_speed_kb=cfg.get("max_speed_kb", 0),
                    selected_message_ids=selected_ids,
                    task_id=target_task_id # If this is set, worker will update existing task
                )
        
        self._active_media_browser = None

    def _trigger_specific_fetch(self, channel_input, dialog):
        dialog.btn_load_specific.setText("Fetching... Please wait.")
        dialog.btn_load_specific.setEnabled(False)
        from ui.views.settings_view import load_config
        cfg = load_config()
        fetch_limit = cfg.get("initial_fetch_limit", 2000)
        self.worker.fetch_media_list(channel_input, limit=fetch_limit)

    def on_fetch_error(self, channel, err_msg):
        if self._reselect_task_id and self._reselect_task_id in self.card_widgets:
            self.card_widgets[self._reselect_task_id].set_reselect_loading(False)
            self._reselect_task_id = None
            
        self.btn_fetch.setText("Find media")
        self.btn_fetch.setEnabled(True)
        QMessageBox.critical(
            self,
            "Could not find media",
            f"Media could not be loaded from {channel}:\n{err_msg}"
        )

    def add_download_card(self, data, total_items):
        task_id = data["task_id"]
        
        # 🛡️ SMART LOOKUP: If we can't find by task_id, look for a 'ghost' card that was
        # started by username/input but now has this resolved ID.
        if task_id not in self.card_widgets:
            ch_resolved = str(data.get("channel_input", ""))
            original_in = str(data.get("original_input", ""))
            m_id = data.get("media_id", 6)
            
            for old_id, card in list(self.card_widgets.items()):
                old_chan = old_id.rsplit('_', 1)[0]
                # Match by original user input OR by numeric ID if it was partially resolved
                # We also check for -100 stripped versions to be super safe.
                if (old_chan == original_in or 
                    old_chan == ch_resolved or 
                    old_chan.replace('-100', '', 1) == ch_resolved.replace('-100', '', 1)):
                    
                    print(f"DEBUG: Successfully hijacked ghost card {old_id} -> {task_id}")
                    # Re-map the card in our tracking dict
                    del self.card_widgets[old_id]
                    self.card_widgets[task_id] = card
                    card.task_id = task_id # Update card's own property
                    break

        if task_id in self.card_widgets:
            # Refresh placeholder card with real metadata
            card = self.card_widgets[task_id]
            card.refresh_from_metadata(
                title=data["title"],
                total_items=total_items,
                completed=data.get("completed", 0),
                files_metadata=data.get("files_metadata", []),
                is_paused=data.get("is_paused", card.is_paused) # Maintain local state if not provided
            )
            return
            
        print(f"DEBUG: Creating new card for {task_id}")
        is_paused = data.get("is_paused", False)
        card = DownloadCard(
            task_id=task_id,
            title=data["title"],
            total_items=total_items,
            folder_name=data.get("folder_name", "downloads"),
            media_type=data.get("media_type", 6),
            parent_worker=self.worker,
            completed=data.get("completed", 0),
            is_paused=is_paused,
            download_path=data.get("download_path", "downloads"),
            download_limit=data.get("download_limit", 5),
            max_speed_kb=data.get("max_speed_kb", 0),
            files_metadata=data.get("files_metadata", [])
        )
        self.page_queue.active_layout.addWidget(card)
        self.card_widgets[task_id] = card
        self.page_queue.set_controls_visible(True)
        
        # Connect signals
        card.reselectRequested.connect(self.reselect_task_media)
        card.removeRequested.connect(self.remove_task)
        card.moveUpRequested.connect(self.move_task_up)
        card.moveDownRequested.connect(self.move_task_down)

    def move_card(self, card, direction):
        """direction: -1 (up), 1 (down)"""
        layout = self.page_queue.active_layout
        idx = layout.indexOf(card)
        new_idx = idx + direction
        if 0 <= new_idx < layout.count():
            layout.removeWidget(card)
            layout.insertWidget(new_idx, card)

    def update_progress(self, task_id, current, total):
        if task_id in self.card_widgets:
            self.card_widgets[task_id].update_progress(current, total)
            self.refresh_global_status()

    def update_file_progress(self, task_id, msg_id, current_bytes, total_bytes, speed_str):
        if task_id in self.card_widgets:
            self.card_widgets[task_id].update_file_progress(msg_id, current_bytes, total_bytes, speed_str)
            
            # Update session stats (rough estimate based on speed * interval if we had a timer, 
            # but worker emits current_bytes. We'll use a better approach: track per-file delta)
            # Actually, for session stats, let's just track completed items' total size or use a simpler counter.
            
            self.refresh_global_status()

    def refresh_global_status(self):
        # Global status update
        import humanize
        all_speeds = [c.last_speed_val for c in self.card_widgets.values() if hasattr(c, 'last_speed_val')]
        total_speed = sum(all_speeds)
        speed_text = f"{humanize.naturalsize(total_speed*1024)}/s" if total_speed > 0 else "0 B/s"
        
        # Calculate overall progress
        total_items = sum(c.total_items for c in self.card_widgets.values())
        total_completed = sum(c.completed for c in self.card_widgets.values())
        progress_pct = (total_completed * 100 / total_items) if total_items > 0 else 0
        
        # Session stats
        session_text = f" | Session: {humanize.naturalsize(self._session_downloaded)}" if self._session_downloaded > 0 else ""
        
        status_text = f"LIVE  /  {speed_text}{session_text}  /  {progress_pct:.1f}%  /  {len(self.card_widgets)} tasks"
        self.lbl_status_msg.setText(status_text)
        if hasattr(self, "home_speed_value"):
            self.home_speed_value.setText(speed_text)
            self.home_queue_value.setText(str(len(self.card_widgets)))
            self.home_session_value.setText(
                humanize.naturalsize(self._session_downloaded)
                if self._session_downloaded > 0 else "0 B"
            )
        
        # 🟢 Tray Tooltip
        tray_tip = f"TG Media Downloader - {speed_text}\nProgress: {progress_pct:.1f}% ({total_completed}/{total_items})"
        if len(self.card_widgets) > 1:
            tray_tip += f"\nQueue: {len(self.card_widgets)} active tasks"
        self.tray_icon.setToolTip(tray_tip)

    def on_file_completed(self, task_id, msg_id):
        if task_id in self.card_widgets:
            # Add to session downloaded
            card = self.card_widgets[task_id]
            # Files after the first 100 are not rendered as rows, but they
            # still count toward the live session total.
            for meta in card.files_metadata:
                if meta["id"] == msg_id:
                    self._session_downloaded += meta.get("size", 0)
                    break
            
            self.card_widgets[task_id].mark_file_completed(msg_id)
            self.refresh_global_status()

    def on_file_failed(self, task_id, msg_id, error):
        if task_id in self.card_widgets:
            self.card_widgets[task_id].mark_file_failed(msg_id, error)
            self.refresh_global_status()

    def on_task_incomplete(self, task_id, failed_count):
        if task_id in self.card_widgets:
            self.card_widgets[task_id].set_incomplete(failed_count)
            self.refresh_global_status()

    def remove_task(self, task_id):
        if task_id in self.card_widgets:
            reply = QMessageBox.question(self, "Remove Task", "Are you sure you want to remove this task from the queue?", QMessageBox.Yes | QMessageBox.No)
            if reply == QMessageBox.No:
                return
                
            card = self.card_widgets[task_id]
            # 1. Stop if running
            self.worker.pause_download(task_id)
            # 2. Remove from worker tracking & files
            from core_downloader import load_active_tasks, save_active_tasks
            tasks = load_active_tasks()
            
            # Reconstruct the logic to match the actual task data structure
            new_tasks = []
            for t in tasks:
                tk_chan = str(t.get("channel_input")).replace("-100", "", 1)
                tk_media = t.get("media_id")
                tk_topic = t.get("topic_id")
                # Construct the ID the same way we do in the worker for comparison
                gen_id = f"{tk_chan}_{tk_topic}_{tk_media}" if tk_topic else f"{tk_chan}_{tk_media}"
                # Handle the -100 prefix in task_id parameter too
                clean_tid = str(task_id).replace("-100", "", 1)
                if gen_id != clean_tid:
                    new_tasks.append(t)
            save_active_tasks(new_tasks)
            # 3. Final cleanup from UI
            card.deleteLater()
            del self.card_widgets[task_id]
            
            if not self.card_widgets:
                self.page_queue.set_controls_visible(False)

    def move_task_up(self, task_id):
        if task_id in self.card_widgets:
            card = self.card_widgets[task_id]
            idx = self.page_queue.active_layout.indexOf(card)
            if idx > 0:
                self.page_queue.active_layout.removeWidget(card)
                self.page_queue.active_layout.insertWidget(idx - 1, card)

    def move_task_down(self, task_id):
        if task_id in self.card_widgets:
            card = self.card_widgets[task_id]
            idx = self.page_queue.active_layout.indexOf(card)
            # Count includes the stretch item at the end
            if idx < self.page_queue.active_layout.count() - 2: 
                self.page_queue.active_layout.removeWidget(card)
                self.page_queue.active_layout.insertWidget(idx + 1, card)

    def reselect_task_media(self, task_id):
        # 1. Extract channel name/ID from task_id (format: ID_mediaID)
        try:
            self._reselect_task_id = task_id # Set context for the upcoming browser
            if task_id in self.card_widgets:
                self.card_widgets[task_id].set_reselect_loading(True)
                
            from PySide6.QtWidgets import QApplication
            QApplication.processEvents()
            
            channel_input, media_id_str = task_id.rsplit('_', 1)
            # 2. Trigger a normal fetch for this channel
            self.input_channel.setText(channel_input)
            self.on_fetch_clicked()
        except Exception as e:
            self._reselect_task_id = None
            print(f"Reselect error: {e}")

    def pause_all_downloads(self):
        for task_id, card in self.card_widgets.items():
            if not card.is_paused:
                card.toggle_pause()

    def resume_all_downloads(self):
        for task_id, card in self.card_widgets.items():
            if card.is_paused:
                card.toggle_pause()

    def re_fetch_from_history(self, channel_id):
        self.input_channel.setText(str(channel_id))
        self.switch_page("Home", 0)
        self.on_fetch_clicked()

    def logout(self):
        reply = QMessageBox.question(self, "Logout", "Are you sure you want to log out? This will pause all downloads and clear your session.", QMessageBox.Yes | QMessageBox.No)
        if reply == QMessageBox.Yes:
            self.pause_all_downloads()
            # Clear all current cards from memory/UI
            for task_id in list(self.card_widgets.keys()):
                self.remove_task(task_id)
                
            self.worker.logout()
            
            # Clear persistent queue safely
            try:
                from core_downloader import save_active_tasks
                save_active_tasks([])
            except Exception:
                pass
                
            self.worker.signals.auth_needed.emit()
