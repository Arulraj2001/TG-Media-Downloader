/**
 * SettingsView — mirrors desktop app settings_view.py exactly.
 *
 * Sections:
 *   1. Downloads — folder path (informational), forum sep, rename dupes, msg date
 *   2. Network   — proxy toggle, type, host, port, user, password
 *   3. Speed & Limits — concurrent downloads, speed limit KB/s, fetch limit
 *   4. Danger zone — Disconnect Telegram (logout)
 *
 * Settings persist to localStorage under key 'tg_downloader_settings'.
 */
import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import SeoMeta from '../components/SeoMeta'
import { useAuth } from '../context/AuthContext'
import {
  Settings, Save, LogOut, FolderOpen, ShieldAlert,
  CheckCircle2, AlertTriangle, ToggleLeft, ToggleRight
} from 'lucide-react'

const SETTINGS_KEY = 'tg_downloader_settings'

export function loadSettings() {
  try {
    const saved = localStorage.getItem(SETTINGS_KEY)
    return saved ? { ...defaultSettings(), ...JSON.parse(saved) } : defaultSettings()
  } catch {
    return defaultSettings()
  }
}

function defaultSettings() {
  return {
    download_path: 'downloads',
    download_limit: 4,
    initial_fetch_limit: 2000,
    max_speed_kb: 0,
    forum_auto_separation: false,
    rename_duplicates: true,
    use_message_date: true,
    proxy: {
      enabled: false,
      type: 'SOCKS5',
      host: '',
      port: '',
      user: '',
      pass: '',
    },
  }
}

function saveSettings(s) {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(s))
}

// Toggle switch — same visual as desktop ToggleSwitch
function Toggle({ value, onChange, label, description }) {
  return (
    <div className="flex items-start justify-between gap-4 py-3.5" style={{ borderBottom: '1px solid var(--border-subtle)' }}>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-current">{label}</p>
        {description && <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>{description}</p>}
      </div>
      <button
        onClick={() => onChange(!value)}
        className={`relative inline-flex h-6 w-11 flex-shrink-0 rounded-full transition-colors duration-200 focus:outline-none ${value ? 'bg-[#635BFF]' : 'bg-slate-300 dark:bg-slate-600'}`}
        role="switch" aria-checked={value}>
        <span className={`inline-block h-5 w-5 rounded-full bg-white shadow transform transition-transform duration-200 mt-0.5 ${value ? 'translate-x-5' : 'translate-x-0.5'}`} />
      </button>
    </div>
  )
}

function SectionCard({ title, subtitle, children }) {
  return (
    <div className="glass-panel overflow-hidden p-0">
      <div className="px-6 py-4" style={{ borderBottom: '1px solid var(--border-subtle)' }}>
        <h2 className="text-sm font-bold text-current">{title}</h2>
        {subtitle && <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>{subtitle}</p>}
      </div>
      <div className="px-6 py-2">{children}</div>
    </div>
  )
}

export default function SettingsView() {
  const { tgSession, disconnectTelegram } = useAuth()
  const navigate = useNavigate()

  const [cfg, setCfg]         = useState(loadSettings)
  const [saved, setSaved]     = useState(false)
  const [confirmLogout, setConfirmLogout] = useState(false)

  const update = (key, value) => setCfg(prev => ({ ...prev, [key]: value }))
  const updateProxy = (key, value) => setCfg(prev => ({ ...prev, proxy: { ...prev.proxy, [key]: value } }))

  const handleSave = () => {
    saveSettings(cfg)
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  const handleDisconnect = async () => {
    if (!confirmLogout) { setConfirmLogout(true); return }
    await disconnectTelegram()
    setConfirmLogout(false)
    navigate('/downloader')
  }

  const inputCls = 'glass-input w-full px-3 py-2 text-sm focus:outline-none focus:border-[#635BFF]'

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-6">
      <SeoMeta
        title="Settings — TG Media Downloader"
        description="Configure download path, speed limits, proxy, and Telegram session settings."
        noIndex
      />

      {/* Page header */}
      <div className="flex items-center gap-3 mb-2">
        <div className="w-10 h-10 rounded-xl bg-[#635BFF]/10 flex items-center justify-center">
          <Settings className="w-5 h-5 text-[#635BFF]" />
        </div>
        <div>
          <h1 className="text-2xl font-black text-current tracking-tight">Settings</h1>
          <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Folders, network, and download limits</p>
        </div>
      </div>

      {/* 1 — Downloads */}
      <SectionCard title="Downloads" subtitle="Folder, file names, and date options">
        <div className="py-3.5" style={{ borderBottom: '1px solid var(--border-subtle)' }}>
          <label className="text-xs font-semibold uppercase tracking-wider block mb-2" style={{ color: 'var(--text-muted)' }}>
            Save files in
          </label>
          <div className="flex gap-2">
            <input type="text" value={cfg.download_path}
              onChange={e => update('download_path', e.target.value)}
              placeholder="downloads" className={inputCls + ' flex-1'} />
          </div>
          <p className="text-[11px] mt-2" style={{ color: 'var(--text-muted)' }}>
            Folder variables: {'{channel}'}, {'{username}'}, {'{channel_id}'}, {'{category}'}, {'{year}'}, {'{month}'}, {'{day}'}
          </p>
        </div>

        <Toggle
          value={cfg.forum_auto_separation}
          onChange={v => update('forum_auto_separation', v)}
          label="Separate forum topics"
          description="Save each forum topic in its own folder."
        />
        <Toggle
          value={cfg.rename_duplicates}
          onChange={v => update('rename_duplicates', v)}
          label="Keep duplicate files"
          description="Add a number to repeated file names instead of replacing a file."
        />
        <Toggle
          value={cfg.use_message_date}
          onChange={v => update('use_message_date', v)}
          label="Use the Telegram message date"
          description="Set each downloaded file's date to the date of its Telegram message."
        />
      </SectionCard>

      {/* 2 — Network */}
      <SectionCard title="Network" subtitle="Optional proxy settings">
        <Toggle
          value={cfg.proxy.enabled}
          onChange={v => updateProxy('enabled', v)}
          label="Use a proxy"
          description="Send Telegram traffic through the proxy below."
        />
        {cfg.proxy.enabled && (
          <div className="py-4 space-y-3">
            <div className="flex gap-2">
              <div className="w-32">
                <label className="text-[10px] uppercase font-mono font-bold block mb-1.5" style={{ color: 'var(--text-muted)' }}>Type</label>
                <select value={cfg.proxy.type} onChange={e => updateProxy('type', e.target.value)}
                  className="glass-input w-full px-2 py-2 text-sm focus:outline-none">
                  <option>SOCKS5</option><option>SOCKS4</option><option>HTTP</option>
                </select>
              </div>
              <div className="flex-1">
                <label className="text-[10px] uppercase font-mono font-bold block mb-1.5" style={{ color: 'var(--text-muted)' }}>Host or IP address</label>
                <input type="text" placeholder="127.0.0.1" value={cfg.proxy.host}
                  onChange={e => updateProxy('host', e.target.value)} className={inputCls} />
              </div>
              <div className="w-24">
                <label className="text-[10px] uppercase font-mono font-bold block mb-1.5" style={{ color: 'var(--text-muted)' }}>Port</label>
                <input type="number" placeholder="1080" value={cfg.proxy.port}
                  onChange={e => updateProxy('port', e.target.value)} className={inputCls} />
              </div>
            </div>
            <div className="flex gap-2">
              <div className="flex-1">
                <label className="text-[10px] uppercase font-mono font-bold block mb-1.5" style={{ color: 'var(--text-muted)' }}>Username (optional)</label>
                <input type="text" value={cfg.proxy.user}
                  onChange={e => updateProxy('user', e.target.value)} className={inputCls} />
              </div>
              <div className="flex-1">
                <label className="text-[10px] uppercase font-mono font-bold block mb-1.5" style={{ color: 'var(--text-muted)' }}>Password (optional)</label>
                <input type="password" value={cfg.proxy.pass}
                  onChange={e => updateProxy('pass', e.target.value)} className={inputCls} />
              </div>
            </div>
          </div>
        )}
      </SectionCard>

      {/* 3 — Speed & Limits */}
      <SectionCard title="Speed & Limits" subtitle="Control scan size and download throughput">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 py-4">
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider block mb-2" style={{ color: 'var(--text-muted)' }}>
              Downloads at same time
            </label>
            <input type="number" min="1" max="8" value={cfg.download_limit}
              onChange={e => update('download_limit', Math.min(8, Math.max(1, parseInt(e.target.value) || 1)))}
              className={inputCls} />
            <p className="text-[11px] mt-1.5" style={{ color: 'var(--text-muted)' }}>Max: 8</p>
          </div>
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider block mb-2" style={{ color: 'var(--text-muted)' }}>
              Speed limit (KB/s)
            </label>
            <input type="number" min="0" value={cfg.max_speed_kb}
              onChange={e => update('max_speed_kb', Math.max(0, parseInt(e.target.value) || 0))}
              className={inputCls} placeholder="0 = unlimited" />
            <p className="text-[11px] mt-1.5" style={{ color: 'var(--text-muted)' }}>0 = Unlimited</p>
          </div>
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider block mb-2" style={{ color: 'var(--text-muted)' }}>
              Items scanned per type
            </label>
            <input type="number" min="10" max="50000" value={cfg.initial_fetch_limit}
              onChange={e => update('initial_fetch_limit', Math.min(50000, Math.max(10, parseInt(e.target.value) || 2000)))}
              className={inputCls} />
            <p className="text-[11px] mt-1.5" style={{ color: 'var(--text-muted)' }}>10–50000</p>
          </div>
        </div>
        <p className="text-xs pb-4" style={{ color: 'var(--text-muted)' }}>
          More connections can be faster. A larger scan finds older files but takes more time.
        </p>
      </SectionCard>

      {/* Save button */}
      <div className="flex justify-end">
        <button onClick={handleSave}
          className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm transition-all ${saved ? 'bg-emerald-500 text-white' : 'btn-fintech-primary'}`}>
          {saved ? <CheckCircle2 className="w-4 h-4" /> : <Save className="w-4 h-4" />}
          {saved ? 'Saved!' : 'Save changes'}
        </button>
      </div>

      {/* 4 — Danger zone */}
      <div className="glass-panel border-red-500/20 overflow-hidden p-0" style={{ borderColor: 'rgba(239,68,68,0.2)' }}>
        <div className="px-6 py-5 flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <ShieldAlert className="w-4 h-4 text-red-500" />
              <h3 className="font-bold text-sm text-red-600 dark:text-red-400">
                {tgSession.connected ? 'Log out of Telegram' : 'Telegram session'}
              </h3>
            </div>
            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
              {tgSession.connected
                ? `Connected as ${tgSession.phone || 'unknown'}. This will clear your local session and close the connection.`
                : 'No active Telegram session.'}
            </p>
            {confirmLogout && (
              <p className="text-xs text-red-500 font-semibold mt-2">
                ⚠ Click again to confirm — this cannot be undone.
              </p>
            )}
          </div>
          {tgSession.connected ? (
            <button onClick={handleDisconnect}
              className={`flex-shrink-0 flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition-all ${confirmLogout ? 'bg-red-600 text-white' : 'border border-red-500/30 text-red-600 dark:text-red-400 hover:bg-red-500/10'}`}>
              <LogOut className="w-4 h-4" />
              {confirmLogout ? 'Confirm logout' : 'Log out'}
            </button>
          ) : (
            <span className="text-xs px-3 py-1.5 rounded-lg border text-emerald-600 dark:text-emerald-400 border-emerald-500/20 bg-emerald-500/5">No session</span>
          )}
        </div>
      </div>
    </div>
  )
}
