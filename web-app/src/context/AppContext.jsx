import React, { createContext, useContext, useState, useEffect } from 'react'

const AppContext = createContext()

export function AppProvider({ children }) {
  // System Settings State
  const [systemSettings, setSystemSettings] = useState(() => {
    const saved = localStorage.getItem('tg_system_settings')
    return saved ? JSON.parse(saved) : {
      freeFetchLimit: 5,
      adsFreeUsers: true,
      adsPaidUsers: false,
      paymentQrCodeUrl: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=400&q=80',
      paymentUpiId: 'admin@upi',
      paymentPaypalMe: 'https://paypal.me/admin',
      paymentBankDetails: 'Bank: Global Bank | Acc: 1234567890 | IFSC/SWIFT: GBNK001',
      paymentCryptoWallet: 'USDT TRC20: T9xXXxxxxxxxxxxxxxxxxxxxxxxxx',
      plan3mPrice: 14.99,
      plan6mPrice: 24.99,
      plan12mPrice: 39.99
    }
  })

  // Payment Verification Requests State
  const [payments, setPayments] = useState(() => {
    const saved = localStorage.getItem('tg_payment_verifications')
    return saved ? JSON.parse(saved) : [
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
        status: 'pending' // pending, approved, rejected
      }
    ]
  })

  // Contact Messages State
  const [contactMessages, setContactMessages] = useState(() => {
    const saved = localStorage.getItem('tg_contact_messages')
    return saved ? JSON.parse(saved) : [
      {
        id: 'cm-001',
        name: 'Sarah Connor',
        email: 'sarah@example.com',
        subject: 'Payment Verification Support',
        message: 'Hi, I paid via PayPal and submitted my transaction ref. Please verify my 12-month VIP subscription.',
        date: '2026-03-29 11:30 AM',
        status: 'unread' // unread, read, replied
      }
    ]
  })

  // Blog Posts State
  const [blogPosts, setBlogPosts] = useState(() => {
    const saved = localStorage.getItem('tg_blog_posts')
    return saved ? JSON.parse(saved) : [
      {
        id: 'post-1',
        title: 'How to Download Telegram Media Files Directly in Your Browser',
        slug: 'how-to-download-telegram-media-files-directly',
        excerpt: 'A complete step-by-step guide on how to browse, filter, and download videos, documents, music, and zip files from any Telegram channel directly in your browser.',
        category: 'Guides',
        tags: ['Telegram', 'Downloader', 'Tutorial'],
        date: '2026-03-25',
        author: 'TG Downloader Team',
        readTime: 5,
        cover: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80',
        content: `# How to Download Telegram Media Files Directly in Your Browser\n\nTelegram has become one of the most popular platforms for sharing media, documents, educational content, and archives.\n\n## Key Features:\n- Direct browser downloads\n- 9 Category Tabs\n- Topic Picker selector\n- Date & Size Filters`
      },
      {
        id: 'post-2',
        title: 'Understanding Telegram Forum Topics and Categorized Downloads',
        slug: 'understanding-telegram-forum-topics-and-categorized-downloads',
        excerpt: 'Learn how Telegram Forum Topics work and how to easily isolate and download media from specific sub-topics.',
        category: 'Tutorials',
        tags: ['Telegram Forum', 'Topics', 'Media Filtering'],
        date: '2026-03-20',
        author: 'TG Downloader Team',
        readTime: 4,
        cover: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1200&q=80',
        content: `# Understanding Telegram Forum Topics\n\nTelegram Forum Topics allow large communities to organize discussions into sub-channels.\n\n## Benefits:\n- Isolate study materials\n- Avoid fetching unnecessary messages\n- Download specific sub-topics`
      }
    ]
  })

  // Active Subscription State
  const [activeSubscription, setActiveSubscription] = useState(() => {
    const saved = localStorage.getItem('tg_user_subscription')
    return saved ? JSON.parse(saved) : null
  })

  // Sync to LocalStorage
  useEffect(() => {
    localStorage.setItem('tg_system_settings', JSON.stringify(systemSettings))
  }, [systemSettings])

  useEffect(() => {
    localStorage.setItem('tg_payment_verifications', JSON.stringify(payments))
  }, [payments])

  useEffect(() => {
    localStorage.setItem('tg_contact_messages', JSON.stringify(contactMessages))
  }, [contactMessages])

  useEffect(() => {
    localStorage.setItem('tg_blog_posts', JSON.stringify(blogPosts))
  }, [blogPosts])

  useEffect(() => {
    if (activeSubscription) {
      localStorage.setItem('tg_user_subscription', JSON.stringify(activeSubscription))
    } else {
      localStorage.removeItem('tg_user_subscription')
    }
  }, [activeSubscription])

  // Public Actions
  const submitContactForm = (messageData) => {
    const newMsg = {
      id: `cm-${Date.now()}`,
      ...messageData,
      date: new Date().toLocaleString(),
      status: 'unread'
    }
    setContactMessages(prev => [newMsg, ...prev])
  }

  const submitPaymentVerification = (paymentData) => {
    const newPayment = {
      id: `pv-${Date.now()}`,
      ...paymentData,
      date: new Date().toLocaleString(),
      status: 'pending'
    }
    setPayments(prev => [newPayment, ...prev])
  }

  // Admin CRUD Actions
  const approvePaymentAdmin = (paymentId) => {
    setPayments(prev => prev.map(p => {
      if (p.id === paymentId) {
        const approved = { ...p, status: 'approved' }
        // Activate subscription for user
        setActiveSubscription({
          planName: p.planName || 'PRO Plan',
          durationMonths: p.planId === 'plan_12m' ? 12 : p.planId === 'plan_6m' ? 6 : 3,
          startsAt: new Date().toISOString(),
          expiresAt: new Date(Date.now() + 90 * 86400000).toISOString(),
          status: 'active'
        })
        return approved
      }
      return p
    }))
  }

  const rejectPaymentAdmin = (paymentId) => {
    setPayments(prev => prev.map(p => p.id === paymentId ? { ...p, status: 'rejected' } : p))
  }

  const addBlogPostAdmin = (postData) => {
    const newPost = {
      id: `post-${Date.now()}`,
      ...postData,
      slug: postData.slug || postData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      date: new Date().toISOString().split('T')[0],
      author: 'Admin',
      readTime: Math.ceil(postData.content.length / 500) || 3
    }
    setBlogPosts(prev => [newPost, ...prev])
  }

  const updateSystemSettingsAdmin = (newSettings) => {
    setSystemSettings(prev => ({ ...prev, ...newSettings }))
  }

  const markContactReadAdmin = (msgId) => {
    setContactMessages(prev => prev.map(c => c.id === msgId ? { ...c, status: 'read' } : c))
  }

  const value = {
    systemSettings,
    payments,
    contactMessages,
    blogPosts,
    activeSubscription,
    submitContactForm,
    submitPaymentVerification,
    approvePaymentAdmin,
    rejectPaymentAdmin,
    addBlogPostAdmin,
    updateSystemSettingsAdmin,
    markContactReadAdmin
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useApp() {
  return useContext(AppContext)
}
