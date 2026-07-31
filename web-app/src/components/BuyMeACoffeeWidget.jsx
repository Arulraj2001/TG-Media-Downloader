import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { Coffee, Heart, X, Sparkles, ExternalLink, Monitor, ArrowRight } from 'lucide-react'

export default function BuyMeACoffeeWidget() {
  const [openModal, setOpenModal] = useState(false)

  // Direct Buy Me A Coffee URL
  const coffeeUrl = "https://buymeacoffee.com/x4kqsd0lka"

  return (
    <>
      {/* Floating Coffee Button */}
      <div className="fixed bottom-6 right-6 z-40">
        <a
          href={coffeeUrl}
          target="_blank"
          rel="noreferrer"
          className="group relative flex items-center gap-2.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-white font-bold px-4 py-3 rounded-full shadow-lg shadow-amber-500/30 transition-all hover:scale-105 active:scale-95 cursor-pointer"
          title="Support this free tool — Buy Me a Coffee!"
        >
          <div className="relative">
            <Coffee className="w-5 h-5 text-white animate-bounce" />
            <Sparkles className="w-3 h-3 text-yellow-200 absolute -top-1 -right-1" />
          </div>
          <span className="text-xs sm:text-sm font-display tracking-tight">Buy me a coffee</span>

          {/* Heart ping badge */}
          <span className="flex h-2.5 w-2.5 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-rose-500"></span>
          </span>
        </a>
      </div>
    </>
  )
}
