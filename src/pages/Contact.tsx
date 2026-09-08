import { useState } from 'react'
import { Link } from 'react-router-dom'
import { company, enquiryCategories } from '../data/site'
import { PageHero } from '../components/Ui'
import ContactForm from '../components/forms/ContactForm'
import { Seo, breadcrumbJsonLd } from '../lib/head'

export default function Contact() {
  const [category, setCategory] = useState(enquiryCategories[0])

  return (
    <>
      <Seo
        title="Contact"
        description="Contact Nova Ventures Innovation and Technology Private Limited for manufacturing, software, training, construction, HEMM and healthcare product enquiries."
        path="/contact"
        jsonLd={[breadcrumbJsonLd([{ name: 'Home', path: '/' }, { name: 'Contact', path: '/contact' }])]}
      />
      <PageHero eyebrow="Contact" title="Let’s build something meaningful." lead="Tell us what you are working on. The right business inside Nova Ventures will pick it up." />

      <section className="py-16 sm:py-24">
        <div className="container-nova grid grid-cols-1 gap-12 lg:grid-cols-[1fr_1.3fr] lg:gap-20">
          <div>
            <h2 className="text-h4 font-semibold text-graphite-900">What is your enquiry about?</h2>
            <div className="mt-5 flex flex-wrap gap-2" role="group" aria-label="Enquiry category">
              {enquiryCategories.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setCategory(c)}
                  aria-pressed={category === c}
                  className={`min-h-10 rounded-full border px-4 py-2 text-small font-medium transition-colors ${
                    category === c
                      ? 'border-graphite-900 bg-graphite-900 text-white'
                      : 'border-graphite-900/20 text-ink-700 hover:border-graphite-900'
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>

            <div className="mt-12 rounded-3xl border border-graphite-900/10 bg-white p-6 text-small text-ink-700 shadow-soft">
              <p className="text-eyebrow font-bold uppercase text-ember-700">Write to us</p>
              <a href={`mailto:${company.email}`} className="mt-3 block break-all text-lead font-semibold text-graphite-900 hover:text-ember-700">
                {company.email}
              </a>
              {company.phone && (
                <a href={`tel:${company.phone.replace(/\s+/g, '')}`} className="mt-2 block text-body font-semibold text-graphite-900">
                  {company.phone}
                </a>
              )}
              <p className="mt-6 text-eyebrow font-bold uppercase text-ember-700">Registered office</p>
              <address className="mt-3 not-italic">
                {company.legalName}
                <br />
                {company.address ? `${company.address}, ` : ''}
                {company.registeredState}, {company.country}
              </address>
              <p className="mt-6 text-eyebrow font-bold uppercase text-ember-700">Looking for a job?</p>
              <p className="mt-2">
                Applications go through the{' '}
                <Link to="/careers#apply" className="font-semibold text-graphite-900 underline-offset-4 hover:underline">
                  careers form
                </Link>{' '}
                so nothing gets lost.
              </p>
            </div>
          </div>

          <ContactForm category={category} onCategoryChange={setCategory} />
        </div>
      </section>
    </>
  )
}
