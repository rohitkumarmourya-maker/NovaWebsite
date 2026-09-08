import { StrictMode } from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.tsx'
import { HeadProvider, defaultHead } from './lib/head'

// Signals to CSS that JavaScript is running (enables scroll-reveal / page transitions).
document.documentElement.classList.add('js')

const container = document.getElementById('root')!
const app = (
  <StrictMode>
    <HeadProvider state={{ current: defaultHead }}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </HeadProvider>
  </StrictMode>
)

// Production pages are prerendered to static HTML (scripts/prerender.mjs); hydrate them.
// In development (or if prerendering was skipped) the root is empty, so render normally.
if (container.hasChildNodes() && container.firstElementChild) {
  hydrateRoot(container, app, {
    // Development builds only: surface hydration mismatches in readable chunks.
    onRecoverableError(error) {
      if (import.meta.env.MODE === 'production') return
      const msg = String((error as Error)?.message ?? error)
      for (let i = 0; i < msg.length; i += 300) console.warn('[hydration]', msg.slice(i, i + 300))
    },
  })
} else {
  createRoot(container).render(app)
}
