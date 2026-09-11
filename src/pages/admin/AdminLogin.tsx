import { useState } from 'react'
import type { FormEvent } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { isSupabaseConfigured } from '../../lib/supabase'

export default function AdminLogin() {
  const { signIn, user } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  // Redirect if already logged in
  if (user) {
    navigate('/admin', { replace: true })
    return null
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError(null)
    if (!email.trim() || !password) {
      setError('Please enter both email and password.')
      return
    }

    setSubmitting(true)
    try {
      const { error } = await signIn(email.trim(), password)
      if (error) {
        setError(error.message || 'Invalid login credentials.')
      } else {
        navigate('/admin')
      }
    } catch {
      setError('An unexpected error occurred during sign in.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-graphite-950 px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8 rounded-3xl border border-white/10 bg-graphite-900 p-8 shadow-lift sm:p-10">
        <div className="text-center">
          <Link to="/" className="inline-block">
            <span className="font-display text-h3 font-bold tracking-wider text-white">
              NOVA <span className="text-ember">VENTURES</span>
            </span>
          </Link>
          <h2 className="mt-6 text-h3 font-bold text-white">Admin Portal</h2>
          <p className="mt-2 text-small text-white/60">
            Sign in to manage messages, job applications, and projects
          </p>
        </div>

        {!isSupabaseConfigured && (
          <div className="rounded-xl border border-ember/40 bg-ember/10 p-4 text-small text-ember-300">
            <p className="font-semibold">Supabase Keys Required</p>
            <p className="mt-1">
              Please configure <code className="rounded bg-black/40 px-1 py-0.5 font-mono">VITE_SUPABASE_ANON_KEY</code> in your environment file to authenticate.
            </p>
          </div>
        )}

        {error && (
          <div className="rounded-xl border border-danger-600/40 bg-danger-900/30 p-4 text-small text-danger-300" role="alert">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div className="space-y-4">
            <div>
              <label htmlFor="admin-email" className="block text-small font-medium text-white/80">
                Email address
              </label>
              <input
                id="admin-email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 block w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-white placeholder-white/40 focus:border-ember focus:outline-none focus:ring-1 focus:ring-ember text-body"
                placeholder="admin@novaventures.in"
              />
            </div>

            <div>
              <label htmlFor="admin-password" className="block text-small font-medium text-white/80">
                Password
              </label>
              <input
                id="admin-password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 block w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-white placeholder-white/40 focus:border-ember focus:outline-none focus:ring-1 focus:ring-ember text-body"
                placeholder="••••••••"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={submitting || !isSupabaseConfigured}
              className="flex w-full justify-center rounded-xl bg-ember py-3.5 text-body font-semibold text-graphite-950 transition hover:bg-ember-600 disabled:opacity-50"
            >
              {submitting ? 'Signing in…' : 'Sign in to Admin'}
            </button>
          </div>
        </form>

        <div className="text-center pt-2">
          <Link to="/" className="text-small text-white/50 hover:text-white underline-offset-4 hover:underline">
            &larr; Back to public website
          </Link>
        </div>
      </div>
    </div>
  )
}
