import { PageHero } from '../components/Ui'
import { company } from '../data/site'
import { Seo } from '../lib/head'

const updated = '10 September 2026'

export default function Privacy() {
  return (
    <>
      <Seo title="Privacy Policy" description="How Nova Ventures handles personal information submitted through this website, including job and internship applications." path="/privacy" />
      <PageHero eyebrow="Privacy" title="Privacy policy." lead={`Last updated ${updated}. This notice explains what happens to the information you share with ${company.legalName} through this website.`} />

      <section className="py-16 sm:py-24">
        <div className="container-nova">
          <div className="prose-nova mx-auto max-w-prose text-body text-ink-700 [&_h2]:mt-12 [&_h2]:text-h3 [&_h2]:font-semibold [&_h2]:text-graphite-900 [&_h2:first-child]:mt-0 [&_p]:mt-4 [&_ul]:mt-4 [&_ul]:list-disc [&_ul]:space-y-2 [&_ul]:pl-6">
            <h2>1. Who we are</h2>
            <p>
              {company.legalName} (“Nova Ventures”, “we”) is registered in {company.registeredState}, {company.country}. For anything in this notice, write to{' '}
              <a href={`mailto:${company.email}`} className="font-semibold text-ember-700">
                {company.email}
              </a>
              .
            </p>

            <h2>2. What we collect</h2>
            <ul>
              <li>
                <strong>Contact enquiries:</strong> your name, e-mail address, optional phone and organisation, the category you choose and your message.
              </li>
              <li>
                <strong>Job and internship applications:</strong> the details you enter in the application form (identity and contact details, education, experience, skills, availability), your CV and, if you provide one, a cover letter.
              </li>
              <li>
                <strong>Technical data:</strong> the API applies rate limits using your IP address. The IP address may also be included in the internal submission email for abuse investigation. We do not run analytics or advertising trackers and we set no marketing cookies.
              </li>
            </ul>

            <h2>3. Why we use it</h2>
            <p>
              To answer your enquiry, to assess your application for current or future roles at any Nova Ventures business, and to protect the website from abuse. We rely on your consent (given when you tick the box on a form) and on our legitimate interest in running a recruitment process.
            </p>

            <h2>4. Where it goes</h2>
            <p>
              Form submissions are sent through the website mail service using codekraft.hub@gmail.com to Nova Ventures’ configured enquiry or careers inbox. The default inbox is {company.email}. Email and hosting providers process this information to deliver the service. Submissions are handled by people involved in the relevant enquiry or recruitment. We do not sell or share your information with third parties for their own purposes.
            </p>

            <h2>5. How long we keep it</h2>
            <p>
              Enquiries are kept for as long as needed to resolve them. Applications are retained for up to twelve months so we can consider you for other openings, unless you ask us to delete them sooner.
            </p>

            <h2>6. Your rights</h2>
            <p>
              You may ask to access, correct or delete the personal information we hold about you, or withdraw consent, by e-mailing {company.email}. We will respond within a reasonable period and in line with the Digital Personal Data Protection Act, 2023 and other applicable Indian law.
            </p>

            <h2>7. Security</h2>
            <p>
              The website is served over HTTPS with a strict content-security policy. Uploaded documents are checked for type and size before they are accepted, and are transmitted directly to our mailbox rather than stored on the web server.
            </p>

            <h2>8. Changes</h2>
            <p>We may update this notice from time to time. The date at the top tells you when it last changed.</p>
          </div>
        </div>
      </section>
    </>
  )
}
