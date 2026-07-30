import React from 'react'
import { Link } from 'react-router-dom'
import { Download, ShieldCheck, Heart, ExternalLink } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="mt-20 border-t border-white/10 bg-[#0F0F12] text-slate-400 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          
          {/* Brand Col */}
          <div className="md:col-span-1 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-brand-500 flex items-center justify-center text-white font-bold">
                <Download className="w-4 h-4" />
              </div>
              <span className="font-bold text-white text-base">TG Downloader</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Fast, bulk, and categorized media downloader for Telegram channels, groups, and forum topics. Stream files straight to your local browser downloads.
            </p>
            <div className="flex items-center gap-2 text-xs text-emerald-400 font-medium">
              <ShieldCheck className="w-4 h-4" />
              <span>Zero User Files Saved on Server</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Features</h4>
            <ul className="space-y-2 text-xs">
              <li><Link to="/" className="hover:text-white transition">Channel Downloader</Link></li>
              <li><Link to="/" className="hover:text-white transition">Forum Topics Browser</Link></li>
              <li><Link to="/" className="hover:text-white transition">Media Filter & Sort</Link></li>
              <li><Link to="/pricing" className="hover:text-white transition">Subscription Plans</Link></li>
            </ul>
          </div>

          {/* Resources & Guides */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Guides & Blog</h4>
            <ul className="space-y-2 text-xs">
              <li><Link to="/blog" className="hover:text-white transition">Telegram Downloader Guide</Link></li>
              <li><Link to="/blog" className="hover:text-white transition">Forum Topics Tutorial</Link></li>
              <li><Link to="/blog" className="hover:text-white transition">Media Category Browsing</Link></li>
              <li><Link to="/contact" className="hover:text-white transition">Support & Helpdesk</Link></li>
            </ul>
          </div>

          {/* AdSense Legal Compliance */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Legal & Compliance</h4>
            <ul className="space-y-2 text-xs">
              <li><Link to="/privacy" className="hover:text-white transition">Privacy Policy</Link></li>
              <li><Link to="/terms" className="hover:text-white transition">Terms of Service</Link></li>
              <li><Link to="/refund-policy" className="hover:text-white transition">Refund & Cancellation Policy</Link></li>
              <li><Link to="/disclaimer" className="hover:text-white transition">DMCA & Copyright Disclaimer</Link></li>
            </ul>
          </div>

        </div>

        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4 text-xs">
          <p>© {new Date().getFullYear()} TG Media Downloader Web Edition. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <Link to="/privacy" className="hover:text-white">Privacy</Link>
            <Link to="/terms" className="hover:text-white">Terms</Link>
            <Link to="/contact" className="hover:text-white">Contact</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
