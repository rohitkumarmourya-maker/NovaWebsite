import { useEffect, useRef, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { businesses } from '../data/businesses'
import { company, navLinks } from '../data/site'

const chevron = (open: boolean, size = 10) => (
  <svg
    width={size}
    height={size * 0.6}
    viewBox="0 0 10 6"
    fill="none"
    className={`shrink-0 transition-transform duration-300 ${open ? 'rotate-180' : ''}`}
    aria-hidden="true"
  >
    <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
)

export default function Header() {
  const [scrolled, setScrolled] = useState(false)
  const [megaOpen, setMegaOpen] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [mobileBizOpen, setMobileBizOpen] = useState(false)
  const location = useLocation()
  const megaId = 'mega-menu'
  const mobileId = 'mobile-menu'
  const closeTimer = useRef<number | null>(null)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Close everything on navigation.
  useEffect(() => {
    setMobileOpen(false)
    setMegaOpen(false)
    setMobileBizOpen(false)
  }, [location.pathname, location.hash])

  // Lock page scroll while the mobile menu is open.
  useEffect(() => {
    document.documentElement.style.overflow = mobileOpen ? 'hidden' : ''
    return () => {
      document.documentElement.style.overflow = ''
    }
  }, [mobileOpen])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setMegaOpen(false)
        setMobileOpen(false)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  // Close the desktop menu when the window is resized to a mobile layout, and vice versa.
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 1024px)')
    const onChange = () => {
      if (mq.matches) setMobileOpen(false)
      else setMegaOpen(false)
    }
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  const openMega = () => {
    if (closeTimer.current) window.clearTimeout(closeTimer.current)
    setMegaOpen(true)
  }
  const scheduleCloseMega = () => {
    if (closeTimer.current) window.clearTimeout(closeTimer.current)
    closeTimer.current = window.setTimeout(() => setMegaOpen(false), 160)
  }

  const isBusinessRoute = location.pathname.startsWith('/businesses')

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50 pt-3 sm:pt-4" onMouseLeave={scheduleCloseMega}>
        <div className="container-nova">
          <div
            className={`relative flex h-14 items-center justify-between rounded-full border border-graphite-900/10 bg-white/90 px-3 backdrop-blur-md transition-shadow duration-300 ease-editorial sm:h-16 sm:px-5 ${
              scrolled ? 'shadow-pill' : 'shadow-soft'
            }`}
          >
            <Link to="/" className="flex min-w-0 items-center gap-2.5 rounded-full py-1 pr-2" aria-label="Nova Ventures home">
              <img
                src="/logos/nova-mark.png"
                alt=""
                width={40}
                height={40}
                className="h-9 w-9 shrink-0 object-contain sm:h-10 sm:w-10"
                decoding="async"
              />
              <span className="font-display text-[15px] font-extrabold tracking-tight text-graphite-900 sm:text-base">
                NOVA VENTURES
              </span>
            </Link>

            <nav className="hidden items-center gap-1 lg:flex" aria-label="Primary">
              {navLinks.map((link) =>
                link.label === 'Businesses' ? (
                  <div key={link.to} onMouseEnter={openMega} className="relative">
                    <button
                      type="button"
                      className={`flex min-h-10 items-center gap-1.5 rounded-full px-3 text-small font-medium transition-colors hover:text-ember-700 ${
                        isBusinessRoute || megaOpen ? 'text-ember-700' : 'text-ink-900'
                      }`}
                      aria-expanded={megaOpen}
                      aria-controls={megaId}
                      onClick={() => setMegaOpen((v) => !v)}
                    >
                      Businesses
                      {chevron(megaOpen)}
                    </button>
                  </div>
                ) : (
                  <NavLink
                    key={link.to}
                    to={link.to}
                    className={({ isActive }) =>
                      `flex min-h-10 items-center rounded-full px-3 text-small font-medium transition-colors hover:text-ember-700 ${
                        isActive ? 'text-ember-700' : 'text-ink-900'
                      }`
                    }
                  >
                    {link.label}
                  </NavLink>
                ),
              )}
            </nav>

            <div className="hidden lg:block">
              <Link
                to="/contact"
                className="inline-flex min-h-10 items-center gap-2 rounded-full bg-graphite-900 px-5 py-2 text-small font-semibold text-white transition-colors duration-300 hover:bg-ember-700"
              >
                Start a Conversation
                <span aria-hidden="true">&rarr;</span>
              </Link>
            </div>

            <button
              type="button"
              className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-graphite-900 transition-colors hover:bg-sand-50 active:bg-sand-100 lg:hidden"
              aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={mobileOpen}
              aria-controls={mobileId}
              onClick={() => setMobileOpen((v) => !v)}
            >
              {mobileOpen ? (
                <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden="true">
                  <path d="M4 4L18 18M18 4L4 18" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                </svg>
              ) : (
                <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden="true">
                  <path d="M3 6H19M3 11H19M3 16H19" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                </svg>
              )}
            </button>

            {/* Desktop mega menu */}
            <div
              id={megaId}
              onMouseEnter={openMega}
              className={`absolute inset-x-0 top-full z-40 mt-3 hidden origin-top rounded-3xl border border-graphite-900/10 bg-white p-8 shadow-lift transition-all duration-300 ease-editorial lg:block ${
                megaOpen ? 'pointer-events-auto translate-y-0 opacity-100' : 'pointer-events-none -translate-y-2 opacity-0'
              }`}
              aria-hidden={!megaOpen}
            >
              <div className="grid grid-cols-3 gap-x-8 gap-y-2">
                <p className="col-span-3 mb-3 text-eyebrow font-bold uppercase text-ember-700">Our Businesses</p>
                {businesses.map((b) => (
                  <Link
                    key={b.id}
                    to={`/businesses/${b.id}`}
                    tabIndex={megaOpen ? 0 : -1}
                    className="group flex items-start gap-4 rounded-2xl p-3 transition-colors hover:bg-sand-50"
                  >
                    <span className="mt-0.5 font-display text-small font-bold text-ember-700">{b.index}</span>
                    <span>
                      <span className="block font-display text-body font-semibold text-graphite-900 group-hover:text-ember-700">
                        {b.shortName}
                      </span>
                      <span className="mt-1 block text-small text-ink-500">{b.menuTags}</span>
                    </span>
                  </Link>
                ))}
                <Link
                  to="/businesses"
                  tabIndex={megaOpen ? 0 : -1}
                  className="col-span-3 mt-4 inline-flex items-center gap-2 border-t border-graphite-900/10 pt-5 text-small font-semibold text-graphite-900 hover:text-ember-700"
                >
                  View all businesses <span aria-hidden="true">&rarr;</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile full-screen navigation */}
      <div
        id={mobileId}
        className={`fixed inset-0 z-40 overflow-y-auto overscroll-contain bg-paper pt-20 transition-opacity duration-300 ease-editorial sm:pt-24 lg:hidden ${
          mobileOpen ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'
        }`}
        aria-hidden={!mobileOpen}
      >
        <nav className="container-nova flex min-h-full flex-col pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-4" aria-label="Mobile">
          {navLinks.map((link) =>
            link.label === 'Businesses' ? (
              <div key={link.to} className="border-b border-graphite-900/10">
                <button
                  type="button"
                  className="flex min-h-14 w-full items-center justify-between py-3 text-left font-display text-h4 font-semibold text-graphite-900"
                  aria-expanded={mobileBizOpen}
                  onClick={() => setMobileBizOpen((v) => !v)}
                  tabIndex={mobileOpen ? 0 : -1}
                >
                  Businesses
                  {chevron(mobileBizOpen, 14)}
                </button>
                <div
                  className={`grid overflow-hidden transition-[grid-template-rows] duration-300 ease-editorial ${
                    mobileBizOpen ? 'grid-rows-[1fr] pb-3' : 'grid-rows-[0fr]'
                  }`}
                >
                  <div className="min-h-0">
                    {businesses.map((b) => (
                      <Link
                        key={b.id}
                        to={`/businesses/${b.id}`}
                        tabIndex={mobileOpen && mobileBizOpen ? 0 : -1}
                        className="flex min-h-12 items-center gap-3 rounded-xl px-2 py-2 text-body text-ink-700 transition-colors hover:bg-sand-50 active:bg-sand-100"
                      >
                        <span className="font-display text-eyebrow font-bold text-ember-700">{b.index}</span>
                        {b.shortName}
                      </Link>
                    ))}
                    <Link
                      to="/businesses"
                      tabIndex={mobileOpen && mobileBizOpen ? 0 : -1}
                      className="flex min-h-12 items-center px-2 py-2 text-small font-semibold text-graphite-900"
                    >
                      View all businesses <span aria-hidden="true">&nbsp;&rarr;</span>
                    </Link>
                  </div>
                </div>
              </div>
            ) : (
              <NavLink
                key={link.to}
                to={link.to}
                tabIndex={mobileOpen ? 0 : -1}
                className={({ isActive }) =>
                  `flex min-h-14 items-center border-b border-graphite-900/10 py-3 font-display text-h4 font-semibold transition-colors ${
                    isActive ? 'text-ember-700' : 'text-graphite-900'
                  }`
                }
              >
                {link.label}
              </NavLink>
            ),
          )}
          <Link
            to="/careers/apply"
            tabIndex={mobileOpen ? 0 : -1}
            className="mt-2 flex min-h-12 items-center text-small font-semibold text-ember-700"
          >
            Apply for a job or internship <span aria-hidden="true">&nbsp;&rarr;</span>
          </Link>
          <div className="mt-auto flex flex-col gap-4 pt-8">
            <Link
              to="/contact"
              tabIndex={mobileOpen ? 0 : -1}
              className="inline-flex min-h-14 items-center justify-center gap-2 rounded-full bg-graphite-900 px-6 text-body font-semibold text-white transition-colors hover:bg-ember-700"
            >
              Start a Conversation &rarr;
            </Link>
            <a
              href={`mailto:${company.email}`}
              tabIndex={mobileOpen ? 0 : -1}
              className="text-center text-small text-ink-500 underline-offset-4 hover:underline"
            >
              {company.email}
            </a>
          </div>
        </nav>
      </div>
    </>
  )
}
