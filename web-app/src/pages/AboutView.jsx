import React from 'react'
import SeoMeta from '../components/SeoMeta'
import { ShieldCheck, Cpu, Terminal, Zap, Globe, Layers, Lock, CheckCircle2 } from 'lucide-react'

export default function AboutView() {
  const aboutJsonLd = {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    "name": "About TG Media Downloader - Technology & Architecture",
    "description": "Learn about TG Media Downloader's zero-server storage architecture, MTProto streaming engine, and private local media extraction protocol."
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 space-y-10">
      <SeoMeta
        title="About Us & Technology Architecture — TG Media Downloader"
        description="Learn about TG Media Downloader's zero-server storage architecture, direct MTProto browser streaming engine, and private local media extraction protocol."
        keywords="about tg media downloader, mtproto browser downloader technology, telegram zero server storage downloader, privacy first telegram downloader"
        jsonLd={aboutJsonLd}
      />

      {/* Header */}
      <div className="space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-[6px] bg-[#635BFF]/10 border border-[#635BFF]/30 text-[#635BFF] text-xs font-mono font-bold">
          <Terminal className="w-4 h-4" />
          <span>TECHNOLOGY ARCHITECTURE & ABOUT US</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          About TG Media Downloader
        </h1>
        <p className="text-slate-600 dark:text-slate-300 text-base max-w-2xl">
          A client-side MTProto media extraction platform built for privacy, high-speed bulk downloading, and zero server file caching.
        </p>
      </div>

      {/* Technical Architecture Specs */}
      <div className="glass-panel p-8 rounded-[12px] space-y-6">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Cpu className="w-5 h-5 text-[#635BFF]" />
          <span>1. Direct Browser Local Streaming Engine</span>
        </h2>
        <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
          Traditional media downloaders require cloud servers to fetch files, compress them into ZIP archives, and store them temporarily on disk before sending a download link to the user. This creates privacy risks, bandwidth bottlenecks, and server costs.
        </p>
        <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
          **TG Media Downloader operates on a Direct Browser Streaming Architecture**. When you initiate a download request, your web browser connects directly to Telegram's official MTProto network endpoints using your authorized API credentials. File chunks stream progressively straight into your browser's local downloads directory without passing through or getting cached on any intermediate third-party servers.
        </p>
      </div>

      {/* Privacy & Zero Server Caching */}
      <div className="glass-panel p-8 rounded-[12px] space-y-6">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-[#00C48C]" />
          <span>2. Zero Server Caching & Local Session Storage</span>
        </h2>
        <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
          Privacy is the foundational design principle of TG Media Downloader. Your Telegram account API ID, API Hash, phone number, and MTProto session keys are saved exclusively in your web browser's encrypted local storage (`localStorage`).
        </p>
        <ul className="space-y-3 text-sm text-slate-600 dark:text-slate-300 font-medium">
          <li className="flex items-start gap-2.5">
            <CheckCircle2 className="w-5 h-5 text-[#00C48C] shrink-0 mt-0.5" />
            <span>**No Media Server Storage**: 0 GB of user files, photos, videos, or documents are stored on our servers.</span>
          </li>
          <li className="flex items-start gap-2.5">
            <CheckCircle2 className="w-5 h-5 text-[#00C48C] shrink-0 mt-0.5" />
            <span>**Client-side Encryption**: Your MTProto session authorization key stays inside your browser.</span>
          </li>
          <li className="flex items-start gap-2.5">
            <CheckCircle2 className="w-5 h-5 text-[#00C48C] shrink-0 mt-0.5" />
            <span>**Google AdSense Compliance**: Our web application fully complies with Google Publisher Policies, privacy guidelines, and AdSense content standards.</span>
          </li>
        </ul>
      </div>

      {/* Supported Features Comparison Table */}
      <div className="glass-panel p-8 rounded-[12px] space-y-6">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">
          3. Core Technical Capabilities
        </h2>
        
        <div className="overflow-x-auto font-mono text-xs">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#CBD5E1] dark:border-white/10 text-[#635BFF]">
                <th className="py-3 px-4 uppercase font-bold">Feature</th>
                <th className="py-3 px-4 uppercase font-bold">TG Media Downloader</th>
                <th className="py-3 px-4 uppercase font-bold">Traditional Web Downloaders</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#CBD5E1] dark:divide-white/10 text-slate-700 dark:text-slate-300">
              <tr>
                <td className="py-3 px-4 font-bold">Server File Caching</td>
                <td className="py-3 px-4 text-[#00C48C] font-bold">0 GB (Zero Caching)</td>
                <td className="py-3 px-4 text-[#FF4B4B]">Requires Temporary Server Storage</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-bold">Category Filtering</td>
                <td className="py-3 px-4 text-[#00C48C] font-bold">9 Tabs (Videos, PDFs, ZIPs, Music, etc.)</td>
                <td className="py-3 px-4 text-slate-500">Unfiltered Single File List</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-bold">Forum Topics Isolation</td>
                <td className="py-3 px-4 text-[#00C48C] font-bold">Supported (Sub-channel Topic Picker)</td>
                <td className="py-3 px-4 text-[#FF4B4B]">Not Supported</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-bold">Download Speed</td>
                <td className="py-3 px-4 text-[#00C48C] font-bold">Max Network Connection Speed</td>
                <td className="py-3 px-4 text-slate-500">Throttled Cloud Server Bandwidth</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

    </div>
  )
}
