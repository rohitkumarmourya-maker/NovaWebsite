import { Link } from 'react-router-dom'
import { businesses, imageIdForBusiness } from '../data/businesses'
import { CtaBand, PageHero } from '../components/Ui'
import SiteImage from '../components/SiteImage'
import ScrollReveal from '../components/ScrollReveal'
import { Seo, breadcrumbJsonLd } from '../lib/head'

export default function Businesses() {
  return (
    <>
      <Seo
        title="Our Businesses"
        description="Nova Ventures’ six businesses: manufacturing, IT, HEMM, healthcare products, skill development, and civil and construction."
        path="/businesses"
        jsonLd={[breadcrumbJsonLd([{ name: 'Home', path: '/' }, { name: 'Businesses', path: '/businesses' }])]}
      />
      <PageHero
        eyebrow="Our Businesses"
        title="Six businesses, one company."
        lead="Every business shares Nova Ventures’ engineering mindset and design language, while operating with its own scope, capability and audience."
      />

      <section className="py-16 sm:py-24">
        <div className="container-nova grid grid-cols-1 gap-8 sm:grid-cols-2">
          {businesses.map((b, i) => (
            <ScrollReveal key={b.id} delayMs={(i % 2) * 80}>
              <Link
                to={`/businesses/${b.id}`}
                className="group flex h-full flex-col overflow-hidden rounded-3xl border border-graphite-900/10 bg-white shadow-soft transition-all duration-300 hover:-translate-y-1 hover:border-ember hover:shadow-lift"
              >
                <SiteImage id={imageIdForBusiness(b.id)} rounded="rounded-none" sizes="(min-width: 640px) 50vw, 100vw" />
                <div className="flex flex-1 flex-col p-7 sm:p-8">
                  <div className="flex items-start justify-between">
                    <span className="font-display text-small font-bold text-ember-700">{b.index}</span>
                    <svg
                      width="22"
                      height="22"
                      viewBox="0 0 22 22"
                      fill="none"
                      className="text-graphite-900 transition-all duration-300 ease-editorial group-hover:translate-x-1 group-hover:text-ember-700"
                      aria-hidden="true"
                    >
                      <path d="M5 11H17M17 11L12 6M17 11L12 16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                  <h2 className="mt-4 text-h3 font-semibold text-graphite-900 transition-colors group-hover:text-ember-700">{b.name}</h2>
                  <p className="mt-2 text-small font-medium text-ink-500">{b.tagline}</p>
                  <p className="mt-3 text-body text-ink-700">{b.summary}</p>
                </div>
              </Link>
            </ScrollReveal>
          ))}
        </div>
      </section>

      <CtaBand title="Not sure which business fits your requirement?" to="/contact" label="Start a Conversation" />
    </>
  )
}
