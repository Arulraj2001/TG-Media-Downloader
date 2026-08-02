import React from 'react'
import { Link } from 'react-router-dom'
import SeoMeta from '../components/SeoMeta'
import { Home, Search, BookOpen, Download, ArrowLeft } from 'lucide-react'

export default function NotFoundView() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center space-y-8">
      <SeoMeta
        title="404 — Page Not Found"
        description="The page you're looking for doesn't exist. Explore TG Media Downloader's guides, downloader tool, and documentation."
        noIndex
      />

      <div className="space-y-4">
        <p className="text-8xl font-black bg-clip-text text-transparent bg-gradient-to-r from-[#635BFF] via-purple-500 to-pink-500 font-display">
          404
        </p>
        <h1 className="text-2xl sm:text-3xl font-black text-current font-display">
          Page Not Found
        </h1>
        <p className="text-slate-600 dark:text-slate-300 text-sm max-w-md mx-auto">
          The page you're looking for doesn't exist or has been moved. Let's get you back on track.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row justify-center gap-3">
        <Link to="/" className="btn-fintech-primary text-sm font-bold py-2.5 px-6 flex items-center justify-center gap-2">
          <Home className="w-4 h-4" />
          Go Home
        </Link>
        <Link to="/downloader" className="btn-fintech-secondary text-sm font-bold py-2.5 px-6 flex items-center justify-center gap-2">
          <Download className="w-4 h-4" />
          Launch Downloader
        </Link>
        <Link to="/blog" className="btn-fintech-secondary text-sm font-bold py-2.5 px-6 flex items-center justify-center gap-2">
          <BookOpen className="w-4 h-4" />
          Browse Guides
        </Link>
      </div>

      <div className="glass-panel p-6 rounded-[16px] border border-slate-200/80 dark:border-white/10 space-y-3">
        <h2 className="font-display font-bold text-current">Popular Pages</h2>
        <div className="flex flex-wrap justify-center gap-2">
          <Link to="/features" className="text-xs font-bold text-[#635BFF] hover:underline">Features</Link>
          <span className="text-slate-400">•</span>
          <Link to="/faq" className="text-xs font-bold text-[#635BFF] hover:underline">FAQ</Link>
          <span className="text-slate-400">•</span>
          <Link to="/docs" className="text-xs font-bold text-[#635BFF] hover:underline">Documentation</Link>
          <span className="text-slate-400">•</span>
          <Link to="/about" className="text-xs font-bold text-[#635BFF] hover:underline">About</Link>
          <span className="text-slate-400">•</span>
          <Link to="/contact" className="text-xs font-bold text-[#635BFF] hover:underline">Contact</Link>
          <span className="text-slate-400">•</span>
          <Link to="/search" className="text-xs font-bold text-[#635BFF] hover:underline">Search</Link>
        </div>
      </div>
    </div>
  )
}