import { createContext, useContext, useEffect } from 'react'
import type { ReactNode } from 'react'
import { siteUrl } from '../data/site'

/**
 * Tiny, dependency-free document <head> manager that works in two modes:
 *
 *  - Server / prerender: <HeadProvider state={...}> collects the values set by <Seo>
 *    so scripts/prerender.mjs can write real <title>/<meta> tags into each HTML file.
 *  - Browser: <Seo> updates document.head after navigation (SPA transitions).
 */
export type HeadState = {
  title: string
  description: string
  path: string
  image?: string
  noindex?: boolean
  jsonLd?: object[]
}

export const defaultHead: HeadState = {
  title: 'Nova Ventures | Engineering. Technology. Possibility.',
  description:
    'Official website of Nova Ventures Innovation and Technology — manufacturing, IT, HEMM, healthcare products, skill development and civil construction, connected by one engineering mindset.',
  path: '/',
}

type Collector = { current: HeadState }

const HeadContext = createContext<Collector | null>(null)

export function HeadProvider({ state, children }: { state: Collector; children: ReactNode }) {
  return <HeadContext.Provider value={state}>{children}</HeadContext.Provider>
}

export const fullTitle = (title: string) =>
  title.startsWith('Nova Ventures') ? title : `${title} | Nova Ventures`
export const absoluteUrl = (path: string) => `${siteUrl}${path === '/' ? '/' : path}`

function upsertMeta(attr: 'name' | 'property', key: string, content: string) {
  let tag = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`)
  if (!tag) {
    tag = document.createElement('meta')
    tag.setAttribute(attr, key)
    document.head.appendChild(tag)
  }
  tag.setAttribute('content', content)
}

function upsertLink(rel: string, href: string) {
  let tag = document.head.querySelector<HTMLLinkElement>(`link[rel="${rel}"]`)
  if (!tag) {
    tag = document.createElement('link')
    tag.setAttribute('rel', rel)
    document.head.appendChild(tag)
  }
  tag.setAttribute('href', href)
}

function applyToDocument(head: HeadState) {
  const title = fullTitle(head.title)
  const url = absoluteUrl(head.path)
  const image = head.image ?? `${siteUrl}/images/og-default.jpg`
  document.title = title
  upsertMeta('name', 'description', head.description)
  upsertMeta('property', 'og:title', title)
  upsertMeta('property', 'og:description', head.description)
  upsertMeta('property', 'og:url', url)
  upsertMeta('property', 'og:image', image)
  upsertMeta('name', 'twitter:title', title)
  upsertMeta('name', 'twitter:description', head.description)
  upsertMeta('name', 'twitter:image', image)
  upsertMeta('name', 'robots', head.noindex ? 'noindex, nofollow' : 'index, follow, max-image-preview:large')
  upsertLink('canonical', url)

  const id = 'page-jsonld'
  const existing = document.getElementById(id)
  if (head.jsonLd && head.jsonLd.length) {
    const script = existing ?? document.createElement('script')
    script.id = id
    script.setAttribute('type', 'application/ld+json')
    script.textContent = JSON.stringify(head.jsonLd)
    if (!existing) document.head.appendChild(script)
  } else if (existing) {
    existing.remove()
  }
}

/** Declares the SEO metadata for a page. Render once per page, near the top. */
export function Seo(props: Partial<HeadState> & { title: string; description: string; path: string }) {
  const collector = useContext(HeadContext)
  const head: HeadState = { ...defaultHead, ...props }

  // Server-side / prerender: record synchronously so the renderer can read it back.
  if (collector && typeof window === 'undefined') collector.current = head

  useEffect(() => {
    applyToDocument(head)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [head.title, head.description, head.path, head.image, head.noindex, JSON.stringify(head.jsonLd ?? null)])

  return null
}

/** Renders the head fragment for a prerendered page (used by scripts/prerender.mjs). */
export function renderHeadTags(head: HeadState): string {
  const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;')
  const title = esc(fullTitle(head.title))
  const description = esc(head.description)
  const url = esc(absoluteUrl(head.path))
  const image = esc(head.image ?? `${siteUrl}/images/og-default.jpg`)
  const robots = head.noindex ? 'noindex, nofollow' : 'index, follow, max-image-preview:large'
  const jsonLd = head.jsonLd?.length
    ? `<script id="page-jsonld" type="application/ld+json">${JSON.stringify(head.jsonLd).replace(/</g, '\\u003c')}</script>`
    : ''
  return [
    `<title>${title}</title>`,
    `<meta name="description" content="${description}" />`,
    `<meta name="robots" content="${robots}" />`,
    `<link rel="canonical" href="${url}" />`,
    `<meta property="og:title" content="${title}" />`,
    `<meta property="og:description" content="${description}" />`,
    `<meta property="og:url" content="${url}" />`,
    `<meta property="og:image" content="${image}" />`,
    `<meta name="twitter:title" content="${title}" />`,
    `<meta name="twitter:description" content="${description}" />`,
    `<meta name="twitter:image" content="${image}" />`,
    jsonLd,
  ]
    .filter(Boolean)
    .join('\n    ')
}

/** BreadcrumbList JSON-LD helper. */
export function breadcrumbJsonLd(items: { name: string; path: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  }
}
