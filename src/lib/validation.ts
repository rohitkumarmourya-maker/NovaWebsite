/**
 * Client-side validation for the application and contact forms.
 * The API (server/src/validate.js) enforces the same rules again — never trust the browser.
 */
import { limits, resumeRules } from '../data/careers'

export const patterns = {
  name: /^[\p{L}\p{M}][\p{L}\p{M} .'’-]{1,79}$/u,
  email: /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/,
  phone: /^\+?[0-9][0-9 ()-]{6,18}[0-9]$/,
  url: /^https?:\/\/[^\s]+$/i,
  year: /^(19|20)\d{2}$/,
}

export const required = (v: string) => (v.trim() ? '' : 'This field is required.')

export const validators = {
  fullName: (v: string) =>
    required(v) || (patterns.name.test(v.trim()) ? '' : 'Enter your full name (letters, spaces, dots or hyphens).'),
  email: (v: string) =>
    required(v) || (v.length <= limits.email && patterns.email.test(v.trim()) ? '' : 'Enter a valid e-mail address.'),
  phone: (v: string) =>
    required(v) ||
    (patterns.phone.test(v.trim()) && v.replace(/\D/g, '').length >= 8 && v.replace(/\D/g, '').length <= 15
      ? ''
      : 'Enter a valid phone number, e.g. +91 98765 43210.'),
  city: (v: string) => required(v) || (v.trim().length <= limits.city ? '' : `Keep this under ${limits.city} characters.`),
  optionalUrl: (v: string) =>
    !v.trim() ? '' : v.length <= limits.url && patterns.url.test(v.trim()) ? '' : 'Enter a full link starting with https://',
  optionalShort: (v: string) => (v.trim().length <= limits.short ? '' : `Keep this under ${limits.short} characters.`),
  short: (v: string) => required(v) || (v.trim().length <= limits.short ? '' : `Keep this under ${limits.short} characters.`),
  year: (v: string) => {
    if (!v.trim()) return 'This field is required.'
    if (!patterns.year.test(v.trim())) return 'Enter a four-digit year.'
    const y = Number(v)
    const now = new Date().getFullYear()
    return y >= 1970 && y <= now + 6 ? '' : `Enter a year between 1970 and ${now + 6}.`
  },
  skills: (v: string) =>
    required(v) ||
    (v.trim().length < 10
      ? 'Tell us a little more (at least 10 characters).'
      : v.trim().length <= limits.skills
        ? ''
        : `Keep this under ${limits.skills} characters.`),
  coverLetter: (v: string) => (v.length <= limits.coverLetter ? '' : `Keep this under ${limits.coverLetter} characters.`),
  notes: (v: string) => (v.length <= limits.notes ? '' : `Keep this under ${limits.notes} characters.`),
  message: (v: string) =>
    required(v) ||
    (v.trim().length < 10
      ? 'Please write a few more words so we can help.'
      : v.trim().length <= limits.message
        ? ''
        : `Keep this under ${limits.message} characters.`),
  oneOf: (list: readonly string[]) => (v: string) => required(v) || (list.includes(v) ? '' : 'Choose an option from the list.'),
  optionalOneOf: (list: readonly string[]) => (v: string) => (!v || list.includes(v) ? '' : 'Choose an option from the list.'),
  checked: (v: boolean) => (v ? '' : 'Please tick this box to continue.'),
}

const extOf = (name: string) => name.toLowerCase().slice(name.lastIndexOf('.'))

export function validateDocument(file: File | null, requiredFile: boolean): string {
  if (!file) return requiredFile ? 'Please attach your CV / resume.' : ''
  const ext = extOf(file.name)
  if (!['.pdf', '.doc', '.docx'].includes(ext)) return 'Only PDF, DOC or DOCX files are accepted.'
  if (file.type && !resumeRules.mimeTypes.includes(file.type)) return 'Only PDF, DOC or DOCX files are accepted.'
  if (file.size === 0) return 'This file is empty.'
  if (file.size > resumeRules.maxBytes) return 'The file is larger than 5 MB.'
  return ''
}

export const formatBytes = (n: number) => (n < 1024 * 1024 ? `${Math.round(n / 1024)} KB` : `${(n / 1024 / 1024).toFixed(1)} MB`)
