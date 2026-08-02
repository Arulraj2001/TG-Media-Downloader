import React from 'react'
import { Link } from 'react-router-dom'
import SeoMeta from '../components/SeoMeta'
import { ShieldCheck, FileText, Scale, AlertTriangle, Cookie, BookOpen, Lock } from 'lucide-react'

const LEGAL_CONTENT = {
  'privacy-policy': {
    title: 'Privacy Policy',
    icon: <ShieldCheck className="w-5 h-5" />,
    updated: 'August 1, 2026',
    sections: [
      {
        heading: '1. Introduction',
        content: 'This Privacy Policy explains how TG Media Downloader ("we," "our," or "us") collects, uses, and protects your information when you use our website and services. By using TG Media Downloader, you agree to the practices described in this policy.'
      },
      {
        heading: '2. Information We Collect',
        content: 'We collect minimal information necessary to operate our service: (a) Contact information you voluntarily provide (name, email) when using our contact form; (b) Usage data such as pages visited and browser type for analytics; (c) Telegram API credentials you enter are stored locally in your browser only and are never transmitted to our servers.'
      },
      {
        heading: '3. Zero Server Storage',
        content: 'TG Media Downloader operates with a zero server storage architecture. Media files you download stream directly from Telegram servers to your device. We do not store, cache, process, or transmit your downloaded files through our servers. Your Telegram API credentials remain in your browser\'s local storage.'
      },
      {
        heading: '4. Cookies and Analytics',
        content: 'We may use cookies and similar technologies to improve user experience and analyze site traffic. We use privacy-respecting analytics to understand how visitors use our site. You can control cookies through your browser settings.'
      },
      {
        heading: '5. Google AdSense',
        content: 'We may display advertisements through Google AdSense. Google and its partners may use cookies to serve ads based on your prior visits to our website or other websites. You can opt out of personalized advertising by visiting Google Ads Settings. Our content is developed to comply with Google Publisher Policies.'
      },
      {
        heading: '6. Data Security',
        content: 'We implement appropriate technical and organizational measures to protect your information. However, no method of transmission over the Internet is 100% secure. We cannot guarantee absolute security of data transmitted to us.'
      },
      {
        heading: '7. Your Rights',
        content: 'You have the right to access, correct, or delete your personal information. You can request data deletion by contacting us. We retain data only as long as necessary for the purposes described in this policy.'
      },
      {
        heading: '8. Children\'s Privacy',
        content: 'Our service is not directed to children under 13. We do not knowingly collect personal information from children. If you believe a child has provided us personal information, please contact us.'
      },
      {
        heading: '9. Changes to This Policy',
        content: 'We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new policy on this page. Changes are effective when posted.'
      },
      {
        heading: '10. Contact Us',
        content: 'If you have questions about this Privacy Policy, please contact us through our contact page or email us at support@tgdownloader.com.'
      }
    ]
  },
  'terms-of-service': {
    title: 'Terms of Service',
    icon: <Scale className="w-5 h-5" />,
    updated: 'August 1, 2026',
    sections: [
      {
        heading: '1. Acceptance of Terms',
        content: 'By accessing or using TG Media Downloader, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our service.'
      },
      {
        heading: '2. Description of Service',
        content: 'TG Media Downloader is a web-based tool that allows users to download media from Telegram channels, groups, and chats they are authorized to access. The service uses direct MTProto connections to stream files from Telegram servers to the user\'s device.'
      },
      {
        heading: '3. User Responsibilities',
        content: 'You are responsible for: (a) Only downloading content you own, have created, or have permission to access; (b) Complying with Telegram\'s Terms of Service; (c) Respecting copyright and intellectual property rights; (d) Using the service in accordance with all applicable laws.'
      },
      {
        heading: '4. Acceptable Use',
        content: 'You agree not to: (a) Use the service to download copyrighted content without permission; (b) Attempt to access channels or content you are not authorized to view; (c) Use the service for any illegal purpose; (d) Interfere with or disrupt the service; (e) Reverse engineer or attempt to extract the source code of the service.'
      },
      {
        heading: '5. Intellectual Property',
        content: 'The TG Media Downloader name, logo, and website design are our intellectual property. You may not use them without our prior written consent. Downloaded content remains the property of its respective owners.'
      },
      {
        heading: '6. Disclaimer of Warranties',
        content: 'The service is provided "as is" and "as available" without warranties of any kind, either express or implied. We do not warrant that the service will be uninterrupted, error-free, or free of harmful components.'
      },
      {
        heading: '7. Limitation of Liability',
        content: 'To the maximum extent permitted by law, TG Media Downloader shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of the service.'
      },
      {
        heading: '8. Third-Party Services',
        content: 'Our service interacts with Telegram, a third-party platform. We are not affiliated with Telegram. Your use of Telegram is governed by Telegram\'s own Terms of Service and Privacy Policy.'
      },
      {
        heading: '9. Termination',
        content: 'We may terminate or suspend your access to the service at any time, without notice, for conduct that we believe violates these Terms or is harmful to other users or third parties.'
      },
      {
        heading: '10. Changes to Terms',
        content: 'We may modify these Terms at any time. Continued use of the service after changes constitutes acceptance of the modified Terms.'
      },
      {
        heading: '11. Governing Law',
        content: 'These Terms shall be governed by and construed in accordance with applicable laws, without regard to conflict of law principles.'
      },
      {
        heading: '12. Contact',
        content: 'For questions about these Terms, contact us at support@tgdownloader.com.'
      }
    ]
  },
  'disclaimer': {
    title: 'Disclaimer',
    icon: <AlertTriangle className="w-5 h-5" />,
    updated: 'August 1, 2026',
    sections: [
      {
        heading: '1. Copyright Notice',
        content: 'TG Media Downloader is a tool that facilitates downloading media from Telegram. We do not host, store, or distribute any copyrighted content. All media downloaded through our service is sourced directly from Telegram servers and belongs to its respective owners.'
      },
      {
        heading: '2. User Responsibility',
        content: 'Users are solely responsible for ensuring they have the right to download and use any content accessed through our service. You should only download media that you own, have created, or have explicit permission to save. Downloading copyrighted content without permission may violate copyright law.'
      },
      {
        heading: '3. No Affiliation',
        content: 'TG Media Downloader is an independent tool and is not affiliated with, endorsed by, or connected to Telegram Messenger Inc. or any of its subsidiaries. "Telegram" is a trademark of Telegram Messenger Inc.'
      },
      {
        heading: '4. Fair Use',
        content: 'We encourage users to respect the principles of fair use and copyright law. Downloading content for personal, non-commercial use from channels you have access to is generally acceptable. Redistributing copyrighted content without permission is not.'
      },
      {
        heading: '5. DMCA Compliance',
        content: 'If you believe that content accessed through our service infringes your copyright, please contact us with the relevant details. We will review the matter and take appropriate action, including cooperating with rights holders.'
      },
      {
        heading: '6. No Legal Advice',
        content: 'The information on this website is provided for general informational purposes only and does not constitute legal advice. Consult a qualified legal professional for advice on copyright and intellectual property matters.'
      },
      {
        heading: '7. External Links',
        content: 'Our website may contain links to external websites. We are not responsible for the content or privacy practices of external sites.'
      }
    ]
  },
  'cookie-policy': {
    title: 'Cookie Policy',
    icon: <Cookie className="w-5 h-5" />,
    updated: 'August 1, 2026',
    sections: [
      {
        heading: '1. What Are Cookies?',
        content: 'Cookies are small text files stored on your device when you visit a website. They help websites remember your preferences and understand how visitors use the site.'
      },
      {
        heading: '2. How We Use Cookies',
        content: 'We use cookies to: (a) Remember your theme preference (dark/light mode); (b) Store your Telegram API credentials locally for convenience; (c) Analyze site traffic and usage patterns; (d) Serve relevant advertisements through Google AdSense.'
      },
      {
        heading: '3. Types of Cookies We Use',
        content: 'Essential cookies: Required for basic site functionality. Analytics cookies: Help us understand how visitors use our site. Advertising cookies: Used by Google AdSense to serve relevant ads. Preference cookies: Remember your settings and preferences.'
      },
      {
        heading: '4. Managing Cookies',
        content: 'You can control and delete cookies through your browser settings. Most browsers allow you to block or delete cookies. Note that blocking essential cookies may affect site functionality.'
      },
      {
        heading: '5. Third-Party Cookies',
        content: 'Google AdSense may set cookies when displaying ads on our site. These cookies are governed by Google\'s privacy policy. You can opt out of personalized advertising at Google Ads Settings.'
      },
      {
        heading: '6. Local Storage',
        content: 'In addition to cookies, we use browser local storage to save your preferences and Telegram API credentials. Local storage data stays on your device and is not transmitted to our servers.'
      },
      {
        heading: '7. Updates to This Policy',
        content: 'We may update this Cookie Policy periodically. Changes will be posted on this page with an updated revision date.'
      }
    ]
  },
  'editorial-policy': {
    title: 'Editorial Policy',
    icon: <BookOpen className="w-5 h-5" />,
    updated: 'August 1, 2026',
    sections: [
      {
        heading: '1. Our Commitment to Quality',
        content: 'TG Media Downloader is committed to publishing accurate, helpful, and original content. Our guides and tutorials are written by experienced technical writers and developers with practical knowledge of Telegram and media downloading.'
      },
      {
        heading: '2. Editorial Independence',
        content: 'Our content is created independently and is not influenced by advertisers, sponsors, or third parties. We do not accept payment for positive reviews or content placement.'
      },
      {
        heading: '3. Accuracy and Fact-Checking',
        content: 'We strive for accuracy in all our content. Articles are fact-checked and reviewed before publication. When errors are identified, we correct them promptly and transparently.'
      },
      {
        heading: '4. Originality',
        content: 'All content on this website is original and written specifically for TG Media Downloader. We do not publish plagiarized or AI-generated content without human review and editing.'
      },
      {
        heading: '5. Transparency',
        content: 'We clearly distinguish between editorial content and advertising. Sponsored content, if any, will be clearly labeled. We disclose any potential conflicts of interest.'
      },
      {
        heading: '6. Corrections Policy',
        content: 'If we publish incorrect information, we will correct it as soon as possible. Significant corrections will be noted at the top of the affected article with the date of correction.'
      },
      {
        heading: '7. User Feedback',
        content: 'We welcome feedback from our readers. If you believe an article contains errors or outdated information, please contact us so we can review and update it.'
      },
      {
        heading: '8. Last Updated Dates',
        content: 'All articles display their publication date and last updated date. This helps readers understand the currency of the information presented.'
      }
    ]
  },
  'security': {
    title: 'Security Statement',
    icon: <Lock className="w-5 h-5" />,
    updated: 'August 1, 2026',
    sections: [
      {
        heading: '1. Our Security Commitment',
        content: 'TG Media Downloader is committed to protecting your data and privacy. Our security architecture is designed with privacy-first principles, ensuring your files and credentials remain under your control.'
      },
      {
        heading: '2. Zero Server Storage',
        content: 'Our most important security feature: we do not store your downloaded files on our servers. Media streams directly from Telegram servers to your device. This eliminates the risk of data breaches on our infrastructure.'
      },
      {
        heading: '3. Local Credential Storage',
        content: 'Your Telegram API ID and API Hash are stored locally in your browser\'s local storage. They are never transmitted to our servers. This means even if our servers were compromised, your credentials would remain safe.'
      },
      {
        heading: '4. Direct MTProto Connections',
        content: 'TG Media Downloader establishes direct MTProto connections with Telegram servers — the same encrypted protocol used by official Telegram clients. Your data is encrypted in transit using AES-256 and other industry-standard cryptography.'
      },
      {
        heading: '5. HTTPS Everywhere',
        content: 'Our website is served over HTTPS, encrypting all communication between your browser and our servers. This protects against man-in-the-middle attacks and data interception.'
      },
      {
        heading: '6. No Data Collection',
        content: 'We do not collect personal information beyond what you voluntarily provide (e.g., contact form submissions). We do not track your downloads, monitor your Telegram activity, or build profiles of our users.'
      },
      {
        heading: '7. Vulnerability Reporting',
        content: 'If you discover a security vulnerability in our service, please report it to us at security@tgdownloader.com. We take security reports seriously and will respond promptly.'
      },
      {
        heading: '8. Best Practices for Users',
        content: 'We recommend users: (a) Enable two-step verification on their Telegram account; (b) Use strong, unique passwords; (c) Keep their browser updated; (d) Only download from trusted channels; (e) Scan downloaded files with antivirus software.'
      }
    ]
  }
}

export default function LegalPagesView({ type = 'privacy-policy' }) {
  const content = LEGAL_CONTENT[type] || LEGAL_CONTENT['privacy-policy']

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    'name': `${content.title} — TG Media Downloader`,
    'description': `Read the official ${content.title} for TG Media Downloader.`
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      <SeoMeta
        title={`${content.title} — TG Media Downloader`}
        description={`Read the official ${content.title} for TG Media Downloader. Transparent policies and legal information.`}
        keywords={`tg downloader ${type}, telegram downloader legal, telegram media downloader policy`}
        jsonLd={jsonLd}
        breadcrumbs={[
          { name: 'Home', path: '/' },
          { name: content.title, path: `/${type}` }
        ]}
      />

      <div className="space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-[6px] bg-[#635BFF]/10 border border-[#635BFF]/30 text-[#635BFF] text-xs font-mono font-medium">
          {content.icon}
          <span>LEGAL & COMPLIANCE</span>
        </div>
        <h1 className="text-3xl font-extrabold text-current font-display">{content.title}</h1>
        <p className="text-slate-400 text-xs font-mono">LAST UPDATED: {content.updated}</p>
      </div>

      <div className="glass-panel p-6 sm:p-8 rounded-[12px] text-current text-xs leading-relaxed space-y-6 max-w-[72ch]">
        {content.sections.map((section, index) => (
          <section key={index} className="space-y-2">
            <h2 className="text-sm font-bold text-current font-mono">{section.heading}</h2>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">{section.content}</p>
          </section>
        ))}
      </div>

      <div className="flex flex-wrap gap-3 pt-4">
        <Link to="/privacy-policy" className="text-xs font-bold text-[#635BFF] hover:underline">Privacy Policy</Link>
        <span className="text-slate-400">•</span>
        <Link to="/terms-of-service" className="text-xs font-bold text-[#635BFF] hover:underline">Terms of Service</Link>
        <span className="text-slate-400">•</span>
        <Link to="/disclaimer" className="text-xs font-bold text-[#635BFF] hover:underline">Disclaimer</Link>
        <span className="text-slate-400">•</span>
        <Link to="/cookie-policy" className="text-xs font-bold text-[#635BFF] hover:underline">Cookie Policy</Link>
        <span className="text-slate-400">•</span>
        <Link to="/editorial-policy" className="text-xs font-bold text-[#635BFF] hover:underline">Editorial Policy</Link>
        <span className="text-slate-400">•</span>
        <Link to="/security" className="text-xs font-bold text-[#635BFF] hover:underline">Security</Link>
      </div>
    </div>
  )
}