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
 */
import React, { createContext, useContext, useState, useCallback, useRef } from 'react'

const DownloadContext = createContext()

const BACKEND = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000'

export function DownloadProvider({ children }) {
  const [jobs, setJobs]        = useState([])   // array of job objects
  const esRefs                 = useRef({})      // jobId -> EventSource

  const addJob = useCallback((job) => {
    setJobs(prev => [job, ...prev])
  }, [])

  const updateJob = useCallback((id, patch) => {
    setJobs(prev => prev.map(j => j.id === id ? { ...j, ...patch } : j))
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

  const removeJob = useCallback((id) => {
    // Close SSE stream if open
    if (esRefs.current[id]) { esRefs.current[id].close(); delete esRefs.current[id] }
    setJobs(prev => prev.filter(j => j.id !== id))
  }, [])

  const clearCompleted = useCallback(() => {
    setJobs(prev => {
      const toRemove = prev.filter(j => j.status === 'completed' || j.status === 'failed' || j.status === 'cancelled')
      toRemove.forEach(j => {
        if (esRefs.current[j.id]) { esRefs.current[j.id].close(); delete esRefs.current[j.id] }
      })
      return prev.filter(j => j.status !== 'completed' && j.status !== 'failed' && j.status !== 'cancelled')
    })
  }, [])

  const cancelJob = useCallback(async (id) => {
    // Close SSE immediately so no more events come in
    if (esRefs.current[id]) { esRefs.current[id].close(); delete esRefs.current[id] }
    // Get the backendJobId to call /cancel-job
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
  }, [])

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

      const data = await res.json()
      if (data.error) {
        updateJob(localId, { status: 'failed', error: data.error })
        return null
      }

      const backendJobId = data.job_id
      updateJob(localId, { backendJobId, status: 'downloading' })

      // Open SSE stream for real-time progress
      const es = new EventSource(`${BACKEND}/api/telegram/progress/${backendJobId}`)
      esRefs.current[localId] = es

      es.onmessage = (event) => {
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
            // The backend now serves the file from disk using job_id + msg_id.
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
            updateJob(localId, prev => ({ completedFiles: (prev?.completedFiles ?? 0) + 1 }))
          } else if (ev.type === 'file_error') {
            updateJobFile(localId, ev.msg_id, { status: 'error', error: ev.error })
            updateJob(localId, prev => ({ completedFiles: (prev?.completedFiles ?? 0) + 1 }))
          } else if (ev.type === 'job_complete') {
            updateJob(localId, { status: 'completed', completedFiles: ev.total })
            es.close(); delete esRefs.current[localId]
          } else if (ev.type === 'cancelled') {
            updateJob(localId, { status: 'cancelled' })
            es.close(); delete esRefs.current[localId]
          } else if (ev.type === 'error') {
            updateJob(localId, { status: 'failed', error: ev.msg })
            es.close(); delete esRefs.current[localId]
          }
        } catch (err) {
          console.error('[SSE] Parse error:', err)
        }
      }

      es.onerror = () => {
        updateJob(localId, { status: 'failed', error: 'Lost connection to backend.' })
        es.close(); delete esRefs.current[localId]
      }

      return localId
    } catch (err) {
      updateJob(localId, { status: 'failed', error: err.message })
      return null
    }
  }, [addJob, updateJob, updateJobFile])

  const activeCount = jobs.filter(j => j.status === 'downloading' || j.status === 'queued').length

  const value = { jobs, activeCount, startJob, removeJob, cancelJob, clearCompleted, updateJob }

  return <DownloadContext.Provider value={value}>{children}</DownloadContext.Provider>
}

export function useDownloads() {
  return useContext(DownloadContext)
}
