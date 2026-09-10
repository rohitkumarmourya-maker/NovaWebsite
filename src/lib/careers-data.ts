import options from '../../shared/form-options.json'
import businessOrder from '../../shared/business-order.json'
import { activeOpenings } from '../../shared/careers-data.ts'
export type { Opening, ApplicationType, BusinessVertical } from '../../shared/careers-data.ts'
export { jobPostings } from '../../shared/careers-data.ts'

export const openings = [...activeOpenings].sort((a, b) =>
  businessOrder.findIndex((v) => v.label === a.vertical) - businessOrder.findIndex((v) => v.label === b.vertical),
)
export const otherPositionLabel = options.otherPositionLabel
export const applicationTypes = options.applicationTypes
export const verticals = [...businessOrder.map((b) => b.label), 'Corporate / Administration']
export const qualifications = options.qualifications
export const experienceLevels = options.experienceLevels
export const noticePeriods = options.noticePeriods
export const internshipDurations = options.internshipDurations
export const referralSources = options.referralSources
export const limits = options.limits
export const resumeRules = {
  ...options.resume,
  mimeTypes: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/octet-stream'],
}

export const whyNova = [
  {
    title: 'Six businesses, one campus mindset',
    text: 'Move between manufacturing, IT, heavy equipment, healthcare products, skills and construction without changing employer.',
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
    text: 'Be part of an integrated manufacturing, technology and skill hub planned for Bilaspur.',
  },
]

export const hiringProcess = [
  { step: '01', title: 'Apply online', text: 'Open the application page and submit your CV. Save the reference number after your application is accepted.' },
  { step: '02', title: 'Screening', text: 'The relevant business reviews your profile against current and upcoming needs.' },
  { step: '03', title: 'Conversation', text: 'A call or on-site discussion with the team you would work with.' },
  { step: '04', title: 'Offer', text: 'Role, location and start date confirmed in writing.' },
]
