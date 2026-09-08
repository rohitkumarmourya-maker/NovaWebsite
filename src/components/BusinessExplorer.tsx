import { useState } from 'react'
import { Link } from 'react-router-dom'
import { businesses, imageIdForBusiness } from '../data/businesses'
import SiteImage from './SiteImage'

export default function BusinessExplorer() {
  const [activeId, setActiveId] = useState(businesses[0].id)
  const active = businesses.find((b) => b.id === activeId) ?? businesses[0]

  return (
    <>
      {/* Desktop: list + panel */}
      <div className="hidden lg:grid lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:gap-16">
        <ul className="flex flex-col" role="tablist" aria-label="Explore Nova Ventures businesses">
          {businesses.map((b) => {
            const selected = activeId === b.id
            return (
              <li key={b.id} className="border-t border-graphite-900/10 last:border-b">
                <button
                  type="button"
                  role="tab"
                  id={`explorer-tab-${b.id}`}
                  aria-selected={selected}
                  aria-controls="explorer-panel"
                  tabIndex={selected ? 0 : -1}
                  onClick={() => setActiveId(b.id)}
                  onFocus={() => setActiveId(b.id)}
                  onKeyDown={(e) => {
                    const i = businesses.findIndex((x) => x.id === b.id)
                    if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
                      e.preventDefault()
                      const next = businesses[(i + 1) % businesses.length]
                      document.getElementById(`explorer-tab-${next.id}`)?.focus()
                    }
                    if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
                      e.preventDefault()
                      const prev = businesses[(i - 1 + businesses.length) % businesses.length]
                      document.getElementById(`explorer-tab-${prev.id}`)?.focus()
                    }
                  }}
                  className={`flex w-full items-center gap-5 py-5 text-left transition-colors ${
                    selected ? 'text-graphite-900' : 'text-ink-500 hover:text-graphite-900'
                  }`}
                >
                  <span className={`font-display text-small font-bold ${selected ? 'text-ember-700' : 'text-ink-400'}`}>
                    {b.index}
                  </span>
                  <span className="font-display text-h3 font-semibold">{b.shortName}</span>
                  <span
                    className={`ml-auto h-1.5 w-1.5 rounded-full bg-ember transition-opacity ${selected ? 'opacity-100' : 'opacity-0'}`}
                    aria-hidden="true"
                  />
                </button>
              </li>
            )
          })}
        </ul>

        <div
          key={active.id}
          id="explorer-panel"
          role="tabpanel"
          aria-labelledby={`explorer-tab-${active.id}`}
          className="animate-[fadeIn_0.4s_ease] rounded-3xl bg-white p-6 shadow-soft"
        >
          <SiteImage id={imageIdForBusiness(active.id)} sizes="(min-width: 1024px) 45vw, 100vw" />
          <h3 className="mt-7 text-h3 font-semibold text-graphite-900">{active.name}</h3>
          <p className="mt-3 text-body text-ink-700">{active.summary}</p>
          <ul className="mt-5 flex flex-wrap gap-2">
            {active.capabilities.slice(0, 4).map((c) => (
              <li key={c} className="rounded-full border border-graphite-900/15 px-3 py-1 text-eyebrow normal-case tracking-normal text-ink-700">
                {c}
              </li>
            ))}
          </ul>
          <Link
            to={`/businesses/${active.id}`}
            className="mt-7 inline-flex min-h-11 items-center gap-2 text-small font-semibold text-graphite-900 hover:text-ember-700"
          >
            Explore {active.shortName}
            <span aria-hidden="true">&rarr;</span>
          </Link>
        </div>
      </div>

      {/* Mobile / tablet: accordion, no hover dependency */}
      <div className="flex flex-col divide-y divide-graphite-900/10 border-y border-graphite-900/10 lg:hidden">
        {businesses.map((b) => {
          const open = activeId === b.id
          return (
            <div key={b.id}>
              <button
                type="button"
                className="flex min-h-14 w-full items-center justify-between gap-4 py-4 text-left"
                aria-expanded={open}
                aria-controls={`explorer-acc-${b.id}`}
                onClick={() => setActiveId(open ? '' : b.id)}
              >
                <span className="flex items-center gap-4">
                  <span className={`font-display text-small font-bold ${open ? 'text-ember-700' : 'text-ink-400'}`}>{b.index}</span>
                  <span className="font-display text-h4 font-semibold text-graphite-900">{b.shortName}</span>
                </span>
                <svg
                  width="14"
                  height="8"
                  viewBox="0 0 14 8"
                  fill="none"
                  className={`shrink-0 text-graphite-900 transition-transform duration-300 ${open ? 'rotate-180' : ''}`}
                  aria-hidden="true"
                >
                  <path d="M1 1L7 7L13 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </button>
              <div
                id={`explorer-acc-${b.id}`}
                className={`grid overflow-hidden transition-[grid-template-rows] duration-300 ease-editorial ${
                  open ? 'grid-rows-[1fr] pb-6' : 'grid-rows-[0fr]'
                }`}
              >
                <div className="min-h-0">
                  <SiteImage id={imageIdForBusiness(b.id)} sizes="100vw" />
                  <p className="mt-4 text-body text-ink-700">{b.summary}</p>
                  <Link
                    to={`/businesses/${b.id}`}
                    tabIndex={open ? 0 : -1}
                    className="mt-4 inline-flex min-h-11 items-center gap-2 text-small font-semibold text-graphite-900"
                  >
                    Explore {b.shortName}
                    <span aria-hidden="true">&rarr;</span>
                  </Link>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </>
  )
}
