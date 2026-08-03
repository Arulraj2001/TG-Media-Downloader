"""
TG Media Downloader — Python Telethon MTProto Backend
Mirrors 100% of desktop app core_downloader.py functionality via HTTP API.

Deploy on Render.com (Python environment).
"""

import os
import sys
import asyncio
import json
import time
import traceback
import queue
import threading
from flask import Flask, request, jsonify, Response, stream_with_context
from flask_cors import CORS
from telethon import TelegramClient
from telethon.errors import (
    ApiIdInvalidError,
    PhoneNumberInvalidError,
    PhoneNumberBannedError,
    PhoneCodeInvalidError,
    PhoneCodeExpiredError,
    SessionPasswordNeededError,
    FloodWaitError,
    ChannelPrivateError,
    UsernameInvalidError,
    UsernameNotOccupiedError,
)
from telethon.tl.types import (
    MessageMediaPhoto,
    MessageMediaDocument,
    InputMessagesFilterPhotos,
    InputMessagesFilterVideo,
    InputMessagesFilterDocument,
    InputMessagesFilterMusic,
    InputMessagesFilterVoice,
    InputMessagesFilterUrl,
    InputMessagesFilterGif,
    InputMessagesFilterPhotoVideo,
    InputMessagesFilterRoundVideo,
    Channel,
    Chat,
)

# ─── Add parent src directory for desktop core_downloader ───────────────────
PARENT_SRC = os.path.abspath(os.path.join(os.path.dirname(__file__), '../../src'))
sys.path.append(PARENT_SRC)
try:
    from core_downloader import parse_channel_input, fetch_categorized_media, deduplicate_messages, fetch_channel
    CORE_AVAILABLE = True
    print("[Backend] core_downloader imported successfully")
except ImportError as e:
    CORE_AVAILABLE = False
    parse_channel_input = None
    fetch_categorized_media = None
    deduplicate_messages = None
    fetch_channel = None
    print(f"[Backend] core_downloader not available: {e}")

# In-memory entity cache to avoid repeating Telegram API roundtrips
ENTITY_CACHE = {}

async def get_cached_entity(client, channel_input: str):
    if not channel_input:
        return None
    if channel_input in ENTITY_CACHE:
        return ENTITY_CACHE[channel_input]
    try:
        if CORE_AVAILABLE and fetch_channel:
            entity = await fetch_channel(client, channel_input)
        else:
            entity = await client.get_entity(channel_input)
        if entity and not isinstance(entity, str):
            ENTITY_CACHE[channel_input] = entity
        return entity
    except Exception:
        return channel_input

# ─── Flask App ───────────────────────────────────────────────────────────────
app = Flask(__name__)

FRONTEND_ORIGIN = os.environ.get('FRONTEND_ORIGIN', '*')
CORS(app, origins=FRONTEND_ORIGIN, supports_credentials=True)

# ─── Session Store ────────────────────────────────────────────────────────────
SESSION_DIR = os.path.join(os.path.dirname(__file__), 'sessions')
os.makedirs(SESSION_DIR, exist_ok=True)

# phone → TelegramClient (or dict with client+phone_code_hash before sign-in)
CLIENT_SESSIONS: dict = {}

# job_id → queue.Queue for SSE progress events
PROGRESS_QUEUES: dict = {}

# job_id → {str(msg_id): filepath} for completed downloads
DOWNLOAD_FILES: dict = {}

# Temp folder where downloaded files are stored until served
DOWNLOAD_TEMP_DIR = os.path.join(os.path.dirname(__file__), 'downloads_temp')
os.makedirs(DOWNLOAD_TEMP_DIR, exist_ok=True)

# ─── Dedicated Asyncio Loop Manager (process & thread safe) ─────────────────
_loop_lock = threading.Lock()
_loop = None

def get_event_loop():
    """Ensure an active event loop is running in the current worker process thread."""
    global _loop
    with _loop_lock:
        if _loop is None or not _loop.is_running():
            _loop = asyncio.new_event_loop()
            def _loop_worker(l):
                asyncio.set_event_loop(l)
                l.run_forever()
            t = threading.Thread(target=_loop_worker, args=(_loop,), daemon=True)
            t.start()
    return _loop

def run_async(coro, timeout=60):
    """Schedule a coroutine on the active process event loop and wait for the result."""
    loop = get_event_loop()
    fut = asyncio.run_coroutine_threadsafe(coro, loop)
    return fut.result(timeout=timeout)

# ─── Helpers ─────────────────────────────────────────────────────────────────
def clean_phone_number(phone: str) -> str:
    """Ensure phone starts with + and has only digits."""
    digits = ''.join(c for c in str(phone) if c.isdigit())
    return f"+{digits}"

def get_client_for_phone(phone: str) -> TelegramClient | None:
    """Return the active TelegramClient for a phone number, or None."""
    clean = clean_phone_number(phone)
    entry = CLIENT_SESSIONS.get(clean) or CLIENT_SESSIONS.get(phone)
    if entry is None:
        return None
    if isinstance(entry, dict):
        return entry.get('client')
    if isinstance(entry, TelegramClient):
        return entry
    return None

def get_any_authorized_client() -> TelegramClient | None:
    """Return the first authorized TelegramClient from the session store."""
    for v in CLIENT_SESSIONS.values():
        c = v if isinstance(v, TelegramClient) else (v.get('client') if isinstance(v, dict) else None)
        if c and isinstance(c, TelegramClient):
            return c
    return None

async def connect_client_safely(client: TelegramClient):
    """Safely connect a TelegramClient, handling SQLite database lock conflicts with retries."""
    if client.is_connected():
        return
    for attempt in range(3):
        try:
            await client.connect()
            return
        except Exception as e:
            if 'database is locked' in str(e).lower() or 'locked' in str(e).lower():
                print(f"[Telethon] SQLite lock detected (attempt {attempt+1}/3). Retrying...")
                try:
                    await client.disconnect()
                except Exception:
                    pass
                await asyncio.sleep(0.5 * (attempt + 1))
            else:
                raise e
    await client.connect()

async def ensure_connected(client: TelegramClient) -> bool:
    """Reconnect client if disconnected, return True if authorized."""
    try:
        await connect_client_safely(client)
        return await client.is_user_authorized()
    except Exception:
        return False

def format_message(msg, channel_id: str) -> dict | None:
    """Convert a Telethon message to a JSON-serializable dict."""
    if not msg or not msg.media:
        return None

    # File name
    filename = None
    if hasattr(msg, 'file') and msg.file:
        try:
            filename = msg.file.name or f"{msg.file.id or 'msg_' + str(msg.id)}{msg.file.ext or ''}"
        except Exception:
            filename = f"msg_{msg.id}"

    if not filename:
        filename = f"msg_{msg.id}"

    # File size
    size = 0
    if hasattr(msg, 'file') and msg.file:
        size = getattr(msg.file, 'size', 0) or 0
    elif hasattr(msg, 'document') and msg.document:
        size = getattr(msg.document, 'size', 0) or 0

    # Extension
    ext = ''
    if hasattr(msg, 'file') and msg.file:
        ext = getattr(msg.file, 'ext', '') or ''
    if not ext and '.' in filename:
        ext = '.' + filename.rsplit('.', 1)[-1]

    # Media category
    cat = 'files'
    if isinstance(msg.media, MessageMediaPhoto):
        cat = 'media'
    elif hasattr(msg, 'video') and msg.video:
        cat = 'media'
    elif hasattr(msg, 'gif') and msg.gif:
        cat = 'gifs'
    elif hasattr(msg, 'voice') and msg.voice:
        cat = 'voice'
    elif hasattr(msg, 'audio') and msg.audio:
        cat = 'music'
    elif hasattr(msg, 'document') and msg.document:
        mime = getattr(msg.document, 'mime_type', '') or ''
        if mime.startswith('audio/'):
            cat = 'music'
        elif mime in ('application/zip', 'application/x-rar-compressed', 'application/x-7z-compressed'):
            cat = 'zips'
        else:
            cat = 'files'
    elif hasattr(msg, 'media') and hasattr(msg.media, 'url'):
        cat = 'links'

    date_str = msg.date.strftime('%Y-%m-%d') if msg.date else ''
    caption = (msg.message or '').strip()

    return {
        'id': msg.id,
        'filename': filename,
        'size': size,
        'ext': ext.lstrip('.').lower(),
        'date': date_str,
        'category': cat,
        'caption': caption,
        'channel_id': str(channel_id),
    }

def format_chat_message(msg) -> dict | None:
    """Format a text-only chat message."""
    if not msg or msg.media:
        return None
    text = (msg.message or '').strip()
    if not text:
        return None
    return {
        'id': msg.id,
        'filename': f"Message #{msg.id}: {text[:60]}",
        'size': len(text.encode()),
        'ext': 'txt',
        'date': msg.date.strftime('%Y-%m-%d') if msg.date else '',
        'category': 'chat',
        'caption': text,
        'channel_id': '',
    }

# ─── Error Handlers ──────────────────────────────────────────────────────────
@app.errorhandler(500)
def handle_internal_error(e):
    return jsonify({'error': f'Internal Server Error: {str(e)}'}), 500

@app.errorhandler(Exception)
def handle_exception(e):
    return jsonify({'error': f'Unhandled Server Error: {str(e)}'}), 500

# ─── Routes ──────────────────────────────────────────────────────────────────

@app.route('/api/health', methods=['GET'])
def health():
    sessions = len([v for v in CLIENT_SESSIONS.values()
                    if isinstance(v, TelegramClient)])
    return jsonify({
        'status': 'ok',
        'engine': 'Telethon MTProto v2.7',
        'authorized_sessions': sessions,
        'core_available': CORE_AVAILABLE,
    })


@app.route('/api/telegram/send-code', methods=['POST'])
def send_code():
    """Step 1: Connect to Telegram and send an OTP to the user's phone."""
    data = request.json or {}
    api_id   = data.get('api_id')
    api_hash = data.get('api_hash')
    phone    = data.get('phone')

    if not all([api_id, api_hash, phone]):
        return jsonify({'error': 'api_id, api_hash, and phone are required.'}), 400

    try:
        api_id_int   = int(str(api_id).strip())
        api_hash_str = str(api_hash).strip()
    except ValueError:
        return jsonify({'error': 'api_id must be a number.'}), 400

    clean = clean_phone_number(phone)
    session_name = f"session_{clean.replace('+', '')}"
    session_file = os.path.join(SESSION_DIR, session_name)

    async def _send():
        existing = get_client_for_phone(clean)
        if existing:
            try:
                await connect_client_safely(existing)
                if await existing.is_user_authorized():
                    me = await existing.get_me()
                    dialogs = []
                    async for d in existing.iter_dialogs(limit=100):
                        dialogs.append({
                            'id': str(d.id),
                            'title': d.name or '',
                            'username': getattr(d.entity, 'username', '') or '',
                            'type': 'channel' if isinstance(d.entity, Channel) else 'group',
                            'unread': getattr(d, 'unread_count', 0),
                        })
                    CLIENT_SESSIONS[clean] = existing
                    return {
                        'connected': True,
                        'user': me.first_name or '',
                        'phone': clean,
                        'chats': dialogs,
                    }
            except Exception:
                pass
            # Unauthorized existing client — disconnect & reset so Telethon sends a clean SendCodeRequest
            try:
                await existing.disconnect()
            except Exception:
                pass
            CLIENT_SESSIONS.pop(clean, None)

        client = TelegramClient(session_file, api_id_int, api_hash_str, loop=get_event_loop())
        try:
            await connect_client_safely(client)

            # Not yet authorized — send OTP
            print(f"[Telethon] Sending code to {clean} (api_id={api_id_int})")
            result = await client.send_code_request(clean)
            print(f"[Telethon] Code sent. Hash: {result.phone_code_hash[:8]}...")

            CLIENT_SESSIONS[clean] = {
                'client': client,
                'phone_code_hash': result.phone_code_hash,
                'api_id': api_id_int,
                'api_hash': api_hash_str,
                'phone': clean,
            }
            return {
                'connected': False,
                'phone': clean,
                'phone_code_hash': result.phone_code_hash,
            }
        except ApiIdInvalidError:
            raise ValueError("Invalid API ID or API Hash. Verify at my.telegram.org")
        except PhoneNumberInvalidError:
            raise ValueError("Invalid phone number. Include country code, e.g. +91 98765 43210")
        except PhoneNumberBannedError:
            raise ValueError("This phone number is banned from Telegram.")
        except FloodWaitError as e:
            raise ValueError(f"Telegram flood wait: please wait {e.seconds} seconds.")
        except Exception as e:
            err_msg = str(e)
            if 'ResendCodeRequest' in err_msg or 'options for this type of number' in err_msg:
                raise ValueError("Telegram verification code was already sent. Please check your Telegram app or SMS, or wait 1-2 minutes before requesting a new code.")
            if 'database is locked' in err_msg.lower():
                raise ValueError("Session database is currently busy. Please try again in a few seconds.")
            raise e

    try:
        result = run_async(_send())
        return jsonify(result)
    except ValueError as ve:
        return jsonify({'error': str(ve)}), 400
    except Exception as e:
        traceback.print_exc()
        return jsonify({'error': f"Backend error: {str(e)}"}), 500


@app.route('/api/telegram/verify-code', methods=['POST'])
def verify_code():
    """Step 2: Verify the OTP code sent to the user's Telegram app."""
    data  = request.json or {}
    phone = data.get('phone', '')
    code  = data.get('code', '')

    if not phone or not code:
        return jsonify({'error': 'phone and code are required.'}), 400

    clean = clean_phone_number(phone)
    session_info = CLIENT_SESSIONS.get(clean) or CLIENT_SESSIONS.get(phone)

    if not session_info:
        return jsonify({'error': 'No active login session. Please click "Send Code" again.'}), 400

    client = session_info['client'] if isinstance(session_info, dict) else session_info
    phone_code_hash = session_info.get('phone_code_hash') if isinstance(session_info, dict) else None

    async def _verify():
        await connect_client_safely(client)
        try:
            await client.sign_in(clean, code.strip(), phone_code_hash=phone_code_hash)
        except SessionPasswordNeededError:
            return {'requires_2fa': True}
        except PhoneCodeInvalidError:
            return {'error': 'Invalid code. Please check your Telegram app.'}
        except PhoneCodeExpiredError:
            return {'error': 'Code expired. Please request a new code.'}

        me = await client.get_me()
        dialogs = []
        async for d in client.iter_dialogs(limit=100):
            dialogs.append({
                'id': str(d.id),
                'title': d.name or '',
                'username': getattr(d.entity, 'username', '') or '',
                'type': 'channel' if isinstance(d.entity, Channel) else 'group',
                'unread': getattr(d, 'unread_count', 0),
            })
        CLIENT_SESSIONS[clean] = client
        return {
            'success': True,
            'user': me.first_name or '',
            'phone': clean,
            'chats': dialogs,
        }

    try:
        result = run_async(_verify())
        if 'error' in result:
            return jsonify(result), 400
        return jsonify(result)
    except Exception as e:
        traceback.print_exc()
        return jsonify({'error': str(e)}), 500


@app.route('/api/telegram/verify-2fa', methods=['POST'])
def verify_2fa():
    """Step 3 (optional): Submit 2FA cloud password."""
    data     = request.json or {}
    phone    = data.get('phone', '')
    password = data.get('password', '')

    if not phone or not password:
        return jsonify({'error': 'phone and password are required.'}), 400

    clean = clean_phone_number(phone)
    session_info = CLIENT_SESSIONS.get(clean) or CLIENT_SESSIONS.get(phone)
    client = session_info['client'] if isinstance(session_info, dict) else session_info

    if not client:
        return jsonify({'error': 'No active session found.'}), 400

    async def _2fa():
        await connect_client_safely(client)
        await client.sign_in(password=password)
        me = await client.get_me()
        dialogs = []
        async for d in client.iter_dialogs(limit=100):
            dialogs.append({
                'id': str(d.id),
                'title': d.name or '',
                'username': getattr(d.entity, 'username', '') or '',
                'type': 'channel' if isinstance(d.entity, Channel) else 'group',
                'unread': getattr(d, 'unread_count', 0),
            })
        CLIENT_SESSIONS[clean] = client
        return {
            'success': True,
            'user': me.first_name or '',
            'phone': clean,
            'chats': dialogs,
        }

    try:
        result = run_async(_2fa())
        return jsonify(result)
    except Exception as e:
        traceback.print_exc()
        return jsonify({'error': str(e)}), 500


@app.route('/api/telegram/check-session', methods=['POST'])
def check_session():
    """Check if a saved session is still valid (e.g. after Render restart)."""
    data  = request.json or {}
    phone = data.get('phone', '')

    if not phone:
        # Try any session file in SESSION_DIR
        files = [f for f in os.listdir(SESSION_DIR) if f.endswith('.session')]
        if not files:
            return jsonify({'authorized': False})
        phone_from_file = files[0].replace('session_', '').replace('.session', '')
        phone = f"+{phone_from_file}"

    clean = clean_phone_number(phone)
    session_name = f"session_{clean.replace('+', '')}"
    session_file = os.path.join(SESSION_DIR, session_name)

    if not os.path.exists(session_file + '.session'):
        return jsonify({'authorized': False})

    async def _check():
        meta_file = session_file + '.meta.json'
        if not os.path.exists(meta_file):
            return {'authorized': False}
        with open(meta_file, 'r') as f:
            meta = json.load(f)
        client = get_client_for_phone(clean)
        if not client:
            client = TelegramClient(session_file, meta['api_id'], meta['api_hash'], loop=get_event_loop())
        await connect_client_safely(client)
        auth = await client.is_user_authorized()
        if auth:
            me = await client.get_me()
            dialogs = []
            async for d in client.iter_dialogs(limit=100):
                dialogs.append({
                    'id': str(d.id),
                    'title': d.name or '',
                    'username': getattr(d.entity, 'username', '') or '',
                    'type': 'channel' if isinstance(d.entity, Channel) else 'group',
                    'unread': getattr(d, 'unread_count', 0),
                })
            CLIENT_SESSIONS[clean] = client
            return {
                'authorized': True,
                'user': me.first_name or '',
                'phone': clean,
                'chats': dialogs,
            }
        return {'authorized': False}

    try:
        result = run_async(_check())
        return jsonify(result)
    except Exception as e:
        return jsonify({'authorized': False, 'error': str(e)})


@app.route('/api/telegram/fetch-topics', methods=['POST'])
def fetch_topics():
    """
    Check if a channel/group is a forum and return its topics.
    Mirrors desktop app on_fetch_clicked → fetch_forum_topics flow.
    """
    data          = request.json or {}
    channel_input = data.get('channel_input', '').strip()
    phone         = data.get('phone', '')

    if not channel_input:
        return jsonify({'error': 'channel_input is required.'}), 400

    client = get_client_for_phone(phone) or get_any_authorized_client()
    if not client:
        return jsonify({'error': 'No authorized Telegram session. Please connect first.'}), 401

    async def _topics():
        authorized = await ensure_connected(client)
        if not authorized:
            return {'error': 'Session expired. Please reconnect.'}

        # Resolve entity
        try:
            entity = await get_cached_entity(client, channel_input)
            if isinstance(entity, str) or not entity:
                return {'error': f"Cannot find channel: '{channel_input}'"}
        except (ValueError, ChannelPrivateError, UsernameInvalidError, UsernameNotOccupiedError) as e:
            return {'error': f"Cannot find channel: {e}"}
        except Exception as e:
            return {'error': f"Error resolving channel: {e}"}

        channel_info = {
            'id': str(getattr(entity, 'id', '')),
            'title': getattr(entity, 'title', None) or
                     f"{getattr(entity, 'first_name', '')} {getattr(entity, 'last_name', '')}".strip() or
                     getattr(entity, 'username', str(channel_input)),
            'username': getattr(entity, 'username', '') or '',
        }

        # Check if forum (supergroup with forum flag)
        is_forum = getattr(entity, 'forum', False)
        topics = []

        if is_forum:
            # Telethon 1.44 doesn't have GetForumTopicsRequest as a high-level function.
            # We use the raw TL function if available, otherwise gracefully skip topics.
            try:
                from telethon.tl.functions.channels import GetForumTopicsRequest as GFTR
                result = await client(GFTR(
                    channel=entity, offset_date=0, offset_id=0,
                    offset_topic=0, limit=100, q='',
                ))
                for t in result.topics:
                    topics.append({
                        'id': t.id,
                        'title': t.title,
                        'icon_emoji_id': getattr(t, 'icon_emoji_id', None),
                    })
            except ImportError:
                # Older Telethon: use iter_messages with reply_to=1 to scan for topics
                # (The general forum topic list is message 1 in supergroups)
                print("[Topics] GetForumTopicsRequest unavailable, using heuristic detection")
                try:
                    msgs = await client.get_messages(entity, ids=[1])
                    if msgs and hasattr(msgs[0], 'reply_to') and msgs[0].reply_to:
                        # Minimal topic entry for "General" thread
                        topics = [{'id': 1, 'title': 'General', 'icon_emoji_id': None}]
                except Exception:
                    pass
            except Exception as e:
                print(f"[Topics] Forum topics fetch failed: {e}")

        return {
            'channel': channel_info,
            'is_forum': is_forum,
            'topics': topics,
        }

    try:
        result = run_async(_topics())
        if 'error' in result:
            return jsonify(result), 400
        return jsonify(result)
    except Exception as e:
        traceback.print_exc()
        return jsonify({'error': str(e)}), 500


@app.route('/api/telegram/fetch-media', methods=['POST'])
def fetch_media():
    """
    Fetch all 9 media categories for a channel/topic — FAST parallel version.
    Categories: All, Media, Files, ZIPs, Music, Voice, Links, GIFs, Chat
    """
    data          = request.json or {}
    channel_input = data.get('channel_input', '').strip()
    phone         = data.get('phone', '')
    topic_id      = data.get('topic_id')  # int or None
    limit         = int(data.get('limit', 2000))

    if not channel_input:
        return jsonify({'error': 'channel_input is required.'}), 400

    client = get_client_for_phone(phone) or get_any_authorized_client()
    if not client:
        return jsonify({'error': 'No authorized Telegram session. Please connect first.'}), 401

    async def _fetch():
        authorized = await ensure_connected(client)
        if not authorized:
            return {'error': 'Session expired. Please reconnect.'}

        try:
            entity = await get_cached_entity(client, channel_input)
            if isinstance(entity, str) or not entity:
                return {'error': f"Cannot find channel: '{channel_input}'"}
        except Exception as e:
            return {'error': f"Cannot find channel: {e}"}

        channel_info = {
            'id':       str(getattr(entity, 'id', '')),
            'title':    getattr(entity, 'title', None) or
                        f"{getattr(entity, 'first_name', '')} {getattr(entity, 'last_name', '')}".strip() or
                        channel_input,
            'username': getattr(entity, 'username', '') or '',
        }

        topic_kwarg = {'reply_to': int(topic_id)} if topic_id is not None else {}

        # ── SPEED FIX 1: raise semaphore to 3 so up to 3 API calls run in parallel ──
        sem = asyncio.Semaphore(3)

        async def get_msgs(filter_type=None, lim=limit):
            async with sem:
                for attempt in range(3):
                    try:
                        kwargs = {'limit': lim}
                        if filter_type:
                            kwargs['filter'] = filter_type
                        kwargs.update(topic_kwarg)
                        return await client.get_messages(entity, **kwargs)
                    except Exception as e:
                        if 'closed the connection' in str(e).lower() and attempt < 2:
                            await asyncio.sleep(0.8 * (attempt + 1))
                            continue
                        raise
                return []

        # ── SPEED FIX 2: fetch 8 filtered categories in parallel; skip expensive full-chat scan ──
        # Chat (text-only) is built from photos+docs+others overlap — we fetch it separately but
        # only for text messages (no media filter returns texts too); use limit//4 to stay fast.
        (
            photos, videos, round_vids, docs, music, voice, links, gifs
        ) = await asyncio.gather(
            get_msgs(InputMessagesFilterPhotos()),
            get_msgs(InputMessagesFilterVideo()),
            get_msgs(InputMessagesFilterRoundVideo()),
            get_msgs(InputMessagesFilterDocument()),
            get_msgs(InputMessagesFilterMusic()),
            get_msgs(InputMessagesFilterVoice()),
            get_msgs(InputMessagesFilterUrl()),
            get_msgs(InputMessagesFilterGif()),
        )

        ch_id_str = str(getattr(entity, 'id', channel_input))

        def serialize(msgs):
            result = []
            seen = set()
            for m in msgs:
                if not m or m.id in seen:
                    continue
                seen.add(m.id)
                fmt = format_message(m, ch_id_str)
                if fmt:
                    result.append(fmt)
            return result

        # Archive mime types
        archive_mimes = {
            'application/zip', 'application/x-rar-compressed',
            'application/x-7z-compressed', 'application/x-tar',
            'application/gzip', 'application/x-bzip2',
        }

        # Build lists
        media_list = serialize(list(photos) + list(videos) + list(round_vids))
        files_list = serialize(list(docs))
        zips_list  = [m for m in files_list if any(
            (m.get('filename') or '').lower().endswith(ext)
            for ext in ('.zip', '.rar', '.7z', '.tar', '.gz', '.bz2')
        )]
        music_list = serialize(list(music)) + [
            m for m in files_list
            if (m.get('filename') or '').lower().split('.')[-1] in ('mp3','flac','ogg','wav','aac','m4a','opus')
        ]
        # Deduplicate music_list
        seen_music = set()
        music_dedup = []
        for m in music_list:
            if m['id'] not in seen_music:
                seen_music.add(m['id'])
                music_dedup.append(m)
        music_list = music_dedup

        voice_list = serialize(list(voice))
        links_list = serialize(list(links))
        gifs_list  = serialize(list(gifs))

        # Chat: fetch text messages (limited to avoid slowdown)
        # We grab just a modest number of recent messages for the Chat tab
        chat_limit = min(limit, 500)
        try:
            async with sem:
                chat_raw = await client.get_messages(entity, limit=chat_limit, **topic_kwarg)
            chat_list = []
            seen_chat = set()
            for m in chat_raw:
                if m and not m.media and (m.message or '').strip() and m.id not in seen_chat:
                    seen_chat.add(m.id)
                    fmt = format_chat_message(m)
                    if fmt:
                        chat_list.append(fmt)
        except Exception:
            chat_list = []

        # All: union deduplicated by id, sorted by date desc
        all_ids  = set()
        all_list = []
        for lst in [media_list, files_list, music_list, voice_list, links_list, gifs_list, chat_list]:
            for item in lst:
                if item['id'] not in all_ids:
                    all_ids.add(item['id'])
                    all_list.append(item)
        all_list.sort(key=lambda x: x.get('date', ''), reverse=True)

        return {
            'channel': channel_info,
            'categories': {
                'All':   all_list[:limit],
                'Media': media_list[:limit],
                'Files': files_list[:limit],
                'ZIPs':  zips_list[:limit],
                'Music': music_list[:limit],
                'Voice': voice_list[:limit],
                'Links': links_list[:limit],
                'GIFs':  gifs_list[:limit],
                'Chat':  chat_list[:limit],
            },
            'counts': {
                'All':   len(all_list),
                'Media': len(media_list),
                'Files': len(files_list),
                'ZIPs':  len(zips_list),
                'Music': len(music_list),
                'Voice': len(voice_list),
                'Links': len(links_list),
                'GIFs':  len(gifs_list),
                'Chat':  len(chat_list),
            }
        }

    try:
        result = run_async(_fetch())
        if 'error' in result:
            return jsonify(result), 400
        return jsonify(result)
    except Exception as e:
        traceback.print_exc()
        return jsonify({'error': str(e)}), 500



@app.route('/api/telegram/download-file', methods=['GET', 'POST'])
def download_file():
    """
    Serve a downloaded file to the browser.

    Priority 1 — serve from disk if job_id + msg_id are given (fast, no re-download).
    Priority 2 — stream live from Telegram if only channel_input + message_id given.

    GET/POST params:
      job_id      (optional) — returned in file_complete SSE event
      msg_id      (optional) — message id within the job
      channel_input, message_id, filename — used for live-stream fallback
    """
    if request.method == 'POST':
        data = request.json or {}
    else:
        data = request.args

    job_id    = data.get('job_id', '').strip()
    msg_id_str = data.get('msg_id', '').strip()

    # ── PATH 1: serve pre-downloaded file from disk ───────────────────────────
    if job_id and msg_id_str and job_id in DOWNLOAD_FILES:
        file_path = DOWNLOAD_FILES[job_id].get(msg_id_str)
        if file_path and os.path.exists(file_path):
            filename  = os.path.basename(file_path)
            safe_name = filename.replace('"', "'")

            import mimetypes
            mime = mimetypes.guess_type(filename)[0] or 'application/octet-stream'
            file_size = os.path.getsize(file_path)

            def file_generator():
                try:
                    with open(file_path, 'rb') as f:
                        while True:
                            chunk = f.read(1024 * 256)  # 256 KB chunks
                            if not chunk:
                                break
                            yield chunk
                finally:
                    # Clean up file after serving
                    try:
                        os.remove(file_path)
                    except Exception:
                        pass
                    # Remove entry
                    DOWNLOAD_FILES.get(job_id, {}).pop(msg_id_str, None)

            return Response(
                stream_with_context(file_generator()),
                headers={
                    'Content-Disposition': f'attachment; filename="{safe_name}"',
                    'Content-Type':        mime,
                    'Content-Length':      str(file_size),
                    'X-Accel-Buffering':  'no',
                },
                direct_passthrough=True,
            )
        else:
            return jsonify({'error': 'File not found on disk. It may have already been served.'}), 404

    # ── PATH 2: live-stream directly from Telegram (fallback / single-file) ───
    phone         = data.get('phone', '')
    channel_input = data.get('channel_input', '').strip()
    message_id    = data.get('message_id')
    filename      = data.get('filename', 'download')

    if not channel_input or not message_id:
        return jsonify({'error': 'Provide job_id+msg_id (recommended) or channel_input+message_id.'}), 400

    try:
        message_id = int(message_id)
    except (ValueError, TypeError):
        return jsonify({'error': 'message_id must be an integer.'}), 400

    client = get_client_for_phone(phone) or get_any_authorized_client()
    if not client:
        return jsonify({'error': 'No authorized Telegram session.'}), 401

    async def _prepare():
        await ensure_connected(client)
        entity = await get_cached_entity(client, channel_input)
        msg    = await client.get_messages(entity, ids=message_id)
        return msg

    try:
        msg = run_async(_prepare())
    except Exception as e:
        return jsonify({'error': f"Cannot fetch message: {e}"}), 500

    if not msg or not msg.media:
        return jsonify({'error': 'Message has no downloadable media.'}), 404

    mime = 'application/octet-stream'
    file_size = 0
    if hasattr(msg, 'file') and msg.file:
        mime      = getattr(msg.file, 'mime_type', mime) or mime
        file_size = getattr(msg.file, 'size', 0) or 0
    elif hasattr(msg, 'document') and msg.document:
        mime      = getattr(msg.document, 'mime_type', mime) or mime
        file_size = getattr(msg.document, 'size', 0) or 0

    def generate_stream():
        buf        = queue.Queue(maxsize=32)
        done       = threading.Event()
        err_holder = [None]

        async def _download():
            try:
                async for chunk in client.iter_download(msg.media, request_size=1024 * 1024):
                    buf.put(chunk)
            except Exception as ex:
                err_holder[0] = str(ex)
            finally:
                done.set()

        asyncio.run_coroutine_threadsafe(_download(), get_event_loop())

        while not done.is_set() or not buf.empty():
            try:
                yield buf.get(timeout=0.05)
            except queue.Empty:
                continue

        if err_holder[0]:
            print(f"[download_file] Stream error: {err_holder[0]}")

    safe_name = filename.replace('"', "'")
    headers = {
        'Content-Disposition': f'attachment; filename="{safe_name}"',
        'Content-Type':        mime,
        'X-Accel-Buffering':  'no',
    }
    if file_size:
        headers['Content-Length'] = str(file_size)

    return Response(
        stream_with_context(generate_stream()),
        headers=headers,
        direct_passthrough=True,
    )



@app.route('/api/telegram/start-download-job', methods=['POST'])
def start_download_job():
    """
    Start a CONCURRENT batch download job with SSE progress tracking.
    Files are saved to a local temp folder; the browser fetches them via
    /download-file?job_id=...&msg_id=... once each file_complete event fires.
    Downloads up to 4 files simultaneously for maximum throughput.
    """
    data          = request.json or {}
    phone         = data.get('phone', '')
    channel_input = data.get('channel_input', '').strip()
    message_ids   = data.get('message_ids', [])     # list of int IDs
    filenames     = data.get('filenames', {})        # {str(msg_id): filename}
    concurrency   = min(int(data.get('concurrency', 4)), 8)  # max 8 parallel

    if not channel_input or not message_ids:
        return jsonify({'error': 'channel_input and message_ids are required.'}), 400

    client = get_client_for_phone(phone) or get_any_authorized_client()
    if not client:
        return jsonify({'error': 'No authorized Telegram session.'}), 401

    job_id         = f"job_{int(time.time() * 1000)}"
    progress_queue = queue.Queue()
    PROGRESS_QUEUES[job_id] = progress_queue
    # Per-job file store: str(msg_id) -> absolute disk path
    DOWNLOAD_FILES[job_id]  = {}

    # Create a job-specific subdirectory to avoid filename collisions
    job_dir = os.path.join(DOWNLOAD_TEMP_DIR, job_id)
    os.makedirs(job_dir, exist_ok=True)

    async def _do_downloads():
        await ensure_connected(client)
        try:
            entity = await get_cached_entity(client, channel_input)
            if isinstance(entity, str) or not entity:
                progress_queue.put({'type': 'error', 'msg': f"Cannot find channel: '{channel_input}'"})
                return
        except Exception as e:
            progress_queue.put({'type': 'error', 'msg': f"Cannot find channel: {e}"})
            return

        total     = len(message_ids)
        completed = 0
        lock      = asyncio.Lock()

        # Batch-fetch all message metadata in one API call
        try:
            all_msgs = await client.get_messages(entity, ids=[int(mid) for mid in message_ids])
            msgs_map = {m.id: m for m in all_msgs if m}
        except Exception:
            msgs_map = {}

        dl_sem = asyncio.Semaphore(concurrency)

        async def download_one(msg_id):
            nonlocal completed
            async with dl_sem:
                msg = msgs_map.get(int(msg_id))

                if msg is None:
                    try:
                        msg = await client.get_messages(entity, ids=int(msg_id))
                    except Exception as e:
                        async with lock:
                            completed += 1
                        progress_queue.put({'type': 'file_error', 'msg_id': msg_id, 'error': str(e), 'completed': completed, 'total': total})
                        return

                if not msg or not msg.media:
                    async with lock:
                        completed += 1
                    progress_queue.put({'type': 'file_skip', 'msg_id': msg_id, 'completed': completed, 'total': total})
                    return

                fname     = filenames.get(str(msg_id), f"msg_{msg_id}")
                file_size = 0
                if hasattr(msg, 'file') and msg.file:
                    file_size = getattr(msg.file, 'size', 0) or 0
                elif hasattr(msg, 'document') and msg.document:
                    file_size = getattr(msg.document, 'size', 0) or 0

                progress_queue.put({
                    'type': 'file_start', 'msg_id': msg_id,
                    'filename': fname, 'size': file_size,
                    'completed': completed, 'total': total,
                })

                last_t  = [time.time()]
                last_b  = [0]

                def _progress(current, total_bytes):
                    now     = time.time()
                    elapsed = now - last_t[0]
                    if elapsed > 0.3:
                        speed_kb = ((current - last_b[0]) / elapsed) / 1024
                        last_t[0] = now
                        last_b[0] = current
                        speed_str = (f"{speed_kb / 1024:.1f} MB/s" if speed_kb > 1024 else f"{int(speed_kb)} KB/s")
                        progress_queue.put({
                            'type': 'file_progress', 'msg_id': msg_id,
                            'current': current, 'total': total_bytes or file_size,
                            'speed': speed_str,
                        })

                try:
                    # Save file to disk in the job temp dir
                    dest_path = os.path.join(job_dir, fname)
                    await msg.download_media(file=dest_path, progress_callback=_progress)
                    # Record the saved path
                    DOWNLOAD_FILES[job_id][str(msg_id)] = dest_path
                    async with lock:
                        completed += 1
                    progress_queue.put({
                        'type': 'file_complete', 'msg_id': msg_id,
                        'filename': fname, 'size': file_size,
                        'completed': completed, 'total': total,
                        'job_id': job_id,
                    })
                except Exception as e:
                    async with lock:
                        completed += 1
                    progress_queue.put({
                        'type': 'file_error', 'msg_id': msg_id,
                        'error': str(e), 'completed': completed, 'total': total,
                    })

        await asyncio.gather(*[download_one(mid) for mid in message_ids])
        progress_queue.put({'type': 'job_complete', 'total': total})

    # Schedule the async work on the background loop
    asyncio.run_coroutine_threadsafe(_do_downloads(), get_event_loop())

    return jsonify({'job_id': job_id, 'total': len(message_ids)})


@app.route('/api/telegram/cancel-job', methods=['POST'])
def cancel_job():
    """Cancel a running download job and clean up its temp files."""
    data   = request.json or {}
    job_id = data.get('job_id', '')
    if not job_id:
        return jsonify({'error': 'job_id required'}), 400

    # Signal the SSE stream with a cancelled event
    q = PROGRESS_QUEUES.get(job_id)
    if q:
        q.put({'type': 'cancelled'})
        del PROGRESS_QUEUES[job_id]

    # Clean up temp files for this job
    import shutil
    job_dir = os.path.join(DOWNLOAD_TEMP_DIR, job_id)
    if os.path.isdir(job_dir):
        try:
            shutil.rmtree(job_dir)
        except Exception:
            pass
    DOWNLOAD_FILES.pop(job_id, None)

    return jsonify({'ok': True})


@app.route('/api/telegram/progress/<job_id>', methods=['GET'])
def progress_sse(job_id):
    """SSE endpoint — push real-time download progress to the browser."""
    pq = PROGRESS_QUEUES.get(job_id)
    if not pq:
        return jsonify({'error': 'Job not found.'}), 404

    def event_stream():
        while True:
            try:
                event = pq.get(timeout=30)
                yield f"data: {json.dumps(event)}\n\n"
                if event.get('type') in ('job_complete', 'error'):
                    PROGRESS_QUEUES.pop(job_id, None)
                    break
            except queue.Empty:
                yield ": keepalive\n\n"

    return Response(
        stream_with_context(event_stream()),
        content_type='text/event-stream',
        headers={
            'Cache-Control': 'no-cache',
            'X-Accel-Buffering': 'no',
        }
    )


@app.route('/api/telegram/disconnect', methods=['POST'])
def disconnect():
    """Log out of the current Telethon session."""
    data  = request.json or {}
    phone = data.get('phone', '')
    clean = clean_phone_number(phone) if phone else ''

    async def _disconnect():
        client = get_client_for_phone(phone) or get_any_authorized_client()
        if client:
            await client.log_out()
        # Remove session files
        if clean:
            session_name = f"session_{clean.replace('+', '')}"
            for ext in ['.session', '.meta.json']:
                f = os.path.join(SESSION_DIR, session_name + ext)
                if os.path.exists(f):
                    os.remove(f)
            CLIENT_SESSIONS.pop(clean, None)
            CLIENT_SESSIONS.pop(phone, None)

    try:
        run_async(_disconnect())
        return jsonify({'success': True})
    except Exception as e:
        return jsonify({'error': str(e)}), 500


# ─── Save meta (api_id/hash) alongside session file ──────────────────────────
def _save_session_meta(phone_clean: str, api_id: int, api_hash: str):
    session_name = f"session_{phone_clean.replace('+', '')}"
    meta_file = os.path.join(SESSION_DIR, session_name + '.meta.json')
    with open(meta_file, 'w') as f:
        json.dump({'api_id': api_id, 'api_hash': api_hash, 'phone': phone_clean}, f)


@app.route('/api/telegram/save-meta', methods=['POST'])
def save_meta():
    """Save api_id/api_hash alongside session file for reconnect after Render restart."""
    data  = request.json or {}
    phone = data.get('phone', '')
    api_id = data.get('api_id')
    api_hash = data.get('api_hash', '')
    if not phone or not api_id:
        return jsonify({'error': 'phone and api_id required'}), 400
    clean = clean_phone_number(phone)
    try:
        _save_session_meta(clean, int(api_id), str(api_hash))
        return jsonify({'success': True})
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/api/telegram/settings', methods=['POST'])
def update_settings():
    """Update global application settings."""
    data = request.json or {}
    # Placeholder implementation
    return jsonify({'success': True})


if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    print(f"[TG Backend] Starting on port {port}")
    app.run(host='0.0.0.0', port=port, debug=False, threaded=True)
