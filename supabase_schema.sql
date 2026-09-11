-- ==============================================================================
-- NOVA VENTURES - SUPABASE COMPLETE DATABASE SCHEMA & SECURITY POLICIES
-- Project ID: hpyfgskyuuhcagncetjt
-- Project Name: nova-ventures
-- ==============================================================================

-- 1. EXTENSIONS
create extension if not exists "pgcrypto";

-- ==============================================================================
-- 2. TABLE: contact_submissions
-- Stores inbound enquiries from the public contact form
-- ==============================================================================
create table if not exists public.contact_submissions (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  name text not null,
  email text not null,
  phone text,
  company text,
  subject text,
  message text not null,
  status text not null default 'new',
  source text default 'website'
);

-- Indexes for performance
create index if not exists contact_submissions_created_at_idx 
  on public.contact_submissions(created_at desc);
create index if not exists contact_submissions_status_idx 
  on public.contact_submissions(status);

-- Enable Row Level Security
alter table public.contact_submissions enable row level security;

-- Drop existing policies if any to ensure idempotency
drop policy if exists "Anyone can submit contact form" on public.contact_submissions;
drop policy if exists "Admins can view contact submissions" on public.contact_submissions;
drop policy if exists "Admins can update contact submissions" on public.contact_submissions;
drop policy if exists "Admins can delete contact submissions" on public.contact_submissions;

-- Public can submit enquiries
create policy "Anyone can submit contact form" 
  on public.contact_submissions 
  for insert 
  to anon, authenticated 
  with check (true);

-- Authenticated admins can view, update, delete
create policy "Admins can view contact submissions" 
  on public.contact_submissions 
  for select 
  to authenticated 
  using (true);

create policy "Admins can update contact submissions" 
  on public.contact_submissions 
  for update 
  to authenticated 
  using (true) 
  with check (true);

create policy "Admins can delete contact submissions" 
  on public.contact_submissions 
  for delete 
  to authenticated 
  using (true);


-- ==============================================================================
-- 3. TABLE: career_applications
-- Stores applications and resumes from the careers application form
-- ==============================================================================
create table if not exists public.career_applications (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  full_name text not null,
  email text not null,
  phone text,
  position text,
  experience text,
  skills text,
  resume_path text,
  resume_url text,
  cover_letter text,
  status text not null default 'new',
  source text default 'website',
  metadata jsonb default '{}'::jsonb
);

-- Indexes for performance
create index if not exists career_applications_created_at_idx 
  on public.career_applications(created_at desc);
create index if not exists career_applications_status_idx 
  on public.career_applications(status);

-- Enable Row Level Security
alter table public.career_applications enable row level security;

-- Drop existing policies if any to ensure idempotency
drop policy if exists "Anyone can submit career application" on public.career_applications;
drop policy if exists "Admins can view career applications" on public.career_applications;
drop policy if exists "Admins can update career applications" on public.career_applications;
drop policy if exists "Admins can delete career applications" on public.career_applications;

-- Public can submit applications
create policy "Anyone can submit career application" 
  on public.career_applications 
  for insert 
  to anon, authenticated 
  with check (true);

-- Authenticated admins can view, update, delete
create policy "Admins can view career applications" 
  on public.career_applications 
  for select 
  to authenticated 
  using (true);

create policy "Admins can update career applications" 
  on public.career_applications 
  for update 
  to authenticated 
  using (true) 
  with check (true);

create policy "Admins can delete career applications" 
  on public.career_applications 
  for delete 
  to authenticated 
  using (true);


-- ==============================================================================
-- 4. TABLE: projects
-- Portfolio and project case studies management
-- ==============================================================================
create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  title text not null,
  slug text unique not null,
  category text,
  short_description text,
  full_description text,
  technologies jsonb default '[]'::jsonb,
  image_url text,
  gallery jsonb default '[]'::jsonb,
  featured boolean default false,
  display_order integer default 0,
  published boolean default true
);

-- Indexes for performance
create index if not exists projects_display_order_idx 
  on public.projects(display_order);
create index if not exists projects_slug_idx 
  on public.projects(slug);
create index if not exists projects_published_idx 
  on public.projects(published);

-- Enable Row Level Security
alter table public.projects enable row level security;

-- Drop existing policies if any to ensure idempotency
drop policy if exists "Anyone can view published projects" on public.projects;
drop policy if exists "Admins can view all projects" on public.projects;
drop policy if exists "Admins can insert projects" on public.projects;
drop policy if exists "Admins can update projects" on public.projects;
drop policy if exists "Admins can delete projects" on public.projects;

-- Public visitor can view published projects; Admins can view all
create policy "Anyone can view published projects" 
  on public.projects 
  for select 
  to anon, authenticated 
  using (published = true or auth.role() = 'authenticated');

-- Authenticated admins can insert, update, delete
create policy "Admins can insert projects" 
  on public.projects 
  for insert 
  to authenticated 
  with check (true);

create policy "Admins can update projects" 
  on public.projects 
  for update 
  to authenticated 
  using (true) 
  with check (true);

create policy "Admins can delete projects" 
  on public.projects 
  for delete 
  to authenticated 
  using (true);


-- ==============================================================================
-- 5. STORAGE: resumes Bucket (Private)
-- ==============================================================================
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'resumes',
  'resumes',
  false,
  10485760, -- 10 MB limit
  array[
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ]
)
on conflict (id) do update set
  public = false,
  file_size_limit = 10485760,
  allowed_mime_types = array[
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ];

-- Drop existing storage policies if any
drop policy if exists "Anyone can upload resumes" on storage.objects;
drop policy if exists "Admins can view resumes" on storage.objects;
drop policy if exists "Admins can delete resumes" on storage.objects;

-- Allow visitors to upload their resumes to the resumes bucket
create policy "Anyone can upload resumes" 
  on storage.objects 
  for insert 
  to anon, authenticated 
  with check (bucket_id = 'resumes');

-- Only authenticated users (admins) can view/download resumes
create policy "Admins can view resumes" 
  on storage.objects 
  for select 
  to authenticated 
  using (bucket_id = 'resumes');

create policy "Admins can delete resumes" 
  on storage.objects 
  for delete 
  to authenticated 
  using (bucket_id = 'resumes');


-- ==============================================================================
-- 6. INITIAL SEED DATA FOR PROJECTS (PORTFOLIO)
-- ==============================================================================
insert into public.projects (title, slug, category, short_description, full_description, technologies, featured, display_order, published)
values
(
  'Automated Quality Inspection for Commercial Automotive Manufacturing',
  'automotive-quality-inspection',
  'Applied AI & Machine Learning',
  'High-speed automated optical inspection pipeline combining deep learning computer vision and edge computing for real-time defect classification on automotive assembly lines.',
  'Engineered an edge-accelerated computer vision inspection system integrating multi-angle industrial strobed illumination, high-speed line-scan image capture, and customized convolutional defect segmentation models. Detected defects trigger sub-second pneumatic reject actuators with automated defect telemetry logged to the manufacturing execution system.',
  '["Python", "PyTorch", "OpenCV", "TensorRT", "FastAPI", "Edge Computing", "Docker", "Industrial PLC"]'::jsonb,
  true,
  1,
  true
),
(
  'Omnichannel Conversational Commerce & Service Automation',
  'omnichannel-conversational-commerce',
  'Digital Systems & Intelligent Automation',
  'Enterprise conversational AI architecture orchestrating multi-channel customer communications, automated transactional workflows, and context-aware CRM synchronization.',
  'Architected a multi-tenant conversational automation platform combining intent recognition, contextual knowledge base retrieval, and transactional webhook integrations. The system handles automated customer inquiries, catalog browsing, and service bookings, transferring seamlessly to live agents with full conversation context when needed.',
  '["TypeScript", "Node.js", "Python", "FastAPI", "Redis", "PostgreSQL", "WebSockets", "RAG / Vector Search"]'::jsonb,
  true,
  2,
  true
),
(
  'AI-Driven Revenue Optimisation in Energy Trading',
  'energy-trading-revenue-optimisation',
  'Applied AI & Machine Learning',
  'Predictive pricing models and load-dispatch optimization systems for wholesale energy market arbitrage, virtual power plants, and battery asset scheduling.',
  'Engineered a predictive energy analytics platform combining ensemble time-series models for day-ahead nodal price forecasting with constrained mixed-integer linear programming (MILP) solvers. The system dynamically computes charge, hold, and discharge schedules for energy storage assets to maximize revenue while honoring battery lifecycle degradation constraints.',
  '["Python", "LightGBM", "XGBoost", "SciPy", "FastAPI", "PostgreSQL", "Apache Kafka", "Time-Series ML"]'::jsonb,
  true,
  3,
  true
),
(
  'Enterprise AI Telephony & Autonomous Voice Engineering',
  'enterprise-ai-telephony-voice',
  'Digital Systems & Intelligent Automation',
  'Ultra-low latency voice agent platform capable of full-duplex conversational telephony, intelligent call triage, and autonomous enterprise voice workflows.',
  'Engineered an autonomous voice agent pipeline operating over SIP telephony. The architecture pairs streaming voice-activity detection (VAD), sub-200ms speech-to-text, low-latency LLM reasoning with tool calling, and human-natural neural speech synthesis, enabling fluid conversations with natural interruption handling.',
  '["Python", "WebSockets", "SIP / VoIP Telephony", "FastAPI", "Redis", "Streaming Audio", "Deepgram", "ElevenLabs"]'::jsonb,
  false,
  4,
  true
),
(
  'High-Scale Search Infrastructure & Global Data Aggregation',
  'high-scale-search-data-infrastructure',
  'Digital Systems & Intelligent Automation',
  'Distributed high-throughput web data extraction, document transformation, and neural semantic search engine built for web-scale market intelligence.',
  'Designed a distributed, fault-tolerant crawler and neural indexing pipeline. The architecture distributes scraping tasks across ephemeral worker pools using headless browser automation, deduplicates text via MinHash LSH, and indexes documents into a hybrid lexical BM25 and dense vector search engine.',
  '["Go", "Python", "Elasticsearch", "Vector DB", "RabbitMQ", "Docker", "Redis", "Playwright"]'::jsonb,
  false,
  5,
  true
),
(
  'Applied Data Science for Clinical Healthcare Risk',
  'clinical-healthcare-risk-prediction',
  'Applied AI & Machine Learning',
  'Machine learning decision-support platform delivering real-time patient physiological risk stratification for proactive cardiovascular and hemodynamic care.',
  'Developed an explainable clinical decision-support pipeline trained on longitudinal physiological vital sign time-series, lab biomarkers, and clinical patient profiles. The system generates calibrated risk trajectory scores and provides SHAP-based feature attributions, alerting clinicians to impending hemodynamic deterioration hours before adverse events occur.',
  '["Python", "Scikit-Learn", "SHAP", "FastAPI", "PostgreSQL", "FHIR / HL7", "Docker", "Explainable AI"]'::jsonb,
  true,
  6,
  true
)
on conflict (slug) do update set
  title = excluded.title,
  category = excluded.category,
  short_description = excluded.short_description,
  full_description = excluded.full_description,
  technologies = excluded.technologies,
  featured = excluded.featured,
  display_order = excluded.display_order,
  published = excluded.published;
