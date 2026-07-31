import React, { useEffect } from 'react'

export default function SeoMeta({
  title,
  description,
  keywords,
  image,
  canonical,
  jsonLd,
  noIndex = false
}) {
  useEffect(() => {
    // 1. Page Title
    const siteName = 'TG Media Downloader'
    const fullTitle = title ? `${title} | ${siteName}` : 'Telegram Media Downloader — Bulk Download Channels, Groups & Folders Online'
    document.title = fullTitle

    // Helper to set/create <meta> tags
    const setMeta = (attr, attrName, content) => {
      if (!content) return
      let elem = document.querySelector(`meta[${attr}="${attrName}"]`)
      if (!elem) {
        elem = document.createElement('meta')
        elem.setAttribute(attr, attrName)
        document.head.appendChild(elem)
      }
      elem.setAttribute('content', content)
    }

    // Helper to set/create <link> tags
    const setLink = (rel, href) => {
      if (!href) return
      let elem = document.querySelector(`link[rel="${rel}"]`)
      if (!elem) {
        elem = document.createElement('link')
        elem.setAttribute('rel', rel)
        document.head.appendChild(elem)
      }
      elem.setAttribute('href', href)
    }

    const defaultDesc = 'Free Telegram Bulk Media Downloader — Save videos, photos, music, files, forum topics, and group folders directly from public and private Telegram channels at maximum speed.'
    const defaultKeywords = 'telegram downloader, telegram media downloader, bulk telegram downloader, download telegram videos, telegram channel downloader, telegram group downloader, telegram folder downloader, telegram private channel downloader, telegram chat downloader, telegram video saver, download telegram files online, telegram mtproto web downloader'
    const defaultImage = image || 'https://tg-media-bulk-downloader.netlify.app/og-image.png'
    const currentUrl = canonical || window.location.href

    // 2. Core Meta Tags
    setMeta('name', 'description', description || defaultDesc)
    setMeta('name', 'keywords', keywords || defaultKeywords)
    setMeta('name', 'robots', noIndex ? 'noindex, nofollow' : 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1')

    // 3. Canonical Link
    setLink('canonical', currentUrl)

    // 4. Open Graph Meta Tags (Facebook, LinkedIn, Discord, Telegram preview)
    setMeta('property', 'og:site_name', siteName)
    setMeta('property', 'og:title', fullTitle)
    setMeta('property', 'og:description', description || defaultDesc)
    setMeta('property', 'og:type', 'website')
    setMeta('property', 'og:url', currentUrl)
    setMeta('property', 'og:image', defaultImage)

    // 5. Twitter Card Meta Tags
    setMeta('name', 'twitter:card', 'summary_large_image')
    setMeta('name', 'twitter:title', fullTitle)
    setMeta('name', 'twitter:description', description || defaultDesc)
    setMeta('name', 'twitter:image', defaultImage)

    // 6. JSON-LD Schema.org Data Injection
    if (jsonLd) {
      let scriptTag = document.getElementById('json-ld-seo')
      if (!scriptTag) {
        scriptTag = document.createElement('script')
        scriptTag.id = 'json-ld-seo'
        scriptTag.type = 'application/ld+json'
        document.head.appendChild(scriptTag)
      }
      scriptTag.textContent = JSON.stringify(jsonLd)
    }
  }, [title, description, keywords, image, canonical, jsonLd, noIndex])

  return null
}
