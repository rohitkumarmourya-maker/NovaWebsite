import { Link } from 'react-router-dom'
import { PageHero } from '../components/Ui'
import { company } from '../data/site'
import { Seo, breadcrumbJsonLd } from '../lib/head'

const terms = [
  { id: 'website', title: 'Website and services', text: 'This website provides information about Nova Ventures and a way to contact us or apply for roles. Descriptions of capabilities are general information. A quotation, purchase order, employment offer or service engagement takes effect only through a separate agreement confirmed by the relevant parties.' },
  { id: 'use', title: 'Acceptable use', text: 'Use this website lawfully and provide accurate information when contacting us. Do not impersonate another person, submit material you are not entitled to share, interfere with the website, attempt unauthorized access or upload malicious files.' },
  { id: 'applications', title: 'Enquiries and applications', text: 'Sending an enquiry or application does not create a contract, guarantee a response within a particular time, or promise an interview or employment. You remain responsible for the accuracy of submitted information. Submit only documents relevant to the enquiry or recruitment process.' },
  { id: 'ownership', title: 'Intellectual property', text: 'Website content, branding and original materials belong to Nova Ventures or their respective owners. You may view and share links to public pages for legitimate purposes. Reproducing branding or substantial website content for commercial use requires permission from the relevant rights holder.' },
  { id: 'information', title: 'Information and external links', text: 'We aim to keep the website accurate and current, but content, opportunities and service availability may change. Images may be illustrative. External links are provided for convenience and are governed by the terms and privacy practices of the destination website.' },
  { id: 'availability', title: 'Availability and responsibility', text: 'We may maintain, update, restrict or suspend parts of the website. We do not guarantee uninterrupted availability. To the extent permitted by applicable law, Nova Ventures is not responsible for indirect losses arising from reliance on general website information. Nothing in these terms excludes rights or liabilities that cannot lawfully be excluded.' },
  { id: 'law', title: 'Applicable law', text: 'These website terms are governed by the laws of India. Disputes are subject to the courts with jurisdiction under applicable law. Separate signed agreements may contain terms for a specific engagement.' },
  { id: 'changes', title: 'Changes to these terms', text: 'We may update these terms when the website or our practices change. The date shown above identifies the current version. Review the terms when you use the website.' },
]

export default function TermsOfService() {
  return (
    <>
      <Seo title="Terms of Service" description="Terms governing use of the Nova Ventures website, enquiries and career applications." path="/terms-of-service" jsonLd={[breadcrumbJsonLd([{ name: 'Home', path: '/' }, { name: 'Terms of Service', path: '/terms-of-service' }])]} />
      <PageHero eyebrow="Legal" title="Terms of Service" lead="Last updated: 10 September 2026. These terms explain how you may use the Nova Ventures website." />
      <section className="py-16 sm:py-24">
        <div className="container-nova grid gap-12 lg:grid-cols-[1fr_2fr] lg:gap-20">
          <nav aria-label="On this page" className="lg:sticky lg:top-28 lg:self-start">
            <h2 className="text-h4 font-semibold">On this page</h2>
            <ol className="mt-5 space-y-2">{terms.map((term, index) => <li key={term.id}><a href={`#${term.id}`} className="inline-flex min-h-11 items-center text-small text-ink-700 hover:text-ember-700">{index + 1}. {term.title}</a></li>)}</ol>
          </nav>
          <div className="max-w-prose text-body text-ink-700">
            <p>This website is operated by {company.legalName}, registered in {company.registeredState}, {company.country}. By using the website, you agree to these terms.</p>
            {terms.map((term, index) => <section key={term.id} id={term.id} className="mt-10 scroll-mt-28"><h2 className="text-h3 font-semibold text-graphite-900">{index + 1}. {term.title}</h2><p className="mt-4">{term.text}</p></section>)}
            <section className="mt-10"><h2 className="text-h3 font-semibold text-graphite-900">Privacy and contact</h2><p className="mt-4">Our <Link to="/privacy" className="font-semibold text-ember-700 underline underline-offset-4">Privacy Policy</Link> explains how form submissions are handled. For questions about these terms, contact <a href={`mailto:${company.email}`} className="break-words font-semibold text-ember-700 underline underline-offset-4">{company.email}</a>.</p></section>
          </div>
        </div>
      </section>
    </>
  )
}
