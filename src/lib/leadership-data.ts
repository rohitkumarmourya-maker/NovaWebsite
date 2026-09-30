export interface ExecutiveLeader {
  id: string
  number: string // '01', '02', '03', '04'
  name: string
  role: string
  photo: string | null
  intro: string
  biography: string
  leadershipAreas: string[]
  linkedin?: string
  status: 'published' | 'pending'
}

/**
 * Executive Leadership & Board of Directors.
 * To update: simply replace placeholder names, bios, and photo paths with approved assets.
 */
export const executiveLeaders: ExecutiveLeader[] = [
  {
    id: 'leader-01',
    number: '01',
    name: 'Executive Leadership',
    role: 'Managing Director & CEO',
    photo: null,
    intro: 'Steering Nova Ventures across engineering, advanced technology, and high-impact enterprise initiatives.',
    biography:
      'Leads group strategic direction, capital allocation, and cross-vertical collaboration. Focuses on institutionalizing engineering excellence, expanding advanced manufacturing capabilities, and accelerating technological adoption across all six business verticals.',
    leadershipAreas: ['Corporate Strategy', 'Industrial Engineering', 'Technology Modernization', 'Group Governance'],
    linkedin: 'https://linkedin.com',
    status: 'published',
  },
  {
    id: 'leader-02',
    number: '02',
    name: 'Technical Directorship',
    role: 'Director — Engineering & Technology',
    photo: null,
    intro: 'Directing industrial systems, precision engineering, CAD/CAM pipelines, and digital software infrastructure.',
    biography:
      'Oversees engineering practices, technical innovation, and digital integration. Instrumental in standardizing manufacturing diagnostics, heavy machinery service protocols, and enterprise software architecture.',
    leadershipAreas: ['Precision Manufacturing', 'Industrial Automation', 'Enterprise Software', 'R&D Innovation'],
    linkedin: 'https://linkedin.com',
    status: 'published',
  },
  {
    id: 'leader-03',
    number: '03',
    name: 'Operations & Infrastructure',
    role: 'Director — Operations & Civil Infrastructure',
    photo: null,
    intro: 'Guiding large-scale civil projects, HEMM fleet logistics, and operational safety standards.',
    biography:
      'Directs heavy engineering projects, civil construction compliance, and supply chain logistics across the region. Ensures stringent safety standards, operational efficiency, and rapid execution of high-scale industrial infrastructure.',
    leadershipAreas: ['Civil Construction', 'HEMM Operations', 'Supply Chain Management', 'Operational Safety'],
    linkedin: 'https://linkedin.com',
    status: 'published',
  },
  {
    id: 'leader-04',
    number: '04',
    name: 'Growth & Human Capital',
    role: 'Director — Healthcare, Skills & Corporate Affairs',
    photo: null,
    intro: 'Leading healthcare manufacturing standards, vocational skill development programs, and corporate stewardship.',
    biography:
      'Heads human capital development, healthcare product quality management, and community impact initiatives. Passionate about empowering regional talent with industry-certified technical skills and expanding accessible medical manufacturing.',
    leadershipAreas: ['Healthcare Quality', 'Vocational Skill Systems', 'Corporate Affairs', 'Workforce Enablement'],
    linkedin: 'https://linkedin.com',
    status: 'published',
  },
]

export type LeadershipProfile = {
  id: string
  fullName: string
  designation: string
  bio: string
  photo: string | null
  status: 'pending' | 'published'
}

// Backward-compatible alias for existing references
export const leadershipProfiles: LeadershipProfile[] = executiveLeaders.map((l) => ({
  id: l.id,
  fullName: l.name,
  designation: l.role,
  bio: l.intro,
  photo: l.photo,
  status: l.status,
}))
