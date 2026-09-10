import CaseStudies from '../components/CaseStudies'
import SiteImage from '../components/SiteImage'
import { CtaBand, Eyebrow, PageHero } from '../components/Ui'
import { Seo, breadcrumbJsonLd } from '../lib/head'

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
              <li key={a} className="bg-graphite-900 p-6 sm:p-7">
                <span className="font-display text-eyebrow font-bold text-ember">0{i + 1}</span>
                <p className="mt-2 font-display text-h4 font-semibold leading-snug text-white">{a}</p>
              </li>
            ))}
          </ul>
          <SiteImage id="technology-hero" priority sizes="(min-width: 1024px) 48vw, 100vw" overlay={false} />
        </div>
      </section>

      <section className="py-20 sm:py-28">
        <div className="container-nova grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-20">
          <div>
            <Eyebrow>Research &amp; development</Eyebrow>
            <h2 className="mt-5 text-h2 font-semibold text-graphite-900">Research and technology development</h2>
          </div>
          <div className="flex max-w-prose flex-col gap-6 text-body text-ink-700">
            <p>
              Nova Ventures explores AI, software, automation, data, cloud and connected technologies with a focus on practical applications and useful outcomes.
            </p>
            <p>
              Technology and skill development work together, helping teams build the digital and technical capabilities needed for modern industry.
            </p>
          </div>
        </div>
      </section>

      <CaseStudies />

      <CtaBand title="Have a technology problem worth solving?" to="/contact" label="Discuss a Technology Requirement" />
    </>
  )
}
