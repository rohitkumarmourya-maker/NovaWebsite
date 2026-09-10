import { capabilityGroups } from '../lib/capabilities-data'
import { CtaBand, PageHero } from '../components/Ui'
import ScrollReveal from '../components/ScrollReveal'
import { Seo, breadcrumbJsonLd } from '../lib/head'

export default function Capabilities() {
  return (
    <>
      <Seo
        title="Capabilities"
        description="Nova Ventures’ engineering, technology, industrial-service and healthcare-product capabilities, organised by discipline: CNC machining, CAD/CAM, AI, cloud, cybersecurity, HEMM, hydraulics and more."
        path="/capabilities"
        jsonLd={[breadcrumbJsonLd([{ name: 'Home', path: '/' }, { name: 'Capabilities', path: '/capabilities' }])]}
      />
      <PageHero eyebrow="Capabilities" title="Engineering, technology, industrial services and healthcare products." lead="Four connected disciplines, with practical services and product expertise in each." />

      <section className="py-16 sm:py-24">
        <div className="container-nova flex flex-col gap-16 sm:gap-20">
          {capabilityGroups.map((group, gi) => (
            <ScrollReveal key={group.title}>
              <div className="grid grid-cols-1 gap-8 border-t border-graphite-900/10 pt-10 lg:grid-cols-[1fr_2fr] lg:gap-16">
                <div>
                  <span className="font-display text-small font-bold text-ember-700">0{gi + 1}</span>
                  <h2 className="mt-3 text-h2 font-semibold text-graphite-900">{group.title}</h2>
                  <p className="mt-3 max-w-sm text-small text-ink-500">{group.blurb}</p>
                </div>
                <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {group.items.map((item) => (
                    <li key={item} className="flex items-center gap-3 rounded-2xl border border-graphite-900/10 bg-white px-5 py-3.5">
                      <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-ember" aria-hidden="true" />
                      <span className="text-body font-medium text-ink-700">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </section>

      <CtaBand title="Have a requirement that spans several capabilities?" to="/contact" label="Start a Conversation" />
    </>
  )
}
