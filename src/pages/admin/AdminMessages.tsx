import { useEffect, useState } from 'react'
import { supabase, isSupabaseConfigured, type ContactSubmission } from '../../lib/supabase'

export default function AdminMessages() {
  const [messages, setMessages] = useState<ContactSubmission[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | 'new' | 'read' | 'replied' | 'archived'>('all')
  const [selectedMessage, setSelectedMessage] = useState<ContactSubmission | null>(null)
  const [updatingId, setUpdatingId] = useState<string | null>(null)

  async function loadMessages() {
    if (!isSupabaseConfigured) {
      setLoading(false)
      return
    }
    setLoading(true)
    try {
      let query = supabase
        .from('contact_submissions')
        .select('*')
        .order('created_at', { ascending: false })

      if (statusFilter !== 'all') {
        query = query.eq('status', statusFilter)
      }

      const { data, error } = await query

      if (error) {
        console.error('Error fetching messages:', error)
      } else {
        setMessages(data || [])
      }
    } catch (err) {
      console.error('Failed to load contact submissions:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadMessages()
  }, [statusFilter])

  async function updateStatus(id: string, newStatus: 'new' | 'read' | 'replied' | 'archived') {
    setUpdatingId(id)
    try {
      const { error } = await supabase
        .from('contact_submissions')
        .update({ status: newStatus })
        .eq('id', id)

      if (error) {
        console.error('Status update failed:', error)
      } else {
        setMessages((prev) =>
          prev.map((msg) => (msg.id === id ? { ...msg, status: newStatus } : msg))
        )
        if (selectedMessage?.id === id) {
          setSelectedMessage((prev) => (prev ? { ...prev, status: newStatus } : null))
        }
      }
    } finally {
      setUpdatingId(null)
    }
  }

  async function deleteMessage(id: string) {
    if (!window.confirm('Are you sure you want to permanently delete this submission?')) return
    setUpdatingId(id)
    try {
      const { error } = await supabase.from('contact_submissions').delete().eq('id', id)
      if (error) {
        console.error('Delete failed:', error)
      } else {
        setMessages((prev) => prev.filter((msg) => msg.id !== id))
        if (selectedMessage?.id === id) setSelectedMessage(null)
      }
    } finally {
      setUpdatingId(null)
    }
  }

  const filteredMessages = messages.filter((msg) => {
    const term = search.toLowerCase().trim()
    if (!term) return true
    return (
      msg.name.toLowerCase().includes(term) ||
      msg.email.toLowerCase().includes(term) ||
      (msg.company && msg.company.toLowerCase().includes(term)) ||
      (msg.subject && msg.subject.toLowerCase().includes(term)) ||
      msg.message.toLowerCase().includes(term)
    )
  })

  const statusBadge = (status?: string) => {
    switch (status) {
      case 'new':
        return <span className="rounded-full bg-ember/15 px-2.5 py-0.5 text-tiny font-bold text-ember-700 uppercase tracking-wider">New</span>
      case 'read':
        return <span className="rounded-full bg-blue-100 px-2.5 py-0.5 text-tiny font-bold text-blue-700 uppercase tracking-wider">Read</span>
      case 'replied':
        return <span className="rounded-full bg-success-100 px-2.5 py-0.5 text-tiny font-bold text-success-700 uppercase tracking-wider">Replied</span>
      case 'archived':
        return <span className="rounded-full bg-gray-100 px-2.5 py-0.5 text-tiny font-bold text-gray-600 uppercase tracking-wider">Archived</span>
      default:
        return <span className="rounded-full bg-gray-100 px-2.5 py-0.5 text-tiny font-bold text-gray-600 uppercase tracking-wider">{status}</span>
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-h2 font-bold text-graphite-900">Contact Submissions</h1>
          <p className="mt-1 text-body text-ink-500">
            Manage incoming messages and client enquiries from the website.
          </p>
        </div>
        <button
          onClick={loadMessages}
          className="inline-flex items-center gap-2 rounded-xl border border-graphite-900/10 bg-white px-4 py-2 text-small font-semibold text-graphite-900 shadow-soft hover:bg-sand-50"
        >
          Refresh
        </button>
      </div>

      {/* Filters & Search Bar */}
      <div className="flex flex-col gap-4 rounded-2xl border border-graphite-900/10 bg-white p-4 shadow-soft sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Search by name, email, company, or text…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-graphite-900/15 px-4 py-2 text-small text-graphite-900 placeholder-ink-400 focus:border-ember focus:outline-none focus:ring-1 focus:ring-ember"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          {(['all', 'new', 'read', 'replied', 'archived'] as const).map((tab) => (
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

      {/* Table & Details View */}
      {loading ? (
        <div className="rounded-2xl border border-graphite-900/10 bg-white p-12 text-center shadow-soft">
          <div className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-ember border-t-transparent" />
          <p className="mt-2 text-small text-ink-500">Loading messages…</p>
        </div>
      ) : filteredMessages.length === 0 ? (
        <div className="rounded-2xl border border-graphite-900/10 bg-white p-12 text-center shadow-soft">
          <p className="text-body font-medium text-graphite-900">No messages found</p>
          <p className="mt-1 text-small text-ink-500">
            {search ? 'Try adjusting your search query.' : 'There are no submissions in this category.'}
          </p>
        </div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-12">
          {/* Messages List Column */}
          <div className={`${selectedMessage ? 'lg:col-span-6' : 'lg:col-span-12'} space-y-3`}>
            {filteredMessages.map((msg) => (
              <div
                key={msg.id}
                onClick={() => {
                  setSelectedMessage(msg)
                  if (msg.status === 'new' && msg.id) {
                    updateStatus(msg.id, 'read')
                  }
                }}
                className={`cursor-pointer rounded-2xl border p-5 shadow-soft transition ${
                  selectedMessage?.id === msg.id
                    ? 'border-ember bg-sand-50'
                    : 'border-graphite-900/10 bg-white hover:border-graphite-900/20'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h4 className="font-semibold text-graphite-900">{msg.name}</h4>
                    <p className="text-small text-ink-500">{msg.email}</p>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    {statusBadge(msg.status)}
                    <span className="text-tiny text-ink-400">
                      {msg.created_at ? new Date(msg.created_at).toLocaleDateString() : ''}
                    </span>
                  </div>
                </div>

                {msg.company && (
                  <p className="mt-2 text-small font-medium text-graphite-700">
                    Org: {msg.company}
                  </p>
                )}

                <p className="mt-2 line-clamp-2 text-small text-ink-700">
                  {msg.message}
                </p>
              </div>
            ))}
          </div>

          {/* Selected Message Inspector Column */}
          {selectedMessage && (
            <div className="lg:col-span-6">
              <div className="sticky top-24 rounded-2xl border border-graphite-900/10 bg-white p-6 shadow-soft space-y-6">
                <div className="flex items-start justify-between border-b border-graphite-900/10 pb-4">
                  <div>
                    <span className="text-tiny uppercase tracking-wider text-ink-400">Message Detail</span>
                    <h3 className="mt-1 text-h3 font-bold text-graphite-900">{selectedMessage.name}</h3>
                    <p className="text-small text-ink-600">{selectedMessage.email}</p>
                    {selectedMessage.phone && (
                      <p className="text-small text-ink-600">Phone: {selectedMessage.phone}</p>
                    )}
                    {selectedMessage.company && (
                      <p className="text-small text-ink-600">Company: {selectedMessage.company}</p>
                    )}
                  </div>
                  <button
                    onClick={() => setSelectedMessage(null)}
                    className="rounded-lg p-1.5 text-ink-400 hover:bg-sand-100 hover:text-graphite-900"
                  >
                    &times; Close
                  </button>
                </div>

                <div>
                  <h5 className="text-small font-bold uppercase tracking-wider text-ink-500">Subject</h5>
                  <p className="mt-1 text-body font-medium text-graphite-900">
                    {selectedMessage.subject || 'Website Enquiry'}
                  </p>
                </div>

                <div>
                  <h5 className="text-small font-bold uppercase tracking-wider text-ink-500">Message Content</h5>
                  <div className="mt-2 rounded-xl bg-sand-50 p-4 text-body text-graphite-900 whitespace-pre-wrap leading-relaxed">
                    {selectedMessage.message}
                  </div>
                </div>

                <div className="border-t border-graphite-900/10 pt-4 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <span className="text-small font-medium text-ink-700">Status:</span>
                    <select
                      value={selectedMessage.status || 'new'}
                      disabled={updatingId === selectedMessage.id}
                      onChange={(e) =>
                        selectedMessage.id &&
                        updateStatus(
                          selectedMessage.id,
                          e.target.value as 'new' | 'read' | 'replied' | 'archived'
                        )
                      }
                      className="rounded-lg border border-graphite-900/15 bg-white px-3 py-1.5 text-small font-semibold text-graphite-900 focus:border-ember focus:outline-none"
                    >
                      <option value="new">New</option>
                      <option value="read">Read</option>
                      <option value="replied">Replied</option>
                      <option value="archived">Archived</option>
                    </select>
                  </div>

                  <div className="flex gap-2">
                    <a
                      href={`mailto:${selectedMessage.email}?subject=${encodeURIComponent(
                        `Re: ${selectedMessage.subject || 'Enquiry to Nova Ventures'}`
                      )}`}
                      className="rounded-lg bg-ember px-3.5 py-1.5 text-small font-semibold text-graphite-950 hover:bg-ember-600 transition"
                    >
                      Reply by Email &rarr;
                    </a>
                    <button
                      onClick={() => selectedMessage.id && deleteMessage(selectedMessage.id)}
                      disabled={updatingId === selectedMessage.id}
                      className="rounded-lg border border-danger-600/30 px-3 py-1.5 text-small font-semibold text-danger-700 hover:bg-danger-50 transition"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
