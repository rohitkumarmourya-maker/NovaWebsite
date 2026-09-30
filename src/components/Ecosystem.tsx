import { Link } from 'react-router-dom'
import { motion, useReducedMotion } from 'motion/react'
import { businesses } from '../data/businesses'
import { EDITORIAL_EASE } from './motion/MotionPrimitives'

// Positions around a circle for the desktop diagram, in degrees (0 = top, clockwise)
const angleStep = 360 / businesses.length

export default function Ecosystem() {
  const prefersReduced = useReducedMotion()

  return (
    <>
      {/* Desktop: radial connected diagram */}
      <div className="relative mx-auto hidden aspect-square w-full max-w-2xl lg:block">
        <svg viewBox="0 0 600 600" className="absolute inset-0 h-full w-full" aria-hidden="true">
          <circle
            cx="300"
            cy="300"
            r="220"
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
            className="text-graphite-900/10"
            strokeDasharray="4 8"
          />
          {businesses.map((_, i) => {
            const angle = ((angleStep * i - 90) * Math.PI) / 180
            const x = 300 + Math.cos(angle) * 220
            const y = 300 + Math.sin(angle) * 220
            if (prefersReduced) {
              return (
                <line
                  key={i}
                  x1="300"
                  y1="300"
                  x2={x}
                  y2={y}
                  stroke="currentColor"
                  strokeWidth="1.25"
                  className="text-ember/70"
                />
              )
            }
            return (
              <motion.line
                key={i}
                x1="300"
                y1="300"
                x2={x}
                y2={y}
                stroke="currentColor"
                strokeWidth="1.25"
                className="text-ember/70"
                initial={{ pathLength: 0, opacity: 0 }}
                whileInView={{ pathLength: 1, opacity: 1 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{
                  duration: 0.85,
                  delay: 0.2 + i * 0.08,
                  ease: EDITORIAL_EASE,
                }}
              />
            )
          })}
        </svg>

        {/* Central Core */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          <motion.div
            initial={prefersReduced ? { opacity: 1 } : { scale: 0.88, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.75, ease: EDITORIAL_EASE }}
            className="flex h-36 w-36 flex-col items-center justify-center rounded-full bg-graphite-900 text-center text-white shadow-lift"
          >
            <img src="/logos/nova-mark.png" alt="" width={36} height={36} className="mb-1.5 h-9 w-9 object-contain" loading="lazy" />
            <span className="font-display text-eyebrow font-extrabold leading-tight tracking-wide2">
              NOVA
              <br />
              VENTURES
            </span>
          </motion.div>
        </div>

        {/* Outer Business Satellite Nodes */}
        {businesses.map((b, i) => {
          const angle = ((angleStep * i - 90) * Math.PI) / 180
          const x = 50 + Math.cos(angle) * 36.6
          const y = 50 + Math.sin(angle) * 36.6
          return (
            <div
              key={b.id}
              className="absolute -translate-x-1/2 -translate-y-1/2"
              style={{ left: `${x}%`, top: `${y}%` }}
            >
              <motion.div
                initial={prefersReduced ? { opacity: 1 } : { scale: 0.8, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{
                  duration: 0.65,
                  delay: prefersReduced ? 0 : 0.45 + i * 0.08,
                  ease: EDITORIAL_EASE,
                }}
              >
                <Link
                  to={`/businesses/${b.id}`}
                  className="group flex w-40 flex-col items-center gap-2 text-center"
                >
                  <span className="flex h-14 w-14 items-center justify-center rounded-full border border-graphite-900/15 bg-white font-display text-small font-bold text-graphite-900 shadow-soft transition-all duration-300 ease-editorial group-hover:scale-105 group-hover:border-ember group-hover:bg-ember group-hover:text-graphite-900">
                    {b.index}
                  </span>
                  <span className="text-eyebrow font-semibold normal-case tracking-normal text-ink-700 transition-colors duration-300 group-hover:text-graphite-900">
                    {b.shortName}
                  </span>
                </Link>
              </motion.div>
            </div>
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
          {businesses.map((b, i) => (
            <div key={b.id} className="flex w-full flex-col items-center">
              <span className="h-8 w-px bg-ember/60" aria-hidden="true" />
              <motion.div
                initial={prefersReduced ? { opacity: 1 } : { opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.6, delay: prefersReduced ? 0 : i * 0.07, ease: EDITORIAL_EASE }}
                className="w-full max-w-xs"
              >
                <Link
                  to={`/businesses/${b.id}`}
                  className="flex min-h-12 w-full items-center gap-3 rounded-full border border-graphite-900/15 bg-white px-5 py-3 transition-colors duration-300 hover:border-ember active:scale-[0.98]"
                >
                  <span className="font-display text-eyebrow font-bold text-ember-700">{b.index}</span>
                  <span className="text-small font-semibold text-graphite-900">{b.shortName}</span>
                </Link>
              </motion.div>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}
