/**
 * Structure informed by CodeKraftHub's public case study schema.
 * The draft examples below are illustrative planning scenarios, not delivered Nova projects.
 * Publish only after replacing target metrics with verified evidence and obtaining approval.
 */
export type CaseStudy = {
  id: string
  status: 'draft' | 'published' | 'archived'
  title: string
  industry: string
  overview: string
  problem: string
  solution: string
  technologyStack: string[]
  architecture: { layer: string; detail: string }[]
  impact: { value: string; label: string; basis: string; kind: 'target' | 'measured' }[]
  evidence: string | null
}

export const caseStudies: CaseStudy[] = [
  {
    id: 'production-visibility', status: 'draft', title: 'Production visibility and quality traceability', industry: 'Manufacturing',
    overview: 'Illustrative project scope for replacing paper production logs with a traceable digital workflow.',
    problem: 'A proposed machining operation needs a single view of work orders, inspection outcomes and shift handovers.',
    solution: 'A browser-based operator console records work progress and inspection events, with supervisors reviewing exceptions before the next process step.',
    technologyStack: ['React', 'TypeScript', 'Node.js', 'PostgreSQL', 'MQTT', 'Docker'],
    architecture: [
      { layer: 'Capture', detail: 'Operator tablets and read-only machine gateways submit timestamped events over HTTPS and MQTT.' },
      { layer: 'Process', detail: 'An authenticated API validates work-order transitions; queue consumers deduplicate machine events and record an audit trail.' },
      { layer: 'Store', detail: 'PostgreSQL stores work orders and inspection records; encrypted object storage holds approved inspection documents.' },
      { layer: 'Operate', detail: 'Role-based dashboards show exceptions and shift summaries. Backups, restore drills and monitoring cover operational continuity.' },
    ],
    impact: [
      { value: '30%', label: 'Target reduction in reporting time', basis: 'Proposed comparison of median reporting minutes per shift before and after a four-week pilot.', kind: 'target' },
      { value: '95%', label: 'Target work-order traceability', basis: 'Proposed share of completed work orders with all mandatory process and inspection events recorded.', kind: 'target' },
    ], evidence: null,
  },
  {
    id: 'equipment-service-planning', status: 'draft', title: 'Equipment service and maintenance planning', industry: 'HEMM',
    overview: 'Illustrative project scope for coordinating equipment condition, service requests and maintenance windows.',
    problem: 'Workshop coordinators need service history and spare-part availability before assigning work to technicians.',
    solution: 'A mobile-friendly maintenance platform groups service history by asset, schedules preventive work and records technician sign-off.',
    technologyStack: ['React', 'Python', 'FastAPI', 'PostgreSQL', 'Redis', 'OpenTelemetry'],
    architecture: [
      { layer: 'Capture', detail: 'Technicians record readings, fault codes and service notes in an offline-capable web app.' },
      { layer: 'Synchronize', detail: 'An API uses idempotent event identifiers and conflict review to synchronize work completed without connectivity.' },
      { layer: 'Coordinate', detail: 'Background workers reconcile maintenance intervals and parts status; supervisors approve work scheduling.' },
      { layer: 'Observe', detail: 'Audit logs and role permissions protect service records. Operational dashboards track backlog, overdue work and completion time.' },
    ],
    impact: [
      { value: '20%', label: 'Target reduction in overdue work orders', basis: 'Proposed comparison of the share of overdue orders across matched eight-week periods.', kind: 'target' },
      { value: '15 min', label: 'Target planning time per service job', basis: 'Proposed median time from request review to an approved technician assignment.', kind: 'target' },
    ], evidence: null,
  },
  {
    id: 'learning-operations', status: 'draft', title: 'Training delivery and skills assessment', industry: 'Skill Development',
    overview: 'Illustrative project scope for managing cohorts, practical assessments and learner progress.',
    problem: 'Training teams need consistent attendance records and evidence of practical competency across workshops.',
    solution: 'A learning operations portal connects cohort planning, assessor rubrics and reviewed learner portfolios.',
    technologyStack: ['React', 'TypeScript', 'Node.js', 'PostgreSQL', 'S3-compatible storage'],
    architecture: [
      { layer: 'Experience', detail: 'Accessible learner and assessor interfaces support attendance, assignments and practical assessment rubrics.' },
      { layer: 'Services', detail: 'A role-scoped API validates assessment transitions, records approvals and schedules notifications.' },
      { layer: 'Evidence', detail: 'Encrypted object storage holds submitted work with short-lived download links; the database records permissions and review history.' },
      { layer: 'Reporting', detail: 'Cohort reports aggregate attendance and assessed competencies without exposing individual records to unauthorized users.' },
    ],
    impact: [
      { value: '40%', label: 'Target reduction in assessment administration', basis: 'Proposed comparison of assessor administration hours for equivalent cohorts before and after a pilot.', kind: 'target' },
      { value: '90%', label: 'Target assessment record completeness', basis: 'Proposed share of completed assessments with rubric, evidence and assessor approval present.', kind: 'target' },
    ], evidence: null,
  },
]

export const publishedCaseStudies = caseStudies.filter((study) => study.status === 'published')
