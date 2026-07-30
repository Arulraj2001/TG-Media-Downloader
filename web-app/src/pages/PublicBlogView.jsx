import React, { useState } from 'react'
import { useApp } from '../context/AppContext'
import { Search, BookOpen, Clock, Tag, Calendar, User, ArrowLeft, Share2, Sparkles } from 'lucide-react'

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
      <div className="max-w-4xl mx-auto px-4 py-10 space-y-8">
        
        {/* Schema.org BlogPosting Structured Data Injection */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            "headline": selectedPost.title,
            "image": [selectedPost.cover],
            "datePublished": selectedPost.date,
            "author": {
              "@type": "Organization",
              "name": selectedPost.author
            },
            "description": selectedPost.excerpt
          })}
        </script>

        <button
          onClick={() => setSelectedPost(null)}
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-xs text-slate-300 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Articles</span>
        </button>

        <div className="space-y-4">
          <div className="flex items-center gap-3 text-xs text-brand-400 font-semibold">
            <span>{selectedPost.category}</span>
            <span>•</span>
            <span className="flex items-center gap-1 text-slate-400">
              <Clock className="w-3.5 h-3.5" /> {selectedPost.readTime} min read
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold text-white leading-tight">
            {selectedPost.title}
          </h1>

          <div className="flex items-center gap-3 text-xs text-slate-400 pt-2 border-t border-white/10">
            <span>By {selectedPost.author}</span>
            <span>•</span>
            <span>{selectedPost.date}</span>
          </div>
        </div>

        <div className="aspect-video w-full rounded-2xl overflow-hidden border border-white/10 shadow-glow">
          <img src={selectedPost.cover} alt={selectedPost.title} className="w-full h-full object-cover" />
        </div>

        {/* AdSense Ad Unit Placeholder */}
        <div className="p-4 rounded-xl glass-panel border border-white/10 text-center text-xs text-slate-500 my-6">
          <span>AdSense Sponsored Slot</span>
        </div>

        <div className="glass-panel p-6 sm:p-8 rounded-2xl text-slate-300 text-sm leading-relaxed whitespace-pre-line space-y-4 border border-white/10">
          {selectedPost.content}
        </div>

      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-12 space-y-10">
      
      {/* Header */}
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-500/10 border border-brand-500/30 text-brand-300 text-xs font-semibold">
          <BookOpen className="w-4 h-4" />
          <span>Guides & Tutorials</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          TG Downloader Blog & Articles
        </h1>
        <p className="text-slate-400 text-sm">
          Everything you need to know about Telegram channel downloading, forum topic management, and media organization.
        </p>
      </div>

      {/* Search Bar */}
      <div className="max-w-md mx-auto relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
        <input
          type="text"
          placeholder="Search articles by title or tag..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 rounded-xl glass-input text-xs text-white focus:outline-none"
        />
      </div>

      {/* Blog Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {filteredPosts.map(post => (
          <article
            key={post.id}
            onClick={() => setSelectedPost(post)}
            className="glass-panel rounded-2xl overflow-hidden border border-white/10 hover:border-brand-500/50 transition cursor-pointer flex flex-col justify-between group shadow-glow"
          >
            <div className="aspect-video w-full overflow-hidden">
              <img
                src={post.cover}
                alt={post.title}
                className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
              />
            </div>

            <div className="p-6 space-y-3">
              <div className="flex items-center justify-between text-xs text-brand-400 font-semibold">
                <span>{post.category}</span>
                <span className="text-slate-400 flex items-center gap-1 text-[11px]">
                  <Clock className="w-3.5 h-3.5" /> {post.readTime} min read
                </span>
              </div>

              <h2 className="text-lg font-bold text-white group-hover:text-brand-300 transition line-clamp-2">
                {post.title}
              </h2>

              <p className="text-slate-400 text-xs line-clamp-3 leading-relaxed">
                {post.excerpt}
              </p>

              <div className="pt-4 border-t border-white/10 flex items-center justify-between text-[11px] text-slate-400">
                <span>{post.date}</span>
                <span className="text-brand-400 font-semibold flex items-center gap-1 group-hover:translate-x-1 transition">
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
