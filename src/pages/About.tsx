import BusinessExplorer from '../components/BusinessExplorer'
import Leadership from '../components/Leadership'
import { Link } from 'react-router-dom'
import { pillars, valuesNote } from '../data/site'
import { CTAButton, Eyebrow, PageHero, SectionHeading } from '../components/Ui'
import SiteImage from '../components/SiteImage'
import ScrollReveal from '../components/ScrollReveal'
import { Seo, breadcrumbJsonLd } from '../lib/head'

export default function About() {
  return (
    <>
      <Seo
        title="About"
        description="About Nova Ventures Innovation and Technology — one company, six businesses and one engineering mindset, registered in Chhattisgarh, India."
        path="/about"
        jsonLd={[breadcrumbJsonLd([{ name: 'Home', path: '/' }, { name: 'About', path: '/about' }])]}
      />
      <PageHero eyebrow="About Nova Ventures" title="One company, six businesses, one engineering mindset." />

      <section className="py-20 sm:py-28">
        <div className="container-nova grid grid-cols-1 gap-12 lg:grid-cols-2 lg:items-center lg:gap-20">
          <ScrollReveal>
            <SiteImage id="who-we-are" fit="natural" sizes="(min-width: 1024px) 48vw, 100vw" />
          </ScrollReveal>
          <div className="flex flex-col justify-center gap-6 text-body text-ink-700">
            <Eyebrow>Who We Are</Eyebrow>
            <p>
              Nova Ventures Innovation and Technology brings together Manufacturing, IT, HEMM, Healthcare Products, Skill Development, and Civil & Construction.
            </p>
            <p>The businesses share an engineering-led approach focused on practical capability, technology, quality and long-term value.</p>
          </div>
        </div>
      </section>

      <section className="py-20 sm:py-28">
        <div className="container-nova">
          <SectionHeading eyebrow="Explore Our Businesses" title="One engineering mindset, six ways it shows up." />
          <div className="mt-14"><BusinessExplorer /></div>
        </div>
      </section>
      <Leadership />

      <section className="bg-sand-50 py-20 sm:py-28">
        <div className="container-nova">
          <Eyebrow>Our Business Philosophy</Eyebrow>
          <p className="mt-6 max-w-4xl font-display text-statement font-semibold text-graphite-900">
            One engineering mindset, applied across manufacturing, technology, healthcare products, skills and infrastructure.
          </p>
        </div>
      </section>

      <section className="py-20 sm:py-28">
        <div className="container-nova grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-20">
          <div>
            <h2 className="text-h2 font-semibold text-graphite-900">Vision &amp; Mission</h2>
          </div>
          <div className="flex flex-col gap-8">
            <div>
              <h3 className="text-h3 font-semibold text-graphite-900">Scope of business</h3>
              <p className="mt-3 text-body text-ink-700">
                To engineer, manufacture and service across industrial and heavy-equipment sectors; to design and deliver technology and emerging-technology solutions; to develop health care products; and to build practical skills that support industry.
              </p>
            </div>
            <div>
              <h3 className="text-h3 font-semibold text-graphite-900">How we work</h3>
              <p className="mt-3 text-body text-ink-700">
                Nova Ventures connects engineering, technology and people to create useful products, services and capabilities across its business verticals.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-sand-50 py-20 sm:py-28">
        <div className="container-nova">
          <SectionHeading eyebrow="How we approach our work" title="Four pillars." />
          <p className="mt-4 max-w-prose text-small text-ink-500">{valuesNote}</p>
          <div className="mt-14 grid grid-cols-1 gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
            {pillars.map((p, i) => (
              <ScrollReveal key={p.title} delayMs={i * 60}>
                <div className="border-t border-graphite-900/10 pt-6">
                  <span className="font-display text-small font-bold text-ember-700">0{i + 1}</span>
                  <h3 className="mt-3 text-h3 font-semibold text-graphite-900">{p.title}</h3>
                  <p className="mt-2 text-small text-ink-500">{p.description}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 sm:py-28">
        <div className="container-nova grid grid-cols-1 gap-10 lg:grid-cols-2 lg:items-center lg:gap-20">
          <div>
            <Eyebrow>Future Direction</Eyebrow>
            <h2 className="mt-6 text-h2 font-semibold text-graphite-900">An integrated hub in Bilaspur.</h2>
            <p className="mt-4 max-w-prose text-body text-ink-700">
              Nova Ventures is planning an integrated manufacturing, technology and skill development hub in Bilaspur. See{' '}
              <Link to="/innovation" className="font-semibold text-ember-700 underline-offset-4 hover:underline">
                Innovation
              </Link>{' '}
              for more on the technology direction.
            </p>
          </div>
          <SiteImage id="future-vision-hub" sizes="(min-width: 1024px) 48vw, 100vw" />
        </div>
      </section>

      <section className="bg-graphite-950 py-16 text-white sm:py-20">
        <div className="container-nova flex flex-col items-start gap-6 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="max-w-lg text-h2 font-semibold text-white">See how these six businesses work together.</h2>
          <CTAButton to="/businesses" variant="ghostDark">
            Explore Our Businesses
          </CTAButton>
        </div>
      </section>
    </>
  )
}
