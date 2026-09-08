const env = process.env

const bool = (v, d = false) => (v === undefined || v === '' ? d : ['1', 'true', 'yes', 'on'].includes(String(v).toLowerCase()))
const list = (v) =>
  String(v || '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean)

export const config = {
  env: env.NODE_ENV || 'development',
  port: Number(env.PORT) || 8787,
  trustProxy: env.TRUST_PROXY === undefined ? false : /^\d+$/.test(env.TRUST_PROXY) ? Number(env.TRUST_PROXY) : bool(env.TRUST_PROXY),
  allowedOrigins: list(env.ALLOWED_ORIGINS),
  serveStatic: bool(env.SERVE_STATIC, false),
  staticDir: env.STATIC_DIR || 'dist',

  // Mail
  smtp: {
    host: env.SMTP_HOST || 'smtp.gmail.com',
    port: Number(env.SMTP_PORT) || 465,
    secure: env.SMTP_SECURE === undefined ? (Number(env.SMTP_PORT) || 465) === 465 : bool(env.SMTP_SECURE, true),
    user: env.SMTP_USER || '',
    pass: env.SMTP_PASS || '',
  },
  mailTo: env.MAIL_TO || 'novaventures.nvit@gmail.com',
  mailFrom: env.MAIL_FROM || `"Nova Ventures Website" <${env.SMTP_USER || 'novaventures.nvit@gmail.com'}>`,
  sendAcknowledgement: bool(env.SEND_ACKNOWLEDGEMENT, true),
  /** Dry run: write e-mails to server/outbox/ instead of sending (local testing, design preview). */
  mailDryRun: bool(env.MAIL_DRY_RUN, false),
  siteUrl: (env.SITE_URL || 'https://www.novaventures.example').replace(/\/+$/, ''),

  // Anti-abuse
  minFormSeconds: Number(env.MIN_FORM_SECONDS) || 4,
  turnstileSecret: env.TURNSTILE_SECRET || '',
  maxFileBytes: 5 * 1024 * 1024,
}
