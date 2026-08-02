import React, { createContext, useContext, useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import INITIAL_BLOG_POSTS from '../data/blogPosts'
import { EXTRA_BLOG_POSTS } from '../data/blogPosts2'

const AppContext = createContext()

const ALL_BLOG_POSTS = [...INITIAL_BLOG_POSTS, ...EXTRA_BLOG_POSTS]

const INITIAL_BLOG_POSTS_LEGACY = [
  {
    id: 1,
    title: 'How to Download Telegram Media Without Cloud Storage: A Privacy-First Guide',
    slug: 'download-telegram-media-without-cloud-storage',
    category: 'Privacy',
    readTime: 7,
    author: 'TG Media Downloader Team',
    date: '2026-07-20',
    cover: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1200&q=80',
    metaDesc: 'A step-by-step guide to downloading Telegram photos, videos, and documents directly through the browser while keeping zero server file storage.',
    keywords: 'telegram media download, local browser download, privacy first telegram downloader',
    excerpt: 'A step-by-step guide to downloading Telegram photos, videos, and documents directly through the browser while keeping zero server file storage.',
    content: `## Why Privacy-First Telegram Downloads Matter
Many Telegram downloader tools route files through a cloud server before delivering them to you. That creates needless storage risk, bandwidth delay, and privacy exposure.

TG Media Downloader is designed to keep your download flow local by using your browser as the primary download agent.

### What This Means for You
- **No file storage on our servers**: downloaded media never lands in a third-party cloud environment.
- **Direct Telegram MTProto connection**: your browser communicates directly with Telegram endpoints.
- **Faster delivery**: files stream into your browser download manager as they arrive.

### How to Start Secure Downloads
1. Open the web app and sign in with your Telegram API credentials.
2. Choose a channel or group that you are authorized to access.
3. Use the downloader interface to select media categories like **Video**, **Photo**, **Document**, or **Audio**.
4. Click **Start Download** to begin streaming file chunks directly to your machine.

### Best Practices for Privacy
- Always use a private network or trusted Wi-Fi when downloading sensitive content.
- Avoid sharing your Telegram API credentials in public or untrusted browser sessions.
- Clear your browser cache or local storage if you stop using the tool on a shared computer.`
  },
  {
    id: 2,
    title: 'Why Direct MTProto Browser Streaming is Safer and Faster Than Server-Based Downloaders',
    slug: 'direct-mtproto-streaming-safer-faster',
    category: 'Technology',
    readTime: 6,
    author: 'TG Media Downloader Engineering',
    date: '2026-07-15',
    cover: 'https://images.unsplash.com/photo-1531497865145-8f0d2f3d9a4a?auto=format&fit=crop&w=1200&q=80',
    metaDesc: 'Explore the benefits of using direct MTProto browser streaming for Telegram file downloads instead of intermediate cloud proxy download services.',
    keywords: 'MTProto streaming, telegram downloader performance, cloudless telegram download',
    excerpt: 'Explore the benefits of using direct MTProto browser streaming for Telegram file downloads instead of intermediate cloud proxy download services.',
    content: `## The Problem with Server-Based Telegram Downloaders
Most web-based Telegram downloaders route media through a server first. That means:
- increased latency,
- extra bandwidth use,
- and possible retention of user files.

TG Media Downloader avoids that by letting your browser handle the connection directly.

### How Direct MTProto Streaming Works
1. Your browser authenticates with Telegram using your API ID and API Hash.
2. The app requests media chunks over the MTProto protocol.
3. Chunks are streamed directly into your browser downloads manager.

### Benefits for Users
- **Higher download throughput** because bandwidth is not constrained by a remote proxy.
- **Stronger privacy**, since the app does not store or cache any Telegram media.
- **Reduced server costs**, allowing the service to remain lightweight and responsive.

### Real-World Use Cases
- Bulk downloading lecture videos from a study channel.
- Exporting PDF manuals from a technology group.
- Capturing audio voice notes from a private community thread.

When you choose a direct streaming architecture, you're choosing speed and control over unnecessary server intermediaries.`
  },
  {
    id: 3,
    title: 'Step-by-Step: Create Your Telegram API ID & Hash for Secure Downloads',
    slug: 'create-telegram-api-id-hash-secure-downloads',
    category: 'Guides',
    readTime: 5,
    author: 'TG Media Downloader Support',
    date: '2026-07-10',
    cover: 'https://images.unsplash.com/photo-1500522144261-ea64433bbe27?auto=format&fit=crop&w=1200&q=80',
    metaDesc: 'A friendly walkthrough for generating your Telegram API ID and API Hash at my.telegram.org and connecting them safely to the browser downloader.',
    keywords: 'telegram api id hash tutorial, my.telegram.org, secure telegram login',
    excerpt: 'A friendly walkthrough for generating your Telegram API ID and API Hash at my.telegram.org and connecting them safely to the browser downloader.',
    content: `## Generate Your Telegram API Credentials in Minutes
Telegram requires every third-party client to identify itself with an **API ID** and **API Hash**. These credentials allow the downloader to access your authorized chats and media files.

### Create Your API Credentials
1. Visit **my.telegram.org** and sign in with your Telegram phone number.
2. On the **API Development Tools** page, create a new application.
3. Enter a descriptive app name and a short name.
4. Save the generated **API ID** and **API Hash**.

### Connect Credentials to TG Media Downloader
1. Open the Downloader page in the web app.
2. Paste your **API ID** and **API Hash** into the connection form.
3. Send the verification code and confirm it in your Telegram app.
4. Once connected, the app can access your authorized channels and download files securely.

### Safety Notes
- Do not share your API Hash publicly.
- Use a trusted device and browser when entering your credentials.
- The app stores credentials in browser local storage only, not on external servers.`
  },
  {
    id: 4,
    title: 'Target Telegram Channel Topics and Download Only What Matters',
    slug: 'target-telegram-channel-topics-download-only-what-matters',
    category: 'Productivity',
    readTime: 6,
    author: 'TG Media Downloader Product Team',
    date: '2026-07-05',
    cover: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80',
    metaDesc: 'Learn how to use topic filtering and category selection in TG Media Downloader so you can extract only the files you need from large Telegram channels.',
    keywords: 'telegram topic filtering, channel downloader productivity, tg media downloader topics',
    excerpt: 'Learn how to use topic filtering and category selection in TG Media Downloader so you can extract only the files you need from large Telegram channels.',
    content: `## Reduce Download Noise with Topic Filtering
Large Telegram channels can contain hundreds of files across multiple discussion topics. Downloading everything is inefficient and often unnecessary.

TG Media Downloader includes tools that help you focus on the right content.

### Use Category Selection
- Choose **Photos** to capture image collections.
- Select **Videos** for recorded lessons or clips.
- Filter to **Documents** for manuals, PDFs, and text archives.

### Use Topic Picker for Forum Threads
1. Open the channel selector for a Telegram group with forum topics.
2. Choose the exact topic branch you want to extract.
3. Fetch content from that topic only.

### Save Time with Smart Queues
- Add only relevant files to the download queue.
- Skip promotional images or unrelated attachments.
- Export selected media faster with fewer clicks and no extra storage overhead.`
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
    return saved ? JSON.parse(saved) : ALL_BLOG_POSTS
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
