/**
 * Server-side validation — mirrors src/lib/validation.ts in the front-end and uses the
 * same option lists (shared/form-options.json), so a tampered request cannot inject
 * values the recruiter would not expect.
 */
import { readFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { z } from 'zod'
import { activeOpenings } from '../../shared/careers-data.ts'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const options = JSON.parse(readFileSync(path.resolve(__dirname, '../../shared/form-options.json'), 'utf8'))
const businessOrder = JSON.parse(readFileSync(new URL('../../shared/business-order.json', import.meta.url), 'utf8'))
options.openings = activeOpenings
options.verticals = [...businessOrder.map((b) => b.label), 'Corporate / Administration']
options.enquiryCategories = ['Business Enquiry', ...businessOrder.map((b) => b.label), 'Partnerships']
const L = options.limits

const trimmed = (max, min = 0) => z.string().trim().min(min).max(max)
const optional = (max) => z.string().trim().max(max).optional().default('')
const oneOf = (list) => z.enum(list)
const optionalOneOf = (list) => z.union([z.literal(''), z.enum(list)]).optional().default('')
const bool = z.union([z.literal('true'), z.literal(true)])

const namePattern = /^[\p{L}\p{M}][\p{L}\p{M} .'’-]{1,79}$/u
const phonePattern = /^\+?[0-9][0-9 ()-]{6,18}[0-9]$/
const yearNow = new Date().getFullYear()

const positionValues = [...options.openings.map((o) => o.title), options.otherPositionLabel]

export const applicationSchema = z
  .object({
    applicationType: oneOf(options.applicationTypes),
    position: oneOf(positionValues),
    positionOther: optional(L.short),
    vertical: oneOf(options.verticals),
    preferredLocation: optional(L.short),
    availability: oneOf([...options.noticePeriods, ...options.internshipDurations]),
    startDate: z.string().trim().regex(/^(\d{4}-\d{2}-\d{2})?$/, 'Invalid date').optional().default(''),
    fullName: trimmed(L.name, 2).regex(namePattern, 'Enter a valid name'),
    email: trimmed(L.email, 5).email('Enter a valid e-mail address'),
    phone: trimmed(L.phone, 8)
      .regex(phonePattern, 'Enter a valid phone number')
      .refine((v) => {
        const d = v.replace(/\D/g, '').length
        return d >= 8 && d <= 15
      }, 'Enter a valid phone number'),
    city: trimmed(L.city, 2),
    linkedin: z.union([z.literal(''), z.string().trim().max(L.url).url().refine((url) => /^https?:\/\//i.test(url), 'Use an https:// or http:// link')]).optional().default(''),
    qualification: oneOf(options.qualifications),
    institution: trimmed(L.short, 2),
    fieldOfStudy: optional(L.short),
    graduationYear: z
      .string()
      .trim()
      .regex(/^(19|20)\d{2}$/, 'Enter a four-digit year')
      .refine((y) => Number(y) >= 1970 && Number(y) <= yearNow + 6, 'Year out of range'),
    experience: oneOf(options.experienceLevels),
    employer: optional(L.short),
    currentRole: optional(L.short),
    skills: trimmed(L.skills, 10),
    coverLetter: optional(L.coverLetter),
    referral: optionalOneOf(options.referralSources),
    notes: optional(L.notes),
    consent: bool,
    declaration: bool,
  })
  .superRefine((v, ctx) => {
    if (v.position === options.otherPositionLabel && v.positionOther.length < 2) {
      ctx.addIssue({ code: 'custom', path: ['positionOther'], message: 'Tell us the role you are looking for' })
    }
    const selected = activeOpenings.find((opening) => opening.title === v.position)
    if (selected && (!selected.type.includes(v.applicationType) || selected.vertical !== v.vertical)) {
      ctx.addIssue({ code: 'custom', path: ['position'], message: 'Choose a role matching the application type and business.' })
    }
    if (v.startDate && (Number.isNaN(Date.parse(v.startDate)) || new Date(v.startDate).toISOString().slice(0, 10) !== v.startDate)) {
      ctx.addIssue({ code: 'custom', path: ['startDate'], message: 'Enter a valid calendar date.' })
    }
    const validAvailability = v.applicationType === 'Internship' ? options.internshipDurations : options.noticePeriods
    if (!validAvailability.includes(v.availability)) {
      ctx.addIssue({ code: 'custom', path: ['availability'], message: 'Choose an option from the list' })
    }
  })

export const enquirySchema = z.object({
  category: oneOf(options.enquiryCategories),
  name: trimmed(L.name, 2).regex(namePattern, 'Enter a valid name'),
  email: trimmed(L.email, 5).email('Enter a valid e-mail address'),
  phone: z.union([z.literal(''), z.string().trim().max(L.phone).regex(phonePattern, 'Enter a valid phone number')]).optional().default(''),
  organisation: optional(L.short),
  message: trimmed(L.message, 10),
  consent: bool,
})

/** Flattens a Zod error into { field: message } for the front-end. */
export function fieldErrors(error) {
  const out = {}
  for (const issue of error.issues) {
    const key = issue.path[0]
    if (key && !out[key]) out[key] = friendly(issue)
  }
  return out
}

const FIELD_HINTS = {
  email: 'Enter a valid e-mail address.',
  phone: 'Enter a valid phone number, e.g. +91 98765 43210.',
  fullName: 'Enter your full name (letters, spaces, dots or hyphens).',
  name: 'Enter your full name (letters, spaces, dots or hyphens).',
  graduationYear: 'Enter a valid four-digit year.',
  linkedin: 'Enter a full link starting with https://',
  consent: 'Please tick this box to continue.',
  declaration: 'Please tick this box to continue.',
  resume: 'Please attach your CV / resume.',
}

function friendly(issue) {
  const key = issue.path?.[0]
  const missing = issue.code === 'invalid_type' || (issue.code === 'too_small' && issue.minimum <= 1)
  if (missing) return key in FIELD_HINTS && !['consent', 'declaration'].includes(key) ? 'This field is required.' : FIELD_HINTS[key] || 'This field is required.'
  if (issue.code === 'invalid_enum_value' || issue.code === 'invalid_value' || issue.code === 'invalid_union') return FIELD_HINTS[key] || 'Choose an option from the list.'
  if (issue.code === 'too_small') return FIELD_HINTS[key] || `Please enter at least ${issue.minimum} characters.`
  if (issue.code === 'too_big') return `Keep this under ${issue.maximum} characters.`
  if (issue.code === 'invalid_format' || issue.code === 'invalid_string') return FIELD_HINTS[key] || issue.message || 'Invalid value.'
  return FIELD_HINTS[key] || issue.message || 'Invalid value.'
}

export { options }
