import React, { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { X, Mail, Lock, ShieldCheck, Sparkles } from 'lucide-react'

export default function ActionGateModal() {
  const { showAuthModal, setShowAuthModal, signInWithGoogle, signInWithEmail } = useAuth()
  const [isSignUp, setIsSignUp] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errorMsg, setErrorMsg] = useState('')
  const [loading, setLoading] = useState(false)

  if (!showAuthModal) return null

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!email || !password) {
      setErrorMsg('Please enter email and password')
      return
    }
    setErrorMsg('')
    setLoading(true)
    const res = await signInWithEmail(email, password)
    setLoading(false)
    if (!res.success) {
      setErrorMsg(res.error || 'Authentication failed')
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-md bg-[#18181D] border border-white/10 rounded-2xl p-6 md:p-8 shadow-glow text-slate-100">
        
        {/* Close Button */}
        <button
          onClick={() => setShowAuthModal(false)}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/5 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/30 text-brand-400 text-xs font-semibold mb-4">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Sign in Required</span>
        </div>

        <h2 className="text-2xl font-bold text-white mb-2">
          {isSignUp ? 'Create your Account' : 'Welcome to TG Downloader'}
        </h2>
        <p className="text-slate-400 text-sm mb-6">
          Sign in to fetch channels, search forum topics, and stream downloads directly to your device.
        </p>

        {errorMsg && (
          <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-medium">
            {errorMsg}
          </div>
        )}

        {/* 1-Click Google OAuth */}
        <button
          onClick={signInWithGoogle}
          className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-xl bg-white text-slate-900 font-semibold hover:bg-slate-100 transition shadow-md text-sm mb-4"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
          </svg>
          <span>Continue with Google</span>
        </button>

        <div className="flex items-center gap-3 my-4">
          <div className="h-px bg-white/10 flex-1"></div>
          <span className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Or with Email</span>
          <div className="h-px bg-white/10 flex-1"></div>
        </div>

        {/* Email Form */}
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
              <input
                type="email"
                placeholder="email@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl glass-input text-sm text-white focus:outline-none"
                required
              />
            </div>
          </div>

          <div>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl glass-input text-sm text-white focus:outline-none"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-brand-600 to-brand-500 text-white font-semibold hover:from-brand-500 hover:to-brand-400 transition shadow-glow text-sm"
          >
            {loading ? 'Processing...' : isSignUp ? 'Sign Up with Email' : 'Sign In with Email'}
          </button>
        </form>

        {/* Switch Sign in / Sign up */}
        <div className="mt-5 text-center text-xs text-slate-400">
          {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
          <button
            onClick={() => { setIsSignUp(!isSignUp); setErrorMsg(''); }}
            className="text-brand-400 font-semibold hover:underline"
          >
            {isSignUp ? 'Sign In' : 'Sign Up'}
          </button>
        </div>

        {/* Privacy Note */}
        <div className="mt-4 flex items-center justify-center gap-1.5 text-[11px] text-slate-500">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>Zero media stored. Direct local browser downloads.</span>
        </div>

      </div>
    </div>
  )
}
