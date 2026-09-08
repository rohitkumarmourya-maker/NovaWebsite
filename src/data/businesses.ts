export type Business = {
  id: string
  index: string
  name: string
  shortName: string
  tagline: string
  summary: string
  intro: string[]
  capabilities: string[]
  applications: string[]
  approach: string
  menuTags: string
  ctaLabel: string
}

export const businesses: Business[] = [
  {
    id: 'manufacturing',
    index: '01',
    name: 'Manufacturing',
    shortName: 'Manufacturing',
    tagline: 'Precision at the core of every build.',
    summary:
      'Precision machining, fabrication and industrial component manufacturing for engineered parts, industrial hardware and demanding production environments.',
    intro: [
      'Nova Ventures brings together precision machining, industrial fabrication and component manufacturing for industrial and engineering applications.',
      'The vertical includes CNC and precision machining, lathe work, milling, welding, fabrication and casting, supported by CAD/CAM design for engineered components and industrial hardware.',
    ],
    capabilities: [
      'CNC & precision machining',
      'CAD/CAM design',
      'Lathe work',
      'Milling',
      'Welding & fabrication',
      'Casting',
      'Engineered components',
      'Industrial hardware & fasteners',
    ],
    applications: [
      'Industrial establishments',
      'Mining operations',
      'Engineering applications',
      'Industrial hardware supply',
    ],
    approach:
      'The approach centres on engineering discipline, precision process, design-for-manufacture and dependable components built for industrial environments.',
    menuTags: 'Precision engineering · Manufacturing · CNC · Fabrication',
    ctaLabel: 'Discuss a Manufacturing Requirement',
  },
  {
    id: 'it-software',
    index: '02',
    name: 'IT / Software',
    shortName: 'IT / Software',
    tagline: 'Technology built for what comes next.',
    summary:
      'Software, AI, cloud, cybersecurity and digital solutions spanning product engineering, systems, data and modern application development.',
    intro: [
      'Nova Ventures works across software development, product engineering, systems integration and digital solutions for modern businesses.',
      'Capabilities span AI and machine learning, robotics and automation, IoT, data analytics, cloud platforms, cybersecurity, web and mobile applications and digital products.',
    ],
    capabilities: [
      'AI / Machine Learning',
      'Software development',
      'Product engineering',
      'Systems integration',
      'Robotics & automation',
      'Internet of Things (IoT)',
      'Data analytics & business intelligence',
      'Cloud (IaaS / PaaS / SaaS)',
      'Cybersecurity',
      'Digital platforms',
      'Web & mobile applications',
    ],
    applications: [
      'Enterprise software & systems',
      'Digital platforms & applications',
      'Cloud & managed infrastructure',
      'AI-enabled solutions',
    ],
    approach:
      'Technology work combines practical product engineering with modern software, data and infrastructure capabilities to create useful, scalable digital systems.',
    menuTags: 'AI · Software · Automation · Data · Cloud',
    ctaLabel: 'Discuss a Technology Requirement',
  },
  {
    id: 'skill-development',
    index: '03',
    name: 'Skill Development',
    shortName: 'Skill Development',
    tagline: 'Building capability, one skill at a time.',
    summary:
      'Industry-focused technical and vocational training connecting practical learning with manufacturing, technology and workplace requirements.',
    intro: [
      'Nova Ventures develops practical training programmes across technical, vocational and digital skills.',
      'Training areas include manufacturing and engineering trades, IT and emerging technologies, healthcare products, workplace readiness and other industry-focused skills.',
    ],
    capabilities: [
      'Manufacturing & engineering trades',
      'CNC & machining',
      'Welding & fabrication',
      'CAD/CAM',
      'IT & emerging technologies',
      'HEMM maintenance',
      'Digital skills',
      'Workplace readiness',
    ],
    applications: [
      'Technical training centres',
      'Vocational programmes',
      'Industry workshops',
      'Career-focused learning',
    ],
    approach:
      'Learning is practical, industry-focused and designed to connect technical knowledge with the skills people use in real working environments.',
    menuTags: 'Technical · Vocational · Digital skills',
    ctaLabel: 'Discuss a Training Requirement',
  },
  {
    id: 'civil-construction',
    index: '04',
    name: 'Civil and Construction',
    shortName: 'Civil and Construction',
    tagline: 'Building the infrastructure around industry.',
    summary:
      'Civil, construction and infrastructure capabilities supporting industrial facilities, built environments and project delivery.',
    intro: [
      'Nova Ventures brings civil and construction capability into the wider industrial ecosystem, supporting the development and upkeep of functional built environments.',
      'The vertical covers construction coordination, civil works, site development, infrastructure and project support across industrial and commercial requirements.',
    ],
    capabilities: [
      'Civil works',
      'Construction coordination',
      'Site development',
      'Industrial infrastructure',
      'Building works',
      'Project support',
    ],
    applications: [
      'Industrial facilities',
      'Commercial spaces',
      'Site infrastructure',
      'Construction projects',
    ],
    approach:
      'The focus is on practical execution, dependable coordination and infrastructure that supports productive industrial and business environments.',
    menuTags: 'Civil works · Construction · Infrastructure',
    ctaLabel: 'Discuss a Civil & Construction Requirement',
  },
  {
    id: 'hemm-heavy-equipment',
    index: '05',
    name: 'HEMM',
    shortName: 'HEMM',
    tagline: 'Keeping heavy industry moving.',
    summary:
      'Manufacture, sourcing, repair and maintenance of Heavy Earth Moving Machinery and components, with workshop and diagnostic services for heavy vehicles.',
    intro: [
      'Nova Ventures covers the manufacture, sourcing, distribution, repair, servicing and maintenance of Heavy Earth Moving Machinery (HEMM), spare parts and components for mining, construction and other heavy industries.',
      'The vertical includes workshops and service centres for heavy vehicles and equipment, with fabrication, hydraulics, electrical, mechanical, diagnostic and preventive-maintenance services.',
    ],
    capabilities: [
      'HEMM manufacture, sourcing & distribution',
      'Repair & maintenance services',
      'Hydraulics',
      'Diagnostics',
      'Preventive maintenance',
      'Mechanical & electrical services',
      'Heavy vehicle fabrication & body-building',
    ],
    applications: [
      'Mining operations',
      'Coal industry',
      'Construction',
      'Other heavy industries',
    ],
    approach:
      'The focus is on keeping heavy machinery and vehicles running by combining workshop infrastructure with hydraulic, electrical, mechanical and diagnostic services built for heavy industry.',
    menuTags: 'Equipment · Maintenance · Hydraulics · Diagnostics',
    ctaLabel: 'Discuss Equipment & Service Requirements',
  },
  {
    id: 'healthcare-products',
    index: '06',
    name: 'Health Care Products',
    shortName: 'Health Care Products',
    tagline: 'Products built for care.',
    summary:
      'Medical equipment, healthcare devices and health-focused products supported by careful development, assembly and distribution.',
    intro: [
      'Nova Ventures works across healthcare products, medical equipment and device development, assembly and distribution.',
      'The focus is on clean processes, product quality and practical healthcare solutions designed for responsible use.',
    ],
    capabilities: [
      'Medical equipment',
      'Healthcare device development',
      'Product assembly',
      'Healthcare product distribution',
      'Product development',
    ],
    applications: [
      'Healthcare products',
      'Medical equipment',
      'Healthcare devices',
    ],
    approach:
      'The vertical combines product development, careful assembly and dependable distribution with a focus on quality and practical healthcare needs.',
    menuTags: 'Medical equipment · Devices · Healthcare products',
    ctaLabel: 'Discuss a Healthcare Product Requirement',
  },
]

export const getBusiness = (id: string) => businesses.find((b) => b.id === id)

const heroImageByBusiness: Record<string, string> = {
  manufacturing: 'engineering-hero',
  'it-software': 'technology-hero',
  'skill-development': 'skill-development-hero',
  'civil-construction': 'civil-construction-hero',
  'hemm-heavy-equipment': 'hemm-hero',
  'healthcare-products': 'healthcare-hero',
}

export const imageIdForBusiness = (id: string) => heroImageByBusiness[id] ?? 'engineering-hero'
