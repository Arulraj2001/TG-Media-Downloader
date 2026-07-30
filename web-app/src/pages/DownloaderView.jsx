import React, { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import SeoMeta from '../components/SeoMeta'
import { 
  Search, Download, Filter, ArrowUpDown, Calendar, HardDrive, 
  FileText, Image, Film, Music, Archive, Link as LinkIcon, 
  Smile, MessageSquare, CheckSquare, Square, RefreshCw, Layers,
  ChevronDown, ChevronUp, Pause, Play, Trash2, ShieldCheck, Sparkles, FolderDown, Terminal, Cpu
} from 'lucide-react'

// Mock Telegram channel data with all 9 desktop categories
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

      {/* Hero Section - Minimalist Fintech Style */}
      <div className="space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-[6px] bg-[#635BFF]/10 border border-[#635BFF]/30 text-[#635BFF] text-xs font-mono font-medium">
          <Terminal className="w-3.5 h-3.5" />
          <span>DIRECT STREAMING API ENGINE</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-current tracking-tight">
          Telegram Channel Media Downloader
        </h1>
        <p className="text-slate-400 text-sm max-w-2xl">
          Enter any channel username or link to browse, filter, sort, and stream files directly to your device.
        </p>
      </div>

      {/* Input / Control Card */}
      <div className="glass-panel p-5 rounded-[12px] space-y-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              placeholder="Enter channel username (e.g. @study_notes) or link..."
              value={channelInput}
              onChange={(e) => setChannelInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleFetch()}
              className="w-full pl-10 pr-4 py-2.5 rounded-[6px] glass-input text-xs text-current focus:outline-none"
            />
          </div>

          {/* Forum Topic Picker */}
          <select
            value={selectedTopic}
            onChange={(e) => setSelectedTopic(e.target.value)}
            className="px-3.5 py-2.5 rounded-[6px] glass-input text-xs font-mono focus:outline-none"
          >
            <option value="all">TOPIC: ALL (Main Feed)</option>
            <option value="101">TOPIC #1: PDF Textbooks</option>
            <option value="102">TOPIC #2: Video Courses</option>
            <option value="103">TOPIC #3: ZIP Archives</option>
          </select>

          <button
            onClick={handleFetch}
            disabled={isFetching}
            className="btn-fintech-primary text-xs flex items-center justify-center gap-2 whitespace-nowrap"
          >
            {isFetching ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>FETCHING...</span>
              </>
            ) : (
              <>
                <Download className="w-4 h-4" />
                <span>FETCH MEDIA</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Media Browser & Filters Area */}
      {hasFetched && (
        <div className="glass-panel rounded-[12px] p-6 space-y-6">
          
          {/* Header Controls: Search & Toggle Advanced Filters */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 border-b border-[#E6E6E6]/10 pb-4">
            <div className="relative w-full md:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search by file name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 rounded-[6px] glass-input text-xs text-current focus:outline-none"
              />
            </div>

            <button
              onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
              className="btn-fintech-secondary text-xs flex items-center gap-2"
            >
              <Filter className="w-3.5 h-3.5 text-[#635BFF]" />
              <span>{showAdvancedFilters ? 'Hide Advanced Filters' : 'Show Advanced Filters'}</span>
            </button>
          </div>

          {/* Advanced Filter Panel */}
          {showAdvancedFilters && (
            <div className="p-4 rounded-[6px] glass-card grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-xs">
              <div>
                <label className="block text-slate-400 mb-1 font-mono text-[11px]">MIN SIZE (MB)</label>
                <input
                  type="number"
                  placeholder="e.g. 5"
                  value={minSizeMB}
                  onChange={(e) => setMinSizeMB(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-[6px] glass-input focus:outline-none font-mono"
                />
              </div>
              <div>
                <label className="block text-slate-400 mb-1 font-mono text-[11px]">MAX SIZE (MB)</label>
                <input
                  type="number"
                  placeholder="e.g. 500"
                  value={maxSizeMB}
                  onChange={(e) => setMaxSizeMB(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-[6px] glass-input focus:outline-none font-mono"
                />
              </div>
              <div className="flex items-end">
                <button
                  onClick={() => { setMinSizeMB(''); setMaxSizeMB(''); setSearchQuery(''); }}
                  className="w-full py-1.5 px-3 rounded-[6px] bg-[#FF4B4B]/10 text-[#FF4B4B] hover:bg-[#FF4B4B]/20 transition font-semibold text-xs border border-[#FF4B4B]/20"
                >
                  Reset Filters
                </button>
              </div>
            </div>
          )}

          {/* 9 Category Tabs (Matching Desktop App 100%) */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-2 border-b border-[#E6E6E6]/10 text-xs font-medium no-scrollbar">
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
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-[6px] transition whitespace-nowrap text-xs font-semibold ${
                    activeTab === tab.id
                      ? 'bg-[#635BFF] text-white shadow-subtle'
                      : 'text-slate-400 hover:text-current hover:bg-white/5'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                  <span className="font-mono text-[10px] opacity-80">({count})</span>
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
                className="btn-fintech-secondary text-xs py-1 px-3"
              >
                Select Visible ({filteredMessages.length})
              </button>
              <button
                onClick={clearSelection}
                className="btn-fintech-secondary text-xs py-1 px-3"
              >
                Clear All
              </button>
              <span className="text-slate-400 ml-2 text-xs font-mono">
                SELECTED: <strong className="text-[#635BFF]">{selectedIds.length}</strong>
              </span>
            </div>

            {/* Sorting Controls */}
            <div className="flex items-center gap-2">
              <span className="text-slate-400 text-xs font-mono">SORT BY:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-1 rounded-[6px] glass-input text-xs font-mono focus:outline-none"
              >
                <option value="Date">Date</option>
                <option value="Size">File Size</option>
                <option value="Name">File Name</option>
              </select>

              <button
                onClick={() => setSortDesc(!sortDesc)}
                className="flex items-center gap-1.5 px-3 py-1 rounded-[6px] bg-[#635BFF]/10 text-[#635BFF] border border-[#635BFF]/30 hover:bg-[#635BFF]/20 transition font-mono text-xs"
              >
                <ArrowUpDown className="w-3.5 h-3.5" />
                <span>{sortDesc ? 'DESC' : 'ASC'}</span>
              </button>
            </div>
          </div>

          {/* File List Cards */}
          <div className="space-y-2 max-h-[450px] overflow-y-auto pr-1">
            {filteredMessages.length === 0 ? (
              <div className="text-center py-12 text-slate-400 text-xs font-mono">
                No matching media files found for current filter.
              </div>
            ) : (
              filteredMessages.map(item => {
                const isSelected = selectedIds.includes(item.id)
                return (
                  <div
                    key={item.id}
                    onClick={() => toggleSelect(item.id)}
                    className={`flex items-center gap-4 p-3 rounded-[6px] border transition cursor-pointer ${
                      isSelected 
                        ? 'bg-[#635BFF]/10 border-[#635BFF]' 
                        : 'glass-card hover:border-[#635BFF]/40'
                    }`}
                  >
                    <button className="text-slate-400 hover:text-[#635BFF]">
                      {isSelected ? (
                        <CheckSquare className="w-4 h-4 text-[#635BFF]" />
                      ) : (
                        <Square className="w-4 h-4 text-slate-500" />
                      )}
                    </button>

                    <div className="w-8 h-8 rounded-[4px] bg-white/5 border border-white/10 flex items-center justify-center text-slate-300 shrink-0">
                      {item.type === 'files' && <FileText className="w-4 h-4" />}
                      {item.type === 'media' && <Film className="w-4 h-4 text-purple-400" />}
                      {item.type === 'zips' && <Archive className="w-4 h-4 text-amber-400" />}
                      {item.type === 'music' && <Music className="w-4 h-4 text-emerald-400" />}
                      {item.type === 'voice' && <Sparkles className="w-4 h-4 text-sky-400" />}
                      {item.type === 'links' && <LinkIcon className="w-4 h-4 text-indigo-400" />}
                      {item.type === 'gifs' && <Smile className="w-4 h-4 text-pink-400" />}
                      {item.type === 'chat' && <MessageSquare className="w-4 h-4 text-teal-400" />}
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-xs text-current truncate">{item.title}</p>
                      <div className="flex items-center gap-3 text-[11px] font-mono text-slate-400 mt-0.5">
                        <span>{item.category}</span>
                        <span>•</span>
                        <span>{formatSize(item.size)}</span>
                        <span>•</span>
                        <span>{item.date}</span>
                      </div>
                    </div>

                    <span className="badge-mono bg-[#635BFF]/10 text-[#635BFF] border border-[#635BFF]/20 uppercase">
                      {item.ext}
                    </span>
                  </div>
                )
              })
            )}
          </div>

          {/* Action Bar Footer */}
          <div className="flex items-center justify-between pt-4 border-t border-[#E6E6E6]/10">
            <span className="text-xs font-mono text-slate-400">
              DIRECT LOCAL STREAMING • ZERO SERVER STORAGE
            </span>
            <button
              onClick={handleStartDownload}
              className="btn-fintech-primary text-xs flex items-center gap-2"
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
        <div className="glass-panel rounded-[12px] p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-[#E6E6E6]/10 pb-3">
            <h3 className="font-bold text-current text-xs font-mono uppercase flex items-center gap-2">
              <Cpu className="w-4 h-4 text-[#635BFF]" />
              <span>Active Streams Queue ({downloadQueue.length})</span>
            </h3>
          </div>

          <div className="space-y-3">
            {downloadQueue.map(job => (
              <div key={job.id} className="glass-card p-4 rounded-[6px] space-y-2">
                <div className="flex items-center justify-between text-xs font-mono">
                  <div>
                    <span className="font-bold text-current">{job.channel}</span>
                    <span className="text-slate-400 ml-2">
                      ({job.completed} / {job.total} files completed)
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => toggleJobPause(job.id)}
                      className="p-1 rounded-[4px] bg-white/5 hover:bg-white/10"
                    >
                      {job.status === 'downloading' ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                    </button>
                    <button
                      onClick={() => removeJob(job.id)}
                      className="p-1 rounded-[4px] bg-[#FF4B4B]/20 text-[#FF4B4B]"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="w-full h-1.5 bg-slate-200 dark:bg-white/10 rounded-full overflow-hidden">
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
