import React from 'react'
import { Link } from 'react-router-dom'
import { Download, ShieldCheck } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="mt-20 border-t border-[#CBD5E1] dark:border-[#E6E6E6]/10 bg-slate-100/80 dark:bg-[#18181D]/80 text-slate-600 dark:text-slate-400 text-sm transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          
          {/* Brand Col */}
          <div className="md:col-span-1 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-[6px] bg-[#635BFF] flex items-center justify-center text-white font-bold">
                <Download className="w-4 h-4" />
              </div>
              <span className="font-bold text-slate-900 dark:text-white text-base">TG Downloader</span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Fast, bulk, and categorized media downloader for Telegram channels, groups, and forum topics. Stream files straight to your local browser downloads.
            </p>
            <div className="flex items-center gap-2 text-xs text-[#00C48C] font-mono font-semibold">
              <ShieldCheck className="w-4 h-4" />
              <span>Zero User Files Saved on Server</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider font-mono">Features & Tech</h4>
            <ul className="space-y-2 text-xs">
              <li><Link to="/about" className="hover:text-[#635BFF] transition-colors">About & Technology</Link></li>
              <li><Link to="/downloader" className="hover:text-[#635BFF] transition-colors">Channel Downloader</Link></li>
              <li><Link to="/downloader" className="hover:text-[#635BFF] transition-colors">Forum Topics Browser</Link></li>
              <li><Link to="/downloader" className="hover:text-[#635BFF] transition-colors">Media Filter & Sort</Link></li>
            </ul>
          </div>

          {/* Resources & Guides */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider font-mono">Guides & Blog</h4>
            <ul className="space-y-2 text-xs">
              <li><Link to="/blog" className="hover:text-[#635BFF] transition-colors">Telegram Downloader Guide</Link></li>
              <li><Link to="/blog" className="hover:text-[#635BFF] transition-colors">Forum Topics Tutorial</Link></li>
              <li><Link to="/blog" className="hover:text-[#635BFF] transition-colors">Media Category Browsing</Link></li>
              <li><Link to="/contact" className="hover:text-[#635BFF] transition-colors">Support & Helpdesk</Link></li>
            </ul>
          </div>

          {/* AdSense Legal Compliance */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider font-mono">Legal & Compliance</h4>
            <ul className="space-y-2 text-xs">
              <li><Link to="/privacy" className="hover:text-[#635BFF] transition-colors">Privacy Policy</Link></li>
              <li><Link to="/terms" className="hover:text-[#635BFF] transition-colors">Terms of Service</Link></li>
              <li><Link to="/refund-policy" className="hover:text-[#635BFF] transition-colors">Refund & Cancellation Policy</Link></li>
              <li><Link to="/disclaimer" className="hover:text-[#635BFF] transition-colors">DMCA & Copyright Disclaimer</Link></li>
            </ul>
          </div>

        </div>

        <div className="pt-8 border-t border-[#CBD5E1] dark:border-[#E6E6E6]/10 flex flex-col md:flex-row items-center justify-between gap-4 text-xs font-mono">
          <p>© {new Date().getFullYear()} TG Media Downloader Web Edition. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <Link to="/about" className="hover:text-[#635BFF] transition-colors">About Us</Link>
            <Link to="/privacy" className="hover:text-[#635BFF] transition-colors">Privacy</Link>
            <Link to="/terms" className="hover:text-[#635BFF] transition-colors">Terms</Link>
            <Link to="/contact" className="hover:text-[#635BFF] transition-colors">Contact</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
