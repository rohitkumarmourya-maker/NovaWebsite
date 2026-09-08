import { useEffect, useRef, useState } from 'react'
import type { ReactNode } from 'react'

/**
 * Fades content in as it scrolls into view. Content is visible by default (see the
 * `.reveal` rules in index.css) so prerendered HTML, crawlers and no-JS visitors always
 * see everything; the animation only applies once JavaScript is running.
 */
export default function ScrollReveal({
  children,
  className = '',
  delayMs = 0,
  as: Tag = 'div',
}: {
  children: ReactNode
  className?: string
  delayMs?: number
  as?: 'div' | 'section' | 'li' | 'article'
}) {
  const ref = useRef<HTMLElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const node = ref.current
    if (!node) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || !('IntersectionObserver' in window)) {
      setVisible(true)
      return
    }
    // Already on screen (e.g. after a back navigation restoring scroll)?
    const rect = node.getBoundingClientRect()
    if (rect.top < window.innerHeight * 0.95 && rect.bottom > 0) {
      setVisible(true)
      return
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.12, rootMargin: '0px 0px -8% 0px' },
    )
    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  return (
    <Tag
      // @ts-expect-error -- generic element ref
      ref={ref}
      className={`reveal ${visible ? 'is-visible' : ''} ${className}`}
      style={{ transitionDelay: visible ? `${delayMs}ms` : '0ms' }}
    >
      {children}
    </Tag>
  )
}
