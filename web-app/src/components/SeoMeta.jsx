import React, { useEffect } from 'react'

const SITE_NAME = 'TG Media Downloader'
const SITE_URL = 'https://tg-media-bulk-downloader.netlify.app'
const DEFAULT_IMAGE = `${SITE_URL}/og-image.png`
const DEFAULT_DESCRIPTION = 'Free Telegram Bulk Media Downloader — Save videos, photos, music, files, forum topics, and group folders directly from public and private Telegram channels at maximum speed.'
const DEFAULT_KEYWORDS = 'telegram downloader, telegram media downloader, bulk telegram downloader, download telegram videos, telegram channel downloader, telegram group downloader, telegram folder downloader, telegram private channel downloader, telegram chat downloader, telegram video saver, download telegram files online, telegram mtproto web downloader'

/**
 * Builds the default JSON-LD graph with WebSite, Organization, and SoftwareApplication schemas.
 */
function buildDefaultJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite',
        '@id': `${SITE_URL}/#website`,
        'url': SITE_URL,
        'name': SITE_NAME,
        'description': DEFAULT_DESCRIPTION,
        'publisher': { '@id': `${SITE_URL}/#organization` },
        'potentialAction': {
          '@type': 'SearchAction',
          'target': `${SITE_URL}/search?q={search_term_string}`,
          'query-input': 'required name=search_term_string'
        }
      },
      {
        '@type': 'Organization',
        '@id': `${SITE_URL}/#organization`,
        'name': SITE_NAME,
        'url': SITE_URL,
        'logo': {
          '@type': 'ImageObject',
          'url': `${SITE_URL}/logo.png`,
          'width': 512,
          'height': 512
        },
        'sameAs': [
          'https://github.com/Arulraj2001/TG-Media-Downloader'
        ]
      },
      {
        '@type': 'SoftwareApplication',
        '@id': `${SITE_URL}/#software`,
        'name': SITE_NAME,
        'applicationCategory': 'UtilitiesApplication',
        'operatingSystem': 'Web, Windows, macOS, Linux',
        'description': DEFAULT_DESCRIPTION,
        'url': SITE_URL,
        'offers': {
          '@type': 'Offer',
          'price': '0',
          'priceCurrency': 'USD'
        },
        'aggregateRating': {
          '@type': 'AggregateRating',
          'ratingValue': '4.8',
          'ratingCount': '1250'
        }
      }
    ]
  }
}

/**
 * Builds BreadcrumbList schema from an array of { name, path } items.
 */
function buildBreadcrumbJsonLd(items) {
  if (!items || items.length === 0) return null
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    'itemListElement': items.map((item, index) => ({
      '@type': 'ListItem',
      'position': index + 1,
      'name': item.name,
      'item': `${SITE_URL}${item.path}`
    }))
  }
}

/**
 * Builds FAQPage schema from an array of { question, answer } items.
 */
function buildFaqJsonLd(faqs) {
  if (!faqs || faqs.length === 0) return null
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    'mainEntity': faqs.map(faq => ({
      '@type': 'Question',
      'name': faq.question,
      'acceptedAnswer': {
        '@type': 'Answer',
        'text': faq.answer
      }
    }))
  }
}

/**
 * Builds BlogPosting schema for article pages.
 */
function buildArticleJsonLd({
  title,
  description,
  image,
  author,
  datePublished,
  dateModified,
  category,
  keywords,
  url
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    'headline': title,
    'description': description,
    'image': image || DEFAULT_IMAGE,
    'author': {
      '@type': 'Person',
      'name': author || 'TG Media Downloader Team',
      'url': `${SITE_URL}/blog/author/${(author || 'tg-media-downloader-team').toLowerCase().replace(/\s+/g, '-')}`
    },
    'publisher': { '@id': `${SITE_URL}/#organization` },
    'mainEntityOfPage': {
      '@type': 'WebPage',
      '@id': url || SITE_URL
    },
    'datePublished': datePublished || new Date().toISOString().split('T')[0],
    'dateModified': dateModified || datePublished || new Date().toISOString().split('T')[0],
    'keywords': keywords || 'telegram downloader, telegram media downloader',
    'articleSection': category || 'Guides'
  }
}

export default function SeoMeta({
  title,
  description,
  keywords,
  image,
  canonical,
  jsonLd,
  noIndex = false,
  breadcrumbs,
  faqs,
  article,
  type = 'website'
}) {
  useEffect(() => {
    // 1. Page Title
    const fullTitle = title ? `${title} | ${SITE_NAME}` : `${SITE_NAME} — Bulk Download Channels, Groups & Folders Online`
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

    const currentUrl = canonical || window.location.href
    const currentImage = image || DEFAULT_IMAGE

    // 2. Core Meta Tags
    setMeta('name', 'description', description || DEFAULT_DESCRIPTION)
    setMeta('name', 'keywords', keywords || DEFAULT_KEYWORDS)
    setMeta('name', 'robots', noIndex ? 'noindex, nofollow' : 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1')
    setMeta('name', 'author', SITE_NAME)
    setMeta('name', 'theme-color', '#635BFF')

    // 3. Canonical Link
    setLink('canonical', currentUrl)

    // 4. Open Graph Meta Tags
    setMeta('property', 'og:site_name', SITE_NAME)
    setMeta('property', 'og:title', fullTitle)
    setMeta('property', 'og:description', description || DEFAULT_DESCRIPTION)
    setMeta('property', 'og:type', type)
    setMeta('property', 'og:url', currentUrl)
    setMeta('property', 'og:image', currentImage)
    setMeta('property', 'og:image:width', '1200')
    setMeta('property', 'og:image:height', '630')
    setMeta('property', 'og:locale', 'en_US')

    // 5. Twitter Card Meta Tags
    setMeta('name', 'twitter:card', 'summary_large_image')
    setMeta('name', 'twitter:title', fullTitle)
    setMeta('name', 'twitter:description', description || DEFAULT_DESCRIPTION)
    setMeta('name', 'twitter:image', currentImage)
    setMeta('name', 'twitter:site', '@tgdownloader')

    // 6. JSON-LD Schema.org Data Injection
    const schemas = []

    // Always include default WebSite/Organization/SoftwareApplication schema
    schemas.push(buildDefaultJsonLd())

    // Custom JSON-LD from props
    if (jsonLd) {
      schemas.push(jsonLd)
    }

    // Breadcrumb schema
    if (breadcrumbs && breadcrumbs.length > 0) {
      const breadcrumbSchema = buildBreadcrumbJsonLd(breadcrumbs)
      if (breadcrumbSchema) schemas.push(breadcrumbSchema)
    }

    // FAQ schema
    if (faqs && faqs.length > 0) {
      const faqSchema = buildFaqJsonLd(faqs)
      if (faqSchema) schemas.push(faqSchema)
    }

    // Article schema
    if (article) {
      schemas.push(buildArticleJsonLd(article))
    }

    // Remove existing JSON-LD scripts
    document.querySelectorAll('script[type="application/ld+json"]').forEach(el => el.remove())

    // Inject all schemas
    schemas.forEach((schema, index) => {
      const scriptTag = document.createElement('script')
      scriptTag.type = 'application/ld+json'
      scriptTag.id = `json-ld-seo-${index}`
      scriptTag.textContent = JSON.stringify(schema)
      document.head.appendChild(scriptTag)
    })
  }, [title, description, keywords, image, canonical, jsonLd, noIndex, breadcrumbs, faqs, article, type])

  return null
}