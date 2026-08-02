import React from 'react'
import { Link } from 'react-router-dom'
import SeoMeta from '../components/SeoMeta'
import { Download, Zap, ShieldCheck, Layers, Cpu, Check, ArrowRight, FolderDown, Users, Folder, ServerOff, Search, Filter, ListVideo, HardDrive, Globe, Lock, Sparkles } from 'lucide-react'

export default function FeaturesView() {
  const features = [
    {
      icon: <Download className="w-6 h-6" />,
      title: 'Bulk Media Downloader',
      desc: 'Download hundreds of photos, videos, documents, and audio files from any Telegram channel or group in a single session.',
      color: 'from-[#635BFF]/20 to-purple-500/10',
      border: 'border-[#635BFF]/40'
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: 'Parallel Stream Downloads',
      desc: 'Download up to 8 files simultaneously with parallel MTProto streams for maximum throughput and speed.',
      color: 'from-amber-500/20 to-orange-500/10',
      border: 'border-amber-500/40'
    },
    {
      icon: <ShieldCheck className="w-6 h-6" />,
      title: 'Zero Server Storage',
      desc: 'Files stream directly from Telegram servers to your device. Nothing is stored, cached, or processed on our servers.',
      color: 'from-emerald-500/20 to-teal-500/10',
      border: 'border-emerald-500/40'
    },
    {
      icon: <Layers className="w-6 h-6" />,
      title: 'Category Filtering',
      desc: 'Filter media by type — Photos, Videos, Documents, Music, Voice, Archives, Links, Stickers, and more.',
      color: 'from-pink-500/20 to-rose-500/10',
      border: 'border-pink-500/40'
    },
    {
      icon: <FolderDown className="w-6 h-6" />,
      title: 'Group Folders & Topics',
      desc: 'Full support for Telegram forum topics and group folders. Isolate media from specific topics with precision.',
      color: 'from-indigo-500/20 to-blue-500/10',
      border: 'border-indigo-500/40'
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: 'Channels & Groups',
      desc: 'Download from public channels, private channels you belong to, groups, and personal chats.',
      color: 'from-cyan-500/20 to-sky-500/10',
      border: 'border-cyan-500/40'
    },
    {
      icon: <Folder className="w-6 h-6" />,
      title: 'Original Quality',
      desc: 'Files are downloaded byte-for-byte identical to the original upload. No re-encoding, no compression, no quality loss.',
      color: 'from-violet-500/20 to-purple-500/10',
      border: 'border-violet-500/40'
    },
    {
      icon: <Search className="w-6 h-6" />,
      title: 'Smart Search & Filter',
      desc: 'Search within channels by filename, filter by size and date, and find exactly what you need.',
      color: 'from-teal-500/20 to-emerald-500/10',
      border: 'border-teal-500/40'
    },
    {
      icon: <ListVideo className="w-6 h-6" />,
      title: 'Live Download Queue',
      desc: 'Monitor progress with a live queue, active stream count, speed display, and cancel/resume controls.',
      color: 'from-orange-500/20 to-amber-500/10',
      border: 'border-orange-500/40'
    },
    {
      icon: <HardDrive className="w-6 h-6" />,
      title: 'Local Storage Only',
      desc: 'Your downloads go directly to your browser\'s download folder. Full control over where files are saved.',
      color: 'from-blue-500/20 to-indigo-500/10',
      border: 'border-blue-500/40'
    },
    {
      icon: <Globe className="w-6 h-6" />,
      title: 'Works in Browser',
      desc: 'No installation needed. Works on any device with a modern browser — desktop, laptop, tablet, or phone.',
      color: 'from-green-500/20 to-emerald-500/10',
      border: 'border-green-500/40'
    },
    {
      icon: <Lock className="w-6 h-6" />,
      title: 'Privacy-First Architecture',
      desc: 'Your API credentials stay in your browser\'s local storage. Direct MTProto connections with zero server-side data.',
      color: 'from-red-500/20 to-rose-500/10',
      border: 'border-red-500/40'
    }
  ]

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    'name': 'TG Media Downloader Features',
    'applicationCategory': 'UtilitiesApplication',
    'operatingSystem': 'All',
    'description': 'Explore the features of TG Media Downloader — bulk downloads, parallel streams, zero server storage, category filtering, and more.',
    'offers': { '@type': 'Offer', 'price': '0', 'priceCurrency': 'USD' }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      <SeoMeta
        title="Features — Telegram Bulk Media Downloader"
        description="Explore TG Media Downloader features: bulk downloads, parallel streams, zero server storage, category filtering, forum topics, and privacy-first architecture."
        keywords="telegram downloader features, telegram bulk download features, telegram media downloader capabilities"
        jsonLd={jsonLd}
        breadcrumbs={[
          { name: 'Home', path: '/' },
          { name: 'Features', path: '/features' }
        ]}
      />

      {/* Header */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#635BFF]/10 text-[#635BFF] text-xs font-mono font-bold border border-[#635BFF]/20">
          <Sparkles className="w-4 h-4" />
          <span>FEATURES OVERVIEW</span>
        </div>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-current tracking-tight font-display">
          Everything You Need to Download Telegram Media
        </h1>
        <p className="text-slate-600 dark:text-slate-300 text-base sm:text-lg leading-relaxed">
          TG Media Downloader combines powerful bulk extraction with privacy-first architecture — all in your browser, completely free.
        </p>
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((feature, index) => (
          <div
            key={index}
            className={`glass-panel p-6 rounded-[20px] space-y-4 border-t-4 bg-gradient-to-br ${feature.color} ${feature.border} hover:-translate-y-1 hover:shadow-[0_15px_30px_rgba(99,91,255,0.15)] transition-all duration-300`}
          >
            <div className="w-12 h-12 rounded-xl bg-white/10 dark:bg-white/5 text-[#635BFF] dark:text-indigo-300 flex items-center justify-center border border-white/20">
              {feature.icon}
            </div>
            <h2 className="font-display text-lg font-bold text-current">{feature.title}</h2>
            <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">{feature.desc}</p>
          </div>
        ))}
      </div>

      {/* CTA */}
      <div className="glass-panel p-8 sm:p-12 rounded-[24px] text-center space-y-6 bg-gradient-to-r from-[#635BFF]/20 via-purple-600/15 to-pink-500/10 border border-[#635BFF]/40">
        <h2 className="text-2xl sm:text-3xl font-black text-current tracking-tight font-display">
          Ready to Experience These Features?
        </h2>
        <p className="text-slate-600 dark:text-slate-300 max-w-xl mx-auto">
          Launch the downloader and start saving Telegram media with parallel streams, zero server storage, and original quality.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link to="/downloader" className="btn-fintech-primary font-bold py-3 px-8 flex items-center justify-center gap-2">
            <Download className="w-5 h-5" />
            Launch Downloader
          </Link>
          <Link to="/blog" className="btn-fintech-secondary font-bold py-3 px-7">
            Read the Guides
          </Link>
        </div>
      </div>
    </div>
  )
}