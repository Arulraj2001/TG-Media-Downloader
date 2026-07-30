import React, { useEffect } from 'react'

export default function SeoMeta({ title, description, image, canonical, jsonLd }) {
  useEffect(() => {
    // Set Title
    document.title = title ? `${title} | TG Media Downloader` : 'TG Media Downloader - Fast, Bulk & Direct Telegram Downloader'
    
    // Set Meta Description
    let metaDesc = document.querySelector('meta[name="description"]')
    if (!metaDesc) {
      metaDesc = document.createElement('meta')
      metaDesc.name = 'description'
      document.head.appendChild(metaDesc)
    }
    metaDesc.content = description || 'Download files, videos, music, archives, and forum topics directly from Telegram channels. High speed, direct local downloads, zero server caching.'

    // Set OpenGraph Title & Description
    let ogTitle = document.querySelector('meta[property="og:title"]')
    if (!ogTitle) {
      ogTitle = document.createElement('meta')
      ogTitle.setAttribute('property', 'og:title')
      document.head.appendChild(ogTitle)
    }
    ogTitle.content = document.title

    let ogDesc = document.querySelector('meta[property="og:description"]')
    if (!ogDesc) {
      ogDesc = document.createElement('meta')
      ogDesc.setAttribute('property', 'og:description')
      document.head.appendChild(ogDesc)
    }
    ogDesc.content = metaDesc.content

    // JSON-LD Structured Data Injection for Google SEO
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
  }, [title, description, image, canonical, jsonLd])

  return null
}
