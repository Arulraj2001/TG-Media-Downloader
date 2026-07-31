import React, { useState } from 'react'
import { useApp } from '../context/AppContext'
import SeoMeta from '../components/SeoMeta'
import { Search, BookOpen, Clock, Tag, Calendar, User, ArrowLeft, Share2, Terminal, Sparkles, ArrowRight, CheckCircle2, Zap, Layers } from 'lucide-react'

// ─── RICH MARKDOWN CONTENT PARSER & RENDERER FOR ARTICLES ────────────────────
function FormattedBlogContent({ content }) {
  if (!content) return null

  // Process text line by line into structured UI sections
  const lines = content.split('\n')
  const elements = []
  let currentList = []

  const renderInlineFormatted = (text) => {
    // Replace **bold** and `code` with styled React spans
    const parts = text.split(/(\*\*.*?\*\*|`.*?`)/g)
    return parts.map((part, index) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return (
          <strong key={index} className="font-bold text-[#635BFF] dark:text-indigo-300">
            {part.slice(2, -2)}
          </strong>
        )
      }
      if (part.startsWith('`') && part.endsWith('`')) {
        return (
          <code key={index} className="px-2 py-0.5 rounded-md bg-[#635BFF]/15 text-[#635BFF] dark:text-indigo-300 border border-[#635BFF]/30 font-mono text-xs font-bold mx-1">
            {part.slice(1, -1)}
          </code>
        )
      }
      return part
    })
  }

  const flushList = (keyPrefix) => {
    if (currentList.length > 0) {
      elements.push(
        <div key={`list-${keyPrefix}`} className="space-y-2.5 my-4">
          {currentList.map((item, idx) => (
            <div key={idx} className="flex items-start gap-3 p-3 rounded-xl bg-slate-200/50 dark:bg-white/[0.03] border border-slate-200 dark:border-white/10 text-xs sm:text-sm font-medium">
              <CheckCircle2 className="w-4 h-4 text-[#00C48C] flex-shrink-0 mt-0.5" />
              <div className="leading-relaxed">{renderInlineFormatted(item)}</div>
            </div>
          ))}
        </div>
      )
      currentList = []
    }
  }

  lines.forEach((line, idx) => {
    const trimmed = line.trim()

    // 1. Heading 2 (## Title)
    if (trimmed.startsWith('## ')) {
      flushList(idx)
      const titleText = trimmed.replace(/^##\s+/, '')
      elements.push(
        <div key={idx} className="pt-4 pb-2 border-b border-[#635BFF]/30 mt-6 mb-4 flex items-center gap-2.5">
          <Sparkles className="w-5 h-5 text-[#635BFF]" />
          <h2 className="text-xl sm:text-2xl font-black font-display text-current tracking-tight">
            {renderInlineFormatted(titleText)}
          </h2>
        </div>
      )
      return
    }

    // 2. Heading 3 / Step Card (### Step X: Title)
    if (trimmed.startsWith('### ')) {
      flushList(idx)
      const stepText = trimmed.replace(/^###\s+/, '')
      const isStep = stepText.toLowerCase().includes('step')
      elements.push(
        <div key={idx} className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-[#635BFF]/10 via-purple-500/5 to-transparent border border-[#635BFF]/30 shadow-sm mt-6 mb-3 space-y-1">
          <div className="flex items-center gap-2">
            {isStep && (
              <span className="px-2.5 py-0.5 rounded-full bg-[#635BFF] text-white font-mono font-extrabold text-[10px] uppercase tracking-wider">
                GUIDE STEP
              </span>
            )}
            <h3 className="text-lg font-extrabold font-display text-current">
              {renderInlineFormatted(stepText)}
            </h3>
          </div>
        </div>
      )
      return
    }

    // 3. Ordered / Unordered List Item (1. Item or - Item)
    if (/^\d+\.\s+/.test(trimmed) || /^[\-\*]\s+/.test(trimmed)) {
      const itemText = trimmed.replace(/^(\d+\.|\-|\*)\s+/, '')
      currentList.push(itemText)
      return
    }

    // 4. Regular Paragraph
    if (trimmed.length > 0) {
      flushList(idx)
      elements.push(
        <p key={idx} className="text-slate-600 dark:text-slate-300 text-sm sm:text-base leading-relaxed my-3 font-normal">
          {renderInlineFormatted(trimmed)}
        </p>
      )
    }
  })

  flushList('final')

  return <div className="space-y-2">{elements}</div>
}

export default function PublicBlogView() {
  const { blogPosts } = useApp()
  const [selectedPost, setSelectedPost] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')

  const filteredPosts = (blogPosts || []).filter(post =>
    post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    post.category.toLowerCase().includes(searchQuery.toLowerCase())
  )

  // ─── SINGLE ARTICLE VIEW — PREMIUM READING UI ─────────────────────────────
  if (selectedPost) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-10 space-y-8 animate-fade-in">
        <SeoMeta
          title={selectedPost.title}
          description={selectedPost.metaDesc || selectedPost.excerpt}
          keywords={selectedPost.keywords || 'telegram download tutorial, how to download telegram videos, telegram private group downloader guide'}
          image={selectedPost.cover}
          jsonLd={{
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            "headline": selectedPost.title,
            "description": selectedPost.metaDesc || selectedPost.excerpt,
            "image": selectedPost.cover,
            "author": { "@type": "Person", "name": selectedPost.author || "TG Downloader Team" },
            "datePublished": selectedPost.date || "2026-07-30"
          }}
        />

        {/* Back Button */}
        <button
          onClick={() => setSelectedPost(null)}
          className="btn-fintech-secondary text-xs flex items-center gap-2 px-4 py-2 font-mono font-bold hover:scale-[1.02] transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Articles</span>
        </button>

        {/* Article Header */}
        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-3 text-xs font-mono">
            <span className="px-3 py-1 rounded-full bg-[#635BFF]/15 text-[#635BFF] dark:text-indigo-300 border border-[#635BFF]/30 font-bold uppercase tracking-wider">
              {selectedPost.category}
            </span>
            <span className="text-slate-400 font-bold flex items-center gap-1.5 bg-slate-200/50 dark:bg-white/5 px-2.5 py-1 rounded-full border border-slate-200 dark:border-white/10">
              <Clock className="w-3.5 h-3.5 text-[#635BFF]" /> {selectedPost.readTime || 5} MIN READ
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-current leading-tight tracking-tight font-display">
            {selectedPost.title}
          </h1>

          <div className="flex items-center gap-3 text-xs font-mono text-slate-500 dark:text-slate-400 pt-3 border-t border-slate-200/80 dark:border-white/10">
            <div className="flex items-center gap-1.5 font-bold text-current">
              <User className="w-4 h-4 text-[#635BFF]" />
              <span>By {selectedPost.author || 'TG Downloader Team'}</span>
            </div>
            <span>•</span>
            <div className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5" />
              <span>Published {selectedPost.date}</span>
            </div>
          </div>
        </div>

        {/* Hero Cover Image */}
        <div className="aspect-video w-full rounded-[20px] overflow-hidden border border-slate-200/80 dark:border-white/15 shadow-2xl relative">
          <img src={selectedPost.cover} alt={selectedPost.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
        </div>

        {/* Content Body with Rich UI Parser */}
        <div className="glass-panel p-6 sm:p-10 rounded-[24px] text-current border border-slate-200/80 dark:border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.3)]">
          <FormattedBlogContent content={selectedPost.content} />
        </div>

      </div>
    )
  }

  // ─── ARTICLES LIST VIEW — COMPACT CARDS & PREMIUM UI ─────────────────────
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      <SeoMeta
        title="Telegram Downloader Blog & Technical Guides — Tutorials & How-To"
        description="Comprehensive technical guides, tutorials, and tips on downloading Telegram videos, private channel media, restricted group content, and managing Telegram forum sub-topics."
        keywords="telegram downloading guides, how to download telegram videos, download restricted telegram channel, save telegram private group files, telegram media downloader tutorial"
      />

      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-6 pb-6 border-b border-slate-200/80 dark:border-white/10">
        <div className="space-y-3 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#635BFF]/15 border border-[#635BFF]/30 text-[#635BFF] dark:text-indigo-300 text-xs font-mono font-bold shadow-sm">
            <Terminal className="w-3.5 h-3.5" />
            <span>TELEGRAM BULK DOWNLOADER TUTORIALS &amp; GUIDES</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-current tracking-tight font-display">
            Guides &amp; Technical Articles
          </h1>
          <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
            In-depth technical tutorials, how-to guides, and tips for bulk downloading videos, photos, files, and forum topics from Telegram channels, groups, and folders.
          </p>
        </div>

        {/* Search Bar */}
        <div className="w-full sm:w-80 relative flex-shrink-0">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
          <input
            type="text"
            placeholder="Search guides or category..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="glass-input w-full pl-10 pr-4 py-2.5 rounded-xl text-xs focus:outline-none focus:border-[#635BFF]"
          />
        </div>
      </div>

      {/* Blog Cards Grid — COMPACT 3-COLUMN LAYOUT WITH PREMIUM CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPosts.map(post => (
          <article
            key={post.id}
            onClick={() => setSelectedPost(post)}
            className="glass-panel rounded-[18px] overflow-hidden border border-slate-200/80 dark:border-white/10 hover:border-[#635BFF]/60 hover:shadow-[0_15px_35px_rgba(99,91,255,0.25)] transition-all duration-300 cursor-pointer flex flex-col justify-between group hover:-translate-y-1"
          >
            {/* Compact Thumbnail Container */}
            <div className="h-44 sm:h-40 w-full overflow-hidden relative bg-slate-900">
              <img
                src={post.cover}
                alt={post.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80"></div>
              
              {/* Category Badge overlay */}
              <span className="absolute top-3 left-3 px-2.5 py-1 rounded-md text-[10px] font-mono font-bold bg-[#635BFF]/90 text-white backdrop-blur-md shadow-md">
                {post.category}
              </span>
            </div>

            {/* Compact Content Details */}
            <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-3">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-[11px] font-mono text-slate-500 dark:text-slate-400">
                  <span className="flex items-center gap-1 font-bold text-[#635BFF]">
                    <Clock className="w-3 h-3" /> {post.readTime || 5} MIN READ
                  </span>
                  <span>{post.date}</span>
                </div>

                <h2 className="text-sm sm:text-base font-bold text-current group-hover:text-[#635BFF] transition-colors leading-snug line-clamp-2 font-display">
                  {post.title}
                </h2>

                <p className="text-slate-500 dark:text-slate-400 text-xs line-clamp-2 leading-relaxed">
                  {post.excerpt}
                </p>
              </div>

              {/* Card Footer */}
              <div className="pt-3 border-t border-slate-200/80 dark:border-white/10 flex items-center justify-between text-xs font-mono">
                <span className="text-slate-400 text-[11px]">By {post.author ? post.author.split(' ')[0] : 'Team'}</span>
                <span className="text-[#635BFF] font-bold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                  <span>Read Guide</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          </article>
        ))}
      </div>

    </div>
  )
}
