import React from 'react'
import { useParams, Link } from 'react-router-dom'
import { ShieldCheck, FileText, Lock } from 'lucide-react'

export default function LegalPolicyView({ type = 'privacy' }) {
  const titles = {
    privacy: 'Privacy Policy',
    terms: 'Terms of Service',
    refund: 'Refund & Cancellation Policy',
    disclaimer: 'DMCA & Copyright Disclaimer'
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 space-y-8">
      
      <div className="space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/30 text-brand-300 text-xs font-semibold">
          <ShieldCheck className="w-3.5 h-3.5 text-brand-400" />
          <span>Legal & Compliance</span>
        </div>
        <h1 className="text-3xl font-extrabold text-white">{titles[type] || 'Privacy Policy'}</h1>
        <p className="text-slate-400 text-xs">Last updated: March 2026</p>
      </div>

      <div className="glass-panel p-6 sm:p-8 rounded-2xl border border-white/10 text-slate-300 text-xs leading-relaxed space-y-6 shadow-glow">
        
        {type === 'privacy' && (
          <>
            <section className="space-y-2">
              <h2 className="text-base font-bold text-white">1. Information We Collect</h2>
              <p>TG Media Downloader respects your privacy. We store only basic profile details (email address, full name, and subscription tier) required to maintain your user account and payment verification records.</p>
            </section>
            <section className="space-y-2">
              <h2 className="text-base font-bold text-white">2. Zero User Media Storage</h2>
              <p>We do not host, store, or archive any Telegram media files, photos, videos, or documents on our servers or databases. All media files are streamed directly into your browser's local download directory.</p>
            </section>
            <section className="space-y-2">
              <h2 className="text-base font-bold text-white">3. Third-Party Services & Google AdSense</h2>
              <p>We use third-party tools such as Supabase for authentication and Google AdSense for serving advertisements. These vendors may use cookies to serve ads based on user visits.</p>
            </section>
          </>
        )}

        {type === 'terms' && (
          <>
            <section className="space-y-2">
              <h2 className="text-base font-bold text-white">1. Acceptance of Terms</h2>
              <p>By accessing or using TG Media Downloader Web Edition, you agree to comply with these Terms of Service. You are responsible for ensuring that your download actions adhere to Telegram's terms and legal copyrights.</p>
            </section>
            <section className="space-y-2">
              <h2 className="text-base font-bold text-white">2. Use of Service</h2>
              <p>Users are granted non-exclusive access to search, browse, and download media files from public Telegram channels or channels they have authorization to access.</p>
            </section>
          </>
        )}

        {type === 'refund' && (
          <>
            <section className="space-y-2">
              <h2 className="text-base font-bold text-white">1. Subscription Cancellation & Refunds</h2>
              <p>Subscriptions (3, 6, and 12-month passes) grant immediate digital access to unlimited fetches and high-speed streaming. If you experience technical issues preventing service access, you may contact support within 7 days for review.</p>
            </section>
          </>
        )}

        {type === 'disclaimer' && (
          <>
            <section className="space-y-2">
              <h2 className="text-base font-bold text-white">1. DMCA & Copyright Policy</h2>
              <p>TG Media Downloader operates as a client interface. We do not host or store any copyright-protected media content on our servers. Copyright holders can send inquiries directly to support@tgdownloader.com.</p>
            </section>
          </>
        )}

      </div>

    </div>
  )
}
