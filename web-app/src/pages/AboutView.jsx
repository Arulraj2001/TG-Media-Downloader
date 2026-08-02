import React from 'react'
import { Link } from 'react-router-dom'
import SeoMeta from '../components/SeoMeta'
import { ShieldCheck, Users, Target, Heart, Zap, Lock, Globe, Sparkles, ArrowRight } from 'lucide-react'

export default function AboutView() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    'name': 'TG Media Downloader',
    'url': 'https://tg-media-bulk-downloader.netlify.app',
    'logo': 'https://tg-media-bulk-downloader.netlify.app/logo.png',
    'description': 'TG Media Downloader is a free web-based tool for bulk downloading media from Telegram channels, groups, and chats with zero server storage.',
    'foundingDate': '2024',
    'sameAs': ['https://github.com/Arulraj2001/TG-Media-Downloader']
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      <SeoMeta
        title="About Us — TG Media Downloader"
        description="Learn about TG Media Downloader — our mission, privacy-first architecture, and commitment to providing a free, secure Telegram media downloader."
        keywords="about tg media downloader, telegram downloader team, telegram media downloader about"
        jsonLd={jsonLd}
        breadcrumbs={[
          { name: 'Home', path: '/' },
          { name: 'About', path: '/about' }
        ]}
      />

      {/* Header */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#635BFF]/10 text-[#635BFF] text-xs font-mono font-bold border border-[#635BFF]/20">
          <Sparkles className="w-4 h-4" />
          <span>ABOUT US</span>
        </div>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-current tracking-tight font-display">
          Building the Best Free Telegram Media Downloader
        </h1>
        <p className="text-slate-600 dark:text-slate-300 text-base sm:text-lg leading-relaxed max-w-2xl mx-auto">
          TG Media Downloader was created to solve a simple problem: downloading media from Telegram should be fast, free, and private.
        </p>
      </div>

      {/* Mission */}
      <section className="glass-panel p-8 rounded-[24px] border border-slate-200/80 dark:border-white/10 space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#635BFF]/10 text-[#635BFF] flex items-center justify-center">
            <Target className="w-5 h-5" />
          </div>
          <h2 className="text-xl font-black text-current font-display">Our Mission</h2>
        </div>
        <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
          Our mission is to provide a <strong>free, unlimited, and privacy-first</strong> way for users to download and archive their Telegram media. We believe that users should have full control over their data — including the ability to save, organize, and back up the content they have access to.
        </p>
        <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
          We built TG Media Downloader with a <strong>zero server storage</strong> architecture because we believe your files belong to you — not to a third-party download service. Every file streams directly from Telegram servers to your device.
        </p>
      </section>

      {/* Values */}
      <section className="space-y-6">
        <h2 className="text-2xl font-black text-current font-display text-center">Our Core Values</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="glass-panel p-6 rounded-[20px] border border-slate-200/80 dark:border-white/10 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-[#635BFF]/10 text-[#635BFF] flex items-center justify-center">
              <Lock className="w-5 h-5" />
            </div>
            <h3 className="font-display font-bold text-current">Privacy First</h3>
            <p className="text-slate-600 dark:text-slate-300 text-xs leading-relaxed">
              Zero server storage. Your files and credentials never touch our servers. Direct MTProto connections keep your data between you and Telegram.
            </p>
          </div>
          <div className="glass-panel p-6 rounded-[20px] border border-slate-200/80 dark:border-white/10 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
              <Zap className="w-5 h-5" />
            </div>
            <h3 className="font-display font-bold text-current">Free & Unlimited</h3>
            <p className="text-slate-600 dark:text-slate-300 text-xs leading-relaxed">
              No paywalls, no download limits, no premium tiers. TG Media Downloader is completely free for everyone, forever.
            </p>
          </div>
          <div className="glass-panel p-6 rounded-[20px] border border-slate-200/80 dark:border-white/10 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center">
              <Globe className="w-5 h-5" />
            </div>
            <h3 className="font-display font-bold text-current">Works Everywhere</h3>
            <p className="text-slate-600 dark:text-slate-300 text-xs leading-relaxed">
              Browser-based and cross-platform. Use it on Windows, macOS, Linux, Android, or iOS — no installation required.
            </p>
          </div>
          <div className="glass-panel p-6 rounded-[20px] border border-slate-200/80 dark:border-white/10 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-pink-500/10 text-pink-500 flex items-center justify-center">
              <Heart className="w-5 h-5" />
            </div>
            <h3 className="font-display font-bold text-current">User-Focused</h3>
            <p className="text-slate-600 dark:text-slate-300 text-xs leading-relaxed">
              Built by users, for users. We listen to feedback and continuously improve the tool based on real-world needs.
            </p>
          </div>
        </div>
      </section>

      {/* Privacy Commitment */}
      <section className="glass-panel p-8 rounded-[24px] bg-gradient-to-r from-[#635BFF]/15 via-purple-600/10 to-pink-500/10 border border-[#635BFF]/30 space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#635BFF]/10 text-[#635BFF] flex items-center justify-center">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h2 className="text-xl font-black text-current font-display">Our Privacy Commitment</h2>
        </div>
        <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-300">
          <li className="flex items-start gap-2">
            <span className="text-emerald-500 font-bold">✓</span>
            <span><strong>Zero server storage</strong> — files never touch our servers</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-emerald-500 font-bold">✓</span>
            <span><strong>Local credential storage</strong> — API keys stay in your browser</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-emerald-500 font-bold">✓</span>
            <span><strong>Direct MTProto connections</strong> — same encryption as official Telegram clients</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-emerald-500 font-bold">✓</span>
            <span><strong>No data selling</strong> — we never sell or share your personal information</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-emerald-500 font-bold">✓</span>
            <span><strong>Transparent policies</strong> — clear privacy policy and terms of service</span>
          </li>
        </ul>
      </section>

      {/* Team */}
      <section className="space-y-6">
        <h2 className="text-2xl font-black text-current font-display text-center">Meet the Team</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="glass-panel p-6 rounded-[20px] border border-slate-200/80 dark:border-white/10 text-center space-y-3">
            <div className="w-16 h-16 rounded-full bg-[#635BFF]/15 text-[#635BFF] flex items-center justify-center mx-auto font-black text-xl">
              AR
            </div>
            <h3 className="font-display font-bold text-current">Arul Raj</h3>
            <p className="text-xs text-[#635BFF] font-mono font-bold">FOUNDER & LEAD DEVELOPER</p>
            <p className="text-slate-600 dark:text-slate-300 text-xs leading-relaxed">
              Full-stack developer with expertise in Telegram MTProto, web applications, and privacy-focused architecture.
            </p>
          </div>
          <div className="glass-panel p-6 rounded-[20px] border border-slate-200/80 dark:border-white/10 text-center space-y-3">
            <div className="w-16 h-16 rounded-full bg-purple-500/15 text-purple-500 flex items-center justify-center mx-auto font-black text-xl">
              PS
            </div>
            <h3 className="font-display font-bold text-current">Priya Sharma</h3>
            <p className="text-xs text-purple-500 font-mono font-bold">CONTENT STRATEGIST</p>
            <p className="text-slate-600 dark:text-slate-300 text-xs leading-relaxed">
              Technical writer and content strategist creating in-depth guides and tutorials for Telegram users.
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <div className="text-center space-y-4">
        <h2 className="text-2xl font-black text-current font-display">Start Downloading Today</h2>
        <p className="text-slate-600 dark:text-slate-300 text-sm max-w-xl mx-auto">
          Join thousands of users who trust TG Media Downloader for fast, free, and private Telegram media downloads.
        </p>
        <Link to="/downloader" className="btn-fintech-primary font-bold py-3 px-8 inline-flex items-center gap-2">
          Launch Downloader
          <ArrowRight className="w-5 h-5" />
        </Link>
      </div>
    </div>
  )
}