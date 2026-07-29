# TG Media Downloader

<p align="center">
  <img src="assets/readme-banner.svg" alt="TG Media Downloader animated banner" width="100%" />
</p>

[![GitHub release](https://img.shields.io/github/v/release/Arulraj2001/TG-Downloader-?style=flat-square)](https://github.com/Arulraj2001/TG-Downloader-/releases/latest)
[![GitHub downloads](https://img.shields.io/github/downloads/Arulraj2001/TG-Downloader-/total?style=flat-square)](https://github.com/Arulraj2001/TG-Downloader-/releases)
[![License: MIT](https://img.shields.io/badge/license-MIT-9562E3?style=flat-square)](LICENSE)
[![Python](https://img.shields.io/badge/Python-3.8%2B-0071E3?style=flat-square)](https://www.python.org/)

TG Media Downloader is a desktop application for downloading media from Telegram groups, channels, and forum topics. It helps you collect photos, videos, documents, audio, voice messages, links, and chat exports in a fast, organized, and resumable way.

It runs locally on Windows, macOS, and Linux, uses your own Telegram API credentials, and keeps your session data on your device.

> Unofficial software. TG Media Downloader is not affiliated with or endorsed by Telegram.

## Table of contents

- [Why use this tool](#why-use-this-tool)
- [Supported content](#supported-content)
- [Quick start](#quick-start)
- [How it works](#how-it-works)
- [Features](#features)
- [Build from source](#build-from-source)
- [Contributing](#contributing)
- [Support](#support)
- [License](#license)

## Why use this tool

- Download large batches of Telegram media without manually saving each item.
- Browse cached media while new results are refreshed in the background.
- Filter by category, date, or selection set before downloading.
- Monitor queue progress, speed, and completion in real time.
- Resume interrupted downloads without restarting from the beginning.
- Avoid overwriting existing files with smart duplicate handling.
- Organize output folders using custom naming patterns.
- Use proxies and dark/light themes for better control and comfort.

## Supported content

| Content type | Supported |
| --- | --- |
| Photos and images | Yes |
| Videos and round videos | Yes |
| Documents and PDFs | Yes |
| Music and audio | Yes |
| Voice messages | Yes |
| GIFs and animations | Yes |
| Shared links | Yes |
| Chat text exports | Yes |
| Groups and channels | Yes |
| Forum topics | Yes |

## Quick start

### Download the app

Get the latest release from [GitHub Releases](https://github.com/Arulraj2001/TG-Downloader-/releases/latest).

Example release names:

- `TG-Media-Downloader-v1.0.0-Windows-x64.exe`
- `TG-Media-Downloader-v1.0.0-Linux-x64`
- `TG-Media-Downloader-v1.0.0-macOS-arm64.dmg`

Windows may show a security warning for unsigned builds. Review the source and build workflow before choosing **More info > Run anyway**.

### Run from source

#### Requirements

- Python 3.8 or newer
- A Telegram API ID and API hash from [my.telegram.org](https://my.telegram.org/)

#### Installation

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

Install the dependencies:

```bash
python -m pip install -r requirements.txt
```

Create a `.env` file in the project root:

```env
API_ID=your_api_id
API_HASH=your_api_hash
```

Launch the application:

```bash
python src/gui.py
```

## How it works

1. Sign in with your Telegram phone number, verification code, and 2FA password if enabled.
2. Enter a username, group/channel ID, invite link, or forum topic link.
3. Select **Fetch media**.
4. Filter and choose the files you want to save.
5. Select **Download selected**.
6. Track the queue from the live progress view.

Progress and history are stored locally in SQLite, so unfinished downloads can be resumed later.

## Features

### Bulk media downloads
Fetch multiple media categories in parallel and queue them in one action.

### Live progress tracking
See total progress, file progress, speed, downloaded bytes, completed files, and failures as they update.

### Reliable resume support
Interruptions are handled smoothly with saved task state and recovery.

### Smart file handling
Downloaded files are detected by name and size, and duplicate renaming helps prevent overwrites.

### Flexible folder organization
Build output paths using variables such as `{channel}`, `{username}`, `{channel_id}`, `{category}`, `{year}`, `{month}`, and `{day}`.

### Local privacy
Telegram sessions, configuration, cache files, and history remain on your computer. Keep `.env`, `.session`, and database files private.

### Settings and customization
- Download folder and naming templates
- Forum topic separation
- Duplicate file handling
- Telegram message timestamps
- Concurrent download limit
- Speed limit
- Media scan limit
- SOCKS4, SOCKS5, and HTTP proxies
- Light and dark themes

## Build from source

GitHub Actions can build Windows, Linux, Apple Silicon macOS, and Intel macOS packages. Tagged commits matching `v*` publish build artifacts to GitHub Releases.

To build locally on Windows:

```powershell
python -m pip install pyinstaller
python -m PyInstaller TG-Media-Downloader.spec
```

## Contributing

Bug reports, feature ideas, and documentation improvements are welcome. Please read [CONTRIBUTING.md](CONTRIBUTING.md) before opening a pull request.

- [Report a bug](https://github.com/Arulraj2001/TG-Downloader-/issues/new)
- [Suggest a feature](https://github.com/Arulraj2001/TG-Downloader-/discussions)

## Support

If TG Media Downloader helps you:

- Star the repository to help more people discover it.
- Support the project on [Buy Me a Coffee](https://buymeacoffee.com/x4kqsd0lka).
- [![Buy Me a Coffee](https://img.shields.io/badge/Buy%20Me%20a%20Coffee-ffdd00?logo=buymeacoffee&logoColor=black)](https://buymeacoffee.com/x4kqsd0lka)

## Responsible use

Use TG Media Downloader only for content you own or have permission to access. Respect copyright, privacy, Telegram's Terms of Service, and the rules of each group or channel. The application does not bypass Telegram access controls.

## License

TG Media Downloader is available under the [MIT License](LICENSE).
