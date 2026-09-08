import { getImage } from '../data/imageInventory'
import { imageManifest, webpSrcSet } from '../data/imageManifest'

type Props = {
  /** Image id from assets/images-source (without extension). */
  id: string
  /** Override the alt text; defaults to the inventory description. */
  alt?: string
  className?: string
  /**
   * 'natural' (default) keeps the photograph's own aspect ratio so nothing is ever cropped —
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
}

export default function SiteImage({
  id,
  alt,
  className = '',
  fit = 'natural',
  priority = false,
  sizes = '(min-width: 1024px) 50vw, 100vw',
  overlay = true,
  rounded = 'rounded-2xl',
}: Props) {
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

  return (
    <div
      className={`relative w-full overflow-hidden ${rounded} bg-sand-100 ${fit === 'cover' ? 'h-full' : ''} ${className}`}
      style={style}
    >
      <picture>
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
}
