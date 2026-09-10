import './env.js'
import { readFileSync } from 'node:fs'

const env = process.env
const bool = (value, fallback = false) => value === undefined || value === '' ? fallback : ['1', 'true', 'yes', 'on'].includes(String(value).toLowerCase())
const list = (value) => String(value || '').split(',').map((item) => item.trim()).filter(Boolean)
const options = JSON.parse(readFileSync(new URL('../../shared/form-options.json', import.meta.url), 'utf8'))
export const senderAddress = 'codekraft.hub@gmail.com'
const smtpPort = Number(env.SMTP_PORT || 465)

export const config = {
  env: env.NODE_ENV || 'development',
  port: Number(env.PORT) || 8787,
  trustProxy: env.TRUST_PROXY === undefined ? (env.VERCEL ? 1 : false) : /^\d+$/.test(env.TRUST_PROXY) ? Number(env.TRUST_PROXY) : bool(env.TRUST_PROXY),
  allowedOrigins: list(env.ALLOWED_ORIGINS),
  serveStatic: bool(env.SERVE_STATIC),
  staticDir: env.STATIC_DIR || 'dist',
  smtp: {
    host: env.SMTP_HOST || 'smtp.gmail.com',
    port: smtpPort,
    secure: bool(env.SMTP_SECURE, smtpPort === 465),
    user: env.SMTP_USER || senderAddress,
    pass: (env.SMTP_PASS || env.GMAIL_APP_PASSWORD || '').replace(/\s/g, ''),
  },
  mailFrom: { name: 'Nova Ventures Website', address: senderAddress },
  mailTo: env.MAIL_TO || env.NOVA_RECIPIENT_EMAIL || 'novaventures.nvit@gmail.com',
  careersMailTo: env.CAREERS_TO || env.MAIL_TO || env.NOVA_RECIPIENT_EMAIL || 'novaventures.nvit@gmail.com',
  contactMailTo: env.CONTACT_TO || env.MAIL_TO || env.NOVA_RECIPIENT_EMAIL || 'novaventures.nvit@gmail.com',
  sendAcknowledgement: bool(env.SEND_ACKNOWLEDGEMENT),
  mailDryRun: bool(env.MAIL_DRY_RUN),
  siteUrl: (env.SITE_URL || env.VITE_SITE_URL || 'https://nova-final-nine.vercel.app').replace(/\/+$/, ''),
  maxFileBytes: options.resume.maxBytes,
  maxTotalFileBytes: options.resume.maxTotalBytes,
  // Reserve space below Vercel's 4.5 MB limit for multipart headers and text fields.
  maxRequestBytes: 4_400_000,
}

export function assertMailConfiguration() {
  if (config.mailDryRun) {
    if (config.env === 'production' || env.VERCEL) throw Object.assign(new Error('MAIL_DRY_RUN is disabled in production.'), { code: 'MAIL_CONFIG' })
    return
  }
  if (!config.smtp.pass || !config.smtp.user || !config.smtp.host || !Number.isInteger(config.smtp.port) || config.smtp.port < 1 || config.smtp.port > 65535) {
    throw Object.assign(new Error('SMTP credentials or server settings are missing or invalid.'), { code: 'MAIL_CONFIG' })
  }
  if (/gmail\.com$/i.test(config.smtp.host) && config.smtp.user.toLowerCase() !== senderAddress) {
    throw Object.assign(new Error('Gmail SMTP_USER must match codekraft.hub@gmail.com.'), { code: 'MAIL_CONFIG' })
  }
  for (const recipient of [config.careersMailTo, config.contactMailTo]) {
    if (!list(recipient).length || list(recipient).some((address) => !/^[^\s@<>,]+@[^\s@<>,]+\.[^\s@<>,]+$/.test(address))) {
      throw Object.assign(new Error('Configure valid Nova recipient email addresses.'), { code: 'MAIL_CONFIG' })
    }
  }
}
