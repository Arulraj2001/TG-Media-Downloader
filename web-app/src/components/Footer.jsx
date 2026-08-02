import React from 'react'
import { Link } from 'react-router-dom'
import { Download, ShieldCheck, Heart, Search, Map } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="mt-20 border-t border-[#CBD5E1] dark:border-white/10 bg-slate-100/90 dark:bg-[#0d0d12] text-slate-600 dark:text-slate-400 text-sm transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          
          {/* Brand Col */}
          <div className="md:col-span-1 space-y-3.5">
            <div className="flex items-center gap-3">
              <img 
                src="/logo.png" 
                alt="TG Downloader Logo" 
                className="w-9 h-9 rounded-xl object-contain shadow-md shadow-[#635BFF]/30" 
              />
              <span className="font-display font-extrabold text-slate-900 dark:text-white text-lg tracking-tight">TG Downloader</span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-normal">
              A free web-based tool for streaming and bulk downloading files directly from Telegram channels, groups, and sub-topics into your local browser storage.
            </p>
            <div className="flex items-center gap-2 text-xs text-emerald-500 font-mono font-bold pt-1">
              <ShieldCheck className="w-4 h-4" />
              <span>Zero User Files Saved on Server</span>
            </div>
          </div>

          {/* Tools & Features */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider font-mono">Tools & Features</h4>
            <ul className="space-y-2.5 text-xs font-medium">
              <li><Link to="/downloader" className="hover:text-[#635BFF] transition-colors">Bulk Channel Downloader</Link></li>
              <li><Link to="/features" className="hover:text-[#635BFF] transition-colors">Features Overview</Link></li>
              <li><Link to="/desktop-app" className="hover:text-[#635BFF] transition-colors">Desktop Version (Windows/Mac)</Link></li>
              <li><Link to="/queue" className="hover:text-[#635BFF] transition-colors">Live Queue & Speed Monitor</Link></li>
              <li><Link to="/about" className="hover:text-[#635BFF] transition-colors">Technology Architecture</Link></li>
            </ul>
          </div>

          {/* Resources & Guides */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider font-mono">Resources</h4>
            <ul className="space-y-2.5 text-xs font-medium">
              <li><Link to="/blog" className="hover:text-[#635BFF] transition-colors">Blog & Guides</Link></li>
              <li><Link to="/docs" className="hover:text-[#635BFF] transition-colors">Documentation</Link></li>
              <li><Link to="/faq" className="hover:text-[#635BFF] transition-colors">FAQ</Link></li>
              <li><Link to="/search" className="hover:text-[#635BFF] transition-colors flex items-center gap-1"><Search className="w-3 h-3" /> Search</Link></li>
              <li><Link to="/sitemap" className="hover:text-[#635BFF] transition-colors flex items-center gap-1"><Map className="w-3 h-3" /> Sitemap</Link></li>
              <li><Link to="/contact" className="hover:text-[#635BFF] transition-colors">Support & Technical Helpdesk</Link></li>
              <li><a href="https://buymeacoffee.com/x4kqsd0lka" target="_blank" rel="noreferrer" className="hover:text-amber-500 transition-colors flex items-center gap-1.5 font-bold text-amber-500"><Heart className="w-3.5 h-3.5 fill-amber-500" /> Support via Buy Me a Coffee</a></li>
            </ul>
          </div>

          {/* Legal & Policies */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider font-mono">Legal & Policies</h4>
            <ul className="space-y-2.5 text-xs font-medium">
              <li><Link to="/privacy-policy" className="hover:text-[#635BFF] transition-colors">Privacy Policy</Link></li>
              <li><Link to="/terms-of-service" className="hover:text-[#635BFF] transition-colors">Terms of Service</Link></li>
              <li><Link to="/disclaimer" className="hover:text-[#635BFF] transition-colors">DMCA & Copyright Disclaimer</Link></li>
              <li><Link to="/cookie-policy" className="hover:text-[#635BFF] transition-colors">Cookie Policy</Link></li>
              <li><Link to="/editorial-policy" className="hover:text-[#635BFF] transition-colors">Editorial Policy</Link></li>
              <li><Link to="/security" className="hover:text-[#635BFF] transition-colors">Security Statement</Link></li>
            </ul>
          </div>

        </div>

        {/* Bottom copyright */}
        <div className="pt-8 border-t border-[#CBD5E1] dark:border-white/10 flex flex-col md:flex-row items-center justify-between gap-4 text-xs font-mono text-slate-500 dark:text-slate-400">
          <p>© {new Date().getFullYear()} TG Media Downloader Web Edition. All rights reserved.</p>
          <div className="flex items-center gap-5">
            <Link to="/about" className="hover:text-[#635BFF] transition-colors">About</Link>
            <Link to="/privacy-policy" className="hover:text-[#635BFF] transition-colors">Privacy</Link>
            <Link to="/terms-of-service" className="hover:text-[#635BFF] transition-colors">Terms</Link>
            <Link to="/contact" className="hover:text-[#635BFF] transition-colors">Contact Support</Link>
            <Link to="/sitemap" className="hover:text-[#635BFF] transition-colors">Sitemap</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}