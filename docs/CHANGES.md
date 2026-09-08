# What changed in this release (v2.0.0)

A summary for the Nova Ventures team of everything that changed from the previous website package.

## Design

- **Graphite & Ember palette** applied site-wide, exactly as in the approved concept review
  (graphite `#1B2632` / `#0F161E`, ember `#F5A425`, burnt amber `#B45309`, paper `#F7F4ED`,
  sand `#F4F0E5` / `#EAE3D3`, warm ink text colours).
- **Floating pill navigation** from the concept review (white pill on paper, shadow grows on scroll).
- **Golden-ratio type scale**: heading sizes step by φ / √φ (12.6 → 16 → 20.4 → 25.9 → 32.9 →
  41.9 → 53.3 → 67.8 px), body line-height 1.618, fluid between phone and desktop.
- Dark bands now always use white headings (the concept review had an unreadable heading in the
  "Future Vision" band — fixed).
- Consistent page heroes, breadcrumbs on business pages, ember call-to-action bands.

## Images

- **No more cropping.** Every photo is displayed at its own aspect ratio, so the Nova logos in the
  corners of the pictures are never cut off on any device (the "half-cut logo" issue).
- Responsive WebP variants (480/768/1024/1536 px) + JPEG fallback; the page went from ~30 MB of
  PNG to ~7 MB across *all* variants, and a phone downloads only the small ones.
- Width/height always set → no layout jumps. Hero images load with high priority, others lazily.
- Proper favicons, Apple touch icon, PWA manifest, 1200×630 social-share image.
- Master photographs kept in `assets/images-source/` for future regeneration.

## Careers: job & internship application

- New **"Apply for a job or internship"** section on the Careers page (`/careers#apply`), styled
  like a Google Form but fully branded with the Nova Ventures logo.
- Six steps: Position · Personal details · Education · Experience & skills · Documents · Final
  details. CV required; **cover letter optional** (text and/or file).
- Open roles listed with one-click "Apply" that pre-selects the position.
- Submissions arrive at **novaventures.nvit@gmail.com** as one structured e-mail per candidate,
  with the CV and cover letter attached and renamed by reference number and candidate name,
  Reply-To set to the candidate, and a confirmation e-mail sent to the candidate.
- Contact form upgraded from a `mailto:` link to the same delivery system, with a graceful
  e-mail fallback if the API is offline.

## Search engines (SEO)

- Every page is **prerendered to real HTML** at build time with its own title, description,
  canonical URL, Open Graph / Twitter cards and structured data (Organization, WebSite,
  BreadcrumbList). Google no longer has to run JavaScript to read the site.
- Correct `sitemap.xml` (the old one listed routes that did not exist) and `robots.txt`,
  generated from the route list.
- Real 404 page returning a 404 status.
- Self-hosted fonts and preloads for faster first paint.

## User experience

- Skip link, focus management on navigation, keyboard-accessible menus and explorer tabs,
  visible focus rings, 44 px touch targets, reduced-motion support.
- Mobile navigation with safe-area padding and body scroll lock; back/forward keeps scroll
  position; in-page anchors work across pages.
- Fixed literal `’` characters that appeared in the copy on four pages, and duplicated
  wording in the footer and Careers hero.
- New Privacy Policy page linked from both forms and the footer.

## Security

- Strict Content-Security-Policy (no third-party scripts, fonts or images), HSTS, `X-Frame-Options`,
  `nosniff`, referrer and permissions policies — delivered as HTTP headers for Netlify, Vercel,
  Apache/cPanel and the Node server, plus a `<meta>` fallback.
- API: schema validation against shared option lists, file type verified by magic bytes, 5 MB
  limit, honeypot + timing checks, per-IP rate limits, CORS allow-list, Helmet, optional
  Cloudflare Turnstile, no data stored on disk, no personal data in logs.
- All dependencies at versions with **zero known vulnerabilities** (`npm run audit`).

## Developer experience

- One `npm install` sets up site and API. `npm run build` produces a deploy-ready `dist/`.
- `npm run preview` serves the exact production output with e-mails written to `server/outbox/`
  so the mail layout can be reviewed without SMTP credentials.
- Single configuration file for site URL / API origin / CSP (`site.config.mjs`).
