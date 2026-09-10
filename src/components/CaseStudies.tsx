import { publishedCaseStudies } from '../lib/case-studies-data'
import { ArrowLink, SectionHeading } from './Ui'

export default function CaseStudies() {
  return (
    <section id="case-studies" className="scroll-mt-24 bg-sand-50 py-16 sm:py-24">
      <div className="container-nova">
        <SectionHeading eyebrow="IT & Innovation" title="Project case studies" lead="An inside look at the challenges, systems and outcomes behind our technology work." />
        {publishedCaseStudies.length === 0 ? (
          <div className="mt-10 max-w-3xl border-t border-graphite-900/15 pt-8">
            <h3 className="text-h3 font-semibold text-graphite-900">Our project stories are coming soon.</h3>
            <p className="mt-4 text-body text-ink-700">Future case studies will cover project overviews, technology stacks, system architecture and measured client outcomes.</p>
            <ArrowLink to="/contact" className="mt-5">Discuss your technology requirement</ArrowLink>
          </div>
        ) : (
          <div className="mt-12 space-y-12">
            {publishedCaseStudies.map((study) => (
              <article key={study.id} id={study.id} className="scroll-mt-24 border-t border-graphite-900/15 pt-10">
                <p className="text-small font-semibold text-ember-700">{study.industry}</p>
                <h3 className="mt-3 max-w-3xl text-h2 font-semibold text-graphite-900">{study.title}</h3>
                <p className="mt-5 max-w-prose text-lead text-ink-700">{study.overview}</p>
                <div className="mt-8 grid gap-8 lg:grid-cols-2">
                  <div><h4 className="text-h4 font-semibold">The challenge</h4><p className="mt-3 text-body text-ink-700">{study.problem}</p></div>
                  <div><h4 className="text-h4 font-semibold">The solution</h4><p className="mt-3 text-body text-ink-700">{study.solution}</p></div>
                </div>
                <h4 className="mt-8 text-h4 font-semibold">Technology stack</h4>
                <ul className="mt-4 flex flex-wrap gap-3">{study.technologyStack.map((technology) => <li key={technology} className="rounded-full border border-graphite-900/20 px-4 py-2 text-small">{technology}</li>)}</ul>
                <h4 className="mt-8 text-h4 font-semibold">System architecture</h4>
                <ol className="mt-4 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">{study.architecture.map((layer, index) => <li key={layer.layer} className="border-l-2 border-ember pl-4"><span className="text-small font-semibold text-ember-700">0{index + 1}</span><h5 className="mt-2 font-semibold">{layer.layer}</h5><p className="mt-2 text-small text-ink-700">{layer.detail}</p></li>)}</ol>
                <h4 className="mt-8 text-h4 font-semibold">Client impact</h4>
                <dl className="mt-4 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">{study.impact.map((metric) => <div key={metric.label}><dt className="text-small font-semibold">{metric.label}</dt><dd className="mt-2 text-h2 font-semibold text-ember-700">{metric.value}</dd><dd className="mt-2 text-small text-ink-500">{metric.basis}</dd></div>)}</dl>
                {study.evidence && <p className="mt-6 text-small text-ink-500">Evidence: {study.evidence}</p>}
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
