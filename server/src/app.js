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
import './env.js'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import express from 'express' // Express 5
import helmet from 'helmet'
import cors from 'cors'
import { applyRoute, contactRoute } from './routes.js'
import { applyLimiter, contactLimiter, globalLimiter } from './security.js'
import { config } from './config.js'
import { buildCsp } from '../../site.config.mjs'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const app = express()

app.disable('x-powered-by')
app.set('trust proxy', config.trustProxy)

// --- Security headers -------------------------------------------------------
app.use(
  helmet({
    contentSecurityPolicy: false,
    frameguard: { action: 'deny' },
    crossOriginEmbedderPolicy: false,
    crossOriginResourcePolicy: { policy: 'same-origin' },
    referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
    hsts: { maxAge: 63072000, includeSubDomains: true, preload: true },
  }),
)
app.use((_, res, next) => {
  res.setHeader('Content-Security-Policy', buildCsp())
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
      methods: ['GET', 'POST', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Accept'],
      maxAge: 600,
    }),
  )
}

app.use('/api', (req, res, next) => {
  res.setHeader('Cache-Control', 'no-store')
  const origin = req.headers.origin
  const ownOrigin = `${req.protocol}://${req.get('host')}`
  const allowed = [ownOrigin, config.siteUrl, ...config.allowedOrigins]
  if (origin && !allowed.includes(origin)) return res.status(403).json({ ok: false, error: 'This website is not allowed to submit forms to this service.' })
  if (Number(req.headers['content-length']) > config.maxRequestBytes) return res.status(413).json({ ok: false, error: 'All attachments combined must be under 4 MB.' })
  next()
})
app.use('/api', globalLimiter)
app.use('/api', express.json({ limit: '32kb' }))

// --- Routes -------------------------------------------------------------------
app.get('/api/health', (_req, res) => res.json({ ok: true, service: 'nova-ventures-api', time: new Date().toISOString() }))
app.post('/api/apply', applyLimiter, (req, res, next) => req.is('multipart/form-data') ? next() : res.status(415).json({ ok: false, error: 'Submit the application as multipart form data.' }), applyRoute)
app.post('/api/contact', contactLimiter, (req, res, next) => req.is('application/json') ? next() : res.status(415).json({ ok: false, error: 'Submit the enquiry as JSON.' }), contactRoute)
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
  if (err?.code === 'LIMIT_FILE_SIZE') return res.status(413).json({ ok: false, error: 'All attachments combined must be under 4 MB.' })
  if (err?.code === 'LIMIT_UNEXPECTED_FILE') return res.status(400).json({ ok: false, error: 'Unexpected file field.' })
  if (err?.type === 'entity.too.large') return res.status(413).json({ ok: false, error: 'Request too large.' })
  if (err?.code?.startsWith('LIMIT_') || err?.message?.includes('Multipart') || err?.message === 'Unexpected end of form') return res.status(400).json({ ok: false, error: 'The upload could not be read. Check your files and try again.' })
  if (err?.type === 'entity.parse.failed') return res.status(400).json({ ok: false, error: 'Invalid JSON request.' })
  // Log diagnostic codes only: no applicant data, passwords or full SMTP responses.
  console.error('[api] request failed:', err?.code || 'UNEXPECTED_ERROR')
  if (['MAIL_CONFIG', 'MAIL_DELIVERY', 'EAUTH', 'ECONNECTION', 'ETIMEDOUT', 'ESOCKET', 'EENVELOPE', 'EMESSAGE'].includes(err?.code)) {
    return res.status(503).json({ ok: false, error: 'We could not confirm email delivery. Your form has been kept on this page. Please try later or use the email option below.' })
  }
  res.status(500).json({ ok: false, error: 'The submission could not be completed. Your details are still on this page. Please try again.' })
})

export default app
