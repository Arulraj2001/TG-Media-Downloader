import React from 'react'
import { Link } from 'react-router-dom'
import SeoMeta from '../components/SeoMeta'
import { 
  Download, Zap, ShieldCheck, Layers, Cpu, Check, ArrowRight,
  Terminal, FileText, Film, Archive, CheckCircle2, Sparkles, FolderDown,
  Users, Folder, MessageSquare, Lock, ServerOff,
  Play, Radio, Activity
} from 'lucide-react'

export default function HomeLandingView() {
  const landingJsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebApplication",
        "name": "TG Media Downloader",
        "applicationCategory": "UtilitiesApplication",
        "operatingSystem": "All",
        "description": "Free Telegram Bulk Media Downloader — Save videos, photos, music, files, forum topics, and group folders directly from public and private Telegram channels at maximum speed.",
        "offers": {
          "@type": "Offer",
          "price": "0",
          "priceCurrency": "USD"
        }
      },
      {
        "@type": "FAQPage",
        "mainEntity": [
          {
            "@type": "Question",
            "name": "How do I bulk download files from Telegram channels and groups?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Log in with your Telegram API ID and Phone Number, select any public/private channel or group folder, pick your media category (Videos, Documents, Music, etc.), select files, and click Download Selected to batch extract them directly to your browser."
            }
          },
          {
            "@type": "Question",
            "name": "Does this tool store or cache my downloaded Telegram media?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "No. TG Media Downloader uses a direct browser local streaming protocol with Zero Server Caching. Media files flow directly from Telegram servers into your local storage."
            }
          }
        ]
      }
    ]
  }

  return (
    <div className="space-y-24 pb-20 overflow-hidden">
      <SeoMeta
        title="Telegram Media Downloader — Bulk Save Channels, Groups, Chats & Folders"
        description="Free Telegram Bulk Media Downloader for channels, groups, folders, and forum topics. Privacy-first zero server caching, clear AdSense compliance, and SEO-friendly original content for search visibility."
        keywords="telegram downloader, telegram media downloader, google adsense eligible telegram downloader, ad-friendly telegram site, bulk telegram downloader, download telegram videos online, telegram channel downloader, telegram group folder downloader, telegram private channel download, telegram forum topic downloader, mtproto web downloader, bulk file extractor"
        jsonLd={landingJsonLd}
      />

      {/* ── HERO SECTION — Dynamic Gradients & Micro-Animations ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 sm:pt-16 relative">
        
        {/* Animated Background Gradients */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-5xl h-[500px] pointer-events-none -z-10">
          <div className="absolute -top-20 -left-20 w-96 h-96 bg-[#635BFF]/25 rounded-full blur-[120px] animate-pulse"></div>
          <div className="absolute top-10 right-0 w-[400px] h-[400px] bg-purple-600/20 rounded-full blur-[130px] animate-pulse" style={{ animationDelay: '1.5s' }}></div>
          <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-pink-500/15 rounded-full blur-[110px]"></div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Hero Copy */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Pulsing Highlight Badge */}
            <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-gradient-to-r from-[#635BFF]/20 via-purple-500/15 to-indigo-500/20 border border-[#635BFF]/40 text-[#635BFF] dark:text-indigo-300 text-xs font-mono font-bold tracking-tight shadow-[0_0_25px_rgba(99,91,255,0.25)]">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#635BFF] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#635BFF]"></span>
              </span>
              <span>ULTIMATE TELEGRAM BULK MEDIA DOWNLOADER · 100% FREE</span>
            </div>

            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-black text-current tracking-tight leading-[1.08]">
              Bulk Download Media from{' '}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#635BFF] via-purple-500 to-pink-500 dark:from-indigo-300 dark:via-purple-300 dark:to-pink-400 animate-gradient">
                Channels, Groups & Folders
              </span>
            </h1>

            <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-2xl leading-relaxed font-normal">
              Batch extract thousands of videos, photos, textbooks, audio files, and ZIP archives directly from Telegram public/private channels, group chats, group folders, and forum topics into your local device.
            </p>

            {/* Call To Actions */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-3">
              <Link
                to="/downloader"
                className="btn-fintech-primary text-base font-bold shadow-[0_0_30px_rgba(99,91,255,0.4)] hover:shadow-[0_0_40px_rgba(99,91,255,0.6)] hover:scale-[1.02] transition-all flex items-center justify-center gap-2 py-3.5 px-8 group"
              >
                <Download className="w-5 h-5 group-hover:animate-bounce" />
                <span>Launch Bulk Downloader</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>

              <Link
                to="/desktop-app"
                className="btn-fintech-secondary text-base font-bold flex items-center justify-center gap-2 py-3.5 px-6 hover:scale-[1.02] transition-all"
              >
                <span>Get Desktop App</span>
              </Link>
            </div>

            {/* Core Terms Highlights Bar */}
            <div className="pt-6 flex flex-wrap items-center gap-6 text-xs sm:text-sm font-mono border-t border-slate-200/80 dark:border-white/10">
              <div className="flex items-center gap-2 font-bold text-emerald-500 bg-emerald-500/10 px-3 py-1.5 rounded-lg border border-emerald-500/20">
                <Sparkles className="w-4 h-4" />
                <span>100% Free Unlimited</span>
              </div>
              <div className="flex items-center gap-2 font-bold text-[#635BFF] bg-[#635BFF]/10 px-3 py-1.5 rounded-lg border border-[#635BFF]/20">
                <FolderDown className="w-4 h-4" />
                <span>Bulk Batch Saver</span>
              </div>
              <div className="flex items-center gap-2 font-bold text-amber-500 bg-amber-500/10 px-3 py-1.5 rounded-lg border border-amber-500/20">
                <ServerOff className="w-4 h-4" />
                <span>Zero Server Storage</span>
              </div>
            </div>
          </div>

          {/* Right Column: Visual Interactive Mockup Card */}
          <div className="lg:col-span-5">
            <div className="glass-panel p-6 rounded-[24px] space-y-4 shadow-[0_20px_50px_rgba(0,0,0,0.3)] border border-slate-200/90 dark:border-white/15 relative overflow-hidden group hover:border-[#635BFF]/50 transition-all duration-500">
              
              {/* Card Header */}
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-white/10 pb-3 font-mono text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-[#FF4B4B]"></div>
                  <div className="w-3 h-3 rounded-full bg-[#FFC700]"></div>
                  <div className="w-3 h-3 rounded-full bg-[#00C48C]"></div>
                  <span className="text-slate-500 dark:text-slate-400 ml-2 font-bold">BULK QUEUE ACTIVE</span>
                </div>
                <div className="flex items-center gap-1 text-[#00C48C] font-bold">
                  <Activity className="w-3.5 h-3.5 animate-pulse" />
                  <span>4 PARALLEL STREAMS</span>
                </div>
              </div>

              {/* Mock items list */}
              <div className="space-y-3 font-mono text-xs">
                <div className="p-3.5 rounded-[12px] glass-card flex items-center justify-between hover:scale-[1.01] transition-transform">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-[#635BFF]/15 text-[#635BFF] flex items-center justify-center">
                      <FileText className="w-4 h-4" />
                    </div>
                    <div className="truncate max-w-[180px]">
                      <p className="font-bold text-current truncate font-sans text-sm">Python_Data_Science.pdf</p>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">14.8 MB • PDF Document</p>
                    </div>
                  </div>
                  <span className="badge-mono bg-[#00C48C]/15 text-[#00C48C] border border-[#00C48C]/30 font-bold px-2.5 py-1 rounded-md">DONE</span>
                </div>

                <div className="p-3.5 rounded-[12px] glass-card flex items-center justify-between border-[#635BFF]/40 bg-gradient-to-r from-[#635BFF]/10 to-purple-500/10 hover:scale-[1.01] transition-transform">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-purple-500/20 text-purple-400 flex items-center justify-center">
                      <Film className="w-4 h-4 animate-pulse" />
                    </div>
                    <div className="truncate max-w-[180px]">
                      <p className="font-bold text-current truncate font-sans text-sm">React_Masterclass_01.mp4</p>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">420 MB • Video</p>
                    </div>
                  </div>
                  <span className="badge-mono bg-[#635BFF]/20 text-[#635BFF] dark:text-indigo-300 border border-[#635BFF]/40 font-bold px-2.5 py-1 rounded-md animate-pulse">DOWNLOADING</span>
                </div>

                <div className="p-3.5 rounded-[12px] glass-card flex items-center justify-between hover:scale-[1.01] transition-transform">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-amber-500/15 text-amber-400 flex items-center justify-center">
                      <Archive className="w-4 h-4" />
                    </div>
                    <div className="truncate max-w-[180px]">
                      <p className="font-bold text-current truncate font-sans text-sm">Dataset_Archive_2026.zip</p>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">95 MB • ZIP Archive</p>
                    </div>
                  </div>
                  <span className="badge-mono bg-[#00C48C]/15 text-[#00C48C] border border-[#00C48C]/30 font-bold px-2.5 py-1 rounded-md">DONE</span>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-200 dark:border-white/10 flex items-center justify-between text-xs font-mono text-slate-500 dark:text-slate-400">
                <span className="flex items-center gap-1.5"><Folder className="w-3.5 h-3.5 text-[#635BFF]" /> @study_library</span>
                <span className="text-[#635BFF] font-bold">BULK BATCH: 24/24</span>
              </div>

            </div>
          </div>

        </div>
      </section>

      {/* ── HIGHLIGHTED BULK FEATURES GRID ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center space-y-3 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#635BFF]/10 text-[#635BFF] text-xs font-mono font-bold border border-[#635BFF]/20">
            <FolderDown className="w-4 h-4 text-[#635BFF]" />
            <span>BULK MEDIA EXTRACTION CAPABILITIES</span>
          </div>
          <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-current tracking-tight">
            Designed for Telegram Bulk Downloader Needs
          </h2>
          <p className="text-slate-600 dark:text-slate-300 text-base">
            Extract everything from large educational channels, group folders, forum sub-topics, and personal chats in a single click.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Card 1: Channel & Group Bulk */}
          <div className="glass-panel p-6 rounded-[20px] space-y-3 border-t-4 border-t-[#635BFF] hover:-translate-y-1 hover:shadow-[0_15px_30px_rgba(99,91,255,0.2)] transition-all duration-300 group">
            <div className="w-12 h-12 rounded-xl bg-[#635BFF]/10 text-[#635BFF] flex items-center justify-center font-bold group-hover:scale-110 transition-transform">
              <Users className="w-6 h-6" />
            </div>
            <h3 className="font-display text-lg font-bold text-current">Channels & Groups</h3>
            <p className="text-slate-600 dark:text-slate-300 text-xs leading-relaxed">
              Fetch files from any public username (<code className="text-[#635BFF] font-bold">@channel</code>) or joined private channels & group chats with ease.
            </p>
          </div>

          {/* Card 2: Group Folders & Topics */}
          <div className="glass-panel p-6 rounded-[20px] space-y-3 border-t-4 border-t-[#00C48C] hover:-translate-y-1 hover:shadow-[0_15px_30px_rgba(0,196,140,0.2)] transition-all duration-300 group">
            <div className="w-12 h-12 rounded-xl bg-[#00C48C]/10 text-[#00C48C] flex items-center justify-center font-bold group-hover:scale-110 transition-transform">
              <Folder className="w-6 h-6" />
            </div>
            <h3 className="font-display text-lg font-bold text-current">Group Folders & Topics</h3>
            <p className="text-slate-600 dark:text-slate-300 text-xs leading-relaxed">
              Full support for Telegram Forum Sub-Topics and Group Folders. Isolate media without pulling unrelated chatter.
            </p>
          </div>

          {/* Card 3: Multi-Thread Speed */}
          <div className="glass-panel p-6 rounded-[20px] space-y-3 border-t-4 border-t-amber-500 hover:-translate-y-1 hover:shadow-[0_15px_30px_rgba(245,158,11,0.2)] transition-all duration-300 group">
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center font-bold group-hover:scale-110 transition-transform">
              <Zap className="w-6 h-6" />
            </div>
            <h3 className="font-display text-lg font-bold text-current">Parallel Batch Streams</h3>
            <p className="text-slate-600 dark:text-slate-300 text-xs leading-relaxed">
              Stream up to 8 files simultaneously for maximum batch throughput, complete with speed meter & cancellation controls.
            </p>
          </div>

          {/* Card 4: Zero Server Storage */}
          <div className="glass-panel p-6 rounded-[20px] space-y-3 border-t-4 border-t-purple-500 hover:-translate-y-1 hover:shadow-[0_15px_30px_rgba(168,85,247,0.2)] transition-all duration-300 group">
            <div className="w-12 h-12 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center font-bold group-hover:scale-110 transition-transform">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="font-display text-lg font-bold text-current">Zero Server Storage</h3>
            <p className="text-slate-600 dark:text-slate-300 text-xs leading-relaxed">
              100% private. Files are streamed directly to your browser's local downloads folder without being saved on any server.
            </p>
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS: 3-STEP MEDIA DOWNLOADING WORKFLOW ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 pt-6">
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#635BFF]/10 text-[#635BFF] text-xs font-mono font-bold">
            <Zap className="w-4 h-4 text-[#635BFF]" />
            <span>HOW IT WORKS - SIMPLE 3-STEP WORKFLOW</span>
          </div>
          <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-current tracking-tight">
            How TG Media Downloader Works
          </h2>
          <p className="text-slate-600 dark:text-slate-300 text-base">
            Follow this simple 3-step workflow to extract and stream Telegram channel files directly to your device.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Step 1 Card */}
          <div className="glass-panel p-8 rounded-[20px] space-y-4 relative border-t-4 border-t-[#635BFF] hover:shadow-lift transition-all">
            <div className="w-12 h-12 rounded-[12px] bg-[#635BFF]/10 text-[#635BFF] flex items-center justify-center font-bold text-xl font-mono shadow-sm">
              01
            </div>
            <h3 className="font-display text-xl font-bold text-current">Connect Telegram Account</h3>
            <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed font-normal">
              Enter your **API ID**, **API Hash**, and **Phone Number with country code** (obtained for free from <code className="text-[#635BFF] font-bold">my.telegram.org</code>). Input the OTP verification code sent to your Telegram app to establish a secure MTProto session.
            </p>
            <div className="pt-2 flex items-center gap-2 text-xs font-mono text-[#00C48C] font-bold">
              <Check className="w-4 h-4" />
              <span>Session Stored Locally in Browser</span>
            </div>
          </div>

          {/* Step 2 Card */}
          <div className="glass-panel p-8 rounded-[20px] space-y-4 relative border-t-4 border-t-[#00C48C] hover:shadow-lift transition-all">
            <div className="w-12 h-12 rounded-[12px] bg-[#00C48C]/10 text-[#00C48C] flex items-center justify-center font-bold text-xl font-mono shadow-sm">
              02
            </div>
            <h3 className="font-display text-xl font-bold text-current">Select Channel, Folder or Topic</h3>
            <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed font-normal">
              Pick from your **pre-fetched joined channels dropdown** or enter any public/private channel link or username (e.g. <code className="text-[#635BFF] font-bold">@study_notes</code>). Select specific **Forum Sub-Topics** or group folders.
            </p>
            <div className="pt-2 flex items-center gap-2 text-xs font-mono text-[#00C48C] font-bold">
              <Check className="w-4 h-4" />
              <span>Supports Channels, Groups & Folders</span>
            </div>
          </div>

          {/* Step 3 Card */}
          <div className="glass-panel p-8 rounded-[20px] space-y-4 relative border-t-4 border-t-[#FFC700] hover:shadow-lift transition-all">
            <div className="w-12 h-12 rounded-[12px] bg-[#FFC700]/10 text-[#FFC700] flex items-center justify-center font-bold text-xl font-mono shadow-sm">
              03
            </div>
            <h3 className="font-display text-xl font-bold text-current">Bulk Download & Save</h3>
            <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed font-normal">
              Browse across **9 Category Tabs** (Documents, Videos, Archives, Music, Voice, Links, GIFs, Chat Logs). Select multiple files or click Select All, and stream files straight to your device.
            </p>
            <div className="pt-2 flex items-center gap-2 text-xs font-mono text-[#00C48C] font-bold">
              <Check className="w-4 h-4" />
              <span>Direct Bulk Batch Download</span>
            </div>
          </div>

        </div>
      </section>

      {/* Metrics Bar */}
      <section className="border-y border-slate-200/80 dark:border-white/10 bg-gradient-to-r from-[#635BFF]/5 via-purple-500/5 to-transparent py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-2 md:grid-cols-4 gap-8 text-center font-mono">
          <div>
            <p className="font-display text-4xl sm:text-5xl font-black bg-clip-text text-transparent bg-gradient-to-r from-[#635BFF] to-purple-500">10M+</p>
            <p className="text-xs text-slate-600 dark:text-slate-400 uppercase font-bold mt-1">Bulk Files Streamed</p>
          </div>
          <div>
            <p className="font-display text-4xl sm:text-5xl font-black bg-clip-text text-transparent bg-gradient-to-r from-[#00C48C] to-emerald-400">100%</p>
            <p className="text-xs text-slate-600 dark:text-slate-400 uppercase font-bold mt-1">Free Unlimited Access</p>
          </div>
          <div>
            <p className="font-display text-4xl sm:text-5xl font-black text-current">0 GB</p>
            <p className="text-xs text-slate-600 dark:text-slate-400 uppercase font-bold mt-1">Server Caching</p>
          </div>
          <div>
            <p className="font-display text-4xl sm:text-5xl font-black bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-pink-500">99.99%</p>
            <p className="text-xs text-slate-600 dark:text-slate-400 uppercase font-bold mt-1">Direct Uptime</p>
          </div>
        </div>
      </section>

      {/* AdSense Compliance Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 pt-8">
        <div className="text-center space-y-3 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#00C48C]/10 text-[#00C48C] text-xs font-mono font-bold border border-[#00C48C]/20">
            <ShieldCheck className="w-4 h-4" />
            <span>GOOGLE ADSENSE READY WEBSITE STRUCTURE</span>
          </div>
          <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-current tracking-tight">
            Built for Search Visibility and AdSense Compliance
          </h2>
          <p className="text-slate-600 dark:text-slate-300 text-base">
            Original blog content, clear privacy and legal pages, visible contact links, and strong page metadata help this site satisfy Google Publisher and search optimization standards.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="glass-panel p-6 rounded-[20px] border border-slate-200/90 dark:border-white/10 shadow-sm">
            <h3 className="font-display text-xl font-bold text-current">Unique Content Pages</h3>
            <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
              The site includes an original homepage, about page, blog engine, privacy policy, and contact page for strong AdSense readiness.
            </p>
          </div>
          <div className="glass-panel p-6 rounded-[20px] border border-slate-200/90 dark:border-white/10 shadow-sm">
            <h3 className="font-display text-xl font-bold text-current">Clear Policy & Contact Links</h3>
            <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
              Visible links to Privacy Policy, Terms of Service, and Contact ensure trust signals for both AdSense review and organic search engines.
            </p>
          </div>
          <div className="glass-panel p-6 rounded-[20px] border border-slate-200/90 dark:border-white/10 shadow-sm">
            <h3 className="font-display text-xl font-bold text-current">Original SEO-Rich Copy</h3>
            <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
              Page titles, descriptions, keywords, and visible headings are optimized to rank for telegram downloader, telegram bulk media, and related search terms.
            </p>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 pt-8">
        <div className="text-center space-y-2">
          <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-current tracking-tight">Frequently Asked Questions</h2>
          <p className="text-slate-600 dark:text-slate-400 text-base">Everything you need to know about Telegram bulk media downloading.</p>
        </div>

        <div className="space-y-4">
          <div className="glass-panel p-6 rounded-[16px] space-y-2 hover:border-[#635BFF]/40 transition-colors">
            <h3 className="font-display font-bold text-current text-lg">Can I bulk download files from Telegram channels and groups?</h3>
            <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
              Yes! You can fetch and bulk download hundreds of videos, documents, music files, or archives at once from any Telegram channel, group, group folder, or forum sub-topic.
            </p>
          </div>

          <div className="glass-panel p-6 rounded-[16px] space-y-2 hover:border-[#635BFF]/40 transition-colors">
            <h3 className="font-display font-bold text-current text-lg">How do I get my Telegram API ID and API Hash?</h3>
            <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
              Log in to <code className="text-[#635BFF] font-bold">my.telegram.org</code> using your phone number, click on 'API Development Tools', create an application, and copy your API ID and API Hash into the downloader tool.
            </p>
          </div>

          <div className="glass-panel p-6 rounded-[16px] space-y-2 hover:border-[#635BFF]/40 transition-colors">
            <h3 className="font-display font-bold text-current text-lg">How does direct browser bulk downloading work?</h3>
            <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
              Files are streamed directly from Telegram servers into your browser's local downloads folder. We do not store or cache your files on any server.
            </p>
          </div>
        </div>
      </section>

      {/* Bottom CTA Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="glass-panel p-8 sm:p-16 rounded-[30px] text-center space-y-6 bg-gradient-to-r from-[#635BFF]/20 via-purple-600/15 to-pink-500/10 border border-[#635BFF]/40 shadow-[0_20px_60px_rgba(99,91,255,0.25)] relative overflow-hidden">
          
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#635BFF]/20 rounded-full blur-3xl pointer-events-none"></div>

          <h2 className="font-display text-3xl sm:text-5xl font-black text-current tracking-tight relative z-10">
            Ready to Bulk Download Telegram Media?
          </h2>
          <p className="text-slate-600 dark:text-slate-300 text-lg max-w-xl mx-auto relative z-10">
            100% free unlimited bulk downloading for channels, groups, chats, folders, and forum topics.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4 pt-2 relative z-10">
            <Link to="/downloader" className="btn-fintech-primary text-base font-bold shadow-[0_0_30px_rgba(99,91,255,0.4)] hover:shadow-[0_0_40px_rgba(99,91,255,0.6)] py-3.5 px-8 flex items-center justify-center gap-2 hover:scale-[1.02] transition-all">
              <Download className="w-5 h-5" />
              <span>Launch Bulk Downloader</span>
            </Link>
            <Link to="/desktop-app" className="btn-fintech-secondary text-base font-bold py-3.5 px-7 hover:scale-[1.02] transition-all">
              Desktop Version
            </Link>
          </div>
        </div>
      </section>

    </div>
  )
}
