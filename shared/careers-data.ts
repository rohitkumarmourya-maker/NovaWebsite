export type ApplicationType = 'Job' | 'Internship'
export type BusinessVertical = 'Manufacturing' | 'IT' | 'HEMM' | 'Healthcare Products' | 'Skill Development' | 'Civil & Construction'
export type Opening = {
  id: string
  title: string
  vertical: BusinessVertical
  type: ApplicationType | 'Job / Internship'
  location: string
  summary: string
  status: 'open' | 'upcoming' | 'archived'
}

/** Canonical job catalogue. Node 24 and Vite both consume this module directly. */
export const jobPostings: Opening[] = [
  {
    "id": "production-engineer",
    "title": "Production Engineer",
    "vertical": "Manufacturing",
    "type": "Job",
    "location": "Bilaspur, Chhattisgarh",
    "summary": "Plan and run precision machining and fabrication work with a focus on quality and throughput.",
    "status": "open"
  },
  {
    "id": "software-engineer",
    "title": "Software Engineer",
    "vertical": "IT",
    "type": "Job / Internship",
    "location": "Bilaspur / Remote",
    "summary": "Build web, mobile, data and AI-enabled products across the Nova Ventures businesses.",
    "status": "open"
  },
  {
    "id": "hemm-service-technician",
    "title": "HEMM Service Technician",
    "vertical": "HEMM",
    "type": "Job",
    "location": "Bilaspur, Chhattisgarh",
    "summary": "Diagnose, repair and maintain heavy earth moving machinery and hydraulics.",
    "status": "open"
  },
  {
    "id": "product-development-associate",
    "title": "Product Development Associate",
    "vertical": "Healthcare Products",
    "type": "Job / Internship",
    "location": "Bilaspur, Chhattisgarh",
    "summary": "Support development, assembly and documentation of healthcare products.",
    "status": "open"
  },
  {
    "id": "skill-development-trainer",
    "title": "Skill Development Trainer",
    "vertical": "Skill Development",
    "type": "Job",
    "location": "Bilaspur, Chhattisgarh",
    "summary": "Deliver hands-on technical and vocational training programmes.",
    "status": "open"
  },
  {
    "id": "site-engineer",
    "title": "Site Engineer",
    "vertical": "Civil & Construction",
    "type": "Job",
    "location": "Chhattisgarh (project sites)",
    "summary": "Coordinate civil works, site development and infrastructure projects.",
    "status": "open"
  }
]

export const acceptingApplications = (opening: Opening) => opening.status !== 'archived'
export const activeOpenings = jobPostings.filter(acceptingApplications)
