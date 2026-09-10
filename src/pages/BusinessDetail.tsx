import CaseStudies from '../components/CaseStudies'
import { Link, useParams } from 'react-router-dom'
import { businesses, getBusiness, imageIdForBusiness, detailImageIdForBusiness } from '../data/businesses'
import { CTAButton, Eyebrow } from '../components/Ui'
import SiteImage from '../components/SiteImage'
import ScrollReveal from '../components/ScrollReveal'
import Breadcrumbs from '../components/Breadcrumbs'
import { Seo, breadcrumbJsonLd } from '../lib/head'
import NotFound from './NotFound'

export default function BusinessDetail() {
  const { id } = useParams()
  const business = getBusiness(id ?? '')
  if (!business) return <NotFound />

  const others = businesses.filter((b) => b.id !== business.id).slice(0, 3)
  const galleryImage = detailImageIdForBusiness(business.id)
  const crumbs = [
    { name: 'Home', path: '/' },
    { name: 'Businesses', path: '/businesses' },
    { name: business.name, path: `/businesses/${business.id}` },
  ]

  return (
    <>
      <Seo
        title={`${business.name} — ${business.tagline}`}
        description={business.summary}
        path={`/businesses/${business.id}`}
        jsonLd={[breadcrumbJsonLd(crumbs)]}
      />

      <section className="bg-graphite-950 pb-16 pt-28 text-white sm:pb-24 sm:pt-36 lg:pt-40">
        <div className="container-nova">
          <Breadcrumbs items={crumbs} dark />
        </div>
        <div className="container-nova mt-8 grid grid-cols-1 gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:gap-16">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-ember/50 px-3 py-1 font-display text-eyebrow font-bold text-ember">
              Business {business.index}
            </span>
            <h1 className="mt-6 max-w-3xl text-h1 font-bold text-white">{business.name}</h1>
            <p className="mt-6 max-w-prose text-lead text-white/75">{business.tagline}</p>
            <div className="mt-8">
              <CTAButton to="/contact" variant="ember">
                {business.ctaLabel}
              </CTAButton>
            </div>
          </div>
          <SiteImage id={imageIdForBusiness(business.id)} priority sizes="(min-width: 1024px) 45vw, 100vw" overlay={false} className="shadow-lift" />
        </div>
      </section>

      <section className="py-16 sm:py-24">
        <div className="container-nova grid grid-cols-1 gap-8 lg:grid-cols-[1fr_2fr] lg:gap-20">
          <div>
            <Eyebrow>Introduction</Eyebrow>
            <p className="mt-4 text-h3 font-semibold text-graphite-900">{business.summary}</p>
          </div>
          <div className="flex max-w-prose flex-col gap-6 text-body text-ink-700 lg:pt-1">
            {business.intro.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-sand-50 py-16 sm:py-24">
        <div className="container-nova">
          <Eyebrow>Capabilities</Eyebrow>
          <h2 className="mt-5 text-h2 font-semibold text-graphite-900">What this business does.</h2>
          <ul className="mt-10 grid grid-cols-1 gap-x-8 gap-y-2 sm:grid-cols-2 lg:grid-cols-3">
            {business.capabilities.map((c) => (
              <li key={c} className="flex items-center gap-3 border-t border-graphite-900/10 py-4">
                <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-ember" aria-hidden="true" />
                <span className="text-body font-medium text-graphite-900">{c}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="py-16 sm:py-24">
        <div className="container-nova grid grid-cols-1 gap-8 lg:grid-cols-[1fr_2fr] lg:gap-20">
          <div>
            <Eyebrow>Applications &amp; Areas</Eyebrow>
            <h2 className="mt-4 text-h3 font-semibold text-graphite-900">Where it is applied.</h2>
          </div>
          <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {business.applications.map((a) => (
              <li key={a} className="rounded-2xl border border-graphite-900/10 bg-white px-5 py-4 text-body font-medium text-ink-700">
                {a}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {business.id === 'it-software' && <CaseStudies />}

      <section className="bg-graphite-950 py-16 text-white sm:py-24">
        <div className="container-nova">
          <Eyebrow dark>How Nova Approaches This Sector</Eyebrow>
          <p className="mt-6 max-w-3xl font-display text-h3 font-semibold text-white">{business.approach}</p>
        </div>
      </section>

      <section className="py-16 sm:py-24">
        <ScrollReveal className="container-nova">
          <SiteImage id={galleryImage} sizes="(min-width: 1440px) 1344px, 100vw" className="shadow-soft" />
        </ScrollReveal>
      </section>

      <section className="bg-sand-50 py-16 sm:py-24">
        <div className="container-nova">
          <Eyebrow>Related Businesses</Eyebrow>
          <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-3">
            {others.map((b) => (
              <Link
                key={b.id}
                to={`/businesses/${b.id}`}
                className="group rounded-3xl border border-graphite-900/10 bg-white p-6 shadow-soft transition-colors hover:border-ember"
              >
                <span className="font-display text-eyebrow font-bold text-ember-700">{b.index}</span>
                <h3 className="mt-2 text-h4 font-semibold text-graphite-900 group-hover:text-ember-700">{b.shortName}</h3>
                <p className="mt-1.5 text-small text-ink-500">{b.tagline}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-ember py-16 sm:py-20">
        <div className="container-nova flex flex-col items-start gap-6 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="max-w-lg text-h2 font-semibold text-graphite-900">Talk to Nova Ventures about {business.shortName.toLowerCase()}.</h2>
          <CTAButton to="/contact" variant="ghost">
            {business.ctaLabel}
          </CTAButton>
        </div>
      </section>
    </>
  )
}
