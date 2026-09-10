/**
 * E-mail templates. Every message is sent as HTML + plain text, with a consistent subject
 * line so the mailbox can be filtered and searched:
 *
 *   [Nova Careers] Job · Software Engineer · Priya Sharma · NV-20260908-4F7K
 *   [Nova Enquiry] Manufacturing · Rahul Verma · NV-20260908-9Q2M
 *
 * Attachments are renamed to  <REF>_<Candidate-Name>_Resume.pdf  /  _Cover-Letter.pdf
 * so they sort together and never collide.
 */
import { config } from './config.js'
import { randomUUID } from 'node:crypto'
import { fileURLToPath } from 'node:url'

const COLORS = { graphite: '#1B2632', deep: '#0F161E', ember: '#F5A425', amber: '#B45309', paper: '#F7F4ED', sand: '#F4F0E5', ink: '#3B372C', muted: '#6D6657' }

export const esc = (s) =>
  String(s ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')

const nl2br = (s) => esc(s).replace(/\r?\n/g, '<br>')

/** Reference number: NV-YYYYMMDD-XXXX (unambiguous alphabet, no 0/O/1/I). */
export function makeReference(prefix = 'NV') {
  const d = new Date()
  const date = `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, '0')}${String(d.getDate()).padStart(2, '0')}`
  return `${prefix}-${date}-${randomUUID().replaceAll('-', '').slice(0, 12).toUpperCase()}`
}

export const safeFileName = (s) =>
  String(s)
    .normalize('NFKD')
    .replace(/[^\w\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .slice(0, 40) || 'Candidate'

const formatDate = (d) =>
  new Intl.DateTimeFormat('en-IN', { dateStyle: 'medium', timeStyle: 'short', timeZone: 'Asia/Kolkata' }).format(d) + ' IST'

function layout({ title, subtitle, badge, sections, footerNote }) {
  const sectionHtml = sections
    .map(
      (s) => `
      <tr><td style="padding:0 32px">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;margin:22px 0 0">
          <tr><td style="padding:0 0 8px;border-bottom:2px solid ${COLORS.ember};font:700 12px/1.4 Arial,Helvetica,sans-serif;letter-spacing:.14em;text-transform:uppercase;color:${COLORS.amber}">${esc(s.title)}</td></tr>
          ${s.rows
            .filter((r) => r[1] !== undefined && r[1] !== null && String(r[1]).trim() !== '')
            .map(
              ([k, v, opts = {}]) => `
          <tr>
            <td style="padding:10px 0;border-bottom:1px solid #E6E0D2;vertical-align:top;font:400 14px/1.5 Arial,Helvetica,sans-serif;color:${COLORS.ink}">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr>
                <td width="36%" style="font:700 13px/1.5 Arial,Helvetica,sans-serif;color:${COLORS.muted};vertical-align:top;padding-right:12px">${esc(k)}</td>
                <td style="font:${opts.strong ? 700 : 400} 14px/1.5 Arial,Helvetica,sans-serif;color:${COLORS.graphite};vertical-align:top;word-break:break-word">${opts.html ? v : nl2br(v)}</td>
              </tr></table>
            </td>
          </tr>`,
            )
            .join('')}
        </table>
      </td></tr>`,
    )
    .join('')

  return `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width"><title>${esc(title)}</title></head>
<body style="margin:0;padding:0;background:${COLORS.paper}">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${COLORS.paper};padding:24px 12px">
<tr><td align="center">
<table role="presentation" width="640" cellpadding="0" cellspacing="0" style="max-width:640px;width:100%;background:#ffffff;border-radius:16px;overflow:hidden;border:1px solid #E6E0D2">
  <tr><td style="background:${COLORS.deep};padding:24px 32px">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr>
      <td><img src="cid:nova-logo" alt="Nova Ventures" width="150" style="display:block;width:150px;height:auto;border:0"></td>
      <td align="right" style="font:700 11px/1.4 Arial,Helvetica,sans-serif;letter-spacing:.16em;text-transform:uppercase;color:${COLORS.ember}">${esc(badge)}</td>
    </tr></table>
  </td></tr>
  <tr><td style="height:4px;background:${COLORS.ember};font-size:0;line-height:0">&nbsp;</td></tr>
  <tr><td style="padding:28px 32px 0">
    <h1 style="margin:0;font:700 22px/1.25 Arial,Helvetica,sans-serif;color:${COLORS.graphite}">${esc(title)}</h1>
    <p style="margin:8px 0 0;font:400 14px/1.6 Arial,Helvetica,sans-serif;color:${COLORS.muted}">${subtitle}</p>
  </td></tr>
  ${sectionHtml}
  <tr><td style="padding:28px 32px 32px">
    <p style="margin:0;font:400 12px/1.6 Arial,Helvetica,sans-serif;color:${COLORS.muted}">${footerNote}</p>
  </td></tr>
  <tr><td style="background:${COLORS.sand};padding:16px 32px;font:400 11px/1.5 Arial,Helvetica,sans-serif;color:${COLORS.muted}">
    Nova Ventures Innovation and Technology · Chhattisgarh, India · Sent automatically by the website form service.
  </td></tr>
</table>
</td></tr></table>
</body></html>`
}

function plain(sections) {
  return sections
    .map(
      (s) =>
        `${s.title.toUpperCase()}\n${'-'.repeat(s.title.length)}\n` +
        s.rows
          .filter((r) => r[1] !== undefined && r[1] !== null && String(r[1]).trim() !== '')
          .map(([k, v, opts = {}]) => `${k}: ${opts.html ? String(v).replace(/<[^>]+>/g, '') : v}`)
          .join('\n'),
    )
    .join('\n\n')
}

/* ------------------------------------------------------------------------- */
/* Application                                                               */
/* ------------------------------------------------------------------------- */

export function applicationEmail({ data, reference, files, ip }) {
  const now = new Date()
  const position = data.position === 'Other / general application' ? `${data.positionOther} (general application)` : data.position
  const candidate = safeFileName(data.fullName)
  const shortRef = reference

  const attachments = []
  if (files.resume) {
    attachments.push({
      filename: `${reference}_${candidate}_Resume.${files.resume.ext}`,
      content: files.resume.buffer,
      contentType: files.resume.mimetype,
    })
  }
  if (files.coverLetterFile) {
    attachments.push({
      filename: `${reference}_${candidate}_Cover-Letter.${files.coverLetterFile.ext}`,
      content: files.coverLetterFile.buffer,
      contentType: files.coverLetterFile.mimetype,
    })
  }

  const sections = [
    {
      title: 'Application',
      rows: [
        ['Reference', shortRef, { strong: true }],
        ['Applying for', `${data.applicationType} · ${position}`, { strong: true }],
        ['Preferred business', data.vertical],
        ['Preferred location', data.preferredLocation],
        [data.applicationType === 'Internship' ? 'Internship duration' : 'Notice period / availability', data.availability],
        ['Earliest start date', data.startDate],
        ['Submitted', formatDate(now)],
      ],
    },
    {
      title: 'Candidate',
      rows: [
        ['Full name', data.fullName, { strong: true }],
        ['E-mail', `<a href="mailto:${esc(data.email)}" style="color:${COLORS.amber}">${esc(data.email)}</a>`, { html: true }],
        ['Phone / WhatsApp', `<a href="tel:${esc(data.phone.replace(/\s+/g, ''))}" style="color:${COLORS.amber}">${esc(data.phone)}</a>`, { html: true }],
        ['Current city', data.city],
        ['LinkedIn / portfolio', data.linkedin ? `<a href="${esc(data.linkedin)}" style="color:${COLORS.amber}">${esc(data.linkedin)}</a>` : '', { html: true }],
      ],
    },
    {
      title: 'Education',
      rows: [
        ['Highest qualification', data.qualification],
        ['Institution', data.institution],
        ['Field of study', data.fieldOfStudy],
        ['Year of completion', data.graduationYear],
      ],
    },
    {
      title: 'Experience & skills',
      rows: [
        ['Total experience', data.experience],
        ['Current / recent employer', data.employer],
        ['Current / recent role', data.currentRole],
        ['Key skills & tools', data.skills],
      ],
    },
    {
      title: 'Documents',
      rows: [
        ['CV / Resume', attachments[0] ? `Attached — ${attachments[0].filename}` : 'Not provided'],
        ['Cover letter file', attachments[1] ? `Attached — ${attachments[1].filename}` : 'Not provided'],
        ['Cover letter (text)', data.coverLetter || 'Not provided'],
      ],
    },
    {
      title: 'Additional',
      rows: [
        ['Heard about us via', data.referral],
        ['Anything else', data.notes],
        ['Consent to process data', data.consent === 'true' || data.consent === true ? 'Yes' : 'No'],
        ['Declaration of accuracy', data.declaration === 'true' || data.declaration === true ? 'Yes' : 'No'],
        ['Source IP (abuse tracing only)', ip],
      ],
    },
  ]

  const subject = `[Nova Careers] ${data.applicationType} · ${position} · ${data.fullName} · ${reference}`
  const html = layout({
    title: `${data.applicationType} application — ${position}`,
    subtitle: `From <strong>${esc(data.fullName)}</strong> · Reference <strong>${esc(reference)}</strong>. Reply to this e-mail to contact the candidate directly.`,
    badge: 'Careers · New application',
    sections,
    footerNote: `This application was submitted through the Careers page on the Nova Ventures website. The candidate consented to the privacy policy at ${esc(config.siteUrl)}/privacy. Attachments were checked for type and size before delivery.`,
  })
  const text = `NOVA VENTURES — ${data.applicationType.toUpperCase()} APPLICATION\nReference: ${reference}\n\n${plain(sections)}\n\nAttachments: ${attachments.map((a) => a.filename).join(', ') || 'none'}`

  return {
    to: config.careersMailTo,
    replyTo: { name: data.fullName, address: data.email },
    subject,
    html,
    text,
    attachments: [...attachments, logoAttachment()],
    headers: { 'X-Nova-Reference': reference, 'X-Nova-Form': 'careers-application', 'X-Nova-Type': data.applicationType },
  }
}

export function applicationAcknowledgement({ data, reference }) {
  const position = data.position === 'Other / general application' ? data.positionOther : data.position
  const sections = [
    {
      title: 'Your application',
      rows: [
        ['Reference', reference, { strong: true }],
        ['Applying for', `${data.applicationType} · ${position}`],
        ['Preferred business', data.vertical],
        ['Submitted', formatDate(new Date())],
      ],
    },
    {
      title: 'What happens next',
      rows: [
        ['1. Screening', 'The relevant Nova Ventures business reviews your profile against current and upcoming needs.'],
        ['2. Conversation', 'If there is a match, we contact you on the phone number or e-mail you provided.'],
        ['3. Questions', `Quote your reference number and write to ${config.careersMailTo}.`],
      ],
    },
  ]
  return {
    to: { name: data.fullName, address: data.email },
    replyTo: config.careersMailTo,
    subject: `We received your ${data.applicationType.toLowerCase()} application — ${reference}`,
    html: layout({
      title: `Thank you, ${esc(data.fullName.split(' ')[0])}. We have your application.`,
      subtitle: 'This is an automatic confirmation from Nova Ventures Innovation and Technology.',
      badge: 'Careers · Confirmation',
      sections,
      footerNote: 'Please do not reply to this message with documents; your CV has already been delivered. Your data is used only for recruitment, as described in our privacy policy.',
    }),
    text: `Thank you, ${data.fullName}. We received your ${data.applicationType.toLowerCase()} application for ${position}.\nReference: ${reference}\n\n${plain(sections)}`,
    attachments: [logoAttachment()],
    headers: { 'X-Nova-Reference': reference, 'Auto-Submitted': 'auto-replied' },
  }
}

/* ------------------------------------------------------------------------- */
/* Contact enquiry                                                           */
/* ------------------------------------------------------------------------- */

export function enquiryEmail({ data, reference, ip }) {
  const sections = [
    {
      title: 'Enquiry',
      rows: [
        ['Reference', reference, { strong: true }],
        ['Category', data.category, { strong: true }],
        ['Submitted', formatDate(new Date())],
      ],
    },
    {
      title: 'Sender',
      rows: [
        ['Name', data.name, { strong: true }],
        ['E-mail', `<a href="mailto:${esc(data.email)}" style="color:${COLORS.amber}">${esc(data.email)}</a>`, { html: true }],
        ['Phone', data.phone],
        ['Organisation', data.organisation],
      ],
    },
    { title: 'Message', rows: [['Message', data.message]] },
    { title: 'Additional', rows: [['Consent', 'Yes'], ['Source IP (abuse tracing only)', ip]] },
  ]
  return {
    to: config.contactMailTo,
    replyTo: { name: data.name, address: data.email },
    subject: `[Nova Enquiry] ${data.category} · ${data.name} · ${reference}`,
    html: layout({
      title: `${data.category} enquiry`,
      subtitle: `From <strong>${esc(data.name)}</strong> · Reference <strong>${esc(reference)}</strong>. Reply to this e-mail to answer directly.`,
      badge: 'Contact · New enquiry',
      sections,
      footerNote: 'Submitted through the Contact page on the Nova Ventures website.',
    }),
    text: `NOVA VENTURES — WEBSITE ENQUIRY\nReference: ${reference}\n\n${plain(sections)}`,
    attachments: [logoAttachment()],
    headers: { 'X-Nova-Reference': reference, 'X-Nova-Form': 'contact-enquiry' },
  }
}

function logoAttachment() {
  return { filename: 'nova-logo.png', path: fileURLToPath(new URL('../assets/nova-logo-email.png', import.meta.url)), cid: 'nova-logo' }
}
