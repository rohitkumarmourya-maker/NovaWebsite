import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import nodemailer from 'nodemailer'
import { config } from './config.js'

const outbox = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../outbox')

let transport = null

export function getTransport() {
  if (transport) return transport
  const { host, port, secure, user, pass } = config.smtp
  transport = nodemailer.createTransport({
    host,
    port,
    secure,
    auth: user && pass ? { user, pass } : undefined,
    pool: true,
    maxConnections: 2,
    maxMessages: 50,
    connectionTimeout: 15_000,
    socketTimeout: 30_000,
  })
  return transport
}

export async function verifyTransport() {
  if (config.mailDryRun) {
    console.log(`[mail] DRY RUN — messages are written to ${outbox}/ instead of being sent.`)
    return true
  }
  try {
    await getTransport().verify()
    return true
  } catch (err) {
    console.error('[mail] verify failed:', err?.message || err)
    return false
  }
}

export async function sendMail(message) {
  if (config.mailDryRun) return writeToOutbox(message)
  const info = await getTransport().sendMail({ from: config.mailFrom, ...message })
  return info
}

async function writeToOutbox(message) {
  await fs.mkdir(outbox, { recursive: true })
  const ref = message.headers?.['X-Nova-Reference'] || Date.now()
  const stem = path.join(outbox, `${ref}${message.headers?.['Auto-Submitted'] ? '-ack' : ''}`)
  const attachments = (message.attachments || []).filter((a) => !a.cid)
  const summary = [
    `From: ${config.mailFrom}`,
    `To: ${message.to}`,
    message.replyTo ? `Reply-To: ${message.replyTo}` : null,
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
