export type ImageSpec = {
  id: string
  purpose: string
  description: string
  desktopAspectRatio: string
  mobileAspectRatio: string
  focalPoint: string
  mood: string
  placement: string
}

export const imageInventory: ImageSpec[] = [
  {
    id: 'civil-facility',
    purpose: 'Illustration of engineers reviewing a completed industrial facility',
    description: 'AI-generated architectural illustration of a steel-and-concrete industrial interior with two engineers reviewing drawings. Not a photograph of a Nova facility.',
    desktopAspectRatio: '3:2', mobileAspectRatio: '3:2', focalPoint: 'Industrial structure and engineering review', mood: 'Professional, warm, precise', placement: 'About explorer and Civil & Construction gallery',
  },
  {
    id: 'healthcare-quality',
    purpose: 'Illustration of medical equipment on a quality inspection workbench',
    description: 'AI-generated illustration of an unbranded patient monitor and inspection tools on a laboratory workbench. Not a Nova product or facility photograph.',
    desktopAspectRatio: '3:2', mobileAspectRatio: '3:2', focalPoint: 'Monitor and cuff on the workbench', mood: 'Clean, precise, calm', placement: 'About explorer and Healthcare Products gallery',
  },
  {
    id: 'home-hero',
    purpose: 'Homepage hero backdrop',
    description:
      'Cinematic wide shot inside a modern Indian engineering workshop at the moment a CNC machine finishes a precision cut, fine metal swarf catching directional light. Realistic, technical, no people\u2019s faces in focus, no signage or logos, no text overlays.',
    desktopAspectRatio: '21:9',
    mobileAspectRatio: '4:5',
    focalPoint: 'Machining head and workpiece, slightly right of centre',
    mood: 'Precise, industrial, quietly ambitious',
    placement: 'Home / Hero',
  },
  {
    id: 'who-we-are',
    purpose: '"Who We Are" editorial collage showcasing all six business verticals',
    description:
      'Branded collage image showing all six Nova Ventures business verticals: manufacturing (robotic arm), IT/software (coding screens), skill development (training classroom), civil and construction (building site), HEMM (heavy earth-moving machinery), and healthcare products (lab assembly line), with the Nova Ventures logo at the centre.',
    desktopAspectRatio: '16:9',
    mobileAspectRatio: '3:2',
    focalPoint: 'Nova Ventures logo at centre of collage',
    mood: 'Comprehensive, professional, diverse, branded',
    placement: 'Home / Who We Are, About / Who We Are',
  },
  {
    id: 'civil-construction-hero',
    purpose: 'Civil and Construction business hero',
    description:
      'Documentary-style wide shot of a civil construction site with cranes, scaffolding, concrete pillars under construction, and workers in safety vests reviewing blueprints at sunset.',
    desktopAspectRatio: '16:9',
    mobileAspectRatio: '4:5',
    focalPoint: 'Crane and workers in foreground',
    mood: 'Industrial, active, infrastructure, golden-hour light',
    placement: 'Businesses / Civil and Construction / Hero',
  },
  {
    id: 'engineering-hero',
    purpose: 'Engineering & Industrial Manufacturing business hero',
    description:
      'Close-up cinematic shot of a CNC machining head cutting a metallic workpiece, precision tooling visible, controlled industrial lighting with a shallow depth of field. No third-party logos, no fictional signage.',
    desktopAspectRatio: '16:9',
    mobileAspectRatio: '4:5',
    focalPoint: 'CNC machining head and workpiece',
    mood: 'Technical, precise, premium, industrial',
    placement: 'Businesses / Engineering & Manufacturing / Hero',
  },
  {
    id: 'engineering-fabrication',
    purpose: 'Engineering page , fabrication and welding',
    description:
      'Wide shot of a fabrication bay with a welder mid-weld, controlled sparks, protective gear, steel components staged in the foreground. Realistic industrial safety practice visible.',
    desktopAspectRatio: '3:2',
    mobileAspectRatio: '1:1',
    focalPoint: 'Weld point and sparks',
    mood: 'Rugged, skilled, industrial',
    placement: 'Businesses / Engineering & Manufacturing / Gallery',
  },
  {
    id: 'hemm-hero',
    purpose: 'HEMM & Heavy Equipment business hero',
    description:
      'Low-angle cinematic shot of heavy earth-moving machinery undergoing maintenance in a large service workshop, hydraulic arm partially raised, technician inspecting with a diagnostic tool. Dust and scale conveyed realistically.',
    desktopAspectRatio: '16:9',
    mobileAspectRatio: '4:5',
    focalPoint: 'Hydraulic arm and technician',
    mood: 'Heavy, rugged, mechanical, capable',
    placement: 'Businesses / HEMM & Heavy Equipment / Hero',
  },
  {
    id: 'hemm-workshop',
    purpose: 'HEMM page , service centre interior',
    description:
      'Wide interior shot of a heavy-vehicle service centre, overhead crane, a partially disassembled machine on blocks, tool boards along the wall. Documentary lighting.',
    desktopAspectRatio: '3:2',
    mobileAspectRatio: '1:1',
    focalPoint: 'Disassembled machine and overhead crane',
    mood: 'Industrial, methodical, heavy-duty',
    placement: 'Businesses / HEMM & Heavy Equipment / Gallery',
  },
  {
    id: 'healthcare-hero',
    purpose: 'Medical & Healthcare Products business hero',
    description:
      'Clean, well-lit shot of medical device components on a sterile assembly bench, technician in appropriate protective clothing assembling a device under controlled lighting. No visible brand names, no clinical claims implied.',
    desktopAspectRatio: '16:9',
    mobileAspectRatio: '4:5',
    focalPoint: 'Hands assembling the device component',
    mood: 'Clean, precise, responsible, modern',
    placement: 'Businesses / Healthcare / Hero',
  },
  {
    id: 'technology-hero',
    purpose: 'Technology, AI & Emerging Technologies business hero',
    description:
      'Modern software/engineering studio, wide shot of a small team reviewing a systems architecture diagram on a large display, soft ambient lighting, laptops with abstract non-branded interfaces visible.',
    desktopAspectRatio: '16:9',
    mobileAspectRatio: '4:5',
    focalPoint: 'Display screen with architecture diagram',
    mood: 'Digital, intelligent, connected, technical',
    placement: 'Businesses / Technology, AI & Emerging Technologies / Hero',
  },
  {
    id: 'skill-development-hero',
    purpose: 'Skill Development & Training business hero',
    description:
      'Documentary shot inside a vocational training workshop, an instructor guiding a trainee through a hands-on machining or welding exercise, safety equipment visible, natural light.',
    desktopAspectRatio: '16:9',
    mobileAspectRatio: '4:5',
    focalPoint: 'Instructor and trainee at the workbench',
    mood: 'Human, capable, patient, technical',
    placement: 'Businesses / Skill Development & Training / Hero',
  },
  {
    id: 'future-vision-hub',
    purpose: 'Future Vision , integrated industrial campus',
    description:
      'Premium architectural image of a modern integrated industrial campus at dusk: manufacturing sheds, a low glass-fronted technology/lab building, and an open training-and-collaboration courtyard connecting them, Indian industrial-park context. Presented as a premium campus image. No logos, no fictional signage, no completed-looking branding.',
    desktopAspectRatio: '21:9',
    mobileAspectRatio: '4:5',
    focalPoint: 'The connecting courtyard between the three building forms',
    mood: 'Aspirational, premium, forward-looking, grounded',
    placement: 'Home / Future Vision',
  },
  {
    id: 'startup-hero',
    purpose: 'IT / Software page - product review meeting',
    description:
      'A small product team reviewing a quarterly performance dashboard on a wall display in a modern Nova Ventures meeting room, laptops and notebooks on the table.',
    desktopAspectRatio: '3:2',
    mobileAspectRatio: '3:2',
    focalPoint: 'Presenter and dashboard screen',
    mood: 'Collaborative, analytical, modern',
    placement: 'Businesses / IT / Software / Gallery',
  },
  {
    id: 'careers-hero',
    purpose: 'Careers page hero',
    description:
      'Wide documentary shot combining an engineering workshop and a modern office desk in a single frame or diptych, representing the range of disciplines across Nova Ventures\u2019 businesses. Realistic, unposed, no visible faces in sharp focus.',
    desktopAspectRatio: '16:9',
    mobileAspectRatio: '4:5',
    focalPoint: 'The transition point between workshop and office',
    mood: 'Inviting, capable, varied',
    placement: 'Careers / Hero',
  },
]

export const getImage = (id: string) => imageInventory.find((i) => i.id === id)
