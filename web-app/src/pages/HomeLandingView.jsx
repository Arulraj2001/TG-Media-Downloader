import React from 'react'
import { Link } from 'react-router-dom'
import SeoMeta from '../components/SeoMeta'
import { 
  Download, Terminal, ShieldCheck, Zap, Layers, FolderDown, 
  ArrowRight, CheckCircle2, Film, FileText, Music, Archive, 
  Globe, Sparkles, Cpu, Lock, HelpCircle, Key, Phone, Search, ArrowDownRight, Check
} from 'lucide-react'

export default function HomeLandingView() {
  // Schema.org Structured Data for Google Rich Snippets
  const landingJsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "SoftwareApplication",
        "name": "TG Media Downloader",
        "operatingSystem": "Web, Windows, macOS, Linux",
        "applicationCategory": "UtilitiesApplication",
        "offers": {
          "@type": "Offer",
          "price": "0",
          "priceCurrency": "USD"
        },
        "aggregateRating": {
          "@type": "AggregateRating",
          "ratingValue": "4.9",
          "ratingCount": "1250"
        }
      },
      {
        "@type": "HowTo",
        "name": "How to Download Telegram Channel Media Files in Bulk",
        "description": "Step-by-step guide to connecting your Telegram account API credentials, choosing channels or sub-forum topics, filtering files by category, and streaming direct browser downloads.",
        "step": [
          {
            "@type": "HowToStep",
            "name": "Connect Telegram API Credentials",
            "text": "Get your API ID and API Hash from my.telegram.org and enter your phone number to authorize via MTProto login code."
          },
          {
            "@type": "HowToStep",
            "name": "Select Channel or Sub-Forum Topic",
            "text": "Pick from your joined channels dropdown or enter any public/private Telegram channel link or @username."
          },
          {
            "@type": "HowToStep",
            "name": "Filter & Stream Local Downloads",
            "text": "Filter files across 9 category tabs (Documents, Videos, Archives, Music, etc.), apply regex and size filters, and stream directly into your browser."
          }
        ]
      },
      {
        "@type": "FAQPage",
        "mainEntity": [
          {
            "@type": "Question",
            "name": "How do I get my Telegram API ID and API Hash?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Log in to my.telegram.org using your phone number, click on 'API Development Tools', create an application, and copy your API ID and API Hash."
            }
          },
          {
            "@type": "Question",
            "name": "Does TG Media Downloader store my Telegram files on a server?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "No. All media downloads are streamed directly from Telegram MTProto servers straight to your browser's local downloads folder with zero server caching."
            }
          }
        ]
      }
    ]
  }

  return (
    <div className="space-y-20 pb-16">
      <SeoMeta
        title="TG Media Downloader - Fast, Bulk & Direct Telegram Downloader"
        description="Stream and download videos, documents, music, zip archives, and forum topics directly from Telegram channels into your browser with zero server caching."
        jsonLd={landingJsonLd}
      />

      {/* Hero Section - Split Screen */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 sm:pt-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Hero Text & CTAs */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-[6px] bg-[#635BFF]/10 border border-[#635BFF]/30 text-[#635BFF] text-xs font-mono font-bold tracking-tight">
              <Terminal className="w-4 h-4 text-[#635BFF]" />
              <span>DIRECT LOCAL STREAMING MTPROTO ENGINE</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-current tracking-tight leading-[1.1]">
              The Modern Media Downloader for Telegram
            </h1>

            <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-2xl leading-relaxed">
              Batch extract videos, PDF textbooks, music, ZIP archives, and forum sub-topics directly into your browser's local downloads directory. No server file caching. Zero privacy compromises.
            </p>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2">
              <Link
                to="/downloader"
                className="btn-fintech-primary text-base font-semibold shadow-lift flex items-center justify-center gap-2"
              >
                <span>Launch Downloader Tool</span>
                <ArrowRight className="w-5 h-5" />
              </Link>

              <Link
                to="/pricing"
                className="btn-fintech-secondary text-base font-semibold flex items-center justify-center gap-2"
              >
                <span>View Pro Passes</span>
              </Link>
            </div>

            {/* Micro Highlights */}
            <div className="pt-4 flex flex-wrap items-center gap-6 text-xs sm:text-sm font-mono text-slate-500 dark:text-slate-400 border-t border-[#CBD5E1] dark:border-white/10">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#00C48C]" />
                <span>Zero Server Storage</span>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-[#FFC700]" />
                <span>Max Speed Stream</span>
              </div>
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-[#635BFF]" />
                <span>9 Media Categories</span>
              </div>
            </div>
          </div>

          {/* Right Column: Visual Interactive Mockup Card */}
          <div className="lg:col-span-5">
            <div className="glass-panel p-6 rounded-[12px] space-y-4 shadow-lift border border-[#CBD5E1] dark:border-white/15">
              
              <div className="flex items-center justify-between border-b border-[#CBD5E1] dark:border-white/10 pb-3 font-mono text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-[#FF4B4B]"></div>
                  <div className="w-3 h-3 rounded-full bg-[#FFC700]"></div>
                  <div className="w-3 h-3 rounded-full bg-[#00C48C]"></div>
                  <span className="text-slate-500 dark:text-slate-400 ml-2 font-bold">LIVE API STREAM</span>
                </div>
                <span className="text-[#00C48C] font-bold">2.4 MB/s</span>
              </div>

              {/* Mock items list */}
              <div className="space-y-2.5 font-mono text-xs">
                <div className="p-3 rounded-[6px] glass-card flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <FileText className="w-4 h-4 text-[#635BFF]" />
                    <div className="truncate max-w-[180px]">
                      <p className="font-bold text-current truncate">Python_Data_Science.pdf</p>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">14.8 MB • PDF</p>
                    </div>
                  </div>
                  <span className="badge-mono bg-[#00C48C]/10 text-[#00C48C] border border-[#00C48C]/30">READY</span>
                </div>

                <div className="p-3 rounded-[6px] glass-card flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Film className="w-4 h-4 text-purple-500" />
                    <div className="truncate max-w-[180px]">
                      <p className="font-bold text-current truncate">React_Masterclass_01.mp4</p>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">420 MB • Video</p>
                    </div>
                  </div>
                  <span className="badge-mono bg-[#635BFF]/10 text-[#635BFF] border border-[#635BFF]/30">STREAMING</span>
                </div>

                <div className="p-3 rounded-[6px] glass-card flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Archive className="w-4 h-4 text-amber-500" />
                    <div className="truncate max-w-[180px]">
                      <p className="font-bold text-current truncate">Dataset_Archive_2026.zip</p>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">95 MB • Archive</p>
                    </div>
                  </div>
                  <span className="badge-mono bg-[#00C48C]/10 text-[#00C48C] border border-[#00C48C]/30">READY</span>
                </div>
              </div>

              <div className="pt-3 border-t border-[#CBD5E1] dark:border-white/10 flex items-center justify-between text-xs font-mono text-slate-500 dark:text-slate-400">
                <span>CHANNEL: @study_library</span>
                <span className="text-[#635BFF] font-bold">100% SUCCESS</span>
              </div>

            </div>
          </div>

        </div>
      </section>

      {/* ── HOW IT WORKS: 3-STEP MEDIA DOWNLOADING WORKFLOW (Detailed & Clear) ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 pt-6">
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-[6px] bg-[#635BFF]/10 text-[#635BFF] text-xs font-mono font-bold">
            <Zap className="w-4 h-4" />
            <span>HOW IT WORKS - SIMPLE 3-STEP WORKFLOW</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-current tracking-tight">
            How TG Media Downloader Works
          </h2>
          <p className="text-slate-600 dark:text-slate-300 text-base">
            Follow this simple 3-step workflow to extract and stream Telegram channel files directly to your device.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Step 1 Card */}
          <div className="glass-panel p-8 rounded-[12px] space-y-4 relative border-t-4 border-t-[#635BFF]">
            <div className="w-12 h-12 rounded-[8px] bg-[#635BFF]/10 text-[#635BFF] flex items-center justify-center font-bold text-xl font-mono">
              01
            </div>
            <h3 className="text-xl font-bold text-current">Connect Telegram Account</h3>
            <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
              Enter your **API ID**, **API Hash**, and **Phone Number with country code** (obtained for free from <code className="text-[#635BFF]">my.telegram.org</code>). Input the OTP verification code sent to your Telegram app to establish a secure MTProto session.
            </p>
            <div className="pt-2 flex items-center gap-2 text-xs font-mono text-[#00C48C] font-bold">
              <Check className="w-4 h-4" />
              <span>Session Stored Locally in Browser</span>
            </div>
          </div>

          {/* Step 2 Card */}
          <div className="glass-panel p-8 rounded-[12px] space-y-4 relative border-t-4 border-t-[#00C48C]">
            <div className="w-12 h-12 rounded-[8px] bg-[#00C48C]/10 text-[#00C48C] flex items-center justify-center font-bold text-xl font-mono">
              02
            </div>
            <h3 className="text-xl font-bold text-current">Select Channel & Sub-Topic</h3>
            <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
              Pick from your **pre-fetched joined channels dropdown** or enter any public/private channel link or username (e.g. <code className="text-[#635BFF]">@study_notes</code>). Select specific **Forum Sub-Topics** to isolate sub-channels.
            </p>
            <div className="pt-2 flex items-center gap-2 text-xs font-mono text-[#00C48C] font-bold">
              <Check className="w-4 h-4" />
              <span>Supports Channels, Groups & Topics</span>
            </div>
          </div>

          {/* Step 3 Card */}
          <div className="glass-panel p-8 rounded-[12px] space-y-4 relative border-t-4 border-t-[#FFC700]">
            <div className="w-12 h-12 rounded-[8px] bg-[#FFC700]/10 text-[#FFC700] flex items-center justify-center font-bold text-xl font-mono">
              03
            </div>
            <h3 className="text-xl font-bold text-current">Filter, Sort & Download</h3>
            <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
              Browse across **9 Category Tabs** (Documents, Videos, Archives, Music, Voice, Links, GIFs, Chat Logs). Filter by date range, size (MB), or **regex patterns**, sort in ascending/descending order, and stream files straight to your device.
            </p>
            <div className="pt-2 flex items-center gap-2 text-xs font-mono text-[#00C48C] font-bold">
              <Check className="w-4 h-4" />
              <span>Direct Local Streaming Engine</span>
            </div>
          </div>

        </div>
      </section>

      {/* Metrics Bar */}
      <section className="border-y border-[#CBD5E1] dark:border-white/10 bg-slate-200/50 dark:bg-white/[0.02] py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-2 md:grid-cols-4 gap-8 text-center font-mono">
          <div>
            <p className="text-3xl font-extrabold text-[#635BFF]">10M+</p>
            <p className="text-xs text-slate-600 dark:text-slate-400 uppercase font-semibold mt-1">Files Streamed</p>
          </div>
          <div>
            <p className="text-3xl font-extrabold text-[#00C48C]">9</p>
            <p className="text-xs text-slate-600 dark:text-slate-400 uppercase font-semibold mt-1">Media Categories</p>
          </div>
          <div>
            <p className="text-3xl font-extrabold text-current">0 GB</p>
            <p className="text-xs text-slate-600 dark:text-slate-400 uppercase font-semibold mt-1">Server Caching</p>
          </div>
          <div>
            <p className="text-3xl font-extrabold text-[#635BFF]">99.99%</p>
            <p className="text-xs text-slate-600 dark:text-slate-400 uppercase font-semibold mt-1">Direct Uptime</p>
          </div>
        </div>
      </section>

      {/* Feature Zig-Zag Rows */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-24">
        
        {/* Row 1: 9 Category Media Filtering */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-[6px] bg-[#635BFF]/10 text-[#635BFF] text-xs font-mono font-bold">
              <Layers className="w-3.5 h-3.5" />
              <span>CATEGORIZED FILTERS</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-current tracking-tight">
              9 Specialized Media Filter Tabs
            </h2>
            <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
              Isolate exact media files in seconds. Automatically filter Telegram channel feeds into **Media (Videos & Photos)**, **Documents (PDFs & Office files)**, **Archives (ZIP & 7Z)**, **Music**, **Voice Notes**, **Links**, **GIFs**, and **Chat Logs**.
            </p>
            <ul className="space-y-2.5 text-sm text-slate-600 dark:text-slate-300 font-medium pt-2">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#00C48C]" />
                <span>Filter by Minimum and Maximum MB thresholds</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#00C48C]" />
                <span>Ascending and Descending Live Sorting (Date, Size, Name)</span>
              </li>
            </ul>
          </div>

          <div className="lg:col-span-6">
            <div className="glass-panel p-6 rounded-[12px] space-y-3 font-mono text-xs">
              <p className="text-slate-500 dark:text-slate-400 font-bold border-b border-[#CBD5E1] dark:border-white/10 pb-2">CATEGORY TAB SELECTOR</p>
              <div className="grid grid-cols-3 gap-2">
                {['All Files', 'Media', 'Documents', 'Archives', 'Music', 'Voice Notes', 'Links', 'GIFs', 'Chat Logs'].map((cat, i) => (
                  <div key={i} className="p-2.5 rounded-[6px] glass-card text-center text-[11px] font-bold text-[#635BFF]">
                    {cat}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Row 2: Forum Topics Isolation */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 lg:order-2 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-[6px] bg-[#00C48C]/10 text-[#00C48C] text-xs font-mono font-bold">
              <Cpu className="w-3.5 h-3.5" />
              <span>FORUM TOPICS EXTRACTOR</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-current tracking-tight">
              Extract Specific Telegram Forum Topics
            </h2>
            <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
              Large communities organize discussions into sub-topics. Our dedicated Forum Topic Picker allows you to isolate and download media from specific sub-channels without fetching unrelated channel noise.
            </p>
          </div>

          <div className="lg:col-span-6 lg:order-1">
            <div className="glass-panel p-6 rounded-[12px] space-y-3 font-mono text-xs">
              <p className="text-slate-500 dark:text-slate-400 font-bold border-b border-[#CBD5E1] dark:border-white/10 pb-2">TOPIC SELECTOR API</p>
              <div className="space-y-2">
                <div className="p-3 rounded-[6px] glass-card flex justify-between items-center">
                  <span>Topic #1: PDF Textbooks</span>
                  <span className="badge-mono bg-[#00C48C]/10 text-[#00C48C]">SELECTED</span>
                </div>
                <div className="p-3 rounded-[6px] glass-card flex justify-between items-center opacity-60">
                  <span>Topic #2: Video Courses</span>
                  <span>142 Files</span>
                </div>
              </div>
            </div>
          </div>
        </div>

      </section>

      {/* FAQ Section */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 pt-8">
        <div className="text-center space-y-2">
          <h2 className="text-2xl sm:text-3xl font-bold text-current">Frequently Asked Questions</h2>
          <p className="text-slate-600 dark:text-slate-400 text-sm">Everything you need to know about Telegram media downloading.</p>
        </div>

        <div className="space-y-4">
          <div className="glass-panel p-6 rounded-[12px] space-y-2">
            <h3 className="font-bold text-current text-base">How do I get my Telegram API ID and API Hash?</h3>
            <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
              Log in to <code className="text-[#635BFF]">my.telegram.org</code> using your phone number, click on 'API Development Tools', create an application, and copy your API ID and API Hash into the downloader tool.
            </p>
          </div>

          <div className="glass-panel p-6 rounded-[12px] space-y-2">
            <h3 className="font-bold text-current text-base">How does direct browser downloading work?</h3>
            <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
              Files are streamed directly from Telegram servers into your browser's local downloads folder. We do not store or cache your files on our server.
            </p>
          </div>

          <div className="glass-panel p-6 rounded-[12px] space-y-2">
            <h3 className="font-bold text-current text-base">What payment options do you accept for Pro passes?</h3>
            <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
              We accept QR Code / UPI, PayPal, Bank Transfer, and Crypto Wallets with 1-click admin verification. You can also toggle currencies between USD ($), INR (₹), EUR (€), and GBP (£).
            </p>
          </div>
        </div>
      </section>

      {/* Bottom CTA Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="glass-panel p-8 sm:p-12 rounded-[18px] text-center space-y-6 bg-gradient-to-r from-[#635BFF]/10 via-[#635BFF]/5 to-transparent border border-[#635BFF]/30">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-current tracking-tight">
            Ready to Start Extracting Media?
          </h2>
          <p className="text-slate-600 dark:text-slate-300 text-base max-w-xl mx-auto">
            Try 5 free fetches right now or get a 3, 6, or 12-month pass for unlimited downloads.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link to="/downloader" className="btn-fintech-primary text-base font-semibold">
              Launch Downloader Now
            </Link>
            <Link to="/pricing" className="btn-fintech-secondary text-base font-semibold">
              View Pricing Passes
            </Link>
          </div>
        </div>
      </section>

    </div>
  )
}
