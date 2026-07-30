import React, { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import SeoMeta from '../components/SeoMeta'
import { 
  Search, Download, Filter, ArrowUpDown, Calendar, HardDrive, 
  FileText, Image, Film, Music, Archive, Link as LinkIcon, 
  Smile, MessageSquare, CheckSquare, Square, RefreshCw, Layers,
  ChevronDown, ChevronUp, Pause, Play, Trash2, ShieldCheck, Sparkles, FolderDown, Terminal, Cpu,
  Key, Phone, CheckCircle2, LogOut, Lock, UserCheck, RotateCcw
} from 'lucide-react'

// Mock Telegram channel messages matching Desktop Telethon schema 100%
const MOCK_CHANNEL_MESSAGES = [
  { id: 101, title: 'Python_Data_Science_Handbook_2026.pdf', size: 15485760, date: '2026-03-15', type: 'files', category: 'PDF Document', ext: 'pdf' },
  { id: 102, title: 'Fullstack_Web_Development_Masterclass.mp4', size: 452428800, date: '2026-03-20', type: 'media', category: 'Video', ext: 'mp4' },
  { id: 103, title: 'Machine_Learning_Datasets_Bundle.zip', size: 104857600, date: '2026-02-10', type: 'zips', category: 'Archive', ext: 'zip' },
  { id: 104, title: 'Lofi_Study_Background_Audio.mp3', size: 8428800, date: '2026-01-05', type: 'music', category: 'Audio', ext: 'mp3' },
  { id: 105, title: 'UI_Design_System_Mockups_Dark.png', size: 5242880, date: '2026-03-25', type: 'media', category: 'Photo', ext: 'png' },
  { id: 106, title: 'Voice_Note_Lecture_Summary_01.ogg', size: 2154800, date: '2026-03-26', type: 'voice', category: 'Voice Note', ext: 'ogg' },
  { id: 107, title: 'Official_Documentation_Resource_Link.html', size: 12000, date: '2026-03-27', type: 'links', category: 'Web Link', ext: 'link' },
  { id: 108, title: 'Celebration_Animation_Reaction.gif', size: 1450000, date: '2026-03-28', type: 'gifs', category: 'GIF Animation', ext: 'gif' },
  { id: 109, title: 'Community_QnA_Transcript_Chat_Log.txt', size: 450000, date: '2026-03-29', type: 'chat', category: 'Chat Text', ext: 'txt' },
]

export default function DownloaderView() {
  const { requireAuth, consumeFetch, tgSession, startTelegramConnect, verifyTelegramCode, disconnectTelegram } = useAuth()
  
  // Telegram Login Form State (Exact Desktop LoginView Fields)
  const [inpApiId, setInpApiId] = useState(tgSession.apiId || '')
  const [inpApiHash, setInpApiHash] = useState(tgSession.apiHash || '')
  const [inpPhone, setInpPhone] = useState(tgSession.phone || '')
  const [inpOtpCode, setInpOtpCode] = useState('')
  const [inp2faPassword, setInp2faPassword] = useState('')
  const [tgError, setTgError] = useState('')

  // Channel & Search State
  const [channelInput, setChannelInput] = useState('')
  const [selectedTopic, setSelectedTopic] = useState('all')
  const [isFetching, setIsFetching] = useState(false)
  const [hasFetched, setHasFetched] = useState(false)
  
  // Tab State (Exact 9 Category Tabs from Desktop MediaBrowserDialog)
  const [activeTab, setActiveTab] = useState('all')
  
  // Advanced Filter State (Exact Desktop MediaBrowserDialog Fields)
  const [searchQuery, setSearchQuery] = useState('')
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(true)
  const [dateStart, setDateStart] = useState('2016-01-01')
  const [dateEnd, setDateEnd] = useState(new Date().toISOString().split('T')[0])
  const [minSizeMB, setMinSizeMB] = useState('')
  const [maxSizeMB, setMaxSizeMB] = useState('')
  const [regexPattern, setRegexPattern] = useState('')
  
  // Sorting State (Exact Desktop Sort Options: Date, File Size, File Name)
  const [sortBy, setSortBy] = useState('Date') // "Date", "File Size", "File Name"
  const [sortDesc, setSortDesc] = useState(true) // true = Descending, false = Ascending
  
  // Selection State
  const [selectedIds, setSelectedIds] = useState([])
  
  // Active Queue State
  const [downloadQueue, setDownloadQueue] = useState([])

  // Step 1: Send Verification Code (Desktop App Login Step 1)
  const handleSendCode = (e) => {
    e.preventDefault()
    if (!inpApiId || !inpApiHash || !inpPhone) {
      setTgError('Please enter your Telegram API ID, API Hash, and Phone Number.')
      return
    }
    setTgError('')
    startTelegramConnect(inpApiId, inpApiHash, inpPhone)
  }

  // Step 2: Verify Login Code (Desktop App Login Step 2)
  const handleVerifyCode = (e) => {
    e.preventDefault()
    if (!inpOtpCode) {
      setTgError('Please enter the verification code sent to your Telegram app.')
      return
    }
    setTgError('')
    verifyTelegramCode(inpOtpCode)
  }

  const handleFetch = () => {
    requireAuth(() => {
      if (!channelInput.trim()) return
      if (!consumeFetch()) {
        alert('Free fetch limit reached. Please upgrade to a Pro pass for unlimited downloads.')
        return
      }
      setIsFetching(true)
      setTimeout(() => {
        setIsFetching(false)
        setHasFetched(true)
        setSelectedIds([])
      }, 700)
    })
  }

  // Filter & Sort Logic (Matching Desktop filter_rows & sort exact logic)
  const getFilteredAndSortedMessages = () => {
    let list = [...MOCK_CHANNEL_MESSAGES]
    
    // Category tab filter
    if (activeTab !== 'all') {
      list = list.filter(m => m.type === activeTab)
    }

    // Search query filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      list = list.filter(m => m.title.toLowerCase().includes(q))
    }

    // Date range filter
    if (dateStart) {
      const startMs = new Date(dateStart).getTime()
      list = list.filter(m => new Date(m.date).getTime() >= startMs)
    }
    if (dateEnd) {
      const endMs = new Date(dateEnd).getTime() + (24 * 60 * 60 * 1000 - 1)
      list = list.filter(m => new Date(m.date).getTime() <= endMs)
    }

    // Size range filter (MB)
    if (minSizeMB) {
      const minBytes = parseFloat(minSizeMB) * 1024 * 1024
      list = list.filter(m => m.size >= minBytes)
    }
    if (maxSizeMB) {
      const maxBytes = parseFloat(maxSizeMB) * 1024 * 1024
      list = list.filter(m => m.size <= maxBytes)
    }

    // Regex pattern filter
    if (regexPattern.trim()) {
      try {
        const regex = new RegExp(regexPattern, 'i')
        list = list.filter(m => regex.test(m.title))
      } catch (err) {
        // Invalid regex ignore
      }
    }

    // Sorting logic matching desktop sort
    list.sort((a, b) => {
      let valA, valB
      if (sortBy === 'Date') {
        valA = new Date(a.date).getTime()
        valB = new Date(b.date).getTime()
      } else if (sortBy === 'File Size') {
        valA = a.size
        valB = b.size
      } else if (sortBy === 'File Name') {
        valA = a.title.toLowerCase()
        valB = b.title.toLowerCase()
      }
      
      if (valA < valB) return sortDesc ? 1 : -1
      if (valA > valB) return sortDesc ? -1 : 1
      return 0
    })

    return list
  }

  const filteredMessages = getFilteredAndSortedMessages()

  const toggleSelect = (id) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    )
  }

  const selectAll = () => {
    setSelectedIds(filteredMessages.map(m => m.id))
  }

  const clearSelection = () => {
    setSelectedIds([])
  }

  const resetFilters = () => {
    setSearchQuery('')
    setDateStart('2016-01-01')
    setDateEnd(new Date().toISOString().split('T')[0])
    setMinSizeMB('')
    setMaxSizeMB('')
    setRegexPattern('')
  }

  // Start Direct Download Queue (Desktop Add selected to queue)
  const handleStartDownload = () => {
    requireAuth(() => {
      const idsToDownload = selectedIds.length > 0 ? selectedIds : filteredMessages.map(m => m.id)
      if (idsToDownload.length === 0) return

      const items = MOCK_CHANNEL_MESSAGES.filter(m => idsToDownload.includes(m.id))
      
      const newJob = {
        id: `job-${Date.now()}`,
        channel: channelInput || '@sample_channel',
        topic: selectedTopic,
        items: items,
        completed: 0,
        total: items.length,
        status: 'downloading',
        progress: 0
      }

      setDownloadQueue(prev => [newJob, ...prev])
      setSelectedIds([])

      simulateDownloadProgress(newJob.id)
    })
  }

  const simulateDownloadProgress = (jobId) => {
    const interval = setInterval(() => {
      setDownloadQueue(prevQueue => {
        return prevQueue.map(job => {
          if (job.id !== jobId || job.status !== 'downloading') return job

          const nextCompleted = Math.min(job.total, job.completed + 1)
          const nextProgress = Math.round((nextCompleted / job.total) * 100)
          const nextStatus = nextCompleted >= job.total ? 'completed' : 'downloading'

          if (nextStatus === 'completed') {
            clearInterval(interval)
          }

          return {
            ...job,
            completed: nextCompleted,
            progress: nextProgress,
            status: nextStatus
          }
        })
      })
    }, 1000)
  }

  const toggleJobPause = (jobId) => {
    setDownloadQueue(prev => prev.map(j => {
      if (j.id === jobId) {
        const nextStatus = j.status === 'downloading' ? 'paused' : 'downloading'
        if (nextStatus === 'downloading') simulateDownloadProgress(jobId)
        return { ...j, status: nextStatus }
      }
      return j
    }))
  }

  const removeJob = (jobId) => {
    setDownloadQueue(prev => prev.filter(j => j.id !== jobId))
  }

  const formatSize = (bytes) => {
    if (bytes >= 1073741824) return (bytes / 1073741824).toFixed(2) + ' GB'
    if (bytes >= 1048576) return (bytes / 1048576).toFixed(1) + ' MB'
    return (bytes / 1024).toFixed(0) + ' KB'
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-10 space-y-8">
      <SeoMeta
        title="TG Media Downloader - Fast, Bulk & Direct Telegram Downloader"
        description="Download files, videos, music, archives, and forum topics directly from Telegram channels. High speed, direct local downloads, and topic filtering."
      />

      {/* Hero Header */}
      <div className="space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-[6px] bg-[#635BFF]/10 border border-[#635BFF]/30 text-[#635BFF] text-xs font-mono font-bold">
          <Terminal className="w-4 h-4 text-[#635BFF]" />
          <span>LOCAL TELEGRAM MEDIA TOOL v2.7</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          TG Media Downloader
        </h1>
        <p className="text-slate-600 dark:text-slate-300 text-base max-w-2xl">
          Connect your Telegram account API credentials, select your joined chats or enter a channel name, choose exact files by category, and watch live progress.
        </p>
      </div>

      {/* ── STEP 1: CONNECT TELEGRAM ACCOUNT (Exact Desktop LoginView Fields) ── */}
      <div className="glass-panel p-6 rounded-[12px] space-y-6">
        <div className="flex items-center justify-between border-b border-[#CBD5E1] dark:border-[#E6E6E6]/10 pb-3">
          <div className="space-y-1">
            <span className="text-xs font-mono font-bold text-[#635BFF] uppercase">STEP 1 OF 3</span>
            <h2 className="font-bold text-slate-900 dark:text-white text-lg sm:text-xl tracking-tight">
              Connect Telegram
            </h2>
            <p className="text-xs font-mono text-slate-600 dark:text-slate-400">
              Enter the API details for your Telegram account.
            </p>
          </div>

          {tgSession.connected ? (
            <div className="flex items-center gap-3">
              <span className="badge-mono bg-[#00C48C]/10 text-[#00C48C] border border-[#00C48C]/30 flex items-center gap-1.5 font-bold">
                <CheckCircle2 className="w-4 h-4" /> CONNECTED ({tgSession.phone})
              </span>
              <button
                onClick={disconnectTelegram}
                className="py-1.5 px-3.5 rounded-[6px] bg-[#FF4B4B]/10 hover:bg-[#FF4B4B]/20 text-[#FF4B4B] text-xs font-mono font-bold transition border border-[#FF4B4B]/30"
              >
                Disconnect
              </button>
            </div>
          ) : (
            <span className="badge-mono bg-[#FFC700]/10 text-[#FFC700] border border-[#FFC700]/30 font-bold">
              STEP {tgSession.step} OF 3
            </span>
          )}
        </div>

        {!tgSession.connected ? (
          <div className="space-y-4">
            {tgError && (
              <div className="p-3 rounded-[6px] bg-[#FF4B4B]/10 border border-[#FF4B4B]/30 text-[#FF4B4B] text-xs font-mono font-semibold">
                {tgError}
              </div>
            )}

            {tgSession.step === 1 ? (
              /* Desktop Login Page 1: API ID, API Hash, Phone */
              <form onSubmit={handleSendCode} className="grid grid-cols-1 sm:grid-cols-3 gap-5 text-sm font-mono">
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">API ID</label>
                  <input
                    type="text"
                    placeholder="Example: 12345678"
                    value={inpApiId}
                    onChange={(e) => setInpApiId(e.target.value)}
                    required
                    className="w-full px-3.5 py-2.5 rounded-[6px] glass-input text-slate-900 dark:text-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">API hash</label>
                  <input
                    type="text"
                    placeholder="32-character API hash"
                    value={inpApiHash}
                    onChange={(e) => setInpApiHash(e.target.value)}
                    required
                    className="w-full px-3.5 py-2.5 rounded-[6px] glass-input text-slate-900 dark:text-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">Phone number with country code</label>
                  <input
                    type="text"
                    placeholder="+91 98765 43210"
                    value={inpPhone}
                    onChange={(e) => setInpPhone(e.target.value)}
                    required
                    className="w-full px-3.5 py-2.5 rounded-[6px] glass-input text-slate-900 dark:text-white focus:outline-none"
                  />
                </div>

                <div className="sm:col-span-3 pt-2">
                  <button type="submit" className="btn-fintech-primary text-sm font-semibold w-full sm:w-auto">
                    Send verification code
                  </button>
                </div>
              </form>
            ) : (
              /* Desktop Login Page 2: Login Code OTP */
              <form onSubmit={handleVerifyCode} className="space-y-4 text-sm font-mono max-w-md">
                <p className="text-slate-600 dark:text-slate-300 text-xs">
                  Check your Telegram app for the login code sent to <strong className="text-slate-900 dark:text-white">{tgSession.phone}</strong>.
                </p>
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">Login code</label>
                  <input
                    type="text"
                    placeholder="Enter the code"
                    value={inpOtpCode}
                    onChange={(e) => setInpOtpCode(e.target.value)}
                    required
                    className="w-full px-3.5 py-2.5 rounded-[6px] glass-input text-slate-900 dark:text-white focus:outline-none"
                  />
                </div>
                <div className="flex items-center gap-3 pt-1">
                  <button type="submit" className="btn-fintech-primary text-sm font-semibold">
                    Verify and log in
                  </button>
                  <button
                    type="button"
                    onClick={disconnectTelegram}
                    className="btn-fintech-secondary text-sm font-semibold"
                  >
                    Back
                  </button>
                </div>
              </form>
            )}
          </div>
        ) : (
          <div className="text-xs text-slate-600 dark:text-slate-300 font-mono space-y-1">
            <p>Your Telegram session is active. Pre-fetched <strong className="text-[#635BFF]">{tgSession.chats.length} joined channels & groups</strong>.</p>
          </div>
        )}
      </div>

      {/* ── STEP 2: CHAT SELECTOR & MEDIA FETCH (Exact Desktop MainWindow Controls) ── */}
      <div className="glass-panel p-6 rounded-[12px] space-y-4">
        <div className="flex flex-col sm:flex-row gap-3">
          
          {/* Pre-fetched Joined Chats Dropdown OR Manual Channel Link Input */}
          <div className="relative flex-1">
            {tgSession.connected && tgSession.chats.length > 0 ? (
              <select
                value={channelInput}
                onChange={(e) => setChannelInput(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-[6px] glass-input text-sm font-mono text-slate-900 dark:text-white focus:outline-none"
              >
                <option value="" className="bg-white dark:bg-[#1A1A1A] text-slate-900 dark:text-white">-- Select Chat from Your Telegram Account --</option>
                {tgSession.chats.map(chat => (
                  <option key={chat.id} value={`@${chat.username}`} className="bg-white dark:bg-[#1A1A1A] text-slate-900 dark:text-white">
                    {chat.title} (@{chat.username}) - {chat.unread} unread
                  </option>
                ))}
              </select>
            ) : (
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type="text"
                  placeholder="Enter channel username (e.g. @study_notes) or link..."
                  value={channelInput}
                  onChange={(e) => setChannelInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleFetch()}
                  className="w-full pl-10 pr-4 py-2.5 rounded-[6px] glass-input text-sm text-slate-900 dark:text-white focus:outline-none"
                />
              </div>
            )}
          </div>

          {/* Forum Topic Picker */}
          <select
            value={selectedTopic}
            onChange={(e) => setSelectedTopic(e.target.value)}
            className="px-3.5 py-2.5 rounded-[6px] glass-input text-sm font-mono text-slate-900 dark:text-white focus:outline-none"
          >
            <option value="all" className="bg-white dark:bg-[#1A1A1A] text-slate-900 dark:text-white">TOPIC: ALL (Main Feed)</option>
            <option value="101" className="bg-white dark:bg-[#1A1A1A] text-slate-900 dark:text-white">TOPIC #1: PDF Textbooks</option>
            <option value="102" className="bg-white dark:bg-[#1A1A1A] text-slate-900 dark:text-white">TOPIC #2: Video Courses</option>
            <option value="103" className="bg-white dark:bg-[#1A1A1A] text-slate-900 dark:text-white">TOPIC #3: ZIP Archives</option>
          </select>

          <button
            onClick={handleFetch}
            disabled={isFetching}
            className="btn-fintech-primary text-sm font-semibold flex items-center justify-center gap-2 whitespace-nowrap"
          >
            {isFetching ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Fetching...</span>
              </>
            ) : (
              <>
                <Download className="w-4 h-4" />
                <span>Fetch media</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* ── STEP 3: MEDIA BROWSER DIALOG & FILTERS (Exact Desktop MediaBrowserDialog) ── */}
      {hasFetched && (
        <div className="glass-panel rounded-[12px] p-6 space-y-6">
          
          {/* Desktop MediaBrowserDialog Hero Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#CBD5E1] dark:border-[#E6E6E6]/10 pb-4">
            <div>
              <span className="text-xs font-mono font-bold text-[#635BFF] uppercase">MEDIA SELECTION</span>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
                {channelInput || 'Telegram Channel'}
              </h2>
              <p className="text-xs font-mono text-slate-600 dark:text-slate-400">
                Choose categories now or load the file list for exact selection.
              </p>
            </div>

            <div className="badge-mono bg-[#635BFF]/10 text-[#635BFF] border border-[#635BFF]/30 font-bold text-sm">
              {selectedIds.length} files selected
            </div>
          </div>

          {/* Desktop Search Toolbar */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="relative w-full md:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                placeholder="Search by file name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-3 py-2 rounded-[6px] glass-input text-sm text-slate-900 dark:text-white focus:outline-none"
              />
            </div>

            <button
              onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
              className="btn-fintech-secondary text-xs flex items-center gap-2"
            >
              <Filter className="w-4 h-4 text-[#635BFF]" />
              <span>{showAdvancedFilters ? 'Hide advanced settings' : 'Show advanced settings'}</span>
            </button>
          </div>

          {/* Exact Desktop FilterPanel (Date range, Size MB, Regex pattern, Reset filters, Sort by) */}
          {showAdvancedFilters && (
            <div className="p-5 rounded-[6px] glass-card grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 text-xs font-mono">
              
              {/* Date Range */}
              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">Date range</label>
                <div className="flex items-center gap-2">
                  <input
                    type="date"
                    value={dateStart}
                    onChange={(e) => setDateStart(e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded-[6px] glass-input text-slate-900 dark:text-white focus:outline-none"
                  />
                  <span className="text-slate-500">to</span>
                  <input
                    type="date"
                    value={dateEnd}
                    onChange={(e) => setDateEnd(e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded-[6px] glass-input text-slate-900 dark:text-white focus:outline-none"
                  />
                </div>
              </div>

              {/* Size (MB) */}
              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">Size (MB)</label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    placeholder="Min MB"
                    value={minSizeMB}
                    onChange={(e) => setMinSizeMB(e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded-[6px] glass-input focus:outline-none"
                  />
                  <span className="text-slate-500">-</span>
                  <input
                    type="number"
                    placeholder="Max MB"
                    value={maxSizeMB}
                    onChange={(e) => setMaxSizeMB(e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded-[6px] glass-input focus:outline-none"
                  />
                </div>
              </div>

              {/* File name pattern Regex */}
              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">File name pattern</label>
                <input
                  type="text"
                  placeholder="e.g. ^IMG_.*\.jpg$"
                  value={regexPattern}
                  onChange={(e) => setRegexPattern(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-[6px] glass-input focus:outline-none"
                />
              </div>

              {/* Reset Filters & Sort Controls */}
              <div className="sm:col-span-3 flex flex-col sm:flex-row items-center justify-between gap-4 pt-2 border-t border-[#CBD5E1] dark:border-white/10">
                <button
                  onClick={resetFilters}
                  className="btn-fintech-secondary text-xs flex items-center gap-1.5 py-1.5 px-3"
                >
                  <RotateCcw className="w-3.5 h-3.5 text-[#FF4B4B]" />
                  <span>Reset filters</span>
                </button>

                <div className="flex items-center gap-3">
                  <span className="text-slate-700 dark:text-slate-300 font-bold">Sort by</span>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="px-3 py-1.5 rounded-[6px] glass-input text-xs font-mono text-slate-900 dark:text-white focus:outline-none"
                  >
                    <option value="Date" className="bg-white dark:bg-[#1A1A1A] text-slate-900 dark:text-white">Date</option>
                    <option value="File Size" className="bg-white dark:bg-[#1A1A1A] text-slate-900 dark:text-white">File Size</option>
                    <option value="File Name" className="bg-white dark:bg-[#1A1A1A] text-slate-900 dark:text-white">File Name</option>
                  </select>

                  <button
                    onClick={() => setSortDesc(!sortDesc)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-[6px] bg-[#635BFF]/10 text-[#635BFF] border border-[#635BFF]/30 hover:bg-[#635BFF]/20 transition font-mono text-xs font-bold"
                  >
                    <ArrowUpDown className="w-3.5 h-3.5" />
                    <span>{sortDesc ? '⬇ Descending' : '⬆ Ascending'}</span>
                  </button>
                </div>
              </div>

            </div>
          )}

          {/* Exact 9 Desktop Media Category Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-2 border-b border-[#CBD5E1] dark:border-[#E6E6E6]/10 text-xs font-medium no-scrollbar">
            {[
              { id: 'all', label: 'All Files', icon: Layers },
              { id: 'media', label: 'Media', icon: Film },
              { id: 'files', label: 'Documents', icon: FileText },
              { id: 'zips', label: 'Archives', icon: Archive },
              { id: 'music', label: 'Music', icon: Music },
              { id: 'voice', label: 'Voice Notes', icon: Sparkles },
              { id: 'links', label: 'Links', icon: LinkIcon },
              { id: 'gifs', label: 'GIFs', icon: Smile },
              { id: 'chat', label: 'Chat Logs', icon: MessageSquare },
            ].map(tab => {
              const Icon = tab.icon
              const count = tab.id === 'all' 
                ? MOCK_CHANNEL_MESSAGES.length 
                : MOCK_CHANNEL_MESSAGES.filter(m => m.type === tab.id).length
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-[6px] transition whitespace-nowrap text-xs sm:text-sm font-semibold ${
                    activeTab === tab.id
                      ? 'bg-[#635BFF] text-white shadow-sm'
                      : 'text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/60 dark:hover:bg-white/5'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                  <span className="font-mono text-xs opacity-80">({count})</span>
                </button>
              )
            })}
          </div>

          {/* File Rows List */}
          <div className="space-y-2.5 max-h-[480px] overflow-y-auto pr-1">
            {filteredMessages.length === 0 ? (
              <div className="text-center py-12 text-slate-500 dark:text-slate-400 text-sm font-mono">
                No matching media files found for current filter.
              </div>
            ) : (
              filteredMessages.map(item => {
                const isSelected = selectedIds.includes(item.id)
                return (
                  <div
                    key={item.id}
                    onClick={() => toggleSelect(item.id)}
                    className={`flex items-center gap-4 p-4 rounded-[6px] border transition cursor-pointer ${
                      isSelected 
                        ? 'bg-[#635BFF]/10 border-[#635BFF]' 
                        : 'glass-card hover:border-[#635BFF]/40'
                    }`}
                  >
                    <button className="text-slate-400 hover:text-[#635BFF]">
                      {isSelected ? (
                        <CheckSquare className="w-5 h-5 text-[#635BFF]" />
                      ) : (
                        <Square className="w-5 h-5 text-slate-400" />
                      )}
                    </button>

                    <div className="w-9 h-9 rounded-[4px] bg-slate-100 dark:bg-white/5 border border-slate-300 dark:border-white/10 flex items-center justify-center text-slate-700 dark:text-slate-300 shrink-0 font-mono font-bold text-xs">
                      {item.type === 'files' && 'DOC'}
                      {item.type === 'media' && 'MED'}
                      {item.type === 'zips' && 'ZIP'}
                      {item.type === 'music' && 'AUD'}
                      {item.type === 'voice' && 'VOC'}
                      {item.type === 'links' && 'URL'}
                      {item.type === 'gifs' && 'GIF'}
                      {item.type === 'chat' && 'TXT'}
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm sm:text-base text-slate-900 dark:text-white truncate">{item.title}</p>
                      <div className="flex items-center gap-3 text-xs font-mono text-slate-600 dark:text-slate-400 mt-1">
                        <span className="badge-mono py-0.5 px-2 bg-slate-200 dark:bg-white/10 text-current">{formatSize(item.size)}</span>
                        <span>•</span>
                        <span>{item.date}</span>
                      </div>
                    </div>

                    <span className="badge-mono bg-[#635BFF]/10 text-[#635BFF] border border-[#635BFF]/20 uppercase font-bold text-xs">
                      {item.ext}
                    </span>
                  </div>
                )
              })
            )}
          </div>

          {/* Desktop Dialog Bottom Actions */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-[#CBD5E1] dark:border-[#E6E6E6]/10">
            <div className="flex items-center gap-2">
              <button
                onClick={selectAll}
                className="btn-fintech-secondary text-xs py-1.5 px-3.5"
              >
                Select visible ({filteredMessages.length})
              </button>
              <button
                onClick={clearSelection}
                className="btn-fintech-secondary text-xs py-1.5 px-3.5"
              >
                Clear selection
              </button>
            </div>

            <button
              onClick={handleStartDownload}
              className="btn-fintech-primary text-sm font-bold flex items-center gap-2"
            >
              <FolderDown className="w-4 h-4" />
              <span>
                Add {selectedIds.length > 0 ? `${selectedIds.length} files` : 'visible'} to queue
              </span>
            </button>
          </div>

        </div>
      )}

      {/* Active Download Queue Manager (Desktop Queue Card) */}
      {downloadQueue.length > 0 && (
        <div className="glass-panel rounded-[12px] p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-[#CBD5E1] dark:border-[#E6E6E6]/10 pb-3">
            <h3 className="font-bold text-slate-900 dark:text-white text-sm font-mono uppercase flex items-center gap-2">
              <Cpu className="w-4 h-4 text-[#635BFF]" />
              <span>Active Download Queue ({downloadQueue.length})</span>
            </h3>
          </div>

          <div className="space-y-3">
            {downloadQueue.map(job => (
              <div key={job.id} className="glass-card p-4 rounded-[6px] space-y-2">
                <div className="flex items-center justify-between text-xs sm:text-sm font-mono">
                  <div>
                    <span className="font-bold text-slate-900 dark:text-white">{job.channel}</span>
                    <span className="text-slate-600 dark:text-slate-400 ml-2">
                      ({job.completed} / {job.total} files completed)
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => toggleJobPause(job.id)}
                      className="p-1.5 rounded-[4px] bg-slate-200 dark:bg-white/10 hover:bg-slate-300 dark:hover:bg-white/20"
                    >
                      {job.status === 'downloading' ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                    </button>
                    <button
                      onClick={() => removeJob(job.id)}
                      className="p-1.5 rounded-[4px] bg-[#FF4B4B]/20 text-[#FF4B4B]"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="w-full h-2 bg-slate-200 dark:bg-white/10 rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all duration-300 ${
                      job.status === 'completed' ? 'bg-[#00C48C]' : 'bg-[#635BFF]'
                    }`}
                    style={{ width: `${job.progress}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  )
}
