import assert from 'node:assert/strict'
import { test } from 'node:test'
import { readFileSync } from 'node:fs'
import { jobPostings } from '../shared/careers-data.ts'
import { caseStudies } from '../src/lib/case-studies-data.ts'
import { capabilityGroups } from '../src/lib/capabilities-data.ts'
import { newsEntries } from '../src/lib/news-data.ts'
import { staticRoutes, businessIds } from '../site.config.mjs'

const root = new URL('../', import.meta.url)
const read = (file) => readFileSync(new URL(file, root), 'utf8')
const businessOrder = JSON.parse(read('shared/business-order.json'))
test('canonical business order and shared routing match the required sequence', () => {
  assert.deepEqual(businessOrder.map((business) => business.label), ['Manufacturing', 'IT', 'HEMM', 'Healthcare Products', 'Skill Development', 'Civil & Construction'])
  assert.deepEqual(businessIds, businessOrder.map((business) => business.id))
  for (const file of ['src/components/Header.tsx', 'src/components/Footer.tsx', 'src/components/Ecosystem.tsx', 'src/pages/Businesses.tsx']) assert.match(read(file), /businesses\.map/)
})
test('job IDs and titles are unique and job metadata is valid', () => {
  assert.equal(new Set(jobPostings.map((job) => job.id)).size, jobPostings.length)
  assert.equal(new Set(jobPostings.map((job) => job.title)).size, jobPostings.length)
  for (const job of jobPostings) {
    assert.match(job.id, /^[a-z0-9]+(?:-[a-z0-9]+)*$/)
    assert.ok(['open', 'upcoming', 'archived'].includes(job.status))
    assert.ok(businessOrder.some((business) => business.label === job.vertical))
    assert.ok(['Job', 'Internship', 'Job / Internship'].includes(job.type))
    assert.ok(job.title && job.summary && job.location)
  }
})
test('all four capabilities share one catalogue and pages contain the same source', () => {
  assert.equal(capabilityGroups.length, 4)
  assert.equal(new Set(capabilityGroups.map((group) => group.id)).size, 4)
  for (const file of ['src/pages/Home.tsx', 'src/pages/Capabilities.tsx']) assert.match(read(file), /capabilityGroups\.map/)
})
test('Careers has a separate application route and no em dashes', () => {
  const careers = read('src/pages/Careers.tsx')
  assert.doesNotMatch(careers, /<ApplicationForm|<form|id="apply"/)
  for (const file of ['src/pages/Careers.tsx', 'src/pages/Apply.tsx', 'src/components/forms/ApplicationForm.tsx', 'src/lib/careers-data.ts', 'shared/careers-data.ts']) assert.doesNotMatch(read(file), /—|&mdash;|Sirgitti/)
  assert.ok(staticRoutes.some((route) => route.path === '/careers/apply'))
  assert.ok(staticRoutes.some((route) => route.path === '/terms-of-service'))
  assert.match(read('src/components/Footer.tsx'), /to="\/terms-of-service"/)
})
test('homepage removes duplicate explorer and redundant capability section', () => {
  assert.doesNotMatch(read('src/pages/Home.tsx'), /<BusinessExplorer|Capability & Opportunity|Sirgitti/)
  assert.match(read('src/pages/About.tsx'), /<BusinessExplorer/)
})
test('draft case studies have complete structures; published metrics require evidence', () => {
  assert.equal(new Set(caseStudies.map((study) => study.id)).size, caseStudies.length)
  for (const study of caseStudies) {
    assert.ok(study.overview && study.problem && study.solution)
    assert.ok(study.technologyStack.length && study.architecture.length && study.impact.length)
    if (study.status === 'published') {
      assert.ok(study.evidence, `${study.id}: publication needs evidence`)
      assert.ok(study.impact.every((metric) => metric.kind === 'measured'))
    }
  }
})
test('news publications require valid dates and safe URLs', () => {
  assert.equal(new Set(newsEntries.map((entry) => entry.id)).size, newsEntries.length)
  for (const entry of newsEntries) {
    assert.match(entry.date, /^\d{4}-\d{2}-\d{2}$/)
    assert.equal(new Date(entry.date).toISOString().slice(0, 10), entry.date)
    if (entry.link) assert.match(entry.link, /^https?:\/\//)
  }
})
