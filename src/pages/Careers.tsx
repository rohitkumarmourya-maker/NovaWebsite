import { useState } from 'react'
import { Link } from 'react-router-dom'
import { CTAButton, Eyebrow, PageHero, SectionHeading } from '../components/Ui'
import { businesses } from '../data/businesses'
import { hiringProcess, openings, whyNova } from '../data/careers'
import SiteImage from '../components/SiteImage'
import ScrollReveal from '../components/ScrollReveal'
import ApplicationForm from '../components/forms/ApplicationForm'
import { Seo, breadcrumbJsonLd } from '../lib/head'

export default function Careers() {
  const [preset, setPreset] = useState<string | undefined>(undefined)
  const [formKey, setFormKey] = useState(0)

  const applyFor = (title: string) => {
    setPreset(title)
    setFormKey((k) => k + 1)
    document.getElementById('apply')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <>
      <Seo
        title="Careers, Jobs & Internships"
        description="Apply for jobs and internships at Nova Ventures across manufacturing, IT / software, skill development, civil and construction, HEMM and health care products in Chhattisgarh."
        path="/careers"
        jsonLd={[breadcrumbJsonLd([{ name: 'Home', path: '/' }, { name: 'Careers', path: '/careers' }])]}
      />

      <PageHero
        eyebrow="Careers"
        title="Build what comes next."
        lead="Nova Ventures spans manufacturing, IT / software, skill development, civil and construction, HEMM and health care products — six businesses that need people across a wide range of disciplines as they grow."
        aside={<SiteImage id="careers-hero" priority sizes="(min-width: 1024px) 45vw, 100vw" />}
      >
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <CTAButton to="/careers#apply">Apply now</CTAButton>
          <CTAButton to="/careers#openings" variant="ghost">
            See open roles
          </CTAButton>
        </div>
      </PageHero>

      {/* Why Nova */}
      <section className="py-16 sm:py-24">
        <div className="container-nova">
          <SectionHeading eyebrow="Why Nova Ventures" title="One company, many kinds of work." />
          <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {whyNova.map((item, i) => (
              <ScrollReveal key={item.title} delayMs={i * 60}>
                <div className="h-full rounded-3xl border border-graphite-900/10 bg-white p-6 shadow-soft">
                  <span className="font-display text-small font-bold text-ember-700">0{i + 1}</span>
                  <h3 className="mt-3 text-h4 font-semibold text-graphite-900">{item.title}</h3>
                  <p className="mt-2 text-small text-ink-700">{item.text}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Open roles */}
      <section id="openings" className="scroll-mt-24 bg-sand-50 py-16 sm:py-24">
        <div className="container-nova">
          <SectionHeading
            eyebrow="Open roles"
            title="Current and upcoming positions."
            lead="Every role below accepts applications through the form on this page. Don’t see a fit? Choose “Other / general application” and tell us what you do best."
          />
          <ul className="mt-12 grid grid-cols-1 gap-4 lg:grid-cols-2">
            {openings.map((o) => (
              <li key={o.id} className="flex flex-col justify-between gap-5 rounded-3xl border border-graphite-900/10 bg-white p-6 shadow-soft sm:flex-row sm:items-center">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-h4 font-semibold text-graphite-900">{o.title}</h3>
                    <span className="rounded-full bg-ember/20 px-2.5 py-0.5 text-eyebrow font-bold text-ember-800">{o.type}</span>
                  </div>
                  <p className="mt-1.5 text-small text-ink-500">
                    {o.vertical} &middot; {o.location}
                  </p>
                  <p className="mt-2 text-small text-ink-700">{o.summary}</p>
                </div>
                <button
                  type="button"
                  onClick={() => applyFor(o.title)}
                  className="inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-full border border-graphite-900/25 px-5 text-small font-semibold text-graphite-900 transition-colors hover:border-graphite-900 hover:bg-graphite-900 hover:text-white"
                >
                  Apply <span aria-hidden="true">&rarr;</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Process */}
      <section className="py-16 sm:py-24">
        <div className="container-nova">
          <SectionHeading eyebrow="How hiring works" title="Four clear steps." />
          <ol className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {hiringProcess.map((s) => (
              <li key={s.step} className="border-t border-graphite-900/10 pt-6">
                <span className="font-display text-small font-bold text-ember-700">{s.step}</span>
                <h3 className="mt-3 text-h4 font-semibold text-graphite-900">{s.title}</h3>
                <p className="mt-2 text-small text-ink-700">{s.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Application form */}
      <section id="apply" className="scroll-mt-24 bg-sand-50 py-16 sm:py-24">
        <div className="container-nova">
          <div className="mx-auto max-w-3xl">
            <div className="mb-10 text-center">
              <Eyebrow>Apply for a job or internship</Eyebrow>
              <h2 className="mt-5 text-h2 font-semibold text-graphite-900">Send us your application.</h2>
            </div>
            <ApplicationForm key={formKey} presetPosition={preset} />
          </div>
        </div>
      </section>

      {/* Where you could work */}
      <section className="py-16 sm:py-24">
        <div className="container-nova">
          <SectionHeading eyebrow="Where you could work" title="Six businesses, one employer." />
          <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {businesses.map((b) => (
              <Link key={b.id} to={`/businesses/${b.id}`} className="group rounded-3xl border border-graphite-900/10 bg-white p-6 transition-colors hover:border-ember">
                <span className="font-display text-eyebrow font-bold text-ember-700">{b.index}</span>
                <p className="mt-2 text-h4 font-semibold text-graphite-900 group-hover:text-ember-700">{b.shortName}</p>
                <p className="mt-1.5 text-small text-ink-500">{b.menuTags}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
