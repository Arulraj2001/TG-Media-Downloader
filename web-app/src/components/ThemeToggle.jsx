import React, { useState, useEffect } from 'react'
import { Sun, Moon } from 'lucide-react'

export default function ThemeToggle() {
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem('tg_theme')
    if (saved) return saved === 'dark'
    return window.matchMedia('(prefers-color-scheme: dark)').matches || true
  })

  useEffect(() => {
    const root = document.documentElement
    if (isDark) {
      root.classList.add('dark')
      root.style.colorScheme = 'dark'
      localStorage.setItem('tg_theme', 'dark')
    } else {
      root.classList.remove('dark')
      root.style.colorScheme = 'light'
      localStorage.setItem('tg_theme', 'light')
    }
  }, [isDark])

  return (
    <button
      onClick={() => setIsDark(prev => !prev)}
      type="button"
      aria-label="Toggle theme"
      className="p-2.5 rounded-xl bg-slate-200/80 dark:bg-white/10 text-slate-700 dark:text-amber-400 hover:bg-slate-300 dark:hover:bg-white/20 transition border border-slate-300 dark:border-white/10 flex items-center justify-center cursor-pointer shadow-sm"
    >
      {isDark ? (
        <Sun className="w-4 h-4 text-amber-400" />
      ) : (
        <Moon className="w-4 h-4 text-purple-600" />
      )}
    </button>
  )
}
