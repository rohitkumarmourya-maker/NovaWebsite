import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import {
  supabase,
  isSupabaseConfigured,
  type Project,
} from '../../lib/supabase'

export default function AdminProjects() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [editingProject, setEditingProject] = useState<Project | null>(null)
  const [saving, setSaving] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)

  // Form State
  const [title, setTitle] = useState('')
  const [slug, setSlug] = useState('')
  const [category, setCategory] = useState('')
  const [shortDesc, setShortDesc] = useState('')
  const [fullDesc, setFullDesc] = useState('')
  const [techInput, setTechInput] = useState('')
  const [displayOrder, setDisplayOrder] = useState(0)
  const [featured, setFeatured] = useState(false)
  const [published, setPublished] = useState(true)

  async function loadProjects() {
    if (!isSupabaseConfigured) {
      setLoading(false)
      return
    }
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('display_order', { ascending: true })

      if (error) {
        console.error('Error fetching projects:', error)
      } else {
        setProjects(data || [])
      }
    } catch (err) {
      console.error('Failed to load projects:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadProjects()
  }, [])

  function openCreateModal() {
    setEditingProject(null)
    setTitle('')
    setSlug('')
    setCategory('Manufacturing')
    setShortDesc('')
    setFullDesc('')
    setTechInput('React, TypeScript, Node.js')
    setDisplayOrder(projects.length + 1)
    setFeatured(false)
    setPublished(true)
    setFormError(null)
    setIsEditing(true)
  }

  function openEditModal(proj: Project) {
    setEditingProject(proj)
    setTitle(proj.title)
    setSlug(proj.slug)
    setCategory(proj.category || 'Manufacturing')
    setShortDesc(proj.short_description || '')
    setFullDesc(proj.full_description || '')
    setTechInput(Array.isArray(proj.technologies) ? proj.technologies.join(', ') : '')
    setDisplayOrder(proj.display_order ?? 0)
    setFeatured(Boolean(proj.featured))
    setPublished(proj.published !== false)
    setFormError(null)
    setIsEditing(true)
  }

  async function handleSave(e: FormEvent) {
    e.preventDefault()
    setFormError(null)
    if (!title.trim() || !slug.trim()) {
      setFormError('Title and unique slug are required.')
      return
    }

    setSaving(true)
    try {
      const technologies = techInput
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean)

      const payload = {
        title: title.trim(),
        slug: slug.trim().toLowerCase().replace(/[^a-z0-9-]/g, '-'),
        category: category.trim(),
        short_description: shortDesc.trim(),
        full_description: fullDesc.trim(),
        technologies,
        display_order: Number(displayOrder) || 0,
        featured,
        published,
      }

      if (editingProject?.id) {
        // Update existing project
        const { error } = await supabase
          .from('projects')
          .update(payload)
          .eq('id', editingProject.id)

        if (error) throw error
      } else {
        // Insert new project
        const { error } = await supabase.from('projects').insert(payload)
        if (error) throw error
      }

      setIsEditing(false)
      loadProjects()
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to save project.'
      setFormError(msg)
    } finally {
      setSaving(false)
    }
  }

  async function togglePublish(proj: Project) {
    if (!proj.id) return
    const newPublished = !proj.published
    try {
      const { error } = await supabase
        .from('projects')
        .update({ published: newPublished })
        .eq('id', proj.id)

      if (!error) {
        setProjects((prev) =>
          prev.map((p) => (p.id === proj.id ? { ...p, published: newPublished } : p))
        )
      }
    } catch (err) {
      console.error('Error toggling publish state:', err)
    }
  }

  async function deleteProject(id: string) {
    if (!window.confirm('Are you sure you want to permanently delete this project?')) return
    try {
      const { error } = await supabase.from('projects').delete().eq('id', id)
      if (!error) {
        setProjects((prev) => prev.filter((p) => p.id !== id))
      }
    } catch (err) {
      console.error('Error deleting project:', err)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-h2 font-bold text-graphite-900">Portfolio &amp; Projects</h1>
          <p className="mt-1 text-body text-ink-500">
            Create, edit, and publish case studies displayed on the public Innovation page.
          </p>
        </div>
        <button
          onClick={openCreateModal}
          className="inline-flex items-center gap-2 rounded-xl bg-ember px-4 py-2.5 text-small font-semibold text-graphite-950 shadow-soft hover:bg-ember-600 transition"
        >
          + Add New Project
        </button>
      </div>

      {loading ? (
        <div className="rounded-2xl border border-graphite-900/10 bg-white p-12 text-center shadow-soft">
          <div className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-ember border-t-transparent" />
          <p className="mt-2 text-small text-ink-500">Loading projects…</p>
        </div>
      ) : projects.length === 0 ? (
        <div className="rounded-2xl border border-graphite-900/10 bg-white p-12 text-center shadow-soft">
          <p className="text-body font-medium text-graphite-900">No projects found</p>
          <p className="mt-1 text-small text-ink-500">
            Click "+ Add New Project" to create your first portfolio case study.
          </p>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((proj) => (
            <div
              key={proj.id || proj.slug}
              className="flex flex-col justify-between rounded-2xl border border-graphite-900/10 bg-white p-6 shadow-soft transition hover:border-graphite-900/20"
            >
              <div>
                <div className="flex items-center justify-between gap-2">
                  <span className="text-tiny font-bold uppercase tracking-wider text-ember-700">
                    {proj.category || 'General'}
                  </span>
                  <div className="flex items-center gap-2">
                    {proj.featured && (
                      <span className="rounded-full bg-amber-100 px-2 py-0.5 text-tiny font-bold text-amber-800 uppercase">
                        Featured
                      </span>
                    )}
                    <span
                      className={`rounded-full px-2 py-0.5 text-tiny font-bold uppercase ${
                        proj.published
                          ? 'bg-success-100 text-success-800'
                          : 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      {proj.published ? 'Published' : 'Draft'}
                    </span>
                  </div>
                </div>

                <h3 className="mt-3 text-h4 font-bold text-graphite-900">{proj.title}</h3>
                <p className="mt-1 text-tiny font-mono text-ink-400">/{proj.slug}</p>

                {proj.short_description && (
                  <p className="mt-3 line-clamp-3 text-small text-ink-700">
                    {proj.short_description}
                  </p>
                )}

                {proj.technologies && proj.technologies.length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {proj.technologies.slice(0, 4).map((t) => (
                      <span
                        key={t}
                        className="rounded-md border border-graphite-900/10 bg-sand-50 px-2 py-0.5 text-tiny font-medium text-graphite-800"
                      >
                        {t}
                      </span>
                    ))}
                    {proj.technologies.length > 4 && (
                      <span className="text-tiny text-ink-400">
                        +{proj.technologies.length - 4} more
                      </span>
                    )}
                  </div>
                )}
              </div>

              <div className="mt-6 flex items-center justify-between border-t border-graphite-900/10 pt-4">
                <span className="text-tiny font-semibold text-ink-400">
                  Order: #{proj.display_order}
                </span>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => togglePublish(proj)}
                    className="rounded-lg border border-graphite-900/15 px-2.5 py-1 text-tiny font-semibold text-graphite-700 hover:bg-sand-50"
                  >
                    {proj.published ? 'Unpublish' : 'Publish'}
                  </button>
                  <button
                    onClick={() => openEditModal(proj)}
                    className="rounded-lg bg-graphite-900 px-2.5 py-1 text-tiny font-semibold text-white hover:bg-graphite-800"
                  >
                    Edit
                  </button>
                  {proj.id && (
                    <button
                      onClick={() => deleteProject(proj.id!)}
                      className="rounded-lg p-1 text-danger-700 hover:bg-danger-50"
                      title="Delete Project"
                    >
                      &times;
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create / Edit Modal */}
      {isEditing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 overflow-y-auto">
          <div className="w-full max-w-2xl rounded-3xl bg-white p-6 shadow-2xl sm:p-8 my-8">
            <div className="flex items-center justify-between border-b border-graphite-900/10 pb-4">
              <h2 className="text-h3 font-bold text-graphite-900">
                {editingProject ? 'Edit Project' : 'Add New Portfolio Project'}
              </h2>
              <button
                onClick={() => setIsEditing(false)}
                className="rounded-lg p-1.5 text-ink-400 hover:bg-sand-100 hover:text-graphite-900"
              >
                &times; Close
              </button>
            </div>

            {formError && (
              <div className="mt-4 rounded-xl border border-danger-600/30 bg-danger-50 p-3 text-small text-danger-700">
                {formError}
              </div>
            )}

            <form onSubmit={handleSave} className="mt-6 space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-small font-semibold text-graphite-900">
                    Project Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => {
                      setTitle(e.target.value)
                      if (!editingProject) {
                        setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''))
                      }
                    }}
                    className="mt-1 w-full rounded-xl border border-graphite-900/15 px-3.5 py-2 text-small text-graphite-900 focus:border-ember focus:outline-none"
                    placeholder="e.g. Production Traceability System"
                  />
                </div>

                <div>
                  <label className="block text-small font-semibold text-graphite-900">
                    Unique URL Slug *
                  </label>
                  <input
                    type="text"
                    required
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-graphite-900/15 px-3.5 py-2 text-small text-graphite-900 focus:border-ember focus:outline-none"
                    placeholder="e.g. production-traceability"
                  />
                </div>

                <div>
                  <label className="block text-small font-semibold text-graphite-900">
                    Category / Industry
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-graphite-900/15 bg-white px-3.5 py-2 text-small text-graphite-900 focus:border-ember focus:outline-none"
                  >
                    <option value="Manufacturing">Manufacturing</option>
                    <option value="IT / Software">IT / Software</option>
                    <option value="HEMM">HEMM</option>
                    <option value="Healthcare Products">Healthcare Products</option>
                    <option value="Skill Development">Skill Development</option>
                    <option value="Civil and Construction">Civil and Construction</option>
                  </select>
                </div>

                <div>
                  <label className="block text-small font-semibold text-graphite-900">
                    Display Order
                  </label>
                  <input
                    type="number"
                    value={displayOrder}
                    onChange={(e) => setDisplayOrder(Number(e.target.value))}
                    className="mt-1 w-full rounded-xl border border-graphite-900/15 px-3.5 py-2 text-small text-graphite-900 focus:border-ember focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-small font-semibold text-graphite-900">
                  Short Description / Overview
                </label>
                <textarea
                  rows={2}
                  value={shortDesc}
                  onChange={(e) => setShortDesc(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-graphite-900/15 px-3.5 py-2 text-small text-graphite-900 focus:border-ember focus:outline-none"
                  placeholder="Brief summary shown on cards..."
                />
              </div>

              <div>
                <label className="block text-small font-semibold text-graphite-900">
                  Full Description &amp; Solution
                </label>
                <textarea
                  rows={4}
                  value={fullDesc}
                  onChange={(e) => setFullDesc(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-graphite-900/15 px-3.5 py-2 text-small text-graphite-900 focus:border-ember focus:outline-none"
                  placeholder="Comprehensive technical details, architecture, and outcomes..."
                />
              </div>

              <div>
                <label className="block text-small font-semibold text-graphite-900">
                  Technologies (comma-separated)
                </label>
                <input
                  type="text"
                  value={techInput}
                  onChange={(e) => setTechInput(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-graphite-900/15 px-3.5 py-2 text-small text-graphite-900 focus:border-ember focus:outline-none"
                  placeholder="React, TypeScript, Node.js, PostgreSQL"
                />
              </div>

              <div className="flex items-center gap-6 pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={featured}
                    onChange={(e) => setFeatured(e.target.checked)}
                    className="h-4 w-4 rounded border-gray-300 text-ember focus:ring-ember"
                  />
                  <span className="text-small font-medium text-graphite-900">Featured on Homepage</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={published}
                    onChange={(e) => setPublished(e.target.checked)}
                    className="h-4 w-4 rounded border-gray-300 text-ember focus:ring-ember"
                  />
                  <span className="text-small font-medium text-graphite-900">Published to Public Visitors</span>
                </label>
              </div>

              <div className="mt-8 flex justify-end gap-3 border-t border-graphite-900/10 pt-4">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="rounded-xl border border-graphite-900/15 px-4 py-2 text-small font-semibold text-ink-700 hover:bg-sand-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-xl bg-ember px-5 py-2 text-small font-semibold text-graphite-950 hover:bg-ember-600 transition disabled:opacity-50"
                >
                  {saving ? 'Saving…' : editingProject ? 'Update Project' : 'Create Project'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
