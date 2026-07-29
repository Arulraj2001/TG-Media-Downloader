from PySide6.QtWidgets import (
    QWidget, QVBoxLayout, QHBoxLayout, QLabel, 
    QLineEdit, QPushButton, QCheckBox, QComboBox, 
    QFrame, QFileDialog, QSpinBox, QMessageBox,
    QScrollArea, QGridLayout
)
from PySide6.QtCore import Qt, Signal, QSize, QRectF
from PySide6.QtGui import QColor, QPainter
import json
import os
from resource_utils import get_project_root

CONFIG_FILE = os.path.join(get_project_root(), "config.json")


class ToggleSwitch(QCheckBox):
    """Compact switch control used for binary settings."""

    def __init__(self, parent=None):
        super().__init__(parent)
        self.setFixedSize(42, 24)
        self.setCursor(Qt.PointingHandCursor)
        self.setObjectName("ToggleSwitch")

    def sizeHint(self):
        return QSize(42, 24)

    def hitButton(self, position):
        return self.rect().contains(position)

    def paintEvent(self, event):
        painter = QPainter(self)
        painter.setRenderHint(QPainter.Antialiasing)
        painter.setPen(Qt.NoPen)

        if not self.isEnabled():
            track_color = QColor("#D8D8DE")
        elif self.isChecked():
            track_color = QColor("#9562E3")
        elif self.underMouse():
            track_color = QColor("#A7A7B0")
        else:
            track_color = QColor("#BFC0C8")

        painter.setBrush(track_color)
        painter.drawRoundedRect(QRectF(1, 3, 40, 18), 9, 9)

        thumb_x = 23 if self.isChecked() else 3
        painter.setBrush(QColor("#FFFFFF"))
        painter.drawEllipse(QRectF(thumb_x, 4, 16, 16))


def load_config():
    default_config = {
        "download_path": "downloads",
        "download_limit": 8,
        "initial_fetch_limit": 2000,
        "max_speed_kb": 0,
        "forum_auto_separation": False,
        "rename_duplicates": True,
        "use_message_date": True,
        "dark_mode": None,  # None = follow Windows system setting
        "proxy": {
            "enabled": False,
            "type": "SOCKS5",
            "host": "",
            "port": "",
            "user": "",
            "pass": ""
        }
    }
    if os.path.exists(CONFIG_FILE):
        try:
            with open(CONFIG_FILE, "r") as f:
                data = json.load(f)
                default_config.update(data)
        except Exception as e:
            print(f"Error loading config: {e}")
    return default_config

def save_config(config_data):
    try:
        with open(CONFIG_FILE, "w") as f:
            json.dump(config_data, f, indent=4)
    except Exception as e:
        print(f"Error saving config: {e}")

class SettingsView(QWidget):
    logoutRequested = Signal()
    def __init__(self, parent=None):
        super().__init__(parent)
        self.setup_ui()

    def setup_ui(self):
        root_layout = QVBoxLayout(self)
        root_layout.setContentsMargins(0, 0, 0, 0)
        root_layout.setSpacing(0)

        self.scroll_area = QScrollArea()
        self.scroll_area.setWidgetResizable(True)
        self.scroll_area.setFrameShape(QFrame.NoFrame)
        self.scroll_area.setHorizontalScrollBarPolicy(Qt.ScrollBarAlwaysOff)

        self.container = QWidget()
        self.scroll_layout = QVBoxLayout(self.container)
        self.scroll_layout.setContentsMargins(20, 34, 20, 44)
        self.scroll_layout.setSpacing(18)
        self.scroll_layout.setAlignment(Qt.AlignTop | Qt.AlignHCenter)

        header_block = QWidget()
        header_block.setMaximumWidth(860)
        header_layout = QVBoxLayout(header_block)
        header_layout.setContentsMargins(0, 0, 0, 8)
        header_layout.setSpacing(4)
        lbl_header = QLabel("Settings")
        lbl_header.setObjectName("MainHeaderLarge")
        lbl_intro = QLabel("Choose where files are saved and how downloads use your connection.")
        lbl_intro.setObjectName("DescriptionText")
        lbl_intro.setWordWrap(True)
        header_layout.addWidget(lbl_header)
        header_layout.addWidget(lbl_intro)
        self.scroll_layout.addWidget(header_block)

        self.settings_card = QFrame()
        self.settings_card.setObjectName("SettingsPanel")
        self.settings_card.setMaximumWidth(860)
        self.scroll_layout.addWidget(self.settings_card)

        self.clayout = QVBoxLayout(self.settings_card)
        self.clayout.setContentsMargins(0, 0, 0, 0)
        self.clayout.setSpacing(14)

        download_section, download_layout = self._create_settings_section(
            "01", "Downloads", "Folder, file names, and date options"
        )
        self.clayout.addWidget(download_section)

        lbl_path_desc = QLabel("Save files in")
        lbl_path_desc.setObjectName("ControlLabel")
        download_layout.addWidget(lbl_path_desc)

        path_row = QHBoxLayout()
        path_row.setSpacing(8)
        self.input_path = QLineEdit("downloads")
        self.input_path.setPlaceholderText("Choose a download folder")
        self.input_path.setMinimumWidth(0)

        self.btn_browse = QPushButton("Browse")
        self.btn_browse.setObjectName("SecondaryButton")
        self.btn_browse.clicked.connect(self.browse_path)

        self.btn_open = QPushButton("Open folder")
        self.btn_open.setObjectName("SecondaryButton")
        self.btn_open.clicked.connect(self.open_folder)

        path_row.addWidget(self.input_path, stretch=1)
        path_row.addWidget(self.btn_browse)
        path_row.addWidget(self.btn_open)
        download_layout.addLayout(path_row)

        lbl_template_tip = QLabel(
            "Folder variables: {channel}, {username}, {channel_id}, {category}, "
            "{year}, {month}, {day}"
        )
        lbl_template_tip.setObjectName("MutedText")
        lbl_template_tip.setWordWrap(True)
        download_layout.addWidget(lbl_template_tip)

        self.chk_forum_sep = ToggleSwitch()
        self._add_toggle_option(
            download_layout, self.chk_forum_sep, "Separate forum topics",
            "Save each forum topic in its own folder."
        )

        self.chk_rename_duplicates = ToggleSwitch()
        self._add_toggle_option(
            download_layout, self.chk_rename_duplicates, "Keep duplicate files",
            "Add a number to repeated file names instead of replacing a file."
        )

        self.chk_use_msg_date = ToggleSwitch()
        self._add_toggle_option(
            download_layout, self.chk_use_msg_date, "Use the Telegram message date",
            "Set each downloaded file date to the date of its Telegram message."
        )

        network_section, network_layout = self._create_settings_section(
            "02", "Network", "Optional proxy settings"
        )
        self.clayout.addWidget(network_section)

        self.chk_enable_proxy = ToggleSwitch()
        self._add_toggle_option(
            network_layout, self.chk_enable_proxy, "Use a proxy",
            "Send Telegram traffic through the proxy below."
        )

        proxy_panel = QFrame()
        proxy_panel.setObjectName("FieldPanel")
        proxy_form = QVBoxLayout(proxy_panel)
        proxy_form.setContentsMargins(14, 14, 14, 14)
        proxy_form.setSpacing(8)
        proxy_row1 = QHBoxLayout()
        proxy_row1.setSpacing(8)
        self.combo_proxy_type = QComboBox()
        self.combo_proxy_type.addItems(["SOCKS5", "SOCKS4", "HTTP"])
        self.combo_proxy_type.setFixedWidth(110)
        self.input_proxy_host = QLineEdit()
        self.input_proxy_host.setPlaceholderText("Host or IP address")
        self.input_proxy_host.setMinimumWidth(0)
        self.input_proxy_port = QLineEdit()
        self.input_proxy_port.setPlaceholderText("Port")
        self.input_proxy_port.setFixedWidth(90)

        proxy_row1.addWidget(self.combo_proxy_type)
        proxy_row1.addWidget(self.input_proxy_host, stretch=1)
        proxy_row1.addWidget(self.input_proxy_port)
        proxy_form.addLayout(proxy_row1)

        proxy_row2 = QHBoxLayout()
        proxy_row2.setSpacing(8)
        self.input_proxy_user = QLineEdit()
        self.input_proxy_user.setPlaceholderText("Username (optional)")
        self.input_proxy_user.setMinimumWidth(0)
        self.input_proxy_pass = QLineEdit()
        self.input_proxy_pass.setPlaceholderText("Password (optional)")
        self.input_proxy_pass.setMinimumWidth(0)
        self.input_proxy_pass.setEchoMode(QLineEdit.Password)

        proxy_row2.addWidget(self.input_proxy_user)
        proxy_row2.addWidget(self.input_proxy_pass)
        proxy_form.addLayout(proxy_row2)
        network_layout.addWidget(proxy_panel)

        performance_section, performance_layout = self._create_settings_section(
            "03", "Speed and limits", "Control scan size and download use"
        )
        self.clayout.addWidget(performance_section)
        limit_grid = QGridLayout()
        limit_grid.setHorizontalSpacing(18)
        limit_grid.setVerticalSpacing(10)
        limit_grid.setColumnStretch(1, 1)

        limit_grid.addWidget(QLabel("Downloads at the same time", objectName="ControlLabel"), 0, 0)
        self.spin_limit = QSpinBox()
        self.spin_limit.setRange(1, 8)
        self.spin_limit.setToolTip(
            "Maximum number of Telegram file transfers running at the same time."
        )
        limit_grid.addWidget(self.spin_limit, 0, 1)

        limit_grid.addWidget(QLabel("Speed limit (KB/s)", objectName="ControlLabel"), 1, 0)
        self.spin_speed = QSpinBox()
        self.spin_speed.setRange(0, 999999)
        self.spin_speed.setSpecialValueText("Unlimited")
        limit_grid.addWidget(self.spin_speed, 1, 1)

        limit_grid.addWidget(QLabel("Items scanned per type", objectName="ControlLabel"), 2, 0)
        self.spin_fetch_limit = QSpinBox()
        self.spin_fetch_limit.setRange(10, 50000)
        limit_grid.addWidget(self.spin_fetch_limit, 2, 1)
        performance_layout.addLayout(limit_grid)
        performance_note = QLabel(
            "More connections can be faster. A larger scan finds older files but takes more time."
        )
        performance_note.setObjectName("MutedText")
        performance_note.setWordWrap(True)
        performance_layout.addWidget(performance_note)

        self.btn_save = QPushButton("Save changes")
        self.btn_save.setObjectName("SuccessButton")
        self.btn_save.setMinimumHeight(44)
        self.btn_save.setCursor(Qt.PointingHandCursor)
        self.btn_save.clicked.connect(self.save_settings)
        self.clayout.addWidget(self.btn_save, 0, Qt.AlignRight)

        logout_card = QFrame()
        logout_card.setObjectName("DangerCard")
        logout_card.setMaximumWidth(860)

        log_l = QHBoxLayout(logout_card)
        log_l.setContentsMargins(22, 18, 22, 18)

        txt_l = QVBoxLayout()
        danger_title = QLabel("Log out of Telegram")
        danger_title.setObjectName("DangerTitle")
        txt_l.addWidget(danger_title)
        txt_l.addWidget(QLabel("This will clear your local session and close the connection.", objectName="MutedText"))
        log_l.addLayout(txt_l)
        log_l.addStretch()

        self.btn_logout = QPushButton("Log out")
        self.btn_logout.setObjectName("LogoutBtn")
        self.btn_logout.setMinimumWidth(120)
        self.btn_logout.setCursor(Qt.PointingHandCursor)
        self.btn_logout.clicked.connect(self.logout_clicked)
        log_l.addWidget(self.btn_logout)
        self.scroll_layout.addWidget(logout_card)

        self.scroll_area.setWidget(self.container)
        root_layout.addWidget(self.scroll_area)
        self.load_settings()

    def _create_settings_section(self, number, title, description):
        section = QFrame()
        section.setObjectName("SettingsSection")
        layout = QVBoxLayout(section)
        layout.setContentsMargins(22, 20, 22, 22)
        layout.setSpacing(12)

        header = QHBoxLayout()
        header.setSpacing(12)
        index = QLabel(number)
        index.setObjectName("SectionIndex")
        header.addWidget(index)

        text = QVBoxLayout()
        text.setSpacing(2)
        title_label = QLabel(title)
        title_label.setObjectName("SectionHeader")
        description_label = QLabel(description)
        description_label.setObjectName("MutedText")
        text.addWidget(title_label)
        text.addWidget(description_label)
        header.addLayout(text)
        header.addStretch()
        layout.addLayout(header)
        layout.addWidget(self._create_divider())
        return section, layout

    def _add_toggle_option(self, layout, checkbox, title, description):
        option = QFrame()
        option.setObjectName("SettingOption")
        row = QHBoxLayout(option)
        row.setContentsMargins(14, 11, 14, 11)
        row.setSpacing(12)

        text = QVBoxLayout()
        text.setSpacing(2)
        title_label = QLabel(title)
        title_label.setObjectName("OptionTitle")
        description_label = QLabel(description)
        description_label.setObjectName("MutedText")
        description_label.setWordWrap(True)
        text.addWidget(title_label)
        text.addWidget(description_label)
        row.addLayout(text, stretch=1)

        checkbox.setText("")
        checkbox.setAccessibleName(title)
        checkbox.setToolTip(description)
        row.addWidget(checkbox, 0, Qt.AlignVCenter)
        layout.addWidget(option)

    def _create_divider(self):
        d = QFrame()
        d.setObjectName("Divider")
        d.setFrameShape(QFrame.HLine)
        d.setFixedHeight(1)
        return d

    def load_settings(self):
        config = load_config()
        self.input_path.setText(config.get("download_path", "downloads"))
        self.spin_limit.setValue(config.get("download_limit", 5))
        self.spin_fetch_limit.setValue(config.get("initial_fetch_limit", 2000))
        self.spin_speed.setValue(config.get("max_speed_kb", 0))
        self.chk_forum_sep.setChecked(config.get("forum_auto_separation", False))
        self.chk_rename_duplicates.setChecked(config.get("rename_duplicates", True))
        self.chk_use_msg_date.setChecked(config.get("use_message_date", True))
        
        proxy = config.get("proxy", {})
        self.chk_enable_proxy.setChecked(proxy.get("enabled", False))
        self.combo_proxy_type.setCurrentText(proxy.get("type", "SOCKS5"))
        self.input_proxy_host.setText(proxy.get("host", ""))
        self.input_proxy_port.setText(str(proxy.get("port", "")))
        self.input_proxy_user.setText(proxy.get("user", ""))
        self.input_proxy_pass.setText(proxy.get("pass", ""))

    def save_settings(self):
        # Preserve preferences managed elsewhere (notably dark_mode) instead
        # of replacing the entire configuration file.
        config = load_config()
        config.update({
            "download_path": self.input_path.text(),
            "download_limit": self.spin_limit.value(),
            "initial_fetch_limit": self.spin_fetch_limit.value(),
            "max_speed_kb": self.spin_speed.value(),
            "forum_auto_separation": self.chk_forum_sep.isChecked(),
            "rename_duplicates": self.chk_rename_duplicates.isChecked(),
            "use_message_date": self.chk_use_msg_date.isChecked(),
            "proxy": {
                "enabled": self.chk_enable_proxy.isChecked(),
                "type": self.combo_proxy_type.currentText(),
                "host": self.input_proxy_host.text(),
                "port": self.input_proxy_port.text(),
                "user": self.input_proxy_user.text(),
                "pass": self.input_proxy_pass.text()
            }
        })
        save_config(config)
        # Notify user it was saved properly
        QMessageBox.information(self, "Settings saved", "Your changes have been saved.")

    def browse_path(self):
        folder = QFileDialog.getExistingDirectory(self, "Choose download folder")
        if folder:
            self.input_path.setText(folder)

    def open_folder(self):
        path = self.input_path.text()
        if os.path.exists(path):
            from PySide6.QtGui import QDesktopServices
            from PySide6.QtCore import QUrl
            QDesktopServices.openUrl(QUrl.fromLocalFile(os.path.abspath(path)))
        else:
            QMessageBox.warning(self, "Folder not found", f"This folder does not exist yet:\n{path}")

    def logout_clicked(self):
        self.logoutRequested.emit()
