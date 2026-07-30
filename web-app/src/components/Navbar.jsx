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
        <div className="flex items-center justify-between h-16">
          
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-8 h-8 rounded-[6px] bg-[#635BFF] flex items-center justify-center text-white font-bold transition group-hover:scale-105">
              <Download className="w-4 h-4" />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-base text-current tracking-tight leading-tight">TG Downloader</span>
              <span className="text-[10px] text-[#635BFF] font-mono font-medium tracking-wider uppercase">WEB API v2.7</span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-1">
            <Link
              to="/"
              className={`px-3.5 py-1.5 rounded-[6px] text-xs sm:text-sm font-semibold transition ${
                isActive('/') ? 'text-[#635BFF] bg-[#635BFF]/10 font-bold' : 'text-slate-600 dark:text-slate-400 hover:text-current hover:bg-slate-100 dark:hover:bg-white/5'
              }`}
            >
              Home
            </Link>
            <Link
              to="/downloader"
              className={`px-3.5 py-1.5 rounded-[6px] text-xs sm:text-sm font-semibold transition ${
                isActive('/downloader') ? 'text-[#635BFF] bg-[#635BFF]/10 font-bold' : 'text-slate-600 dark:text-slate-400 hover:text-current hover:bg-slate-100 dark:hover:bg-white/5'
              }`}
            >
              Downloader Tool
            </Link>
            <Link
              to="/pricing"
              className={`px-3.5 py-1.5 rounded-[6px] text-xs sm:text-sm font-semibold transition ${
                isActive('/pricing') ? 'text-[#635BFF] bg-[#635BFF]/10 font-bold' : 'text-slate-600 dark:text-slate-400 hover:text-current hover:bg-slate-100 dark:hover:bg-white/5'
              }`}
            >
              Pricing
            </Link>
            <Link
              to="/blog"
              className={`px-3.5 py-1.5 rounded-[6px] text-xs sm:text-sm font-semibold transition ${
                isActive('/blog') ? 'text-[#635BFF] bg-[#635BFF]/10 font-bold' : 'text-slate-600 dark:text-slate-400 hover:text-current hover:bg-slate-100 dark:hover:bg-white/5'
              }`}
            >
              Blog & Guides
            </Link>
            <Link
              to="/contact"
              className={`px-3.5 py-1.5 rounded-[6px] text-xs sm:text-sm font-semibold transition ${
                isActive('/contact') ? 'text-[#635BFF] bg-[#635BFF]/10 font-bold' : 'text-slate-600 dark:text-slate-400 hover:text-current hover:bg-slate-100 dark:hover:bg-white/5'
              }`}
            >
              Contact
            </Link>
          </nav>

          {/* Right Actions */}
          <div className="hidden md:flex items-center gap-3">
            <ThemeToggle />

            {/* Subscription / Free Balance Badge */}
            {subscription ? (
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-[6px] bg-[#00C48C]/10 border border-[#00C48C]/30 text-[#00C48C] text-xs font-mono font-bold">
                <Crown className="w-3.5 h-3.5" />
                <span>PRO ACTIVE</span>
              </div>
            ) : (
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-[6px] bg-[#635BFF]/10 border border-[#635BFF]/30 text-[#635BFF] text-xs font-mono font-bold">
                <Activity className="w-3.5 h-3.5" />
                <span>{freeFetchesRemaining} FREE FETCHES</span>
              </div>
            )}

            {/* User Profile / Auth State */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  className="flex items-center gap-2 py-1.5 px-3 rounded-[6px] glass-card text-xs sm:text-sm font-semibold transition"
                >
                  <div className="w-6 h-6 rounded-[4px] bg-[#635BFF] flex items-center justify-center text-white text-xs font-bold font-mono">
                    {profile?.full_name?.charAt(0).toUpperCase() || 'U'}
                  </div>
                  <span className="max-w-[120px] truncate">{profile?.full_name || user.email}</span>
                </button>

                {/* Profile Dropdown */}
                {profileDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 glass-panel rounded-[6px] shadow-subtle py-2 z-50 text-xs sm:text-sm">
                    <div className="px-4 py-2 border-b border-[#CBD5E1] dark:border-[#E6E6E6]/10">
                      <p className="font-bold text-current truncate">{profile?.full_name}</p>
                      <p className="text-xs font-mono text-slate-500 dark:text-slate-400 truncate">{user.email}</p>
                    </div>
                    <Link
                      to="/profile"
                      onClick={() => setProfileDropdownOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 text-slate-600 dark:text-slate-300 hover:text-current hover:bg-slate-100 dark:hover:bg-white/5"
                    >
                      <User className="w-4 h-4" />
                      <span>My Account</span>
                    </Link>
                    <button
                      onClick={() => { setProfileDropdownOpen(false); signOut(); }}
                      className="w-full flex items-center gap-2 px-4 py-2 text-[#FF4B4B] hover:bg-[#FF4B4B]/10 text-left"
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
                className="btn-fintech-primary text-xs sm:text-sm"
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
              className="p-2 rounded-[6px] text-slate-600 dark:text-slate-400 hover:text-current hover:bg-slate-100 dark:hover:bg-white/5"
            >
              {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
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
            className="block py-2 text-slate-600 dark:text-slate-300 hover:text-current font-medium text-sm"
          >
            Home
          </Link>
          <Link
            to="/downloader"
            onClick={() => setMenuOpen(false)}
            className="block py-2 text-slate-600 dark:text-slate-300 hover:text-current font-medium text-sm"
          >
            Downloader Tool
          </Link>
          <Link
            to="/pricing"
            onClick={() => setMenuOpen(false)}
            className="block py-2 text-slate-600 dark:text-slate-300 hover:text-current font-medium text-sm"
          >
            Pricing
          </Link>
          <Link
            to="/blog"
            onClick={() => setMenuOpen(false)}
            className="block py-2 text-slate-600 dark:text-slate-300 hover:text-current font-medium text-sm"
          >
            Blog & Guides
          </Link>
          <Link
            to="/contact"
            onClick={() => setMenuOpen(false)}
            className="block py-2 text-slate-600 dark:text-slate-300 hover:text-current font-medium text-sm"
          >
            Contact Us
          </Link>

          <div className="pt-3 border-t border-[#CBD5E1] dark:border-[#E6E6E6]/10 flex items-center justify-between">
            {user ? (
              <div className="flex items-center gap-3 w-full justify-between">
                <Link to="/profile" onClick={() => setMenuOpen(false)} className="text-current font-semibold text-sm">
                  {profile?.full_name}
                </Link>
                <button onClick={signOut} className="text-xs text-[#FF4B4B] font-semibold">
                  Sign Out
                </button>
              </div>
            ) : (
              <button
                onClick={() => { setMenuOpen(false); requireAuth(); }}
                className="w-full btn-fintech-primary text-sm text-center"
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
