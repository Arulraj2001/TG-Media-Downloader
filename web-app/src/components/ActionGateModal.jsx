import React, { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { X, Mail, Lock, ShieldCheck, Terminal } from 'lucide-react'

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-md glass-panel border-white/20 rounded-[12px] p-6 md:p-8 shadow-lift text-current">
        
        {/* Close Button */}
        <button
          onClick={() => setShowAuthModal(false)}
          className="absolute top-4 right-4 text-slate-400 hover:text-current p-1 rounded-[4px] hover:bg-white/10 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-[6px] bg-[#635BFF]/10 border border-[#635BFF]/30 text-[#635BFF] text-xs font-mono font-medium mb-4">
          <Terminal className="w-3.5 h-3.5" />
          <span>AUTHENTICATION REQUIRED</span>
        </div>

        <h2 className="text-xl font-bold text-current mb-2">
          {isSignUp ? 'Create your Account' : 'Sign in to TG Downloader'}
        </h2>
        <p className="text-slate-400 text-xs mb-6">
          Sign in to fetch channels, search forum topics, and stream downloads directly to your device.
        </p>

        {errorMsg && (
          <div className="mb-4 p-3 rounded-[6px] bg-[#FF4B4B]/10 border border-[#FF4B4B]/30 text-[#FF4B4B] text-xs font-semibold font-mono">
            {errorMsg}
          </div>
        )}

        {/* 1-Click Google OAuth */}
        <button
          onClick={signInWithGoogle}
          className="w-full flex items-center justify-center gap-3 py-2.5 px-4 rounded-[6px] bg-white text-slate-900 font-semibold hover:bg-slate-100 transition border border-slate-200 text-xs mb-4 shadow-sm"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
          </svg>
          <span>Continue with Google</span>
        </button>

        <div className="flex items-center gap-3 my-4">
          <div className="h-px bg-[#E6E6E6]/10 flex-1"></div>
          <span className="text-[10px] text-slate-400 uppercase tracking-wider font-mono">Or with Email</span>
          <div className="h-px bg-[#E6E6E6]/10 flex-1"></div>
        </div>

        {/* Email Form */}
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="email"
                placeholder="email@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 rounded-[6px] glass-input text-xs text-current focus:outline-none"
                required
              />
            </div>
          </div>

          <div>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 rounded-[6px] glass-input text-xs text-current focus:outline-none"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full btn-fintech-primary text-xs"
          >
            {loading ? 'PROCESSING...' : isSignUp ? 'Sign Up with Email' : 'Sign In with Email'}
          </button>
        </form>

        {/* Switch Sign in / Sign up */}
        <div className="mt-5 text-center text-xs text-slate-400">
          {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
          <button
            onClick={() => { setIsSignUp(!isSignUp); setErrorMsg(''); }}
            className="text-[#635BFF] font-semibold hover:underline"
          >
            {isSignUp ? 'Sign In' : 'Sign Up'}
          </button>
        </div>

        {/* Privacy Note */}
        <div className="mt-4 flex items-center justify-center gap-1.5 text-[11px] font-mono text-slate-400">
          <ShieldCheck className="w-3.5 h-3.5 text-[#00C48C]" />
          <span>ZERO MEDIA STORED • DIRECT BROWSER DOWNLOADS</span>
        </div>

      </div>
    </div>
  )
}
