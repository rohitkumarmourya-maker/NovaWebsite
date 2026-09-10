import businessOrder from '../../shared/business-order.json'

export const siteUrl = (import.meta.env.VITE_SITE_URL as string | undefined)?.replace(/\/+$/, '') || ''

export const company = {
  brandName: 'Nova Ventures',
  legalName: 'Nova Ventures Innovation and Technology',
  tagline: 'Innovation and Technology',
  registeredState: 'Chhattisgarh',
  country: 'India',
  /** All website enquiries and job / internship applications are delivered here. */
  email: 'novaventures.nvit@gmail.com',
  phone: null as string | null,
  address: null as string | null,
  whatsapp: null as string | null,
  /** Add verified profile URLs to show social links in the footer. */
  social: [] as { label: string; href: string }[],
}

export const navLinks = [
  { label: 'About', to: '/about' },
  { label: 'Businesses', to: '/businesses' },
  { label: 'Capabilities', to: '/capabilities' },
  { label: 'Innovation', to: '/innovation' },
  { label: 'Careers', to: '/careers' },
  { label: 'Contact', to: '/contact' },
]

export { capabilityGroups } from '../lib/capabilities-data'

export const pillars = [
  { title: 'Engineer', description: 'Technical capability and industrial expertise.' },
  { title: 'Innovate', description: 'Technology and emerging solutions.' },
  { title: 'Enable', description: 'Skills and capability development.' },
  { title: 'Build', description: 'Entrepreneurship and new ventures.' },
]

// These four pillars are original website storytelling concepts describing
// how Nova Ventures approaches its work. They are not presented as
// officially adopted corporate values, since none were supplied.
export const valuesNote =
  'The pillars below describe how Nova Ventures’ six businesses connect to one another. They are storytelling concepts for this website, not a published set of corporate values.'

export const enquiryCategories = ['Business Enquiry', ...businessOrder.map((b) => b.label), 'Partnerships']
