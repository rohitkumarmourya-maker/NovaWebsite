# Nova Ventures — Corporate Website & Application Platform

Production-ready web platform and enterprise digital presence for **Nova Ventures Innovation and Technology** (registered in Chhattisgarh, India).

The application features a modern React 19 frontend, full Supabase backend (PostgreSQL database, encrypted resume storage, and authenticated admin portal), an executive innovation showcase with 6 client-facing case studies, and complete Search Engine Optimization (SEO) with static prerendering for **https://www.novaventures.co.in**.

---

## 🚀 Quick Start for New Developers

### Prerequisites
- **Node.js 20+** or **Node.js 24.x** (recommended for native TypeScript support in server scripts)
- **npm 10+**
- Git

### 1. Installation
Clone the repository and install dependencies:
```bash
git clone https://github.com/codekrafthub/NovaWebsite.git
cd NovaWebsite
npm ci
```

### 2. Environment Configuration
Copy the example environment file:
```bash
cp .env.example .env
```

The default configuration is pre-wired with the public Supabase publishable key and official site URL:
```env
VITE_SITE_URL=https://www.novaventures.co.in
VITE_API_BASE=
VITE_SUPABASE_URL=https://hpyfgskyuuhcagncetjt.supabase.co
VITE_SUPABASE_ANON_KEY=sb_publishable_kwQg6AogweuOswu3TgrsvQ_S1BgJNQ2
VITE_SUPABASE_PUBLISHABLE_KEY=sb_publishable_kwQg6AogweuOswu3TgrsvQ_S1BgJNQ2
```

### 3. Running Locally
Run the frontend development server:
```bash
npm run dev
```
The application will be live at: **http://localhost:5173**

To run the fallback mail/form API concurrently:
```bash
npm run dev:api
```

### 4. Running Verification & Tests
Ensure code quality and regressions pass:
```bash
npm test              # Runs all 21 automated tests (form validations, MIME, routing)
npm run typecheck     # Strict TypeScript compiler verification
npm run build         # Production bundle + static SSR prerendering (23 routes)
```

---

## 🏗️ Architecture & Technology Stack

| Layer | Technology | Purpose |
| :--- | :--- | :--- |
| **Frontend UI** | **React 19**, **Vite 8** | High-performance SPA with instant HMR and build optimizations |
| **Language** | **TypeScript (Strict)** | End-to-end type safety across components, models, and forms |
| **Styling** | **Tailwind CSS** | Custom `Graphite & Ember` corporate design system with responsive typography |
| **Routing** | **React Router 6** | Declarative client routing + StaticRouter for build-time SSR prerendering |
| **Backend / DB** | **Supabase (PostgreSQL)** | Serverless database with Row-Level Security (RLS) for enquiries & jobs |
| **File Storage** | **Supabase Storage** | Private `resumes` bucket for CV uploads with temporary signed download URLs |
| **Auth** | **Supabase Auth** | Secure email/password session management for the internal Admin Portal |
| **API Fallback** | **Node / Express / Nodemailer** | Serverless function on Vercel (`api/index.js`) for email notifications |
| **SEO & Crawling**| **Static Prerendering** | 23 HTML pages generated at build time with Schema.org JSON-LD & canonical tags |

---

## 📁 Project Directory Structure

```
nova-ventures/
├── api/                         # Vercel serverless function entrypoint (/api)
├── dist/                        # Production build output and prerendered HTML
├── public/                      # Static assets served as-is (logos, icons, sitemap, robots)
│   ├── sitemap.xml              # Generated XML sitemap for https://www.novaventures.co.in
│   ├── robots.txt               # Search engine crawler policies
│   └── google9b60e066433f7152.html # Google Search Console ownership verification file
├── scripts/
│   ├── generate-hosting-files.mjs # Generates sitemap, robots.txt, .htaccess & vercel.json
│   └── prerender.mjs            # Static SSR generator for all public and admin entry routes
├── server/                      # Express API and Nodemailer delivery service
│   ├── src/                     # API routes, SMTP handler, attachment & resume validator
│   └── test/                    # API integration tests
├── shared/
│   └── business-order.json      # Canonical order of Nova's 6 industrial business verticals
├── src/
│   ├── components/              # Reusable UI widgets, navigation, header, footer, cards
│   │   ├── forms/               # ContactForm.tsx & ApplicationForm.tsx
│   │   ├── CaseStudies.tsx      # Executive Innovation Portfolio case studies renderer
│   │   └── Ui.tsx               # Design system primitives (buttons, badges, section titles)
│   ├── context/                 # AuthContext.tsx (Supabase authentication state & guards)
│   ├── data/                    # Business definitions, portfolio projects, site metadata
│   │   ├── businesses.ts        # The 6 business verticals and detailed capability lists
│   │   └── portfolio-projects.ts # 6 client-facing executive case studies
│   ├── lib/                     # Utilities: Supabase client, head manager (SEO), news data
│   │   ├── supabase.ts          # Configured createClient with resilient public fallback
│   │   └── head.tsx             # Document <head> manager, Open Graph & Canonical tags
│   ├── pages/                   # Application route pages
│   │   ├── admin/               # Admin Portal (Overview, Messages, Applications, Projects)
│   │   ├── Home.tsx             # Homepage with ecosystem explorer and hero sections
│   │   ├── About.tsx            # Corporate mission, leadership, and operational pillars
│   │   ├── Businesses.tsx       # Six core industrial sectors
│   │   ├── Capabilities.tsx     # Technical capability matrix
│   │   ├── Innovation.tsx       # Executive projects with categorized filtering
│   │   ├── Careers.tsx          # Career openings and internship opportunities
│   │   └── Contact.tsx          # Enquiries and partnership contact form
│   ├── App.tsx                  # Root application router with admin route guards
│   ├── entry-client.tsx         # Client hydration entrypoint
│   └── entry-server.tsx         # Build-time SSR prerender entrypoint
├── supabase_schema.sql          # Complete Supabase database schema, RLS policies & tables
├── tailwind.config.js           # Design tokens, colors (ember, graphite, sand) and fonts
├── vercel.json                  # Vercel deployment routing, security headers & SPA rewrites
└── package.json                 # Project dependencies, scripts, and build pipeline
```

---

## 🗄️ Database & Storage Setup (Supabase)

The backend runs on Supabase. If you need to initialize a new Supabase project:

1. Create a project at [supabase.com](https://supabase.com).
2. Open the **SQL Editor** in your Supabase project.
3. Paste and execute the contents of **`supabase_schema.sql`**.

This script sets up:
- **`contact_submissions`**: Table for inbound client & partnership enquiries.
- **`career_applications`**: Table for job and internship applications (with education, experience, role, and metadata).
- **`projects`**: Dynamic portfolio projects table.
- **`resumes` Storage Bucket**: Private storage for candidate CVs (PDF/DOCX up to 10 MB).
- **Row-Level Security (RLS)**:
  - *Public / Anonymous*: Can INSERT enquiries, applications, and upload resumes.
  - *Authenticated Admins*: Can SELECT, UPDATE, and DELETE entries, and generate signed URLs to download resumes.

---

## 💼 Executive Innovation Projects (Case Studies)

The Innovation showcase (`src/data/portfolio-projects.ts`) features 6 executive, client-facing engineering initiatives categorized into two core domains:

### 1. Applied AI & Machine Learning
1. **Automated Quality Inspection for Commercial Automotive Manufacturing** — High-speed computer vision for assembly lines with sub-millimeter anomaly detection.
2. **Omnichannel Conversational Commerce & Service Automation** — Multilingual LLM voice & chat orchestration across WhatsApp, Web, and telephony.
3. **AI-Driven Revenue Optimisation in Energy Trading** — Real-time price forecasting and algorithmic battery storage dispatch on wholesale power grids.
4. **Applied Data Science for Clinical Healthcare Risk** — Predictive biostatistical algorithms for hemodynamic instability in intensive patient care.

### 2. Digital Systems & Intelligent Automation
5. **Enterprise AI Telephony & Autonomous Voice Engineering** — Sub-second ultra-low latency voice agents for high-concurrency enterprise contact centers.
6. **High-Scale Search Infrastructure & Global Data Aggregation** — Distributed web crawling, document parsing, and vector indexing at terabyte scale.

---

## 🔐 Admin Portal & Management

* **Live Portal:** `https://www.novaventures.co.in/admin` (or `https://nova-final-nine.vercel.app/admin`)
* **Login URL:** `/admin/login`
* **Features:**
  * **Inbound Enquiries (`/admin/messages`):** Real-time inbox, search, filter by status (`new`, `read`, `replied`, `archived`), full message viewer, and direct reply email trigger.
  * **Job & Internship Applications (`/admin/applications`):** Review applicant profiles, filter by vertical, update review status, and securely download CVs via temporary signed URLs.
  * **Portfolio Management (`/admin/projects`):** Add, update, or feature executive case studies.

### Creating an Admin Account
1. Open your Supabase Dashboard &rarr; **Authentication &rarr; Users**.
2. Click **Add User &rarr; Create User**.
3. Enter email (e.g. `admin@novaventures.co.in`) and password.
4. Toggle **Auto Confirm User** to **ON**.
5. Log in directly at `/admin/login`.

---

## 🌐 Search Engine Optimization (SEO)

* **Canonical Domain:** Configured to **`https://www.novaventures.co.in`** across all canonical tags, Open Graph meta tags, Twitter cards, and sitemaps.
* **Google Search Console:** Ownership verified via `public/google9b60e066433f7152.html` and meta verification tag.
* **Sitemap:** Automatically generated at `public/sitemap.xml` with all 17 public routes.
* **Robots.txt:** Configured at `public/robots.txt` allowing full crawling of public routes while shielding `/api/` and `/admin/`.
* **Structured Data:** Embedded Schema.org `Corporation` and `WebSite` JSON-LD markup on every page.

---

## 🚢 Deployment

### Vercel
Deploy the repository root:
```bash
vercel --prod
```
* Build Command: `npm run build`
* Output Directory: `dist`
* Install Command: `npm ci`

The project includes custom headers, cleanUrls, and SPA fallbacks in `vercel.json` to ensure all routes (including `/admin`) respond with `HTTP 200` without 404 errors on page refresh.

---

## 📄 License & Confidentiality
All proprietary code, brand assets, and content belong to **Nova Ventures Innovation and Technology**. Developed by CodeKraftHub.
