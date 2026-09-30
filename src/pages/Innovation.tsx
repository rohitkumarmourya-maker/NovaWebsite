import { motion, useReducedMotion } from 'motion/react'
import CaseStudies from '../components/CaseStudies'
import SiteImage from '../components/SiteImage'
import { CtaBand, Eyebrow, PageHero } from '../components/Ui'
import { Seo, breadcrumbJsonLd } from '../lib/head'
import { EDITORIAL_EASE } from '../components/motion/MotionPrimitives'

const areas = [
  'Artificial Intelligence & Machine Learning',
  'Automation & Robotics',
  'Internet of Things (IoT)',
  'Blockchain',
  'Augmented & Virtual Reality',
  'Data Analytics & Business Intelligence',
  'Cloud Computing (IaaS / PaaS / SaaS)',
  'Cybersecurity',
]

export default function Innovation() {
  const prefersReduced = useReducedMotion()

  return (
    <>
      <Seo
        title="Innovation"
        description="Nova Ventures technology capabilities across AI, robotics, automation, IoT, data, cloud and cybersecurity — practical digital products and systems."
        path="/innovation"
        jsonLd={[breadcrumbJsonLd([{ name: 'Home', path: '/' }, { name: 'Innovation', path: '/innovation' }])]}
      />
      <PageHero
        dark
        eyebrow="Innovation"
        title="Technology that moves beyond the expected."
        lead="Nova Ventures brings together modern technologies to build practical digital products, systems and solutions."
      />

      <section className="bg-graphite-950 pb-20 text-white sm:pb-28">
        <div className="container-nova grid grid-cols-1 gap-10 lg:grid-cols-2 lg:items-center lg:gap-16">
          <ul className="grid grid-cols-1 gap-px overflow-hidden rounded-3xl bg-white/10 sm:grid-cols-2">
            {areas.map((a, i) => (
              <motion.li
                key={a}
                initial={prefersReduced ? { opacity: 1 } : { opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.6, delay: prefersReduced ? 0 : i * 0.05, ease: EDITORIAL_EASE }}
                className="group bg-graphite-900 p-6 transition-colors duration-300 hover:bg-graphite-800 sm:p-7"
              >
                <span className="font-display text-eyebrow font-bold text-ember">0{i + 1}</span>
                <p className="mt-2 font-display text-h4 font-semibold leading-snug text-white transition-colors duration-300 group-hover:text-ember">{a}</p>
              </motion.li>
            ))}
          </ul>
          <SiteImage id="technology-hero" priority sizes="(min-width: 1024px) 48vw, 100vw" overlay={false} />
        </div>
      </section>

      <section className="py-20 sm:py-28">
        <div className="container-nova grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-20">
          <motion.div
            initial={prefersReduced ? { opacity: 1 } : { opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.75, ease: EDITORIAL_EASE }}
          >
            <Eyebrow>Research &amp; development</Eyebrow>
            <h2 className="mt-5 text-h2 font-semibold text-graphite-900">Research and technology development</h2>
          </motion.div>
          <motion.div
            initial={prefersReduced ? { opacity: 1 } : { opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.75, delay: prefersReduced ? 0 : 0.1, ease: EDITORIAL_EASE }}
            className="flex max-w-prose flex-col gap-6 text-body text-ink-700"
          >
            <p>
              Nova Ventures explores AI, software, automation, data, cloud and connected technologies with a focus on practical applications and useful outcomes.
            </p>
            <p>
              Technology and skill development work together, helping teams build the digital and technical capabilities needed for modern industry.
            </p>
          </motion.div>
        </div>
      </section>

      <CaseStudies />

      <CtaBand title="Have a technology problem worth solving?" to="/contact" label="Discuss a Technology Requirement" />
    </>
  )
}
