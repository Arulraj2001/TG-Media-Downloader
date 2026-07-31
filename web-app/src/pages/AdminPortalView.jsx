import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useApp } from '../context/AppContext'
import { supabase } from '../lib/supabase'
import SeoMeta from '../components/SeoMeta'
import ThemeToggle from '../components/ThemeToggle'
import { 
  Shield, Check, X, Eye, FileText, DollarSign, MessageSquare, 
  Settings, PenTool, LayoutDashboard, Sliders, CheckCircle2, Clock, 
  AlertCircle, Sparkles, Image as ImageIcon, Plus, Edit3, Trash2, Terminal,
  Bold, Italic, Code, List, Quote, Heading1, Heading2, Heading3, Download, DownloadCloud, Activity,
  Users, UserCheck, UserX, ArrowLeft, LogOut, Search, Megaphone, Lock, RefreshCw, BarChart2
} from 'lucide-react'

export default function AdminPortalView() {
  const { isAdmin, adminSignOut } = useAuth()
  const navigate = useNavigate()
  const {
    systemSettings, payments, contactMessages, blogPosts,
    approvePaymentAdmin, rejectPaymentAdmin, addBlogPostAdmin, updateBlogPostAdmin, deleteBlogPostAdmin, updateSystemSettingsAdmin,
    submitPaymentVerification
  } = useApp()

  const [activeTab, setActiveTab] = useState('analytics')

  // System Settings State
  const [freeFetchLimit, setFreeFetchLimit] = useState(systemSettings.freeFetchLimit || 5)
  const [adsFreeUsers, setAdsFreeUsers] = useState(systemSettings.adsFreeUsers ?? true)
  const [adsPaidUsers, setAdsPaidUsers] = useState(systemSettings.adsPaidUsers ?? false)
  const [upiId, setUpiId] = useState(systemSettings.paymentUpiId || 'admin@upi')
  const [paypalMe, setPaypalMe] = useState(systemSettings.paymentPaypalMe || 'https://paypal.me/admin')
  const [qrCodeUrl, setQrCodeUrl] = useState(systemSettings.paymentQrCodeUrl || 'https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=upi://pay?pa=admin@upi&pn=TG%20Downloader')

  const handleQrCodeUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setQrCodeUrl(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  // Pricing State
  const [plan3mPrice, setPlan3mPrice] = useState(systemSettings.plan3mPrice || 14.99)
  const [plan6mPrice, setPlan6mPrice] = useState(systemSettings.plan6mPrice || 24.99)
  const [plan12mPrice, setPlan12mPrice] = useState(systemSettings.plan12mPrice || 39.99)

  // Advanced Blog Editor State
  const [editingPostId, setEditingPostId] = useState(null)
  const [postTitle, setPostTitle] = useState('')
  const [postSlug, setPostSlug] = useState('')
  const [postCategory, setPostCategory] = useState('Guides')
  const [postReadTime, setPostReadTime] = useState(5)
  const [postAuthor, setPostAuthor] = useState('TG Downloader Team')
  const [postCover, setPostCover] = useState('https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80')
  const [postMetaDesc, setPostMetaDesc] = useState('')
  const [postKeywords, setPostKeywords] = useState('')
  const [postContent, setPostContent] = useState('')
  const [editorMode, setEditorMode] = useState('edit')

  // Admin auth state managed by AuthContext + AdminRoute in App.jsx
  // No in-component login form needed — unauthenticated users are redirected by AdminRoute.

  // Supabase Live Data State
  const [dbPayments, setDbPayments] = useState([])
  const [dbLoading, setDbLoading] = useState(false)

  const fetchDbPayments = async () => {
    setDbLoading(true)
    const { data, error } = await supabase
      .from('payment_verifications')
      .select('*, profiles(email, full_name)')
      .order('created_at', { ascending: false })
    if (!error && data) {
      setDbPayments(data)
    }
    setDbLoading(false)
  }

  useEffect(() => {
    if (isAdmin) {
      fetchDbPayments()
    }
  }, [isAdmin])

  // 1-Click Approve Payment in Supabase DB
  const approvePayment = async (payment) => {
    try {
      // 1. Calculate expiration date based on plan
      const months = payment.plan_id?.includes('12') ? 12 : payment.plan_id?.includes('6') ? 6 : 3
      const expDate = new Date()
      expDate.setMonth(expDate.getMonth() + months)
      const expiresAtIso = expDate.toISOString()

      // 2. Update payment_verifications status
      const { error: payErr } = await supabase
        .from('payment_verifications')
        .update({ status: 'approved', reviewed_at: new Date().toISOString() })
        .eq('id', payment.id)
      if (payErr) throw payErr

      // 3. Upsert user_subscriptions row
      const { error: subErr } = await supabase
        .from('user_subscriptions')
        .insert({
          user_id: payment.user_id,
          plan_id: payment.plan_id || 'plan_6m',
          status: 'active',
          starts_at: new Date().toISOString(),
          expires_at: expiresAtIso,
          payment_method: payment.payment_method,
          reference_id: payment.reference_id,
        })

      // 4. Update profile subscription_end and subscription_plan
      const { error: profErr } = await supabase
        .from('profiles')
        .update({
          subscription_end: expiresAtIso,
          subscription_plan: payment.plan_id || '6 Months Pass',
        })
        .eq('id', payment.user_id)

      alert('Payment APPROVED! User subscription activated until ' + expDate.toLocaleDateString())
      fetchDbPayments()
    } catch (err) {
      alert('Error approving payment: ' + err.message)
    }
  }

  const rejectPayment = async (paymentId) => {
    if (!window.confirm('Reject this payment request?')) return
    const { error } = await supabase
      .from('payment_verifications')
      .update({ status: 'rejected', reviewed_at: new Date().toISOString() })
      .eq('id', paymentId)
    if (!error) {
      alert('Payment request rejected.')
      fetchDbPayments()
    }
  }

  // Formatting Toolbar Helper
  const insertFormatting = (prefix, suffix = '') => {
    setPostContent(prev => prev + `${prefix}${suffix}`)
  }

  const handleAutoSlug = (titleText) => {
    setPostTitle(titleText)
    if (!editingPostId) {
      const generated = titleText.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
      setPostSlug(generated)
    }
  }

  const handleSavePost = (e) => {
    e.preventDefault()
    if (!postTitle || !postContent) {
      alert('Please fill in title and content.')
      return
    }

    const payload = {
      title: postTitle,
      slug: postSlug || postTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
      category: postCategory,
      readTime: parseInt(postReadTime) || 5,
      author: postAuthor,
      cover: postCover,
      metaDesc: postMetaDesc || postContent.slice(0, 160),
      keywords: postKeywords,
      excerpt: postMetaDesc || postContent.slice(0, 150) + '...',
      content: postContent
    }

    if (editingPostId) {
      updateBlogPostAdmin(editingPostId, payload)
      alert('Blog post updated successfully!')
    } else {
      addBlogPostAdmin(payload)
      alert('New article published successfully!')
    }

    resetBlogForm()
  }

  const handleEditClick = (post) => {
    setEditingPostId(post.id)
    setPostTitle(post.title)
    setPostSlug(post.slug)
    setPostCategory(post.category || 'Guides')
    setPostReadTime(post.readTime || 5)
    setPostAuthor(post.author || 'TG Downloader Team')
    setPostCover(post.cover || '')
    setPostMetaDesc(post.metaDesc || post.excerpt || '')
    setPostKeywords(post.keywords || '')
    setPostContent(post.content || '')
    setEditorMode('edit')
  }

  const handleDeletePost = (postId) => {
    if (window.confirm('Are you sure you want to delete this article?')) {
      deleteBlogPostAdmin(postId)
    }
  }

  const resetBlogForm = () => {
    setEditingPostId(null)
    setPostTitle('')
    setPostSlug('')
    setPostCategory('Guides')
    setPostReadTime(5)
    setPostAuthor('TG Downloader Team')
    setPostCover('https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80')
    setPostMetaDesc('')
    setPostKeywords('')
    setPostContent('')
  }

  const handleManualGrantPass = (e) => {
    e.preventDefault()
    if (!manualUserEmail) return
    submitPaymentVerification({
      userName: manualUserName || manualUserEmail.split('@')[0],
      userEmail: manualUserEmail,
      planName: manualPlan,
      planId: manualPlan.includes('3') ? 'plan_3m' : manualPlan.includes('6') ? 'plan_6m' : 'plan_12m',
      amount: manualPlan.includes('3') ? '$14.99' : manualPlan.includes('6') ? '$24.99' : '$39.99',
      method: 'Admin Manual Pass Grant',
      refId: `ADMIN-GRANT-${Date.now()}`
    })
    alert(`Pass granted to ${manualUserEmail}! Head to Payment Verifications tab to click Approve.`)
    setManualUserEmail('')
    setManualUserName('')
  }

  const handleSaveSettings = () => {
    updateSystemSettingsAdmin({
      freeFetchLimit: parseInt(freeFetchLimit) || 5,
      adsFreeUsers,
      adsPaidUsers,
      paymentUpiId: upiId,
      paymentPaypalMe: paypalMe,
      paymentQrCodeUrl: qrCodeUrl,
      plan3mPrice: parseFloat(plan3mPrice) || 14.99,
      plan6mPrice: parseFloat(plan6mPrice) || 24.99,
      plan12mPrice: parseFloat(plan12mPrice) || 39.99
    })
    alert('System settings, Payment QR Code, & subscription prices updated across the web app!')
  }

  const handleExportDatabaseJSON = () => {
    const data = {
      systemSettings,
      payments,
      contactMessages,
      blogPosts,
      exportDate: new Date().toISOString()
    }
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `tg-downloader-backup-${Date.now()}.json`
    a.click()
  }

  // User Management State (kept for admin manual pass grant)
  const [manualUserEmail, setManualUserEmail] = useState('')
  const [manualUserName, setManualUserName] = useState('')
  const [manualPlan, setManualPlan] = useState('6 Months Pass')
  const [viewProofUrl, setViewProofUrl] = useState(null)

  // AdminRoute in App.jsx already guarantees isAdmin === true here.
  // No secondary login gate needed.

  // Calculate Revenue Telemetry
  const approvedPayments = payments.filter(p => p.status === 'approved')
  const totalEstimatedRevenue = approvedPayments.length * 24.99

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-[#F1F5F9] dark:bg-[#121215] text-slate-900 dark:text-white transition-colors duration-300">
      <SeoMeta title="Admin Master Control Portal - TG Media Downloader" description="Platform master control portal." />

      {/* ── LEFT SIDEBAR NAVIGATION (No Footer) ── */}
      <aside className="w-full md:w-64 glass-panel rounded-none border-r border-[#CBD5E1] dark:border-white/10 p-6 flex flex-col justify-between shrink-0 space-y-6 md:min-h-screen">
        <div className="space-y-6">
          
          {/* Brand & Admin Badge */}
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-[6px] bg-[#635BFF] flex items-center justify-center text-white font-bold">
                <Shield className="w-5 h-5" />
              </div>
              <div>
                <h1 className="font-extrabold text-base text-current leading-tight font-display">Admin Portal</h1>
                <span className="text-[10px] text-[#635BFF] font-mono font-bold uppercase">MASTER CONTROL PORTAL</span>
              </div>
            </div>

            <div className="p-2.5 rounded-[6px] glass-card text-xs font-mono">
              <p className="text-slate-500 dark:text-slate-400">AUTHORIZED ADMIN</p>
              <p className="font-bold text-emerald-500">● SESSION ACTIVE</p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1.5 font-mono text-xs font-semibold">
            {[
              { id: 'analytics', label: 'Telemetry & Revenue', icon: LayoutDashboard, badge: 0 },
              { id: 'blog', label: 'Article Publisher', icon: PenTool, badge: blogPosts.length },
              { id: 'payments', label: 'Payment Verifications', icon: DollarSign, badge: payments.filter(p => p.status === 'pending').length },
              { id: 'users', label: 'User Subscriptions', icon: Users, badge: approvedPayments.length },
              { id: 'contact', label: 'Helpdesk Inbox', icon: MessageSquare, badge: contactMessages.filter(c => c.status === 'unread').length },
              { id: 'pricing', label: 'Pricing & Plans', icon: Sliders, badge: 0 },
              { id: 'settings', label: 'System & AdSense', icon: Settings, badge: 0 },
            ].map(tab => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-[6px] transition ${
                    activeTab === tab.id
                      ? 'bg-[#635BFF] text-white font-bold shadow-sm'
                      : 'text-slate-700 dark:text-slate-300 hover:bg-slate-200/60 dark:hover:bg-white/5'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className="w-4 h-4" />
                    <span>{tab.label}</span>
                  </div>
                  {tab.badge > 0 && (
                    <span className="px-2 py-0.5 rounded-full bg-[#FF4B4B] text-white text-[10px] font-bold">
                      {tab.badge}
                    </span>
                  )}
                </button>
              )
            })}
          </nav>
        </div>

        {/* Sidebar Bottom Controls */}
        <div className="space-y-3 pt-4 border-t border-[#CBD5E1] dark:border-white/10 font-mono text-xs">
          <div className="flex items-center justify-between">
            <span className="text-slate-500">Theme</span>
            <ThemeToggle />
          </div>

          <button
            onClick={handleExportDatabaseJSON}
            className="w-full py-2 px-3 rounded-[6px] bg-[#635BFF]/10 text-[#635BFF] hover:bg-[#635BFF]/20 font-bold border border-[#635BFF]/30 transition flex items-center justify-center gap-1.5"
          >
            <DownloadCloud className="w-4 h-4" /> Export Backup
          </button>

          <button
            onClick={() => { adminSignOut(); navigate('/login') }}
            className="w-full py-2 px-3 rounded-[6px] bg-[#FF4B4B]/10 hover:bg-[#FF4B4B]/20 text-[#FF4B4B] font-bold border border-[#FF4B4B]/30 transition flex items-center justify-center gap-1.5"
          >
            <LogOut className="w-4 h-4" /> Sign Out
          </button>

          <a href="/" className="block text-center text-slate-500 hover:text-[#635BFF] text-[11px] pt-1">
            ← Return to Public Website
          </a>
        </div>
      </aside>

      {/* ── RIGHT MAIN WORKSPACE CONTENT ── */}
      <main className="flex-1 p-6 sm:p-10 space-y-8 max-w-6xl">

        {/* TAB 1: TELEMETRY & REVENUE DASHBOARD */}
        {activeTab === 'analytics' && (
          <div className="space-y-6">
            <div className="space-y-1">
              <h2 className="text-2xl font-extrabold text-current font-display">Telemetry & Revenue Intelligence</h2>
              <p className="text-xs font-mono text-slate-500">REAL-TIME PLATFORM METRICS & USER CONVERSIONS</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-6 font-mono">
              <div className="glass-panel p-6 rounded-[12px] space-y-1">
                <span className="text-xs text-slate-500 font-bold uppercase">VERIFIED REVENUE</span>
                <p className="text-3xl font-extrabold text-[#00C48C]">${totalEstimatedRevenue.toFixed(2)}</p>
                <p className="text-[11px] text-slate-500">From {approvedPayments.length} approved subscriptions</p>
              </div>

              <div className="glass-panel p-6 rounded-[12px] space-y-1">
                <span className="text-xs text-slate-500 font-bold uppercase">PENDING VERIFICATIONS</span>
                <p className="text-3xl font-extrabold text-[#FFC700]">{payments.filter(p => p.status === 'pending').length}</p>
                <p className="text-[11px] text-slate-500">Requires 1-click approval</p>
              </div>

              <div className="glass-panel p-6 rounded-[12px] space-y-1">
                <span className="text-xs text-slate-500 font-bold uppercase">PUBLISHED ARTICLES</span>
                <p className="text-3xl font-extrabold text-[#635BFF]">{blogPosts.length}</p>
                <p className="text-[11px] text-slate-500">Google SEO Index: ACTIVE</p>
              </div>

              <div className="glass-panel p-6 rounded-[12px] space-y-1">
                <span className="text-xs text-slate-500 font-bold uppercase">UNREAD HELPDESK</span>
                <p className="text-3xl font-extrabold text-current">{contactMessages.filter(c => c.status === 'unread').length}</p>
                <p className="text-[11px] text-slate-500">Inbound support tickets</p>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: ADVANCED ARTICLE PUBLISHER */}
        {activeTab === 'blog' && (
          <div className="space-y-8">
            <div className="glass-panel p-6 sm:p-8 rounded-[12px] space-y-6">
              <div className="flex items-center justify-between border-b border-[#CBD5E1] dark:border-white/10 pb-4">
                <div>
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white font-display">
                    {editingPostId ? 'Edit Published Article' : 'Compose New SEO Article'}
                  </h2>
                  <p className="text-xs font-mono text-slate-500">
                    Rich formatting bar, SEO meta tags, custom slug generator, and live preview mode.
                  </p>
                </div>

                <div className="flex items-center gap-2 font-mono text-xs">
                  <button
                    type="button"
                    onClick={() => setEditorMode('edit')}
                    className={`px-3 py-1.5 rounded-[6px] font-bold transition ${
                      editorMode === 'edit' ? 'bg-[#635BFF] text-white' : 'glass-card text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    Editor
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditorMode('preview')}
                    className={`px-3 py-1.5 rounded-[6px] font-bold transition ${
                      editorMode === 'preview' ? 'bg-[#635BFF] text-white' : 'glass-card text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    Live Preview
                  </button>
                  {editingPostId && (
                    <button
                      type="button"
                      onClick={resetBlogForm}
                      className="px-3 py-1.5 rounded-[6px] bg-[#FF4B4B]/10 text-[#FF4B4B] font-bold border border-[#FF4B4B]/30"
                    >
                      Cancel Edit
                    </button>
                  )}
                </div>
              </div>

              {editorMode === 'edit' ? (
                <form onSubmit={handleSavePost} className="space-y-5 text-sm font-mono">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">Article Title *</label>
                      <input
                        type="text"
                        placeholder="e.g. How to Download Telegram Files in Bulk (2026 Guide)"
                        value={postTitle}
                        onChange={(e) => handleAutoSlug(e.target.value)}
                        required
                        className="w-full px-3.5 py-2.5 rounded-[6px] glass-input text-slate-900 dark:text-white focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">URL Slug *</label>
                      <input
                        type="text"
                        placeholder="e.g. download-telegram-files-bulk-guide"
                        value={postSlug}
                        onChange={(e) => setPostSlug(e.target.value)}
                        required
                        className="w-full px-3.5 py-2.5 rounded-[6px] glass-input text-slate-900 dark:text-white focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">Category</label>
                      <select
                        value={postCategory}
                        onChange={(e) => setPostCategory(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-[6px] glass-input text-slate-900 dark:text-white focus:outline-none"
                      >
                        <option value="Guides" className="bg-white dark:bg-[#1A1A1A]">Guides</option>
                        <option value="Tutorials" className="bg-white dark:bg-[#1A1A1A]">Tutorials</option>
                        <option value="Security" className="bg-white dark:bg-[#1A1A1A]">Security</option>
                        <option value="Updates" className="bg-white dark:bg-[#1A1A1A]">Updates</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">Est. Read Time (Mins)</label>
                      <input
                        type="number"
                        value={postReadTime}
                        onChange={(e) => setPostReadTime(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-[6px] glass-input text-slate-900 dark:text-white focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">Author Name</label>
                      <input
                        type="text"
                        value={postAuthor}
                        onChange={(e) => setPostAuthor(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-[6px] glass-input text-slate-900 dark:text-white focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">Cover Image URL</label>
                      <input
                        type="text"
                        placeholder="https://images.unsplash.com/photo-..."
                        value={postCover}
                        onChange={(e) => setPostCover(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-[6px] glass-input text-slate-900 dark:text-white focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">Target Keywords</label>
                      <input
                        type="text"
                        placeholder="e.g. telegram media downloader, mtproto stream"
                        value={postKeywords}
                        onChange={(e) => setPostKeywords(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-[6px] glass-input text-slate-900 dark:text-white focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">SEO Meta Description (Google Snippet)</label>
                    <textarea
                      rows={2}
                      placeholder="Enter 150-160 character description for Google search results..."
                      value={postMetaDesc}
                      onChange={(e) => setPostMetaDesc(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-[6px] glass-input text-slate-900 dark:text-white focus:outline-none resize-none"
                    ></textarea>
                  </div>

                  {/* Rich Formatting Toolbar */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="block text-slate-700 dark:text-slate-300 font-bold">Article Body Content (Markdown Enabled)</label>
                      <div className="flex items-center gap-1.5 p-1 rounded-[6px] glass-card">
                        <button type="button" onClick={() => insertFormatting('\n# ')} className="p-1 rounded hover:bg-slate-200 dark:hover:bg-white/10" title="Heading 1"><Heading1 className="w-4 h-4" /></button>
                        <button type="button" onClick={() => insertFormatting('\n## ')} className="p-1 rounded hover:bg-slate-200 dark:hover:bg-white/10" title="Heading 2"><Heading2 className="w-4 h-4" /></button>
                        <button type="button" onClick={() => insertFormatting('\n### ')} className="p-1 rounded hover:bg-slate-200 dark:hover:bg-white/10" title="Heading 3"><Heading3 className="w-4 h-4" /></button>
                        <button type="button" onClick={() => insertFormatting('**', '**')} className="p-1 rounded hover:bg-slate-200 dark:hover:bg-white/10" title="Bold"><Bold className="w-4 h-4" /></button>
                        <button type="button" onClick={() => insertFormatting('*', '*')} className="p-1 rounded hover:bg-slate-200 dark:hover:bg-white/10" title="Italic"><Italic className="w-4 h-4" /></button>
                        <button type="button" onClick={() => insertFormatting('`', '`')} className="p-1 rounded hover:bg-slate-200 dark:hover:bg-white/10" title="Code"><Code className="w-4 h-4" /></button>
                        <button type="button" onClick={() => insertFormatting('\n- ')} className="p-1 rounded hover:bg-slate-200 dark:hover:bg-white/10" title="List"><List className="w-4 h-4" /></button>
                        <button type="button" onClick={() => insertFormatting('\n> ')} className="p-1 rounded hover:bg-slate-200 dark:hover:bg-white/10" title="Quote"><Quote className="w-4 h-4" /></button>
                      </div>
                    </div>

                    <textarea
                      rows={12}
                      placeholder="Write detailed markdown content here..."
                      value={postContent}
                      onChange={(e) => setPostContent(e.target.value)}
                      required
                      className="w-full p-4 rounded-[6px] glass-input text-slate-900 dark:text-white font-mono text-sm focus:outline-none resize-none"
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    className="btn-fintech-primary text-sm font-bold w-full sm:w-auto"
                  >
                    {editingPostId ? 'Update Published Article' : 'Publish Article to Blog'}
                  </button>
                </form>
              ) : (
                <div className="space-y-4 font-sans max-w-3xl">
                  <div className="flex items-center gap-3 text-xs font-mono text-[#635BFF]">
                    <span>{postCategory}</span>
                    <span>•</span>
                    <span>{postReadTime} MIN READ</span>
                  </div>
                  <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white font-display">{postTitle || 'Untitled Article'}</h1>
                  {postCover && (
                    <img src={postCover} alt="Cover Preview" className="w-full h-64 object-cover rounded-[8px]" />
                  )}
                  <div className="glass-panel p-6 rounded-[8px] whitespace-pre-line text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                    {postContent || 'Article body preview will render here...'}
                  </div>
                </div>
              )}
            </div>

            {/* Published Articles List */}
            <div className="glass-panel p-6 rounded-[12px] space-y-4">
              <h3 className="font-bold text-slate-900 dark:text-white text-sm font-mono uppercase">
                Published Articles ({blogPosts.length})
              </h3>

              <div className="space-y-3 font-mono">
                {blogPosts.map(bp => (
                  <div key={bp.id} className="glass-card p-4 rounded-[6px] flex items-center justify-between text-xs">
                    <div className="space-y-1">
                      <span className="font-bold text-slate-900 dark:text-white text-base font-display">{bp.title}</span>
                      <p className="text-slate-500 text-xs">
                        Category: <strong className="text-[#635BFF]">{bp.category}</strong> • Slug: <code>/blog/{bp.slug}</code>
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleEditClick(bp)}
                        className="p-2 rounded-[4px] bg-[#635BFF]/10 text-[#635BFF] hover:bg-[#635BFF]/20 font-bold"
                        title="Edit Article"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeletePost(bp.id)}
                        className="p-2 rounded-[4px] bg-[#FF4B4B]/10 text-[#FF4B4B] hover:bg-[#FF4B4B]/20 font-bold"
                        title="Delete Article"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: PAYMENT VERIFICATIONS */}
        {activeTab === 'payments' && (
          <div className="glass-panel p-6 rounded-[12px] space-y-6">
            <div className="flex items-center justify-between border-b border-[#CBD5E1] dark:border-white/10 pb-3">
              <h2 className="font-bold text-slate-900 dark:text-white text-sm font-mono uppercase font-display">Pending Payment Requests</h2>
              <span className="text-xs text-slate-500 font-mono">1-CLICK VERIFICATION WITH SCREENSHOT PROOF</span>
            </div>

            <div className="space-y-3">
              {dbPayments.length === 0 ? (
                <p className="text-center py-8 text-slate-500 font-mono text-xs">
                  {dbLoading ? 'Loading payment verification requests...' : 'No payment verification requests in Supabase database.'}
                </p>
              ) : (
                dbPayments.map(p => (
                  <div key={p.id} className="glass-card p-4 rounded-[6px] space-y-3 text-xs">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="space-y-1 font-mono">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-900 dark:text-white text-base">
                            {p.profiles?.full_name || 'User'}
                          </span>
                          <span className="text-slate-500">({p.profiles?.email || 'No email'})</span>
                          <span className="badge-mono bg-[#635BFF]/10 text-[#635BFF] border border-[#635BFF]/20 font-bold">
                            {p.plan_id} — ${p.amount_paid} {p.currency}
                          </span>
                        </div>

                        <p className="text-slate-500 text-xs">
                          Method: <strong className="text-slate-900 dark:text-white">{p.payment_method}</strong> • Ref ID: <strong className="text-[#FFC700]">{p.reference_id}</strong> • Submitted: {new Date(p.created_at).toLocaleString()}
                        </p>
                        
                        {(p.screenshot_url || p.proofUrl) && (
                          <div className="pt-2 flex items-center gap-3">
                            <button
                              type="button"
                              onClick={() => setViewProofUrl(p.screenshot_url || p.proofUrl)}
                              className="px-3 py-1 rounded-[6px] bg-[#635BFF]/10 text-[#635BFF] hover:bg-[#635BFF]/20 border border-[#635BFF]/30 font-bold flex items-center gap-1.5"
                            >
                              <ImageIcon className="w-3.5 h-3.5" /> View Payment Screenshot Proof
                            </button>
                          </div>
                        )}
                      </div>

                      <div className="flex items-center gap-2 font-mono">
                        {p.status === 'pending' ? (
                          <>
                            <button
                              onClick={() => approvePayment(p)}
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
                            {p.status === 'approved' ? 'APPROVED & ACTIVE' : 'REJECTED'}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* TAB 4: ADVANCED USER SUBSCRIPTIONS MANAGER */}
        {activeTab === 'users' && (
          <div className="glass-panel p-6 rounded-[12px] space-y-6">
            <div className="flex items-center justify-between border-b border-[#CBD5E1] dark:border-white/10 pb-3">
              <h2 className="font-bold text-slate-900 dark:text-white text-sm font-mono uppercase font-display">Manually Grant Pro Pass to User</h2>
            </div>

            <form onSubmit={handleManualGrantPass} className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-mono">
              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">User Email Address *</label>
                <input
                  type="email"
                  placeholder="user@example.com"
                  value={manualUserEmail}
                  onChange={(e) => setManualUserEmail(e.target.value)}
                  required
                  className="w-full px-3 py-2 rounded-[6px] glass-input text-slate-900 dark:text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">User Full Name</label>
                <input
                  type="text"
                  placeholder="John Doe"
                  value={manualUserName}
                  onChange={(e) => setManualUserName(e.target.value)}
                  className="w-full px-3 py-2 rounded-[6px] glass-input text-slate-900 dark:text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">Pass Duration</label>
                <select
                  value={manualPlan}
                  onChange={(e) => setManualPlan(e.target.value)}
                  className="w-full px-3 py-2 rounded-[6px] glass-input text-slate-900 dark:text-white focus:outline-none"
                >
                  <option value="3 Months Pass" className="bg-white dark:bg-[#1A1A1A]">3 Months Pass ($14.99)</option>
                  <option value="6 Months Pass" className="bg-white dark:bg-[#1A1A1A]">6 Months Pass ($24.99)</option>
                  <option value="12 Months VIP Pass" className="bg-white dark:bg-[#1A1A1A]">12 Months VIP Pass ($39.99)</option>
                </select>
              </div>

              <div className="sm:col-span-3">
                <button type="submit" className="btn-fintech-primary text-xs font-bold">
                  Grant Pro Pass to User
                </button>
              </div>
            </form>
          </div>
        )}

        {/* TAB 5: HELPDESK INBOX */}
        {activeTab === 'contact' && (
          <div className="glass-panel p-6 rounded-[12px] space-y-6">
            <div className="flex items-center justify-between border-b border-[#CBD5E1] dark:border-white/10 pb-3">
              <h2 className="font-bold text-slate-900 dark:text-white text-sm font-mono uppercase font-display">Contact Messages Inbox ({contactMessages.length})</h2>
            </div>

            <div className="space-y-3">
              {contactMessages.length === 0 ? (
                <p className="text-center py-8 text-slate-500 font-mono text-xs">No messages in helpdesk inbox.</p>
              ) : (
                contactMessages.map(cm => (
                  <div key={cm.id} className="glass-card p-4 rounded-[6px] space-y-2 text-xs">
                    <div className="flex items-center justify-between border-b border-[#CBD5E1] dark:border-white/10 pb-2 font-mono">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900 dark:text-white">{cm.name}</span>
                        <span className="text-slate-500">({cm.email})</span>
                      </div>
                      <span className="text-slate-500 text-[11px]">{cm.date}</span>
                    </div>
                    <p className="font-semibold text-[#635BFF] font-mono">Subject: {cm.subject}</p>
                    <p className="text-slate-900 dark:text-white bg-slate-100 dark:bg-white/5 p-3 rounded-[6px] border border-[#CBD5E1] dark:border-white/10">{cm.message}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* TAB 6: PRICING & SUBSCRIPTIONS */}
        {activeTab === 'pricing' && (
          <div className="glass-panel p-6 rounded-[12px] space-y-6">
            <div className="flex items-center justify-between border-b border-[#CBD5E1] dark:border-white/10 pb-3">
              <h2 className="font-bold text-slate-900 dark:text-[#FFFFFF] text-sm font-mono uppercase font-display">Subscription Prices & Payment QR Code Setup</h2>
              <button
                onClick={handleSaveSettings}
                className="btn-fintech-primary text-xs"
              >
                Save Pricing Settings
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-xs font-mono">
              <div className="glass-card p-4 rounded-[6px] space-y-2">
                <label className="block text-slate-700 dark:text-slate-300 font-bold">3 Months Pass Price ($ USD)</label>
                <input
                  type="number"
                  step="0.01"
                  value={plan3mPrice}
                  onChange={(e) => setPlan3mPrice(e.target.value)}
                  className="w-full px-3 py-2 rounded-[6px] glass-input focus:outline-none"
                />
              </div>
              <div className="glass-card p-4 rounded-[6px] space-y-2">
                <label className="block text-slate-700 dark:text-slate-300 font-bold">6 Months Pass Price ($ USD)</label>
                <input
                  type="number"
                  step="0.01"
                  value={plan6mPrice}
                  onChange={(e) => setPlan6mPrice(e.target.value)}
                  className="w-full px-3 py-2 rounded-[6px] glass-input focus:outline-none"
                />
              </div>
              <div className="glass-card p-4 rounded-[6px] space-y-2">
                <label className="block text-slate-700 dark:text-slate-300 font-bold">12 Months VIP Pass Price ($ USD)</label>
                <input
                  type="number"
                  step="0.01"
                  value={plan12mPrice}
                  onChange={(e) => setPlan12mPrice(e.target.value)}
                  className="w-full px-3 py-2 rounded-[6px] glass-input focus:outline-none"
                />
              </div>
            </div>

            {/* QR Code & Payment Method Details Setup */}
            <div className="glass-card p-6 rounded-[10px] space-y-4 font-mono text-xs">
              <h3 className="font-bold text-slate-900 dark:text-white text-sm uppercase border-b border-slate-200 dark:border-white/10 pb-2">
                Payment QR Code & Receiving Details Configuration
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-center">
                <div className="space-y-3">
                  <div>
                    <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">UPI / GPay / PhonePe ID</label>
                    <input
                      type="text"
                      placeholder="e.g. admin@upi or 9876543210@paytm"
                      value={upiId}
                      onChange={(e) => setUpiId(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-[6px] glass-input text-current focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">PayPal.me Link</label>
                    <input
                      type="text"
                      placeholder="https://paypal.me/admin"
                      value={paypalMe}
                      onChange={(e) => setPaypalMe(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-[6px] glass-input text-current focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">Upload QR Code Image</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleQrCodeUpload}
                      className="w-full text-xs font-mono text-slate-600 dark:text-slate-400 file:mr-3 file:py-2 file:px-3 file:rounded-[6px] file:border-0 file:bg-[#635BFF]/10 file:text-[#635BFF] file:font-bold"
                    />
                  </div>
                </div>

                {/* QR Image Preview */}
                <div className="flex flex-col items-center justify-center p-4 rounded-[10px] bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 space-y-2">
                  <span className="text-[11px] font-bold text-slate-500 uppercase">Live QR Code User View</span>
                  {qrCodeUrl ? (
                    <img src={qrCodeUrl} alt="Payment QR Code" className="w-44 h-44 object-contain rounded-[8px] border border-slate-300 dark:border-white/20 bg-white p-2 shadow-sm" />
                  ) : (
                    <div className="w-44 h-44 rounded-[8px] bg-slate-200 dark:bg-white/10 flex items-center justify-center text-slate-400">
                      No QR Code Uploaded
                    </div>
                  )}
                  <span className="text-[10px] text-[#00C48C] font-bold">Visible to users in Checkout Modal</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 7: SYSTEM LIMITS & ADS */}
        {activeTab === 'settings' && (
          <div className="glass-panel p-6 rounded-[12px] space-y-6">
            <div className="flex items-center justify-between border-b border-[#CBD5E1] dark:border-white/10 pb-3">
              <h2 className="font-bold text-slate-900 dark:text-[#FFFFFF] text-sm font-mono uppercase font-display">System Controls & AdSense Toggles</h2>
              <button
                onClick={handleSaveSettings}
                className="btn-fintech-primary text-xs"
              >
                Save Controls
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs">
              <div className="glass-card p-4 rounded-[6px] space-y-2 font-mono">
                <label className="block text-slate-700 dark:text-slate-300 font-bold">DEFAULT FREE FETCH LIMIT</label>
                <input
                  type="number"
                  value={freeFetchLimit}
                  onChange={(e) => setFreeFetchLimit(e.target.value)}
                  className="w-full px-3 py-2 rounded-[6px] glass-input focus:outline-none"
                />
                <p className="text-[11px] text-slate-500">Number of free fetches granted to non-paying users.</p>
              </div>

              <div className="glass-card p-4 rounded-[6px] space-y-4">
                <span className="block text-slate-700 dark:text-slate-300 font-mono font-bold text-xs uppercase font-display">AdSense Controls</span>
                
                <label className="flex items-center justify-between text-slate-900 dark:text-white cursor-pointer text-xs">
                  <span>Show Ads to Free Users</span>
                  <input
                    type="checkbox"
                    checked={adsFreeUsers}
                    onChange={(e) => setAdsFreeUsers(e.target.checked)}
                    className="w-4 h-4 rounded text-[#635BFF]"
                  />
                </label>

                <label className="flex items-center justify-between text-slate-900 dark:text-white cursor-pointer text-xs">
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

      </main>

      {/* High-Res Proof Screenshot Modal */}
      {viewProofUrl && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="relative glass-panel rounded-[12px] p-6 max-w-2xl w-full text-current space-y-4 shadow-lift">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-white/10 pb-3">
              <h3 className="font-bold text-base font-display flex items-center gap-2">
                <ImageIcon className="w-5 h-5 text-[#635BFF]" /> Payment Proof Screenshot Receipt
              </h3>
              <button
                onClick={() => setViewProofUrl(null)}
                className="p-1 rounded-[6px] text-slate-400 hover:text-current hover:bg-slate-200 dark:hover:bg-white/10 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex justify-center bg-black/50 p-3 rounded-[8px] max-h-[75vh] overflow-auto">
              <img src={viewProofUrl} alt="Payment Receipt Proof" className="max-w-full h-auto object-contain rounded-[6px]" />
            </div>
          </div>
        </div>
      )}

    </div>
  )
}
