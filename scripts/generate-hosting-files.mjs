/**
 * Generates the deployment files that depend on site.config.mjs:
 *
 *   public/sitemap.xml      all routes (static + one per business)
 *   public/robots.txt
 *   public/_headers         Netlify / Cloudflare Pages security headers
 *   public/_redirects       Netlify SPA fallback
 *   public/.htaccess        Apache / cPanel security headers + SPA fallback
 *   vercel.json             Vercel headers + rewrites
 *
 * Runs automatically as part of `npm run build`.
 */
import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { businessIds, securityHeaders, siteUrl, staticRoutes } from '../site.config.mjs'

const root = fileURLToPath(new URL('..', import.meta.url))
const pub = path.join(root, 'public')
const today = new Date().toISOString().slice(0, 10)

const routes = [
  ...staticRoutes,
  ...businessIds.map((id) => ({ path: `/businesses/${id}`, priority: '0.8', changefreq: 'monthly' })),
]

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${routes
  .map(
    (r) => `  <url>
    <loc>${siteUrl}${r.path === '/' ? '/' : r.path}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${r.changefreq}</changefreq>
    <priority>${r.priority}</priority>
  </url>`,
  )
  .join('\n')}
</urlset>
`

const robots = `User-agent: *
Allow: /
Disallow: /api/
Disallow: /admin/

Sitemap: ${siteUrl}/sitemap.xml
`

const headers = securityHeaders()
const headerLines = Object.entries(headers)
  .map(([k, v]) => `  ${k}: ${v}`)
  .join('\n')

const netlifyHeaders = `/*
${headerLines}
  Cache-Control: public, max-age=0, must-revalidate

/assets/*
  Cache-Control: public, max-age=31536000, immutable

/fonts/*
  Cache-Control: public, max-age=31536000, immutable

/images/*
  Cache-Control: public, max-age=2592000

/logos/*
  Cache-Control: public, max-age=2592000
`

const netlifyRedirects = `# Prerendered pages are served as real files; anything unknown falls back to the app shell.
/*    /index.html   200
`

const htaccess = `# Nova Ventures — Apache / cPanel configuration
Options -Indexes
<IfModule mod_headers.c>
${Object.entries(headers)
  .map(([k, v]) => `  Header always set ${k} "${v.replace(/"/g, '\\"')}"`)
  .join('\n')}
  <FilesMatch "\\.(js|css|woff2)$">
    Header set Cache-Control "public, max-age=31536000, immutable"
  </FilesMatch>
  <FilesMatch "\\.(webp|jpg|png)$">
    Header set Cache-Control "public, max-age=2592000"
  </FilesMatch>
</IfModule>

<IfModule mod_rewrite.c>
  RewriteEngine On
  # Force HTTPS
  RewriteCond %{HTTPS} !=on
  RewriteRule ^ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]
  # Serve prerendered pages (/about → /about/index.html), then fall back to the app shell
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME}/index.html -f
  RewriteRule ^(.*)$ $1/index.html [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule ^ /index.html [L]
</IfModule>

<FilesMatch "^\\.">
  Require all denied
</FilesMatch>
`

const adminRoutes = [
  '/admin',
  '/admin/login',
  '/admin/messages',
  '/admin/applications',
  '/admin/projects',
]

const vercel = {
  $schema: 'https://openapi.vercel.sh/vercel.json',
  framework: 'vite',
  buildCommand: 'npm run build',
  outputDirectory: 'dist',
  installCommand: 'npm ci',
  functions: { 'api/index.js': { maxDuration: 60, includeFiles: '{server/assets/**,shared/**}' } },
  cleanUrls: true,
  trailingSlash: false,
  headers: [
    { source: '/(.*)', headers: Object.entries(headers).map(([key, value]) => ({ key, value })) },
    { source: '/assets/(.*)', headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }] },
    { source: '/fonts/(.*)', headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }] },
  ],
  rewrites: [
    { source: '/api/:path*', destination: '/api' },
    ...routes.filter((route) => route.path !== '/').map((route) => ({ source: route.path, destination: `${route.path}/index.html` })),
    ...adminRoutes.map((path) => ({ source: path, destination: `${path}/index.html` })),
    { source: '/admin/:path*', destination: '/index.html' },
    { source: '/(.*)', destination: '/index.html' },
  ],
}

await fs.writeFile(path.join(pub, 'sitemap.xml'), sitemap)
await fs.writeFile(path.join(pub, 'robots.txt'), robots)
await fs.writeFile(path.join(pub, '_headers'), netlifyHeaders)
await fs.writeFile(path.join(pub, '_redirects'), netlifyRedirects)
await fs.writeFile(path.join(pub, '.htaccess'), htaccess)
await fs.writeFile(path.join(root, 'vercel.json'), JSON.stringify(vercel, null, 2) + '\n')
console.log(`✓ hosting files generated for ${siteUrl} (${routes.length} routes)`)
