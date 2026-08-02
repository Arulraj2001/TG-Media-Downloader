import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import SeoMeta from '../components/SeoMeta'
import { BookOpen, Download, Key, FolderDown, ShieldCheck, Search, ChevronRight, Terminal, FileText, Film, Music, Archive, Users, Folder, Zap } from 'lucide-react'

const DOC_SECTIONS = [
  {
    id: 'getting-started',
    title: 'Getting Started',
    icon: <Terminal className="w-5 h-5" />,
    items: [
      { title: 'What is TG Media Downloader?', desc: 'Overview of the tool and its capabilities.' },
      { title: 'System Requirements', desc: 'Browser, internet, and Telegram account requirements.' },
      { title: 'Quick Start Guide', desc: 'Download your first media in under 5 minutes.' }
    ]
  },
  {
    id: 'api-setup',
    title: 'API Setup',
    icon: <Key className="w-5 h-5" />,
    items: [
      { title: 'Create Telegram API ID & Hash', desc: 'Step-by-step guide to my.telegram.org.' },
      { title: 'Connect Your Account', desc: 'Enter credentials and verify with OTP.' },
      { title: 'Security Best Practices', desc: 'Keep your API credentials safe.' }
    ]
  },
  {
    id: 'downloading',
    title: 'Downloading Media',
    icon: <Download className="w-5 h-5" />,
    items: [
      { title: 'Download from Channels', desc: 'Public and private channel downloads.' },
      { title: 'Download from Groups', desc: 'Group media extraction and filtering.' },
      { title: 'Forum Topics & Folders', desc: 'Topic-specific downloads.' },
      { title: 'Category Filtering', desc: 'Photos, videos, documents, audio, and more.' }
    ]
  },
  {
    id: 'features',
    title: 'Features Guide',
    icon: <Zap className="w-5 h-5" />,
    items: [
      { title: 'Parallel Stream Downloads', desc: 'Download multiple files simultaneously.' },
      { title: 'Live Download Queue', desc: 'Monitor progress and manage downloads.' },
      { title: 'Search & Filter', desc: 'Find specific files within channels.' },
      { title: 'Original Quality Preservation', desc: 'Byte-for-byte file downloads.' }
    ]
  },
  {
    id: 'privacy',
    title: 'Privacy & Security',
    icon: <ShieldCheck className="w-5 h-5" />,
    items: [
      { title: 'Zero Server Storage', desc: 'Files never touch our servers.' },
      { title: 'Local Credential Storage', desc: 'API keys stay in your browser.' },
      { title: 'Direct MTProto Connections', desc: 'Same encryption as official clients.' },
      { title: 'Safe Download Practices', desc: 'Protect yourself from malicious files.' }
    ]
  },
  {
    id: 'troubleshooting',
    title: 'Troubleshooting',
    icon: <Search className="w-5 h-5" />,
    items: [
      { title: 'Downloads Not Working', desc: 'Fix stuck, failed, or slow downloads.' },
      { title: 'Login Issues', desc: 'OTP, verification, and access problems.' },
      { title: 'Media Not Saving', desc: 'Fix photo and video export issues.' },
      { title: 'Storage Full', desc: 'Free up space on Android and iOS.' }
    ]
  }
]

export default function DocsView() {
  const [activeSection, setActiveSection] = useState('getting-started')

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    'name': 'TG Media Downloader Documentation',
    'description': 'Complete documentation for TG Media Downloader — setup, API credentials, downloading media, features, privacy, and troubleshooting.'
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <SeoMeta
        title="Documentation — Telegram Media Downloader Guide"
        description="Complete documentation for TG Media Downloader — setup, API credentials, downloading media, features, privacy, and troubleshooting guides."
        keywords="telegram downloader documentation, telegram media downloader guide, telegram download help docs"
        jsonLd={jsonLd}
        breadcrumbs={[
          { name: 'Home', path: '/' },
          { name: 'Documentation', path: '/docs' }
        ]}
      />

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar */}
        <aside className="lg:col-span-1 space-y-2">
          <div className="flex items-center gap-2 px-3 py-2 text-[#635BFF] font-mono text-xs font-bold uppercase tracking-wider">
            <BookOpen className="w-4 h-4" />
            Documentation
          </div>
          {DOC_SECTIONS.map(section => (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-[12px] text-left text-sm font-bold transition-all ${
                activeSection === section.id
                  ? 'bg-[#635BFF]/10 text-[#635BFF] border border-[#635BFF]/30'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200/50 dark:hover:bg-white/5 border border-transparent'
              }`}
            >
              {section.icon}
              <span>{section.title}</span>
              <ChevronRight className="w-4 h-4 ml-auto" />
            </button>
          ))}
        </aside>

        {/* Content */}
        <main className="lg:col-span-3 space-y-6">
          {DOC_SECTIONS.filter(s => s.id === activeSection).map(section => (
            <div key={section.id} className="space-y-6">
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#635BFF]/10 text-[#635BFF] flex items-center justify-center">
                    {section.icon}
                  </div>
                  <h1 className="text-2xl sm:text-3xl font-black text-current font-display">{section.title}</h1>
                </div>
                <p className="text-slate-600 dark:text-slate-300 text-sm">
                  Documentation for {section.title.toLowerCase()} in TG Media Downloader.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {section.items.map((item, index) => (
                  <div key={index} className="glass-panel p-5 rounded-[16px] border border-slate-200/80 dark:border-white/10 hover:border-[#635BFF]/40 transition-all">
                    <h2 className="font-display font-bold text-current text-sm mb-1">{item.title}</h2>
                    <p className="text-slate-500 dark:text-slate-400 text-xs leading-relaxed">{item.desc}</p>
                  </div>
                ))}
              </div>

              <div className="glass-panel p-6 rounded-[16px] bg-gradient-to-r from-[#635BFF]/10 to-purple-500/5 border border-[#635BFF]/30">
                <h2 className="font-display font-bold text-current mb-2">Need More Help?</h2>
                <p className="text-slate-600 dark:text-slate-300 text-sm mb-4">
                  Check our detailed blog guides or contact support for personalized assistance.
                </p>
                <div className="flex flex-wrap gap-3">
                  <Link to="/blog" className="btn-fintech-primary text-xs font-bold py-2 px-5">Read Blog Guides</Link>
                  <Link to="/faq" className="btn-fintech-secondary text-xs font-bold py-2 px-5">View FAQ</Link>
                  <Link to="/contact" className="btn-fintech-secondary text-xs font-bold py-2 px-5">Contact Support</Link>
                </div>
              </div>
            </div>
          ))}
        </main>
      </div>
    </div>
  )
}