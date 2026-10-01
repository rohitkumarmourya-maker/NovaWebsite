import { useState, useRef, useEffect } from 'react'
import { motion, useReducedMotion } from 'motion/react'
import { getImage } from '../data/imageInventory'
import { imageManifest, webpSrcSet } from '../data/imageManifest'
import { EDITORIAL_EASE } from './motion/MotionPrimitives'

type Props = {
  /** Image id from assets/images-source (without extension). */
  id: string
  /** Override the alt text; defaults to the inventory description. */
  alt?: string
  className?: string
  /**
   * 'natural' keeps the photograph's own aspect ratio so nothing is ever cropped —
   * corner logos and edge details stay visible on every screen size.
   * 'cover' fills a container that has its own aspect ratio (only used where the crop is safe).
   */
  fit?: 'natural' | 'cover'
  /** Above-the-fold images: load eagerly with high priority. */
  priority?: boolean
  /** Approximate rendered width, used to pick the right responsive variant. */
  sizes?: string
  /** Subtle darkening gradient at the bottom (photos on light backgrounds). */
  overlay?: boolean
  rounded?: string
  /** Enables executive clip-path reveal when scrolled into view (default: true for non-priority images). */
  reveal?: boolean
}

export default function SiteImage({
  id,
  alt,
  className = '',
  fit = 'cover',
  priority = false,
  sizes = '(min-width: 1024px) 50vw, 100vw',
  overlay = true,
  rounded = 'rounded-2xl',
}: Props) {
  const prefersReduced = useReducedMotion()
  const isServer = typeof window === 'undefined'
  const variant = imageManifest[id]
  const spec = getImage(id)

  const [isLoaded, setIsLoaded] = useState(isServer)
  const [isRevealed, setIsRevealed] = useState(isServer)
  const imgRef = useRef<HTMLImageElement>(null)

  useEffect(() => {
    // 1. If already complete (e.g. cached), immediately mark revealed
    if (imgRef.current?.complete && imgRef.current.naturalWidth > 0) {
      setIsLoaded(true)
      setIsRevealed(true)
      return
    }

    // 2. Fail-safe timer: ensure the image is NEVER stuck hidden
    const timer = setTimeout(() => {
      setIsLoaded(true)
      setIsRevealed(true)
    }, 1200)

    return () => clearTimeout(timer)
  }, [])

  if (!variant) {
    return (
      <div
        role="img"
        aria-label={alt ?? id}
        className={`flex aspect-[3/2] w-full items-center justify-center ${rounded} border border-graphite-900/10 bg-sand-100 text-small text-ink-500 ${className}`}
      >
        Image unavailable
      </div>
    )
  }

  const text = alt ?? spec?.purpose ?? 'Nova Ventures'
  const style = fit === 'natural' ? { aspectRatio: `${variant.width} / ${variant.height}` } : undefined

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
        },
        animate: {
          clipPath: 'inset(0% 0% 0% 0%)',
          opacity: 1,
          scale: 1,
        },
      }

  return (
    <div
      className={`relative w-full overflow-hidden ${rounded} bg-sand-100 ${fit === 'cover' ? 'aspect-[3/2]' : ''} ${className}`}
      style={style}
    >
      <motion.div
        initial={isServer ? 'animate' : 'initial'}
        animate={isLoaded ? 'animate' : 'initial'}
        variants={revealVariants}
        transition={{
          duration: prefersReduced ? 0.3 : priority ? 1.05 : 0.95,
          ease: EDITORIAL_EASE,
        }}
        onAnimationComplete={() => setIsRevealed(true)}
        style={
          isRevealed
            ? { clipPath: 'none', transform: 'none', opacity: 1, filter: 'none' }
            : undefined
        }
        className={`absolute inset-0 h-full w-full ${
          isRevealed ? '' : 'will-change-[clip-path,transform,opacity]'
        }`}
      >
        <picture className="block h-full w-full">
          <source type="image/webp" srcSet={webpSrcSet(id)} sizes={sizes} />
          <img
            ref={imgRef}
            src={variant.fallback}
            width={variant.width}
            height={variant.height}
            alt={text}
            loading={priority ? 'eager' : 'lazy'}
            decoding={priority ? 'sync' : 'async'}
            fetchPriority={priority ? 'high' : 'auto'}
            sizes={sizes}
            onLoad={() => setIsLoaded(true)}
            onError={() => {
              setIsLoaded(true)
              setIsRevealed(true)
            }}
            className={`h-full w-full ${fit === 'cover' ? 'object-cover' : 'object-contain'}`}
          />
        </picture>
        {overlay && (
          <div
            className="pointer-events-none absolute inset-0 bg-gradient-to-t from-graphite-950/25 via-transparent to-transparent"
            aria-hidden="true"
          />
        )}
      </motion.div>
    </div>
  )
}

