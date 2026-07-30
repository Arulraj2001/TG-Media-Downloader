import React, { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { 
  Shield, Check, X, Eye, FileText, DollarSign, MessageSquare, 
  Settings, PenTool, LayoutDashboard, Sliders, CheckCircle2, Clock, 
  AlertCircle, Sparkles, Image as ImageIcon, Plus, Edit3, Trash2
} from 'lucide-react'

export default function AdminPortalView() {
  const { isAdmin } = useAuth()
  const [activeTab, setActiveTab] = useState('payments')

  // Mock State for Admin Modules
  const [pendingPayments, setPendingPayments] = useState([
    {
      id: 'pv-001',
      userName: 'John Doe',
      userEmail: 'john@example.com',
      planName: '6 Months Pass',
      planId: 'plan_6m',
      amount: '$24.99',
      method: 'QR Code / UPI',
      refId: 'UTR9876543210',
      proofUrl: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=600&q=80',
      date: '2026-03-29 10:45 AM',
      status: 'pending'
    }
  ])

  const [contactMessages, setContactMessages] = useState([
    {
      id: 'cm-001',
      name: 'Sarah Connor',
      email: 'sarah@example.com',
      subject: 'Payment Verification Support',
      message: 'Hi, I paid via PayPal and submitted my transaction ref. Please verify my 12-month VIP subscription.',
      date: '2026-03-29 11:30 AM',
      status: 'unread'
    }
  ])

  const [blogPosts, setBlogPosts] = useState([
    {
      id: 'bp-001',
      title: 'How to Download Telegram Media Files Directly in Your Browser',
      slug: 'how-to-download-telegram-media-files-directly',
      category: 'Guides',
      status: 'published',
      date: '2026-03-25'
    }
  ])

  // System Settings State
  const [freeFetchLimit, setFreeFetchLimit] = useState(5)
  const [adsFreeUsers, setAdsFreeUsers] = useState(true)
  const [adsPaidUsers, setAdsPaidUsers] = useState(false)
  const [upiId, setUpiId] = useState('admin@upi')
  const [paypalMe, setPaypalMe] = useState('https://paypal.me/admin')

  // Pricing State
  const [plan3mPrice, setPlan3mPrice] = useState(14.99)
  const [plan6mPrice, setPlan6mPrice] = useState(24.99)
  const [plan12mPrice, setPlan12mPrice] = useState(39.99)

  // New Blog Post Form State
  const [showBlogModal, setShowBlogModal] = useState(false)
  const [newBlogTitle, setNewBlogTitle] = useState('')
  const [newBlogCategory, setNewBlogCategory] = useState('Guides')
  const [newBlogContent, setNewBlogContent] = useState('')

  if (!isAdmin) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-4">
        <div className="w-12 h-12 rounded-full bg-rose-500/20 text-rose-400 flex items-center justify-center mx-auto">
          <Shield className="w-6 h-6" />
        </div>
        <h2 className="text-2xl font-bold text-white">Admin Authentication Required</h2>
        <p className="text-slate-400 text-sm">You need administrator permissions to view the Admin Portal.</p>
      </div>
    )
  }

  // 1-Click Approve Payment
  const approvePayment = (id) => {
    setPendingPayments(prev => prev.map(p => p.id === id ? { ...p, status: 'approved' } : p))
    alert('Payment approved! User subscription has been activated for 6 months.')
  }

  const rejectPayment = (id) => {
    setPendingPayments(prev => prev.map(p => p.id === id ? { ...p, status: 'rejected' } : p))
  }

  const handleCreateBlogPost = (e) => {
    e.preventDefault()
    if (!newBlogTitle || !newBlogContent) return
    const post = {
      id: `bp-${Date.now()}`,
      title: newBlogTitle,
      slug: newBlogTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      category: newBlogCategory,
      status: 'published',
      date: new Date().toISOString().split('T')[0]
    }
    setBlogPosts(prev => [post, ...prev])
    setShowBlogModal(false)
    setNewBlogTitle('')
    setNewBlogContent('')
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-10 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 glass-panel p-6 rounded-2xl border border-rose-500/20 shadow-glow">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-rose-500/20 border border-rose-500/40 text-rose-400 flex items-center justify-center font-bold">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Admin Master Control Portal</h1>
            <p className="text-slate-400 text-xs">Manage payments, subscriptions, blog posts, contact inbox, and system limits.</p>
          </div>
        </div>

        <div className="flex items-center gap-3 text-xs">
          <div className="px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-slate-300">
            Pending Payments: <strong className="text-amber-400">{pendingPayments.filter(p => p.status === 'pending').length}</strong>
          </div>
          <div className="px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-slate-300">
            Unread Contact: <strong className="text-brand-400">{contactMessages.filter(c => c.status === 'unread').length}</strong>
          </div>
        </div>
      </div>

      {/* Admin Module Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-white/10 text-xs font-semibold no-scrollbar">
        {[
          { id: 'payments', label: 'Payment Verifications', icon: DollarSign, badge: pendingPayments.filter(p => p.status === 'pending').length },
          { id: 'blog', label: 'Blog Manager', icon: PenTool, badge: 0 },
          { id: 'contact', label: 'Contact Messages Inbox', icon: MessageSquare, badge: contactMessages.filter(c => c.status === 'unread').length },
          { id: 'pricing', label: 'Pricing & Plans', icon: Sliders, badge: 0 },
          { id: 'settings', label: 'System Limits & Ads', icon: Settings, badge: 0 },
        ].map(tab => {
          const Icon = tab.icon
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40 shadow-glow font-bold'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
              {tab.badge > 0 && (
                <span className="px-2 py-0.5 rounded-full bg-rose-500 text-white text-[10px] font-extrabold">
                  {tab.badge}
                </span>
              )}
            </button>
          )
        })}
      </div>

      {/* TAB 1: PAYMENT VERIFICATIONS */}
      {activeTab === 'payments' && (
        <div className="glass-panel p-6 rounded-2xl space-y-6 shadow-glow border border-white/10">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <h2 className="font-bold text-white text-base">Pending Payment Verification Requests</h2>
            <span className="text-xs text-slate-400">Inspect proof screenshots & 1-Click Approve</span>
          </div>

          <div className="space-y-4">
            {pendingPayments.map(p => (
              <div key={p.id} className="glass-card p-5 rounded-xl border border-white/10 space-y-4 text-xs">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white text-sm">{p.userName}</span>
                      <span className="text-slate-400">({p.userEmail})</span>
                      <span className="px-2 py-0.5 rounded bg-brand-500/20 text-brand-300 font-bold text-[10px]">
                        {p.planName} - {p.amount}
                      </span>
                    </div>

                    <p className="text-slate-400">
                      Method: <strong className="text-slate-200">{p.method}</strong> • Ref / UTR ID: <strong className="text-amber-400 font-mono">{p.refId}</strong> • Date: {p.date}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    {p.status === 'pending' ? (
                      <>
                        <button
                          onClick={() => approvePayment(p.id)}
                          className="py-2 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-white font-bold text-xs shadow-glow flex items-center gap-1.5"
                        >
                          <Check className="w-4 h-4" /> Approve & Activate Plan
                        </button>
                        <button
                          onClick={() => rejectPayment(p.id)}
                          className="py-2 px-3 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 font-medium text-xs border border-rose-500/30"
                        >
                          Reject
                        </button>
                      </>
                    ) : (
                      <span className={`px-3 py-1 rounded-full font-bold text-xs ${
                        p.status === 'approved' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-rose-500/20 text-rose-300'
                      }`}>
                        {p.status === 'approved' ? '✅ Approved' : '❌ Rejected'}
                      </span>
                    )}
                  </div>

                </div>

                {/* Proof Image Preview */}
                {p.proofUrl && (
                  <div className="pt-3 border-t border-white/10">
                    <p className="text-[11px] text-slate-400 mb-2 flex items-center gap-1">
                      <ImageIcon className="w-3.5 h-3.5 text-brand-400" /> Proof Screenshot Preview:
                    </p>
                    <div className="w-48 h-32 rounded-xl overflow-hidden border border-white/10 bg-black/40">
                      <img src={p.proofUrl} alt="Proof" className="w-full h-full object-cover" />
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: BLOG MANAGER */}
      {activeTab === 'blog' && (
        <div className="glass-panel p-6 rounded-2xl space-y-6 shadow-glow border border-white/10">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <h2 className="font-bold text-white text-base">Blog Posts & SEO Articles Manager</h2>
            <button
              onClick={() => setShowBlogModal(true)}
              className="py-2 px-4 rounded-xl bg-brand-500 hover:bg-brand-400 text-white font-bold text-xs shadow-glow flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" /> Create New Post
            </button>
          </div>

          <div className="space-y-3">
            {blogPosts.map(bp => (
              <div key={bp.id} className="glass-card p-4 rounded-xl flex items-center justify-between text-xs border border-white/10">
                <div className="space-y-1">
                  <span className="font-bold text-white text-sm">{bp.title}</span>
                  <p className="text-slate-400 text-[11px]">
                    Category: {bp.category} • Slug: <code className="text-brand-300">/blog/{bp.slug}</code> • Date: {bp.date}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 font-bold text-[10px]">
                    Published
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: CONTACT INBOX */}
      {activeTab === 'contact' && (
        <div className="glass-panel p-6 rounded-2xl space-y-6 shadow-glow border border-white/10">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <h2 className="font-bold text-white text-base">Contact Form Messages Inbox</h2>
          </div>

          <div className="space-y-3">
            {contactMessages.map(cm => (
              <div key={cm.id} className="glass-card p-4 rounded-xl space-y-2 text-xs border border-white/10">
                <div className="flex items-center justify-between border-b border-white/10 pb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white">{cm.name}</span>
                    <span className="text-slate-400">({cm.email})</span>
                  </div>
                  <span className="text-slate-400 text-[11px]">{cm.date}</span>
                </div>
                <p className="font-semibold text-brand-300">Subject: {cm.subject}</p>
                <p className="text-slate-300 bg-black/20 p-3 rounded-lg border border-white/5">{cm.message}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: PRICING & SUBSCRIPTIONS */}
      {activeTab === 'pricing' && (
        <div className="glass-panel p-6 rounded-2xl space-y-6 shadow-glow border border-white/10">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <h2 className="font-bold text-white text-base">Subscription Plan Prices & Payment Details</h2>
            <button
              onClick={() => alert('Subscription prices updated successfully!')}
              className="py-2 px-4 rounded-xl bg-brand-500 hover:bg-brand-400 text-white font-bold text-xs shadow-glow"
            >
              Save Pricing Settings
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-xs">
            <div className="glass-card p-4 rounded-xl space-y-2">
              <label className="block text-slate-300 font-bold">3 Months Pass Price ($ USD)</label>
              <input
                type="number"
                step="0.01"
                value={plan3mPrice}
                onChange={(e) => setPlan3mPrice(e.target.value)}
                className="w-full px-3 py-2 rounded-xl glass-input text-white focus:outline-none"
              />
            </div>
            <div className="glass-card p-4 rounded-xl space-y-2">
              <label className="block text-slate-300 font-bold">6 Months Pass Price ($ USD)</label>
              <input
                type="number"
                step="0.01"
                value={plan6mPrice}
                onChange={(e) => setPlan6mPrice(e.target.value)}
                className="w-full px-3 py-2 rounded-xl glass-input text-white focus:outline-none"
              />
            </div>
            <div className="glass-card p-4 rounded-xl space-y-2">
              <label className="block text-slate-300 font-bold">12 Months VIP Pass Price ($ USD)</label>
              <input
                type="number"
                step="0.01"
                value={plan12mPrice}
                onChange={(e) => setPlan12mPrice(e.target.value)}
                className="w-full px-3 py-2 rounded-xl glass-input text-white focus:outline-none"
              />
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: SYSTEM LIMITS & ADS */}
      {activeTab === 'settings' && (
        <div className="glass-panel p-6 rounded-2xl space-y-6 shadow-glow border border-white/10">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <h2 className="font-bold text-white text-base">Free Limits & AdSense Ad Controls</h2>
            <button
              onClick={() => alert('Settings saved successfully!')}
              className="py-2 px-4 rounded-xl bg-brand-500 hover:bg-brand-400 text-white font-bold text-xs shadow-glow"
            >
              Save Controls
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs">
            <div className="glass-card p-4 rounded-xl space-y-2">
              <label className="block text-slate-300 font-bold">Default Free Fetch Limit</label>
              <input
                type="number"
                value={freeFetchLimit}
                onChange={(e) => setFreeFetchLimit(e.target.value)}
                className="w-full px-3 py-2 rounded-xl glass-input text-white focus:outline-none"
              />
              <p className="text-[11px] text-slate-400">Number of free fetches granted to un-subscribed users.</p>
            </div>

            <div className="glass-card p-4 rounded-xl space-y-4">
              <span className="block text-slate-300 font-bold">AdSense Ad Toggles</span>
              
              <label className="flex items-center justify-between text-slate-300 cursor-pointer">
                <span>Show Ads to Free Users</span>
                <input
                  type="checkbox"
                  checked={adsFreeUsers}
                  onChange={(e) => setAdsFreeUsers(e.target.checked)}
                  className="w-4 h-4 rounded text-brand-500 focus:ring-brand-500"
                />
              </label>

              <label className="flex items-center justify-between text-slate-300 cursor-pointer">
                <span>Show Ads to Paid Subscribers</span>
                <input
                  type="checkbox"
                  checked={adsPaidUsers}
                  onChange={(e) => setAdsPaidUsers(e.target.checked)}
                  className="w-4 h-4 rounded text-brand-500 focus:ring-brand-500"
                />
              </label>
            </div>
          </div>
        </div>
      )}

      {/* New Blog Post Modal */}
      {showBlogModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="relative w-full max-w-2xl bg-[#18181D] border border-white/10 rounded-2xl p-6 sm:p-8 shadow-glow text-slate-100 space-y-4 text-xs">
            <button
              onClick={() => setShowBlogModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-bold text-white">Create New SEO Blog Article</h3>

            <form onSubmit={handleCreateBlogPost} className="space-y-4">
              <div>
                <label className="block text-slate-300 font-medium mb-1">Article Title *</label>
                <input
                  type="text"
                  placeholder="e.g. Complete Guide to Telegram Media Downloading"
                  value={newBlogTitle}
                  onChange={(e) => setNewBlogTitle(e.target.value)}
                  required
                  className="w-full px-3 py-2 rounded-xl glass-input text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Category</label>
                <select
                  value={newBlogCategory}
                  onChange={(e) => setNewBlogCategory(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl glass-input text-slate-200 bg-[#18181D] focus:outline-none"
                >
                  <option value="Guides">Guides</option>
                  <option value="Tutorials">Tutorials</option>
                  <option value="Updates">Updates</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Content (Markdown Supported) *</label>
                <textarea
                  rows={8}
                  placeholder="# Article Heading\n\nWrite your blog article here..."
                  value={newBlogContent}
                  onChange={(e) => setNewBlogContent(e.target.value)}
                  required
                  className="w-full px-3 py-2 rounded-xl glass-input text-white focus:outline-none resize-none"
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full py-3 px-4 rounded-xl bg-brand-500 hover:bg-brand-400 text-white font-bold shadow-glow text-xs"
              >
                Publish Article Now
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  )
}
