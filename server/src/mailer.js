import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import nodemailer from 'nodemailer'
import { config, assertMailConfiguration } from './config.js'

const outbox = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../outbox')

let transport = null

export function getTransport() {
  assertMailConfiguration()
  if (transport) return transport
  const { host, port, secure, user, pass } = config.smtp
  transport = nodemailer.createTransport({
    host,
    port,
    secure,
    auth: user && pass ? { user, pass } : undefined,
    pool: false,
    requireTLS: !secure,
    connectionTimeout: 10_000,
    greetingTimeout: 10_000,
    socketTimeout: 20_000,
  })
  return transport
}

export async function verifyTransport() {
  try { assertMailConfiguration() } catch (error) { console.error('[mail]', error.code); return false }
  if (config.mailDryRun) {
    console.log(`[mail] DRY RUN — messages are written to ${outbox}/ instead of being sent.`)
    return true
  }
  try {
    await getTransport().verify()
    return true
  } catch (err) {
    console.error('[mail] verify failed:', err?.code || 'MAIL_DELIVERY')
    return false
  }
}

export async function sendMail(message) {
  assertMailConfiguration()
  if (config.mailDryRun) return writeToOutbox(message)
  try {
    const info = await getTransport().sendMail({ ...message, from: config.mailFrom })
    if (!info.accepted?.length || info.rejected?.length) throw new Error('Recipient rejected')
    return info
  } catch (error) {
    throw Object.assign(new Error('SMTP did not confirm delivery acceptance.'), { code: 'MAIL_DELIVERY', cause: error })
  }
}

const mailboxText = (value) => value?.address ? `${value.name || ''} <${value.address}>` : String(value)

async function writeToOutbox(message) {
  await fs.mkdir(outbox, { recursive: true })
  const ref = message.headers?.['X-Nova-Reference'] || Date.now()
  const stem = path.join(outbox, `${ref}${message.headers?.['Auto-Submitted'] ? '-ack' : ''}`)
  const attachments = (message.attachments || []).filter((a) => !a.cid)
  const summary = [
    `From: ${config.mailFrom.name} <${config.mailFrom.address}>`,
    `To: ${mailboxText(message.to)}`,
    message.replyTo ? `Reply-To: ${mailboxText(message.replyTo)}` : null,
    `Subject: ${message.subject}`,
    `Attachments: ${attachments.map((a) => a.filename).join(', ') || 'none'}`,
    '',
    message.text,
  ]
    .filter((l) => l !== null)
    .join('\n')
  await fs.writeFile(`${stem}.txt`, summary)
  await fs.writeFile(`${stem}.html`, message.html.replace('cid:nova-logo', '../assets/nova-logo-email.png'))
  for (const a of attachments) if (a.content) await fs.writeFile(path.join(outbox, a.filename), a.content)
  console.log(`[mail] dry run → ${path.relative(process.cwd(), stem)}.html`)
  return { messageId: `dry-run-${ref}`, dryRun: true }
}

export function closeTransport() { transport?.close(); transport = null }
