# Generates public/sitemap.xml from blog data files. Run: python scripts/gen_sitemap.py
import re, os, datetime

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SITE = 'https://tg-media-bulk-downloader.netlify.app'

def grab(fname):
    with open(os.path.join(ROOT, 'src/data', fname), encoding='utf-8') as f:
        return re.findall(r"slug:\s*'([^']+)'", f.read())

slugs = []
for s in grab('blogPosts.js') + grab('blogPosts2.js'):
    if s not in slugs:
        slugs.append(s)

pages = [
    ('/', 1.0, 'daily'), ('/downloader', 0.9, 'daily'), ('/desktop-app', 0.8, 'weekly'),
    ('/features', 0.7, 'weekly'), ('/blog', 0.8, 'daily'), ('/faq', 0.6, 'monthly'),
    ('/docs', 0.6, 'monthly'), ('/about', 0.6, 'monthly'), ('/contact', 0.6, 'monthly'),
    ('/sitemap', 0.4, 'monthly'), ('/privacy-policy', 0.4, 'monthly'),
    ('/terms-of-service', 0.4, 'monthly'), ('/disclaimer', 0.4, 'monthly'),
    ('/cookie-policy', 0.4, 'monthly'), ('/editorial-policy', 0.4, 'monthly'),
    ('/security', 0.4, 'monthly'),
]

today = datetime.date.today().isoformat()
lines = ['<?xml version="1.0" encoding="UTF-8"?>',
         '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">']
for p, pr, freq in pages:
    lines.append('  <url>\n    <loc>%s%s</loc>\n    <lastmod>%s</lastmod>\n    <changefreq>%s</changefreq>\n    <priority>%s</priority>\n  </url>' % (SITE, p, today, freq, pr))
for slug in slugs:
    lines.append('  <url>\n    <loc>%s/blog/%s</loc>\n    <lastmod>%s</lastmod>\n    <changefreq>monthly</changefreq>\n    <priority>0.6</priority>\n  </url>' % (SITE, slug, today))
lines.append('</urlset>')

with open(os.path.join(ROOT, 'public/sitemap.xml'), 'w', encoding='utf-8') as f:
    f.write('\n'.join(lines) + '\n')

print('sitemap.xml generated: %d static + %d blog = %d URLs' % (len(pages), len(slugs), len(pages) + len(slugs)))