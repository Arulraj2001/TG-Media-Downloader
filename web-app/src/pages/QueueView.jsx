/**
 * QueueView — Download queue with real byte-level progress, cancel, and retry.
 *
 * Fix: Single progress bar using total bytes transferred across ALL files
 *      (instead of the old file-count % that stayed at 0 while a file was mid-download).
 */
import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import SeoMeta from '../components/SeoMeta'
import { useDownloads } from '../context/DownloadContext'
import {
  Download, CheckCircle2, XCircle, Clock, Loader2,
  ChevronDown, ChevronUp, Trash2, Zap, X, RotateCcw,
  Film, FileText, Music, Archive, ImageIcon, Mic
} from 'lucide-react'

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatSize(bytes) {
  if (!bytes || bytes === 0) return '—'
  if (bytes >= 1073741824) return (bytes / 1073741824).toFixed(2) + ' GB'
  if (bytes >= 1048576)    return (bytes / 1048576).toFixed(1) + ' MB'
  if (bytes >= 1024)       return (bytes / 1024).toFixed(0) + ' KB'
  return bytes + ' B'
}

function formatTime(iso) {
  if (!iso) return ''
  return new Date(iso).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

function formatElapsed(iso) {
  if (!iso) return ''
  const s = Math.floor((Date.now() - new Date(iso).getTime()) / 1000)
  if (s < 60) return `${s}s`
  const m = Math.floor(s / 60)
  if (m < 60) return `${m}m`
  return `${Math.floor(m / 60)}h ${m % 60}m`
}

function mediaIcon(mediaType = '') {
  const t = mediaType.toLowerCase()
  if (t.includes('video') || t.includes('film')) return <Film className="w-4 h-4" />
  if (t.includes('image') || t.includes('photo')) return <ImageIcon className="w-4 h-4" />
  if (t.includes('music') || t.includes('audio')) return <Music className="w-4 h-4" />
  if (t.includes('voice')) return <Mic className="w-4 h-4" />
  if (t.includes('doc')) return <FileText className="w-4 h-4" />
  if (t.includes('zip') || t.includes('arch')) return <Archive className="w-4 h-4" />
  return <Download className="w-4 h-4" />
}

// ─── FileRow ──────────────────────────────────────────────────────────────────

function FileStatusIcon({ status }) {
  if (status === 'done')        return <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
  if (status === 'error')       return <XCircle className="w-3.5 h-3.5 text-red-500 flex-shrink-0" />
  if (status === 'skip')        return <span className="text-[10px] font-mono text-slate-400 flex-shrink-0">SKIP</span>
  if (status === 'downloading') return <Loader2 className="w-3.5 h-3.5 text-[#635BFF] animate-spin flex-shrink-0" />
  return <Clock className="w-3.5 h-3.5 flex-shrink-0" style={{ color: 'var(--text-muted)' }} />
}

function FileRow({ file }) {
  const pct = file.size > 0 ? Math.min(100, Math.round((file.current / file.size) * 100)) : 0
  const isActive = file.status === 'downloading'

  return (
    <div className="flex items-center gap-3 py-2.5 text-xs" style={{ borderBottom: '1px solid var(--border-subtle)' }}>
      <FileStatusIcon status={file.status} />
      <div className="flex-1 min-w-0">
        <p className="text-current font-medium truncate" title={file.filename}>{file.filename}</p>
        {isActive && (
          <div className="mt-1.5 flex items-center gap-2">
            <div className="flex-1 h-1 rounded-full overflow-hidden" style={{ background: 'var(--border-subtle)' }}>
              <div
                className="h-1 rounded-full bg-[#635BFF] transition-all duration-300"
                style={{ width: `${pct}%` }}
              />
            </div>
            <span className="font-mono tabular-nums whitespace-nowrap text-[10px]" style={{ color: 'var(--text-muted)' }}>
              {file.speed || `${pct}%`}
            </span>
          </div>
        )}
        {file.status === 'error' && (
          <p className="text-red-500 text-[10px] mt-0.5 truncate">{file.error}</p>
        )}
      </div>
      <span className="font-mono tabular-nums whitespace-nowrap flex-shrink-0 text-[11px]" style={{ color: 'var(--text-muted)' }}>
        {isActive
          ? `${formatSize(file.current)} / ${formatSize(file.size)}`
          : formatSize(file.size)}
      </span>
    </div>
  )
}

// ─── DownloadCard ─────────────────────────────────────────────────────────────

function DownloadCard({ job }) {
  const { removeJob, cancelJob } = useDownloads()
  const [expanded, setExpanded] = useState(job.status === 'downloading' || job.status === 'queued')
  const [confirmCancel, setConfirmCancel] = useState(false)

  const isActive    = job.status === 'downloading' || job.status === 'queued'
  const isDone      = job.status === 'completed'
  const isFailed    = job.status === 'failed'
  const isCancelled = job.status === 'cancelled'

  // ── Unified byte-level progress ─────────────────────────────────────────────
  // Sum current bytes and total bytes across ALL files for a true overall %.
  const totalBytes   = job.files.reduce((s, f) => s + (f.size    || 0), 0)
  const currentBytes = job.files.reduce((s, f) => s + (f.current || 0), 0)
  const bytesPct     = totalBytes > 0 ? Math.min(100, Math.round((currentBytes / totalBytes) * 100)) : 0

  // If no byte data yet (files not started), fall back to file-count progress
  const pct = totalBytes > 0 ? bytesPct
    : (job.totalFiles > 0 ? Math.round((job.completedFiles / job.totalFiles) * 100) : 0)

  // Current active file speed
  const activeFile = job.files.find(f => f.status === 'downloading')
  const speed      = activeFile?.speed || ''

  const statusLabel = {
    queued:     'Queued',
    downloading:'Downloading',
    completed:  'Completed',
    failed:     'Failed',
    cancelled:  'Cancelled',
  }[job.status] || job.status

  const statusCls = {
    queued:     'bg-amber-500/10 text-amber-500 border border-amber-500/20',
    downloading:'bg-blue-500/10 text-blue-500 border border-blue-500/20',
    completed:  'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20',
    failed:     'bg-red-500/10 text-red-500 border border-red-500/20',
    cancelled:  'bg-slate-500/10 text-slate-400 border border-slate-500/20',
  }[job.status] || ''

  const iconBg = isDone ? 'bg-emerald-500' : isActive ? 'bg-[#635BFF]' : isCancelled ? 'bg-slate-500' : 'bg-red-500'

  const barColor = isDone ? 'bg-emerald-500' : isFailed ? 'bg-red-500' : isCancelled ? 'bg-slate-400' : 'bg-[#635BFF]'

  const handleCancel = () => {
    if (!confirmCancel) { setConfirmCancel(true); setTimeout(() => setConfirmCancel(false), 3000); return }
    cancelJob(job.id)
    setConfirmCancel(false)
  }

  return (
    <div className="glass-card overflow-hidden rounded-2xl">

      {/* ── Header ── */}
      <div className="px-5 py-4 flex items-start gap-4">
        {/* Icon */}
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 text-white ${iconBg}`}>
          {isActive
            ? <Loader2 className="w-5 h-5 animate-spin" />
            : isDone
              ? <CheckCircle2 className="w-5 h-5" />
              : isCancelled
                ? <X className="w-5 h-5" />
                : <XCircle className="w-5 h-5" />}
        </div>

        <div className="flex-1 min-w-0">
          {/* Title + badge */}
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="text-sm font-bold text-current truncate">{job.channelTitle}</h3>
            <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-md ${statusCls}`}>
              {statusLabel}
            </span>
          </div>
          <p className="text-[11px] font-mono mt-0.5" style={{ color: 'var(--text-muted)' }}>
            {job.mediaType} · {job.completedFiles}/{job.totalFiles} files · {formatTime(job.startedAt)}
          </p>

          {/* ── Single unified progress bar ── */}
          <div className="mt-3">
            <div className="w-full h-2 rounded-full overflow-hidden" style={{ background: 'var(--border-subtle)' }}>
              <div
                className={`h-2 rounded-full transition-all duration-500 ${barColor}`}
                style={{ width: `${isDone ? 100 : pct}%` }}
              />
            </div>
            <div className="flex items-center justify-between mt-1">
              <span className="text-[10px] font-mono tabular-nums" style={{ color: 'var(--text-muted)' }}>
                {isDone
                  ? `Done · ${formatElapsed(job.startedAt)}`
                  : isCancelled
                    ? 'Cancelled'
                    : isFailed
                      ? (job.error || 'Failed')
                      : totalBytes > 0
                        ? `${formatSize(currentBytes)} / ${formatSize(totalBytes)}`
                        : `${pct}%`}
              </span>
              {speed && isActive && (
                <span className="text-[10px] font-mono flex items-center gap-1 text-[#635BFF]">
                  <Zap className="w-3 h-3" />
                  {speed}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* ── Controls ── */}
        <div className="flex items-center gap-1 flex-shrink-0 mt-0.5">
          {/* Cancel (active only) */}
          {isActive && (
            <button
              onClick={handleCancel}
              className={`px-2 py-1 rounded-lg text-[10px] font-mono font-bold transition-all flex items-center gap-1 ${
                confirmCancel
                  ? 'bg-red-500 text-white'
                  : 'text-red-400 hover:bg-red-500/10 border border-red-500/20'
              }`}
              title="Cancel download"
            >
              <X className="w-3 h-3" />
              {confirmCancel ? 'Confirm?' : 'Cancel'}
            </button>
          )}

          {/* Remove (done / failed / cancelled) */}
          {!isActive && (
            <button
              onClick={() => removeJob(job.id)}
              className="p-1.5 rounded-lg transition-colors hover:text-red-500"
              style={{ color: 'var(--text-muted)' }}
              title="Remove"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}

          {/* Expand / collapse */}
          <button
            onClick={() => setExpanded(p => !p)}
            className="p-1.5 rounded-lg transition-colors hover:text-[#635BFF]"
            style={{ color: 'var(--text-muted)' }}
            title={expanded ? 'Collapse' : 'Expand files'}
          >
            {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* ── File list ── */}
      {expanded && job.files.length > 0 && (
        <div className="px-5 pb-3 max-h-80 overflow-y-auto" style={{ borderTop: '1px solid var(--border-subtle)' }}>
          <p className="text-[10px] font-mono font-bold uppercase tracking-widest pt-3 pb-1" style={{ color: 'var(--text-muted)' }}>
            Files ({job.files.length})
          </p>
          {job.files.map(file => <FileRow key={file.msgId} file={file} />)}
        </div>
      )}
    </div>
  )
}

// ─── QueueView ────────────────────────────────────────────────────────────────

export default function QueueView() {
  const { jobs, activeCount, clearCompleted } = useDownloads()

  const active    = jobs.filter(j => j.status === 'downloading' || j.status === 'queued')
  const completed = jobs.filter(j => j.status === 'completed' || j.status === 'failed' || j.status === 'cancelled')

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
      <SeoMeta
        title="Live Download Queue & Speed Monitor — Telegram Batch Downloader"
        description="Monitor active Telegram batch download jobs, real-time download speeds, file transfer progress, and history."
        keywords="telegram download queue, telegram batch transfer monitor, live telegram download speed, telegram file manager"
        noIndex
      />

      {/* Page header */}
      <div className="flex items-center justify-between gap-4 pb-4 border-b border-slate-200/80 dark:border-white/10 flex-wrap">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-black text-current tracking-tight">Bulk Download Queue</h1>
            <span className="px-2.5 py-0.5 rounded-full bg-[#635BFF]/15 text-[#635BFF] dark:text-indigo-300 border border-[#635BFF]/30 text-[10px] font-mono font-bold">
              LIVE BATCH MONITOR
            </span>
          </div>
          <p className="text-xs font-mono mt-1" style={{ color: 'var(--text-muted)' }}>
            Real-time multi-file transfer speed &amp; progress
            {activeCount > 0
              ? ` · ${activeCount} active batch jobs`
              : ' · No active downloads'}
          </p>
        </div>
        {completed.length > 0 && (
          <button
            onClick={clearCompleted}
            className="btn-fintech-secondary text-xs px-4 py-2 flex items-center gap-1.5 font-mono font-bold hover:text-red-400"
          >
            <Trash2 className="w-3.5 h-3.5" /> Clear history
          </button>
        )}
      </div>

      {/* Empty state */}
      {jobs.length === 0 && (
        <div className="glass-panel p-12 text-center rounded-2xl">
          <div className="w-14 h-14 rounded-2xl bg-[#635BFF]/10 flex items-center justify-center mx-auto mb-4">
            <Download className="w-7 h-7 text-[#635BFF]" />
          </div>
          <h2 className="text-lg font-bold text-current mb-2">No downloads yet</h2>
          <p className="text-sm mb-6" style={{ color: 'var(--text-muted)' }}>
            Go to the Downloader, select files, and click "Download selected" to start a batch job.
          </p>
          <Link to="/downloader" className="btn-fintech-primary px-6 py-2.5 text-sm">
            Go to Downloader →
          </Link>
        </div>
      )}

      {/* Active downloads */}
      {active.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-xs font-bold uppercase tracking-widest font-mono flex items-center gap-2" style={{ color: 'var(--text-muted)' }}>
            <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse inline-block" />
            Active · {active.length}
          </h2>
          {active.map(job => <DownloadCard key={job.id} job={job} />)}
        </div>
      )}

      {/* History */}
      {completed.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-xs font-bold uppercase tracking-widest font-mono" style={{ color: 'var(--text-muted)' }}>
            History · {completed.length}
          </h2>
          {completed.map(job => <DownloadCard key={job.id} job={job} />)}
        </div>
      )}
    </div>
  )
}
