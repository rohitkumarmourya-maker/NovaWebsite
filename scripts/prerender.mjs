/**
 * Prerenders every route to static HTML after `vite build`.
 *
 *   dist/index.html                  →  Home (hydrated by the client bundle)
 *   dist/about/index.html            →  About
 *   dist/businesses/<id>/index.html  →  each business
 *   dist/404.html                    →  Not-found page (GitHub Pages / Netlify / Apache use it)
 *
 * Search engines receive complete HTML with the right <title>, description, canonical link,
 * Open Graph tags and JSON-LD for every page, and visitors see content before JavaScript loads.
 */
import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const root = path.resolve(fileURLToPath(new URL('..', import.meta.url)))
const dist = path.join(root, 'dist')
const ssrDir = path.join(root, 'dist-ssr')

const template = await fs.readFile(path.join(dist, 'index.html'), 'utf8')
const { render, prerenderRoutes } = await import(pathToFileURL(path.join(ssrDir, 'entry-server.js')).href)

// Strip the default head tags that each page replaces with its own.
const stripDefaults = (html) =>
  html
    .replace(/<title>[^<]*<\/title>\s*/i, '')
    .replace(/<meta name="description"[^>]*>\s*/i, '')
    .replace(/<link rel="canonical"[^>]*>\s*/i, '')
    .replace(/<meta property="og:title"[^>]*>\s*/i, '')
    .replace(/<meta property="og:description"[^>]*>\s*/i, '')
    .replace(/<meta property="og:url"[^>]*>\s*/i, '')
    .replace(/<meta property="og:image"[^>]*>\s*/i, '')
    .replace(/<meta name="twitter:title"[^>]*>\s*/i, '')
    .replace(/<meta name="twitter:description"[^>]*>\s*/i, '')
    .replace(/<meta name="twitter:image"[^>]*>\s*/i, '')

const base = stripDefaults(template)

let count = 0
for (const route of prerenderRoutes) {
  const { html: rendered, headTags } = render(route)
  // React's server renderer emits "hoistable" tags (e.g. <link rel="preload" as="image">) at the
  // very start of the markup. They belong in <head>; leaving them inside #root would make the
  // client-side hydration see an extra node and fall back to a full re-render.
  const hoisted = []
  let html = rendered
  for (;;) {
    const m = html.match(/^<(link|meta)\b[^>]*>/)
    if (!m) break
    hoisted.push(m[0])
    html = html.slice(m[0].length)
  }
  const page = base.replace('<!--app-html-->', html).replace('</head>', `    ${headTags}\n    ${hoisted.join('\n    ')}\n  </head>`)
  const file = route === '/404' ? path.join(dist, '404.html') : route === '/' ? path.join(dist, 'index.html') : path.join(dist, route.slice(1), 'index.html')
  await fs.mkdir(path.dirname(file), { recursive: true })
  await fs.writeFile(file, page)
  count++
}

await fs.rm(ssrDir, { recursive: true, force: true })
console.log(`✓ prerendered ${count} pages into dist/`)
