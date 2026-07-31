import React, { useState, useEffect } from 'react'
import { Coffee, Heart, X, Sparkles, ExternalLink, ArrowRight, ShieldCheck } from 'lucide-react'

const COFFEE_URL = "https://buymeacoffee.com/x4kqsd0lka"

/**
 * Global helper to trigger the Buy Me A Coffee popup modal from anywhere in the app
 * (e.g. called in DownloaderView when a user fetches channel media or starts a download).
 */
export function triggerCoffeeModal() {
  window.dispatchEvent(new CustomEvent('show-coffee-popup'))
}

export default function BuyMeACoffeeWidget() {
  const [showModal, setShowModal] = useState(false)

  useEffect(() => {
    const handleTrigger = () => {
      setShowModal(true)
    }
    window.addEventListener('show-coffee-popup', handleTrigger)
    return () => window.removeEventListener('show-coffee-popup', handleTrigger)
  }, [])

  return (
    <>
      {/* ── FLOATING BUTTON (BOTTOM RIGHT CORNER) ── */}
      <div className="fixed bottom-6 right-6 z-40">
        <a
          href={COFFEE_URL}
          target="_blank"
          rel="noreferrer"
          className="group relative flex items-center gap-2.5 bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-400 hover:to-orange-400 text-white font-bold px-4 py-3 rounded-full shadow-[0_10px_25px_rgba(245,158,11,0.4)] hover:shadow-[0_15px_35px_rgba(245,158,11,0.6)] transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer border border-amber-300/30"
          title="Support this free tool — Buy Me a Coffee!"
        >
          <div className="relative">
            <Coffee className="w-5 h-5 text-white animate-bounce" />
            <Sparkles className="w-3.5 h-3.5 text-yellow-200 absolute -top-1.5 -right-1.5" />
          </div>
          <span className="text-xs sm:text-sm font-display tracking-tight font-extrabold">Buy me a coffee</span>

          {/* Heart pulse dot */}
          <span className="flex h-2.5 w-2.5 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-rose-500"></span>
          </span>
        </a>
      </div>

      {/* ── POPUP MODAL (ON EACH FETCH / DOWNLOAD) ── */}
      {showModal && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in"
          onClick={() => setShowModal(false)}
        >
          <div 
            className="relative max-w-md w-full glass-panel p-6 sm:p-8 rounded-[24px] shadow-[0_25px_60px_rgba(0,0,0,0.5)] border border-amber-500/40 text-center space-y-5 overflow-hidden bg-gradient-to-b from-[#181820] to-[#0d0d12]"
            onClick={e => e.stopPropagation()}
          >
            {/* Ambient Background Glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-48 bg-amber-500/20 rounded-full blur-3xl pointer-events-none"></div>

            {/* Top Close Button */}
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-full hover:bg-white/10 transition-colors"
              title="Close modal"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Coffee Icon Badge */}
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-500 text-white flex items-center justify-center mx-auto shadow-[0_0_30px_rgba(245,158,11,0.5)]">
              <Coffee className="w-8 h-8 animate-bounce" />
            </div>

            {/* Content Header */}
            <div className="space-y-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-[11px] font-mono font-bold">
                <Heart className="w-3.5 h-3.5 fill-amber-400" />
                <span>SUPPORT FREE TELEGRAM DOWNLOADER</span>
              </div>
              <h3 className="font-display text-2xl font-black text-white tracking-tight">
                Buy Me A Coffee ☕
              </h3>
              <p className="text-slate-300 text-sm leading-relaxed">
                Enjoying free unlimited bulk downloads? Help us keep high-speed MTProto servers online &amp; 100% free with zero ads!
              </p>
            </div>

            {/* Actions */}
            <div className="space-y-3 pt-2">
              <a
                href={COFFEE_URL}
                target="_blank"
                rel="noreferrer"
                onClick={() => setShowModal(false)}
                className="btn-fintech-primary w-full py-3.5 px-6 font-bold text-sm bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-400 hover:to-orange-400 text-white shadow-[0_0_25px_rgba(245,158,11,0.4)] flex items-center justify-center gap-2 rounded-xl transition-all hover:scale-[1.02]"
              >
                <Coffee className="w-4 h-4" />
                <span>Support on Buy Me A Coffee</span>
                <ExternalLink className="w-4 h-4" />
              </a>

              <button
                onClick={() => setShowModal(false)}
                className="w-full py-3 px-6 text-xs font-mono font-bold text-slate-400 hover:text-white transition-colors flex items-center justify-center gap-1.5"
              >
                <span>Continue to Download</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Trust badge */}
            <div className="pt-2 border-t border-white/10 flex items-center justify-center gap-2 text-[11px] font-mono text-slate-400">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>100% Free · No Subscription Required</span>
            </div>

          </div>
        </div>
      )}
    </>
  )
}
