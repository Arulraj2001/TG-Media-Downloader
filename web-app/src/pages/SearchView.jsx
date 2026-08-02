import React, { useState, useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import SeoMeta from '../components/SeoMeta'
import { useApp } from '../context/AppContext'
import { Search, Clock, ArrowRight, Calendar, User } from 'lucide-react'

export default function SearchView() {
  const { blogPosts } = useApp()
  const [searchParams, setSearchParams] = useSearchParams()
  const [query, setQuery] = useState(searchParams.get('q') || '')

  useEffect(() => {
    setQuery(searchParams.get('q') || '')
  }, [searchParams])

  const filteredPosts = (blogPosts || []).filter(post => {
    if (!query.trim()) return false
    const q = query.toLowerCase()
    return (
      post.title.toLowerCase().includes(q) ||
      post.excerpt.toLowerCase().includes(q) ||
      post.category.toLowerCase().includes(q) ||
      (post.tags || []).some(tag => tag.toLowerCase().includes(q)) ||
      post.content.toLowerCase().includes(q)
    )
  })

  const handleSearch = (e) => {
    e.preventDefault()
    setSearchParams({ q: query })
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      <SeoMeta
        title="Search — Find Telegram Downloader Guides"
        description="Search TG Media Downloader's library of guides, tutorials, and documentation about downloading Telegram media."
        keywords="telegram downloader search, telegram media guides search"
        noIndex={!query}
      />

      {/* Header */}
      <div className="space-y-4">
        <h1 className="text-3xl sm:text-4xl font-black text-current tracking-tight font-display">
          Search the Library
        </h1>
        <p className="text-slate-600 dark:text-slate-300 text-sm">
          Find guides, tutorials, and documentation about downloading Telegram media.
        </p>
      </div>

      {/* Search Form */}
      <form onSubmit={handleSearch} className="relative">
        <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for guides, tutorials, topics..."
          className="glass-input w-full pl-12 pr-4 py-3.5 rounded-xl text-sm focus:outline-none focus:border-[#635BFF]"
          aria-label="Search"
        />
      </form>

      {/* Results */}
      {query && (
        <div className="space-y-4">
          <p className="text-sm text-slate-500 dark:text-slate-400 font-mono">
            {filteredPosts.length} result{filteredPosts.length !== 1 ? 's' : ''} for "{query}"
          </p>

          {filteredPosts.length === 0 ? (
            <div className="glass-panel p-8 rounded-[20px] text-center space-y-3">
              <p className="text-slate-600 dark:text-slate-300 font-bold">No results found</p>
              <p className="text-slate-500 dark:text-slate-400 text-sm">
                Try different keywords or browse the full blog.
              </p>
              <Link to="/blog" className="btn-fintech-secondary text-sm font-bold py-2 px-5 inline-block">
                Browse All Guides
              </Link>
            </div>
          ) : (
            filteredPosts.map(post => (
              <Link
                key={post.id}
                to={`/blog/${post.slug}`}
                className="glass-panel p-5 rounded-[16px] border border-slate-200/80 dark:border-white/10 hover:border-[#635BFF]/50 transition-all block group"
              >
                <div className="flex items-center gap-2 text-xs font-mono text-slate-500 dark:text-slate-400 mb-2">
                  <span className="px-2 py-0.5 rounded-full bg-[#635BFF]/10 text-[#635BFF] font-bold">
                    {post.category}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" /> {post.readTime} min read
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" /> {post.date}
                  </span>
                </div>
                <h2 className="font-display font-bold text-current group-hover:text-[#635BFF] transition-colors">
                  {post.title}
                </h2>
                <p className="text-slate-500 dark:text-slate-400 text-sm mt-1 line-clamp-2">
                  {post.excerpt}
                </p>
                <div className="flex items-center gap-1 text-[#635BFF] text-xs font-bold mt-3 group-hover:translate-x-1 transition-transform">
                  <span>Read Guide</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </Link>
            ))
          )}
        </div>
      )}

      {!query && (
        <div className="glass-panel p-8 rounded-[20px] text-center space-y-3">
          <p className="text-slate-600 dark:text-slate-300 font-bold">Start typing to search</p>
          <p className="text-slate-500 dark:text-slate-400 text-sm">
            Search across 50+ guides about Telegram media downloading, backup, privacy, and more.
          </p>
        </div>
      )}
    </div>
  )
}