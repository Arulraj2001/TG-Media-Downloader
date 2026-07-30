import React, { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import SeoMeta from '../components/SeoMeta'
import { 
  Search, Download, Filter, ArrowUpDown, Calendar, HardDrive, 
  FileText, Image, Film, Music, Archive, Link as LinkIcon, 
  Smile, MessageSquare, CheckSquare, Square, RefreshCw, Layers,
  ChevronDown, ChevronUp, Pause, Play, Trash2, ShieldCheck, Sparkles, FolderDown
} from 'lucide-react'

// Mock Telegram channel data for web demo
const MOCK_CHANNEL_MESSAGES = [
  { id: 101, title: 'Python_Data_Science_Handbook_2026.pdf', size: 15485760, date: '2026-03-15', type: 'files', category: 'PDF Document', ext: 'pdf' },
  { id: 102, title: 'Fullstack_Web_Development_Masterclass.mp4', size: 452428800, date: '2026-03-20', type: 'media', category: 'Video', ext: 'mp4' },
  { id: 103, title: 'Machine_Learning_Datasets_Bundle.zip', size: 104857600, date: '2026-02-10', type: 'zips', category: 'Archive', ext: 'zip' },
  { id: 104, title: 'Lofi_Study_Background_Audio.mp3', size: 8428800, date: '2026-01-05', type: 'music', category: 'Audio', ext: 'mp3' },
  { id: 105, title: 'UI_Design_System_Mockups_Dark.png', size: 5242880, date: '2026-03-25', type: 'media', category: 'Photo', ext: 'png' },
  { id: 106, title: 'Advanced_NodeJS_Microservices_Architecture.pdf', size: 24500000, date: '2026-03-28', type: 'files', category: 'PDF Document', ext: 'pdf' },
  { id: 107, title: 'React_18_Performance_Optimization_Guide.mp4', size: 280000000, date: '2026-03-12', type: 'media', category: 'Video', ext: 'mp4' },
  { id: 108, title: 'Project_Source_Code_Backup.7z', size: 95000000, date: '2026-02-28', type: 'zips', category: 'Archive', ext: '7z' },
]

export default function DownloaderView() {
  const { requireAuth, consumeFetch, freeFetchesRemaining, subscription } = useAuth()
  const [channelInput, setChannelInput] = useState('')
  const [selectedTopic, setSelectedTopic] = useState('all')
  const [isFetching, setIsFetching] = useState(false)
  const [hasFetched, setHasFetched] = useState(false)
  
  // Tab State
  const [activeTab, setActiveTab] = useState('all')
  
  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('')
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false)
  const [minSizeMB, setMinSizeMB] = useState('')
  const [maxSizeMB, setMaxSizeMB] = useState('')
  
  // Sorting State
  const [sortBy, setSortBy] = useState('Date') // Date, Size, Name
  const [sortDesc, setSortDesc] = useState(true) // true = Descending, false = Ascending
  
  // Selection State
  const [selectedIds, setSelectedIds] = useState([])
  
  // Active Queue State
  const [downloadQueue, setDownloadQueue] = useState([])

  const handleFetch = () => {
    requireAuth(() => {
      if (!channelInput.trim()) return
      if (!consumeFetch()) {
        alert('You have reached your free fetch limit. Please subscribe to a 3, 6, or 12-month pass for unlimited fetches!')
        return
      }
      setIsFetching(true)
      setTimeout(() => {
        setIsFetching(false)
        setHasFetched(true)
        setSelectedIds([])
      }, 800)
    })
  }

  // Filter & Sort Logic
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

    // Size filters
    if (minSizeMB) {
      const minBytes = parseFloat(minSizeMB) * 1024 * 1024
      list = list.filter(m => m.size >= minBytes)
    }
    if (maxSizeMB) {
      const maxBytes = parseFloat(maxSizeMB) * 1024 * 1024
      list = list.filter(m => m.size <= maxBytes)
    }

    // Sorting
    list.sort((a, b) => {
      let valA, valB
      if (sortBy === 'Date') {
        valA = new Date(a.date).getTime()
        valB = new Date(b.date).getTime()
      } else if (sortBy === 'Size') {
        valA = a.size
        valB = b.size
      } else if (sortBy === 'Name') {
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

  // Start Direct Download
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
        status: 'downloading', // downloading, paused, completed
        progress: 0
      }

      setDownloadQueue(prev => [newJob, ...prev])
      setSelectedIds([])

      // Simulate direct local download stream
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
    }, 1200)
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
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
      <SeoMeta
        title="TG Media Downloader - Fast, Bulk & Direct Telegram Downloader"
        description="Download files, videos, music, archives, and forum topics directly from Telegram channels. High speed, direct local downloads, and topic filtering."
      />

      {/* Hero Section */}
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-500/10 border border-brand-500/30 text-brand-300 text-xs font-semibold">
          <Sparkles className="w-4 h-4 text-brand-400" />
          <span>Direct Browser Local Downloads</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Download Telegram Media Files Directly
        </h1>
        <p className="text-slate-400 text-sm sm:text-base">
          Enter any channel username or link to browse, filter, sort, and stream files directly to your device.
        </p>
      </div>

      {/* Search Bar / Input Card */}
      <div className="glass-panel p-6 rounded-2xl space-y-4 shadow-glow">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-5 h-5 text-slate-400 absolute left-4 top-3.5" />
            <input
              type="text"
              placeholder="Enter channel username (e.g. @study_and_chill) or link..."
              value={channelInput}
              onChange={(e) => setChannelInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleFetch()}
              className="w-full pl-12 pr-4 py-3 rounded-xl glass-input text-sm text-white focus:outline-none"
            />
          </div>

          {/* Forum Topic Picker */}
          <select
            value={selectedTopic}
            onChange={(e) => setSelectedTopic(e.target.value)}
            className="px-4 py-3 rounded-xl glass-input text-sm text-slate-200 bg-[#18181D] focus:outline-none"
          >
            <option value="all">All Topics (Main Feed)</option>
            <option value="101">Topic #1: PDF Textbooks</option>
            <option value="102">Topic #2: Video Courses</option>
            <option value="103">Topic #3: ZIP Archives</option>
          </select>

          <button
            onClick={handleFetch}
            disabled={isFetching}
            className="py-3 px-6 rounded-xl bg-gradient-to-r from-brand-600 to-brand-500 hover:from-brand-500 hover:to-brand-400 text-white font-semibold text-sm transition shadow-glow flex items-center justify-center gap-2 whitespace-nowrap"
          >
            {isFetching ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Fetching...</span>
              </>
            ) : (
              <>
                <Download className="w-4 h-4" />
                <span>Fetch Media</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Media Browser & Filters Area */}
      {hasFetched && (
        <div className="glass-panel rounded-2xl p-6 space-y-6 shadow-glow">
          
          {/* Header Controls: Search & Toggle Advanced Filters */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 border-b border-white/10 pb-4">
            <div className="relative w-full md:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search by file name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 rounded-lg glass-input text-xs text-white focus:outline-none"
              />
            </div>

            <button
              onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-xs text-slate-300 font-medium border border-white/10 transition"
            >
              <Filter className="w-3.5 h-3.5 text-brand-400" />
              <span>{showAdvancedFilters ? 'Hide Advanced Settings' : 'Show Advanced Settings'}</span>
            </button>
          </div>

          {/* Advanced Filter Panel */}
          {showAdvancedFilters && (
            <div className="p-4 rounded-xl bg-white/5 border border-white/10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">Min Size (MB)</label>
                <input
                  type="number"
                  placeholder="e.g. 5"
                  value={minSizeMB}
                  onChange={(e) => setMinSizeMB(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-lg glass-input text-white focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-slate-400 mb-1">Max Size (MB)</label>
                <input
                  type="number"
                  placeholder="e.g. 500"
                  value={maxSizeMB}
                  onChange={(e) => setMaxSizeMB(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-lg glass-input text-white focus:outline-none"
                />
              </div>
              <div className="flex items-end">
                <button
                  onClick={() => { setMinSizeMB(''); setMaxSizeMB(''); setSearchQuery(''); }}
                  className="w-full py-1.5 px-3 rounded-lg bg-rose-500/20 text-rose-300 hover:bg-rose-500/30 transition font-medium text-xs"
                >
                  Reset Filters
                </button>
              </div>
            </div>
          )}

          {/* Category Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-2 border-b border-white/10 text-xs font-medium no-scrollbar">
            {[
              { id: 'all', label: 'All Files', icon: Layers },
              { id: 'media', label: 'Media', icon: Film },
              { id: 'files', label: 'Documents', icon: FileText },
              { id: 'zips', label: 'Archives', icon: Archive },
              { id: 'music', label: 'Music', icon: Music },
            ].map(tab => {
              const Icon = tab.icon
              const count = tab.id === 'all' 
                ? MOCK_CHANNEL_MESSAGES.length 
                : MOCK_CHANNEL_MESSAGES.filter(m => m.type === tab.id).length
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl transition whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'bg-brand-500 text-white font-semibold shadow-glow'
                      : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{tab.label} ({count})</span>
                </button>
              )
            })}
          </div>

          {/* Tool Headers: Selectors + Sorting Controls */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
            
            {/* Selection Controls */}
            <div className="flex items-center gap-2">
              <button
                onClick={selectAll}
                className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 transition"
              >
                Select Visible ({filteredMessages.length})
              </button>
              <button
                onClick={clearSelection}
                className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 transition"
              >
                Clear All
              </button>
              <span className="text-slate-400 ml-2">
                Selected: <strong className="text-white">{selectedIds.length}</strong>
              </span>
            </div>

            {/* Sorting Controls */}
            <div className="flex items-center gap-2">
              <span className="text-slate-400">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-1.5 rounded-lg glass-input text-slate-200 bg-[#18181D] focus:outline-none"
              >
                <option value="Date">Date</option>
                <option value="Size">File Size</option>
                <option value="Name">File Name</option>
              </select>

              <button
                onClick={() => setSortDesc(!sortDesc)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-brand-500/20 text-brand-300 border border-brand-500/30 hover:bg-brand-500/30 transition font-medium"
              >
                <ArrowUpDown className="w-3.5 h-3.5" />
                <span>{sortDesc ? '⬇ Descending' : '⬆ Ascending'}</span>
              </button>
            </div>
          </div>

          {/* File List Cards */}
          <div className="space-y-2.5 max-h-[450px] overflow-y-auto pr-1">
            {filteredMessages.length === 0 ? (
              <div className="text-center py-12 text-slate-500 text-sm">
                No matching media files found for current filter or category.
              </div>
            ) : (
              filteredMessages.map(item => {
                const isSelected = selectedIds.includes(item.id)
                return (
                  <div
                    key={item.id}
                    onClick={() => toggleSelect(item.id)}
                    className={`flex items-center gap-4 p-3.5 rounded-xl border transition cursor-pointer ${
                      isSelected 
                        ? 'bg-brand-500/10 border-brand-500/50 shadow-glow' 
                        : 'glass-card hover:bg-white/5 border-white/5'
                    }`}
                  >
                    <button className="text-slate-400 hover:text-brand-400">
                      {isSelected ? (
                        <CheckSquare className="w-5 h-5 text-brand-400" />
                      ) : (
                        <Square className="w-5 h-5 text-slate-600" />
                      )}
                    </button>

                    <div className="w-9 h-9 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-slate-300">
                      {item.type === 'files' && <FileText className="w-4 h-4" />}
                      {item.type === 'media' && <Film className="w-4 h-4 text-purple-400" />}
                      {item.type === 'zips' && <Archive className="w-4 h-4 text-amber-400" />}
                      {item.type === 'music' && <Music className="w-4 h-4 text-emerald-400" />}
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-xs text-white truncate">{item.title}</p>
                      <div className="flex items-center gap-3 text-[11px] text-slate-400 mt-0.5">
                        <span>{item.category}</span>
                        <span>•</span>
                        <span>{formatSize(item.size)}</span>
                        <span>•</span>
                        <span>{item.date}</span>
                      </div>
                    </div>
                  </div>
                )
              })
            )}
          </div>

          {/* Action Bar Footer */}
          <div className="flex items-center justify-between pt-4 border-t border-white/10">
            <span className="text-xs text-slate-400">
              Direct Local Download Streams • 0 Server Storage
            </span>
            <button
              onClick={handleStartDownload}
              className="py-2.5 px-6 rounded-xl bg-gradient-to-r from-brand-600 to-brand-500 hover:from-brand-500 hover:to-brand-400 text-white font-semibold text-xs transition shadow-glow flex items-center gap-2"
            >
              <FolderDown className="w-4 h-4" />
              <span>
                Download {selectedIds.length > 0 ? `Selected (${selectedIds.length})` : 'All Visible'}
              </span>
            </button>
          </div>

        </div>
      )}

      {/* Active Download Queue Manager */}
      {downloadQueue.length > 0 && (
        <div className="glass-panel rounded-2xl p-6 space-y-4 shadow-glow">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <h3 className="font-bold text-white text-sm flex items-center gap-2">
              <FolderDown className="w-4 h-4 text-brand-400" />
              <span>Active Downloads Queue ({downloadQueue.length})</span>
            </h3>
          </div>

          <div className="space-y-3">
            {downloadQueue.map(job => (
              <div key={job.id} className="glass-card p-4 rounded-xl space-y-2 border border-white/10">
                <div className="flex items-center justify-between text-xs">
                  <div>
                    <span className="font-semibold text-white">{job.channel}</span>
                    <span className="text-slate-400 ml-2">
                      ({job.completed} / {job.total} files downloaded)
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => toggleJobPause(job.id)}
                      className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300"
                    >
                      {job.status === 'downloading' ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                    </button>
                    <button
                      onClick={() => removeJob(job.id)}
                      className="p-1.5 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 text-rose-300"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all duration-300 ${
                      job.status === 'completed' ? 'bg-emerald-500' : 'bg-brand-500'
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
