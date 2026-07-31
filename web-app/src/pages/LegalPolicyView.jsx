import React from 'react'
import SeoMeta from '../components/SeoMeta'
import { ShieldCheck, Terminal } from 'lucide-react'

export default function LegalPolicyView({ type = 'privacy' }) {
  const titles = {
    privacy: 'Privacy Policy',
    terms: 'Terms of Service',
    refund: 'Refund & Cancellation Policy',
    disclaimer: 'DMCA & Copyright Disclaimer'
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-12 space-y-8">
      <SeoMeta
        title={`${titles[type] || 'Privacy Policy'} — TG Media Downloader`}
        description={`Read the official ${titles[type] || 'Privacy Policy'} for TG Media Downloader. Transparent zero-server storage policy and terms.`}
        keywords={`tg downloader ${type}, telegram downloader legal, telegram media downloader policy`}
      />

      <div className="space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-[6px] bg-[#635BFF]/10 border border-[#635BFF]/30 text-[#635BFF] text-xs font-mono font-medium">
          <Terminal className="w-3.5 h-3.5" />
          <span>LEGAL & COMPLIANCE DOCUMENTATION</span>
        </div>
        <h1 className="text-3xl font-extrabold text-current">{titles[type] || 'Privacy Policy'}</h1>
        <p className="text-slate-400 text-xs font-mono">REVISION 2026.1 • EFFECTIVE IMMEDIATELY</p>
      </div>

      <div className="glass-panel p-6 sm:p-8 rounded-[12px] text-current text-xs leading-relaxed space-y-6 max-w-[72ch]">
        
        {type === 'privacy' && (
          <>
            <section className="space-y-2">
              <h2 className="text-sm font-bold text-current font-mono">1. INFORMATION WE COLLECT</h2>
              <p className="text-slate-400">TG Media Downloader respects user privacy. We store basic profile details (email address, full name, and subscription tier) required to maintain user account access and payment verification logs.</p>
            </section>
            <section className="space-y-2">
              <h2 className="text-sm font-bold text-current font-mono">2. ZERO MEDIA SERVER STORAGE</h2>
              <p className="text-slate-400">We do not host, store, or archive any Telegram media files, photos, videos, or documents on our servers. All media items are streamed directly to your local browser downloads.</p>
            </section>
            <section className="space-y-2">
              <h2 className="text-sm font-bold text-current font-mono">3. THIRD-PARTY SERVICES & GOOGLE ADSENSE</h2>
              <p className="text-slate-400">We utilize Supabase for user authentication and Google AdSense for serving advertisements. These vendors may use cookies to serve ads based on user visits.</p>
            </section>
          </>
        )}

        {type === 'terms' && (
          <>
            <section className="space-y-2">
              <h2 className="text-sm font-bold text-current font-mono">1. ACCEPTANCE OF TERMS</h2>
              <p className="text-slate-400">By accessing or using TG Media Downloader Web Edition, you agree to comply with these Terms of Service. You are responsible for ensuring your actions adhere to Telegram legal terms.</p>
            </section>
            <section className="space-y-2">
              <h2 className="text-sm font-bold text-current font-mono">2. USE OF SERVICE</h2>
              <p className="text-slate-400">Users are granted access to search, browse, and download media files from public Telegram channels or channels they are authorized to access.</p>
            </section>
          </>
        )}

        {type === 'refund' && (
          <>
            <section className="space-y-2">
              <h2 className="text-sm font-bold text-current font-mono">1. SUBSCRIPTION CANCELLATIONS & REFUNDS</h2>
              <p className="text-slate-400">Subscriptions (3, 6, and 12-month passes) grant immediate digital access to unlimited fetches and direct local streaming. If you experience technical issues, contact support within 7 days.</p>
            </section>
          </>
        )}

        {type === 'disclaimer' && (
          <>
            <section className="space-y-2">
              <h2 className="text-sm font-bold text-current font-mono">1. DMCA & COPYRIGHT POLICY</h2>
              <p className="text-slate-400">TG Media Downloader operates strictly as a client interface tool. We do not host or store copyright-protected media content on our servers. Inquiries can be sent to support@tgdownloader.com.</p>
            </section>
          </>
        )}

      </div>

    </div>
  )
}
