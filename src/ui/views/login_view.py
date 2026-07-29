from PySide6.QtWidgets import (
    QWidget, QVBoxLayout, QHBoxLayout, QLabel,
    QLineEdit, QPushButton, QStackedWidget, QFrame, QSizePolicy
)
from PySide6.QtCore import Qt, Signal
from PySide6.QtGui import QPixmap
import os


class LoginView(QWidget):
    login_started = Signal(str, str, str)
    code_submitted = Signal(str)
    password_submitted = Signal(str)

    def __init__(self):
        super().__init__()
        self.setup_ui()
        self.load_env_defaults()

    def setup_ui(self):
        self.setObjectName("LoginView")
        self.setAttribute(Qt.WA_StyledBackground, True)

        outer = QHBoxLayout(self)
        outer.setContentsMargins(24, 28, 24, 28)
        outer.setSpacing(16)

        brand_panel = QFrame()
        brand_panel.setObjectName("LoginBrandPanel")
        brand_panel.setMinimumWidth(220)
        brand_layout = QVBoxLayout(brand_panel)
        brand_layout.setContentsMargins(34, 34, 34, 34)
        brand_layout.setSpacing(12)

        logo_lbl = QLabel()
        logo_path = os.path.abspath(os.path.join(
            os.path.dirname(__file__), "..", "..", "assets", "logo.png"
        ))
        if os.path.exists(logo_path):
            pix = QPixmap(logo_path).scaled(
                76, 76, Qt.KeepAspectRatio, Qt.SmoothTransformation
            )
            logo_lbl.setPixmap(pix)
        logo_lbl.setAlignment(Qt.AlignLeft)

        eyebrow = QLabel("PRIVATE DESKTOP WORKSPACE")
        eyebrow.setObjectName("Eyebrow")
        brand_title = QLabel("Your Telegram media,\nkept under your control.")
        brand_title.setObjectName("LoginBrandTitle")
        brand_title.setWordWrap(True)
        brand_copy = QLabel(
            "Connect your own Telegram account. Your session, file choices, "
            "and download history stay on this computer."
        )
        brand_copy.setObjectName("DescriptionText")
        brand_copy.setWordWrap(True)

        brand_layout.addWidget(logo_lbl)
        brand_layout.addSpacing(8)
        brand_layout.addWidget(eyebrow)
        brand_layout.addWidget(brand_title)
        brand_layout.addWidget(brand_copy)
        brand_layout.addStretch()

        for number, title, detail in (
            ("01", "Local session", "Login details are stored on this device."),
            ("02", "Direct downloads", "Files go straight to your chosen folder."),
            ("03", "Resume ready", "Unfinished tasks can continue later."),
        ):
            item = QFrame()
            item.setObjectName("LoginFeature")
            item_layout = QHBoxLayout(item)
            item_layout.setContentsMargins(12, 10, 12, 10)
            item_layout.setSpacing(10)
            index = QLabel(number)
            index.setObjectName("SectionIndex")
            text_layout = QVBoxLayout()
            text_layout.setSpacing(1)
            title_label = QLabel(title)
            title_label.setObjectName("OptionTitle")
            detail_label = QLabel(detail)
            detail_label.setObjectName("MutedText")
            detail_label.setWordWrap(True)
            text_layout.addWidget(title_label)
            text_layout.addWidget(detail_label)
            item_layout.addWidget(index)
            item_layout.addLayout(text_layout, stretch=1)
            brand_layout.addWidget(item)

        self.card = QFrame()
        self.card.setObjectName("LoginFormPanel")
        self.card.setFixedWidth(400)
        self.card.setSizePolicy(QSizePolicy.Fixed, QSizePolicy.Expanding)
        card_layout = QVBoxLayout(self.card)
        card_layout.setContentsMargins(34, 32, 34, 32)
        card_layout.setSpacing(0)

        self.login_step_label = QLabel("STEP 1 OF 3")
        self.login_step_label.setObjectName("Eyebrow")
        self.login_step_title = QLabel("Connect Telegram")
        self.login_step_title.setObjectName("MainHeaderLarge")
        self.login_step_copy = QLabel("Enter the API details for your Telegram account.")
        self.login_step_copy.setObjectName("MutedText")
        self.login_step_copy.setWordWrap(True)
        card_layout.addWidget(self.login_step_label)
        card_layout.addSpacing(8)
        card_layout.addWidget(self.login_step_title)
        card_layout.addWidget(self.login_step_copy)
        card_layout.addSpacing(18)

        divider = QFrame()
        divider.setObjectName("DividerHorizontal")
        card_layout.addWidget(divider)
        card_layout.addSpacing(18)

        self.stack = QStackedWidget()

        def field_label(text):
            label = QLabel(text)
            label.setObjectName("ControlLabel")
            return label

        page1 = QWidget()
        page1_layout = QVBoxLayout(page1)
        page1_layout.setContentsMargins(0, 0, 0, 0)
        page1_layout.setSpacing(8)
        self.inp_api_id = QLineEdit()
        self.inp_api_id.setPlaceholderText("Example: 12345678")
        self.inp_api_hash = QLineEdit()
        self.inp_api_hash.setPlaceholderText("32-character API hash")
        self.inp_phone = QLineEdit()
        self.inp_phone.setPlaceholderText("+91 98765 43210")
        for field in (self.inp_api_id, self.inp_api_hash, self.inp_phone):
            field.setMinimumHeight(40)
        self.btn_send_code = QPushButton("Send verification code")
        self.btn_send_code.setObjectName("PrimaryButtonLarge")
        self.btn_send_code.setMinimumHeight(44)
        self.btn_send_code.clicked.connect(self.on_send_code)
        page1_layout.addWidget(field_label("API ID"))
        page1_layout.addWidget(self.inp_api_id)
        page1_layout.addWidget(field_label("API hash"))
        page1_layout.addWidget(self.inp_api_hash)
        page1_layout.addWidget(field_label("Phone number with country code"))
        page1_layout.addWidget(self.inp_phone)
        page1_layout.addSpacing(12)
        page1_layout.addWidget(self.btn_send_code)

        page2 = QWidget()
        page2_layout = QVBoxLayout(page2)
        page2_layout.setContentsMargins(0, 0, 0, 0)
        page2_layout.setSpacing(8)
        code_hint = QLabel("Check your Telegram app for the login code.")
        code_hint.setObjectName("MutedText")
        code_hint.setWordWrap(True)
        self.inp_code = QLineEdit()
        self.inp_code.setPlaceholderText("Enter the code")
        self.inp_code.setMinimumHeight(40)
        self.btn_submit_code = QPushButton("Verify and log in")
        self.btn_submit_code.setObjectName("PrimaryButtonLarge")
        self.btn_submit_code.setMinimumHeight(44)
        self.btn_submit_code.clicked.connect(self.on_submit_code)
        self.btn_back = QPushButton("Back")
        self.btn_back.setObjectName("LinkButton")
        self.btn_back.clicked.connect(self.reset_to_start)
        page2_layout.addWidget(code_hint)
        page2_layout.addSpacing(8)
        page2_layout.addWidget(field_label("Login code"))
        page2_layout.addWidget(self.inp_code)
        page2_layout.addSpacing(12)
        page2_layout.addWidget(self.btn_submit_code)
        page2_layout.addWidget(self.btn_back)

        page3 = QWidget()
        page3_layout = QVBoxLayout(page3)
        page3_layout.setContentsMargins(0, 0, 0, 0)
        page3_layout.setSpacing(8)
        password_hint = QLabel("Two-step verification is enabled.")
        password_hint.setObjectName("MutedText")
        self.inp_pwd = QLineEdit()
        self.inp_pwd.setEchoMode(QLineEdit.Password)
        self.inp_pwd.setPlaceholderText("Your Telegram password")
        self.inp_pwd.setMinimumHeight(40)
        self.btn_submit_pwd = QPushButton("Log in")
        self.btn_submit_pwd.setObjectName("PrimaryButtonLarge")
        self.btn_submit_pwd.setMinimumHeight(44)
        self.btn_submit_pwd.clicked.connect(self.on_submit_pwd)
        page3_layout.addWidget(password_hint)
        page3_layout.addSpacing(8)
        page3_layout.addWidget(field_label("Password"))
        page3_layout.addWidget(self.inp_pwd)
        page3_layout.addSpacing(12)
        page3_layout.addWidget(self.btn_submit_pwd)

        self.stack.addWidget(page1)
        self.stack.addWidget(page2)
        self.stack.addWidget(page3)
        card_layout.addWidget(self.stack)
        card_layout.addStretch()

        outer.addWidget(brand_panel, stretch=1)
        outer.addWidget(self.card)

    def load_env_defaults(self):
        from dotenv import load_dotenv
        from resource_utils import get_project_root
        env_path = os.path.join(get_project_root(), ".env")
        load_dotenv(env_path)

        api_id = os.getenv("API_ID")
        api_hash = os.getenv("API_HASH")
        phone = os.getenv("PHONE")
        if api_id:
            self.inp_api_id.setText(str(api_id).strip("'").strip('"'))
        if api_hash:
            self.inp_api_hash.setText(str(api_hash).strip("'").strip('"'))
        if phone:
            self.inp_phone.setText(str(phone).strip("'").strip('"'))

    def on_send_code(self):
        api_id = self.inp_api_id.text().strip()
        api_hash = self.inp_api_hash.text().strip()
        phone = self.inp_phone.text().strip()
        if not api_id or not api_hash or not phone:
            return

        from resource_utils import get_project_root
        env_path = os.path.join(get_project_root(), ".env")
        try:
            lines = []
            if os.path.exists(env_path):
                with open(env_path, "r") as env_file:
                    lines = env_file.readlines()
            env_data = {}
            for line in lines:
                if "=" in line:
                    key, value = line.strip().split("=", 1)
                    env_data[key.strip()] = value.strip()
            env_data["API_ID"] = api_id
            env_data["API_HASH"] = api_hash
            env_data["PHONE"] = phone
            with open(env_path, "w") as env_file:
                for key, value in env_data.items():
                    env_file.write(f"{key}={value}\n")
        except Exception as error:
            print(f"Error saving .env: {error}")

        self.btn_send_code.setEnabled(False)
        self.btn_send_code.setText("Connecting...")
        self.login_started.emit(api_id, api_hash, phone)

    def on_submit_code(self):
        code = self.inp_code.text().strip()
        if code:
            self.btn_submit_code.setEnabled(False)
            self.code_submitted.emit(code)

    def on_submit_pwd(self):
        password = self.inp_pwd.text().strip()
        if password:
            self.btn_submit_pwd.setEnabled(False)
            self.password_submitted.emit(password)

    def show_otp_step(self):
        self.inp_code.clear()
        self.btn_submit_code.setEnabled(True)
        self.login_step_label.setText("STEP 2 OF 3")
        self.login_step_title.setText("Enter your code")
        self.login_step_copy.setText("Telegram sent a login code to your account.")
        self.stack.setCurrentIndex(1)

    def show_pwd_step(self):
        self.inp_pwd.clear()
        self.btn_submit_pwd.setEnabled(True)
        self.login_step_label.setText("STEP 3 OF 3")
        self.login_step_title.setText("Enter your password")
        self.login_step_copy.setText("Two-step verification is enabled for this account.")
        self.stack.setCurrentIndex(2)

    def reset_to_start(self):
        self.btn_send_code.setEnabled(True)
        self.btn_send_code.setText("Send verification code")
        self.login_step_label.setText("STEP 1 OF 3")
        self.login_step_title.setText("Connect Telegram")
        self.login_step_copy.setText("Enter the API details for your Telegram account.")
        self.stack.setCurrentIndex(0)
