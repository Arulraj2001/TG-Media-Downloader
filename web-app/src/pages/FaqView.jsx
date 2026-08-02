import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import SeoMeta from '../components/SeoMeta'
import { ChevronDown, HelpCircle, Download, Search, MessageCircle } from 'lucide-react'

const FAQS = [
  {
    question: 'What is TG Media Downloader?',
    answer: 'TG Media Downloader is a free web-based tool that lets you bulk download photos, videos, documents, audio files, and other media from Telegram channels, groups, and chats. It uses direct MTProto connections to stream files from Telegram servers directly to your device with zero server caching.'
  },
  {
    question: 'Is TG Media Downloader free to use?',
    answer: 'Yes, TG Media Downloader is 100% free with unlimited downloads. There are no paywalls, download limits, or premium tiers. Your Telegram account plan (free or Premium) determines what content you can access and download.'
  },
  {
    question: 'Do I need to install any software?',
    answer: 'No. TG Media Downloader works entirely in your web browser. You only need a modern browser (Chrome, Firefox, Edge, Safari) and your Telegram API credentials.'
  },
  {
    question: 'How do I get my Telegram API ID and API Hash?',
    answer: 'Visit my.telegram.org, log in with your phone number, click "API Development Tools," create an application, and copy your API ID and API Hash. These are free and take under 5 minutes to create.'
  },
  {
    question: 'Is my data stored on your servers?',
    answer: 'Never. TG Media Downloader uses direct MTProto connections from your browser to Telegram servers. Files stream directly to your device with zero server caching. Your API credentials are stored locally in your browser, not on our servers.'
  },
  {
    question: 'Can I download from private Telegram channels?',
    answer: 'Yes, as long as you are an authorized member of the private channel. The downloader authenticates as your Telegram account, so it can access channels and groups you belong to. It does not bypass permissions or access restricted content.'
  },
  {
    question: 'What file types can I download?',
    answer: 'You can download all media types Telegram supports: photos (JPG, PNG, WebP), videos (MP4, MKV, WebM), documents (PDF, DOCX, XLSX, PPTX), audio (MP3, FLAC, WAV), voice notes, archives (ZIP, RAR), stickers, and more.'
  },
  {
    question: 'Does downloading preserve original quality?',
    answer: 'Yes. TG Media Downloader fetches original files from Telegram, not compressed streaming versions. Documents download byte-for-byte identical, photos retain original resolution, and audio files like FLAC stay lossless.'
  },
  {
    question: 'How fast can I download?',
    answer: 'TG Media Downloader uses parallel streams — downloading up to 8 files simultaneously. This is dramatically faster than Telegram\'s built-in sequential export. Actual speed depends on your internet connection and Telegram server availability.'
  },
  {
    question: 'Is it legal to download Telegram media?',
    answer: 'Downloading media for personal use from channels you have access to is generally permitted under Telegram\'s Terms of Service. However, you must respect copyright. Only download content you own, have created, or have permission to save. See our Copyright Disclaimer for details.'
  },
  {
    question: 'Can I download from forum topics and group folders?',
    answer: 'Yes. TG Media Downloader supports Telegram forum topics and group folders. You can select a specific topic within a forum-style group and download only that topic\'s media.'
  },
  {
    question: 'What happens if a download fails?',
    answer: 'Most download failures are caused by connection issues, storage space, or source file deletion. Try restarting the download, clearing your browser cache, or checking your internet connection. See our troubleshooting guides for detailed fixes.'
  },
  {
    question: 'Does TG Media Downloader work on mobile?',
    answer: 'Yes. TG Media Downloader is a web app that works on any device with a modern browser, including phones and tablets. For very large bulk downloads, we recommend using a desktop browser for better multi-file download handling.'
  },
  {
    question: 'Is my Telegram account safe when using this tool?',
    answer: 'Yes. TG Media Downloader authenticates using your official API credentials (API ID and API Hash) and establishes a direct MTProto connection — the same protocol used by official Telegram clients. Your credentials stay in your browser\'s local storage and are never transmitted to our servers.'
  },
  {
    question: 'Can I download media without the Telegram app installed?',
    answer: 'Yes. You only need a Telegram account (phone number) and your API credentials. You can register a Telegram account via Telegram Web without installing the app, then use TG Media Downloader in your browser.'
  }
]

export default function FaqView() {
  const [openIndex, setOpenIndex] = useState(0)

  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    'mainEntity': FAQS.map(faq => ({
      '@type': 'Question',
      'name': faq.question,
      'acceptedAnswer': {
        '@type': 'Answer',
        'text': faq.answer
      }
    }))
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      <SeoMeta
        title="FAQ — Frequently Asked Questions"
        description="Answers to common questions about TG Media Downloader — how it works, privacy, API credentials, supported formats, and troubleshooting."
        keywords="telegram downloader faq, telegram media downloader questions, telegram download help"
        jsonLd={faqJsonLd}
        breadcrumbs={[
          { name: 'Home', path: '/' },
          { name: 'FAQ', path: '/faq' }
        ]}
      />

      {/* Header */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#635BFF]/10 text-[#635BFF] text-xs font-mono font-bold border border-[#635BFF]/20">
          <HelpCircle className="w-4 h-4" />
          <span>FREQUENTLY ASKED QUESTIONS</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-current tracking-tight font-display">
          Frequently Asked Questions
        </h1>
        <p className="text-slate-600 dark:text-slate-300 text-base">
          Everything you need to know about downloading Telegram media with TG Media Downloader.
        </p>
      </div>

      {/* FAQ Accordion */}
      <div className="space-y-3">
        {FAQS.map((faq, index) => (
          <div
            key={index}
            className={`glass-panel rounded-[16px] overflow-hidden border transition-all duration-300 ${
              openIndex === index
                ? 'border-[#635BFF]/50 shadow-[0_10px_30px_rgba(99,91,255,0.15)]'
                : 'border-slate-200/80 dark:border-white/10'
            }`}
          >
            <button
              onClick={() => setOpenIndex(openIndex === index ? -1 : index)}
              className="w-full flex items-center justify-between gap-4 p-5 text-left"
              aria-expanded={openIndex === index}
            >
              <h2 className="font-display font-bold text-current text-sm sm:text-base">
                {faq.question}
              </h2>
              <ChevronDown
                className={`w-5 h-5 flex-shrink-0 text-[#635BFF] transition-transform duration-300 ${
                  openIndex === index ? 'rotate-180' : ''
                }`}
              />
            </button>
            {openIndex === index && (
              <div className="px-5 pb-5">
                <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
                  {faq.answer}
                </p>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* CTA */}
      <div className="glass-panel p-8 rounded-[20px] text-center space-y-4 bg-gradient-to-r from-[#635BFF]/15 via-purple-600/10 to-pink-500/10 border border-[#635BFF]/30">
        <h2 className="text-xl sm:text-2xl font-black text-current font-display">Still Have Questions?</h2>
        <p className="text-slate-600 dark:text-slate-300 text-sm">
          Check our documentation, read the blog guides, or contact us for personalized support.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-3">
          <Link to="/docs" className="btn-fintech-primary text-sm font-bold py-2.5 px-6 flex items-center justify-center gap-2">
            <Search className="w-4 h-4" />
            Read Documentation
          </Link>
          <Link to="/contact" className="btn-fintech-secondary text-sm font-bold py-2.5 px-6 flex items-center justify-center gap-2">
            <MessageCircle className="w-4 h-4" />
            Contact Support
          </Link>
        </div>
      </div>
    </div>
  )
}