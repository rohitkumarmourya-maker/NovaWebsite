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

  const imageContent = (
    <div
      className={`relative w-full overflow-hidden ${rounded} bg-sand-100 ${fit === 'cover' ? 'aspect-[3/2]' : ''} ${className}`}
      style={style}
    >
      <picture className={fit === 'cover' ? 'absolute inset-0 h-full w-full' : ''}>
        <source type="image/webp" srcSet={webpSrcSet(id)} sizes={sizes} />
        <img
          src={variant.fallback}
          width={variant.width}
          height={variant.height}
          alt={text}
          loading={priority ? 'eager' : 'lazy'}
          decoding={priority ? 'sync' : 'async'}
          fetchPriority={priority ? 'high' : 'auto'}
          sizes={sizes}
          className={`h-full w-full ${fit === 'cover' ? 'object-cover' : 'object-contain'}`}
        />
      </picture>
      {overlay && (
        <div
          className="pointer-events-none absolute inset-0 bg-gradient-to-t from-graphite-950/25 via-transparent to-transparent"
          aria-hidden="true"
        />
      )}
    </div>
  )

  if (prefersReduced) {
    return imageContent
  }

  if (priority) {
    return (
      <motion.div
        initial={{ scale: 1.05, opacity: 0.95 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 2.5, ease: EDITORIAL_EASE }}
        className="w-full overflow-hidden rounded-2xl will-change-transform"
      >
        {imageContent}
      </motion.div>
    )
  }

  if (shouldReveal) {
    return (
      <motion.div
        initial={{ clipPath: 'inset(0% 40% 0% 40%)', scale: 1.05 }}
        whileInView={{ clipPath: 'inset(0% 0% 0% 0%)', scale: 1 }}
        viewport={{ once: true, amount: 0.15 }}
        transition={{ duration: 1.05, ease: EDITORIAL_EASE }}
        className="w-full overflow-hidden rounded-2xl will-change-transform"
      >
        {imageContent}
      </motion.div>
    )
  }

  return imageContent
}
