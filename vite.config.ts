import react from '@vitejs/plugin-react'
import { defineConfig, type Plugin } from 'vite'
import { apiBase, buildCsp, siteUrl } from './site.config.mjs'

/**
 * Injects the Content-Security-Policy <meta> tag and canonical site URL into index.html.
 * The same policy is emitted as real HTTP headers by scripts/generate-hosting-files.mjs
 * (Netlify `_headers`, Apache `.htaccess`, `vercel.json`) and by the Express API when it
 * serves the static build, so the page is protected even on hosts that ignore <meta> CSP.
 */
function novaHtmlPlugin(): Plugin {
  return {
    name: 'nova-html',
    transformIndexHtml(html) {
      return html
        .replace('%CSP%', buildCsp({ forMeta: true }))
        .replaceAll('%SITE_URL%', siteUrl)
    },
  }
}

export default defineConfig({
  plugins: [react(), novaHtmlPlugin()],
  define: {
    'import.meta.env.VITE_SITE_URL': JSON.stringify(siteUrl),
    'import.meta.env.VITE_API_BASE': JSON.stringify(apiBase),
  },
  server: {
    // During development, forward /api to the Node service started with `npm run dev:api`.
    proxy: {
      '/api': { target: 'http://localhost:8787', changeOrigin: false },
    },
  },
  build: {
    sourcemap: false,
    target: 'es2019',
    cssTarget: 'safari14',
  },
  ssr: {
    noExternal: ['react-router-dom'],
  },
})
