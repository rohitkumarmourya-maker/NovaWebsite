export type CapabilityGroup = { id: string; title: string; blurb: string; items: string[] }

export const capabilityGroups: CapabilityGroup[] = [
  {
    id: 'engineering',
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
    id: 'technology',
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
    id: 'industrial-services',
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
  {
    id: 'healthcare-products',
    title: 'Healthcare Products',
    blurb: 'Medical equipment and healthcare products supported by development, assembly and distribution.',
    items: ['Medical equipment', 'Healthcare device development', 'Product assembly', 'Quality documentation', 'Healthcare product distribution'],
  },
]
