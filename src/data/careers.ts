/**
 * Careers content + the option lists used by the Job / Internship application form.
 *
 * The lists live in `shared/form-options.json` so the browser form and the API
 * (server/) validate against exactly the same values. Edit the JSON to add roles or
 * change options — both sides pick it up.
 */
import options from '../../shared/form-options.json'

export type Opening = {
  id: string
  title: string
  vertical: string
  type: string
  location: string
  summary: string
}

export const openings: Opening[] = options.openings
export const otherPositionLabel = options.otherPositionLabel
export const applicationTypes = options.applicationTypes
export const verticals = options.verticals
export const qualifications = options.qualifications
export const experienceLevels = options.experienceLevels
export const noticePeriods = options.noticePeriods
export const internshipDurations = options.internshipDurations
export const referralSources = options.referralSources
export const limits = options.limits

export const resumeRules = {
  maxBytes: options.resume.maxBytes,
  accept: options.resume.accept,
  label: options.resume.label,
  mimeTypes: [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  ],
}

export const whyNova = [
  {
    title: 'Six businesses, one campus mindset',
    text: 'Move between manufacturing, software, training, construction, heavy equipment and healthcare products without changing employer.',
  },
  {
    title: 'Hands-on from day one',
    text: 'Workshops, sites and studios where the work is real, measured and visible.',
  },
  {
    title: 'Learning built in',
    text: 'A skill development business inside the company means structured training is part of how we work.',
  },
  {
    title: 'Growing with Chhattisgarh',
    text: 'Be part of an integrated manufacturing, technology and skill hub planned for Sirgitti Industrial Area, Bilaspur.',
  },
]

export const hiringProcess = [
  { step: '01', title: 'Apply online', text: 'Submit the form below with your CV. You receive a reference number instantly.' },
  { step: '02', title: 'Screening', text: 'The relevant business reviews your profile against current and upcoming needs.' },
  { step: '03', title: 'Conversation', text: 'A call or on-site discussion with the team you would work with.' },
  { step: '04', title: 'Offer', text: 'Role, location and start date confirmed in writing.' },
]
