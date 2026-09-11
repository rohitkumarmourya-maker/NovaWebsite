import { createClient } from '@supabase/supabase-js'

export const SUPABASE_URL = (
  (import.meta.env.VITE_SUPABASE_URL as string | undefined) ||
  'https://hpyfgskyuuhcagncetjt.supabase.co'
).replace(/\/+$/, '')

export const SUPABASE_KEY = (
  (import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined) ||
  (import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string | undefined) ||
  'sb_publishable_kwQg6AogweuOswu3TgrsvQ_S1BgJNQ2'
).trim()

// Placeholder token prevents createClient from crashing during build/SSR prerender when env key is not yet set.
const activeKey = SUPABASE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.e30.placeholder'

export const isSupabaseConfigured = Boolean(SUPABASE_KEY && SUPABASE_KEY !== 'PASTE_PUBLIC_PUBLISHABLE_KEY_HERE')

export const supabase = createClient(SUPABASE_URL, activeKey, {
  auth: {
    persistSession: typeof window !== 'undefined',
    autoRefreshToken: typeof window !== 'undefined',
    detectSessionInUrl: typeof window !== 'undefined',
  },
})

export type ContactSubmission = {
  id?: string
  created_at?: string
  name: string
  email: string
  phone?: string | null
  company?: string | null
  subject?: string | null
  message: string
  status?: 'new' | 'read' | 'replied' | 'archived'
  source?: string
}

export type CareerApplication = {
  id?: string
  created_at?: string
  full_name: string
  email: string
  phone?: string | null
  position?: string | null
  experience?: string | null
  skills?: string | null
  resume_path?: string | null
  resume_url?: string | null
  cover_letter?: string | null
  status?: 'new' | 'reviewing' | 'shortlisted' | 'rejected' | 'hired'
  source?: string
  metadata?: Record<string, unknown>
}

export type Project = {
  id?: string
  created_at?: string
  title: string
  slug: string
  category?: string | null
  short_description?: string | null
  full_description?: string | null
  technologies?: string[]
  image_url?: string | null
  gallery?: string[]
  featured?: boolean
  display_order?: number
  published?: boolean
}

/**
 * Upload a resume file to the private 'resumes' Supabase Storage bucket.
 * Generates a unique, sanitized path: resumes/<timestamp>-<random>-<clean-filename>
 */
export async function uploadResumeFile(file: File): Promise<{ path: string } | { error: string }> {
  if (!isSupabaseConfigured) {
    return { error: 'Supabase is not configured yet with a valid API key.' }
  }

  const cleanName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_')
  const uniqueId = typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
  const filePath = `resumes/${uniqueId}-${cleanName}`

  const { data, error } = await supabase.storage
    .from('resumes')
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: false,
    })

  if (error) {
    return { error: error.message }
  }

  return { path: data.path }
}

/**
 * Generates a temporary signed download URL for an authenticated admin.
 * URL expires after the given duration in seconds (default 600s = 10 minutes).
 */
export async function getResumeSignedUrl(resumePath: string, expiresIn = 600): Promise<string | null> {
  if (!resumePath) return null
  const { data, error } = await supabase.storage
    .from('resumes')
    .createSignedUrl(resumePath, expiresIn)

  if (error || !data?.signedUrl) {
    console.error('Failed to create signed URL:', error)
    return null
  }

  return data.signedUrl
}
