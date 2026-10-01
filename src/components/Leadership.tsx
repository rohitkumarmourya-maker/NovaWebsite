import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'motion/react'
import { executiveLeaders, type ExecutiveLeader } from '../lib/leadership-data'
import { Eyebrow } from './Ui'
import { EDITORIAL_EASE } from './motion/MotionPrimitives'

export default function Leadership() {
  const [selectedLeaderId, setSelectedLeaderId] = useState<string | null>(null)
  const prefersReduced = useReducedMotion()
  const profileRef = useRef<HTMLDivElement>(null)

  const selectedLeader = executiveLeaders.find((l) => l.id === selectedLeaderId) ?? null

  // Close profile on Escape key
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSelectedLeaderId(null)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  // When a leader is selected, scroll smoothly into view without layout hitching
  useEffect(() => {
    if (!selectedLeaderId) return
    const frame = requestAnimationFrame(() => {
      if (!profileRef.current) return
      const rect = profileRef.current.getBoundingClientRect()
      const headerOffset = 90
      if (rect.top < headerOffset || rect.top > window.innerHeight * 0.7) {
        const targetScroll = window.scrollY + rect.top - headerOffset
        window.scrollTo({ top: Math.max(0, targetScroll), behavior: 'smooth' })
      }
    })
    return () => cancelAnimationFrame(frame)
  }, [selectedLeaderId])

  return (
    <section id="leadership" className="scroll-mt-24 bg-sand-50 py-20 sm:py-28">
      <div className="container-nova">
        {/* Entrance Heading */}
        <div className="flex flex-col items-start">
          <motion.div
            initial={prefersReduced ? { opacity: 1 } : { opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.65, ease: EDITORIAL_EASE }}
          >
            <Eyebrow>Our People</Eyebrow>
          </motion.div>
          <motion.h2
            initial={prefersReduced ? { opacity: 1 } : { y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8, delay: prefersReduced ? 0 : 0.08, ease: EDITORIAL_EASE }}
            className="mt-5 max-w-3xl text-h2 font-semibold text-graphite-900"
          >
            Executive Leadership &amp; Board of Directors
          </motion.h2>
          <motion.p
            initial={prefersReduced ? { opacity: 1 } : { opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.75, delay: prefersReduced ? 0 : 0.18, ease: EDITORIAL_EASE }}
            className="mt-4 max-w-prose text-lead text-ink-700"
          >
            Guiding Nova Ventures with an engineering mindset, governance discipline, and a commitment to long-term industrial capability.
          </motion.p>
        </div>

        {/* Expanded Executive Profile (Morphing View) */}
        <AnimatePresence mode="wait">
          {selectedLeader && (
            <motion.div
              ref={profileRef}
              key={selectedLeader.id}
              initial={prefersReduced ? { opacity: 1 } : { opacity: 0, y: 25, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={prefersReduced ? { opacity: 0 } : { opacity: 0, y: -20, scale: 0.98 }}
              transition={{ duration: 0.55, ease: EDITORIAL_EASE }}
              className="mt-12 overflow-hidden rounded-3xl border border-graphite-900/15 bg-white p-6 shadow-lift sm:p-10 lg:p-12"
              role="region"
              aria-label={`Executive profile of ${selectedLeader.name}`}
            >
              <div className="flex items-center justify-between border-b border-graphite-900/10 pb-5">
                <span className="font-display text-small font-bold text-ember-700">
                  EXECUTIVE PROFILE {selectedLeader.number} / 04
                </span>
                <button
                  type="button"
                  onClick={() => setSelectedLeaderId(null)}
                  className="group inline-flex items-center gap-2 rounded-full border border-graphite-900/15 px-4 py-1.5 text-small font-semibold text-graphite-900 transition-colors hover:border-graphite-900 hover:bg-graphite-900 hover:text-white"
                  aria-label="Close executive profile"
                >
                  <span className="transition-transform duration-300 ease-editorial group-hover:-translate-x-0.5">&larr;</span>
                  <span>Back to Leadership</span>
                </button>
              </div>

              <div className="mt-8 grid grid-cols-1 gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-14">
                {/* Large Portrait Presentation */}
                <div className="relative aspect-[3/4] w-full overflow-hidden rounded-2xl bg-graphite-900 text-white/50">
                  {selectedLeader.photo ? (
                    <ExecutivePortrait
                      src={selectedLeader.photo}
                      alt={selectedLeader.name}
                      width={600}
                      height={800}
                      prefersReduced={prefersReduced}
                      className="h-full w-full object-cover object-top"
                    />
                  ) : (
                    <div className="flex h-full w-full flex-col items-center justify-center p-8 text-center">
                      <div className="relative mb-6 flex h-24 w-24 items-center justify-center rounded-full border border-white/20 bg-white/5 text-ember">
                        <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                          <circle cx="12" cy="7" r="4" />
                        </svg>
                      </div>
                      <span className="font-display text-eyebrow font-bold tracking-wide2 text-ember">
                        {selectedLeader.number}
                      </span>
                      <p className="mt-2 text-small text-white/60">Board of Directors</p>
                    </div>
                  )}
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-graphite-950/70 via-transparent to-transparent" />
                  <div className="absolute bottom-5 left-5 right-5 text-white">
                    <p className="text-eyebrow font-bold uppercase text-ember">{selectedLeader.role}</p>
                    <h4 className="mt-1 font-display text-h3 font-semibold text-white">{selectedLeader.name}</h4>
                  </div>
                </div>

                {/* Profile Details */}
                <div className="flex flex-col justify-center">
                  <div>
                    <span className="font-display text-eyebrow font-bold uppercase text-ember-700">
                      {selectedLeader.role}
                    </span>
                    <h3 className="mt-2 text-h2 font-semibold text-graphite-900">{selectedLeader.name}</h3>
                    <p className="mt-4 text-lead font-medium text-ink-700">{selectedLeader.intro}</p>
                  </div>

                  <div className="mt-8 border-t border-graphite-900/10 pt-6">
                    <h4 className="font-display text-eyebrow font-bold uppercase text-graphite-900">About</h4>
                    <div className="mt-3 space-y-3">
                      {selectedLeader.biography.split('\n\n').map((paragraph, idx) => (
                        <p key={idx} className="text-body leading-relaxed text-ink-700">
                          {paragraph}
                        </p>
                      ))}
                    </div>
                  </div>

                  <div className="mt-8 border-t border-graphite-900/10 pt-6">
                    <h4 className="font-display text-eyebrow font-bold uppercase text-graphite-900">
                      Areas of Leadership
                    </h4>
                    <ul className="mt-3 flex flex-wrap gap-2.5">
                      {selectedLeader.leadershipAreas.map((area) => (
                        <li
                          key={area}
                          className="rounded-full border border-graphite-900/15 bg-sand-50 px-4 py-1.5 text-small font-medium text-graphite-900"
                        >
                          {area}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {selectedLeader.linkedin && (
                    <div className="mt-8 pt-2">
                      <a
                        href={selectedLeader.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group inline-flex items-center gap-2 text-small font-semibold text-graphite-900 hover:text-ember-700"
                      >
                        <span>Connect on LinkedIn</span>
                        <span className="transition-transform duration-300 ease-editorial group-hover:translate-x-1" aria-hidden="true">&rarr;</span>
                      </a>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* 4 Executive Portrait Cards Gallery */}
        <div
          className="executive-gallery mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4"
          data-has-selection={selectedLeaderId !== null ? 'true' : 'false'}
        >
          {executiveLeaders.map((leader, i) => (
            <ExecutiveCard
              key={leader.id}
              leader={leader}
              index={i}
              isSelected={selectedLeaderId === leader.id}
              hasSelection={selectedLeaderId !== null}
              onSelect={() => setSelectedLeaderId(selectedLeaderId === leader.id ? null : leader.id)}
              prefersReduced={prefersReduced}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

function ExecutiveCard({
  leader,
  index,
  isSelected,
  hasSelection,
  onSelect,
  prefersReduced,
}: {
  leader: ExecutiveLeader
  index: number
  isSelected: boolean
  hasSelection: boolean
  onSelect: () => void
  prefersReduced: boolean | null
}) {
  const cardRef = useRef<HTMLDivElement>(null)
  const rafRef = useRef<number | null>(null)

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (prefersReduced || !cardRef.current) return
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return

    const card = cardRef.current
    const rect = card.getBoundingClientRect()
    const normX = (e.clientX - rect.left) / rect.width - 0.5
    const normY = (e.clientY - rect.top) / rect.height - 0.5

    if (rafRef.current) cancelAnimationFrame(rafRef.current)
    rafRef.current = requestAnimationFrame(() => {
      if (!card) return
      // Very subtle tilt: rotateX ±1.2deg, rotateY ±1.8deg
      card.style.setProperty('--tilt-rx', `${(-normY * 2.2).toFixed(2)}deg`)
      card.style.setProperty('--tilt-ry', `${(normX * 3.0).toFixed(2)}deg`)
      card.style.setProperty('--spotlight-x', `${((normX + 0.5) * 100).toFixed(1)}%`)
      card.style.setProperty('--spotlight-y', `${((normY + 0.5) * 100).toFixed(1)}%`)
      card.style.setProperty('--spotlight-opacity', '1')
    })
  }

  const handleMouseEnter = () => {
    if (prefersReduced || !cardRef.current) return
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return
    cardRef.current.style.transition = 'transform 0.08s ease-out, box-shadow 0.3s ease'
  }

  const handleMouseLeave = () => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current)
    if (cardRef.current) {
      cardRef.current.style.transition = 'transform 0.45s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.3s ease'
      cardRef.current.style.setProperty('--tilt-rx', '0deg')
      cardRef.current.style.setProperty('--tilt-ry', '0deg')
      cardRef.current.style.setProperty('--spotlight-opacity', '0')
    }
  }

  const cardOpacity = hasSelection ? (isSelected ? 1 : 0.45) : undefined

  return (
    <motion.div
      initial={prefersReduced ? { opacity: 1 } : { opacity: 0, y: 35, scale: 0.97 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{
        duration: 0.75,
        delay: prefersReduced ? 0 : index * 0.1,
        ease: EDITORIAL_EASE,
      }}
      style={cardOpacity !== undefined ? { opacity: cardOpacity } : undefined}
      className="perspective-card executive-card-wrapper transition-opacity duration-300 ease-editorial"
    >
      <div
        ref={cardRef}
        role="button"
        tabIndex={0}
        aria-expanded={isSelected}
        aria-label={`View profile for ${leader.name}, ${leader.role}`}
        onClick={onSelect}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            onSelect()
          }
        }}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className={`group executive-card-surface relative flex h-full cursor-pointer flex-col overflow-hidden rounded-3xl border bg-white transition-all duration-300 ease-editorial focus-visible:ring-2 focus-visible:ring-ember ${
          isSelected
            ? 'border-ember shadow-lift ring-1 ring-ember'
            : 'border-graphite-900/10 shadow-soft hover:border-graphite-900/25 hover:shadow-lift'
        }`}
      >
        {/* Soft Cursor Spotlight (Ember Accent, Zero-ReRender via CSS Variable) */}
        {!prefersReduced && (
          <div
            className="pointer-events-none absolute inset-0 z-20 rounded-3xl transition-opacity duration-300"
            style={{
              opacity: 'var(--spotlight-opacity, 0)',
              background:
                'radial-gradient(circle 190px at var(--spotlight-x, 50%) var(--spotlight-y, 50%), rgba(245, 164, 37, 0.13), transparent 70%)',
            }}
            aria-hidden="true"
          />
        )}

        {/* Card Portrait Container */}
        <div className="relative aspect-[4/5] w-full overflow-hidden bg-graphite-950 text-white/40">
          {leader.photo ? (
            <ExecutivePortrait
              src={leader.photo}
              alt={leader.name}
              width={400}
              height={500}
              prefersReduced={prefersReduced}
              className="h-full w-full object-cover object-top transition-transform duration-500 ease-editorial group-hover:scale-[1.035]"
            />
          ) : (
            <div className="flex h-full w-full flex-col items-center justify-center p-6 text-center">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full border border-white/20 bg-white/5 text-ember/80 transition-transform duration-500 ease-editorial group-hover:scale-110">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
              </div>
              <span className="font-display text-small font-semibold text-white/70">Board of Directors</span>
              <span className="mt-1 text-eyebrow text-white/40">Director</span>
            </div>
          )}

          {/* Director Number Badge */}
          <div className="absolute left-4 top-4 z-10 flex h-8 w-8 items-center justify-center rounded-full border border-white/25 bg-graphite-950/70 backdrop-blur-sm">
            <span className="font-display text-eyebrow font-bold text-ember">{leader.number}</span>
          </div>

          {/* Subtle gradient vignette */}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-graphite-950/60 via-transparent to-transparent" />
        </div>

        {/* Card Content */}
        <div className="flex flex-1 flex-col justify-between p-6">
          <div>
            <p className="text-eyebrow font-bold uppercase text-ember-700">{leader.role}</p>
            <h3 className="mt-1.5 font-display text-h4 font-semibold text-graphite-900 transition-colors duration-300 group-hover:text-ember-700">
              {leader.name}
            </h3>
          </div>

          {/* Hover Affordance + Animated Divider */}
          <div className="mt-5 border-t border-graphite-900/10 pt-4">
            <div className="relative mb-2 h-0.5 w-full overflow-hidden">
              <div
                className={`h-full bg-ember transition-all duration-300 ease-editorial ${
                  isSelected ? 'w-full' : 'w-0 group-hover:w-full'
                }`}
              />
            </div>
            <div className="flex items-center justify-between text-small font-semibold text-graphite-900">
              <span className="text-ink-500 transition-colors group-hover:text-graphite-900">
                {isSelected ? 'Viewing Profile' : leader.status === 'published' ? 'Director' : 'Board Member'}
              </span>
              <span
                className={`inline-flex items-center gap-1.5 text-ember-700 transition-all duration-300 ease-editorial ${
                  isSelected ? 'translate-x-0 opacity-100' : 'translate-x-2 opacity-0 group-hover:translate-x-0 group-hover:opacity-100'
                }`}
                aria-hidden="true"
              >
                {isSelected ? 'Close' : 'View Profile'} &rarr;
              </span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

function ExecutivePortrait({
  src,
  alt,
  width,
  height,
  className = '',
  prefersReduced,
}: {
  src: string
  alt: string
  width: number
  height: number
  className?: string
  prefersReduced: boolean | null
}) {
  const [isLoaded, setIsLoaded] = useState(false)
  const [isRevealed, setIsRevealed] = useState(false)
  const imgRef = useRef<HTMLImageElement>(null)

  useEffect(() => {
    if (imgRef.current?.complete && imgRef.current.naturalWidth > 0) {
      setIsLoaded(true)
    }
  }, [])

  const revealVariants = prefersReduced
    ? {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
      }
    : {
        initial: {
          clipPath: 'inset(0% 50% 0% 50%)',
          opacity: 0,
          scale: 1.05,
          filter: 'blur(6px)',
        },
        animate: {
          clipPath: 'inset(0% 0% 0% 0%)',
          opacity: 1,
          scale: 1,
          filter: 'blur(0px)',
        },
      }

  return (
    <motion.div
      initial="initial"
      animate={isLoaded ? 'animate' : 'initial'}
      variants={revealVariants}
      transition={{
        duration: prefersReduced ? 0.3 : 0.95,
        ease: EDITORIAL_EASE,
      }}
      onAnimationComplete={() => setIsRevealed(true)}
      style={
        isRevealed
          ? { clipPath: 'none', filter: 'none', transform: 'none' }
          : undefined
      }
      className={`h-full w-full overflow-hidden ${
        isRevealed ? '' : 'will-change-[clip-path,transform,opacity,filter]'
      }`}
    >
      <img
        ref={imgRef}
        src={src}
        alt={alt}
        loading="lazy"
        width={width}
        height={height}
        onLoad={() => setIsLoaded(true)}
        onError={() => setIsLoaded(true)}
        className={className}
      />
    </motion.div>
  )
}

