import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Download, Sparkles, User, Shield, LogOut, Menu, X, Crown, MessageSquare } from 'lucide-react'
import ThemeToggle from './ThemeToggle'

export default function Navbar() {
  const { user, profile, subscription, freeFetchesRemaining, requireAuth, signOut, isAdmin } = useAuth()
  const [menuOpen, setMenuOpen] = useState(false)
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false)
  const location = useLocation()

  const isActive = (path) => location.pathname === path

  return (
    <header className="sticky top-0 z-40 w-full glass-panel border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-brand-600 to-brand-400 flex items-center justify-center text-white shadow-glow">
              <Download className="w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-base text-white tracking-wide leading-tight">TG Downloader</span>
              <span className="text-[10px] text-brand-400 font-semibold tracking-wider uppercase">Web Edition</span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-1">
            <Link
              to="/"
              className={`px-3.5 py-2 rounded-lg text-sm font-medium transition ${
                isActive('/') ? 'text-white bg-white/10' : 'text-slate-300 hover:text-white hover:bg-white/5'
              }`}
            >
              Downloader
            </Link>
            <Link
              to="/pricing"
              className={`px-3.5 py-2 rounded-lg text-sm font-medium transition ${
                isActive('/pricing') ? 'text-white bg-white/10' : 'text-slate-300 hover:text-white hover:bg-white/5'
              }`}
            >
              Pricing
            </Link>
            <Link
              to="/blog"
              className={`px-3.5 py-2 rounded-lg text-sm font-medium transition ${
                isActive('/blog') ? 'text-white bg-white/10' : 'text-slate-300 hover:text-white hover:bg-white/5'
              }`}
            >
              Blog & Guides
            </Link>
            <Link
              to="/contact"
              className={`px-3.5 py-2 rounded-lg text-sm font-medium transition ${
                isActive('/contact') ? 'text-white bg-white/10' : 'text-slate-300 hover:text-white hover:bg-white/5'
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
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold">
                <Crown className="w-3.5 h-3.5" />
                <span>{subscription.subscription_plans?.name || 'PRO Subscriber'}</span>
              </div>
            ) : (
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-brand-500/10 border border-brand-500/30 text-brand-300 text-xs font-semibold">
                <Sparkles className="w-3.5 h-3.5" />
                <span>{freeFetchesRemaining} Free Fetches</span>
              </div>
            )}

            {/* User Profile / Auth State */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  className="flex items-center gap-2 py-1.5 px-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white text-sm font-medium transition"
                >
                  <div className="w-7 h-7 rounded-full bg-brand-600 flex items-center justify-center text-xs font-bold">
                    {profile?.full_name?.charAt(0).toUpperCase() || 'U'}
                  </div>
                  <span className="max-w-[100px] truncate">{profile?.full_name || user.email}</span>
                </button>

                {/* Profile Dropdown */}
                {profileDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-[#18181D] border border-white/10 rounded-xl shadow-glow py-2 z-50 text-sm">
                    <div className="px-4 py-2 border-b border-white/10">
                      <p className="font-semibold text-white truncate">{profile?.full_name}</p>
                      <p className="text-xs text-slate-400 truncate">{user.email}</p>
                    </div>
                    <Link
                      to="/profile"
                      onClick={() => setProfileDropdownOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 text-slate-300 hover:text-white hover:bg-white/5"
                    >
                      <User className="w-4 h-4" />
                      <span>My Profile</span>
                    </Link>
                    <button
                      onClick={() => { setProfileDropdownOpen(false); signOut(); }}
                      className="w-full flex items-center gap-2 px-4 py-2 text-rose-400 hover:bg-rose-500/10 text-left"
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
                className="py-2 px-4 rounded-xl bg-gradient-to-r from-brand-600 to-brand-500 hover:from-brand-500 hover:to-brand-400 text-white font-semibold text-sm transition shadow-glow"
              >
                Sign In
              </button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-2">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="p-2 rounded-lg text-slate-300 hover:text-white hover:bg-white/5"
            >
              {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer */}
      {menuOpen && (
        <div className="md:hidden glass-panel border-t border-white/10 px-4 pt-3 pb-6 space-y-3">
          <Link
            to="/"
            onClick={() => setMenuOpen(false)}
            className="block py-2 text-slate-300 hover:text-white font-medium text-sm"
          >
            Downloader
          </Link>
          <Link
            to="/pricing"
            onClick={() => setMenuOpen(false)}
            className="block py-2 text-slate-300 hover:text-white font-medium text-sm"
          >
            Pricing
          </Link>
          <Link
            to="/blog"
            onClick={() => setMenuOpen(false)}
            className="block py-2 text-slate-300 hover:text-white font-medium text-sm"
          >
            Blog & Guides
          </Link>
          <Link
            to="/contact"
            onClick={() => setMenuOpen(false)}
            className="block py-2 text-slate-300 hover:text-white font-medium text-sm"
          >
            Contact Us
          </Link>

          <div className="pt-3 border-t border-white/10 flex items-center justify-between">
            {user ? (
              <div className="flex items-center gap-3 w-full justify-between">
                <Link to="/profile" onClick={() => setMenuOpen(false)} className="text-white font-semibold text-sm">
                  {profile?.full_name}
                </Link>
                <button onClick={signOut} className="text-xs text-rose-400 font-semibold">
                  Sign Out
                </button>
              </div>
            ) : (
              <button
                onClick={() => { setMenuOpen(false); requireAuth(); }}
                className="w-full py-2.5 rounded-xl bg-brand-500 text-white font-semibold text-sm"
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
