/**
 * DownloaderView — mirrors desktop app main_window.py + media_browser.py exactly.
 *
 * Flow:
 *   1. Auth: StepConnect (API ID + Hash + Phone) → StepOTP → Step2FA → connected
 *   2. Find media: channel input → fetch-topics → (topic picker if forum) → fetch-media
 *   3. Bulk view (default): Category checkboxes → "Download selected categories"
 *      OR "Load specific files" → switches to Tabs view
 *   4. Tabs view: 9 tabs (All/Media/Files/ZIPs/Music/Voice/Links/GIFs/Chat)
 *      Per-tab toolbar: Select All | Select Visible | Clear All + Sort by + Asc/Desc
 *      Advanced filters: search, date range, size MB, regex
 *      Batch action bar: selected count (green) + Download selected
 *   5. Download → POST /start-download-job → SSE progress → QueueView
 */
import React, { useState, useEffect, useRef, useCallback } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useApp } from '../context/AppContext'
import { useDownloads } from '../context/DownloadContext'
import { loadSettings } from './SettingsView'
import SeoMeta from '../components/SeoMeta'
import { triggerCoffeeModal } from '../components/BuyMeACoffeeWidget'
import {
  Download, ShieldCheck, Key, Phone, Hash, Search,
  ArrowRight, CheckCircle2, Film, FileText, Music, Archive,
  Globe, MessageSquare, Mic, Sparkles, X, ExternalLink,
  Filter, SortAsc, SortDesc, RefreshCw, Loader2,
  AlertCircle, List, Layers, CheckSquare, Square, Eye
} from 'lucide-react'

const CATEGORY_TABS = [
  { key: 'All',   label: 'All',      icon: Sparkles     },
  { key: 'Media', label: 'Media',    icon: Film         },
  { key: 'Files', label: 'Files',    icon: FileText     },
  { key: 'ZIPs',  label: 'Archives', icon: Archive      },
  { key: 'Music', label: 'Music',    icon: Music        },
  { key: 'Voice', label: 'Voice',    icon: Mic          },
  { key: 'Links', label: 'Links',    icon: Globe        },
  { key: 'GIFs',  label: 'GIFs',     icon: Sparkles     },
  { key: 'Chat',  label: 'Chat',     icon: MessageSquare },
]

const BULK_CATEGORIES = [
  { id: 'all_media', label: 'All media (images and videos)', default: true  },
  { id: 'images',    label: 'Images only',                   default: false },
  { id: 'videos',    label: 'Videos only',                   default: false },
  { id: 'files',     label: 'Files and documents',           default: false },
  { id: 'audio',     label: 'Audio and voice',               default: false },
]

function formatSize(bytes) {
  if (!bytes || bytes === 0) return '—'
  if (bytes >= 1073741824) return (bytes / 1073741824).toFixed(2) + ' GB'
  if (bytes >= 1048576)    return (bytes / 1048576).toFixed(1) + ' MB'
  if (bytes >= 1024)       return (bytes / 1024).toFixed(0) + ' KB'
  return bytes + ' B'
}

function getTypeBadge(msg) {
  const ext = (msg.filename || '').split('.').pop().toLowerCase()
  if (['mp4','mkv','avi','mov','webm'].includes(ext))               return { label: 'VID', cls: 'bg-purple-500/15 text-purple-600 dark:text-purple-400' }
  if (['jpg','jpeg','png','gif','webp','heic'].includes(ext))       return { label: 'IMG', cls: 'bg-blue-500/15 text-blue-600 dark:text-blue-400' }
  if (['mp3','flac','ogg','wav','aac','m4a'].includes(ext))         return { label: 'AUD', cls: 'bg-green-500/15 text-green-600 dark:text-green-400' }
  if (['zip','rar','7z','tar','gz'].includes(ext))                  return { label: 'ZIP', cls: 'bg-amber-500/15 text-amber-600 dark:text-amber-400' }
  if (['pdf','doc','docx','xls','xlsx','ppt','pptx','txt'].includes(ext)) return { label: 'DOC', cls: 'bg-red-500/15 text-red-600 dark:text-red-400' }
  if (msg.type === 'voice')  return { label: 'VOC', cls: 'bg-teal-500/15 text-teal-600 dark:text-teal-400' }
  if (msg.type === 'links')  return { label: 'URL', cls: 'bg-indigo-500/15 text-indigo-600 dark:text-indigo-400' }
  if (msg.type === 'gifs')   return { label: 'GIF', cls: 'bg-pink-500/15 text-pink-600 dark:text-pink-400' }
  return { label: 'DOC', cls: 'bg-slate-200/80 dark:bg-slate-500/15 text-slate-600 dark:text-slate-400' }
}

// ─── Auth Step 1 ───────────────────────────────────────────────────────────────
function StepConnect({ tgSession, onSendCode, loading, error }) {
  const [apiId, setApiId]     = useState(tgSession.apiId   || '')
  const [apiHash, setApiHash] = useState(tgSession.apiHash || '')
  const [phone, setPhone]     = useState(tgSession.phone   || '')

  const handleSubmit = (e) => { e.preventDefault(); if (!apiId || !apiHash || !phone) return; onSendCode(apiId, apiHash, phone) }

  return (
    <div className="max-w-5xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* LEFT COLUMN: Connect Form */}
        <div className="lg:col-span-6 glass-panel p-6 sm:p-8 space-y-6">
          <div>
            <span className="text-xs font-mono font-bold text-[#635BFF] bg-[#635BFF]/10 px-2.5 py-1 rounded-md border border-[#635BFF]/20">
              STEP 1 OF 3
            </span>
            <h2 className="text-2xl font-black text-current mt-3 tracking-tight font-display">
              Connect Telegram Session
            </h2>
            <p className="text-xs sm:text-sm mt-1" style={{ color: 'var(--text-muted)' }}>
              Enter your Telegram MTProto API credentials to authorize your browser stream.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {[
              { label: 'API ID',       icon: Key,   val: apiId,   set: setApiId,   ph: 'e.g. 12345678',                     type: 'text' },
              { label: 'API Hash',     icon: Hash,  val: apiHash, set: setApiHash, ph: 'e.g. 0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d', type: 'text' },
              { label: 'Phone Number', icon: Phone, val: phone,   set: setPhone,   ph: 'e.g. +91 98765 43210 (with country code)', type: 'tel'  },
            ].map(({ label, icon: Icon, val, set, ph, type }) => (
              <div key={label}>
                <label className="block text-xs font-semibold mb-1.5 uppercase tracking-wider font-mono" style={{ color: 'var(--text-muted)' }}>
                  {label} *
                </label>
                <div className="relative">
                  <Icon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'var(--text-muted)' }} />
                  <input
                    type={type}
                    placeholder={ph}
                    value={val}
                    onChange={e => set(e.target.value)}
                    className="glass-input w-full pl-10 pr-4 py-3 text-sm font-mono"
                  />
                </div>
              </div>
            ))}

            {error && <ErrorBox msg={error} />}

            <button
              type="submit"
              disabled={loading || !apiId || !apiHash || !phone}
              className="btn-fintech-primary w-full py-3.5 text-sm font-bold disabled:opacity-50 flex items-center justify-center gap-2 rounded-xl shadow-lg shadow-[#635BFF]/25 hover:scale-[1.01] active:scale-95 transition-all"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ArrowRight className="w-4 h-4" />}
              <span>{loading ? 'Sending Verification Code...' : 'Send Verification Code'}</span>
            </button>
          </form>

          {/* Privacy badge */}
          <div className="flex items-center gap-2 text-xs font-mono text-emerald-500 pt-2 border-t border-slate-200/50 dark:border-white/10">
            <ShieldCheck className="w-4 h-4 flex-shrink-0" />
            <span>Direct Client-Side MTProto Connection — Keys Never Saved</span>
          </div>
        </div>

        {/* RIGHT COLUMN: Detailed API ID & Hash Creation Guide */}
        <div className="lg:col-span-6 glass-panel p-6 sm:p-8 space-y-5 border border-amber-500/20 bg-gradient-to-b from-amber-500/5 via-transparent to-transparent">
          
          <div className="flex items-center justify-between border-b border-slate-200/80 dark:border-white/10 pb-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-500 flex items-center justify-center font-bold">
                <Key className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-display font-extrabold text-lg text-current leading-tight">
                  How to Get API ID &amp; Hash
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-mono">
                  Official 2-minute setup from my.telegram.org
                </p>
              </div>
            </div>

            <a
              href="https://my.telegram.org"
              target="_blank"
              rel="noreferrer"
              className="btn-fintech-secondary px-3 py-1.5 rounded-lg text-xs font-mono font-bold flex items-center gap-1 text-[#635BFF] hover:scale-105 transition-transform"
            >
              <span>my.telegram.org</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          <div className="space-y-3.5 text-xs">
            
            {/* Step 1 */}
            <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-100/80 dark:bg-white/[0.03] border border-slate-200/80 dark:border-white/10">
              <span className="w-6 h-6 rounded-full bg-[#635BFF] text-white font-mono font-extrabold flex items-center justify-center flex-shrink-0 text-[11px]">
                1
              </span>
              <div className="space-y-0.5 leading-relaxed">
                <strong className="text-current font-bold text-sm block">Visit my.telegram.org &amp; Sign In</strong>
                <span className="text-slate-600 dark:text-slate-300">
                  Open <a href="https://my.telegram.org" target="_blank" rel="noreferrer" className="text-[#635BFF] underline font-bold">my.telegram.org</a> in your web browser. Enter your Telegram phone number with country code (e.g. <code className="font-mono bg-slate-200 dark:bg-white/10 px-1 py-0.5 rounded text-[11px]">+1 234567890</code> or <code className="font-mono bg-slate-200 dark:bg-white/10 px-1 py-0.5 rounded text-[11px]">+91 9876543210</code>) and click Next.
                </span>
              </div>
            </div>

            {/* Step 2 */}
            <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-100/80 dark:bg-white/[0.03] border border-slate-200/80 dark:border-white/10">
              <span className="w-6 h-6 rounded-full bg-[#635BFF] text-white font-mono font-extrabold flex items-center justify-center flex-shrink-0 text-[11px]">
                2
              </span>
              <div className="space-y-0.5 leading-relaxed">
                <strong className="text-current font-bold text-sm block">Get Code in Official Telegram App</strong>
                <span className="text-slate-600 dark:text-slate-300">
                  Telegram will send a login confirmation code directly to your official Telegram app (on phone or desktop). <em className="text-amber-500 font-medium">Check your chat list for the official Telegram service notification.</em>
                </span>
              </div>
            </div>

            {/* Step 3 */}
            <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-100/80 dark:bg-white/[0.03] border border-slate-200/80 dark:border-white/10">
              <span className="w-6 h-6 rounded-full bg-[#635BFF] text-white font-mono font-extrabold flex items-center justify-center flex-shrink-0 text-[11px]">
                3
              </span>
              <div className="space-y-0.5 leading-relaxed">
                <strong className="text-current font-bold text-sm block">Go to "API Development Tools"</strong>
                <span className="text-slate-600 dark:text-slate-300">
                  Paste the confirmation code on the website and click <strong className="text-current">Sign In</strong>. On the main menu dashboard, click on <strong className="text-[#635BFF]">"API development tools"</strong>.
                </span>
              </div>
            </div>

            {/* Step 4 */}
            <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-100/80 dark:bg-white/[0.03] border border-slate-200/80 dark:border-white/10">
              <span className="w-6 h-6 rounded-full bg-[#635BFF] text-white font-mono font-extrabold flex items-center justify-center flex-shrink-0 text-[11px]">
                4
              </span>
              <div className="space-y-0.5 leading-relaxed">
                <strong className="text-current font-bold text-sm block">Create New Application</strong>
                <span className="text-slate-600 dark:text-slate-300">
                  Fill in <strong className="text-current">App title</strong> (e.g. <code className="font-mono bg-slate-200 dark:bg-white/10 px-1 py-0.5 rounded text-[11px]">MyDownloader</code>) &amp; <strong className="text-current">Short name</strong> (e.g. <code className="font-mono bg-slate-200 dark:bg-white/10 px-1 py-0.5 rounded text-[11px]">mydownloader</code>). Leave platform as <strong className="text-current">Desktop</strong> and click <strong className="text-emerald-500">Create application</strong>.
                </span>
              </div>
            </div>

            {/* Step 5 */}
            <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-100/80 dark:bg-white/[0.03] border border-slate-200/80 dark:border-white/10">
              <span className="w-6 h-6 rounded-full bg-[#635BFF] text-white font-mono font-extrabold flex items-center justify-center flex-shrink-0 text-[11px]">
                5
              </span>
              <div className="space-y-0.5 leading-relaxed">
                <strong className="text-current font-bold text-sm block">Copy API ID &amp; API Hash</strong>
                <span className="text-slate-600 dark:text-slate-300">
                  Copy your numerical <strong className="text-[#635BFF]">App api_id</strong> and 32-character <strong className="text-[#635BFF]">App api_hash</strong> strings, and paste them into the input fields on the left!
                </span>
              </div>
            </div>

          </div>

          {/* Quick direct link CTA */}
          <div className="p-3.5 rounded-xl bg-[#635BFF]/10 border border-[#635BFF]/25 flex items-center justify-between gap-3 text-xs">
            <span className="font-mono text-[#635BFF] font-bold">Ready to get your API keys?</span>
            <a
              href="https://my.telegram.org"
              target="_blank"
              rel="noreferrer"
              className="btn-fintech-primary text-xs px-3 py-1.5 gap-1.5 flex items-center rounded-lg flex-shrink-0 font-bold"
            >
              <span>Open my.telegram.org</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

        </div>

      </div>
    </div>
  )
}

// ─── Auth Step 2 ───────────────────────────────────────────────────────────────
function StepOTP({ phone, onVerifyCode, onBack, loading, error }) {
  const [code, setCode] = useState('')
  const handleSubmit = (e) => { e.preventDefault(); if (!code.trim()) return; onVerifyCode(code.trim()) }
  return (
    <div className="max-w-lg mx-auto">
      <div className="glass-panel p-8">
        <div className="mb-6">
          <span className="text-xs font-mono text-[#635BFF] bg-[#635BFF]/10 px-2 py-0.5 rounded-md border border-[#635BFF]/20">STEP 2 OF 3</span>
          <h2 className="text-2xl font-black text-current mt-3 tracking-tight">Enter Verification Code</h2>
          <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>
            Telegram sent a code to <strong className="text-current font-mono">{phone}</strong>.<br />
            Check your <strong className="text-current">Telegram app</strong> (not SMS).
          </p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="text" inputMode="numeric" placeholder="12345" maxLength={8} value={code}
            onChange={e => setCode(e.target.value.replace(/\D/g, ''))} autoFocus
            className="glass-input w-full px-4 py-4 text-2xl font-mono text-center tracking-[0.5em]" />
          {error && <ErrorBox msg={error} />}
          <button type="submit" disabled={loading || code.length < 4} className="btn-fintech-primary w-full py-3 disabled:opacity-50 gap-2">
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
            {loading ? 'Verifying...' : 'Verify and log in'}
          </button>
          <button type="button" onClick={onBack} className="w-full text-sm py-2 transition-colors" style={{ color: 'var(--text-muted)' }}>← Back / Re-enter phone</button>
        </form>
      </div>
    </div>
  )
}

// ─── Auth Step 3: 2FA ─────────────────────────────────────────────────────────
function Step2FA({ onVerify2FA, onBack, loading, error }) {
  const [password, setPassword] = useState('')
  const handleSubmit = (e) => { e.preventDefault(); if (!password) return; onVerify2FA(password) }
  return (
    <div className="max-w-lg mx-auto">
      <div className="glass-panel p-8">
        <div className="mb-6">
          <span className="text-xs font-mono text-amber-600 dark:text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-md border border-amber-500/20">2FA REQUIRED</span>
          <h2 className="text-2xl font-black text-current mt-3 tracking-tight">Two-Factor Password</h2>
          <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>Your account has 2FA enabled. Enter your cloud password.</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="password" placeholder="Enter your 2FA password" value={password}
            onChange={e => setPassword(e.target.value)} autoFocus
            className="glass-input w-full px-4 py-3 text-sm" />
          {error && <ErrorBox msg={error} />}
          <button type="submit" disabled={loading || !password}
            className="w-full py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all disabled:opacity-50 bg-amber-500 hover:bg-amber-400 text-white">
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ShieldCheck className="w-4 h-4" />}
            {loading ? 'Verifying...' : 'Confirm password'}
          </button>
          <button type="button" onClick={onBack} className="w-full text-sm py-2 transition-colors" style={{ color: 'var(--text-muted)' }}>← Back</button>
        </form>
      </div>
    </div>
  )
}

// ─── Error box ────────────────────────────────────────────────────────────────
function ErrorBox({ msg }) {
  return (
    <div className="rounded-xl p-3 text-sm flex gap-2 items-start bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400">
      <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />{msg}
    </div>
  )
}

// ─── Forum Topic Picker ────────────────────────────────────────────────────────
function TopicPickerModal({ topics, channelTitle, onSelect, onCancel }) {
  const [selected, setSelected] = useState(null)
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="glass-panel p-6 w-full max-w-sm shadow-2xl">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-bold text-current">Forum Topics</h3>
            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{channelTitle} · Select a topic</p>
          </div>
          <button onClick={onCancel} className="hover:text-[#635BFF] transition-colors" style={{ color: 'var(--text-muted)' }}><X className="w-5 h-5" /></button>
        </div>
        <div className="space-y-1 max-h-64 overflow-y-auto pr-1">
          <button onClick={() => setSelected(null)}
            className={`w-full text-left px-3 py-2.5 rounded-xl text-sm transition-all ${selected === null ? 'bg-[#635BFF] text-white' : 'hover:bg-[#635BFF]/10 text-current'}`}>
            All topics (no filter)
          </button>
          {topics.map(t => (
            <button key={t.id} onClick={() => setSelected(t.id)}
              className={`w-full text-left px-3 py-2.5 rounded-xl text-sm transition-all ${selected === t.id ? 'bg-[#635BFF] text-white' : 'hover:bg-[#635BFF]/10 text-current'}`}>
              # {t.title}
            </button>
          ))}
        </div>
        <div className="flex gap-2 mt-4">
          <button onClick={onCancel} className="btn-fintech-secondary flex-1 py-2.5 text-sm">Cancel</button>
          <button onClick={() => onSelect(selected)} className="btn-fintech-primary flex-1 py-2.5 text-sm">Continue</button>
        </div>
      </div>
    </div>
  )
}

// ─── Media Row ────────────────────────────────────────────────────────────────
function MediaRow({ msg, selected, onToggle }) {
  const badge = getTypeBadge(msg)
  return (
    <div onClick={onToggle}
      className={`flex items-center gap-3 px-4 py-3 cursor-pointer transition-all border-b ${selected ? 'bg-[#635BFF]/5' : 'hover:bg-[var(--card-hover,rgba(0,0,0,0.02))]'}`}
      style={{ borderColor: 'var(--border-subtle)' }}>
      <div className="flex-shrink-0" onClick={e => { e.stopPropagation(); onToggle() }}>
        {selected
          ? <CheckSquare className="w-4 h-4 text-[#635BFF]" />
          : <Square className="w-4 h-4" style={{ color: 'var(--text-muted)' }} />}
      </div>
      <span className={`flex-shrink-0 px-1.5 py-0.5 rounded text-[10px] font-mono font-bold ${badge.cls}`}>{badge.label}</span>
      <div className="flex-1 min-w-0">
        <p className="text-current text-xs font-medium truncate" title={msg.filename}>{msg.filename || `Message #${msg.id}`}</p>
        {msg.caption && <p className="text-[10px] truncate mt-0.5" style={{ color: 'var(--text-muted)' }}>{msg.caption}</p>}
      </div>
      <span className="text-xs font-mono whitespace-nowrap flex-shrink-0" style={{ color: 'var(--text-muted)' }}>{formatSize(msg.size)}</span>
      <span className="text-xs font-mono whitespace-nowrap hidden sm:block flex-shrink-0" style={{ color: 'var(--text-muted)' }}>
        {msg.date?.slice(0, 10)}
      </span>
    </div>
  )
}

// ─── Media browser (after channel found) ─────────────────────────────────────
function MediaBrowser({ channelInput, channelTitle, categories, initialTopicId, onRefresh }) {
  const { BACKEND } = useAuth()
  const { downloaderCache, updateDownloaderCache } = useApp()
  const navigate = useNavigate()
  const { startJob } = useDownloads()
  const backendUrl  = BACKEND || 'http://localhost:5000'

  // View mode
  const browserView = downloaderCache.browserView || 'bulk'
  const setBrowserView = (val) => updateDownloaderCache({ browserView: typeof val === 'function' ? val(downloaderCache.browserView || 'bulk') : val })
  const [selectedTopicId] = useState(initialTopicId)

  // Tabs
  const activeTab = downloaderCache.activeTab || 'All'
  const setActiveTab = (val) => updateDownloaderCache({ activeTab: typeof val === 'function' ? val(downloaderCache.activeTab || 'All') : val })
  const selectedIds = downloaderCache.selectedIds || []
  const setSelectedIds = (val) => updateDownloaderCache({ selectedIds: typeof val === 'function' ? val(downloaderCache.selectedIds || []) : val })

  // Filters (per search, date, size, regex)
  const searchQuery = downloaderCache.searchQuery || ''
  const setSearchQuery = (val) => updateDownloaderCache({ searchQuery: typeof val === 'function' ? val(downloaderCache.searchQuery || '') : val })
  const [showFilters, setShowFilters]     = useState(false)
  const [dateStart, setDateStart]         = useState('')
  const [dateEnd, setDateEnd]             = useState('')
  const [minSizeMB, setMinSizeMB]         = useState('')
  const [maxSizeMB, setMaxSizeMB]         = useState('')
  const [regexPattern, setRegexPattern]   = useState('')
  const [sortBy, setSortBy]               = useState('Date')
  const [sortDesc, setSortDesc]           = useState(true)

  // Pagination
  const [currentPage, setCurrentPage]     = useState(1)
  const [itemsPerPage, setItemsPerPage]   = useState(50)

  // Bulk
  const [bulkSelected, setBulkSelected]   = useState({ all_media: true, images: false, videos: false, files: false, audio: false })

  const counts = {}
  CATEGORY_TABS.forEach(t => { counts[t.key] = (categories?.[t.key] || []).length })

  const getFilteredMsgs = useCallback(() => {
    if (!categories) return []
    const raw = categories[activeTab] || []
    return raw.filter(msg => {
      if (searchQuery && !(msg.filename || '').toLowerCase().includes(searchQuery.toLowerCase())) return false
      if (dateStart && msg.date && msg.date < dateStart) return false
      if (dateEnd && msg.date && msg.date > dateEnd + 'T23:59') return false
      if (minSizeMB && msg.size < parseFloat(minSizeMB) * 1048576) return false
      if (maxSizeMB && msg.size > parseFloat(maxSizeMB) * 1048576) return false
      if (regexPattern) { try { if (!new RegExp(regexPattern, 'i').test(msg.filename || '')) return false } catch {} }
      return true
    }).sort((a, b) => {
      let va, vb
      if (sortBy === 'Date')      { va = a.date || ''; vb = b.date || '' }
      else if (sortBy === 'Size') { va = a.size || 0;  vb = b.size || 0 }
      else                         { va = (a.filename || '').toLowerCase(); vb = (b.filename || '').toLowerCase() }
      return sortDesc ? (va < vb ? 1 : -1) : (va > vb ? 1 : -1)
    })
  }, [categories, activeTab, searchQuery, dateStart, dateEnd, minSizeMB, maxSizeMB, regexPattern, sortBy, sortDesc])

  useEffect(() => { setCurrentPage(1) }, [activeTab, searchQuery, dateStart, dateEnd, minSizeMB, maxSizeMB, regexPattern, sortBy, sortDesc, itemsPerPage])

  const msgs        = getFilteredMsgs()
  const totalItems  = msgs.length
  const totalPages  = Math.ceil(totalItems / itemsPerPage) || 1
  const paginated   = msgs.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  // Visible rows = the ones currently rendered on this page
  const visibleIds  = paginated.map(m => m.id)

  const toggleSelect   = id => setSelectedIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id])
  const selectAll      = ()  => setSelectedIds(msgs.map(m => m.id))
  const selectVisible  = ()  => setSelectedIds(prev => [...new Set([...prev, ...visibleIds])])
  const clearAll       = ()  => setSelectedIds([])

  const resetFilters = () => {
    setSearchQuery(''); setDateStart(''); setDateEnd('')
    setMinSizeMB(''); setMaxSizeMB(''); setRegexPattern('')
  }

  const toggleBulk = id => setBulkSelected(prev => {
    const next = { ...prev, [id]: !prev[id] }
    if (id === 'all_media' && next.all_media) { next.images = false; next.videos = false }
    if ((id === 'images' || id === 'videos') && next[id]) next.all_media = false
    return next
  })

  // Build msgs map for download
  const allMsgsMap = {}
  Object.values(categories || {}).flat().forEach(m => { if (m?.id) allMsgsMap[m.id] = m })

  const handleStartDownload = async (ids) => {
    if (!ids.length) return
    const selectedMsgs = ids.map(id => allMsgsMap[id]).filter(Boolean)
    if (!selectedMsgs.length) return
    triggerCoffeeModal()
    await startJob({
      selectedMsgs,
      channelInput,
      channelTitle: channelTitle || channelInput,
      mediaType: activeTab,
    })
    navigate('/queue')
  }

  const handleBulkDownload = async () => {
    const selected = Object.entries(bulkSelected).filter(([,v]) => v).map(([k]) => k)
    let items = []
    if (selected.includes('all_media')) items = [...(categories['Media'] || [])]
    if (selected.includes('images'))    items = [...items, ...(categories['Media'] || []).filter(m => /\.(jpg|jpeg|png|webp|heic)$/i.test(m.filename || ''))]
    if (selected.includes('videos'))    items = [...items, ...(categories['Media'] || []).filter(m => /\.(mp4|mkv|avi|mov|webm)$/i.test(m.filename || ''))]
    if (selected.includes('files'))     items = [...items, ...(categories['Files'] || [])]
    if (selected.includes('audio'))     items = [...items, ...(categories['Music'] || []), ...(categories['Voice'] || [])]
    const unique = [...new Map(items.map(m => [m.id, m])).values()]
    if (!unique.length) return
    triggerCoffeeModal()
    await startJob({
      selectedMsgs: unique,
      channelInput,
      channelTitle: channelTitle || channelInput,
      mediaType: 'Bulk',
    })
    navigate('/queue')
  }


  const inputCls = 'glass-input w-full px-3 py-2 text-xs focus:outline-none focus:border-[#635BFF]'

  return (
    <div className="glass-panel overflow-hidden p-0">
      {/* Channel header */}
      <div className="px-5 py-4 flex items-center justify-between gap-3" style={{ borderBottom: '1px solid var(--border-subtle)' }}>
        <div>
          <h3 className="font-bold text-sm text-current">{channelTitle || channelInput}</h3>
          <p className="text-xs font-mono" style={{ color: 'var(--text-muted)' }}>
            {counts['All'] || 0} total files found
          </p>
        </div>
        <div className="flex items-center gap-2">
          {/* Count badge — green when selected > 0 */}
          {selectedIds.length > 0 && (
            <span className="px-3 py-1 rounded-lg text-xs font-bold bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
              {selectedIds.length} selected
            </span>
          )}
          <button onClick={() => setBrowserView(v => v === 'bulk' ? 'tabs' : 'bulk')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${browserView === 'tabs' ? 'bg-[#635BFF]/10 text-[#635BFF] border-[#635BFF]/30' : 'btn-fintech-secondary'}`}>
            {browserView === 'tabs' ? <Layers className="w-3.5 h-3.5" /> : <List className="w-3.5 h-3.5" />}
            {browserView === 'tabs' ? 'Bulk View' : 'File List'}
          </button>
          <button onClick={onRefresh} className="btn-fintech-secondary p-1.5 rounded-lg" title="Refresh">
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* ══ BULK VIEW ══ */}
      {browserView === 'bulk' && (
        <div className="p-6 space-y-5">
          <div>
            <h4 className="font-bold text-sm text-current mb-1">Download by category</h4>
            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
              Download whole categories without loading the file list. Use "Load specific files" to cherry-pick individual files.
            </p>
          </div>
          <div className="glass-card p-4 space-y-3">
            {BULK_CATEGORIES.map(cat => (
              <label key={cat.id} onClick={() => toggleBulk(cat.id)}
                className="flex items-center gap-3 cursor-pointer">
                <div className={`w-4 h-4 rounded border flex-shrink-0 flex items-center justify-center transition-all ${bulkSelected[cat.id] ? 'bg-[#635BFF] border-[#635BFF]' : 'border-current/30'}`}>
                  {bulkSelected[cat.id] && <CheckCircle2 className="w-3 h-3 text-white" />}
                </div>
                <span className="text-sm text-current">{cat.label}</span>
              </label>
            ))}
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <button onClick={handleBulkDownload}
              className="btn-fintech-primary gap-2 px-5 py-2.5 text-sm">
              <Download className="w-4 h-4" />
              Download selected categories
            </button>
            <button onClick={() => setBrowserView('tabs')} className="btn-fintech-secondary gap-2 px-5 py-2.5 text-sm">
              <List className="w-4 h-4" /> Load specific files
            </button>
          </div>
        </div>
      )}

      {/* ══ TABS / FILE LIST VIEW ══ */}
      {browserView === 'tabs' && (
        <>
          {/* Category tabs */}
          <div className="flex overflow-x-auto px-4" style={{ borderBottom: '1px solid var(--border-subtle)' }}>
            {CATEGORY_TABS.map(tab => {
              const Icon = tab.icon
              const count = counts[tab.key] || 0
              return (
                <button key={tab.key}
                  onClick={() => { setActiveTab(tab.key); setSelectedIds([]) }}
                  className={`flex items-center gap-1.5 px-3 py-3.5 text-xs font-semibold whitespace-nowrap border-b-2 transition-all mr-1 ${activeTab === tab.key ? 'border-[#635BFF] text-[#635BFF]' : 'border-transparent hover:text-[#635BFF]'}`}
                  style={activeTab !== tab.key ? { color: 'var(--text-muted)' } : {}}>
                  <Icon className="w-3.5 h-3.5" />
                  {tab.label}
                  {count > 0 && (
                    <span className={`px-1.5 py-0.5 rounded-md text-[10px] font-bold ${activeTab === tab.key ? 'bg-[#635BFF]/15 text-[#635BFF]' : 'badge-mono'}`}>{count}</span>
                  )}
                </button>
              )
            })}
          </div>

          {/* Per-tab toolbar: Select All | Select Visible | Clear All + Sort by */}
          <div className="px-4 py-2.5 flex flex-wrap items-center gap-2" style={{ borderBottom: '1px solid var(--border-subtle)', background: 'var(--bg-panel)' }}>
            <button onClick={selectAll}     className="btn-fintech-secondary text-xs px-3 py-1.5 rounded-lg">Select all</button>
            <button onClick={selectVisible} className="btn-fintech-secondary text-xs px-3 py-1.5 rounded-lg flex items-center gap-1">
              <Eye className="w-3 h-3" /> Select visible
            </button>
            <button onClick={clearAll}      className="btn-fintech-secondary text-xs px-3 py-1.5 rounded-lg">Clear all</button>

            <div className="flex-1" />

            {/* Sort */}
            <select value={sortBy} onChange={e => setSortBy(e.target.value)} className="glass-input px-2 py-1.5 text-xs focus:outline-none">
              <option value="Date">Sort: Date</option>
              <option value="Size">Sort: Size</option>
              <option value="Name">Sort: Name</option>
            </select>
            <button onClick={() => setSortDesc(p => !p)} className="btn-fintech-secondary p-1.5 rounded-lg" title={sortDesc ? 'Descending' : 'Ascending'}>
              {sortDesc ? <SortDesc className="w-4 h-4" /> : <SortAsc className="w-4 h-4" />}
            </button>
            <button onClick={() => setShowFilters(p => !p)}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-lg border text-xs transition-all ${showFilters ? 'bg-[#635BFF]/10 border-[#635BFF]/30 text-[#635BFF]' : 'btn-fintech-secondary'}`}>
              <Filter className="w-3.5 h-3.5" /> Filters
            </button>
          </div>

          {/* Search bar */}
          <div className="px-4 pt-3 pb-2" style={{ borderBottom: showFilters ? 'none' : '1px solid var(--border-subtle)' }}>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5" style={{ color: 'var(--text-muted)' }} />
              <input type="text" placeholder="Search filename..." value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)} className={inputCls + ' pl-8'} />
            </div>
          </div>

          {/* Advanced filters */}
          {showFilters && (
            <div className="px-4 py-3 grid grid-cols-2 sm:grid-cols-4 gap-2" style={{ borderBottom: '1px solid var(--border-subtle)' }}>
              {[['Date from','date',dateStart,setDateStart],['Date to','date',dateEnd,setDateEnd]].map(([label,type,val,set]) => (
                <div key={label}>
                  <label className="text-[10px] mb-1 block font-mono" style={{ color: 'var(--text-muted)' }}>{label}</label>
                  <input type={type} value={val} onChange={e => set(e.target.value)} className={inputCls} />
                </div>
              ))}
              {[['Min size (MB)',minSizeMB,setMinSizeMB,'0'],['Max size (MB)',maxSizeMB,setMaxSizeMB,'∞']].map(([label,val,set,ph]) => (
                <div key={label}>
                  <label className="text-[10px] mb-1 block font-mono" style={{ color: 'var(--text-muted)' }}>{label}</label>
                  <input type="number" min="0" placeholder={ph} value={val} onChange={e => set(e.target.value)} className={inputCls} />
                </div>
              ))}
              <div className="col-span-2 sm:col-span-3">
                <label className="text-[10px] mb-1 block font-mono" style={{ color: 'var(--text-muted)' }}>Regex pattern</label>
                <input type="text" placeholder={String.raw`e.g. \.pdf$`} value={regexPattern} onChange={e => setRegexPattern(e.target.value)} className={inputCls + ' font-mono'} />
              </div>
              <div className="flex items-end">
                <button onClick={resetFilters} className="btn-fintech-secondary w-full py-2 text-xs rounded-lg">Reset</button>
              </div>
            </div>
          )}

          {/* Batch action bar */}
          <div className="px-4 py-2.5 flex items-center gap-3 text-xs" style={{ background: 'var(--bg-panel)', borderBottom: '1px solid var(--border-subtle)' }}>
            {/* Select all checkbox */}
            <div onClick={() => selectedIds.length === msgs.length && msgs.length > 0 ? clearAll() : selectAll()} className="cursor-pointer flex-shrink-0">
              {selectedIds.length === msgs.length && msgs.length > 0
                ? <CheckSquare className="w-4 h-4 text-[#635BFF]" />
                : <Square className="w-4 h-4" style={{ color: 'var(--text-muted)' }} />}
            </div>

            {/* Selected count — green if > 0, mirrors desktop */}
            {selectedIds.length > 0
              ? <span className="font-bold text-emerald-600 dark:text-emerald-400">{selectedIds.length} files selected</span>
              : <span style={{ color: 'var(--text-muted)' }}>{totalItems} items · {selectedIds.length} selected</span>}

            <div className="flex-1" />

            {selectedIds.length > 0 ? (
              <button onClick={() => handleStartDownload(selectedIds)}
                className="btn-fintech-primary text-xs px-4 py-1.5 gap-1.5 rounded-lg flex items-center">
                <Download className="w-3 h-3" />
                Download selected ({selectedIds.length})
              </button>
            ) : (
              <button onClick={() => handleStartDownload(msgs.map(m => m.id))} disabled={totalItems === 0}
                className="btn-fintech-secondary text-xs px-4 py-1.5 gap-1.5 rounded-lg flex items-center disabled:opacity-30">
                <Download className="w-3 h-3" />
                Download all ({totalItems})
              </button>
            )}
          </div>

          {/* File list */}
          <div className="max-h-[520px] overflow-y-auto">
            {paginated.length === 0
              ? <div className="py-12 text-center text-sm" style={{ color: 'var(--text-muted)' }}>
                  No {activeTab === 'All' ? 'media' : activeTab} found.
                </div>
              : paginated.map(msg => (
                  <MediaRow key={msg.id} msg={msg}
                    selected={selectedIds.includes(msg.id)}
                    onToggle={() => toggleSelect(msg.id)} />
                ))}
          </div>

          {/* Pagination */}
          {totalItems > 0 && (
            <div className="px-4 py-3 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-mono"
              style={{ background: 'var(--bg-panel)', borderTop: '1px solid var(--border-subtle)', color: 'var(--text-muted)' }}>
              <div className="flex items-center gap-2">
                <span>Show</span>
                <select value={itemsPerPage} onChange={e => setItemsPerPage(Number(e.target.value))}
                  className="glass-input px-2 py-1 text-xs focus:outline-none">
                  {[20,50,100,200].map(n => <option key={n} value={n}>{n} per page</option>)}
                </select>
                <span>· {((currentPage-1)*itemsPerPage)+1}–{Math.min(currentPage*itemsPerPage, totalItems)} of {totalItems}</span>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => setCurrentPage(p => Math.max(1,p-1))} disabled={currentPage===1}
                  className="btn-fintech-secondary px-3 py-1.5 rounded-lg text-xs disabled:opacity-30">← Prev</button>
                <span className="font-bold text-current px-2">Page {currentPage} of {totalPages}</span>
                <button onClick={() => setCurrentPage(p => Math.min(totalPages,p+1))} disabled={currentPage>=totalPages}
                  className="btn-fintech-secondary px-3 py-1.5 rounded-lg text-xs disabled:opacity-30">Next →</button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}

// ─── Home / search + browser ──────────────────────────────────────────────────
function HomeView({ tgSession }) {
  const { BACKEND } = useAuth()
  const { downloaderCache, updateDownloaderCache } = useApp()
  const backendUrl  = BACKEND || 'http://localhost:5000'

  const channelInput = downloaderCache.channelInput || ''
  const setChannelInput = (val) => updateDownloaderCache({ channelInput: typeof val === 'function' ? val(downloaderCache.channelInput || '') : val })
  const channelInfo = downloaderCache.channelInfo
  const setChannelInfo = (val) => updateDownloaderCache({ channelInfo: val })
  const categories = downloaderCache.categories
  const setCategories = (val) => updateDownloaderCache({ categories: val })
  const topicId = downloaderCache.topicId
  const setTopicId = (val) => updateDownloaderCache({ topicId: val })

  const [isFetching, setIsFetching]     = useState(false)
  const [fetchError, setFetchError]     = useState('')

  // Forum topic picker
  const [showTopicPicker, setShowTopicPicker] = useState(false)
  const [pendingTopics, setPendingTopics]     = useState([])

  const { activeCount } = useDownloads()
  const settings = loadSettings()

  const handleFetch = async () => {
    const ch = channelInput.trim()
    if (!ch) return
    triggerCoffeeModal()
    setIsFetching(true); setFetchError(''); setCategories(null); setTopicId(null)
    try {
      const res  = await fetch(`${backendUrl}/api/telegram/fetch-topics`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ channel_input: ch }),
      })
      const ct = res.headers.get('content-type') || ''
      if (!res.ok || !ct.includes('application/json')) {
        const txt = await res.text().catch(() => '')
        setFetchError(`Backend error (${res.status}): ${txt.slice(0, 100) || 'Invalid server response'}`)
        setIsFetching(false)
        return
      }
      const data = await res.json()
      if (data.error) { setFetchError(data.error); setIsFetching(false); return }
      if (data.is_forum && data.topics?.length > 0) {
        setChannelInfo(data.channel || { title: ch })
        setPendingTopics(data.topics); setShowTopicPicker(true); setIsFetching(false); return
      }
      await doFetchMedia(ch, null)
    } catch (err) { setFetchError(`Cannot reach backend. Is it running? (${err.message})`); setIsFetching(false) }
  }

  const doFetchMedia = async (ch, selectedTopicId) => {
    setIsFetching(true); setFetchError(''); setShowTopicPicker(false); setTopicId(selectedTopicId)
    try {
      const res  = await fetch(`${backendUrl}/api/telegram/fetch-media`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ channel_input: ch, topic_id: selectedTopicId, limit: settings.initial_fetch_limit }),
      })
      const ct = res.headers.get('content-type') || ''
      if (!res.ok || !ct.includes('application/json')) {
        const txt = await res.text().catch(() => '')
        setFetchError(`Backend error (${res.status}): ${txt.slice(0, 100) || 'Invalid server response'}`)
        return
      }
      const data = await res.json()
      if (data.error) { setFetchError(data.error); return }
      setChannelInfo(data.channel || { title: ch })
      setCategories(data.categories || {})
    } catch (err) { setFetchError(`Backend error: ${err.message}`) }
    finally { setIsFetching(false) }
  }

  return (
    <div className="space-y-5">
      {/* Hero metrics */}
      <div className="glass-panel p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <p className="text-xs text-[#635BFF] font-mono font-bold uppercase tracking-widest mb-1">TELEGRAM MEDIA DOWNLOADER</p>
            <h2 className="text-xl font-black text-current">Your downloads, in one place.</h2>
            <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>
              Find media from a channel or group, choose the files you want, and follow every download live.
            </p>
          </div>
          <div className="flex gap-6 text-center">
            <div>
              <p className="text-[10px] font-mono uppercase" style={{ color: 'var(--text-muted)' }}>Active Queue</p>
              <p className="text-2xl font-black text-current">{activeCount}</p>
            </div>
            <div>
              <p className="text-[10px] font-mono uppercase" style={{ color: 'var(--text-muted)' }}>Scan limit</p>
              <p className="text-2xl font-black text-current">{settings.initial_fetch_limit}</p>
            </div>
            <div>
              <p className="text-[10px] font-mono uppercase" style={{ color: 'var(--text-muted)' }}>Session</p>
              <span className="badge-mono text-[#635BFF] text-[10px]">LIVE</span>
            </div>
          </div>
        </div>
        {/* 3-step workflow */}
        <div className="grid grid-cols-3 gap-3 mt-5 pt-5" style={{ borderTop: '1px solid var(--border-subtle)' }}>
          {[['01','Enter source','Paste a channel or group link.'],['02','Choose media','Pick categories or exact files.'],['03','Track download','Watch live speed and progress.']].map(([n,t,d]) => (
            <div key={n} className="glass-card p-3">
              <p className="text-[10px] text-[#635BFF] font-mono font-bold">{n}</p>
              <p className="font-bold text-xs mt-1 text-current">{t}</p>
              <p className="text-[10px] mt-0.5" style={{ color: 'var(--text-muted)' }}>{d}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Find media */}
      <div className="glass-panel p-6">
        <h3 className="text-sm font-bold text-current mb-1">Find media</h3>
        <p className="text-xs mb-4" style={{ color: 'var(--text-muted)' }}>
          Enter a channel name, Telegram link, private channel ID, or forum topic link.
        </p>
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'var(--text-muted)' }} />
            <input type="text" placeholder="@channel, https://t.me/channel, or -100..."
              value={channelInput} onChange={e => setChannelInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleFetch()}
              className="glass-input w-full pl-10 pr-4 py-3 text-sm" />
          </div>
          <button onClick={handleFetch} disabled={isFetching || !channelInput.trim()}
            className="btn-fintech-primary px-6 py-3 gap-2 disabled:opacity-50 whitespace-nowrap">
            {isFetching ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
            {isFetching ? 'Finding...' : 'Find media'}
          </button>
          {categories && (
            <button onClick={() => { setCategories(null); setChannelInfo(null) }}
              className="btn-fintech-secondary p-3" title="Clear">
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
        {fetchError && <div className="mt-3"><ErrorBox msg={fetchError} /></div>}
        <p className="text-[11px] mt-2" style={{ color: 'var(--text-muted)' }}>
          Your Telegram account must already have access to private groups.
        </p>
      </div>

      {/* Topic picker */}
      {showTopicPicker && (
        <TopicPickerModal
          topics={pendingTopics}
          channelTitle={channelInfo?.title || channelInput}
          onSelect={selectedTopicId => doFetchMedia(channelInput.trim(), selectedTopicId)}
          onCancel={() => { setShowTopicPicker(false); setIsFetching(false) }}
        />
      )}

      {/* Media browser */}
      {categories && (
        <MediaBrowser
          channelInput={channelInput.trim()}
          channelTitle={channelInfo?.title}
          categories={categories}
          initialTopicId={topicId}
          onRefresh={() => doFetchMedia(channelInput.trim(), topicId)}
        />
      )}
    </div>
  )
}

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function DownloaderView() {
  const { tgSession, setTgSession, startTelegramConnect, verifyTelegramCode, verifyTelegram2FA, checkTelegramSession, disconnectTelegram } = useAuth()
  const [tgLoading, setTgLoading] = useState(false)
  const [tgError, setTgError]     = useState('')

  useEffect(() => {
    if (tgSession.phone && !tgSession.connected) checkTelegramSession(tgSession.phone)
  }, []) // eslint-disable-line

  const handleSendCode  = async (apiId, apiHash, phone) => { setTgLoading(true); setTgError(''); const r = await startTelegramConnect(apiId, apiHash, phone); if (r?.error) setTgError(r.error); setTgLoading(false) }
  const handleVerify    = async (code)     => { setTgLoading(true); setTgError(''); const r = await verifyTelegramCode(code);     if (r?.error) setTgError(r.error); setTgLoading(false) }
  const handleVerify2FA = async (password) => { setTgLoading(true); setTgError(''); const r = await verifyTelegram2FA(password);  if (r?.error) setTgError(r.error); setTgLoading(false) }
  const handleBack      = () => { setTgSession(prev => ({ ...prev, step: Math.max(1, prev.step - 1) })); setTgError('') }
  const handleDisconnect = async () => { if (window.confirm('Disconnect Telegram session?')) { await disconnectTelegram(); setTgError('') } }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <SeoMeta
        title="Online Telegram Downloader — Bulk Download Videos, Files, Photos & Forum Topics"
        description="Extract and download videos, photos, MP3 audio, PDF documents, ZIP archives, and forum sub-topics directly from any public or private Telegram channel, group, or chat."
        keywords="telegram online downloader, download telegram videos online, telegram private video downloader, telegram forum topic downloader, download telegram media by channel link, telegram message id downloader, mtproto telegram web extractor"
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "WebApplication",
          "name": "TG Media Downloader Web Edition",
          "operatingSystem": "All",
          "applicationCategory": "UtilitiesApplication",
          "description": "Extract and download files directly from Telegram channels, groups, and topics.",
          "offers": {
            "@type": "Offer",
            "price": "0",
            "priceCurrency": "USD"
          }
        }}
      />

      {/* Page header with vibrant bulk badges */}
      <div className="flex items-center justify-between gap-4 mb-6 flex-wrap pb-4 border-b border-slate-200/80 dark:border-white/10">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-[14px] bg-gradient-to-tr from-[#635BFF] to-purple-600 flex items-center justify-center shadow-[0_0_25px_rgba(99,91,255,0.4)] flex-shrink-0">
            <Download className="w-6 h-6 text-white animate-bounce" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl sm:text-3xl font-black text-current tracking-tight">Telegram Bulk Downloader</h1>
              <span className="px-2.5 py-0.5 rounded-full bg-[#635BFF]/15 text-[#635BFF] dark:text-indigo-300 border border-[#635BFF]/30 text-[10px] font-mono font-bold">
                BULK BATCH MODE
              </span>
            </div>
            <p className="text-xs font-mono mt-0.5 text-slate-500 dark:text-slate-400">
              CHANNELS · GROUPS · GROUP FOLDERS · FORUM TOPICS · PRIVATE CHATS
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-500 text-xs font-mono font-bold shadow-sm">
            <Sparkles className="w-3.5 h-3.5" />
            <span>100% FREE UNLIMITED</span>
          </div>
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-purple-500/10 border border-purple-500/30 text-purple-400 text-xs font-mono font-bold shadow-sm">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>ZERO SERVER STORAGE</span>
          </div>
          {tgSession.connected && (
            <button onClick={handleDisconnect} className="btn-fintech-secondary text-xs px-3 py-1.5 rounded-lg font-mono">Disconnect</button>
          )}
        </div>
      </div>

      {/* Desktop App CTA banner */}
      <div className="mb-6 p-4 rounded-2xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs"
        style={{ background: 'rgba(99,91,255,0.06)', borderColor: 'rgba(99,91,255,0.2)' }}>
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#635BFF] flex items-center justify-center text-white text-base flex-shrink-0">💻</div>
          <div>
            <p className="font-bold text-current">Want the full Standalone Python Desktop App?</p>
            <p style={{ color: 'var(--text-muted)' }}>Fill out our contact form to request the desktop executable — Windows/Mac supported.</p>
          </div>
        </div>
        <Link to="/contact" className="btn-fintech-primary px-4 py-2 text-xs flex-shrink-0">Request Desktop App →</Link>
      </div>

      {/* Connected banner */}
      {tgSession.connected && (
        <div className="mb-6 flex items-center gap-3 px-4 py-3 rounded-xl border bg-emerald-500/5 border-emerald-500/20">
          <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
          <span className="text-emerald-600 dark:text-emerald-400 font-bold text-xs">Telegram Connected</span>
          <span className="text-xs font-mono" style={{ color: 'var(--text-muted)' }}>{tgSession.phone}</span>
          {tgSession.user && <span className="text-xs font-semibold text-current">({tgSession.user})</span>}
        </div>
      )}

      {/* Auth steps */}
      {!tgSession.connected && tgSession.step === 1 && (
        <StepConnect tgSession={tgSession} onSendCode={handleSendCode} loading={tgLoading} error={tgError} />
      )}
      {!tgSession.connected && tgSession.step === 2 && (
        <StepOTP phone={tgSession.phone} onVerifyCode={handleVerify} onBack={handleBack} loading={tgLoading} error={tgError} />
      )}
      {!tgSession.connected && tgSession.step === 3 && (
        <Step2FA onVerify2FA={handleVerify2FA} onBack={handleBack} loading={tgLoading} error={tgError} />
      )}

      {/* Main browser (only when connected) */}
      {tgSession.connected && <HomeView tgSession={tgSession} />}
    </div>
  )
}
