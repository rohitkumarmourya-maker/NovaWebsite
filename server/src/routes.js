import { config } from './config.js'
import { sendMail } from './mailer.js'
import { looksLikeBot, sniffDocument, upload, verifyTurnstile } from './security.js'
import { applicationAcknowledgement, applicationEmail, enquiryEmail, makeReference } from './templates.js'
import { applicationSchema, enquirySchema, fieldErrors } from './validate.js'

const MIME = { pdf: 'application/pdf', doc: 'application/msword', docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' }

const uploadFields = upload.fields([
  { name: 'resume', maxCount: 1 },
  { name: 'coverLetterFile', maxCount: 1 },
])

export function applyRoute(req, res, next) {
  uploadFields(req, res, async (err) => {
    if (err) {
      if (err.code === 'BAD_FILE_TYPE') return res.status(400).json({ ok: false, error: err.message, fields: { resume: err.message } })
      return next(err)
    }
    try {
      const body = req.body ?? {}

      // Silently accept bot submissions so the bot learns nothing.
      if (looksLikeBot(body)) return res.json({ ok: true, reference: makeReference() })
      if (!(await verifyTurnstile(body.turnstileToken, req.ip))) {
        return res.status(400).json({ ok: false, error: 'Verification failed. Please reload the page and try again.' })
      }

      const parsed = applicationSchema.safeParse(body)
      if (!parsed.success) {
        return res.status(422).json({ ok: false, error: 'Please check the highlighted fields.', fields: fieldErrors(parsed.error) })
      }

      const resumeFile = req.files?.resume?.[0]
      const coverFile = req.files?.coverLetterFile?.[0]
      if (!resumeFile) return res.status(422).json({ ok: false, error: 'Please attach your CV / resume.', fields: { resume: 'Please attach your CV / resume.' } })

      const resumeExt = await sniffDocument(resumeFile)
      if (!resumeExt) return res.status(422).json({ ok: false, error: 'The CV must be a real PDF, DOC or DOCX file.', fields: { resume: 'The file content does not match its type. Please upload a PDF, DOC or DOCX.' } })
      let coverExt = null
      if (coverFile) {
        coverExt = await sniffDocument(coverFile)
        if (!coverExt) return res.status(422).json({ ok: false, error: 'The cover letter must be a real PDF, DOC or DOCX file.', fields: { coverLetterFile: 'The file content does not match its type.' } })
      }

      const reference = makeReference('NV')
      const files = {
        resume: { buffer: resumeFile.buffer, ext: resumeExt, mimetype: MIME[resumeExt] },
        coverLetterFile: coverFile ? { buffer: coverFile.buffer, ext: coverExt, mimetype: MIME[coverExt] } : null,
      }

      await sendMail(applicationEmail({ data: parsed.data, reference, files, ip: req.ip }))
      if (config.sendAcknowledgement) {
        // Acknowledgement failures must not fail the application itself.
        sendMail(applicationAcknowledgement({ data: parsed.data, reference })).catch((e) => console.error('[mail] ack failed:', e?.message))
      }

      console.log(`[apply] ${reference} · ${parsed.data.applicationType} · ${parsed.data.position}`)
      return res.json({ ok: true, reference })
    } catch (e) {
      return next(e)
    }
  })
}

export async function contactRoute(req, res, next) {
  try {
    const body = req.body ?? {}
    if (looksLikeBot(body)) return res.json({ ok: true, reference: makeReference('NQ') })
    if (!(await verifyTurnstile(body.turnstileToken, req.ip))) {
      return res.status(400).json({ ok: false, error: 'Verification failed. Please reload the page and try again.' })
    }
    const parsed = enquirySchema.safeParse(body)
    if (!parsed.success) {
      return res.status(422).json({ ok: false, error: 'Please check the highlighted fields.', fields: fieldErrors(parsed.error) })
    }
    const reference = makeReference('NQ')
    await sendMail(enquiryEmail({ data: parsed.data, reference, ip: req.ip }))
    console.log(`[contact] ${reference} · ${parsed.data.category}`)
    return res.json({ ok: true, reference })
  } catch (e) {
    return next(e)
  }
}
