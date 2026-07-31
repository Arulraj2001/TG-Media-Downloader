import React, { createContext, useContext, useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

const AppContext = createContext()

const INITIAL_BLOG_POSTS = [
  {
    id: 1,
    title: 'How to Download Telegram Channel Files in Bulk (2026 Step-by-Step Guide)',
    slug: 'download-telegram-channel-files-bulk-guide',
    category: 'Guides',
    readTime: 6,
    author: 'TG Downloader Team',
    date: '2026-03-28',
    cover: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80',
    metaDesc: 'Learn how to connect your Telegram MTProto API ID and Hash to batch stream and download videos, PDFs, and ZIP archives directly into your browser.',
    keywords: 'telegram bulk downloader, telegram api id, telegram mtproto stream',
    excerpt: 'Learn how to connect your Telegram MTProto API ID and Hash to batch stream and download videos, PDFs, and ZIP archives directly into your browser.',
    content: `## Complete Guide to Bulk Downloading Telegram Media

Telegram channels and public groups contain valuable learning materials, video courses, research datasets, and audio archives. Downloading these files individually through desktop or mobile apps can be extremely tedious.

### Step 1: Obtain Your Telegram API Credentials
1. Go to **my.telegram.org** in your browser.
2. Sign in with your Telegram account phone number (with country code).
3. Click on **API Development Tools**.
4. Fill in the app creation form (App title and short name).
5. Copy your **API ID** (numerical value) and **API Hash** (32-character string).

### Step 2: Connect Your MTProto Session in TG Downloader
1. Open **TG Media Downloader** web edition.
2. In the Downloader Tool tab, enter your **API ID**, **API Hash**, and **Phone Number**.
3. Click **Send verification code**.
4. Check your official Telegram mobile or desktop app for the login code and enter it into the tool.

### Step 3: Filter, Sort & Stream Local Browser Downloads
1. Select a chat from your **pre-fetched joined channels dropdown** or paste a public channel link.
2. Switch across the **9 Category Tabs** (Documents, Media, Archives, Music, etc.).
3. Filter by **Min/Max MB size** or apply **Regex file name patterns**.
4. Click **Add selected to queue** to begin direct browser downloads with max MTProto speeds!`
  },
  {
    id: 2,
    title: 'How to Download Media from Specific Telegram Forum Topics',
    slug: 'download-telegram-forum-topics-guide',
    category: 'Tutorials',
    readTime: 5,
    author: 'TG Downloader Technical Team',
    date: '2026-03-25',
    cover: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1200&q=80',
    metaDesc: 'Discover how to isolate specific sub-forum topics inside large Telegram channels and extract files without downloading unrelated channel noise.',
    keywords: 'telegram forum topics, telegram topic downloader, sub channel extractor',
    excerpt: 'Discover how to isolate specific sub-forum topics inside large Telegram channels and extract files without downloading unrelated channel noise.',
    content: `## Telegram Forum Topics Isolation Guide

Large Telegram communities use **Forum Topics** to separate discussions into sub-channels (e.g. #PDFs, #Video-Courses, #Announcements).

### Why Isolate Forum Topics?
Standard Telegram downloaders pull files indiscriminately from the main channel feed. TG Media Downloader includes a dedicated **Forum Topic Picker** that allows you to target exact sub-channels.

### How to Target Specific Topics
1. Connect your Telegram account credentials.
2. Select your target channel.
3. Open the **Topic Selector Dropdown** next to the channel search input.
4. Select the specific topic ID (e.g., Topic #1: PDF Textbooks).
5. Click **Fetch Media**. The tool will isolate only messages sent within that sub-forum thread.`
  },
  {
    id: 3,
    title: 'Telegram API ID & Hash: Where to Find & How to Connect Safely',
    slug: 'telegram-api-id-hash-safety-guide',
    category: 'Security',
    readTime: 4,
    author: 'Security Research Team',
    date: '2026-03-20',
    cover: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=1200&q=80',
    metaDesc: 'Understand why Telegram MTProto API ID and Hash credentials are required, where to generate them, and how local session storage protects your privacy.',
    keywords: 'telegram api id safety, telegram login code, my.telegram.org api',
    excerpt: 'Understand why Telegram MTProto API ID and Hash credentials are required, where to generate them, and how local session storage protects your privacy.',
    content: `## Understanding Telegram MTProto API Credentials

### What is an API ID and API Hash?
Telegram requires applications connecting to its official MTProto network to identify themselves via an **API ID** and **API Hash**. These credentials grant client applications permission to read your authorized channels and request media chunks.

### How Session Security Works
- **Local Storage Only**: Your API credentials and MTProto session state are saved exclusively in your browser's local storage.
- **Zero Server Caching**: No media files, photos, videos, or documents pass through or get saved on third-party servers. All data transfers happen directly between Telegram servers and your local device.`
  },
  {
    id: 4,
    title: 'How to Download Telegram Videos & PDFs Without Saving to Server',
    slug: 'download-telegram-videos-pdfs-direct-local-stream',
    category: 'Guides',
    readTime: 5,
    author: 'TG Downloader Team',
    date: '2026-03-15',
    cover: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=1200&q=80',
    metaDesc: 'Learn about direct browser local streaming architecture and why zero-server storage ensures maximum download speed and complete privacy.',
    keywords: 'telegram video downloader web, direct local stream telegram, zero server caching',
    excerpt: 'Learn about direct browser local streaming architecture and why zero-server storage ensures maximum download speed and complete privacy.',
    content: `## Direct Browser Local Streaming Architecture

Traditional web downloaders download files onto their cloud server first and then send a download link to the user. This approach creates privacy bottlenecks and bandwidth limits.

### The TG Downloader Advantage
TG Media Downloader uses a **Direct Browser Local Streaming Engine**:
1. Your browser establishes a direct HTTP stream with Telegram MTProto endpoints.
2. File chunks stream progressively straight into your browser's downloads manager.
3. Downloads execute at maximum network connection speed with 0 GB server storage overhead.`
  }
]

export function AppProvider({ children }) {
  const [systemSettings, setSystemSettings] = useState(() => {
    const saved = localStorage.getItem('tg_system_settings')
    return saved ? JSON.parse(saved) : {
      freeFetchLimit: 5,
      adsFreeUsers: true,
      adsPaidUsers: false,
      paymentUpiId: 'admin@upi',
      paymentPaypalMe: 'https://paypal.me/admin',
      paymentQrCodeUrl: 'https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=upi://pay?pa=admin@upi&pn=TG%20Downloader',
      plan3mPrice: 14.99,
      plan6mPrice: 24.99,
      plan12mPrice: 39.99
    }
  })

  const [payments, setPayments] = useState(() => {
    const saved = localStorage.getItem('tg_payment_verifications')
    return saved ? JSON.parse(saved) : []
  })

  const [contactMessages, setContactMessages] = useState(() => {
    const saved = localStorage.getItem('tg_contact_messages')
    return saved ? JSON.parse(saved) : []
  })

  const [blogPosts, setBlogPosts] = useState(() => {
    const saved = localStorage.getItem('tg_blog_posts')
    return saved ? JSON.parse(saved) : INITIAL_BLOG_POSTS
  })

  useEffect(() => {
    localStorage.setItem('tg_system_settings', JSON.stringify(systemSettings))
  }, [systemSettings])

  useEffect(() => {
    localStorage.setItem('tg_payment_verifications', JSON.stringify(payments))
  }, [payments])

  useEffect(() => {
    localStorage.setItem('tg_contact_messages', JSON.stringify(contactMessages))
  }, [contactMessages])

  // Load contact messages from Supabase on mount
  useEffect(() => {
    async function loadContactMessages() {
      try {
        const { data, error } = await supabase
          .from('contact_messages')
          .select('*')
          .order('created_at', { ascending: false })

        if (!error && data && data.length > 0) {
          const formatted = data.map(m => ({
            id: m.id,
            name: m.name,
            email: m.email,
            subject: m.subject || 'General Inquiry',
            message: m.message,
            date: (m.created_at || '').slice(0, 10),
            status: m.status || 'unread'
          }))
          setContactMessages(formatted)
        }
      } catch (err) {
        console.error('Failed to load contact messages from Supabase:', err)
      }
    }
    loadContactMessages()
  }, [])

  useEffect(() => {
    localStorage.setItem('tg_blog_posts', JSON.stringify(blogPosts))
  }, [blogPosts])

  const submitPaymentVerification = (verificationData) => {
    const newRecord = {
      id: `pay-${Date.now()}`,
      userName: verificationData.userName || 'User Account',
      userEmail: verificationData.userEmail || 'user@example.com',
      planName: verificationData.planName,
      planId: verificationData.planId,
      amount: verificationData.amount,
      method: verificationData.method,
      refId: verificationData.refId,
      proofUrl: verificationData.proofUrl || '',
      date: new Date().toISOString().split('T')[0],
      status: 'pending'
    }
    setPayments(prev => [newRecord, ...prev])
  }

  const approvePaymentAdmin = (paymentId) => {
    setPayments(prev => prev.map(p => p.id === paymentId ? { ...p, status: 'approved' } : p))
  }

  const rejectPaymentAdmin = (paymentId) => {
    setPayments(prev => prev.map(p => p.id === paymentId ? { ...p, status: 'rejected' } : p))
  }

  const submitContactForm = async (messageData) => {
    const newMsg = {
      id: `msg-${Date.now()}`,
      name: messageData.name,
      email: messageData.email,
      subject: messageData.subject || 'General Inquiry',
      message: messageData.message,
      date: new Date().toISOString().split('T')[0],
      status: 'unread'
    }
    setContactMessages(prev => [newMsg, ...prev])

    // Save directly to Supabase contact_messages table
    try {
      const { error } = await supabase
        .from('contact_messages')
        .insert({
          name: messageData.name,
          email: messageData.email,
          subject: messageData.subject || 'General Inquiry',
          message: messageData.message,
          status: 'unread'
        })
      if (error) {
        console.error('Supabase contact submission error:', error)
      }
    } catch (err) {
      console.error('Supabase contact submission error:', err)
    }
  }

  // Advanced Blog Post Actions
  const addBlogPostAdmin = (postData) => {
    const newPost = {
      id: Date.now(),
      title: postData.title,
      slug: postData.slug || postData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
      category: postData.category || 'Guides',
      readTime: parseInt(postData.readTime) || 5,
      author: postData.author || 'TG Downloader Team',
      date: new Date().toISOString().split('T')[0],
      cover: postData.cover || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80',
      metaDesc: postData.metaDesc || postData.content.slice(0, 160),
      keywords: postData.keywords || 'telegram media downloader, blog',
      excerpt: postData.excerpt || postData.content.slice(0, 150) + '...',
      content: postData.content
    }
    setBlogPosts(prev => [newPost, ...prev])
  }

  const updateBlogPostAdmin = (postId, updatedData) => {
    setBlogPosts(prev => prev.map(post => {
      if (post.id === postId) {
        return { ...post, ...updatedData }
      }
      return post
    }))
  }

  const deleteBlogPostAdmin = (postId) => {
    setBlogPosts(prev => prev.filter(p => p.id !== postId))
  }

  const updateSystemSettingsAdmin = (newSettings) => {
    setSystemSettings(prev => ({ ...prev, ...newSettings }))
  }

  // Downloader View Cache (persists fetched media across route changes)
  const [downloaderCache, setDownloaderCache] = useState({
    channelInput: '',
    channelInfo: null,
    categories: null,
    topicId: null,
    browserView: 'bulk',
    activeTab: 'All',
    selectedIds: [],
    searchQuery: '',
  })

  const updateDownloaderCache = (patch) => {
    setDownloaderCache(prev => ({ ...prev, ...patch }))
  }

  const value = {
    systemSettings,
    payments,
    contactMessages,
    blogPosts,
    downloaderCache,
    updateDownloaderCache,
    submitPaymentVerification,
    approvePaymentAdmin,
    rejectPaymentAdmin,
    submitContactForm,
    addBlogPostAdmin,
    updateBlogPostAdmin,
    deleteBlogPostAdmin,
    updateSystemSettingsAdmin,
    activeSubscription: payments.find(p => p.status === 'approved') || null
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useApp() {
  return useContext(AppContext)
}
