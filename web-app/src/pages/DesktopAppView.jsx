/**
 * DesktopAppView — Showcase page for the PySide6 Desktop Application
 * Features:
 *   - Hero section with standalone app badges & CTAs
 *   - Well-structured showcase of screenshots 1.png through 7.png
 *   - Detailed feature breakdown for native Python desktop performance
 *   - Embedded Contact Request Form for requesting the desktop executable
 *   - Support / Buy Me A Coffee integration
 */
import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import SeoMeta from '../components/SeoMeta'
import { useApp } from '../context/AppContext'
import {
  Laptop, Download, Shield, Cpu, Archive, Zap,
  CheckCircle2, Send, Coffee, ArrowRight, ExternalLink,
  Layers, Filter, Sparkles, MessageSquare, Eye, ChevronRight,
  X, ChevronLeft, Maximize2, Folder
} from 'lucide-react'

const SCREENSHOTS = [
  {
    id: '1',
    src: '/screenshots/1.png',
    title: 'Main Downloader Dashboard & Workflow',
    subtitle: 'Hero metrics, live throughput counter, and 3-step search guide',
    desc: 'The native PySide6 dashboard displays real-time throughput metrics, active download queues, and session statistics alongside a clean channel input bar.',
    tag: 'Step 01',
  },
  {
    id: '2',
    src: '/screenshots/2.png',
    title: 'Channel & Private Group Link Resolver',
    subtitle: 'Supports @username, t.me invite links, and private -100 IDs',
    desc: 'Instant channel entity resolution connects directly through Telethon MTProto protocols to scan any public or private group you have joined.',
    tag: 'Step 02',
  },
  {
    id: '3',
    src: '/screenshots/3.png',
    title: 'Sub-Forum Topic Isolation Modal',
    subtitle: 'Target specific forum threads without downloading channel noise',
    desc: 'Detects Telegram sub-forum channels automatically and presents a modal to pick individual topics (e.g. #PDFs, #Courses) before scanning.',
    tag: 'Step 03',
  },
  {
    id: '4',
    src: '/screenshots/4.png',
    title: 'Bulk Category Selection Mode',
    subtitle: 'One-click category batch extraction (All, Images, Videos, Files, Audio)',
    desc: 'Download entire categories in bulk directly to structured disk folders without having to manually select hundreds of individual files.',
    tag: 'Step 04',
  },
  {
    id: '5',
    src: '/screenshots/5.png',
    title: '9-Category Media List with Advanced Filters',
    subtitle: 'Per-tab toolbars, regex patterns, date ranges, and size filters',
    desc: 'Filter files across 9 dedicated categories (Media, Files, Music, ZIPs, Voice, Links, GIFs, Chat). Sort by Date, Size, or Name with Asc/Desc toggle.',
    tag: 'Step 05',
  },
  {
    id: '6',
    src: '/screenshots/6.png',
    title: 'Live Speed Throughput & Active Queue Metrics',
    subtitle: 'Real-time bandwidth monitoring up to max connection speed',
    desc: 'Track live MB/s transfer speeds and active download thread counts as media files stream directly from Telegram MTProto servers.',
    tag: 'Step 06',
  },
  {
    id: '7',
    src: '/screenshots/7.png',
    title: 'Download Queue Card & Batch Controls',
    subtitle: 'Pause, Resume, Folder short-cuts, file lists, and history log',
    desc: 'Full batch control: view progress bars for every file, pause or resume transfers, open destination folders with one click, and inspect completed history.',
    tag: 'Step 07',
  },
]

export default function DesktopAppView() {
  const { submitContactForm } = useApp()
  const [activeImage, setActiveImage] = useState(SCREENSHOTS[0])
  const [popupIndex, setPopupIndex]   = useState(null) // null = closed, 0..6 = open

  // Contact form state
  const [form, setForm] = useState({ name: '', email: '', os: 'Windows 10/11 (64-bit)', message: '' })
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!form.name || !form.email) return
    submitContactForm({
      name: form.name,
      email: form.email,
      subject: `Desktop App Request (${form.os})`,
      message: `OS: ${form.os}\n\nMessage:\n${form.message || 'I would like to receive the desktop app executable.'}`,
    })
    setSubmitted(true)
  }

  const handlePrevPopup = (e) => {
    e.stopPropagation()
    setPopupIndex(prev => prev > 0 ? prev - 1 : SCREENSHOTS.length - 1)
  }

  const handleNextPopup = (e) => {
    e.stopPropagation()
    setPopupIndex(prev => prev < SCREENSHOTS.length - 1 ? prev + 1 : 0)
  }

  const inputCls = 'glass-input w-full px-4 py-3 text-sm focus:outline-none focus:border-[#635BFF]'

  const activePopup = popupIndex !== null ? SCREENSHOTS[popupIndex] : null

  return (
    <div className="max-w-6xl mx-auto px-4 py-10 space-y-16">
      <SeoMeta
        title="Desktop App — Download Telegram Private Channels & Restricted Groups (Windows/Mac/Linux)"
        description="Download the standalone Telegram Media Downloader desktop app for Windows, macOS, and Linux. Multi-threaded MTProto downloads, bypass restricted content restrictions, and zero browser memory limits."
        keywords="telegram downloader desktop app, download telegram restricted channel videos, telegram media downloader windows, telegram downloader mac, telethon pyside6 desktop downloader, telegram batch downloader software"
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "SoftwareApplication",
          "name": "TG Media Downloader Desktop Edition",
          "operatingSystem": "Windows 10/11, macOS, Linux",
          "applicationCategory": "UtilitiesApplication",
          "downloadUrl": "https://github.com/Arulraj2001/TG-Media-Downloader/releases",
          "offers": {
            "@type": "Offer",
            "price": "0",
            "priceCurrency": "USD"
          }
        }}
      />

      {/* ── LIGHTBOX POPUP MODAL ────────────────────────────────────────── */}
      {activePopup && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/90 backdrop-blur-md animate-fade-in"
          onClick={() => setPopupIndex(null)}
        >
          {/* Main Modal Box — tight, image-proportional wrapper */}
          <div
            className="relative max-w-5xl w-full max-h-[92vh] bg-[#121218] border border-white/15 rounded-2xl p-4 sm:p-5 shadow-2xl flex flex-col justify-between space-y-3 text-white overflow-hidden"
            onClick={e => e.stopPropagation()}
          >
            {/* Top-Right Corner Close Button */}
            <button
              onClick={() => setPopupIndex(null)}
              className="absolute top-3 right-3 z-20 w-9 h-9 rounded-full bg-white/10 hover:bg-[#635BFF] text-white flex items-center justify-center transition-all shadow-lg border border-white/15"
              title="Close modal (Esc)"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Header */}
            <div className="pr-10">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#635BFF] text-white">
                  {activePopup.tag} OF 07
                </span>
                <span className="text-xs text-slate-400 font-mono font-semibold">{activePopup.subtitle}</span>
              </div>
              <h3 className="text-base sm:text-lg font-bold mt-1 text-white truncate">{activePopup.title}</h3>
            </div>

            {/* Image Stage — image expands to fill container */}
            <div className="relative group flex-1 flex items-center justify-center rounded-xl overflow-hidden bg-black/60 border border-white/10 p-1">
              <img
                src={activePopup.src}
                alt={activePopup.title}
                className="w-full h-auto max-h-[72vh] object-contain rounded-lg shadow-2xl"
              />

              {/* Prev Button */}
              <button
                onClick={handlePrevPopup}
                className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/70 hover:bg-[#635BFF] text-white flex items-center justify-center transition-all border border-white/20 shadow-lg"
                title="Previous image"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              {/* Next Button */}
              <button
                onClick={handleNextPopup}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/70 hover:bg-[#635BFF] text-white flex items-center justify-center transition-all border border-white/20 shadow-lg"
                title="Next image"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Footer Description */}
            <div className="flex items-center justify-between gap-4 pt-1 text-xs text-slate-300 border-t border-white/10">
              <p className="flex-1 text-slate-400 truncate">{activePopup.desc}</p>
              <span className="px-2.5 py-1 rounded bg-white/5 border border-white/10 font-mono text-[11px] text-slate-300 flex-shrink-0">
                {popupIndex + 1} / 7
              </span>
            </div>
          </div>
        </div>
      )}

      {/* ── HERO BANNER ────────────────────────────────────────────────── */}
      <div className="relative overflow-hidden glass-panel p-8 sm:p-12 text-center sm:text-left flex flex-col md:flex-row items-center justify-between gap-8 rounded-[24px] border border-slate-200/90 dark:border-white/15 shadow-[0_20px_50px_rgba(0,0,0,0.3)]">
        <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-br from-[#635BFF]/20 via-purple-500/10 to-transparent blur-3xl pointer-events-none"></div>

        <div className="flex-1 space-y-4 relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-mono font-bold bg-[#635BFF]/15 text-[#635BFF] dark:text-indigo-300 border border-[#635BFF]/30 shadow-sm">
            <Laptop className="w-4 h-4" /> STANDALONE PYSIDE6 DESKTOP BULK DOWNLOADER
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-current tracking-tight leading-tight">
            TG Downloader <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#635BFF] via-purple-500 to-pink-500">Desktop Edition</span>
          </h1>
          <p className="text-sm sm:text-base max-w-xl leading-relaxed" style={{ color: 'var(--text-muted)' }}>
            Enjoy native desktop performance, multi-threaded parallel downloads, automatic topic folder separation, restricted channel media bypass, and zero browser memory limitations.
          </p>

          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 pt-2">
            <a href="#request-form" className="btn-fintech-primary px-6 py-3.5 text-sm font-bold gap-2 shadow-[0_0_25px_rgba(99,91,255,0.4)] hover:scale-[1.02] transition-all">
              <Download className="w-4 h-4" /> Request Desktop App
            </a>
            <a href="https://buymeacoffee.com/x4kqsd0lka" target="_blank" rel="noreferrer"
              className="btn-fintech-secondary px-5 py-3.5 text-sm font-bold gap-2 hover:scale-[1.02] transition-all">
              <Coffee className="w-4 h-4 text-amber-500" /> Buy me a coffee
            </a>
          </div>

          <div className="pt-4 flex flex-wrap items-center justify-center sm:justify-start gap-4 text-xs font-mono text-slate-500 dark:text-slate-400">
            <span className="flex items-center gap-1 text-emerald-500 font-bold"><Sparkles className="w-3.5 h-3.5" /> 100% Free &amp; Open</span>
            <span>•</span>
            <span className="flex items-center gap-1 text-[#635BFF] font-bold"><Folder className="w-3.5 h-3.5" /> Auto Folder Separation</span>
            <span>•</span>
            <span className="flex items-center gap-1 text-amber-500 font-bold"><Zap className="w-3.5 h-3.5" /> Multi-Thread Engine</span>
          </div>
        </div>

        {/* Hero preview graphic — click to open popup */}
        <div className="w-full md:w-96 flex-shrink-0">
          <div
            onClick={() => setPopupIndex(0)}
            className="glass-card p-2 rounded-2xl shadow-2xl border overflow-hidden cursor-pointer group relative transition-all hover:scale-[1.02]"
          >
            <img src="/screenshots/1.png" alt="Desktop App Preview" className="w-full h-auto rounded-xl object-cover" />
            <div className="absolute inset-0 bg-[#635BFF]/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-xl backdrop-blur-[2px]">
              <span className="btn-fintech-primary text-xs px-4 py-2 flex items-center gap-1.5 shadow-xl">
                <Maximize2 className="w-3.5 h-3.5" /> Open Fullscreen
              </span>
            </div>
            <div className="p-3 flex items-center justify-between text-xs font-mono" style={{ color: 'var(--text-muted)' }}>
              <span className="flex items-center gap-1 text-emerald-500 font-bold"><CheckCircle2 className="w-3.5 h-3.5" /> Python 3.12 + PySide6</span>
              <span>v1.1</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── KEY DESKTOP FEATURES GRID ───────────────────────────────────── */}
      <div className="space-y-6">
        <div className="text-center max-w-xl mx-auto">
          <p className="text-xs font-mono text-[#635BFF] font-bold uppercase tracking-widest">NATIVE ADVANTAGES</p>
          <h2 className="text-2xl font-black text-current mt-1">Built for Power Users</h2>
          <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>Why the desktop app delivers maximum throughput</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { icon: Cpu,           title: 'Native MTProto Speed', desc: 'Direct socket downloads without browser HTTP chunking limits.' },
            { icon: Zap,           title: 'Multi-Thread Engine',  desc: 'Download up to 8 Telegram files simultaneously in parallel.' },
            { icon: Archive,       title: 'Auto Folder Sync',     desc: 'Separate channels, sub-topics, and categories automatically on disk.' },
            { icon: Shield,        title: 'Offline Session File',  desc: 'Stores encrypted session files locally on your computer.' },
          ].map(({ icon: Icon, title, desc }) => (
            <div key={title} className="glass-card p-5 space-y-2">
              <div className="w-10 h-10 rounded-xl bg-[#635BFF]/10 flex items-center justify-center text-[#635BFF]">
                <Icon className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-sm text-current">{title}</h3>
              <p className="text-xs leading-relaxed" style={{ color: 'var(--text-muted)' }}>{desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── SCREENSHOT GALLERY (ORDERLY & STRUCTURED) ────────────────────── */}
      <div className="space-y-8">
        <div className="text-center max-w-xl mx-auto">
          <p className="text-xs font-mono text-[#635BFF] font-bold uppercase tracking-widest">DESKTOP INTERFACE</p>
          <h2 className="text-2xl font-black text-current mt-1">Explore App Screenshots</h2>
          <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>
            7 detailed views of the PySide6 desktop interface — click any image to expand
          </p>
        </div>

        {/* Featured Large Viewer */}
        <div className="glass-panel p-6 overflow-hidden space-y-4">
          <div className="flex flex-col lg:flex-row items-center gap-6">
            <div
              onClick={() => setPopupIndex(SCREENSHOTS.findIndex(s => s.id === activeImage.id))}
              className="w-full lg:w-2/3 glass-card p-2 rounded-2xl shadow-xl overflow-hidden border cursor-pointer group relative transition-all hover:scale-[1.01]"
            >
              <img src={activeImage.src} alt={activeImage.title} className="w-full h-auto rounded-xl object-cover" />
              <div className="absolute inset-0 bg-[#635BFF]/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-xl backdrop-blur-[2px]">
                <span className="btn-fintech-primary text-xs px-4 py-2 flex items-center gap-1.5 shadow-xl">
                  <Maximize2 className="w-3.5 h-3.5" /> Click to enlarge popup
                </span>
              </div>
            </div>
            <div className="w-full lg:w-1/3 space-y-4">
              <span className="px-2.5 py-1 rounded-md text-xs font-mono font-bold bg-[#635BFF]/10 text-[#635BFF] border border-[#635BFF]/20">
                {activeImage.tag} OF 07
              </span>
              <h3 className="text-xl font-bold text-current">{activeImage.title}</h3>
              <p className="text-xs font-semibold text-[#635BFF]">{activeImage.subtitle}</p>
              <p className="text-xs leading-relaxed" style={{ color: 'var(--text-muted)' }}>{activeImage.desc}</p>
              <button
                onClick={() => setPopupIndex(SCREENSHOTS.findIndex(s => s.id === activeImage.id))}
                className="btn-fintech-secondary text-xs px-4 py-2 rounded-xl flex items-center gap-2 mt-2"
              >
                <Maximize2 className="w-3.5 h-3.5 text-[#635BFF]" /> Open in Fullscreen Popup
              </button>
            </div>
          </div>
        </div>

        {/* 7 Screenshot Thumbnails Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
          {SCREENSHOTS.map((item, index) => {
            const isSelected = activeImage.id === item.id
            return (
              <div
                key={item.id}
                onClick={() => {
                  setActiveImage(item)
                  setPopupIndex(index)
                }}
                className={`glass-card p-1.5 rounded-xl cursor-pointer transition-all border text-center group ${isSelected ? 'ring-2 ring-[#635BFF] border-[#635BFF]' : 'hover:scale-[1.04]'}`}
              >
                <div className="relative overflow-hidden rounded-lg">
                  <img src={item.src} alt={item.title} className="w-full h-20 object-cover rounded-lg mb-1.5" />
                  <div className="absolute inset-0 bg-[#635BFF]/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Maximize2 className="w-4 h-4 text-white" />
                  </div>
                </div>
                <span className="text-[10px] font-mono font-bold block truncate text-current">
                  {index + 1}. {item.title.split(' ')[0]}
                </span>
              </div>
            )
          })}
        </div>

        {/* Structured 7-Step List */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
          {SCREENSHOTS.map((item, index) => (
            <div
              key={item.id}
              onClick={() => {
                setActiveImage(item)
                setPopupIndex(index)
              }}
              className="glass-card p-4 flex gap-4 items-start cursor-pointer hover:border-[#635BFF]/50 transition-all group"
            >
              <div className="w-8 h-8 rounded-lg bg-[#635BFF]/10 text-[#635BFF] flex items-center justify-center font-mono font-bold text-xs flex-shrink-0 group-hover:bg-[#635BFF] group-hover:text-white transition-colors">
                0{index + 1}
              </div>
              <div className="space-y-1 flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-xs text-current truncate group-hover:text-[#635BFF] transition-colors">{item.title}</h4>
                  <Maximize2 className="w-3.5 h-3.5 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <p className="text-[11px]" style={{ color: 'var(--text-muted)' }}>{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── CONTACT REQUEST FORM ─────────────────────────────────────────── */}
      <div id="request-form" className="glass-panel p-8 sm:p-10 max-w-2xl mx-auto space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-[#635BFF]/10 text-[#635BFF] flex items-center justify-center mx-auto">
            <MessageSquare className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-black text-current tracking-tight">Request Desktop App Executable</h2>
          <p className="text-xs max-w-md mx-auto" style={{ color: 'var(--text-muted)' }}>
            Fill out the request form below. Our team will send the standalone desktop installer directly to your email.
          </p>
        </div>

        {submitted ? (
          <div className="p-6 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-center space-y-3">
            <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto" />
            <h3 className="font-bold text-base text-current">Request Received!</h3>
            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
              Thank you, <strong className="text-current">{form.name}</strong>. We've logged your request for the <strong className="text-current">{form.os}</strong> executable and will send the link to <strong className="text-current">{form.email}</strong>.
            </p>
            <button onClick={() => setSubmitted(false)} className="btn-fintech-secondary text-xs px-4 py-2 mt-2">
              Send another request
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: 'var(--text-muted)' }}>Your Name</label>
              <input type="text" placeholder="John Doe" value={form.name} required
                onChange={e => setForm(p => ({ ...p, name: e.target.value }))} className={inputCls} />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: 'var(--text-muted)' }}>Email Address</label>
              <input type="email" placeholder="john@example.com" value={form.email} required
                onChange={e => setForm(p => ({ ...p, email: e.target.value }))} className={inputCls} />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: 'var(--text-muted)' }}>Operating System</label>
              <select value={form.os} onChange={e => setForm(p => ({ ...p, os: e.target.value }))}
                className="glass-input w-full px-4 py-3 text-sm focus:outline-none">
                <option>Windows 10/11 (64-bit)</option>
                <option>macOS (Apple Silicon M1/M2/M3)</option>
                <option>macOS (Intel x64)</option>
                <option>Linux (Ubuntu/Debian)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: 'var(--text-muted)' }}>Message / Notes (optional)</label>
              <textarea placeholder="e.g. Please send Windows installer link..." rows={3} value={form.message}
                onChange={e => setForm(p => ({ ...p, message: e.target.value }))} className={inputCls} />
            </div>

            <button type="submit" className="btn-fintech-primary w-full py-3 text-sm font-bold gap-2">
              <Send className="w-4 h-4" /> Send Executable Request
            </button>
          </form>
        )}
      </div>

      {/* ── SUPPORT BANNER ──────────────────────────────────────────────── */}
      <div className="glass-panel p-6 text-center space-y-3 max-w-xl mx-auto">
        <Coffee className="w-8 h-8 text-amber-500 mx-auto" />
        <h3 className="font-bold text-sm text-current">Support Desktop Development</h3>
        <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
          Help us maintain the Python PySide6 standalone app and keep server endpoints free.
        </p>
        <a href="https://buymeacoffee.com/x4kqsd0lka" target="_blank" rel="noreferrer"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-400 text-white shadow-lg shadow-amber-500/20 transition-all">
          <Coffee className="w-4 h-4" /> Support on Buy Me a Coffee →
        </a>
      </div>
    </div>
  )
}
