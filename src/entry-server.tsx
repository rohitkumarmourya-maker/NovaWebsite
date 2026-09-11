/**
 * Server-side entry used only at build time by scripts/prerender.mjs to turn every
 * route into a static HTML file (real content for search engines, instant first paint).
 */
import { StrictMode } from 'react'
import { renderToString } from 'react-dom/server'
import { StaticRouter } from 'react-router'
import App from './App'
import { HeadProvider, defaultHead, renderHeadTags, type HeadState } from './lib/head'
import { businesses } from './data/businesses'

export const prerenderRoutes = [
  '/',
  '/about',
  '/businesses',
  ...businesses.map((b) => `/businesses/${b.id}`),
  '/capabilities',
  '/innovation',
  '/careers',
  '/careers/apply',
  '/terms-of-service',
  '/contact',
  '/news',
  '/privacy',
  '/admin',
  '/admin/login',
  '/admin/messages',
  '/admin/applications',
  '/admin/projects',
  '/404',
]

export function render(url: string): { html: string; headTags: string; head: HeadState } {
  const state = { current: { ...defaultHead, path: url } }
  const html = renderToString(
    <StrictMode>
      <HeadProvider state={state}>
        <StaticRouter location={url}>
          <App />
        </StaticRouter>
      </HeadProvider>
    </StrictMode>,
  )
  return { html, headTags: renderHeadTags(state.current), head: state.current }
}
