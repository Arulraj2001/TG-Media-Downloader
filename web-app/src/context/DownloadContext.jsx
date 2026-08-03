/**
 * DownloadContext — global download job state + SSE progress listener.
 * Mirrors the desktop app's downloads_view.py + download_card.py flow.
 *
 * Job lifecycle:
 *   queued → downloading (file_start events stream in) → completed / failed
 *
 * Each job:
 *   { id, jobId (backend), channelInput, channelTitle, mediaType, totalFiles,
 *     completedFiles, status, startedAt, files: [ { msgId, filename, size,
 *     current, speed, status: 'pending'|'downloading'|'done'|'error' } ] }
 *
 * ── Resilience (why downloads previously "terminated in-between") ────────────
 * 1. SSE onerror no longer instantly fails a job. EventSource auto-reconnects,
 *    so we give it several attempts and only mark the job failed once the
 *    backend confirms the job is gone (via /job-status polling).
 * 2. A watchdog timer polls /api/telegram/job-status/<job_id> whenever the SSE
 *    stream goes silent, so a dead connection can never leave a running job
 *    stuck in "failed" — the true backend state always wins.
 * 3. When a job completes/cancels on the backend but the final SSE event was
 *    missed, polling recovers the correct terminal state instead of failing.
 */
import React, { createContext, useContext, useState, useCallback, useRef } from 'react'

const DownloadContext = createContext()

const BACKEND = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000'

// If no SSE event (including pings) arrives for this long, verify via polling.
const STALE_CONNECTION_MS = 30000
// How often the watchdog checks.
const WATCHDOG_INTERVAL_MS = 15000
// After this many failed SSE reconnects we ask the backend for the truth.
const RECONNECT_POLL_EVERY = 5
const RECONNECT_FAIL_LIMIT  = 20

export function DownloadProvider({ children }) {
  const [jobs, setJobs]        = useState([])   // array of job objects
  const esRefs                 = useRef({})      // jobId -> EventSource
  const watchdogRefs           = useRef({})      // jobId -> setInterval id

  const addJob = useCallback((job) => {
    setJobs(prev => [job, ...prev])
  }, [])

  const updateJob = useCallback((id, patch) => {
    setJobs(prev => prev.map(j => {
      if (j.id !== id) return j
      // Support function patches (e.g. increment completedFiles safely).
      return typeof patch === 'function' ? patch(j) : { ...j, ...patch }
    }))
  }, [])

  const updateJobFile = useCallback((id, msgId, filePatch) => {
    setJobs(prev => prev.map(j => {
      if (j.id !== id) return j
      return {
        ...j,
        files: j.files.map(f => f.msgId === msgId ? { ...f, ...filePatch } : f),
      }
    }))
  }, [])

  /** Close the SSE stream and cancel the watchdog for a job id. */
  const closeConnection = useCallback((id) => {
    if (esRefs.current[id]) { esRefs.current[id].close(); delete esRefs.current[id] }
    if (watchdogRefs.current[id]) { clearInterval(watchdogRefs.current[id]); delete watchdogRefs.current[id] }
  }, [])

  const removeJob = useCallback((id) => {
    closeConnection(id)
    setJobs(prev => prev.filter(j => j.id !== id))
  }, [closeConnection])

  const clearCompleted = useCallback(() => {
    setJobs(prev => {
      const toRemove = prev.filter(j => j.status === 'completed' || j.status === 'failed' || j.status === 'cancelled')
      toRemove.forEach(j => closeConnection(j.id))
      return prev.filter(j => j.status !== 'completed' && j.status !== 'failed' && j.status !== 'cancelled')
    })
  }, [closeConnection])

  const cancelJob = useCallback(async (id) => {
    // Close SSE immediately so no more events come in; the watchdog too.
    closeConnection(id)
    setJobs(prev => {
      const job = prev.find(j => j.id === id)
      if (job?.backendJobId) {
        fetch(`${BACKEND}/api/telegram/cancel-job`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ job_id: job.backendJobId }),
        }).catch(() => {})
      }
      return prev.map(j => j.id === id ? { ...j, status: 'cancelled' } : j)
    })
  }, [closeConnection])

  /**
   * Start a batch download job.
   * selectedMsgs: array of { id, filename, size } message objects
   * channelInput: string (channel username or ID)
   * channelTitle: string (display name)
   * mediaType: string label like 'All', 'Images', 'Videos', etc.
   */
  const startJob = useCallback(async ({ selectedMsgs, channelInput, channelTitle, mediaType = 'All' }) => {
    if (!selectedMsgs?.length || !channelInput) return null

    const localId = `job_local_${Date.now()}`

    // Build filenames map { "msg_id": "filename" }
    const filenames = {}
    selectedMsgs.forEach(m => { filenames[String(m.id)] = m.filename || `file_${m.id}` })

    // Create local job record immediately
    const localJob = {
      id: localId,
      backendJobId: null,
      channelInput,
      channelTitle: channelTitle || channelInput,
      mediaType,
      totalFiles: selectedMsgs.length,
      completedFiles: 0,
      status: 'queued', // queued | downloading | completed | failed
      startedAt: new Date().toISOString(),
      files: selectedMsgs.map(m => ({
        msgId: m.id,
        filename: m.filename || `file_${m.id}`,
        size: m.size || 0,
        current: 0,
        speed: '',
        status: 'pending', // pending | downloading | done | error | skip
      })),
    }
    addJob(localJob)

    // POST to start-download-job — pass concurrency from user settings
    let concurrency = 4
    try { const s = JSON.parse(localStorage.getItem('tg_downloader_settings') || '{}'); concurrency = Math.min(s.download_limit || 4, 8) } catch {}

    try {
      const res = await fetch(`${BACKEND}/api/telegram/start-download-job`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          channel_input: channelInput,
          message_ids: selectedMsgs.map(m => m.id),
          filenames,
          concurrency,
        }),
      })

      const contentType = res.headers.get('content-type') || ''
      if (!res.ok || !contentType.includes('application/json')) {
        const text = await res.text().catch(() => '')
        updateJob(localId, { status: 'failed', error: `Server error (${res.status}): ${text.slice(0, 100) || 'Invalid server response'}` })
        return null
      }
      const data = await res.json()
      if (data.error) {
        updateJob(localId, { status: 'failed', error: data.error })
        return null
      }

      const backendJobId = data.job_id
      updateJob(localId, { backendJobId, status: 'downloading' })

      // ── Resilience state (per job) ────────────────────────────────────────
      let lastEventAt   = Date.now()   // last time any SSE message arrived
      let reconnectCount = 0            // consecutive SSE onerror count

      const jobFinished = () => closeConnection(localId)

      /**
       * Ask the backend for the authoritative job state. Used by the watchdog
       * and by the SSE onerror recovery path so a transient connection drop
       * can never turn a healthy download into a "failed" job.
       */
      const pollJobStatus = async () => {
        try {
          const r = await fetch(`${BACKEND}/api/telegram/job-status/${backendJobId}`)
          if (!r.ok) return false
          const st = await r.json()

          if (st.status === 'completed') {
            updateJob(localId, prev => {
              const next = { ...prev, status: 'completed', completedFiles: st.completed ?? st.total ?? prev.totalFiles }
              const readable = new Set(Object.keys(st.files || {}))
              next.files = prev.files.map(f => readable.has(String(f.msgId)) ? { ...f, status: 'done', current: f.size } : f)
              return next
            })
            jobFinished()
            return true
          }

          if (st.status === 'cancelled') {
            updateJob(localId, { status: 'cancelled' })
            jobFinished()
            return true
          }

          if (st.status === 'running') {
            updateJob(localId, prev => {
              const doneFiles = new Set(Object.keys(st.files || {}))
              const completed = st.completed ?? prev.completedFiles
              if (prev.files.some(f => doneFiles.has(String(f.msgId)) && f.status !== 'done')) {
                return {
                  ...prev,
                  status: 'downloading',
                  completedFiles: completed,
                  files: prev.files.map(f => doneFiles.has(String(f.msgId)) ? { ...f, status: 'done', current: f.size } : f),
                }
              }
              return { ...prev, status: 'downloading', completedFiles: completed }
            })
            return false
          }

          // status === 'not_found' — backend has no record anymore.
          return false
        } catch {
          return false
        }
      }

      /**
       * Mark the job failed ONLY if the backend truly can't be reached and the
       * job hasn't already reached a terminal state (completed/cancelled).
       */
      const markFailed = (msg) => {
        setJobs(prev => {
          const job = prev.find(j => j.id === localId)
          if (!job || job.status === 'completed' || job.status === 'cancelled') return prev
          return prev.map(j => j.id === localId ? { ...j, status: 'failed', error: msg } : j)
        })
        jobFinished()
      }

      // ── Watchdog: verify real job state when the SSE stream goes silent ───
      const watchdog = setInterval(async () => {
        if (!esRefs.current[localId]) { clearInterval(watchdog); return }
        const silentFor = Date.now() - lastEventAt
        if (silentFor >= STALE_CONNECTION_MS) {
          await pollJobStatus()
          // EventSource keeps auto-reconnecting; never fail here — the backend
          // state is the source of truth and the onerror handler decides.
        }
      }, WATCHDOG_INTERVAL_MS)
      watchdogRefs.current[localId] = watchdog

      // ── Open SSE stream for real-time progress ────────────────────────────
      const es = new EventSource(`${BACKEND}/api/telegram/progress/${backendJobId}`)
      esRefs.current[localId] = es

      es.onmessage = (event) => {
        lastEventAt   = Date.now()
        reconnectCount = 0
        try {
          const ev = JSON.parse(event.data)

          if (ev.type === 'file_start') {
            updateJobFile(localId, ev.msg_id, { status: 'downloading', size: ev.size || 0 })
            updateJob(localId, { status: 'downloading' })
          } else if (ev.type === 'file_progress') {
            updateJobFile(localId, ev.msg_id, {
              current: ev.current || 0,
              size: ev.total || 0,
              speed: ev.speed || '',
              status: 'downloading',
            })
          } else if (ev.type === 'file_complete') {
            updateJobFile(localId, ev.msg_id, { status: 'done', current: ev.size })
            updateJob(localId, { completedFiles: ev.completed })
            // Trigger browser download using a hidden anchor — more reliable than
            // window.open() which gets blocked as a popup by modern browsers.
            const fname = filenames[String(ev.msg_id)] || `file_${ev.msg_id}`
            const jobIdFromEvent = ev.job_id || backendJobId
            const url = `${BACKEND}/api/telegram/download-file?` + new URLSearchParams({
              job_id:  jobIdFromEvent,
              msg_id:  ev.msg_id,
              filename: fname,
            })
            const a = document.createElement('a')
            a.href = url
            a.download = fname
            a.style.display = 'none'
            document.body.appendChild(a)
            a.click()
            setTimeout(() => document.body.removeChild(a), 1000)
          } else if (ev.type === 'file_skip') {
            updateJobFile(localId, ev.msg_id, { status: 'skip' })
            updateJob(localId, prev => ({ ...prev, completedFiles: (prev?.completedFiles ?? 0) + 1 }))
          } else if (ev.type === 'file_error') {
            updateJobFile(localId, ev.msg_id, { status: 'error', error: ev.error })
            updateJob(localId, prev => ({ ...prev, completedFiles: (prev?.completedFiles ?? 0) + 1 }))
          } else if (ev.type === 'job_complete') {
            updateJob(localId, { status: 'completed', completedFiles: ev.total })
            jobFinished()
          } else if (ev.type === 'cancelled') {
            updateJob(localId, { status: 'cancelled' })
            jobFinished()
          } else if (ev.type === 'error') {
            markFailed(ev.msg || 'Download failed on the server.')
          }
        } catch (err) {
          console.error('[SSE] Parse error:', err)
        }
      }

      es.onerror = () => {
        reconnectCount += 1
        // EventSource reconnects automatically. Periodically ask the backend
        // for the truth so a hiccup can never clobber a healthy job, and a
        // missed terminal event (job_complete / cancelled race) is recovered.
        if (reconnectCount % RECONNECT_POLL_EVERY === 0) {
          pollJobStatus().then(recovered => {
            if (!recovered && reconnectCount >= RECONNECT_FAIL_LIMIT) {
              markFailed('Lost connection to backend.')
            }
          })
        }
      }

      return localId
    } catch (err) {
      updateJob(localId, { status: 'failed', error: err.message })
      return null
    }
  }, [addJob, updateJob, updateJobFile, closeConnection])

  const activeCount = jobs.filter(j => j.status === 'downloading' || j.status === 'queued').length

  const value = { jobs, activeCount, startJob, removeJob, cancelJob, clearCompleted, updateJob }

  return <DownloadContext.Provider value={value}>{children}</DownloadContext.Provider>
}

export function useDownloads() {
  return useContext(DownloadContext)
}