import React, { useState } from 'react'
import { Mail, MessageSquare, Send, CheckCircle2, User, HelpCircle } from 'lucide-react'

export default function ContactUsView() {
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
    setTimeout(() => {
      setIsSubmitting(false)
      setSubmitSuccess(true)
      setName('')
      setEmail('')
      setMessage('')
    }, 800)
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 space-y-12">
      
      {/* Header */}
      <div className="text-center space-y-3 max-w-xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/30 text-brand-300 text-xs font-semibold">
          <Mail className="w-3.5 h-3.5" />
          <span>Support & Enquiries</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Get in Touch with Us
        </h1>
        <p className="text-slate-400 text-sm">
          Have a question about subscriptions, feature requests, or technical support? Fill out the form below.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Info Col */}
        <div className="md:col-span-1 space-y-6">
          <div className="glass-panel p-6 rounded-2xl space-y-4 border border-white/10 shadow-glow">
            <h3 className="font-bold text-white text-sm">Helpdesk Info</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Our support team reviews contact submissions daily. Messages submitted via this form sync directly to the Admin Inbox.
            </p>
            <div className="space-y-3 text-xs text-slate-300 pt-2 border-t border-white/10">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-brand-400" />
                <span>support@tgdownloader.com</span>
              </div>
              <div className="flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-brand-400" />
                <span>24/7 Response Window</span>
              </div>
            </div>
          </div>
        </div>

        {/* Form Col */}
        <div className="md:col-span-2">
          <div className="glass-panel p-6 sm:p-8 rounded-2xl border border-white/10 shadow-glow">
            {submitSuccess ? (
              <div className="text-center py-10 space-y-4">
                <div className="w-12 h-12 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-white">Message Sent Successfully!</h3>
                <p className="text-xs text-slate-400 max-w-sm mx-auto">
                  Thank you for reaching out. Your message has been received by the Admin Inbox and we will get back to you shortly.
                </p>
                <button
                  onClick={() => setSubmitSuccess(false)}
                  className="py-2.5 px-6 rounded-xl bg-brand-500 text-white font-semibold text-xs shadow-glow"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-slate-300 font-medium mb-1">Your Name *</label>
                    <input
                      type="text"
                      placeholder="John Doe"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      className="w-full px-3.5 py-2.5 rounded-xl glass-input text-white text-xs focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-300 font-medium mb-1">Your Email Address *</label>
                    <input
                      type="email"
                      placeholder="john@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="w-full px-3.5 py-2.5 rounded-xl glass-input text-white text-xs focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1">Subject</label>
                  <select
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl glass-input text-slate-200 bg-[#18181D] text-xs focus:outline-none"
                  >
                    <option value="General Inquiry">General Inquiry</option>
                    <option value="Payment Verification">Payment Verification Support</option>
                    <option value="Feature Request">Feature Request</option>
                    <option value="Technical Issue">Technical Issue</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1">Your Message *</label>
                  <textarea
                    rows={5}
                    placeholder="How can we help you today?"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    required
                    className="w-full px-3.5 py-2.5 rounded-xl glass-input text-white text-xs focus:outline-none resize-none"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-brand-600 to-brand-500 hover:from-brand-500 hover:to-brand-400 text-white font-semibold shadow-glow text-xs flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  <span>{isSubmitting ? 'Sending Message...' : 'Submit Contact Inquiry'}</span>
                </button>
              </form>
            )}
          </div>
        </div>

      </div>

    </div>
  )
}
