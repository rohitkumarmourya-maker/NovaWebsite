/**
 * Nova Ventures form API
 * ----------------------
 * Receives job / internship applications and contact enquiries from the website and
 * delivers them as well-structured e-mails (with the CV and cover letter attached) to
 * the careers mailbox. Nothing is stored on disk.
 *
 *   npm start          production
 *   npm run dev        auto-restart on change
 *
 * Configuration: see ../.env.example
 */
import 'dotenv/config'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import express from 'express' // Express 5
import helmet from 'helmet'
import cors from 'cors'
import { applyRoute, contactRoute } from './routes.js'
import { applyLimiter, contactLimiter, globalLimiter } from './security.js'
import { config } from './config.js'
import { verifyTransport } from './mailer.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const app = express()

app.disable('x-powered-by')
app.set('trust proxy', config.trustProxy)

// --- Security headers -------------------------------------------------------
app.use(
  helmet({
    contentSecurityPolicy: {
      useDefaults: false,
      directives: {
        'default-src': ["'self'"],
        'script-src': ["'self'"],
        'style-src': ["'self'", "'unsafe-inline'"],
        'img-src': ["'self'", 'data:', 'blob:'],
        'font-src': ["'self'"],
        'connect-src': ["'self'"],
        'object-src': ["'none'"],
        'base-uri': ["'self'"],
        'form-action': ["'self'"],
        'frame-ancestors': ["'none'"],
        'manifest-src': ["'self'"],
        'worker-src': ["'self'"],
        'upgrade-insecure-requests': [],
      },
    },
    frameguard: { action: 'deny' },
    crossOriginEmbedderPolicy: false,
    crossOriginResourcePolicy: { policy: 'same-origin' },
    referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
    hsts: { maxAge: 63072000, includeSubDomains: true, preload: true },
  }),
)
app.use((_, res, next) => {
  res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=(), payment=(), usb=(), interest-cohort=(), browsing-topics=()')
  next()
})

// --- CORS (only needed when the API is on a different origin than the site) -------
if (config.allowedOrigins.length) {
  app.use(
    '/api',
    cors({
      origin(origin, cb) {
        if (!origin || config.allowedOrigins.includes(origin)) return cb(null, true)
        return cb(new Error('Origin not allowed'))
      },
      methods: ['POST', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Accept'],
      maxAge: 600,
    }),
  )
}

app.use('/api', globalLimiter)
app.use('/api', express.json({ limit: '32kb' }))

// --- Routes -------------------------------------------------------------------
app.get('/api/health', (_req, res) => res.json({ ok: true, service: 'nova-ventures-api', time: new Date().toISOString() }))
app.post('/api/apply', applyLimiter, applyRoute)
app.post('/api/contact', contactLimiter, contactRoute)
app.all('/api/{*splat}', (_req, res) => res.status(404).json({ ok: false, error: 'Not found' }))

// --- Optional: serve the static site build (single-process deployment) ---------
if (config.serveStatic) {
  const dist = path.resolve(__dirname, '../..', config.staticDir)
  const immutable = (res, filePath) => {
    if (/\/assets\/.*\.[a-f0-9]{8,}\./i.test(filePath) || /\.(woff2|webp|jpg|png)$/i.test(filePath)) {
      res.setHeader('Cache-Control', 'public, max-age=31536000, immutable')
    } else if (/\.html$/i.test(filePath)) {
      res.setHeader('Cache-Control', 'public, max-age=0, must-revalidate')
    }
  }
  app.use(express.static(dist, { index: false, redirect: false, maxAge: '1h', setHeaders: immutable }))

  // Prerendered routes live at <route>/index.html (no trailing-slash redirect, so canonical
  // URLs stay clean). Unknown paths get the real 404 page with a 404 status — no soft-404s.
  app.get('/{*splat}', (req, res) => {
    const clean = req.path.replace(/\/+$/, '') || '/'
    if (clean !== req.path && clean !== '/') return res.redirect(301, clean + (req.url.includes('?') ? req.url.slice(req.url.indexOf('?')) : ''))
    const candidate = clean === '/' ? path.join(dist, 'index.html') : path.join(dist, clean, 'index.html')
    res.sendFile(candidate, { headers: { 'Cache-Control': 'public, max-age=0, must-revalidate' } }, (err) => {
      if (!err) return
      res.status(404).sendFile(path.join(dist, '404.html'), (err2) => {
        if (err2) res.status(404).type('text').send('Not found')
      })
    })
  })
}

// --- Error handling -----------------------------------------------------------
// eslint-disable-next-line no-unused-vars
app.use((err, _req, res, _next) => {
  if (err?.message === 'Origin not allowed') return res.status(403).json({ ok: false, error: 'Origin not allowed' })
  if (err?.code === 'LIMIT_FILE_SIZE') return res.status(413).json({ ok: false, error: 'A file is larger than 5 MB.' })
  if (err?.code === 'LIMIT_UNEXPECTED_FILE') return res.status(400).json({ ok: false, error: 'Unexpected file field.' })
  if (err?.type === 'entity.too.large') return res.status(413).json({ ok: false, error: 'Request too large.' })
  console.error('[api] unhandled error:', err?.message || err)
  res.status(500).json({ ok: false, error: 'Something went wrong. Please try again.' })
})

app.listen(config.port, async () => {
  console.log(`Nova Ventures API listening on http://localhost:${config.port}  (env: ${config.env})`)
  if (config.serveStatic) console.log(`Serving static site from ${config.staticDir}/`)
  const ok = await verifyTransport()
  console.log(ok ? 'SMTP connection verified.' : 'SMTP not verified — check SMTP_* settings in .env (mails will fail).')
})
