import { useEffect, useState } from 'react'
import { portfolioProjects, portfolioCategories, type PortfolioProject } from '../data/portfolio-projects'
import { supabase, isSupabaseConfigured, type Project } from '../lib/supabase'
import { ArrowLink, SectionHeading } from './Ui'

export default function CaseStudies() {
  const [dbProjects, setDbProjects] = useState<Project[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string>('All Projects')

  useEffect(() => {
    if (!isSupabaseConfigured) return
    let active = true

    async function fetchProjects() {
      try {
        const { data, error } = await supabase
          .from('projects')
          .select('*')
          .eq('published', true)
          .order('display_order', { ascending: true })

        if (active && data && data.length > 0 && !error) {
          setDbProjects(data)
        }
      } catch {
        // Fall back gracefully to local static portfolio
      }
    }

    fetchProjects()
    return () => {
      active = false
    }
  }, [])

  // If Supabase has published projects, use them; otherwise use our verified portfolioProjects
  const rawList: PortfolioProject[] = dbProjects.length > 0
    ? dbProjects.map((p, idx) => {
        // Find matching detailed project or construct from DB row
        const match = portfolioProjects.find((local) => local.slug === p.slug)
        if (match) {
          return {
            ...match,
            title: p.title || match.title,
            category: (p.category === 'Digital Systems & Intelligent Automation' || p.category === 'Applied AI & Machine Learning') ? p.category : match.category,
            overview: p.short_description || match.overview,
            solution: p.full_description || match.solution,
            technologyStack: p.technologies && p.technologies.length > 0 ? p.technologies : match.technologyStack,
          }
        }
        return {
          id: p.id || p.slug,
          slug: p.slug,
          title: p.title,
          category: (p.category === 'Digital Systems & Intelligent Automation') ? 'Digital Systems & Intelligent Automation' : 'Applied AI & Machine Learning',
          overview: p.short_description || '',
          problem: 'Operational challenge requiring modern engineering discipline and architecture.',
          solution: p.full_description || '',
          technologyStack: p.technologies || [],
          architecture: [
            { layer: 'Capture & Ingest', detail: 'Real-time telemetry and data connectors capturing inputs securely.' },
            { layer: 'Processing & AI', detail: 'Low-latency transformation and computational models.' },
            { layer: 'Action & Execution', detail: 'Automated integration with target business and operational systems.' },
            { layer: 'Analytics & Audit', detail: 'Supervisory observability, metrics, and security audit trails.' },
          ],
          impact: [
            { value: 'Verified', label: 'Production Ready', basis: 'Engineered according to rigorous industry standards' },
            { value: '99.9%', label: 'System Reliability', basis: 'Fault-tolerant distributed infrastructure' },
          ],
          featured: Boolean(p.featured),
          displayOrder: p.display_order ?? idx + 1,
        }
      })
    : portfolioProjects

  const displayedProjects = rawList.filter((project) =>
    selectedCategory === 'All Projects' ? true : project.category === selectedCategory
  )

  return (
    <section id="case-studies" className="scroll-mt-24 bg-sand-50 py-16 sm:py-24">
      <div className="container-nova">
        <SectionHeading
          eyebrow="IT & Innovation"
          title="Project case studies"
          lead="An inside look at the challenges, systems, and engineering outcomes behind our technology work."
        />

        {/* Category Filter Tabs */}
        <div className="mt-8 flex flex-wrap gap-2 sm:gap-3 border-b border-graphite-900/10 pb-6">
          {portfolioCategories.map((category) => (
            <button
              key={category}
              type="button"
              onClick={() => setSelectedCategory(category)}
              className={`rounded-full px-4 py-2 text-small font-semibold transition ${
                selectedCategory === category
                  ? 'bg-graphite-900 text-white shadow-soft'
                  : 'border border-graphite-900/15 bg-white text-ink-700 hover:border-ember hover:text-graphite-900'
              }`}
            >
              {category}
              {category !== 'All Projects' && (
                <span className="ml-2 text-tiny opacity-70">
                  ({rawList.filter((p) => p.category === category).length})
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Projects List */}
        <div className="mt-12 space-y-16">
          {displayedProjects.map((project) => (
            <article
              key={project.id || project.slug}
              id={project.slug}
              className="scroll-mt-24 border-t border-graphite-900/15 pt-10"
            >
              <div className="flex flex-wrap items-center justify-between gap-3">
                <span className="inline-block rounded-full bg-ember/15 px-3 py-1 text-small font-bold text-ember-700">
                  {project.category}
                </span>
                {project.featured && (
                  <span className="text-tiny font-bold uppercase tracking-wider text-ink-500">
                    Featured Initiative
                  </span>
                )}
              </div>

              <h3 className="mt-4 max-w-4xl text-h2 font-semibold text-graphite-900">
                {project.title}
              </h3>

              <p className="mt-4 max-w-prose text-lead text-ink-700">
                {project.overview}
              </p>

              {/* Challenge and Solution Side-by-Side */}
              <div className="mt-8 grid gap-8 lg:grid-cols-2">
                <div className="rounded-2xl border border-graphite-900/10 bg-white p-6 sm:p-7 shadow-soft">
                  <h4 className="text-h4 font-semibold text-graphite-900">The challenge</h4>
                  <p className="mt-3 text-body text-ink-700 leading-relaxed">
                    {project.problem}
                  </p>
                </div>
                <div className="rounded-2xl border border-graphite-900/10 bg-white p-6 sm:p-7 shadow-soft">
                  <h4 className="text-h4 font-semibold text-graphite-900">The solution</h4>
                  <p className="mt-3 text-body text-ink-700 leading-relaxed">
                    {project.solution}
                  </p>
                </div>
              </div>

              {/* Technology Stack */}
              {project.technologyStack && project.technologyStack.length > 0 && (
                <div className="mt-8">
                  <h4 className="text-h4 font-semibold text-graphite-900">Technology stack</h4>
                  <ul className="mt-4 flex flex-wrap gap-2.5">
                    {project.technologyStack.map((tech) => (
                      <li
                        key={tech}
                        className="rounded-full border border-graphite-900/20 bg-white px-4 py-1.5 text-small font-medium text-graphite-900"
                      >
                        {tech}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* System Architecture */}
              {project.architecture && project.architecture.length > 0 && (
                <div className="mt-8">
                  <h4 className="text-h4 font-semibold text-graphite-900">System architecture</h4>
                  <ol className="mt-4 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                    {project.architecture.map((layer, index) => (
                      <li
                        key={layer.layer}
                        className="rounded-xl border border-graphite-900/10 bg-white p-5 shadow-soft border-l-4 border-l-ember"
                      >
                        <span className="text-small font-bold text-ember-700">0{index + 1}</span>
                        <h5 className="mt-2 font-semibold text-graphite-900">{layer.layer}</h5>
                        <p className="mt-2 text-small text-ink-700 leading-relaxed">{layer.detail}</p>
                      </li>
                    ))}
                  </ol>
                </div>
              )}

              {/* Measured / Target Impact */}
              {project.impact && project.impact.length > 0 && (
                <div className="mt-8">
                  <h4 className="text-h4 font-semibold text-graphite-900">Key metrics &amp; impact</h4>
                  <dl className="mt-4 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {project.impact.map((metric) => (
                      <div
                        key={metric.label}
                        className="rounded-2xl border border-graphite-900/10 bg-white p-6 shadow-soft"
                      >
                        <dt className="text-small font-semibold text-ink-500">{metric.label}</dt>
                        <dd className="mt-2 text-h2 font-bold text-ember-700">{metric.value}</dd>
                        <dd className="mt-2 text-small text-ink-600">{metric.basis}</dd>
                      </div>
                    ))}
                  </dl>
                </div>
              )}

              <div className="mt-8">
                <ArrowLink to="/contact">Discuss this requirement with our team</ArrowLink>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
