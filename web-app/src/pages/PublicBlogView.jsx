import React, { useState } from 'react'
import { useApp } from '../context/AppContext'
import SeoMeta from '../components/SeoMeta'
import { Search, BookOpen, Clock, Tag, Calendar, User, ArrowLeft, Share2, Terminal } from 'lucide-react'

export default function PublicBlogView() {
  const { blogPosts } = useApp()
  const [selectedPost, setSelectedPost] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')

  const filteredPosts = (blogPosts || []).filter(post => 
    post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (post.category && post.category.toLowerCase().includes(searchQuery.toLowerCase()))
  )

  if (selectedPost) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-10 space-y-8">
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

        <button
          onClick={() => setSelectedPost(null)}
          className="btn-fintech-secondary text-xs flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Articles</span>
        </button>

        <div className="space-y-4">
          <div className="flex items-center gap-3 text-xs font-mono text-[#635BFF]">
            <span>{selectedPost.category}</span>
            <span>•</span>
            <span className="flex items-center gap-1 text-slate-400">
              <Clock className="w-3.5 h-3.5" /> {selectedPost.readTime || 5} MIN READ
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-bold text-current leading-tight tracking-tight">
            {selectedPost.title}
          </h1>

          <div className="flex items-center gap-3 text-xs font-mono text-slate-400 pt-2 border-t border-[#E6E6E6]/10">
            <span>By {selectedPost.author || 'TG Downloader Team'}</span>
            <span>•</span>
            <span>{selectedPost.date}</span>
          </div>
        </div>

        <div className="aspect-video w-full rounded-[12px] overflow-hidden border border-[#E6E6E6]/10">
          <img src={selectedPost.cover} alt={selectedPost.title} className="w-full h-full object-cover" />
        </div>

        {/* Content Body Max 72ch */}
        <div className="glass-panel p-6 sm:p-8 rounded-[12px] text-current text-sm leading-relaxed whitespace-pre-line space-y-4 max-w-[72ch]">
          {selectedPost.content}
        </div>

      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-12 space-y-8">
      <SeoMeta
        title="Telegram Downloader Blog & Technical Guides — Tutorials & How-To"
        description="Comprehensive technical guides, tutorials, and tips on downloading Telegram videos, private channel media, restricted group content, and managing Telegram forum sub-topics."
        keywords="telegram downloading guides, how to download telegram videos, download restricted telegram channel, save telegram private group files, telegram media downloader tutorial"
      />

      {/* Header */}
      <div className="space-y-3 max-w-2xl">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#635BFF]/15 border border-[#635BFF]/30 text-[#635BFF] dark:text-indigo-300 text-xs font-mono font-bold shadow-sm">
          <Terminal className="w-3.5 h-3.5" />
          <span>TELEGRAM BULK DOWNLOADER TUTORIALS &amp; GUIDES</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-current tracking-tight font-display">
          Bulk Downloader Guides &amp; Docs
        </h1>
        <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
          In-depth technical tutorials, how-to guides, and tips for bulk downloading videos, photos, files, and forum topics from Telegram channels, groups, and folders.
        </p>
      </div>

      {/* Search Bar */}
      <div className="max-w-md relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
        <input
          type="text"
          placeholder="Search articles by title or tag..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 rounded-[6px] glass-input text-xs focus:outline-none"
        />
      </div>

      {/* Blog Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredPosts.map(post => (
          <article
            key={post.id}
            onClick={() => setSelectedPost(post)}
            className="glass-panel rounded-[12px] overflow-hidden border border-[#E6E6E6]/10 hover:border-[#635BFF] transition cursor-pointer flex flex-col justify-between group"
          >
            <div className="aspect-video w-full overflow-hidden">
              <img
                src={post.cover}
                alt={post.title}
                className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
              />
            </div>

            <div className="p-6 space-y-3">
              <div className="flex items-center justify-between text-xs font-mono text-[#635BFF]">
                <span>{post.category}</span>
                <span className="text-slate-400 flex items-center gap-1 text-[11px]">
                  <Clock className="w-3.5 h-3.5" /> {post.readTime || 5} MIN READ
                </span>
              </div>

              <h2 className="text-lg font-bold text-current group-hover:text-[#635BFF] transition line-clamp-2">
                {post.title}
              </h2>

              <p className="text-slate-400 text-xs line-clamp-3 leading-relaxed">
                {post.excerpt}
              </p>

              <div className="pt-4 border-t border-[#E6E6E6]/10 flex items-center justify-between text-xs font-mono text-slate-400">
                <span>{post.date}</span>
                <span className="text-[#635BFF] font-semibold group-hover:translate-x-1 transition">
                  Read Article →
                </span>
              </div>
            </div>
          </article>
        ))}
      </div>

    </div>
  )
}
