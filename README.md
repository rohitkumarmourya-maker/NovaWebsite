# Nova Ventures

Corporate website for Nova Ventures Innovation and Technology. React 19, strict TypeScript, Vite 8, Tailwind CSS, React Router and a shared Express/Nodemailer API. All public routes are prerendered during the build.

## Setup

Use **Node.js 24.x** and npm. Node 24 runs the shared, erasable TypeScript job catalogue in the API without a second compilation pipeline. These commands work from the repository root on macOS, Linux and Windows:

```bash
npm ci
npm run build
npm run preview
```

`npm ci` also installs the API's locked dependencies. Preview serves the build at `http://localhost:8787`, saves test mail in `server/outbox/`, and explicitly reports that no email was sent. Preview mode is prohibited on Vercel and when `NODE_ENV=production`.

For development, run these in two terminals:

```bash
npm run dev
```

```bash
npm run dev:api
```

The site runs at `http://localhost:5173`; Vite forwards `/api` to port 8787. To use local mail previews in development, copy `server/.env.example` to `server/.env`, set `NODE_ENV=development` and `MAIL_DRY_RUN=true`. Never use real applicant data in local previews. To send mail instead, configure SMTP as below.

## Gmail SMTP: codekraft.hub@gmail.com

1. Sign in to the Google account **codekraft.hub@gmail.com** and enable 2-Step Verification.
2. Open Google Account > Security > App passwords. Create an app password for the Nova website. If this setting is unavailable, check account restrictions or ask the account administrator. Use an app password, not the normal account password. See [Google's app password instructions](https://support.google.com/accounts/answer/185833).
3. For local or standalone Node hosting, copy `server/.env.example` to `server/.env`. Its path is resolved relative to the server code, regardless of the shell working directory. On Vercel, configure the same variables in Project Settings > Environment Variables.
4. Set `SMTP_USER=codekraft.hub@gmail.com`, `SMTP_HOST=smtp.gmail.com`, `SMTP_PORT=465`, `SMTP_SECURE=true`, and paste the app password into `SMTP_PASS`. Whitespace in the password is removed. `GMAIL_APP_PASSWORD` is a fallback only when `SMTP_PASS` is empty.
5. Set `MAIL_TO` to the Nova inbox. The existing project inbox, **novaventures.nvit@gmail.com**, is the default. Set `CAREERS_TO` for a separate careers inbox, such as `careers@novaventures.co.in`, only after confirming that inbox exists. Set `CONTACT_TO` for a separate enquiries inbox.
6. Set `SITE_URL=https://nova-final-nine.vercel.app` or the actual production domain. Keep `MAIL_DRY_RUN=false` in production. Optionally set `SEND_ACKNOWLEDGEMENT=true` to send applicant confirmations.
7. Restart the Node server or redeploy Vercel after changes. From the repository root, the following command deliberately sends a sample application email to the configured careers recipient:

```bash
npm --prefix server run test:mail
```

Check both inbox and spam folders and confirm the attachment opens. Do this yourself with the real account credentials; automated tests use a loopback SMTP emulator and do not contact Gmail.

The SMTP sender is fixed in code to `Nova Ventures Website <codekraft.hub@gmail.com>`. `MAIL_FROM` cannot override it. Gmail authentication must use that same account. Port 587 is also supported with `SMTP_SECURE=false`; STARTTLS is required. TLS certificate checking remains enabled. See [Nodemailer SMTP configuration](https://nodemailer.com/smtp).

Recipient precedence:

| Message | Precedence, first nonempty value wins |
| --- | --- |
| Job/internship application | `CAREERS_TO`, `MAIL_TO`, `NOVA_RECIPIENT_EMAIL`, `novaventures.nvit@gmail.com` |
| Contact enquiry | `CONTACT_TO`, `MAIL_TO`, `NOVA_RECIPIENT_EMAIL`, `novaventures.nvit@gmail.com` |
| Applicant acknowledgement | The validated applicant address; replies go to the careers recipient |

Recipient variables accept plain email addresses separated by commas. Applicant addresses are used in `Reply-To`, never as the SMTP sender. No credentials belong in a `VITE_` variable, committed file, client bundle or this README.

## Vercel deployment

Deploy the **repository root**, not just `dist/`. The root contains both the static site and `api/index.js`.

1. Import the repository into Vercel and select the repository root containing `package.json`. Choose Node.js **24.x** in project settings.
2. The checked-in `vercel.json` specifies framework `vite`, install command `npm ci`, build command `npm run build` and output directory `dist`.
3. Set public `VITE_SITE_URL` to the live site URL. Leave `VITE_API_BASE` empty to use the included same-origin functions.
4. Configure the SMTP and recipient variables above for Production and, if wanted, Preview environments. Keep `SERVE_STATIC=false` on Vercel. Set `TRUST_PROXY=1` for its reverse proxy.
5. Deploy, then request `/api/health`. It must return JSON identifying `nova-ventures-api`, not an HTML page. This checks API routing, not SMTP availability.
6. Verify both forms with real credentials. Open `/careers/apply?position=software-engineer` directly and refresh it to verify deep-link hosting and preselection. Also check `/terms-of-service`.

The hosting generator preserves `/api/:path*` routing to the Express function, includes shared data and the email logo in its bundle, and generates explicit rewrites for prerendered pages. The serverless import never calls `listen()`. Function duration is 60 seconds; SMTP operations have bounded timeouts and optional acknowledgements are awaited.

**Attachment limit:** 4 MiB (4,194,304 bytes) combined across CV and optional cover letter, with two files maximum. Text fields and multipart framing fit below [Vercel's 4.5 MB request limit](https://vercel.com/docs/functions/limitations#request-body-size). The frontend, API and shared configuration enforce the same limit. To support larger uploads, first introduce direct object-storage uploads or use a hosting design that supports them; increasing the file limit alone will break Vercel submissions.

Rate limits are per API instance: 6 applications/hour, 12 enquiries/hour and 120 API requests/15 minutes per IP. For a horizontally scaled Vercel deployment, configure deployment-level firewall rate limits as well, or replace the in-memory store with a shared store. Do not treat instance limits as a global quota. Tune `TRUST_PROXY` to the actual trusted proxy topology on other hosts.

## Standalone or separate API hosting

For one Node process, build the site, set `SERVE_STATIC=true` in `server/.env`, configure SMTP, and run:

```bash
npm --prefix server start
```

Serve it behind HTTPS. The server provides both prerendered pages and `/api` with real 404 responses. For a separate API origin, set public `VITE_API_BASE` before rebuilding and set API `ALLOWED_ORIGINS` to the exact frontend origin. The generated CSP permits that configured API origin. Run API `npm ci` from `server/` after its lockfile changes. A static-only upload cannot send email without an API.

## Add, modify or archive job postings

**Canonical catalogue:** `shared/careers-data.ts`. `src/lib/careers-data.ts` exposes the sorted, strongly typed browser data; `server/src/validate.js` imports the same catalogue. `src/data/careers.ts` is a compatibility re-export. There is no second list of openings to synchronize.

1. Open `shared/careers-data.ts` and add an object to `jobPostings`. Supply every `Opening` field: `id`, `title`, `vertical`, `type`, `location`, `summary`, `status`.
2. Use a unique, stable lowercase hyphenated `id`. Titles must also be unique because the form displays and submits them. Choose a typed `vertical` and `type` (`Job`, `Internship`, or `Job / Internship`).
3. Use `status: 'open'` for a current opening, or `'upcoming'` to accept interest for a future role. The listing visibly labels upcoming positions.
4. To modify a role, edit its object and preserve its ID so links keep working. Correctly setting `type` also controls whether the form accepts internship or job applications.
5. To archive, change `status` to `'archived'`. The job disappears from listings and dropdowns, direct application links explain that it is unavailable, and the API rejects its submitted title. Keep the object to retain its history.
6. Run `npm run check`, restart the local API, and rebuild/redeploy the frontend and API together. The direct link is `/careers/apply?position=<the-job-id>`. Test that link and the general `/careers/apply` route.

Edit qualifications, notice periods, durations, referral sources, text limits and upload limits in `shared/form-options.json`. Hiring-process and employer copy lives in `src/lib/careers-data.ts`. The six existing job records came from the supplied project; review their continuing availability before deployment.

## Business order and capabilities

`shared/business-order.json` is the single ordering and naming source:

1. Manufacturing
2. IT
3. HEMM
4. Healthcare Products
5. Skill Development
6. Civil & Construction

Navigation, homepage cards, explorer, ecosystem, related businesses, forms and hosting routes derive from it. Detailed business copy and hero/gallery image mappings live in `src/data/businesses.ts`. URLs remain compatible with the original project, including `/businesses/it-software` and `/businesses/hemm-heavy-equipment`.

Both Home and Capabilities use all four entries in `src/lib/capabilities-data.ts`. Add or modify a capability in that module and both views update. The duplicate Explore Our Businesses section now lives on About; the Capability & Opportunity section has been removed. The approved edits remove "Private Limited" designations from the site and Sirgitti from location references. The entity name is Nova Ventures Innovation and Technology across the site and company metadata.

## Leadership profiles

Edit `src/lib/leadership-data.ts`. Two explicitly pending dummy profiles are included at the owner's request. Replace each `fullName`, `designation` and `bio` with approved details. Add a local photo under `public/images/`, set `photo` to its `/images/...` URL, and change `status` to `'published'`. A null photo renders an intentional portrait placeholder. Add more records as needed; the grid is responsive. Pending profiles are never represented as verified named directors.

## News and updates

Edit `src/lib/news-data.ts`; presentation is in `src/pages/News.tsx`.

1. Add a `NewsItem` to `newsEntries` with a stable unique `id`, ISO date (`YYYY-MM-DD`), category, title and excerpt.
2. Optionally provide an `https://` link to the approved full announcement.
3. Keep `status: 'draft'` while editing. Set it to `'published'` to display it. Use `'archived'` to remove it while preserving its history.
4. Run `npm run check` and rebuild/redeploy. Published entries sort newest first and the homepage teaser updates automatically.

No news was supplied, so the published list intentionally stays empty.

## IT case studies: prepared for future publication

`src/lib/case-studies-data.ts` defines the typed schema and three complete **draft, illustrative planning examples**. No Nova client outcomes were supplied. The public IT and Innovation pages therefore show “Our project stories are coming soon.” Draft stories are excluded from the published list and must not be represented as delivered projects.

For each verified project, replace the draft's overview, problem, solution, technology stack, architecture layers and impact metrics. Each impact needs its value, label, measurement basis and `kind: 'measured'`. Fill `evidence` with an approved public description of the measurement source and period; do not put confidential client data into frontend files. Only then set `status: 'published'`. `npm test` rejects published stories lacking evidence or containing target metrics. Keep all unverified records in draft.

The schema was informed by the [CodeKraftHub reference](https://github.com/codekrafthub/codekrafthub.github.io/blob/main/lib/case-studies-data.ts); its client claims and metrics were not copied or attributed to Nova.

## Images and design

`DESIGN.md` documents the existing Graphite & Ember identity. Tailwind tokens remain in `tailwind.config.js`.

Business cards and detail photography use consistent **3:2** containers with `object-cover`; `SiteImage fit="natural"` preserves full artwork where needed. Explorer images use a separate gallery mapping. Civil & Construction and Healthcare Products have distinct header and gallery images. The two new illustrations are self-hosted; provenance and generation prompts are in `docs/ASSETS.md`.

To add an image: place a master PNG/JPG in `assets/images-source/`, add descriptive metadata in `src/data/imageInventory.ts`, then run:

```bash
npm run images
npm run build
```

The pipeline writes responsive WebP variants, JPEG fallbacks and `src/data/imageManifest.ts`. Do not hand-edit the generated manifest. Use local image URLs for leadership photos because the CSP intentionally blocks third-party image hosts.

## Terms and privacy

The new `/terms-of-service` page uses original Nova copy with a numbered structure and responsive table of contents, informed by the supplied [layout reference](https://codekrafthub.in/terms-of-service). The permanent footer link appears alongside Privacy. Terms cover website use; commercial engagements are governed by separate agreements. Privacy describes the codekraft sender, Nova inbox routing and the technical data included in internal emails. Have the company confirm its legal wording and retention practices before publication.

## Validation and troubleshooting

```bash
npm run typecheck
npm run lint
npm test
npm run build
npm run audit
```

`npm run check` runs typecheck, lint, tests and build. Tests use a local SMTP emulator to verify real MIME construction, SMTP acceptance and rejection, sender/envelope/recipients, Reply-To, attachments, acknowledgements, validation, upload limits, bot handling and CORS. No live email is sent by `npm test`.

| Symptom | Check |
| --- | --- |
| `/api/health` is HTML or 404 | Deploy the repository root with `api/index.js` and the generated `vercel.json`; a `dist/`-only deployment has no mail service. |
| Form returns 503 | Verify SMTP app password, exact sender account, SMTP host/port and recipient addresses in the deployment environment. Logs expose diagnostic codes, not credentials. |
| Browser reports unreachable service | Check `VITE_API_BASE`, CSP, `ALLOWED_ORIGINS`, DNS and deployment routing. Build again after changing public variables. |
| 413 upload error | Keep all attachments combined under 4 MB. |
| 422 validation error | Review highlighted fields, file content, supported job type and current catalogue. Renaming a ZIP to DOCX does not make it a valid resume. |
| 429 | Wait for the rate-limit window, then retry. |
| Preview success but no email | Preview writes to the local outbox and never delivers mail. Use configured SMTP in production. |
| Applicant received no acknowledgement | Confirm `SEND_ACKNOWLEDGEMENT=true`; delivery failure of that optional message does not invalidate an accepted application. |

SMTP acceptance is not proof of inbox delivery. The UI confirms the service accepted the message, preserves a reference and keeps data on failures. If a network timeout interrupts an already accepted message, check for a confirmation before retrying; there is no durable idempotency store in this email-only implementation.
