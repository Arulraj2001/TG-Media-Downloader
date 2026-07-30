import React, { useEffect } from 'react'

export default function SeoMeta({
  title = "TG Media Downloader - Fast, Bulk & Direct Telegram Downloader",
  description = "Download files, videos, music, archives, and forum topics directly from Telegram channels. High speed, direct local downloads, and topic filtering.",
  canonical = window.location.href,
  ogImage = "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80",
  schemaType = "SoftwareApplication",
  schemaData = null
}) {
  useEffect(() => {
    // Update document title
    document.title = title

    // Update Meta Description
    let metaDesc = document.querySelector('meta[name="description"]')
    if (!metaDesc) {
      metaDesc = document.createElement('meta')
      metaDesc.name = 'description'
      document.head.appendChild(metaDesc)
    }
    metaDesc.content = description

    // Update OpenGraph Title
    let ogTitle = document.querySelector('meta[property="og:title"]')
    if (!ogTitle) {
      ogTitle = document.createElement('meta')
      ogTitle.setAttribute('property', 'og:title')
      document.head.appendChild(ogTitle)
    }
    ogTitle.content = title

    // Update OpenGraph Description
    let ogDesc = document.querySelector('meta[property="og:description"]')
    if (!ogDesc) {
      ogDesc = document.createElement('meta')
      ogDesc.setAttribute('property', 'og:description')
      document.head.appendChild(ogDesc)
    }
    ogDesc.content = description

    // Update OpenGraph Image
    let ogImg = document.querySelector('meta[property="og:image"]')
    if (!ogImg) {
      ogImg = document.createElement('meta')
      ogImg.setAttribute('property', 'og:image')
      document.head.appendChild(ogImg)
    }
    ogImg.content = ogImage

    // Canonical link
    let canonicalLink = document.querySelector('link[rel="canonical"]')
    if (!canonicalLink) {
      canonicalLink = document.createElement('link')
      canonicalLink.rel = 'canonical'
      document.head.appendChild(canonicalLink)
    }
    canonicalLink.href = canonical

  }, [title, description, canonical, ogImage])

  const defaultSchema = {
    "@context": "https://schema.org",
    "@type": schemaType,
    "name": title,
    "description": description,
    "applicationCategory": "UtilitiesApplication",
    "operatingSystem": "Web",
    "offers": {
      "@type": "AggregateOffer",
      "priceCurrency": "USD",
      "lowPrice": "14.99",
      "highPrice": "39.99"
    }
  }

  const finalSchema = schemaData || defaultSchema

  return (
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(finalSchema) }} />
  )
}
