export const siteUrl = (import.meta.env.VITE_SITE_URL as string | undefined)?.replace(/\/+$/, '') || ''

export const company = {
  brandName: 'Nova Ventures',
  legalName: 'Nova Ventures Innovation and Technology Private Limited',
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

export const capabilityGroups = [
  {
    title: 'Engineering',
    blurb: 'Precision manufacturing disciplines that turn drawings into dependable components.',
    items: [
      'CNC & precision machining',
      'CAD/CAM design',
      'Lathe',
      'Milling',
      'Welding',
      'Fabrication',
      'Casting',
      'Engineered components',
    ],
  },
  {
    title: 'Technology',
    blurb: 'Software, data and intelligent systems that extend physical capability.',
    items: [
      'AI / machine learning',
      'Software development',
      'Product engineering',
      'Systems integration',
      'Robotics & automation',
      'IoT',
      'Data analytics & business intelligence',
      'Cloud (IaaS / PaaS / SaaS)',
      'Cybersecurity',
      'Digital platforms',
    ],
  },
  {
    title: 'Industrial Services',
    blurb: 'Keeping heavy equipment and industrial assets productive.',
    items: [
      'HEMM',
      'Heavy equipment',
      'Hydraulics',
      'Diagnostics',
      'Preventive maintenance',
      'Mechanical services',
      'Electrical services',
      'Heavy vehicle services',
    ],
  },
]

export const pillars = [
  { title: 'Engineer', description: 'Technical capability and industrial expertise.' },
  { title: 'Innovate', description: 'Technology and emerging solutions.' },
  { title: 'Enable', description: 'Skills and capability development.' },
  { title: 'Build', description: 'Entrepreneurship and new ventures.' },
]

export type NewsItem = {
  date: string
  category: string
  title: string
  excerpt: string
  link?: string
}

// No verified news or updates have been supplied. Kept as an empty,
// data-driven list so real items can be added later without touching
// the News page itself.
export const newsItems: NewsItem[] = []

// These four pillars are original website storytelling concepts describing
// how Nova Ventures approaches its work. They are not presented as
// officially adopted corporate values, since none were supplied.
export const valuesNote =
  'The pillars below describe how Nova Ventures’ six businesses connect to one another. They are storytelling concepts for this website, not a published set of corporate values.'

export const enquiryCategories = [
  'Business Enquiry',
  'Manufacturing',
  'IT / Software',
  'Skill Development',
  'Civil and Construction',
  'HEMM',
  'Health Care Products',
  'Partnerships',
]
