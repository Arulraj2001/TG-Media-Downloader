import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Download, User, LogOut, Menu, X, Crown, Activity } from 'lucide-react'
import ThemeToggle from './ThemeToggle'

export default function Navbar() {
  const { user, profile, subscription, freeFetchesRemaining, requireAuth, signOut } = useAuth()
  const [menuOpen, setMenuOpen] = useState(false)
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false)
  const location = useLocation()

  const isActive = (path) => location.pathname === path

  return (
    <header className="sticky top-0 z-40 w-full glass-panel border-b border-[#CBD5E1] dark:border-[#E6E6E6]/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-3.5 group">
            <div className="w-10 h-10 rounded-[6px] bg-[#635BFF] flex items-center justify-center text-white font-bold transition group-hover:scale-105">
              <Download className="w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-lg text-current tracking-tight leading-tight">TG Downloader</span>
              <span className="text-xs text-[#635BFF] font-mono font-bold tracking-wider uppercase">WEB API v2.7</span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-1.5">
            <Link
              to="/"
              className={`px-4 py-2 rounded-[6px] text-sm sm:text-base font-semibold transition ${
                isActive('/') ? 'text-[#635BFF] bg-[#635BFF]/10 font-bold' : 'text-slate-700 dark:text-slate-300 hover:text-current hover:bg-slate-200/60 dark:hover:bg-white/5'
              }`}
            >
              Home
            </Link>
            <Link
              to="/downloader"
              className={`px-4 py-2 rounded-[6px] text-sm sm:text-base font-semibold transition ${
                isActive('/downloader') ? 'text-[#635BFF] bg-[#635BFF]/10 font-bold' : 'text-slate-700 dark:text-slate-300 hover:text-current hover:bg-slate-200/60 dark:hover:bg-white/5'
              }`}
            >
              Downloader Tool
            </Link>
            <Link
              to="/pricing"
              className={`px-4 py-2 rounded-[6px] text-sm sm:text-base font-semibold transition ${
                isActive('/pricing') ? 'text-[#635BFF] bg-[#635BFF]/10 font-bold' : 'text-slate-700 dark:text-slate-300 hover:text-current hover:bg-slate-200/60 dark:hover:bg-white/5'
              }`}
            >
              Pricing
            </Link>
            <Link
              to="/blog"
              className={`px-4 py-2 rounded-[6px] text-sm sm:text-base font-semibold transition ${
                isActive('/blog') ? 'text-[#635BFF] bg-[#635BFF]/10 font-bold' : 'text-slate-700 dark:text-slate-300 hover:text-current hover:bg-slate-200/60 dark:hover:bg-white/5'
              }`}
            >
              Blog & Guides
            </Link>
            <Link
              to="/contact"
              className={`px-4 py-2 rounded-[6px] text-sm sm:text-base font-semibold transition ${
                isActive('/contact') ? 'text-[#635BFF] bg-[#635BFF]/10 font-bold' : 'text-slate-700 dark:text-slate-300 hover:text-current hover:bg-slate-200/60 dark:hover:bg-white/5'
              }`}
            >
              Contact
            </Link>
          </nav>

          {/* Right Actions */}
          <div className="hidden md:flex items-center gap-3.5">
            <ThemeToggle />

            {/* Subscription / Free Balance Badge */}
            {subscription ? (
              <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-[6px] bg-[#00C48C]/10 border border-[#00C48C]/30 text-[#00C48C] text-sm font-mono font-bold">
                <Crown className="w-4 h-4" />
                <span>PRO ACTIVE</span>
              </div>
            ) : (
              <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-[6px] bg-[#635BFF]/10 border border-[#635BFF]/30 text-[#635BFF] text-sm font-mono font-bold">
                <Activity className="w-4 h-4" />
                <span>{freeFetchesRemaining} FREE FETCHES</span>
              </div>
            )}

            {/* User Profile / Auth State */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  className="flex items-center gap-2.5 py-2 px-3.5 rounded-[6px] glass-card text-sm sm:text-base font-semibold transition"
                >
                  <div className="w-7 h-7 rounded-[4px] bg-[#635BFF] flex items-center justify-center text-white text-xs font-bold font-mono">
                    {profile?.full_name?.charAt(0).toUpperCase() || 'U'}
                  </div>
                  <span className="max-w-[140px] truncate">{profile?.full_name || user.email}</span>
                </button>

                {/* Profile Dropdown */}
                {profileDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-52 glass-panel rounded-[6px] shadow-subtle py-2 z-50 text-sm">
                    <div className="px-4 py-2 border-b border-[#CBD5E1] dark:border-[#E6E6E6]/10">
                      <p className="font-bold text-current truncate">{profile?.full_name}</p>
                      <p className="text-xs font-mono text-slate-500 dark:text-slate-400 truncate">{user.email}</p>
                    </div>
                    <Link
                      to="/profile"
                      onClick={() => setProfileDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2.5 text-slate-700 dark:text-slate-300 hover:text-current hover:bg-slate-100 dark:hover:bg-white/5"
                    >
                      <User className="w-4 h-4" />
                      <span>My Account</span>
                    </Link>
                    <button
                      onClick={() => { setProfileDropdownOpen(false); signOut(); }}
                      className="w-full flex items-center gap-2.5 px-4 py-2.5 text-[#FF4B4B] hover:bg-[#FF4B4B]/10 text-left font-semibold"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => requireAuth()}
                className="btn-fintech-primary text-sm sm:text-base font-semibold"
              >
                Sign In
              </button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-2">
            <ThemeToggle />
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="p-2 rounded-[6px] text-slate-700 dark:text-slate-300 hover:text-current hover:bg-slate-200/60 dark:hover:bg-white/5"
            >
              {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer */}
      {menuOpen && (
        <div className="md:hidden glass-panel border-t border-[#CBD5E1] dark:border-[#E6E6E6]/10 px-4 pt-3 pb-6 space-y-3">
          <Link
            to="/"
            onClick={() => setMenuOpen(false)}
            className="block py-2 text-slate-700 dark:text-slate-300 hover:text-current font-semibold text-base"
          >
            Home
          </Link>
          <Link
            to="/downloader"
            onClick={() => setMenuOpen(false)}
            className="block py-2 text-slate-700 dark:text-slate-300 hover:text-current font-semibold text-base"
          >
            Downloader Tool
          </Link>
          <Link
            to="/pricing"
            onClick={() => setMenuOpen(false)}
            className="block py-2 text-slate-700 dark:text-slate-300 hover:text-current font-semibold text-base"
          >
            Pricing
          </Link>
          <Link
            to="/blog"
            onClick={() => setMenuOpen(false)}
            className="block py-2 text-slate-700 dark:text-slate-300 hover:text-current font-semibold text-base"
          >
            Blog & Guides
          </Link>
          <Link
            to="/contact"
            onClick={() => setMenuOpen(false)}
            className="block py-2 text-slate-700 dark:text-slate-300 hover:text-current font-semibold text-base"
          >
            Contact Us
          </Link>

          <div className="pt-3 border-t border-[#CBD5E1] dark:border-[#E6E6E6]/10 flex items-center justify-between">
            {user ? (
              <div className="flex items-center gap-3 w-full justify-between">
                <Link to="/profile" onClick={() => setMenuOpen(false)} className="text-current font-bold text-base">
                  {profile?.full_name}
                </Link>
                <button onClick={signOut} className="text-sm text-[#FF4B4B] font-bold">
                  Sign Out
                </button>
              </div>
            ) : (
              <button
                onClick={() => { setMenuOpen(false); requireAuth(); }}
                className="w-full btn-fintech-primary text-base text-center"
              >
                Sign In
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  )
}
