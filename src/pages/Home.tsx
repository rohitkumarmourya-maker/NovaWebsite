import { Link } from 'react-router-dom'
import { motion, useReducedMotion } from 'motion/react'
import { businesses, imageIdForBusiness } from '../data/businesses'
import { newsItems } from '../lib/news-data'
import { capabilityGroups } from '../lib/capabilities-data'
import { ArrowLink, CTAButton, CtaBand, Eyebrow, SectionHeading } from '../components/Ui'
import SiteImage from '../components/SiteImage'
import Ecosystem from '../components/Ecosystem'
import { Seo } from '../lib/head'
import { EDITORIAL_EASE } from '../components/motion/MotionPrimitives'

export default function Home() {
  const prefersReduced = useReducedMotion()

  return (
    <>
      <Seo
        title="Nova Ventures | Engineering. Technology. Possibility."
        description="Official website of Nova Ventures Innovation and Technology — manufacturing, IT, HEMM, healthcare products, skill development and civil construction, connected by one engineering mindset."
        path="/"
      />

      {/* 01 Hero */}
      <section className="relative overflow-hidden bg-sand-50 pb-16 pt-28 sm:pb-24 sm:pt-36 lg:pt-44">
        <div className="pointer-events-none absolute -right-40 -top-40 h-[32rem] w-[32rem] rounded-full bg-ember/15 blur-3xl" aria-hidden="true" />
        <div className="container-nova relative grid grid-cols-1 gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:gap-16">
          <div>
            <motion.div
              initial={prefersReduced ? { opacity: 1 } : { opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, ease: EDITORIAL_EASE }}
            >
              <Eyebrow>Nova Ventures Innovation and Technology</Eyebrow>
            </motion.div>
            <h1 className="mt-6 max-w-4xl text-h1 font-bold text-graphite-900">
              <span className="sr-only">Nova Ventures: </span>
              <span className="block overflow-hidden">
                <motion.span
                  initial={prefersReduced ? { opacity: 1 } : { y: '110%', opacity: 0 }}
                  animate={{ y: '0%', opacity: 1 }}
                  transition={{ duration: 0.85, delay: prefersReduced ? 0 : 0.08, ease: EDITORIAL_EASE }}
                  className="block"
                >
                  Engineering.
                </motion.span>
              </span>
              <span className="block overflow-hidden">
                <motion.span
                  initial={prefersReduced ? { opacity: 1 } : { y: '110%', opacity: 0 }}
                  animate={{ y: '0%', opacity: 1 }}
                  transition={{ duration: 0.85, delay: prefersReduced ? 0 : 0.18, ease: EDITORIAL_EASE }}
                  className="block"
                >
                  Technology.
                </motion.span>
              </span>
              <span className="block overflow-hidden">
                <motion.span
                  initial={prefersReduced ? { opacity: 1 } : { y: '110%', opacity: 0 }}
                  animate={{ y: '0%', opacity: 1 }}
                  transition={{ duration: 0.85, delay: prefersReduced ? 0 : 0.28, ease: EDITORIAL_EASE }}
                  className="block text-ember-700"
                >
                  Possibility.
                </motion.span>
              </span>
            </h1>
            <motion.p
              initial={prefersReduced ? { opacity: 1 } : { opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: prefersReduced ? 0 : 0.38, ease: EDITORIAL_EASE }}
              className="mt-8 max-w-prose text-lead text-ink-700"
            >
              We connect engineering expertise, technology and people to turn ambitious ideas into lasting industrial value.
            </motion.p>
            <motion.div
              initial={prefersReduced ? { opacity: 1 } : { opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.75, delay: prefersReduced ? 0 : 0.48, ease: EDITORIAL_EASE }}
              className="mt-10 flex flex-col gap-4 sm:flex-row"
            >
              <CTAButton to="/businesses">Explore Our Businesses</CTAButton>
              <CTAButton to="/contact" variant="ghost">
                Start a Conversation
              </CTAButton>
            </motion.div>
          </div>
          <SiteImage id="home-hero" priority sizes="(min-width: 1024px) 46vw, 100vw" className="shadow-lift" />
        </div>
      </section>

      {/* 02 Company statement */}
      <section className="py-20 sm:py-28">
        <div className="container-nova">
          <p className="max-w-5xl font-display text-statement font-semibold text-graphite-900">
            <span className="block overflow-hidden">
              <motion.span
                initial={prefersReduced ? { opacity: 1 } : { y: '100%', opacity: 0 }}
                whileInView={{ y: '0%', opacity: 1 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.85, ease: EDITORIAL_EASE }}
                className="block"
              >
                Building across industries.
              </motion.span>
            </span>
            <span className="block overflow-hidden">
              <motion.span
                initial={prefersReduced ? { opacity: 1 } : { y: '100%', opacity: 0 }}
                whileInView={{ y: '0%', opacity: 1 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.85, delay: prefersReduced ? 0 : 0.12, ease: EDITORIAL_EASE }}
                className="block text-ember-700"
              >
                Connected by innovation.
              </motion.span>
            </span>
          </p>
        </div>
      </section>

      {/* 03 Who we are */}
      <section className="pb-20 sm:pb-28">
        <div className="container-nova grid grid-cols-1 gap-12 lg:grid-cols-2 lg:items-center lg:gap-20">
          <div className="order-2 lg:order-1">
            <SiteImage id="who-we-are" fit="natural" sizes="(min-width: 1024px) 48vw, 100vw" />
          </div>
          <motion.div
            initial={prefersReduced ? { opacity: 1 } : { opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.8, ease: EDITORIAL_EASE }}
            className="order-1 flex flex-col gap-6 lg:order-2"
          >
            <Eyebrow>Who We Are</Eyebrow>
            <h2 className="text-h2 font-semibold text-graphite-900">
              Nova Ventures Innovation and Technology brings together six business verticals.
            </h2>
            <p className="max-w-prose text-body text-ink-700">
              Manufacturing, IT, HEMM, Healthcare Products, Skill Development, and Civil & Construction — sharing one engineering-led approach to capability, quality and long-term value.
            </p>
            <ArrowLink to="/about">More about Nova Ventures</ArrowLink>
          </motion.div>
        </div>
      </section>

      {/* 04 Our Business Universe */}
      <section className="bg-sand-50 py-20 sm:py-28">
        <div className="container-nova">
          <SectionHeading eyebrow="Our Business Universe" title="Six businesses. One company." action={<ArrowLink to="/businesses">View all businesses</ArrowLink>} />
          <div className="mt-14 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {businesses.map((b, i) => (
              <motion.div
                key={b.id}
                initial={prefersReduced ? { opacity: 1 } : { opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.12 }}
                transition={{ duration: 0.75, delay: prefersReduced ? 0 : i * 0.09, ease: EDITORIAL_EASE }}
              >
                <Link to={`/businesses/${b.id}`} className="group flex flex-col gap-4 rounded-3xl p-1 transition-transform duration-300 ease-editorial">
                  <div className="overflow-hidden rounded-2xl">
                    <div className="transition-transform duration-500 ease-editorial group-hover:scale-[1.03]">
                      <SiteImage id={imageIdForBusiness(b.id)} sizes="(min-width: 1024px) 30vw, (min-width: 640px) 50vw, 100vw" />
                    </div>
                  </div>
                  <div className="flex items-start justify-between gap-3 pt-2">
                    <div className="transition-transform duration-300 ease-editorial group-hover:translate-x-1">
                      <span className="font-display text-eyebrow font-bold text-ember-700">{b.index}</span>
                      <h3 className="mt-1 text-h4 font-semibold text-graphite-900 transition-colors duration-300 group-hover:text-ember-700">{b.shortName}</h3>
                      <p className="mt-1 text-small text-ink-500">{b.tagline}</p>
                    </div>
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 18 18"
                      fill="none"
                      className="mt-1 shrink-0 text-graphite-900 transition-all duration-300 ease-editorial group-hover:translate-x-1.5 group-hover:text-ember-700"
                      aria-hidden="true"
                    >
                      <path d="M3 9H15M15 9L10 4M15 9L10 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 06 Nova Ecosystem */}
      <section className="bg-sand-50 py-20 sm:py-28">
        <div className="container-nova">
          <SectionHeading eyebrow="Nova Ecosystem" title="Six businesses, connected at the centre." align="center" />
          <div className="mt-16">
            <Ecosystem />
          </div>
        </div>
      </section>

      {/* 07 Engineering + Technology signature section */}
      <section className="bg-graphite-950 py-20 text-white sm:py-28">
        <div className="container-nova grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-16">
          <h2 className="text-h2 font-semibold text-white">
            From machines
            <br />
            to intelligence.
          </h2>
          <p className="max-w-prose text-lead text-white/70 lg:self-end">
            Engineering gives Nova Ventures physical capability through manufacturing, fabrication and heavy equipment. Technology extends that capability through software, AI and connected systems.
          </p>
        </div>
      </section>

      {/* 08 Capabilities teaser */}
      <section className="py-20 sm:py-28">
        <div className="container-nova grid grid-cols-1 gap-10 lg:grid-cols-2 lg:items-center lg:gap-20">
          <div>
            <Eyebrow>Capabilities</Eyebrow>
            <h2 className="mt-6 text-h2 font-semibold text-graphite-900">Four capabilities. One connected approach.</h2>
            <p className="mt-6 max-w-prose text-body text-ink-700">
              From precision machining and CAD/CAM to AI, cloud, cybersecurity, HEMM diagnostics and hydraulics, Nova Ventures brings practical capabilities together across its business verticals.
            </p>
            <div className="mt-8">
              <ArrowLink to="/capabilities">See all capabilities</ArrowLink>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 sm:gap-6">
            {capabilityGroups.map((group, i) => (
              <motion.div
                key={group.id}
                initial={prefersReduced ? { opacity: 1 } : { opacity: 0, x: i % 2 === 0 ? -22 : 22 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.75, delay: prefersReduced ? 0 : Math.floor(i / 2) * 0.12, ease: EDITORIAL_EASE }}
                className="group rounded-3xl border border-graphite-900/10 bg-white p-5 shadow-soft transition-all duration-300 ease-editorial hover:border-ember/40 sm:p-6"
              >
                <h3 className="text-h4 font-semibold text-graphite-900 transition-colors duration-300 group-hover:text-ember-700">{group.title}</h3>
                <p className="mt-2 text-small text-ink-500">{group.blurb}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 09 Innovation teaser */}
      <section className="bg-sand-50 py-20 sm:py-28">
        <div className="container-nova grid grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:gap-20">
          <motion.div
            initial={prefersReduced ? { opacity: 1 } : { opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.8, ease: EDITORIAL_EASE }}
          >
            <Eyebrow>Innovation</Eyebrow>
            <h2 className="mt-6 text-h2 font-semibold text-graphite-900">Technology that moves beyond the expected.</h2>
            <p className="mt-6 max-w-prose text-body text-ink-700">
              Nova Ventures works across AI, machine learning, robotics, automation, IoT, data, cloud and cybersecurity to build practical digital solutions.
            </p>
            <div className="mt-8">
              <ArrowLink to="/innovation">Explore innovation</ArrowLink>
            </div>
          </motion.div>
          <SiteImage id="technology-hero" sizes="(min-width: 1024px) 48vw, 100vw" />
        </div>
      </section>

      {/* 11 Future vision */}
      <section className="bg-graphite-950 py-20 text-white sm:py-28">
        <div className="container-nova grid grid-cols-1 gap-10 lg:grid-cols-2 lg:items-center lg:gap-16">
          <motion.div
            initial={prefersReduced ? { opacity: 1 } : { opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.85, ease: EDITORIAL_EASE }}
          >
            <span className="inline-flex items-center gap-2 rounded-full border border-ember/50 px-4 py-1.5 text-eyebrow font-bold uppercase text-ember">Future Vision</span>
            <h2 className="mt-8 max-w-xl text-h2 font-semibold text-white">
              An Integrated Manufacturing, Technology &amp; Skill Development Hub in Bilaspur.
            </h2>
            <p className="mt-6 max-w-prose text-body text-white/70">
              A proposed campus bringing manufacturing, technology and skill development together in one connected environment.
            </p>
          </motion.div>
          <SiteImage id="future-vision-hub" sizes="(min-width: 1024px) 48vw, 100vw" overlay={false} />
        </div>
      </section>

      {/* 12 Careers */}
      <section className="py-20 sm:py-28">
        <div className="container-nova flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <Eyebrow>Careers</Eyebrow>
            <h2 className="mt-6 text-h2 font-semibold text-graphite-900">Build what comes next.</h2>
            <p className="mt-4 max-w-prose text-body text-ink-700">Jobs and internships across six businesses. Apply online in five minutes.</p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <CTAButton to="/careers/apply">Apply now</CTAButton>
            <CTAButton to="/careers" variant="ghost">
              View Careers
            </CTAButton>
          </div>
        </div>
      </section>

      {/* 13 News teaser */}
      <section className="bg-sand-50 py-16 sm:py-20">
        <div className="container-nova flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <Eyebrow>News &amp; Updates</Eyebrow>
            <p className="mt-4 max-w-md text-small text-ink-500">
              {newsItems.length === 0 ? 'Nothing published yet. This space is ready for company news as it happens.' : 'The latest from Nova Ventures.'}
            </p>
          </div>
          <ArrowLink to="/news">Visit News &amp; Updates</ArrowLink>
        </div>
      </section>

      {/* 14 Final CTA */}
      <CtaBand title="Let’s build something meaningful, together." to="/contact" label="Start a Conversation" />
    </>
  )
}
