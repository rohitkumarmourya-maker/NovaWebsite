import { Link } from 'react-router-dom'
import { businesses } from '../data/businesses'

// Positions around a circle for the desktop diagram, in degrees (0 = top, clockwise)
const angleStep = 360 / businesses.length

export default function Ecosystem() {
  return (
    <>
      {/* Desktop: radial connected diagram */}
      <div className="relative mx-auto hidden aspect-square w-full max-w-2xl lg:block">
        <svg viewBox="0 0 600 600" className="absolute inset-0 h-full w-full" aria-hidden="true">
          <circle cx="300" cy="300" r="220" fill="none" stroke="currentColor" strokeWidth="1" className="text-graphite-900/10" strokeDasharray="4 8" />
          {businesses.map((_, i) => {
            const angle = ((angleStep * i - 90) * Math.PI) / 180
            const x = 300 + Math.cos(angle) * 220
            const y = 300 + Math.sin(angle) * 220
            return (
              <line key={i} x1="300" y1="300" x2={x} y2={y} stroke="currentColor" strokeWidth="1" className="text-ember/60" />
            )
          })}
        </svg>

        <div className="absolute left-1/2 top-1/2 flex h-36 w-36 -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center rounded-full bg-graphite-900 text-center text-white shadow-lift">
          <img src="/logos/nova-mark.png" alt="" width={36} height={36} className="mb-1.5 h-9 w-9 object-contain" loading="lazy" />
          <span className="font-display text-eyebrow font-extrabold leading-tight tracking-wide2">
            NOVA
            <br />
            VENTURES
          </span>
        </div>

        {businesses.map((b, i) => {
          const angle = ((angleStep * i - 90) * Math.PI) / 180
          const x = 50 + Math.cos(angle) * 36.6
          const y = 50 + Math.sin(angle) * 36.6
          return (
            <Link
              key={b.id}
              to={`/businesses/${b.id}`}
              className="group absolute flex w-40 -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-2 text-center"
              style={{ left: `${x}%`, top: `${y}%` }}
            >
              <span className="flex h-14 w-14 items-center justify-center rounded-full border border-graphite-900/15 bg-white font-display text-small font-bold text-graphite-900 shadow-soft transition-all group-hover:border-ember group-hover:bg-ember group-hover:text-graphite-900">
                {b.index}
              </span>
              <span className="text-eyebrow font-semibold normal-case tracking-normal text-ink-700 group-hover:text-graphite-900">
                {b.shortName}
              </span>
            </Link>
          )
        })}
      </div>

      {/* Mobile / tablet: vertical connected sequence */}
      <div className="flex flex-col items-center lg:hidden">
        <span className="flex h-16 w-full max-w-[200px] items-center justify-center gap-2 rounded-full bg-graphite-900 text-center font-display text-small font-extrabold tracking-wide2 text-white">
          <img src="/logos/nova-mark.png" alt="" width={24} height={24} className="h-6 w-6 object-contain" loading="lazy" />
          NOVA VENTURES
        </span>
        <div className="flex w-full flex-col items-center">
          {businesses.map((b) => (
            <div key={b.id} className="flex w-full flex-col items-center">
              <span className="h-8 w-px bg-ember/60" aria-hidden="true" />
              <Link
                to={`/businesses/${b.id}`}
                className="flex min-h-12 w-full max-w-xs items-center gap-3 rounded-full border border-graphite-900/15 bg-white px-5 py-3 transition-colors hover:border-ember"
              >
                <span className="font-display text-eyebrow font-bold text-ember-700">{b.index}</span>
                <span className="text-small font-semibold text-graphite-900">{b.shortName}</span>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}
