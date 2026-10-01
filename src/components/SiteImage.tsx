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
  reveal,
}: Props) {
  const prefersReduced = useReducedMotion()
  const shouldReveal = reveal ?? !priority
  const variant = imageManifest[id]
  const spec = getImage(id)

  const [isLoaded, setIsLoaded] = useState(false)
  const [isRevealed, setIsRevealed] = useState(false)
  const imgRef = useRef<HTMLImageElement>(null)

  useEffect(() => {
    if (imgRef.current?.complete && imgRef.current.naturalWidth > 0) {
      setIsLoaded(true)
    }
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
          filter: 'blur(6px)',
        },
        animate: {
          clipPath: 'inset(0% 0% 0% 0%)',
          opacity: 1,
          scale: 1,
          filter: 'blur(0px)',
        },
      }

  const imageContent = (
    <div
      className={`relative w-full overflow-hidden ${rounded} bg-sand-100 ${fit === 'cover' ? 'aspect-[3/2]' : ''} ${className}`}
      style={style}
    >
      <motion.div
        initial="initial"
        animate={isLoaded ? 'animate' : 'initial'}
        variants={revealVariants}
        transition={{
          duration: prefersReduced ? 0.3 : priority ? 1.05 : 0.95,
          ease: EDITORIAL_EASE,
        }}
        onAnimationComplete={() => setIsRevealed(true)}
        style={
          isRevealed
            ? { clipPath: 'none', filter: 'none', transform: 'none' }
            : undefined
        }
        className={`h-full w-full ${fit === 'cover' ? 'absolute inset-0' : 'relative'} ${
          isRevealed ? '' : 'will-change-[clip-path,transform,opacity,filter]'
        }`}
      >
        <picture className={fit === 'cover' ? 'absolute inset-0 h-full w-full block' : 'block h-full w-full'}>
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
            onError={() => setIsLoaded(true)}
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

  if (prefersReduced) {
    return imageContent
  }

  if (shouldReveal) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.12 }}
        transition={{ duration: 0.75, ease: EDITORIAL_EASE }}
        className="w-full overflow-hidden rounded-2xl will-change-transform"
      >
        {imageContent}
      </motion.div>
    )
  }

  return imageContent
}
