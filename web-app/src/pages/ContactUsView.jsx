import React, { useState } from 'react'
import { useApp } from '../context/AppContext'
import SeoMeta from '../components/SeoMeta'
import { Mail, MessageSquare, Send, Check, User, HelpCircle, Terminal } from 'lucide-react'

export default function ContactUsView() {
  const { submitContactForm } = useApp()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [subject, setSubject] = useState('General Inquiry')
  const [message, setMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!name || !email || !message) return

    setIsSubmitting(true)
    submitContactForm({ name, email, subject, message })
    setTimeout(() => {
      setIsSubmitting(false)
      setSubmitSuccess(true)
      setName('')
      setEmail('')
      setMessage('')
    }, 500)
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 space-y-10">
      <SeoMeta
        title="Contact Helpdesk - TG Media Downloader"
        description="Contact our technical support and helpdesk team for payment verification, feature requests, or inquiries."
      />

      {/* Header */}
      <div className="space-y-3 max-w-xl">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-[6px] bg-[#635BFF]/10 border border-[#635BFF]/30 text-[#635BFF] text-xs font-mono font-medium">
          <Mail className="w-3.5 h-3.5" />
          <span>TECHNICAL SUPPORT & INQUIRIES</span>
        </div>
        <h1 className="text-3xl font-extrabold text-current tracking-tight">
          Support & Contact Helpdesk
        </h1>
        <p className="text-slate-400 text-sm">
          Have a question about subscriptions, feature requests, or technical assistance? Fill out the form below.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Info Col */}
        <div className="md:col-span-1 space-y-4">
          <div className="glass-panel p-6 rounded-[12px] space-y-4">
            <h3 className="font-bold text-current text-xs font-mono uppercase">Helpdesk System</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Our support team reviews contact submissions daily. Messages submitted via this form sync directly to the Admin Inbox.
            </p>
            <div className="space-y-3 text-xs font-mono text-slate-300 pt-2 border-t border-[#E6E6E6]/10">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#635BFF]" />
                <span>support@tgdownloader.com</span>
              </div>
              <div className="flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-[#635BFF]" />
                <span>24/7 Response Window</span>
              </div>
            </div>
          </div>
        </div>

        {/* Form Col */}
        <div className="md:col-span-2">
          <div className="glass-panel p-6 sm:p-8 rounded-[12px]">
            {submitSuccess ? (
              <div className="text-center py-8 space-y-4">
                <div className="w-10 h-10 rounded-[6px] bg-[#00C48C]/20 border border-[#00C48C]/40 text-[#00C48C] flex items-center justify-center mx-auto">
                  <Check className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-current">Message Received</h3>
                <p className="text-xs text-slate-400 max-w-sm mx-auto">
                  Your message has been submitted to our support inbox. We will get back to you shortly.
                </p>
                <button
                  onClick={() => setSubmitSuccess(false)}
                  className="btn-fintech-primary text-xs"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-slate-400 font-medium mb-1">Your Name *</label>
                    <input
                      type="text"
                      placeholder="John Doe"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      className="w-full px-3.5 py-2.5 rounded-[6px] glass-input text-current text-xs focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 font-medium mb-1">Your Email Address *</label>
                    <input
                      type="email"
                      placeholder="john@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="w-full px-3.5 py-2.5 rounded-[6px] glass-input text-current text-xs focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-400 font-medium mb-1">Subject</label>
                  <select
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-[6px] glass-input text-current font-mono text-xs focus:outline-none"
                  >
                    <option value="General Inquiry">General Inquiry</option>
                    <option value="Payment Verification">Payment Verification Support</option>
                    <option value="Feature Request">Feature Request</option>
                    <option value="Technical Issue">Technical Issue</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-400 font-medium mb-1">Your Message *</label>
                  <textarea
                    rows={5}
                    placeholder="Provide details about your inquiry..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    required
                    className="w-full px-3.5 py-2.5 rounded-[6px] glass-input text-current text-xs focus:outline-none resize-none"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full btn-fintech-primary text-xs flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  <span>{isSubmitting ? 'SENDING...' : 'SUBMIT CONTACT INQUIRY'}</span>
                </button>
              </form>
            )}
          </div>
        </div>

      </div>

    </div>
  )
}
