# Validation record

Validated on 10 September 2026 with Node.js 24.15.0 and npm 11.12.1. The supplied ZIP was extracted into a separate `nova-ventures` workspace. No live deployment was changed and no email was sent to an external inbox.

## Build and automated verification

| Check | Result |
| --- | --- |
| Locked dependency installation | `npm ci` succeeded; root installation also installs the API dependencies. |
| TypeScript | `npm run typecheck` passed. |
| Lint | `npm run lint` completed with no errors and seven existing React warnings: five mixed-export warnings in `src/lib/head.tsx`, plus state-in-effect warnings in `Header.tsx` and `ScrollReveal.tsx`. |
| Automated tests | `npm test`: 21 passed, zero failed. |
| Production build | `npm run build` passed; 18 HTML pages prerendered, including the 404 page. |
| Dependency audit | `npm run audit`: zero reported production vulnerabilities in both frontend and API dependency trees at validation time. |
| Design specification | Design lint passed with zero warnings. |

The combined `npm run check` passed. After improving focus and scroll behavior on successful form submissions, TypeScript, the production build and both browser form flows passed again.

## API and email tests

The committed tests are `server/test/forms.test.js` and `tests/content.test.mjs`. SMTP integration tests use a loopback SMTP server and parse the actual MIME messages. They verify:

- Contact mail sender and SMTP envelope use `codekraft.hub@gmail.com`, the configured contact recipient receives the message, and Reply-To uses the enquirer's address.
- Application mail reaches the configured careers recipient with both CV and cover-letter attachments intact; subject and reference headers are present.
- Optional applicant acknowledgement is awaited. A rejected acknowledgement does not invalidate an already accepted application.
- SMTP rejection or missing credentials returns a useful 503 response without leaking credentials or returning a success reference.
- Invalid, malformed and unsupported requests receive appropriate 4xx responses. Missing documents, spoofed documents, truncated uploads and arbitrary ZIP files renamed DOCX are rejected. Combined attachment limits are enforced.
- Unknown, archived and mismatched positions are rejected. Valid fast autofill is accepted. Honeypot submissions do not send mail.
- CORS enforcement, JSON 429 rate-limit responses, required TLS configuration, sender-account restrictions and production preview-mode rejection work.
- Canonical category order, unique job metadata, shared four-item capabilities data, separate careers routing, typography cleanup and homepage de-duplication are consistent.
- Published news and case-study data must satisfy the documented constraints; draft metrics cannot be published as measured outcomes.

The loopback SMTP emulator disables STARTTLS only within its test transport. Application transport configuration requires TLS in normal operation.

## Browser verification

Playwright controlled Chromium against the actual production frontend build served by the local Express API.

- All 17 public routes were visited at widths of 390 and 1440 pixels: 34 route checks. Each returned HTTP 200, contained one main H1, had no horizontal overflow, and had no broken visible images. No browser runtime errors occurred.
- Footer business links matched the required six-category sequence at both widths. Careers contained no embedded form and no em dashes in its main content.
- A missing page returned HTTP 404. An unknown application-role link displayed an unavailable-role state without rendering the application form.
- The mobile application flow verified direct-link role preselection, client validation, a real PDF upload, pending disabled controls, HTTP 200 preview submission and a reference confirmation. The confirmation receives keyboard focus and scrolls into view.
- The mobile contact flow verified client validation, a simulated 503 response, retained values and an email fallback. A subsequent actual local preview submission succeeded. Both form controls and the external category buttons were disabled while sending; the confirmation receives focus and scrolls into view.
- Screenshots of the home hero, leadership section, Terms page, Civil & Construction hero, careers benefits and both success panels were inspected for layout and legibility.

The simulated 503 and intentional 404 produce expected HTTP error entries in the browser console. They are separate from JavaScript runtime errors. The broad layout pass used the reduced-motion preference to keep below-fold reveal content visible for capture. Form submissions used explicitly labeled local previews, never Gmail.

## Deployment and content configuration still required

1. Supply the Google app password for `codekraft.hub@gmail.com` through `SMTP_PASS` or its documented fallback. Confirm the Nova recipient inbox. No credentials were supplied with this task.
2. Deploy the repository root to Vercel so `api/index.js` is included. The generated Vercel configuration and shared Express handler are implemented, but an actual Vercel function build/deployment and Gmail inbox delivery were not performed. Follow the deployment and live mail verification steps in the root README.
3. Replace the two owner-requested pending leadership profiles with approved names, designations, biographies and photographs when available.
4. Keep the prepared case studies in draft until actual project evidence is available. The owner requested future publication, so the public IT and Innovation pages currently show a coming-soon message.

SMTP acceptance is not a guarantee of final inbox delivery. Per-instance rate limiting and the lack of a durable idempotency store are documented in the README so deployment operators can account for them.
