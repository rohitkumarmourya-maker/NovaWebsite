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
 * Configured with confirmed executive profiles and official portrait assets.
 */
export const executiveLeaders: ExecutiveLeader[] = [
  {
    id: 'leader-01',
    number: '01',
    name: 'Mr. Sanjay Wilson',
    role: 'Director',
    photo: '/images/leadership/sanjay-wilson.webp',
    intro:
      'Brings over four decades of experience in financial stewardship, public health administration, and institutional governance across government and diverse organizational environments.',
    biography: `Mr. Sanjay Wilson brings over four decades of experience in financial management, administration and institutional leadership, with a career spanning government and diverse organisational environments.

He currently serves as District Accounts Manager with the Government Health Department and National Health Mission, Bilaspur, and contributes in a senior advisory capacity to the Chhattisgarh Medical Corporation in matters of accounts and finance. Over the years, he has also worked with private enterprises, foundations, NGOs and social organisations, gaining broad experience in financial stewardship and organisational management.

At Nova Ventures Innovation and Technology Private Limited, Mr. Wilson contributes his experience towards building sustainable enterprises and creating meaningful opportunities for economic and societal development. His approach is grounded in responsible management, institutional discipline and a long-term commitment to creating value for people and communities.`,
    leadershipAreas: [
      'Financial Management',
      'Institutional Leadership',
      'Public Health Accounts',
      'Organizational Stewardship',
      'Enterprise Governance',
    ],
    status: 'published',
  },
  {
    id: 'leader-02',
    number: '02',
    name: 'Mr. Apratim Samuel',
    role: 'Director',
    photo: '/images/leadership/apratim-samuel.webp',
    intro:
      'Software engineer, Director at Nova Ventures, and Founder of CodeKraft, steering embedded systems, AI/ML, automation, and emerging technology divisions.',
    biography: `Mr. Apratim Samuel is a Software Engineer and Director at Nova Ventures Innovation and Technology Private Limited and the Founder of CodeKraft. His background spans embedded systems and control software, with prior experience at Danfoss and Cygni Energy, where he worked on embedded firmware, protocol engineering, and formal QA processes for industrial and energy systems.

His technical experience includes embedded systems, AI/ML, automation, and control software, including Battery Management Systems (BMS) for electric vehicles and industrial automation solutions.

At Nova Ventures, Mr. Samuel plays a central role in shaping strategy and driving operations, with responsibility for building systems, processes, teams, and new initiatives across the organisation. He will lead the IT, AI & Emerging Technologies Division, while also overseeing initiatives in health and pharmaceutical products, technology development, and R&D. His role combines technology leadership with operational execution, strategic decision-making, and the development of scalable ventures for national and international markets.

His approach combines technical depth, entrepreneurial thinking, and disciplined execution, with a focus on building sustainable businesses and delivering meaningful value.`,
    leadershipAreas: [
      'AI / Machine Learning',
      'Embedded Systems & BMS',
      'Industrial Automation',
      'IT & Emerging Tech',
      'R&D Strategy',
    ],
    status: 'published',
  },
  {
    id: 'leader-03',
    number: '03',
    name: 'Mr. Manoranjan Elkana',
    role: 'Director',
    photo: '/images/leadership/manoranjan-elkana.webp',
    intro:
      'Four decades of distinguished banking leadership at the State Bank of India, specializing in financial discipline, rural enterprise, and grassroots entrepreneurship.',
    biography: `Mr. Manoranjan Elkana brings over four decades of experience in banking, financial management, institutional leadership and entrepreneurship development. During his distinguished career with the State Bank of India, from 1983 to 2023, he held key responsibilities across banking operations, branch management, audit, recovery and rural entrepreneurship development.

His experience in financial discipline, institutional management, rural enterprise and livelihood development has given him a broad understanding of building sustainable and responsible economic opportunities. His continued involvement in women’s empowerment, Self-Help Groups and grassroots entrepreneurship further reflects his commitment to inclusive growth.

At Nova Ventures Innovation and Technology Private Limited, Mr. Elkana contributes to strategic planning, financial and operational oversight, enterprise development and the evaluation of new opportunities across the organisation. He brings a practical, disciplined and people-focused approach to building sustainable ventures and creating meaningful economic impact.

His leadership is guided by integrity, responsible growth and a long-term commitment to creating opportunities for individuals, families and communities.`,
    leadershipAreas: [
      'Banking & Financial Oversight',
      'Enterprise Development',
      'Rural Entrepreneurship',
      'Audit & Risk Governance',
      'Strategic Planning',
    ],
    status: 'published',
  },
  {
    id: 'leader-04',
    number: '04',
    name: 'Mr. Vinay James',
    role: 'Director',
    photo: '/images/leadership/vinay-james.webp',
    intro:
      'Over fifteen years of versatile leadership across sales, marketing, institutional financial administration, and technical infrastructure.',
    biography: `Mr. Vinay James brings over fifteen years of versatile experience spanning sales, marketing, financial management, and hands-on infrastructure execution. His professional career combines strategic commercial acumen with rigorous operational and financial discipline across enterprise and institutional environments.

Following his extensive work in commercial sales and market development, Mr. James has served for over eight years as the Treasurer of COC Mission in India. In this capacity, he has overseen organizational accounts, financial governance, statutory compliance, and institutional budgeting, ensuring fiscal accountability and sustainable resource allocation.

Complementing his commercial and financial stewardship, Mr. James possesses practical technical expertise in electrical infrastructure and engineering works, with end-to-end execution knowledge across residential and commercial developments. He also holds a strong passion for metal fabrication and precision welding, bringing a grounded, engineering-first perspective to fabrication workflows.

At Nova Ventures Innovation and Technology Private Limited, Mr. James contributes his diverse expertise towards driving business development, operational discipline, and technical execution across the group's engineering and commercial initiatives. His hands-on understanding of both commerce and craftsmanship reinforces the company’s commitment to high-integrity, quality-driven growth.`,
    leadershipAreas: [
      'Sales & Marketing Strategy',
      'Financial Administration',
      'Electrical Infrastructure',
      'Metal Fabrication & Welding',
      'Enterprise Operations',
    ],
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
