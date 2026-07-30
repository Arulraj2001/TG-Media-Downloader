import React, { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useApp } from '../context/AppContext'
import { 
  Shield, Check, X, Eye, FileText, DollarSign, MessageSquare, 
  Settings, PenTool, LayoutDashboard, Sliders, CheckCircle2, Clock, 
  AlertCircle, Sparkles, Image as ImageIcon, Plus, Edit3, Trash2, Terminal
} from 'lucide-react'

export default function AdminPortalView() {
  const { isAdmin } = useAuth()
  const { 
    systemSettings, payments, contactMessages, blogPosts,
    approvePaymentAdmin, rejectPaymentAdmin, addBlogPostAdmin, updateSystemSettingsAdmin 
  } = useApp()

  const [activeTab, setActiveTab] = useState('payments')

  // System Settings State
  const [freeFetchLimit, setFreeFetchLimit] = useState(systemSettings.freeFetchLimit || 5)
  const [adsFreeUsers, setAdsFreeUsers] = useState(systemSettings.adsFreeUsers ?? true)
  const [adsPaidUsers, setAdsPaidUsers] = useState(systemSettings.adsPaidUsers ?? false)
  const [upiId, setUpiId] = useState(systemSettings.paymentUpiId || 'admin@upi')
  const [paypalMe, setPaypalMe] = useState(systemSettings.paymentPaypalMe || 'https://paypal.me/admin')

  // Pricing State
  const [plan3mPrice, setPlan3mPrice] = useState(systemSettings.plan3mPrice || 14.99)
  const [plan6mPrice, setPlan6mPrice] = useState(systemSettings.plan6mPrice || 24.99)
  const [plan12mPrice, setPlan12mPrice] = useState(systemSettings.plan12mPrice || 39.99)

  // New Blog Post Form State
  const [showBlogModal, setShowBlogModal] = useState(false)
  const [newBlogTitle, setNewBlogTitle] = useState('')
  const [newBlogCategory, setNewBlogCategory] = useState('Guides')
  const [newBlogContent, setNewBlogContent] = useState('')

  // Admin Auth Gate State
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(() => {
    return localStorage.getItem('tg_admin_authed') === 'true' || isAdmin
  })
  const [adminEmailInput, setAdminEmailInput] = useState('')
  const [adminPasswordInput, setAdminPasswordInput] = useState('')
  const [adminAuthError, setAdminAuthError] = useState('')

  const PREBUILT_ADMIN_EMAIL = import.meta.env.VITE_ADMIN_EMAIL || 'admin@tgdownloader.com'
  const PREBUILT_ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD || 'admin12345'

  const handleAdminLogin = (e) => {
    e.preventDefault()
    if (
      adminEmailInput.trim().toLowerCase() === PREBUILT_ADMIN_EMAIL.toLowerCase() &&
      adminPasswordInput === PREBUILT_ADMIN_PASSWORD
    ) {
      setIsAdminAuthenticated(true)
      localStorage.setItem('tg_admin_authed', 'true')
      setAdminAuthError('')
    } else {
      setAdminAuthError('Invalid Admin Email or Password')
    }
  }

  const handleAdminLogout = () => {
    setIsAdminAuthenticated(false)
    localStorage.removeItem('tg_admin_authed')
  }

  // 1-Click Approve Payment
  const approvePayment = (id) => {
    approvePaymentAdmin(id)
    alert('Payment approved! User subscription has been activated.')
  }

  const rejectPayment = (id) => {
    rejectPaymentAdmin(id)
  }

  const handleCreateBlogPost = (e) => {
    e.preventDefault()
    if (!newBlogTitle || !newBlogContent) return
    addBlogPostAdmin({
      title: newBlogTitle,
      category: newBlogCategory,
      content: newBlogContent,
      excerpt: newBlogContent.slice(0, 150) + '...',
      cover: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80'
    })
    setShowBlogModal(false)
    setNewBlogTitle('')
    setNewBlogContent('')
  }

  const handleSaveSettings = () => {
    updateSystemSettingsAdmin({
      freeFetchLimit: parseInt(freeFetchLimit) || 5,
      adsFreeUsers,
      adsPaidUsers,
      paymentUpiId: upiId,
      paymentPaypalMe: paypalMe,
      plan3mPrice: parseFloat(plan3mPrice) || 14.99,
      plan6mPrice: parseFloat(plan6mPrice) || 24.99,
      plan12mPrice: parseFloat(plan12mPrice) || 39.99
    })
    alert('System settings & subscription prices updated across the web app!')
  }

  if (!isAdminAuthenticated) {
    return (
      <div className="max-w-md mx-auto px-4 py-20">
        <div className="glass-panel p-8 rounded-[12px] shadow-lift space-y-6 text-current">
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-[6px] bg-[#FF4B4B]/10 border border-[#FF4B4B]/30 text-[#FF4B4B] flex items-center justify-center mx-auto">
              <Shield className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-bold text-current">Admin Authentication</h2>
            <p className="text-xs text-slate-400 font-mono">ENTER PREBUILT ADMIN CREDENTIALS</p>
          </div>

          {adminAuthError && (
            <div className="p-3 rounded-[6px] bg-[#FF4B4B]/10 border border-[#FF4B4B]/30 text-[#FF4B4B] text-xs font-semibold font-mono text-center">
              {adminAuthError}
            </div>
          )}

          <form onSubmit={handleAdminLogin} className="space-y-4 text-xs">
            <div>
              <label className="block text-slate-400 font-medium mb-1">Admin Email Address</label>
              <input
                type="email"
                placeholder="admin@tgdownloader.com"
                value={adminEmailInput}
                onChange={(e) => setAdminEmailInput(e.target.value)}
                required
                className="w-full px-3.5 py-2.5 rounded-[6px] glass-input text-current focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-slate-400 font-medium mb-1">Admin Password</label>
              <input
                type="password"
                placeholder="••••••••"
                value={adminPasswordInput}
                onChange={(e) => setAdminPasswordInput(e.target.value)}
                required
                className="w-full px-3.5 py-2.5 rounded-[6px] glass-input text-current focus:outline-none"
              />
            </div>

            <button
              type="submit"
              className="w-full btn-fintech-primary text-xs"
            >
              Sign In to Admin Portal
            </button>
          </form>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-10 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 glass-panel p-6 rounded-[12px]">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-[6px] bg-[#635BFF] text-white flex items-center justify-center font-bold">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-current">Admin Master Control Portal</h1>
            <p className="text-slate-400 text-xs font-mono">SYSTEM & PAYMENT MANAGEMENT API</p>
          </div>
        </div>

        <div className="flex items-center gap-3 text-xs font-mono">
          <div className="px-3 py-1.5 rounded-[6px] glass-card">
            Pending Payments: <strong className="text-[#FFC700]">{payments.filter(p => p.status === 'pending').length}</strong>
          </div>
          <div className="px-3 py-1.5 rounded-[6px] glass-card">
            Unread Inbox: <strong className="text-[#635BFF]">{contactMessages.filter(c => c.status === 'unread').length}</strong>
          </div>
          <button
            onClick={handleAdminLogout}
            className="py-1.5 px-3 rounded-[6px] bg-[#FF4B4B]/10 hover:bg-[#FF4B4B]/20 text-[#FF4B4B] font-semibold border border-[#FF4B4B]/30 transition"
          >
            Sign Out
          </button>
        </div>
      </div>

      {/* Admin Module Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-[#E6E6E6]/10 text-xs font-semibold font-mono no-scrollbar">
        {[
          { id: 'payments', label: 'Payment Verifications', icon: DollarSign, badge: payments.filter(p => p.status === 'pending').length },
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
              className={`flex items-center gap-2 px-3.5 py-2 rounded-[6px] transition whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-[#635BFF] text-white shadow-subtle'
                  : 'text-slate-400 hover:text-current hover:bg-white/5'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
              {tab.badge > 0 && (
                <span className="px-2 py-0.5 rounded-full bg-[#FF4B4B] text-white text-[10px] font-bold">
                  {tab.badge}
                </span>
              )}
            </button>
          )
        })}
      </div>

      {/* TAB 1: PAYMENT VERIFICATIONS */}
      {activeTab === 'payments' && (
        <div className="glass-panel p-6 rounded-[12px] space-y-6">
          <div className="flex items-center justify-between border-b border-[#E6E6E6]/10 pb-3">
            <h2 className="font-bold text-current text-xs font-mono uppercase">Pending Payment Requests</h2>
            <span className="text-xs text-slate-400 font-mono">1-CLICK VERIFICATION</span>
          </div>

          <div className="space-y-3">
            {payments.map(p => (
              <div key={p.id} className="glass-card p-4 rounded-[6px] space-y-3 text-xs">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="space-y-1 font-mono">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-current text-sm">{p.userName}</span>
                      <span className="text-slate-400">({p.userEmail})</span>
                      <span className="badge-mono bg-[#635BFF]/10 text-[#635BFF] border border-[#635BFF]/20">
                        {p.planName} - {p.amount}
                      </span>
                    </div>

                    <p className="text-slate-400 text-[11px]">
                      Method: <strong className="text-current">{p.method}</strong> • Ref ID: <strong className="text-[#FFC700]">{p.refId}</strong> • Date: {p.date}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 font-mono">
                    {p.status === 'pending' ? (
                      <>
                        <button
                          onClick={() => approvePayment(p.id)}
                          className="py-1.5 px-3.5 rounded-[6px] bg-[#00C48C] hover:bg-[#00B07D] text-white font-bold text-xs shadow-sm flex items-center gap-1.5"
                        >
                          <Check className="w-4 h-4" /> Approve & Activate
                        </button>
                        <button
                          onClick={() => rejectPayment(p.id)}
                          className="py-1.5 px-3 rounded-[6px] bg-[#FF4B4B]/10 hover:bg-[#FF4B4B]/20 text-[#FF4B4B] font-semibold border border-[#FF4B4B]/30"
                        >
                          Reject
                        </button>
                      </>
                    ) : (
                      <span className={`px-3 py-1 rounded-[6px] font-bold text-xs ${
                        p.status === 'approved' ? 'bg-[#00C48C]/10 text-[#00C48C] border border-[#00C48C]/30' : 'bg-[#FF4B4B]/10 text-[#FF4B4B] border border-[#FF4B4B]/30'
                      }`}>
                        {p.status === 'approved' ? 'APPROVED' : 'REJECTED'}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: BLOG MANAGER */}
      {activeTab === 'blog' && (
        <div className="glass-panel p-6 rounded-[12px] space-y-6">
          <div className="flex items-center justify-between border-b border-[#E6E6E6]/10 pb-3">
            <h2 className="font-bold text-current text-xs font-mono uppercase">Blog Posts & SEO Manager</h2>
            <button
              onClick={() => setShowBlogModal(true)}
              className="btn-fintech-primary text-xs flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" /> Create New Post
            </button>
          </div>

          <div className="space-y-3 font-mono">
            {blogPosts.map(bp => (
              <div key={bp.id} className="glass-card p-4 rounded-[6px] flex items-center justify-between text-xs">
                <div className="space-y-1">
                  <span className="font-bold text-current text-sm font-sans">{bp.title}</span>
                  <p className="text-slate-400 text-[11px]">
                    Category: {bp.category} • Slug: <code className="text-[#635BFF]">/blog/{bp.slug}</code>
                  </p>
                </div>
                <span className="badge-mono bg-[#00C48C]/10 text-[#00C48C] border border-[#00C48C]/30">
                  PUBLISHED
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: CONTACT INBOX */}
      {activeTab === 'contact' && (
        <div className="glass-panel p-6 rounded-[12px] space-y-6">
          <div className="flex items-center justify-between border-b border-[#E6E6E6]/10 pb-3">
            <h2 className="font-bold text-current text-xs font-mono uppercase">Contact Messages Inbox ({contactMessages.length})</h2>
          </div>

          <div className="space-y-3">
            {contactMessages.map(cm => (
              <div key={cm.id} className="glass-card p-4 rounded-[6px] space-y-2 text-xs">
                <div className="flex items-center justify-between border-b border-[#E6E6E6]/10 pb-2 font-mono">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-current">{cm.name}</span>
                    <span className="text-slate-400">({cm.email})</span>
                  </div>
                  <span className="text-slate-400 text-[11px]">{cm.date}</span>
                </div>
                <p className="font-semibold text-[#635BFF] font-mono">Subject: {cm.subject}</p>
                <p className="text-current bg-white/5 p-3 rounded-[6px] border border-[#E6E6E6]/10">{cm.message}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: PRICING & SUBSCRIPTIONS */}
      {activeTab === 'pricing' && (
        <div className="glass-panel p-6 rounded-[12px] space-y-6">
          <div className="flex items-center justify-between border-b border-[#E6E6E6]/10 pb-3">
            <h2 className="font-bold text-current text-xs font-mono uppercase">Subscription Prices & Payment Setup</h2>
            <button
              onClick={handleSaveSettings}
              className="btn-fintech-primary text-xs"
            >
              Save Pricing Settings
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-xs font-mono">
            <div className="glass-card p-4 rounded-[6px] space-y-2">
              <label className="block text-slate-400 font-bold">3 Months Pass Price ($ USD)</label>
              <input
                type="number"
                step="0.01"
                value={plan3mPrice}
                onChange={(e) => setPlan3mPrice(e.target.value)}
                className="w-full px-3 py-2 rounded-[6px] glass-input focus:outline-none"
              />
            </div>
            <div className="glass-card p-4 rounded-[6px] space-y-2">
              <label className="block text-slate-400 font-bold">6 Months Pass Price ($ USD)</label>
              <input
                type="number"
                step="0.01"
                value={plan6mPrice}
                onChange={(e) => setPlan6mPrice(e.target.value)}
                className="w-full px-3 py-2 rounded-[6px] glass-input focus:outline-none"
              />
            </div>
            <div className="glass-card p-4 rounded-[6px] space-y-2">
              <label className="block text-slate-400 font-bold">12 Months VIP Pass Price ($ USD)</label>
              <input
                type="number"
                step="0.01"
                value={plan12mPrice}
                onChange={(e) => setPlan12mPrice(e.target.value)}
                className="w-full px-3 py-2 rounded-[6px] glass-input focus:outline-none"
              />
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: SYSTEM LIMITS & ADS */}
      {activeTab === 'settings' && (
        <div className="glass-panel p-6 rounded-[12px] space-y-6">
          <div className="flex items-center justify-between border-b border-[#E6E6E6]/10 pb-3">
            <h2 className="font-bold text-current text-xs font-mono uppercase">System Controls & AdSense Toggles</h2>
            <button
              onClick={handleSaveSettings}
              className="btn-fintech-primary text-xs"
            >
              Save Controls
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs">
            <div className="glass-card p-4 rounded-[6px] space-y-2 font-mono">
              <label className="block text-slate-400 font-bold">DEFAULT FREE FETCH LIMIT</label>
              <input
                type="number"
                value={freeFetchLimit}
                onChange={(e) => setFreeFetchLimit(e.target.value)}
                className="w-full px-3 py-2 rounded-[6px] glass-input focus:outline-none"
              />
              <p className="text-[11px] text-slate-400">Number of free fetches granted to non-paying users.</p>
            </div>

            <div className="glass-card p-4 rounded-[6px] space-y-4">
              <span className="block text-slate-400 font-mono font-bold text-xs uppercase">AdSense Controls</span>
              
              <label className="flex items-center justify-between text-current cursor-pointer text-xs">
                <span>Show Ads to Free Users</span>
                <input
                  type="checkbox"
                  checked={adsFreeUsers}
                  onChange={(e) => setAdsFreeUsers(e.target.checked)}
                  className="w-4 h-4 rounded text-[#635BFF]"
                />
              </label>

              <label className="flex items-center justify-between text-current cursor-pointer text-xs">
                <span>Show Ads to Paid Subscribers</span>
                <input
                  type="checkbox"
                  checked={adsPaidUsers}
                  onChange={(e) => setAdsPaidUsers(e.target.checked)}
                  className="w-4 h-4 rounded text-[#635BFF]"
                />
              </label>
            </div>
          </div>
        </div>
      )}

      {/* New Blog Post Modal */}
      {showBlogModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="relative w-full max-w-2xl glass-panel border-white/20 rounded-[12px] p-6 sm:p-8 shadow-lift text-current space-y-4 text-xs">
            <button
              onClick={() => setShowBlogModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-current p-1"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-bold text-current">Create New Technical Article</h3>

            <form onSubmit={handleCreateBlogPost} className="space-y-4">
              <div>
                <label className="block text-slate-400 font-medium mb-1">Article Title *</label>
                <input
                  type="text"
                  placeholder="e.g. Complete Guide to Telegram Media Downloading"
                  value={newBlogTitle}
                  onChange={(e) => setNewBlogTitle(e.target.value)}
                  required
                  className="w-full px-3 py-2 rounded-[6px] glass-input text-current focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-medium mb-1">Category</label>
                <select
                  value={newBlogCategory}
                  onChange={(e) => setNewBlogCategory(e.target.value)}
                  className="w-full px-3 py-2 rounded-[6px] glass-input text-current font-mono focus:outline-none"
                >
                  <option value="Guides">Guides</option>
                  <option value="Tutorials">Tutorials</option>
                  <option value="Updates">Updates</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-400 font-medium mb-1">Content (Markdown Supported) *</label>
                <textarea
                  rows={8}
                  placeholder="# Heading\n\nArticle body..."
                  value={newBlogContent}
                  onChange={(e) => setNewBlogContent(e.target.value)}
                  required
                  className="w-full px-3 py-2 rounded-[6px] glass-input text-current font-mono text-xs focus:outline-none resize-none"
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full btn-fintech-primary text-xs"
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
