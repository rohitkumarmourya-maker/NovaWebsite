# Nova Ventures — Corporate Website

Corporate website for **Nova Ventures Innovation and Technology Private Limited** (Chhattisgarh, India).

React 19 · TypeScript · Vite 8 · Tailwind CSS 3 · React Router 7 — with build-time prerendering for
search engines, a small Node/Express API that delivers job applications and enquiries to
`novaventures.nvit@gmail.com`, and a hardened security posture.

---

## 1. Quick start

```bash
npm install            # installs the site and the API (server/) in one go
npm run dev            # site on http://localhost:5173  (proxies /api → :8787)
npm run dev:api        # API on  http://localhost:8787  (run in a second terminal)
```

Production build and local preview of exactly what will be deployed:

```bash
npm run build          # → dist/  (typecheck, sitemap/headers, bundle, prerender 16 pages)
npm run preview        # serves dist/ + API on http://localhost:8787 (mail in dry-run mode)
```

Requirements: Node.js 20 or newer.

---

## 2. What is in the box

| Path | Purpose |
| --- | --- |
| `src/` | Website source (pages, components, data). |
| `src/data/` | **All editable content**: businesses, careers openings, capabilities, contact details, news. |
| `shared/form-options.json` | Option lists used by *both* the application form and the API validation. |
| `server/` | Form-to-e-mail API (Express + Nodemailer). Own `package.json`, own `.env`. |
| `assets/images-source/` | Master photographs (PNG/JPG). Never served directly. |
| `assets/logos-source/` | Original logo files. |
| `public/images/`, `public/logos/` | **Generated** web-ready images (`npm run images`). |
| `public/fonts/` | Self-hosted Inter + Manrope (no Google Fonts request at runtime). |
| `scripts/` | Build tooling: image pipeline, prerender, hosting-file generator. |
| `site.config.mjs` | Site URL, API origin, route list, Content-Security-Policy — one place. |
| `dist/` | Production build (created by `npm run build`). Deploy this. |

---

## 3. Before going live — two settings

**a) Site address.** Set `VITE_SITE_URL` (in `.env` or the build environment) to the real domain,
e.g. `https://www.novaventures.in`, then run `npm run build`. This drives canonical links, the
sitemap, robots.txt and Open Graph tags. The default `https://www.novaventures.example` is a
deliberate placeholder.

**b) Mail delivery.** Copy `server/.env.example` to `server/.env` and fill in the Gmail App
Password (step-by-step instructions are inside the file). Then verify:

```bash
cd server && npm run test:mail     # sends a sample application e-mail to MAIL_TO
```

---

## 4. Job / internship applications — how they arrive

The Careers page (`/careers#apply`) has a six-step application form (position, personal details,
education, experience & skills, documents, final details). Cover letter is optional (text and/or
file); CV is mandatory (PDF/DOC/DOCX ≤ 5 MB).

Each submission becomes **one e-mail** to `novaventures.nvit@gmail.com`:

```
Subject:     [Nova Careers] Job · Software Engineer · Priya Sharma · NV-20260908-4F7K
Reply-To:    the candidate (press Reply to answer them directly)
Body:        branded HTML summary, grouped by section, plus a plain-text copy
Attachments: NV-20260908-4F7K_Priya-Sharma_Resume.pdf
             NV-20260908-4F7K_Priya-Sharma_Cover-Letter.pdf
Headers:     X-Nova-Reference, X-Nova-Form, X-Nova-Type (for Gmail filters/labels)
```

Contact enquiries follow the same pattern with `[Nova Enquiry] <Category> · <Name> · NQ-…`.
The candidate receives an automatic confirmation with the same reference number
(`SEND_ACKNOWLEDGEMENT=true`).

**Suggested Gmail filters:** `subject:"[Nova Careers]"` → label *Careers*;
`subject:"[Nova Enquiry]"` → label *Enquiries*. Every message is searchable by reference number.

Nothing is stored on the server; attachments stream straight into the e-mail.

### Editing roles and options

Open `shared/form-options.json`:

- `openings` — roles listed on the Careers page and in the form's position dropdown.
- `verticals`, `qualifications`, `experienceLevels`, `noticePeriods`, `internshipDurations`,
  `referralSources`, `enquiryCategories` — dropdown contents.

The form and the API read the same file, so the two can never disagree. Restart the API after
editing.

---

## 5. Deployment options

### Option A — single Node server (simplest; Render, Railway, a VPS, cPanel Node app)

```bash
npm run build
cd server && cp .env.example .env   # fill in SMTP_*, set SERVE_STATIC=true, TRUST_PROXY=1
npm start                           # serves dist/ + /api on $PORT
```

Put it behind HTTPS (the host's built-in TLS, Nginx or Cloudflare).

### Option B — static host + separate API

Deploy `dist/` to Netlify / Vercel / Cloudflare Pages / S3 and run `server/` anywhere Node runs.

1. Build the site with the API origin baked in:
   `VITE_SITE_URL=https://www.novaventures.in VITE_API_BASE=https://api.novaventures.in npm run build`
2. In `server/.env` set `ALLOWED_ORIGINS=https://www.novaventures.in` and `SERVE_STATIC=false`.

Hosting files are generated for you: `dist/_headers` + `dist/_redirects` (Netlify/Cloudflare),
`vercel.json` (Vercel), `dist/.htaccess` (Apache/cPanel). All carry the security headers.

### Option C — pure static, no API

Everything still works: when the API is unreachable the forms show an *"e-mail my application
instead"* button that opens the visitor's mail app with the details pre-filled (attachments must
then be added by hand). For a professional experience, run the API.

---

## 6. Security

| Layer | Measure |
| --- | --- |
| Transport | HSTS (2 years, preload), `upgrade-insecure-requests`, HTTPS redirect in `.htaccess`. |
| Content-Security-Policy | `default-src 'self'`; scripts, fonts, images and XHR only from the site's own origin (plus the API origin if separate). No third-party scripts anywhere. Delivered as HTTP header and as a `<meta>` fallback. |
| Headers | `X-Frame-Options: DENY`, `frame-ancestors 'none'`, `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, `Permissions-Policy` (camera, mic, geolocation… off), COOP/CORP. |
| Fonts | Self-hosted — no requests to Google, no tracking. |
| API input | Zod schema validation against the shared option lists, length limits, trimmed strings, HTML-escaped when rendered into e-mail. |
| Uploads | Extension **and** MIME **and** magic-byte checks (`file-type`), 5 MB cap, two files max, memory-only, never written to disk. |
| Anti-abuse | Honeypot field, minimum fill time, per-IP rate limits (6 applications/hour, 12 enquiries/hour, 120 requests/15 min), optional Cloudflare Turnstile (`TURNSTILE_SECRET`). |
| Server | Helmet, `x-powered-by` removed, JSON body limit 32 KB, CORS allow-list, no PII in logs (only reference numbers). |
| Privacy | `/privacy` page, explicit consent checkboxes on both forms. |

Run `npm run audit` to check dependencies for known vulnerabilities.

---

## 7. Design system

**Palette — "Graphite & Ember"** (from the approved concept review):

| Token | Hex | Use |
| --- | --- | --- |
| `graphite-950` | `#0F161E` | Dark bands, footer |
| `graphite-900` | `#1B2632` | Headings, primary buttons |
| `ember` | `#F5A425` | Accent, CTA band, chips, dashes |
| `ember-700` (burnt amber) | `#B45309` | Accent text on light, hover |
| `paper` | `#F7F4ED` | Page background |
| `sand-50` / `sand-100` | `#F4F0E5` / `#EAE3D3` | Alternating bands, wells |
| `ink-900` / `ink-700` / `ink-500` | `#26231D` / `#3B372C` / `#6D6657` | Text |

**Type scale — golden ratio.** Sizes follow φ = 1.618 with √φ half-steps
(12.6 · 16 · 20.4 · 25.9 · 32.9 · 41.9 · 53.3 · 67.8 px) and body copy uses a φ line-height
(1.618). Display sizes are fluid (`clamp()`) so the same proportions hold from a 360 px phone to a
1440 px desktop. Tokens: `text-eyebrow`, `text-small`, `text-body`, `text-lead`, `text-h4` … `text-h1`,
`text-statement` in `tailwind.config.js`.

Fonts: Manrope (display) and Inter (body), variable, latin + latin-ext.

---

## 8. Images

Every photograph is shown at its **own aspect ratio** (`SiteImage` with `fit="natural"`), so
nothing is cropped on any screen — including the Nova logos placed in the corners of the pictures.
The pipeline produces WebP at 480/768/1024/1536 px plus a JPEG fallback, served through
`<picture>` with `srcset`/`sizes`; the browser downloads only the size it needs. Width and height
are always set, so the layout never jumps while images load.

To add or replace a photo: drop the master into `assets/images-source/`, run `npm run images`,
then reference its file name (without extension) as the `id` in `SiteImage`. Add a description in
`src/data/imageInventory.ts` for good alt text.

---

## 9. SEO

- Every route is **prerendered to static HTML** at build time (`scripts/prerender.mjs`), with its
  own `<title>`, description, canonical URL, Open Graph / Twitter tags and JSON-LD
  (Organization, WebSite, BreadcrumbList). Search engines and link previews see real content
  without executing JavaScript; visitors see content before the bundle loads.
- `sitemap.xml` and `robots.txt` are generated from the route list in `site.config.mjs`.
- A real `404.html` with a 404 status (no "soft 404s").
- Semantic HTML (landmarks, headings, breadcrumbs), skip link, focus management on navigation,
  visible keyboard focus, `prefers-reduced-motion` respected.

---

## 10. Content notes (unchanged from the original brief)

- The Memorandum of Association the copy is based on is a draft; copy describes *scope*, not
  delivered work.
- The Sirgitti (Bilaspur) hub is presented as **proposed**.
- No phone number or street address were supplied — `src/data/site.ts` → `company.phone`,
  `company.address`, `company.social` render automatically once filled in.
- `src/data/site.ts` → `newsItems` is empty; add items to populate `/news`.

---

## 11. Scripts

| Command | What it does |
| --- | --- |
| `npm run dev` / `npm run dev:api` | Local development (site / API). |
| `npm run build` | Typecheck → hosting files → bundle → prerender. Output in `dist/`. |
| `npm run preview` | Serve `dist/` with the API in mail dry-run mode (e-mails land in `server/outbox/`). |
| `npm run images` | Regenerate responsive images, icons and the image manifest. |
| `npm run hosting` | Regenerate sitemap, robots, `_headers`, `.htaccess`, `vercel.json`. |
| `npm run lint` / `npm run typecheck` / `npm run audit` | Quality gates. |
| `cd server && npm run test:mail` | Send a sample application e-mail using `server/.env`. |
