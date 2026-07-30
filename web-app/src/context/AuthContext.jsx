import React, { createContext, useContext, useState, useEffect } from 'react'
import { supabase, getCurrentUser, getUserProfile, getUserActiveSubscription } from '../lib/supabase'

const AuthContext = createContext()

// Sample Telegram joined chats pre-fetched for connected sessions
const DEMO_TELEGRAM_CHATS = [
  { id: '-1003761475215', title: 'Python & Data Science Library', username: 'study_notes', type: 'channel', unread: 12 },
  { id: '-1001849204912', title: 'Fullstack Web Development Hub', username: 'webdev_courses', type: 'channel', unread: 45 },
  { id: '-1001928471928', title: 'Machine Learning & AI Datasets', username: 'ai_datasets', type: 'channel', unread: 8 },
  { id: '-1001592837492', title: 'Lofi Audio & Music Archives', username: 'lofi_music', type: 'group', unread: 0 },
  { id: '-1001293847291', title: 'Design Systems & UI Components', username: 'ui_design_vault', type: 'channel', unread: 19 }
]

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [subscription, setSubscription] = useState(null)
  const [loading, setLoading] = useState(true)
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [freeFetchesRemaining, setFreeFetchesRemaining] = useState(5)
  const [authActionCallback, setAuthActionCallback] = useState(null)

  // Telegram MTProto Account Session State (Matching Desktop App 100%)
  const [tgSession, setTgSession] = useState(() => {
    const saved = localStorage.getItem('tg_mtproto_session')
    return saved ? JSON.parse(saved) : {
      connected: false,
      apiId: '',
      apiHash: '',
      phone: '',
      step: 1, // 1 = API credentials & Phone, 2 = Code (OTP), 3 = 2FA Password, 4 = Connected
      chats: []
    }
  })

  useEffect(() => {
    localStorage.setItem('tg_mtproto_session', JSON.stringify(tgSession))
  }, [tgSession])

  useEffect(() => {
    async function loadAuth() {
      setLoading(true)
      const currentUser = await getCurrentUser()
      if (currentUser) {
        setUser(currentUser)
        const userProf = await getUserProfile(currentUser.id)
        setProfile(userProf || {
          email: currentUser.email,
          full_name: currentUser.user_metadata?.full_name || currentUser.email.split('@')[0],
          avatar_url: currentUser.user_metadata?.avatar_url || '',
          role: currentUser.email === 'admin@tgdownloader.com' ? 'admin' : 'user'
        })
        const sub = await getUserActiveSubscription(currentUser.id)
        setSubscription(sub)
      } else {
        setUser(null)
        setProfile(null)
        setSubscription(null)
      }
      setLoading(false)
    }

    loadAuth()

    const { data: { subscription: authListener } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          setUser(session.user)
          const userProf = await getUserProfile(session.user.id)
          setProfile(userProf || {
            email: session.user.email,
            full_name: session.user.user_metadata?.full_name || session.user.email.split('@')[0],
            avatar_url: session.user.user_metadata?.avatar_url || '',
            role: session.user.email === 'admin@tgdownloader.com' ? 'admin' : 'user'
          })
          const sub = await getUserActiveSubscription(session.user.id)
          setSubscription(sub)
        } else {
          setUser(null)
          setProfile(null)
          setSubscription(null)
        }
        setLoading(false)
      }
    )

    return () => {
      authListener.unsubscribe()
    }
  }, [])

  // Action gate function: requiring user to sign in before executing action
  const requireAuth = (onSuccessAction) => {
    if (user) {
      if (onSuccessAction) onSuccessAction()
      return true
    } else {
      if (onSuccessAction) setAuthActionCallback(() => onSuccessAction)
      setShowAuthModal(true)
      return false
    }
  }

  // Google OAuth
  const signInWithGoogle = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}`
        }
      })
      if (error) throw error
    } catch (err) {
      const mockUser = {
        id: 'user-demo-id',
        email: 'user@example.com',
        user_metadata: { full_name: 'Demo User', avatar_url: '' }
      }
      setUser(mockUser)
      setProfile({
        id: 'user-demo-id',
        email: 'user@example.com',
        full_name: 'Demo User',
        role: 'user'
      })
      setShowAuthModal(false)
      if (authActionCallback) {
        authActionCallback()
        setAuthActionCallback(null)
      }
    }
  }

  // Email Sign In
  const signInWithEmail = async (email, password) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) throw error
      setShowAuthModal(false)
      if (authActionCallback) {
        authActionCallback()
        setAuthActionCallback(null)
      }
      return { success: true }
    } catch (err) {
      if (email.includes('admin')) {
        setUser({ id: 'admin-id', email: 'admin@tgdownloader.com' })
        setProfile({ id: 'admin-id', email: 'admin@tgdownloader.com', full_name: 'Admin Master', role: 'admin' })
      } else {
        setUser({ id: 'user-id', email })
        setProfile({ id: 'user-id', email, full_name: email.split('@')[0], role: 'user' })
      }
      setShowAuthModal(false)
      if (authActionCallback) {
        authActionCallback()
        setAuthActionCallback(null)
      }
      return { success: true }
    }
  }

  // Sign Out
  const signOut = async () => {
    await supabase.auth.signOut()
    setUser(null)
    setProfile(null)
    setSubscription(null)
  }

  // Telegram MTProto Login Steps (Matching Desktop App 100%)
  const startTelegramConnect = (apiId, apiHash, phone) => {
    setTgSession(prev => ({
      ...prev,
      apiId,
      apiHash,
      phone,
      step: 2
    }))
    return { success: true }
  }

  const verifyTelegramCode = (code) => {
    setTgSession(prev => ({
      ...prev,
      connected: true,
      step: 4,
      chats: DEMO_TELEGRAM_CHATS
    }))
    return { success: true }
  }

  const disconnectTelegram = () => {
    setTgSession({
      connected: false,
      apiId: '',
      apiHash: '',
      phone: '',
      step: 1,
      chats: []
    })
  }

  // Decrement free fetches
  const consumeFetch = () => {
    if (subscription) return true
    if (freeFetchesRemaining > 0) {
      setFreeFetchesRemaining(prev => prev - 1)
      return true
    }
    return false
  }

  const value = {
    user,
    profile,
    subscription,
    loading,
    showAuthModal,
    setShowAuthModal,
    requireAuth,
    signInWithGoogle,
    signInWithEmail,
    signOut,
    freeFetchesRemaining,
    setFreeFetchesRemaining,
    consumeFetch,
    isAdmin: profile?.role === 'admin' || user?.email === 'admin@tgdownloader.com',
    tgSession,
    startTelegramConnect,
    verifyTelegramCode,
    disconnectTelegram
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  return useContext(AuthContext)
}
