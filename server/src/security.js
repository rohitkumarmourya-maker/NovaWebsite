import rateLimit from 'express-rate-limit'
import multer from 'multer'
import { fileTypeFromBuffer } from 'file-type'
import { config } from './config.js'

const json429 = (message) => ({
  handler: (_req, res) => res.status(429).json({ ok: false, error: message }),
  standardHeaders: 'draft-7',
  legacyHeaders: false,
})

/** Blanket limit for everything under /api. */
export const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 120,
  ...json429('Too many requests. Please try again in a few minutes.'),
})

/** Applications are heavier (attachments) — 6 per hour per IP is generous for real people. */
export const applyLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  limit: 6,
  ...json429('Too many applications from this connection. Please try again in an hour.'),
})

export const contactLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  limit: 12,
  ...json429('Too many enquiries from this connection. Please try again later.'),
})

/** Memory storage — attachments are forwarded straight to the mail transport, never written to disk. */
export const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: config.maxFileBytes, files: 2, fields: 40, fieldSize: 8 * 1024 },
  fileFilter(_req, file, cb) {
    const ok = /\.(pdf|docx?)$/i.test(file.originalname) && ALLOWED_MIME.has(file.mimetype)
    cb(ok ? null : Object.assign(new Error('Only PDF, DOC or DOCX files are accepted.'), { code: 'BAD_FILE_TYPE' }), ok)
  },
})

const ALLOWED_MIME = new Set([
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
])

/**
 * Verifies the real content of an upload by its magic bytes (a renamed .exe is rejected even
 * if the browser claimed it was a PDF). Returns a normalised extension or null.
 */
export async function sniffDocument(file) {
  if (!file || !file.buffer?.length) return null
  const ext = file.originalname.toLowerCase().slice(file.originalname.lastIndexOf('.'))
  const detected = await fileTypeFromBuffer(file.buffer)
  if (ext === '.pdf') return detected?.ext === 'pdf' ? 'pdf' : null
  if (ext === '.docx') return detected?.ext === 'docx' || detected?.ext === 'zip' ? 'docx' : null
  if (ext === '.doc') return detected?.ext === 'cfb' || detected?.mime === 'application/x-cfb' ? 'doc' : null
  return null
}

/** Cloudflare Turnstile verification — optional, enabled by setting TURNSTILE_SECRET. */
export async function verifyTurnstile(token, ip) {
  if (!config.turnstileSecret) return true
  if (!token) return false
  try {
    const res = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ secret: config.turnstileSecret, response: token, remoteip: ip }),
    })
    const data = await res.json()
    return Boolean(data.success)
  } catch {
    return false
  }
}

/** Honeypot + timing checks. Bots fill hidden fields and submit within a second or two. */
export function looksLikeBot(body) {
  if (body.website && String(body.website).trim() !== '') return true
  const started = Number(body.startedAt)
  if (Number.isFinite(started) && started > 0) {
    const elapsed = (Date.now() - started) / 1000
    if (elapsed >= 0 && elapsed < config.minFormSeconds) return true
  }
  return false
}
