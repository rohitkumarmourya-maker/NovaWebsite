import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase, isSupabaseConfigured } from '../../lib/supabase'

export default function AdminOverview() {
  const [stats, setStats] = useState({
    newMessages: 0,
    totalMessages: 0,
    newApplications: 0,
    totalApplications: 0,
    totalProjects: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!isSupabaseConfigured) {
      setLoading(false)
      return
    }

    async function loadStats() {
      try {
        const [
          { count: totalMessages },
          { count: newMessages },
          { count: totalApplications },
          { count: newApplications },
          { count: totalProjects },
        ] = await Promise.all([
          supabase.from('contact_submissions').select('*', { count: 'exact', head: true }),
          supabase.from('contact_submissions').select('*', { count: 'exact', head: true }).eq('status', 'new'),
          supabase.from('career_applications').select('*', { count: 'exact', head: true }),
          supabase.from('career_applications').select('*', { count: 'exact', head: true }).eq('status', 'new'),
          supabase.from('projects').select('*', { count: 'exact', head: true }),
        ])

        setStats({
          totalMessages: totalMessages || 0,
          newMessages: newMessages || 0,
          totalApplications: totalApplications || 0,
          newApplications: newApplications || 0,
          totalProjects: totalProjects || 0,
        })
      } catch (err) {
        console.error('Error fetching admin overview metrics:', err)
      } finally {
        setLoading(false)
      }
    }

    loadStats()
  }, [])

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-h2 font-bold text-graphite-900">Dashboard Overview</h1>
        <p className="mt-1 text-body text-ink-500">
          Welcome to the Nova Ventures backend management console.
        </p>
      </div>

      {loading ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-32 animate-pulse rounded-2xl bg-white p-6 shadow-soft" />
          ))}
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {/* New Enquiries */}
          <div className="rounded-2xl border border-graphite-900/10 bg-white p-6 shadow-soft">
            <p className="text-small font-semibold uppercase tracking-wider text-ink-500">New Messages</p>
            <div className="mt-3 flex items-baseline justify-between">
              <span className="font-display text-h1 font-bold text-graphite-900">{stats.newMessages}</span>
              <span className="rounded-full bg-ember/15 px-2.5 py-1 text-tiny font-bold text-ember-700">
                {stats.totalMessages} Total
              </span>
            </div>
            <Link
              to="/admin/messages"
              className="mt-4 block text-small font-semibold text-ember-700 hover:underline"
            >
              View all messages &rarr;
            </Link>
          </div>

          {/* New Career Applications */}
          <div className="rounded-2xl border border-graphite-900/10 bg-white p-6 shadow-soft">
            <p className="text-small font-semibold uppercase tracking-wider text-ink-500">New Applications</p>
            <div className="mt-3 flex items-baseline justify-between">
              <span className="font-display text-h1 font-bold text-graphite-900">{stats.newApplications}</span>
              <span className="rounded-full bg-success-600/15 px-2.5 py-1 text-tiny font-bold text-success-700">
                {stats.totalApplications} Total
              </span>
            </div>
            <Link
              to="/admin/applications"
              className="mt-4 block text-small font-semibold text-ember-700 hover:underline"
            >
              View all applications &rarr;
            </Link>
          </div>

          {/* Projects / Case Studies */}
          <div className="rounded-2xl border border-graphite-900/10 bg-white p-6 shadow-soft">
            <p className="text-small font-semibold uppercase tracking-wider text-ink-500">Portfolio Projects</p>
            <div className="mt-3 flex items-baseline justify-between">
              <span className="font-display text-h1 font-bold text-graphite-900">{stats.totalProjects}</span>
              <span className="rounded-full bg-graphite-900/10 px-2.5 py-1 text-tiny font-bold text-graphite-700">
                Managed
              </span>
            </div>
            <Link
              to="/admin/projects"
              className="mt-4 block text-small font-semibold text-ember-700 hover:underline"
            >
              Manage projects &rarr;
            </Link>
          </div>

          {/* Security & RLS */}
          <div className="rounded-2xl border border-graphite-900/10 bg-white p-6 shadow-soft">
            <p className="text-small font-semibold uppercase tracking-wider text-ink-500">Access Security</p>
            <div className="mt-3 flex items-center gap-2">
              <span className="h-3 w-3 rounded-full bg-success-600" />
              <span className="text-body font-semibold text-graphite-900">RLS Active</span>
            </div>
            <p className="mt-2 text-tiny text-ink-500">
              Visitor submissions allowed; private reads protected by Supabase Auth.
            </p>
          </div>
        </div>
      )}

      {/* Quick Navigation Cards */}
      <div className="grid gap-6 sm:grid-cols-3">
        <Link
          to="/admin/messages"
          className="group rounded-2xl border border-graphite-900/10 bg-white p-6 shadow-soft transition hover:border-ember"
        >
          <h3 className="text-h4 font-bold text-graphite-900 group-hover:text-ember-700">
            Contact Submissions
          </h3>
          <p className="mt-2 text-small text-ink-700">
            Review enquiries received via the website contact form, change response statuses, and archive handled conversations.
          </p>
        </Link>

        <Link
          to="/admin/applications"
          className="group rounded-2xl border border-graphite-900/10 bg-white p-6 shadow-soft transition hover:border-ember"
        >
          <h3 className="text-h4 font-bold text-graphite-900 group-hover:text-ember-700">
            Career Applications
          </h3>
          <p className="mt-2 text-small text-ink-700">
            Screen incoming candidate submissions, filter by role/status, and securely download uploaded resumes with signed URLs.
          </p>
        </Link>

        <Link
          to="/admin/projects"
          className="group rounded-2xl border border-graphite-900/10 bg-white p-6 shadow-soft transition hover:border-ember"
        >
          <h3 className="text-h4 font-bold text-graphite-900 group-hover:text-ember-700">
            Portfolio &amp; Projects
          </h3>
          <p className="mt-2 text-small text-ink-700">
            Create, edit, reorder, and publish case studies and technical projects shown on the innovation and portfolio areas.
          </p>
        </Link>
      </div>
    </div>
  )
}
