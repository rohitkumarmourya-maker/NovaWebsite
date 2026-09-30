import { type ReactNode, createContext, useContext } from 'react'
import { motion, useReducedMotion, type Transition } from 'motion/react'

export const EDITORIAL_EASE = [0.16, 1, 0.3, 1] as const

export const standardTransition = (delay = 0, duration = 0.8): Transition => ({
  duration,
  delay,
  ease: EDITORIAL_EASE,
})

interface RevealProps {
  children: ReactNode
  className?: string
  delay?: number
  duration?: number
  y?: number
}

/**
 * Editorial scroll reveal with upward translation and opacity.
 */
export function RevealOnScroll({
  children,
  className = '',
  delay = 0,
  duration = 0.8,
  y = 28,
}: RevealProps) {
  const prefersReduced = useReducedMotion()

  if (prefersReduced) {
    return <div className={className}>{children}</div>
  }

  return (
    <motion.div
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.12 }}
      transition={{ duration, delay, ease: EDITORIAL_EASE }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

/**
 * Masked text reveal: container with overflow-hidden, lines rise smoothly.
 */
export function MaskedLines({
  lines,
  className = '',
  lineClassName = '',
  stagger = 0.1,
  delay = 0,
}: {
  lines: ReactNode[]
  className?: string
  lineClassName?: string
  stagger?: number
  delay?: number
}) {
  const prefersReduced = useReducedMotion()

  return (
    <div className={className}>
      {lines.map((line, i) => (
        <span key={i} className="block overflow-hidden">
          {prefersReduced ? (
            <span className={`block ${lineClassName}`}>{line}</span>
          ) : (
            <motion.span
              initial={{ y: '110%', opacity: 0 }}
              whileInView={{ y: '0%', opacity: 1 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{
                duration: 0.85,
                delay: delay + i * stagger,
                ease: EDITORIAL_EASE,
              }}
              className={`block ${lineClassName}`}
            >
              {line}
            </motion.span>
          )}
        </span>
      ))}
    </div>
  )
}

/**
 * Premium clip-path image reveal with subtle scale settling.
 */
export function ClipRevealImage({
  children,
  className = '',
  delay = 0,
}: {
  children: ReactNode
  className?: string
  delay?: number
}) {
  const prefersReduced = useReducedMotion()

  if (prefersReduced) {
    return <div className={className}>{children}</div>
  }

  return (
    <motion.div
      initial={{ clipPath: 'inset(0% 40% 0% 40%)', scale: 1.05, opacity: 0.85 }}
      whileInView={{ clipPath: 'inset(0% 0% 0% 0%)', scale: 1, opacity: 1 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 1.1, delay, ease: EDITORIAL_EASE }}
      className={`overflow-hidden will-change-transform ${className}`}
    >
      {children}
    </motion.div>
  )
}

// Stagger context for coordinated list and grid animations
const StaggerContext = createContext<{ index: number; stagger: number }>({ index: 0, stagger: 0.1 })

export function StaggerContainer({
  children,
  className = '',
  stagger = 0.1,
}: {
  children: ReactNode
  className?: string
  stagger?: number
}) {
  return (
    <div className={className}>
      <StaggerContext.Provider value={{ index: 0, stagger }}>
        {children}
      </StaggerContext.Provider>
    </div>
  )
}

export function StaggerItem({
  children,
  index,
  className = '',
  y = 25,
}: {
  children: ReactNode
  index: number
  className?: string
  y?: number
}) {
  const prefersReduced = useReducedMotion()
  const { stagger } = useContext(StaggerContext)

  if (prefersReduced) {
    return <div className={className}>{children}</div>
  }

  return (
    <motion.div
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{
        duration: 0.75,
        delay: index * stagger,
        ease: EDITORIAL_EASE,
      }}
      className={className}
    >
      {children}
    </motion.div>
  )
}
