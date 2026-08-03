import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useDownloads } from '../context/DownloadContext'
import { Download, Menu, X, Sparkles, ListVideo, Search, ChevronDown } from 'lucide-react'
import ThemeToggle from './ThemeToggle'

export default function Navbar() {
  const { isAdmin, adminSignOut } = useAuth()
  const { activeCount } = useDownloads()
  const [menuOpen, setMenuOpen] = useState(false)
  const [resourcesOpen, setResourcesOpen] = useState(false)
  const location = useLocation()

  const isActive = (path) => location.pathname === path

  const navLinkCls = (path) =>
    `px-4 py-2 rounded-[8px] text-sm font-bold transition ${
      isActive(path)
        ? 'text-[#635BFF] bg-[#635BFF]/10 border border-[#635BFF]/20 shadow-sm'
        : 'text-slate-700 dark:text-slate-300 hover:text-[#635BFF] hover:bg-slate-200/50 dark:hover:bg-white/5'
    }`

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-xl bg-white/70 dark:bg-[#0B0B0E]/70 border-b border-slate-200/80 dark:border-white/10 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">

          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-3.5 group flex-shrink-0">
            <img 
              src="/logo.png" 
              alt="TG Downloader Logo" 
              className="w-10 h-10 rounded-[10px] object-contain shadow-[0_0_20px_rgba(99,91,255,0.4)] transition group-hover:scale-105" 
            />
            <div className="flex flex-col">
              <span className="font-display font-extrabold text-xl text-current tracking-tight leading-tight group-hover:text-[#635BFF] transition">TG Downloader</span>
              <span className="text-[10px] text-[#635BFF] font-mono font-bold tracking-widest uppercase">FREE UNLIMITED v1.1</span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center gap-1">
            <Link to="/"            className={navLinkCls('/')}>Home</Link>
            <Link to="/downloader"  className={navLinkCls('/downloader')}>Downloader</Link>
            <Link to="/features"    className={navLinkCls('/features')}>Features</Link>

            {/* Resources Dropdown */}
            <div className="relative" onMouseEnter={() => setResourcesOpen(true)} onMouseLeave={() => setResourcesOpen(false)}>
              <button 
                onClick={() => setResourcesOpen(prev => !prev)}
                className={`px-4 py-2 rounded-[8px] text-sm font-bold transition flex items-center gap-1 ${
                  ['/blog', '/docs', '/faq', '/search'].includes(location.pathname)
                    ? 'text-[#635BFF] bg-[#635BFF]/10 border border-[#635BFF]/20 shadow-sm'
                    : 'text-slate-700 dark:text-slate-300 hover:text-[#635BFF] hover:bg-slate-200/50 dark:hover:bg-white/5'
                }`}
              >
                Resources
                <ChevronDown className="w-3.5 h-3.5" />
              </button>
              {resourcesOpen && (
                <div className="absolute top-full left-0 pt-2 w-56 z-50">
                  <div className="glass-panel rounded-[12px] border border-slate-200/80 dark:border-white/10 shadow-xl p-2 space-y-1">
                    <Link to="/blog" onClick={() => setResourcesOpen(false)} className="block px-4 py-2.5 rounded-[8px] text-sm font-bold text-slate-700 dark:text-slate-300 hover:text-[#635BFF] hover:bg-slate-200/50 dark:hover:bg-white/5">Blog & Guides</Link>
                    <Link to="/docs" onClick={() => setResourcesOpen(false)} className="block px-4 py-2.5 rounded-[8px] text-sm font-bold text-slate-700 dark:text-slate-300 hover:text-[#635BFF] hover:bg-slate-200/50 dark:hover:bg-white/5">Documentation</Link>
                    <Link to="/faq" onClick={() => setResourcesOpen(false)} className="block px-4 py-2.5 rounded-[8px] text-sm font-bold text-slate-700 dark:text-slate-300 hover:text-[#635BFF] hover:bg-slate-200/50 dark:hover:bg-white/5">FAQ</Link>
                    <Link to="/search" onClick={() => setResourcesOpen(false)} className="block px-4 py-2.5 rounded-[8px] text-sm font-bold text-slate-700 dark:text-slate-300 hover:text-[#635BFF] hover:bg-slate-200/50 dark:hover:bg-white/5">Search</Link>
                  </div>
                </div>
              )}
            </div>

            <Link to="/about"     className={navLinkCls('/about')}>About</Link>
            <Link to="/contact"   className={navLinkCls('/contact')}>Contact</Link>

            {/* Queue link — shows active count badge */}
            <Link to="/queue" className={`relative px-4 py-2 rounded-[8px] text-sm font-bold transition ${
              isActive('/queue')
                ? 'text-[#635BFF] bg-[#635BFF]/10 border border-[#635BFF]/20 shadow-sm'
                : 'text-slate-700 dark:text-slate-300 hover:text-[#635BFF] hover:bg-slate-200/50 dark:hover:bg-white/5'
            }`}>
              Queue
              {activeCount > 0 && (
                <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] flex items-center justify-center rounded-full bg-[#635BFF] text-white text-[9px] font-bold px-1">
                  {activeCount}
                </span>
              )}
            </Link>
          </nav>

          {/* Right Actions */}
          <div className="hidden lg:flex items-center gap-3">
            <ThemeToggle />

            {/* Free Unlimited Badge */}
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-[8px] bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs font-mono font-bold shadow-sm">
              <Sparkles className="w-3.5 h-3.5" />
              <span>100% FREE</span>
            </div>

            {/* Admin sign-out button — only shown when admin is logged in */}
            {isAdmin && (
              <button
                onClick={adminSignOut}
                className="px-3 py-1.5 rounded-[8px] text-xs font-mono font-bold text-amber-500 border border-amber-500/30 bg-amber-500/10 hover:bg-amber-500/20 transition"
              >
                Admin · Sign Out
              </button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex lg:hidden items-center gap-2">
            <ThemeToggle />
            {activeCount > 0 && (
              <Link to="/queue" className="relative">
                <ListVideo className="w-5 h-5" style={{ color: 'var(--text-main)' }} />
                <span className="absolute -top-1 -right-1 min-w-[14px] h-[14px] flex items-center justify-center rounded-full bg-[#635BFF] text-white text-[8px] font-bold">
                  {activeCount}
                </span>
              </Link>
            )}
            <button onClick={() => setMenuOpen(!menuOpen)}
              className="p-2 rounded-[8px] glass-card text-current">
              {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer */}
      {menuOpen && (
        <div className="lg:hidden glass-panel border-t border-slate-200 dark:border-white/10 px-4 pt-2 pb-6 space-y-1 font-bold text-sm">
          <Link to="/"           onClick={() => setMenuOpen(false)} className="block py-2.5 text-current hover:text-[#635BFF]">Home</Link>
          <Link to="/downloader" onClick={() => setMenuOpen(false)} className="block py-2.5 text-current hover:text-[#635BFF]">Downloader</Link>
          <Link to="/features"   onClick={() => setMenuOpen(false)} className="block py-2.5 text-current hover:text-[#635BFF]">Features</Link>
          <Link to="/blog"       onClick={() => setMenuOpen(false)} className="block py-2.5 text-current hover:text-[#635BFF]">Blog & Guides</Link>
          <Link to="/docs"       onClick={() => setMenuOpen(false)} className="block py-2.5 text-current hover:text-[#635BFF]">Documentation</Link>
          <Link to="/faq"        onClick={() => setMenuOpen(false)} className="block py-2.5 text-current hover:text-[#635BFF]">FAQ</Link>
          <Link to="/about"      onClick={() => setMenuOpen(false)} className="block py-2.5 text-current hover:text-[#635BFF]">About</Link>
          <Link to="/contact"    onClick={() => setMenuOpen(false)} className="block py-2.5 text-current hover:text-[#635BFF]">Contact</Link>
          <Link to="/search"     onClick={() => setMenuOpen(false)} className="block py-2.5 text-current hover:text-[#635BFF] flex items-center gap-2">
            <Search className="w-4 h-4" /> Search
          </Link>
          <Link to="/queue"      onClick={() => setMenuOpen(false)} className="block py-2.5 text-current hover:text-[#635BFF] flex items-center gap-2">
            Queue {activeCount > 0 && <span className="px-1.5 py-0.5 rounded bg-[#635BFF] text-white text-[10px]">{activeCount}</span>}
          </Link>
          {isAdmin && (
            <button onClick={() => { adminSignOut(); setMenuOpen(false) }} className="block py-2.5 text-amber-500 text-left w-full">
              Sign Out (Admin)
            </button>
          )}
        </div>
      )}
    </header>
  )
}