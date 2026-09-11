import { useEffect, useState } from 'react'
import {
  supabase,
  isSupabaseConfigured,
  getResumeSignedUrl,
  type CareerApplication,
} from '../../lib/supabase'

export default function AdminApplications() {
  const [applications, setApplications] = useState<CareerApplication[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | 'new' | 'reviewing' | 'shortlisted' | 'rejected' | 'hired'>('all')
  const [selectedApp, setSelectedApp] = useState<CareerApplication | null>(null)
  const [downloading, setDownloading] = useState(false)
  const [updatingId, setUpdatingId] = useState<string | null>(null)

  async function loadApplications() {
    if (!isSupabaseConfigured) {
      setLoading(false)
      return
    }
    setLoading(true)
    try {
      let query = supabase
        .from('career_applications')
        .select('*')
        .order('created_at', { ascending: false })

      if (statusFilter !== 'all') {
        query = query.eq('status', statusFilter)
      }

      const { data, error } = await query
      if (error) {
        console.error('Error fetching applications:', error)
      } else {
        setApplications(data || [])
      }
    } catch (err) {
      console.error('Failed to load career applications:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadApplications()
  }, [statusFilter])

  async function updateStatus(
    id: string,
    newStatus: 'new' | 'reviewing' | 'shortlisted' | 'rejected' | 'hired'
  ) {
    setUpdatingId(id)
    try {
      const { error } = await supabase
        .from('career_applications')
        .update({ status: newStatus })
        .eq('id', id)

      if (error) {
        console.error('Status update failed:', error)
      } else {
        setApplications((prev) =>
          prev.map((app) => (app.id === id ? { ...app, status: newStatus } : app))
        )
        if (selectedApp?.id === id) {
          setSelectedApp((prev) => (prev ? { ...prev, status: newStatus } : null))
        }
      }
    } finally {
      setUpdatingId(null)
    }
  }

  async function handleDownloadResume(path: string | null | undefined) {
    if (!path) {
      alert('No resume file attached for this application.')
      return
    }
    setDownloading(true)
    try {
      const url = await getResumeSignedUrl(path, 600)
      if (url) {
        window.open(url, '_blank', 'noopener,noreferrer')
      } else {
        alert('Could not generate secure download link. Please check permissions.')
      }
    } catch (err) {
      console.error('Download error:', err)
      alert('Error fetching resume file.')
    } finally {
      setDownloading(false)
    }
  }

  const filteredApps = applications.filter((app) => {
    const term = search.toLowerCase().trim()
    if (!term) return true
    return (
      app.full_name.toLowerCase().includes(term) ||
      app.email.toLowerCase().includes(term) ||
      (app.position && app.position.toLowerCase().includes(term)) ||
      (app.skills && app.skills.toLowerCase().includes(term))
    )
  })

  const statusBadge = (status?: string) => {
    switch (status) {
      case 'new':
        return <span className="rounded-full bg-ember/15 px-2.5 py-0.5 text-tiny font-bold text-ember-700 uppercase tracking-wider">New</span>
      case 'reviewing':
        return <span className="rounded-full bg-blue-100 px-2.5 py-0.5 text-tiny font-bold text-blue-700 uppercase tracking-wider">Reviewing</span>
      case 'shortlisted':
        return <span className="rounded-full bg-purple-100 px-2.5 py-0.5 text-tiny font-bold text-purple-700 uppercase tracking-wider">Shortlisted</span>
      case 'rejected':
        return <span className="rounded-full bg-red-100 px-2.5 py-0.5 text-tiny font-bold text-red-700 uppercase tracking-wider">Rejected</span>
      case 'hired':
        return <span className="rounded-full bg-success-100 px-2.5 py-0.5 text-tiny font-bold text-success-700 uppercase tracking-wider">Hired</span>
      default:
        return <span className="rounded-full bg-gray-100 px-2.5 py-0.5 text-tiny font-bold text-gray-600 uppercase tracking-wider">{status}</span>
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-h2 font-bold text-graphite-900">Career Applications</h1>
          <p className="mt-1 text-body text-ink-500">
            Review job applicants, qualifications, and download candidate CVs securely.
          </p>
        </div>
        <button
          onClick={loadApplications}
          className="inline-flex items-center gap-2 rounded-xl border border-graphite-900/10 bg-white px-4 py-2 text-small font-semibold text-graphite-900 shadow-soft hover:bg-sand-50"
        >
          Refresh
        </button>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col gap-4 rounded-2xl border border-graphite-900/10 bg-white p-4 shadow-soft sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Search by candidate name, email, role, or skills…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-graphite-900/15 px-4 py-2 text-small text-graphite-900 placeholder-ink-400 focus:border-ember focus:outline-none focus:ring-1 focus:ring-ember"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          {(['all', 'new', 'reviewing', 'shortlisted', 'rejected', 'hired'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setStatusFilter(tab)}
              className={`rounded-xl px-3.5 py-1.5 text-small font-semibold capitalize transition ${
                statusFilter === tab
                  ? 'bg-graphite-900 text-white'
                  : 'bg-sand-100 text-ink-700 hover:bg-sand-200'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content Grid */}
      {loading ? (
        <div className="rounded-2xl border border-graphite-900/10 bg-white p-12 text-center shadow-soft">
          <div className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-ember border-t-transparent" />
          <p className="mt-2 text-small text-ink-500">Loading applications…</p>
        </div>
      ) : filteredApps.length === 0 ? (
        <div className="rounded-2xl border border-graphite-900/10 bg-white p-12 text-center shadow-soft">
          <p className="text-body font-medium text-graphite-900">No applications found</p>
          <p className="mt-1 text-small text-ink-500">
            {search ? 'Try adjusting your search criteria.' : 'No candidates in this category.'}
          </p>
        </div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-12">
          {/* Applications List */}
          <div className={`${selectedApp ? 'lg:col-span-6' : 'lg:col-span-12'} space-y-3`}>
            {filteredApps.map((app) => (
              <div
                key={app.id}
                onClick={() => setSelectedApp(app)}
                className={`cursor-pointer rounded-2xl border p-5 shadow-soft transition ${
                  selectedApp?.id === app.id
                    ? 'border-ember bg-sand-50'
                    : 'border-graphite-900/10 bg-white hover:border-graphite-900/20'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h4 className="font-semibold text-graphite-900">{app.full_name}</h4>
                    <p className="text-small text-ink-500">{app.email}</p>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    {statusBadge(app.status)}
                    <span className="text-tiny text-ink-400">
                      {app.created_at ? new Date(app.created_at).toLocaleDateString() : ''}
                    </span>
                  </div>
                </div>

                <div className="mt-3 flex flex-wrap gap-2 text-small">
                  <span className="rounded-md bg-sand-100 px-2 py-0.5 font-medium text-graphite-900">
                    {app.position || 'General Application'}
                  </span>
                  {app.experience && (
                    <span className="rounded-md bg-sand-100 px-2 py-0.5 text-ink-600">
                      Exp: {app.experience}
                    </span>
                  )}
                </div>

                {app.skills && (
                  <p className="mt-2 line-clamp-1 text-small text-ink-600">
                    <span className="font-semibold text-graphite-700">Skills:</span> {app.skills}
                  </p>
                )}
              </div>
            ))}
          </div>

          {/* Detailed Applicant Drawer */}
          {selectedApp && (
            <div className="lg:col-span-6">
              <div className="sticky top-24 rounded-2xl border border-graphite-900/10 bg-white p-6 shadow-soft space-y-6 max-h-[85vh] overflow-y-auto">
                <div className="flex items-start justify-between border-b border-graphite-900/10 pb-4">
                  <div>
                    <span className="text-tiny uppercase tracking-wider text-ink-400">Candidate Profile</span>
                    <h3 className="mt-1 text-h3 font-bold text-graphite-900">{selectedApp.full_name}</h3>
                    <p className="text-small text-ink-600">{selectedApp.email}</p>
                    {selectedApp.phone && (
                      <p className="text-small text-ink-600">Phone: {selectedApp.phone}</p>
                    )}
                    {Boolean(selectedApp.metadata?.city) && (
                      <p className="text-small text-ink-600">City: {String(selectedApp.metadata?.city)}</p>
                    )}
                  </div>
                  <button
                    onClick={() => setSelectedApp(null)}
                    className="rounded-lg p-1.5 text-ink-400 hover:bg-sand-100 hover:text-graphite-900"
                  >
                    &times; Close
                  </button>
                </div>

                {/* Role and Position details */}
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="rounded-xl bg-sand-50 p-3">
                    <span className="text-tiny uppercase font-bold text-ink-500">Position</span>
                    <p className="font-semibold text-graphite-900">{selectedApp.position}</p>
                  </div>
                  <div className="rounded-xl bg-sand-50 p-3">
                    <span className="text-tiny uppercase font-bold text-ink-500">Business Vertical</span>
                    <p className="font-semibold text-graphite-900">
                      {selectedApp.metadata?.vertical ? String(selectedApp.metadata.vertical) : 'N/A'}
                    </p>
                  </div>
                  <div className="rounded-xl bg-sand-50 p-3">
                    <span className="text-tiny uppercase font-bold text-ink-500">Experience</span>
                    <p className="font-semibold text-graphite-900">{selectedApp.experience || 'N/A'}</p>
                  </div>
                  <div className="rounded-xl bg-sand-50 p-3">
                    <span className="text-tiny uppercase font-bold text-ink-500">Notice / Availability</span>
                    <p className="font-semibold text-graphite-900">
                      {selectedApp.metadata?.availability ? String(selectedApp.metadata.availability) : 'N/A'}
                    </p>
                  </div>
                </div>

                {/* Education */}
                {Boolean(selectedApp.metadata?.qualification) && (
                  <div>
                    <h5 className="text-small font-bold uppercase tracking-wider text-ink-500">Education</h5>
                    <p className="mt-1 text-body text-graphite-900">
                      <strong>{String(selectedApp.metadata?.qualification)}</strong>
                      {selectedApp.metadata?.fieldOfStudy ? ` in ${String(selectedApp.metadata.fieldOfStudy)}` : ''}
                      {selectedApp.metadata?.institution ? ` — ${String(selectedApp.metadata.institution)}` : ''}
                      {selectedApp.metadata?.graduationYear ? ` (${String(selectedApp.metadata.graduationYear)})` : ''}
                    </p>
                  </div>
                )}

                {/* Skills */}
                {selectedApp.skills && (
                  <div>
                    <h5 className="text-small font-bold uppercase tracking-wider text-ink-500">Skills &amp; Tools</h5>
                    <p className="mt-1 text-body text-graphite-900">{selectedApp.skills}</p>
                  </div>
                )}

                {/* Cover Letter */}
                {selectedApp.cover_letter && (
                  <div>
                    <h5 className="text-small font-bold uppercase tracking-wider text-ink-500">Cover Letter</h5>
                    <div className="mt-2 rounded-xl bg-sand-50 p-4 text-small text-graphite-900 whitespace-pre-wrap">
                      {selectedApp.cover_letter}
                    </div>
                  </div>
                )}

                {/* LinkedIn Link */}
                {Boolean(selectedApp.metadata?.linkedin) && (
                  <div>
                    <h5 className="text-small font-bold uppercase tracking-wider text-ink-500">LinkedIn / Profile</h5>
                    <a
                      href={String(selectedApp.metadata?.linkedin)}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-1 inline-block text-small font-semibold text-ember-700 hover:underline"
                    >
                      {String(selectedApp.metadata?.linkedin)} &nearr;
                    </a>
                  </div>
                )}

                {/* Resume Download Action */}
                <div className="rounded-xl border border-ember/30 bg-ember/10 p-4">
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="font-semibold text-graphite-900">Candidate CV / Resume</p>
                      <p className="text-tiny text-ink-600">Private document stored securely in Supabase.</p>
                    </div>
                    <button
                      type="button"
                      disabled={downloading || !selectedApp.resume_path}
                      onClick={() => handleDownloadResume(selectedApp.resume_path)}
                      className="inline-flex items-center justify-center rounded-lg bg-ember px-4 py-2 text-small font-semibold text-graphite-950 hover:bg-ember-600 transition disabled:opacity-50"
                    >
                      {downloading ? 'Generating URL…' : 'Download CV (Signed URL)'}
                    </button>
                  </div>
                </div>

                {/* Status Update Controls */}
                <div className="border-t border-graphite-900/10 pt-4 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <span className="text-small font-medium text-ink-700">Application Status:</span>
                    <select
                      value={selectedApp.status || 'new'}
                      disabled={updatingId === selectedApp.id}
                      onChange={(e) =>
                        selectedApp.id &&
                        updateStatus(
                          selectedApp.id,
                          e.target.value as 'new' | 'reviewing' | 'shortlisted' | 'rejected' | 'hired'
                        )
                      }
                      className="rounded-lg border border-graphite-900/15 bg-white px-3 py-1.5 text-small font-semibold text-graphite-900 focus:border-ember focus:outline-none"
                    >
                      <option value="new">New</option>
                      <option value="reviewing">Reviewing</option>
                      <option value="shortlisted">Shortlisted</option>
                      <option value="rejected">Rejected</option>
                      <option value="hired">Hired</option>
                    </select>
                  </div>

                  <a
                    href={`mailto:${selectedApp.email}?subject=${encodeURIComponent(
                      `Nova Ventures Application: ${selectedApp.position || 'Candidate'}`
                    )}`}
                    className="rounded-lg bg-graphite-900 px-3.5 py-1.5 text-small font-semibold text-white hover:bg-graphite-800 transition"
                  >
                    Email Candidate &rarr;
                  </a>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
