import React from 'react'
import { Link } from 'react-router-dom'
import SeoMeta from '../components/SeoMeta'
import { useApp } from '../context/AppContext'
import { Map, ChevronRight, FileText, BookOpen, HelpCircle, ShieldCheck, Mail, Info, Search, Download, Sparkles } from 'lucide-react'

export default function SitemapView() {
  const { blogPosts } = useApp()

  const mainPages = [
    { name: 'Home', path: '/', icon: <Sparkles className="w-4 h-4" /> },
    { name: 'Downloader', path: '/downloader', icon: <Download className="w-4 h-4" /> },
    { name: 'Features', path: '/features', icon: <Sparkles className="w-4 h-4" /> },
    { name: 'Blog & Guides', path: '/blog', icon: <BookOpen className="w-4 h-4" /> },
    { name: 'Documentation', path: '/docs', icon: <FileText className="w-4 h-4" /> },
    { name: 'FAQ', path: '/faq', icon: <HelpCircle className="w-4 h-4" /> },
    { name: 'About', path: '/about', icon: <Info className="w-4 h-4" /> },
    { name: 'Contact', path: '/contact', icon: <Mail className="w-4 h-4" /> },
    { name: 'Search', path: '/search', icon: <Search className="w-4 h-4" /> }
  ]

  const legalPages = [
    { name: 'Privacy Policy', path: '/privacy-policy' },
    { name: 'Terms of Service', path: '/terms-of-service' },
    { name: 'Disclaimer', path: '/disclaimer' },
    { name: 'Cookie Policy', path: '/cookie-policy' },
    { name: 'Editorial Policy', path: '/editorial-policy' },
    { name: 'Security Statement', path: '/security' }
  ]

  const categories = [...new Set((blogPosts || []).map(p => p.category))]

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      <SeoMeta
        title="Sitemap — All Pages & Guides"
        description="Complete sitemap of TG Media Downloader — all pages, blog categories, and guides about downloading Telegram media."
        keywords="telegram downloader sitemap, telegram media downloader pages"
        breadcrumbs={[
          { name: 'Home', path: '/' },
          { name: 'Sitemap', path: '/sitemap' }
        ]}
      />

      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#635BFF]/10 text-[#635BFF] text-xs font-mono font-bold border border-[#635BFF]/20">
          <Map className="w-4 h-4" />
          <span>SITEMAP</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-current tracking-tight font-display">
          Site Map
        </h1>
        <p className="text-slate-600 dark:text-slate-300 text-sm">
          Every page and guide on TG Media Downloader, organized for easy navigation.
        </p>
      </div>

      {/* Main Pages */}
      <section className="space-y-4">
        <h2 className="text-xl font-black text-current font-display">Main Pages</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {mainPages.map(page => (
            <Link
              key={page.path}
              to={page.path}
              className="glass-panel p-4 rounded-[12px] flex items-center gap-3 border border-slate-200/80 dark:border-white/10 hover:border-[#635BFF]/50 transition-all group"
            >
              <span className="text-[#635BFF]">{page.icon}</span>
              <span className="font-bold text-sm text-current group-hover:text-[#635BFF] transition-colors">{page.name}</span>
              <ChevronRight className="w-4 h-4 ml-auto text-slate-400 group-hover:text-[#635BFF] transition-colors" />
            </Link>
          ))}
        </div>
      </section>

      {/* Legal Pages */}
      <section className="space-y-4">
        <h2 className="text-xl font-black text-current font-display">Legal & Policies</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {legalPages.map(page => (
            <Link
              key={page.path}
              to={page.path}
              className="glass-panel p-4 rounded-[12px] flex items-center gap-3 border border-slate-200/80 dark:border-white/10 hover:border-[#635BFF]/50 transition-all group"
            >
              <span className="text-[#635BFF]"><ShieldCheck className="w-4 h-4" /></span>
              <span className="font-bold text-sm text-current group-hover:text-[#635BFF] transition-colors">{page.name}</span>
              <ChevronRight className="w-4 h-4 ml-auto text-slate-400 group-hover:text-[#635BFF] transition-colors" />
            </Link>
          ))}
        </div>
      </section>

      {/* Blog Categories */}
      <section className="space-y-4">
        <h2 className="text-xl font-black text-current font-display">Blog Categories</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {categories.map(category => (
            <Link
              key={category}
              to={`/blog/category/${category.toLowerCase().replace(/\s+/g, '-')}`}
              className="glass-panel p-4 rounded-[12px] flex items-center gap-3 border border-slate-200/80 dark:border-white/10 hover:border-[#635BFF]/50 transition-all group"
            >
              <span className="text-[#635BFF]"><BookOpen className="w-4 h-4" /></span>
              <span className="font-bold text-sm text-current group-hover:text-[#635BFF] transition-colors">{category}</span>
              <ChevronRight className="w-4 h-4 ml-auto text-slate-400 group-hover:text-[#635BFF] transition-colors" />
            </Link>
          ))}
        </div>
      </section>

      {/* All Articles */}
      <section className="space-y-4">
        <h2 className="text-xl font-black text-current font-display">All Articles ({blogPosts?.length || 0})</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {(blogPosts || []).map(post => (
            <Link
              key={post.id}
              to={`/blog/${post.slug}`}
              className="glass-panel p-4 rounded-[12px] flex items-center gap-3 border border-slate-200/80 dark:border-white/10 hover:border-[#635BFF]/50 transition-all group"
            >
              <span className="text-[#635BFF]"><FileText className="w-4 h-4" /></span>
              <span className="font-bold text-xs text-current group-hover:text-[#635BFF] transition-colors line-clamp-2">{post.title}</span>
              <ChevronRight className="w-4 h-4 ml-auto flex-shrink-0 text-slate-400 group-hover:text-[#635BFF] transition-colors" />
            </Link>
          ))}
        </div>
      </section>
    </div>
  )
}