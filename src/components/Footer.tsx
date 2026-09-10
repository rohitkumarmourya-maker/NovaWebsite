import { Link } from 'react-router-dom'
import { businesses } from '../data/businesses'
import { company } from '../data/site'

const companyLinks = [
  { label: 'About', to: '/about' },
  { label: 'Capabilities', to: '/capabilities' },
  { label: 'Innovation', to: '/innovation' },
  { label: 'Careers', to: '/careers' },
  { label: 'Apply for a job / internship', to: '/careers/apply' },
  { label: 'News & Updates', to: '/news' },
  { label: 'Contact', to: '/contact' },
]

export default function Footer() {
  return (
    <footer className="bg-graphite-950 text-white/70">
      <div className="container-nova grid grid-cols-1 gap-12 py-16 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1.2fr] lg:py-20">
        <div className="sm:col-span-2 lg:col-span-1">
          <Link to="/" className="inline-flex items-center gap-2.5">
            <img src="/logos/nova-mark.png" alt="" width={40} height={40} className="h-10 w-10 object-contain" loading="lazy" />
            <span className="font-display text-body font-extrabold tracking-tight text-white">NOVA VENTURES</span>
          </Link>
          <p className="mt-5 max-w-sm text-small leading-relaxed">
            Engineering, technology and enterprise across manufacturing, IT, HEMM, healthcare products, skill development, and civil and construction.
          </p>
          <p className="mt-5 text-small">
            <a href={`mailto:${company.email}`} className="text-white underline-offset-4 transition-colors hover:text-ember hover:underline">
              {company.email}
            </a>
          </p>
          {company.social.length > 0 && (
            <ul className="mt-5 flex flex-wrap gap-4">
              {company.social.map((s) => (
                <li key={s.href}>
                  <a href={s.href} target="_blank" rel="noopener noreferrer" className="text-small text-white/80 hover:text-ember">
                    {s.label}
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>

        <nav aria-label="Footer: businesses">
          <p className="text-eyebrow font-bold uppercase text-ember">Businesses</p>
          <ul className="mt-5 space-y-3">
            {businesses.map((b) => (
              <li key={b.id}>
                <Link to={`/businesses/${b.id}`} className="inline-block py-0.5 text-small transition-colors hover:text-white">
                  {b.shortName}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <nav aria-label="Footer: company">
          <p className="text-eyebrow font-bold uppercase text-ember">Company</p>
          <ul className="mt-5 space-y-3">
            {companyLinks.map((l) => (
              <li key={l.to}>
                <Link to={l.to} className="inline-block py-0.5 text-small transition-colors hover:text-white">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <p className="text-eyebrow font-bold uppercase text-ember">Registered Office</p>
          <address className="mt-5 text-small not-italic leading-relaxed">
            {company.legalName}
            <br />
            {company.registeredState}, {company.country}
            {company.address && (
              <>
                <br />
                {company.address}
              </>
            )}
            {company.phone && (
              <>
                <br />
                <a href={`tel:${company.phone.replace(/\s+/g, '')}`} className="hover:text-white">
                  {company.phone}
                </a>
              </>
            )}
          </address>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container-nova flex flex-col gap-3 py-6 text-eyebrow normal-case tracking-normal text-white/45 sm:flex-row sm:items-center sm:justify-between">
          <p>
            &copy; {new Date().getFullYear()} {company.legalName}. All rights reserved.
          </p>
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
            <Link to="/privacy" className="transition-colors hover:text-white">
              Privacy Policy
            </Link>
            <Link to="/terms-of-service" className="transition-colors hover:text-white">Terms of Service</Link>
            <Link to="/contact" className="transition-colors hover:text-white">
              Contact
            </Link>
            <a href="#main" className="transition-colors hover:text-white">
              Back to top &uarr;
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
