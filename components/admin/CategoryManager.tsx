'use client'

import { useState } from 'react'
import type { CategoryRow } from '@/types/database.types'

function toSlug(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s_]/g, '')
    .replace(/\s+/g, '_')
}

type Props = {
  categories: CategoryRow[]
  onAdd: (name: string, slug: string) => Promise<void>
  onDelete: (id: string, slug: string) => Promise<void>
}

export default function CategoryManager({ categories, onAdd, onDelete }: Props) {
  const [name, setName] = useState('')
  const [isAdding, setIsAdding] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim()) return
    setIsAdding(true)
    setError(null)
    try {
      await onAdd(name.trim(), toSlug(name))
      setName('')
    } catch (err) {
      const msg = err instanceof Error ? err.message : ''
      setError(msg.includes('already exists') ? 'A category with this name already exists. Try a different name.' : 'Failed to add category.')
    } finally {
      setIsAdding(false)
    }
  }

  async function handleDelete(id: string, slug: string) {
    setDeletingId(id)
    setError(null)
    try {
      await onDelete(id, slug)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete category.')
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <div>
      <p className="flex items-center gap-3 mb-3">
        <span aria-hidden="true" className="h-px w-8 bg-brand/60" />
        <span className="font-body text-eyebrow font-medium uppercase text-brand">
          Categories
        </span>
      </p>
      <h2 className="font-display text-h2 text-hap-text tracking-[0.02em] mb-6">
        Manage Categories
      </h2>

      {/* Category list */}
      {categories.length === 0 ? (
        <p className="font-body text-small text-muted mb-6">No categories yet.</p>
      ) : (
        <ul className="divide-y divide-border border border-border rounded-card mb-6">
          {categories.map((cat) => (
            <li
              key={cat.id}
              className="flex items-center justify-between gap-4 px-5 py-3.5"
            >
              <div className="min-w-0">
                <p className="font-body text-small font-medium text-hap-text truncate">
                  {cat.name}
                </p>
                <p className="font-body text-[11px] text-muted/70 font-mono mt-0.5">
                  {cat.slug}
                </p>
              </div>
              <button
                onClick={() => handleDelete(cat.id, cat.slug)}
                disabled={deletingId === cat.id}
                className="flex-none font-body text-small font-medium text-muted hover:text-red-600 transition-colors disabled:opacity-40 px-2 py-1 rounded"
                aria-label={`Delete ${cat.name}`}
              >
                {deletingId === cat.id ? 'Removing…' : 'Delete'}
              </button>
            </li>
          ))}
        </ul>
      )}

      {/* Error message */}
      {error && (
        <div className="mb-5 px-4 py-3 bg-red-50 border border-red-200 rounded-card">
          <p className="font-body text-small text-red-700">{error}</p>
        </div>
      )}

      {/* Add form */}
      <form onSubmit={handleAdd} className="space-y-3">
        <p className="font-body text-small font-medium text-muted mb-1">Add a new category</p>
        <div className="flex gap-3">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Serveware, Gold and White…"
            className="flex-1 font-body text-small text-hap-text bg-bg border border-border rounded-input px-4 py-2.5 outline-none focus:border-brand transition-colors"
          />
          <button
            type="submit"
            disabled={isAdding || !name.trim()}
            className="flex-none font-body font-semibold text-small text-white bg-brand rounded-btn px-5 py-2.5 hover:bg-accent transition-colors disabled:opacity-50"
          >
            {isAdding ? 'Adding…' : 'Add'}
          </button>
        </div>
      </form>
    </div>
  )
}
