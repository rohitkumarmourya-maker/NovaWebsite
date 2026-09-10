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
  limits: { fileSize: config.maxFileBytes, files: 2, fields: 40, fieldSize: 8 * 1024, parts: 44 },
  fileFilter(_req, file, cb) {
    const ok = /\.(pdf|docx?)$/i.test(file.originalname) && (!file.mimetype || ALLOWED_MIME.has(file.mimetype))
    cb(ok ? null : Object.assign(new Error('Only PDF, DOC or DOCX files are accepted.'), { code: 'BAD_FILE_TYPE' }), ok)
  },
})

const ALLOWED_MIME = new Set([
  'application/octet-stream',
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
  let detected
  try { detected = await fileTypeFromBuffer(file.buffer) } catch { return null }
  if (ext === '.pdf') return detected?.ext === 'pdf' ? 'pdf' : null
  if (ext === '.docx') return detected?.ext === 'docx' ? 'docx' : null
  if (ext === '.doc') return detected?.ext === 'cfb' || detected?.mime === 'application/x-cfb' ? 'doc' : null
  return null
}

/** Honeypot only. Fast submissions and autofill must never be silently discarded. */
export function looksLikeBot(body) {
  return Boolean(body.website && String(body.website).trim())
}
