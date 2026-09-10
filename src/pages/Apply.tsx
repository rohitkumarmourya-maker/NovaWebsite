import { useSyncExternalStore } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import ApplicationForm from '../components/forms/ApplicationForm'
import { PageHero } from '../components/Ui'
import { openings } from '../lib/careers-data'
import { Seo, breadcrumbJsonLd } from '../lib/head'

const subscribe = () => () => {}

export default function Apply() {
  const [params] = useSearchParams()
  // Match the query-free prerender on the first hydration pass.
  const hydrated = useSyncExternalStore(subscribe, () => true, () => false)
  const requested = hydrated ? params.get('position') : null
  const opening = openings.find((job) => job.id === requested)
  return (
    <>
      <Seo title="Job & Internship Application" description="Apply to Nova Ventures with your experience, skills and CV." path="/careers/apply" jsonLd={[breadcrumbJsonLd([{ name: 'Home', path: '/' }, { name: 'Careers', path: '/careers' }, { name: 'Apply', path: '/careers/apply' }])]} />
      <PageHero eyebrow="Careers / Application" title={opening ? `Apply: ${opening.title}` : 'Your next chapter starts here.'} lead="Share your experience and upload your CV. Save your reference number when your application has been accepted." />
      <section id="apply" className="scroll-mt-24 bg-sand-50 py-12 sm:py-20">
        <div className="container-nova">
          <div className="mx-auto max-w-3xl">
            <Link to="/careers#openings" className="mb-8 inline-flex min-h-11 items-center font-semibold text-ember-700">← Back to all roles</Link>
            {requested && !opening ? (
              <div className="rounded-3xl border border-graphite-900/15 bg-white p-8" role="status">
                <h2 className="text-h3 font-semibold">This role is no longer accepting applications.</h2>
                <p className="mt-3">Choose another opening or send a general application.</p>
                <Link to="/careers/apply" className="mt-5 inline-flex min-h-11 items-center font-semibold text-ember-700">Start a general application →</Link>
              </div>
            ) : <ApplicationForm key={opening?.id ?? 'general'} presetPosition={opening?.title} />}
          </div>
        </div>
      </section>
    </>
  )
}
