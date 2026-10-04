import { Link } from 'react-router-dom'
import { motion, useReducedMotion } from 'motion/react'
import { businesses } from '../data/businesses'
import { company } from '../data/site'
import { EDITORIAL_EASE } from './motion/MotionPrimitives'

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
  const prefersReduced = useReducedMotion()

  return (
    <footer className="bg-graphite-950 text-white/70">
      <div className="container-nova grid grid-cols-1 gap-12 py-16 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1.2fr] lg:py-20">
        <motion.div
          initial={prefersReduced ? { opacity: 1 } : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{ duration: 0.7, ease: EDITORIAL_EASE }}
          className="sm:col-span-2 lg:col-span-1"
        >
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
        </motion.div>

        <motion.nav
          initial={prefersReduced ? { opacity: 1 } : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{ duration: 0.7, delay: prefersReduced ? 0 : 0.08, ease: EDITORIAL_EASE }}
          aria-label="Footer: businesses"
        >
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
        </motion.nav>

        <motion.nav
          initial={prefersReduced ? { opacity: 1 } : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{ duration: 0.7, delay: prefersReduced ? 0 : 0.16, ease: EDITORIAL_EASE }}
          aria-label="Footer: company"
        >
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
        </motion.nav>

        <motion.div
          initial={prefersReduced ? { opacity: 1 } : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{ duration: 0.7, delay: prefersReduced ? 0 : 0.24, ease: EDITORIAL_EASE }}
        >
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

          <div className="mt-6">
            <a
              href="https://q.me-qr.com/nbzy9z1h"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Scan or tap to open Nova Ventures office location in Google Maps"
              className="group inline-flex items-center gap-3.5 rounded-2xl border border-white/10 bg-white/[0.04] p-2.5 transition-colors hover:border-ember/40 hover:bg-white/[0.08]"
            >
              <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-white p-1.5 shadow-sm">
                <picture>
                  <source type="image/webp" srcSet="/images/office-location-qr.webp" />
                  <img
                    src="/images/office-location-qr.png"
                    alt="Nova Ventures office location QR code"
                    width={80}
                    height={80}
                    className="h-full w-full object-contain"
                    loading="lazy"
                  />
                </picture>
              </div>
              <div className="flex flex-col pr-2">
                <span className="text-eyebrow font-bold uppercase tracking-wider text-ember">Location</span>
                <span className="mt-0.5 text-small font-medium text-white transition-colors group-hover:text-ember">
                  Scan for Directions
                </span>
                <span className="mt-0.5 inline-flex items-center gap-1 text-[11px] text-white/50 transition-colors group-hover:text-white/80">
                  <span>Open in Maps</span>
                  <span className="transition-transform duration-300 ease-editorial group-hover:translate-x-0.5" aria-hidden="true">&rarr;</span>
                </span>
              </div>
            </a>
          </div>
        </motion.div>
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
