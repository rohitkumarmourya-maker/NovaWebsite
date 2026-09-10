import assert from 'node:assert/strict'
import { after, before, beforeEach, test } from 'node:test'
import { once } from 'node:events'
import { SMTPServer } from 'smtp-server'
import { simpleParser } from 'mailparser'

// All mail stays on loopback. No real provider or recipient is contacted.
process.env.NODE_ENV = 'test'
process.env.MAIL_DRY_RUN = 'false'
process.env.SMTP_HOST = '127.0.0.1'
process.env.SMTP_USER = 'codekraft.hub@gmail.com'
process.env.SMTP_PASS = 'test-only-password'
process.env.SMTP_SECURE = 'false'
process.env.MAIL_TO = 'default@nova.test'
process.env.CAREERS_TO = 'careers@nova.test'
process.env.CONTACT_TO = 'contact@nova.test'
process.env.SEND_ACKNOWLEDGEMENT = 'true'
process.env.ALLOWED_ORIGINS = 'https://frontend.nova.test'
process.env.TRUST_PROXY = 'false'
process.env.SERVE_STATIC = 'false'

let rejectRecipient = ''
const messages = []
const smtp = new SMTPServer({
  secure: false,
  disabledCommands: ['STARTTLS'],
  onAuth(auth, _session, callback) {
    callback(auth.username === 'codekraft.hub@gmail.com' && auth.password === 'test-only-password' ? null : new Error('Invalid test credentials'), { user: auth.username })
  },
  onRcptTo(address, _session, callback) {
    callback(address.address === rejectRecipient ? Object.assign(new Error('Rejected test recipient'), { responseCode: 550 }) : null)
  },
  onData(stream, session, callback) {
    simpleParser(stream).then((message) => { messages.push({ message, envelope: structuredClone(session.envelope) }); callback() }, callback)
  },
})
smtp.listen(0, '127.0.0.1')
await once(smtp.server, 'listening')
process.env.SMTP_PORT = String(smtp.server.address().port)
const { default: app } = await import('../src/app.js')
const { config, assertMailConfiguration, senderAddress } = await import('../src/config.js')
const { getTransport, closeTransport } = await import('../src/mailer.js')
const { applyLimiter, contactLimiter, globalLimiter, looksLikeBot, sniffDocument } = await import('../src/security.js')
const { applicationSchema, enquirySchema } = await import('../src/validate.js')
const { activeOpenings } = await import('../../shared/careers-data.ts')
// Only this isolated emulator connection uses plaintext. Production defaults require TLS.
const transport = getTransport()
assert.equal(transport.transporter.options.requireTLS, true)
transport.transporter.options.requireTLS = false
transport.transporter.options.ignoreTLS = true
let server, base
before(async () => {
  server = app.listen(0, '127.0.0.1')
  await once(server, 'listening')
  base = `http://127.0.0.1:${server.address().port}`
})
beforeEach(() => {
  rejectRecipient = ''
  messages.length = 0
  for (const limiter of [globalLimiter, contactLimiter, applyLimiter]) limiter.resetKey('127.0.0.1')
})
after(async () => {
  closeTransport()
  server.closeAllConnections()
  await new Promise((resolve) => server.close(resolve))
  await new Promise((resolve) => smtp.close(resolve))
})

const pdf = Buffer.from('%PDF-1.4\n1 0 obj<</Type/Catalog>>endobj\ntrailer<</Root 1 0 R>>\n%%EOF')
const enquiry = { category: 'Manufacturing', name: 'Test Visitor', email: 'visitor@example.test', phone: '+91 98765 43210', organisation: 'Test Company', message: 'Please discuss our machining requirements.', consent: 'true', website: '', startedAt: Date.now() }
const applicant = {
  applicationType: 'Job', position: 'Software Engineer', vertical: 'IT', availability: '30 days',
  fullName: 'Test Candidate', email: 'candidate@example.test', phone: '+91 98765 43210', city: 'Bilaspur',
  qualification: 'ITI / Diploma', institution: 'Technical Institute', graduationYear: '2024', experience: '1 - 3 years',
  skills: 'TypeScript, React and SQL', consent: 'true', declaration: 'true', website: '', startedAt: String(Date.now()),
}
const applicationBody = (values = {}, file = pdf, name = 'candidate.pdf', type = 'application/pdf') => {
  const form = new FormData()
  for (const [key, value] of Object.entries({ ...applicant, ...values })) form.append(key, value)
  if (file) form.append('resume', new Blob([file], { type }), name)
  return form
}
const contact = (body, headers = {}) => fetch(`${base}/api/contact`, { method: 'POST', headers: { 'Content-Type': 'application/json', ...headers }, body: JSON.stringify(body) })

test('contact sends MIME email from the required sender to the contact inbox', async () => {
  const response = await contact(enquiry)
  assert.equal(response.status, 200)
  const result = await response.json()
  assert.equal(result.delivery, 'accepted')
  assert.match(result.reference, /^NQ-\d{8}-[A-F0-9]{12}$/)
  assert.equal(messages.length, 1)
  const { message, envelope } = messages[0]
  assert.equal(message.from.value[0].address, senderAddress)
  assert.equal(envelope.mailFrom.address, senderAddress)
  assert.equal(message.to.value[0].address, 'contact@nova.test')
  assert.equal(message.replyTo.value[0].address, enquiry.email)
  assert.match(message.subject, /Nova Enquiry/)
  assert.match(message.text, /machining requirements/)
  assert.ok(message.html.includes('Test Visitor'))
  assert.equal(message.attachments[0].contentId, '<nova-logo>')
  assert.equal(response.headers.get('cache-control'), 'no-store')
})

test('application sends CV and cover letter and awaits acknowledgement', async () => {
  const form = applicationBody()
  form.append('coverLetterFile', new Blob([pdf], { type: 'application/pdf' }), 'cover.pdf')
  const response = await fetch(`${base}/api/apply`, { method: 'POST', body: form })
  assert.equal(response.status, 200)
  const result = await response.json()
  assert.equal(result.acknowledgement, 'sent')
  assert.equal(messages.length, 2)
  const message = messages[0].message
  assert.equal(message.from.value[0].address, senderAddress)
  assert.equal(message.to.value[0].address, 'careers@nova.test')
  assert.equal(message.replyTo.value[0].address, applicant.email)
  assert.match(message.subject, /\[Nova Careers\] Job · Software Engineer/)
  const documents = message.attachments.filter((attachment) => !attachment.contentId)
  assert.equal(documents.length, 2)
  assert.ok(documents[0].filename.includes(result.reference))
  assert.deepEqual(documents[0].content, pdf)
  assert.deepEqual(documents[1].content, pdf)
  assert.equal(messages[1].message.to.value[0].address, applicant.email)
  assert.equal(messages[1].message.replyTo.value[0].address, 'careers@nova.test')
})

test('failed acknowledgement does not discard an accepted application', async () => {
  rejectRecipient = applicant.email
  const response = await fetch(`${base}/api/apply`, { method: 'POST', body: applicationBody() })
  assert.equal(response.status, 200)
  assert.equal((await response.json()).acknowledgement, 'failed')
  assert.equal(messages.length, 1)
})

test('SMTP rejection returns a useful error and never a success reference', async () => {
  rejectRecipient = 'contact@nova.test'
  const response = await contact(enquiry)
  assert.equal(response.status, 503)
  const result = await response.json()
  assert.equal(result.ok, false)
  assert.equal(result.reference, undefined)
  assert.match(result.error, /confirm email delivery/)
  assert.equal(messages.length, 0)
})

test('missing SMTP credentials return 503 without leaking settings', async () => {
  const password = config.smtp.pass
  config.smtp.pass = ''
  try {
    const response = await contact(enquiry)
    assert.equal(response.status, 503)
    assert.doesNotMatch(await response.text(), /test-only-password|SMTP_PASS/)
  } finally { config.smtp.pass = password }
})

test('JSON validation, malformed JSON and wrong media types return 4xx', async () => {
  let response = await contact({ ...enquiry, email: 'bad', consent: 'false' })
  assert.equal(response.status, 422)
  const body = await response.json()
  assert.ok(body.fields.email && body.fields.consent)
  response = await fetch(`${base}/api/contact`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: '{broken' })
  assert.equal(response.status, 400)
  response = await fetch(`${base}/api/apply`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: '{}' })
  assert.equal(response.status, 415)
  assert.equal(messages.length, 0)
})

test('missing, spoofed and truncated resumes are rejected without sending mail', async () => {
  for (const file of [null, Buffer.from('not a PDF'), Buffer.from('P')]) {
    const response = await fetch(`${base}/api/apply`, { method: 'POST', body: applicationBody({}, file) })
    assert.equal(response.status, 422)
    assert.ok((await response.json()).fields.resume)
  }
  assert.equal(messages.length, 0)
})

test('arbitrary ZIP content renamed DOCX is rejected', async () => {
  const zip = Buffer.from('UEsDBAoAAAAAAAFQIloAAAAAAAAAAAAAAAAFAAAAYi50eHRQSwECHgMKAAAAAAABUCJaAAAAAAAAAAAAAAAABQAAAAAAAAABAAAApIEAAAAAYi50eHRQSwUGAAAAAAEAAQAzAAAAIwAAAAAA', 'base64')
  assert.equal(await sniffDocument({ originalname: 'resume.docx', buffer: zip }), null)
})

test('total attachment limit is enforced before mail', async () => {
  const oversized = Buffer.alloc(4 * 1024 * 1024 + 1)
  pdf.copy(oversized)
  let response = await fetch(`${base}/api/apply`, { method: 'POST', body: applicationBody({}, oversized) })
  assert.equal(response.status, 413)
  const form = applicationBody({}, Buffer.concat([pdf, Buffer.alloc(2 * 1024 * 1024)]))
  form.append('coverLetterFile', new Blob([pdf, Buffer.alloc(2 * 1024 * 1024)], { type: 'application/pdf' }), 'cover.pdf')
  response = await fetch(`${base}/api/apply`, { method: 'POST', body: form })
  assert.equal(response.status, 413)
  assert.equal(messages.length, 0)
})

test('unknown, archived or mismatched roles cannot bypass validation', () => {
  assert.equal(applicationSchema.safeParse({ ...applicant, position: 'Unknown job' }).success, false)
  assert.equal(applicationSchema.safeParse({ ...applicant, position: 'Production Engineer', applicationType: 'Internship', vertical: 'Manufacturing', availability: '3 months' }).success, false)
  assert.equal(applicationSchema.safeParse({ ...applicant, vertical: 'HEMM' }).success, false)
  assert.equal(activeOpenings.some((opening) => opening.status === 'archived'), false)
  assert.equal(applicationSchema.safeParse({ ...applicant, linkedin: 'javascript:alert(1)' }).success, false)
  assert.equal(applicationSchema.safeParse({ ...applicant, startDate: '2026-02-30' }).success, false)
  assert.equal(enquirySchema.safeParse({ ...enquiry, name: 'Name\r\nBcc: bad@example.test' }).success, false)
})

test('fast autofill is accepted; honeypots do not send mail', async () => {
  assert.equal(looksLikeBot({ startedAt: Date.now(), website: '' }), false)
  const response = await contact({ ...enquiry, website: 'bot.invalid' })
  assert.equal(response.status, 200)
  assert.equal(messages.length, 0)
})

test('CORS denies unrelated sites and permits the configured frontend', async () => {
  let response = await contact(enquiry, { Origin: 'https://unrelated.example' })
  assert.equal(response.status, 403)
  response = await fetch(`${base}/api/contact`, { method: 'OPTIONS', headers: { Origin: 'https://frontend.nova.test', 'Access-Control-Request-Method': 'POST', 'Access-Control-Request-Headers': 'Content-Type' } })
  assert.equal(response.status, 204)
  assert.equal(response.headers.get('access-control-allow-origin'), 'https://frontend.nova.test')
})

test('rate limiting returns JSON 429', async () => {
  let response
  for (let i = 0; i < 13; i++) response = await contact({ ...enquiry, website: 'bot.invalid' })
  assert.equal(response.status, 429)
  assert.equal((await response.json()).ok, false)
})

test('production cannot run in preview mode or use a different Gmail sender account', () => {
  const original = { env: config.env, dry: config.mailDryRun, host: config.smtp.host, user: config.smtp.user }
  try {
    config.env = 'production'; config.mailDryRun = true
    assert.throws(assertMailConfiguration, { code: 'MAIL_CONFIG' })
    config.mailDryRun = false; config.smtp.host = 'smtp.gmail.com'; config.smtp.user = 'someone@gmail.com'
    assert.throws(assertMailConfiguration, { code: 'MAIL_CONFIG' })
  } finally {
    config.env = original.env; config.mailDryRun = original.dry; config.smtp.host = original.host; config.smtp.user = original.user
  }
})
