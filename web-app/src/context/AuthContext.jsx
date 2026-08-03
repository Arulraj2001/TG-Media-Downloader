import React, { createContext, useContext, useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

const AuthContext = createContext()

// Backend URL — set VITE_BACKEND_URL in .env for production
const BACKEND = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000'

// The one authorised admin email (password is managed in Supabase dashboard)
const ADMIN_EMAIL = import.meta.env.VITE_ADMIN_EMAIL || ''

export function AuthProvider({ children }) {
  // ─── Admin Auth (Supabase session for admin only) ──────────────────────────
  const [isAdmin, setIsAdmin]     = useState(false)
  const [adminLoading, setAdminLoading] = useState(true)

  // On mount: check if there's a live Supabase session that belongs to the admin
  useEffect(() => {
    let mounted = true

    const checkAdminSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        if (mounted) {
          const emailMatches = session?.user?.email === ADMIN_EMAIL
          setIsAdmin(!!session && emailMatches)
          setAdminLoading(false)
        }
      } catch {
        if (mounted) setAdminLoading(false)
      }
    }

    checkAdminSession()

    // Keep in sync whenever Supabase auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (mounted) {
        const emailMatches = session?.user?.email === ADMIN_EMAIL
        setIsAdmin(!!session && emailMatches)
      }
    })

    return () => {
      mounted = false
      subscription?.unsubscribe()
    }
  }, [])

  /**
   * Sign in via Supabase — only succeeds as admin if the email matches VITE_ADMIN_EMAIL.
   * Password is managed entirely in the Supabase dashboard (no password stored in .env).
   */
  const adminSignIn = async (email, password) => {
    try {
      if (email.trim().toLowerCase() !== ADMIN_EMAIL.toLowerCase()) {
        return { error: 'This email is not authorized as admin.' }
      }
      const { data, error } = await supabase.auth.signInWithPassword({ email: email.trim(), password })
      if (error) return { error: error.message }
      setIsAdmin(true)
      return { success: true }
    } catch (err) {
      return { error: err.message }
    }
  }

  const adminSignOut = async () => {
    await supabase.auth.signOut()
    setIsAdmin(false)
  }

  // ─── Telegram MTProto Session ──────────────────────────────────────────────
  const [tgSession, setTgSession] = useState(() => {
    try {
      const saved = localStorage.getItem('tg_mtproto_session')
      return saved ? JSON.parse(saved) : {
        connected: false,
        apiId: '',
        apiHash: '',
        phone: '',
        step: 1,  // 1=creds, 2=OTP, 3=2FA, 4=connected
        user: '',
        chats: [],
        phoneCodeHash: '',
      }
    } catch {
      return { connected: false, apiId: '', apiHash: '', phone: '', step: 1, user: '', chats: [], phoneCodeHash: '' }
    }
  })

  // Persist tgSession to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('tg_mtproto_session', JSON.stringify(tgSession))
  }, [tgSession])

  // ─── Safe Fetch Helper ──────────────────────────────────────────────────────
  const safeFetchJson = async (url, options) => {
    const res = await fetch(url, options)
    const contentType = res.headers.get('content-type') || ''
    if (!res.ok) {
      if (contentType.includes('application/json')) {
        const errData = await res.json()
        throw new Error(errData.error || errData.message || `Server error (${res.status})`)
      } else {
        const text = await res.text()
        throw new Error(`Server returned status ${res.status}: ${text.slice(0, 100)}`)
      }
    }
    if (!contentType.includes('application/json')) {
      const text = await res.text()
      throw new Error(`Unexpected non-JSON response (${res.status}): ${text.slice(0, 100)}`)
    }
    return await res.json()
  }

  // ─── Telegram MTProto Actions ──────────────────────────────────────────────
  const startTelegramConnect = async (apiId, apiHash, phone) => {
    try {
      const data = await safeFetchJson(`${BACKEND}/api/telegram/send-code`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ api_id: apiId, api_hash: apiHash, phone })
      })
      if (data.error) return { error: data.error }

      if (data.connected) {
        setTgSession(prev => ({
          ...prev, apiId, apiHash, phone: data.phone || phone,
          connected: true, step: 4, user: data.user || '', chats: data.chats || [],
        }))
        _saveSessionMeta(data.phone || phone, apiId, apiHash)
        return { success: true, connected: true }
      }

      setTgSession(prev => ({
        ...prev, apiId, apiHash, phone: data.phone || phone,
        step: 2, phoneCodeHash: data.phone_code_hash || '',
      }))
      return { success: true, connected: false }
    } catch (err) {
      return { error: `Backend connection error: ${err.message}` }
    }
  }

  const verifyTelegramCode = async (code) => {
    try {
      const data = await safeFetchJson(`${BACKEND}/api/telegram/verify-code`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: tgSession.phone, code })
      })
      if (data.error) return { error: data.error }
      if (data.requires_2fa) {
        setTgSession(prev => ({ ...prev, step: 3 }))
        return { requires_2fa: true }
      }
      setTgSession(prev => ({
        ...prev, connected: true, step: 4,
        user: data.user || '', chats: data.chats || [],
      }))
      return { success: true }
    } catch (err) {
      return { error: `Backend error: ${err.message}` }
    }
  }

  const verifyTelegram2FA = async (password) => {
    try {
      const data = await safeFetchJson(`${BACKEND}/api/telegram/verify-2fa`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: tgSession.phone, password })
      })
      if (data.error) return { error: data.error }
      setTgSession(prev => ({
        ...prev, connected: true, step: 4,
        user: data.user || '', chats: data.chats || [],
      }))
      return { success: true }
    } catch (err) {
      return { error: `Backend error: ${err.message}` }
    }
  }

  const checkTelegramSession = async (phone) => {
    try {
      const data = await safeFetchJson(`${BACKEND}/api/telegram/check-session`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: phone || tgSession.phone })
      })
      if (data.authorized) {
        setTgSession(prev => ({
          ...prev, connected: true, step: 4,
          user: data.user || '', chats: data.chats || [],
          phone: data.phone || prev.phone,
        }))
        return { authorized: true }
      }
      return { authorized: false }
    } catch {
      return { authorized: false }
    }
  }

  const disconnectTelegram = async () => {
    try {
      await safeFetchJson(`${BACKEND}/api/telegram/disconnect`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: tgSession.phone })
      })
    } catch {}
    const reset = { connected: false, apiId: '', apiHash: '', phone: '', step: 1, user: '', chats: [], phoneCodeHash: '' }
    setTgSession(reset)
    localStorage.setItem('tg_mtproto_session', JSON.stringify(reset))
  }

  const _saveSessionMeta = async (phone, apiId, apiHash) => {
    try {
      await safeFetchJson(`${BACKEND}/api/telegram/save-meta`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, api_id: apiId, api_hash: apiHash })
      })
    } catch {}
  }

  const value = {
    // Admin auth (Supabase-backed)
    isAdmin,
    adminLoading,
    adminSignIn,
    adminSignOut,
    // Telegram MTProto
    tgSession, setTgSession,
    startTelegramConnect, verifyTelegramCode, verifyTelegram2FA,
    checkTelegramSession, disconnectTelegram,
    // Shared backend URL
    BACKEND,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  return useContext(AuthContext)
}
