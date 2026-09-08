/**
 * Single source of truth for deployment-specific values.
 *
 * Used by: vite.config.ts (CSP meta + env), scripts/generate-hosting-files.mjs
 * (sitemap, robots, security headers), scripts/prerender.mjs (canonical URLs).
 *
 * Override at build time with environment variables:
 *   VITE_SITE_URL=https://www.novaventures.in  VITE_API_BASE=https://api.novaventures.in  npm run build
 */
import path from 'node:path'
import { fileURLToPath } from 'node:url'

try {
  process.loadEnvFile?.(path.resolve(fileURLToPath(new URL('.', import.meta.url)), '.env'))
} catch {}

const trim = (s) => (s || '').trim().replace(/\/+$/, '')

export const siteUrl = trim(process.env.VITE_SITE_URL) || 'https://www.novaventures.example'

/**
 * Where the form API lives. Leave empty when the API is served from the same origin
 * (Express serving dist/, or a reverse proxy mapping /api → the Node service).
 */
export const apiBase = trim(process.env.VITE_API_BASE) || ''

export const company = {
  name: 'Nova Ventures',
  legalName: 'Nova Ventures Innovation and Technology Private Limited',
  email: 'novaventures.nvit@gmail.com',
  state: 'Chhattisgarh',
  country: 'India',
}

/** Static routes (business pages are appended by the scripts from src/data/businesses). */
export const staticRoutes = [
  { path: '/', priority: '1.0', changefreq: 'weekly' },
  { path: '/about', priority: '0.8', changefreq: 'monthly' },
  { path: '/businesses', priority: '0.9', changefreq: 'monthly' },
  { path: '/capabilities', priority: '0.7', changefreq: 'monthly' },
  { path: '/innovation', priority: '0.7', changefreq: 'monthly' },
  { path: '/careers', priority: '0.8', changefreq: 'weekly' },
  { path: '/contact', priority: '0.7', changefreq: 'yearly' },
  { path: '/news', priority: '0.6', changefreq: 'weekly' },
  { path: '/privacy', priority: '0.3', changefreq: 'yearly' },
]

export const businessIds = [
  'manufacturing',
  'it-software',
  'skill-development',
  'civil-construction',
  'hemm-heavy-equipment',
  'healthcare-products',
]

/**
 * Content-Security-Policy. Everything is self-hosted (fonts, images, scripts), so the
 * policy is deliberately strict. `connect-src` is widened only when the API is on
 * another origin. `'unsafe-inline'` for styles is required by React inline `style=`
 * attributes and by the reveal/transition helpers; scripts never use it.
 */
export function buildCsp({ forMeta = false } = {}) {
  const connect = ["'self'", apiBase].filter(Boolean).join(' ')
  const directives = [
    "default-src 'self'",
    "script-src 'self'",
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: blob:",
    "font-src 'self'",
    `connect-src ${connect}`,
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "manifest-src 'self'",
    "worker-src 'self'",
    'upgrade-insecure-requests',
  ]
  // frame-ancestors is ignored inside <meta>; it is delivered via HTTP headers instead.
  if (!forMeta) directives.push("frame-ancestors 'none'")
  return directives.join('; ')
}

export const securityHeaders = () => ({
  'Content-Security-Policy': buildCsp(),
  'Strict-Transport-Security': 'max-age=63072000; includeSubDomains; preload',
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy':
    'camera=(), microphone=(), geolocation=(), payment=(), usb=(), interest-cohort=(), browsing-topics=()',
  'Cross-Origin-Opener-Policy': 'same-origin',
  'Cross-Origin-Resource-Policy': 'same-origin',
  'X-Permitted-Cross-Domain-Policies': 'none',
})
