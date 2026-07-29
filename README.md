# TG Media Downloader

### Fast Telegram media downloader for groups, channels, and forum topics

[![GitHub release](https://img.shields.io/github/v/release/Arulraj2001/TG-Downloader-?style=flat-square)](https://github.com/Arulraj2001/TG-Downloader-/releases/latest)
[![GitHub downloads](https://img.shields.io/github/downloads/Arulraj2001/TG-Downloader-/total?style=flat-square)](https://github.com/Arulraj2001/TG-Downloader-/releases)
[![License: MIT](https://img.shields.io/badge/license-MIT-9562E3?style=flat-square)](LICENSE)
[![Python](https://img.shields.io/badge/Python-3.8%2B-0071E3?style=flat-square)](https://www.python.org/)

**TG Media Downloader** is an open-source desktop application for downloading videos, photos, documents, music, voice messages, GIFs, links, and chat exports from Telegram groups and channels. It includes bulk selection, fast concurrent downloads, live progress, pause and resume, duplicate protection, proxy support, and persistent download history.

The app runs locally on Windows, macOS, and Linux. It uses your own Telegram API credentials and does not send your login details to a third-party server.

> Unofficial software. TG Media Downloader is not affiliated with or endorsed by Telegram.

## Why use TG Media Downloader?

- Download media from Telegram groups and channels in bulk.
- Browse cached media while the latest content refreshes in the background.
- Select individual files, categories, date ranges, or complete result sets.
- Monitor live file progress, combined speed, and queue completion.
- Pause, resume, cancel, reorder, and restore download tasks.
- Continue interrupted downloads without starting again.
- Prevent accidental overwrites with duplicate-file renaming.
- Organize Telegram forum topics into separate folders.
- Use SOCKS4, SOCKS5, or HTTP proxy connections.
- Choose light or dark mode in a modern desktop interface.

## Supported Telegram content

| Content | Support |
| --- | --- |
| Photos and images | Yes |
| Videos and round videos | Yes |
| Documents and PDF files | Yes |
| Music and audio | Yes |
| Voice messages | Yes |
| GIFs and animations | Yes |
| Shared links | Yes |
| Chat text exports | Yes |
| Groups and channels | Yes |
| Forum topics | Yes |

## Download the app

Download the latest build from [GitHub Releases](https://github.com/Arulraj2001/TG-Downloader-/releases/latest).

Release files use names such as:

- `TG-Media-Downloader-v1.0.0-Windows-x64.exe`
- `TG-Media-Downloader-v1.0.0-Linux-x64`
- `TG-Media-Downloader-v1.0.0-macOS-arm64.dmg`

Windows may warn about an unsigned application. Review the release source and build workflow before choosing **More info > Run anyway**.

## Run from source

### Requirements

- Python 3.8 or newer
- A Telegram API ID and API hash from [my.telegram.org](https://my.telegram.org/)

### Installation

```bash
git clone https://github.com/Arulraj2001/TG-Downloader-.git
cd TG-Downloader-
python -m venv venv
```

Activate the environment:

```powershell
# Windows PowerShell
.\venv\Scripts\Activate.ps1
```

```bash
# macOS or Linux
source venv/bin/activate
```

Install dependencies:

```bash
python -m pip install -r requirements.txt
```

Create a `.env` file in the project root:

```env
API_ID=your_api_id
API_HASH=your_api_hash
```

Start TG Media Downloader:

```bash
python src/gui.py
```

## How to download Telegram media

1. Sign in with your Telegram phone number, verification code, and 2FA password if enabled.
2. Enter a Telegram username, group or channel ID, invite link, or forum-topic link.
3. Select **Fetch media**.
4. Filter and select the files you want.
5. Select **Download selected**.
6. Follow live speed and file progress from the Queue page.

Progress and download history are stored locally in SQLite. Restarting the app restores unfinished tasks and skips completed files.

## Main features

### Bulk Telegram downloads

Fetch multiple media categories in parallel and add selected files to the download queue in one action.

### Live download status

See total progress, current file progress, transfer speed, downloaded bytes, completed files, and failed files as they update.

### Reliable resume

Incomplete tasks are saved locally. Downloads can continue after pausing, closing, or restarting the application.

### Smart file handling

Already downloaded files are detected by file name and size. Optional duplicate renaming prevents existing files from being replaced.

### Flexible folder organization

Build download paths with `{channel}`, `{username}`, `{channel_id}`, `{category}`, `{year}`, `{month}`, and `{day}` variables.

### Local privacy

Telegram sessions, configuration, cached metadata, and download history remain on your computer. Keep `.env`, `.session`, and database files private.

## Settings

- Download folder and folder-name template
- Forum-topic separation
- Duplicate-file renaming
- Telegram message timestamps
- Concurrent download limit
- Download speed limit
- Media scan limit
- SOCKS4, SOCKS5, and HTTP proxies
- Light and dark themes

## Technology

- [Python](https://www.python.org/)
- [Telethon](https://github.com/LonamiWebs/Telethon)
- [PySide6](https://pypi.org/project/PySide6/)
- SQLite
- [cryptg](https://github.com/LonamiWebs/cryptg)

## Build executables

GitHub Actions builds Windows, Linux, Apple Silicon macOS, and Intel macOS releases. Tagged commits matching `v*` publish build artifacts to GitHub Releases.

To create a local Windows build:

```powershell
python -m pip install pyinstaller
python -m PyInstaller TG-Media-Downloader.spec
```

## Contributing

Bug reports, fixes, and documentation improvements are welcome. Read [CONTRIBUTING.md](CONTRIBUTING.md) before opening a pull request.

- [Report a bug](https://github.com/Arulraj2001/TG-Downloader-/issues/new)
- [Suggest a feature](https://github.com/Arulraj2001/TG-Downloader-/discussions)

## Support

If TG Media Downloader helps you:

- Star the GitHub repository so more people can find it.
- [Buy me a coffee](https://buymeacoffee.com/x4kqsd0lka).

## Responsible use

Use TG Media Downloader only for content you own or have permission to access. Respect copyright, privacy, Telegram's Terms of Service, and the rules of each group or channel. The application does not bypass Telegram access controls.

## License

TG Media Downloader is available under the [MIT License](LICENSE).

## Search terms

TG Media Downloader, Telegram media downloader, Telegram video downloader, Telegram group downloader, Telegram channel downloader, Telegram bulk downloader, Telegram file downloader, Telegram photo downloader, Telegram archive tool, and desktop Telegram downloader.
