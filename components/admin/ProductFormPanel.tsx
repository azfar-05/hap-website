'use client'

import { useState, useEffect } from 'react'
import type { Product, Category } from '@/types/database.types'
import ImageUploader, { type ImageItem } from './ImageUploader'

export type PanelState =
  | { open: false }
  | { open: true; mode: 'add' }
  | { open: true; mode: 'edit'; product: Product }

export type ProductFormData = {
  name: string
  price: string
  category: Category | ''
  description: string
  color: string
  size: string
  material: string
  imageItems: ImageItem[]
}

const EMPTY_FORM: ProductFormData = {
  name: '',
  price: '',
  category: '',
  description: '',
  color: '',
  size: '',
  material: '',
  imageItems: [],
}

const CATEGORIES: { value: Category; label: string }[] = [
  { value: 'tableware', label: 'Tableware' },
  { value: 'kitchenware', label: 'Kitchenware' },
  { value: 'crockery', label: 'Crockery' },
  { value: 'cutlery', label: 'Cutlery' },
  { value: 'home_decor', label: 'Home Decor' },
]

function fromProduct(p: Product): ProductFormData {
  return {
    name: p.name,
    price: String(p.price),
    category: p.category,
    description: p.description ?? '',
    color: p.color ?? '',
    size: p.size ?? '',
    material: p.material ?? '',
    imageItems: p.images.map((url) => ({ type: 'existing', url }) as ImageItem),
  }
}

type Props = {
  state: PanelState
  onClose: () => void
  onSubmit: (data: ProductFormData, productId?: string) => Promise<void>
}

export default function ProductFormPanel({ state, onClose, onSubmit }: Props) {
  const [form, setForm] = useState<ProductFormData>(EMPTY_FORM)
  const [submitted, setSubmitted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const openKey = state.open
    ? state.mode === 'edit'
      ? `edit:${state.product.id}`
      : 'add'
    : null

  useEffect(() => {
    if (!state.open) return
    setForm(state.mode === 'edit' ? fromProduct(state.product) : EMPTY_FORM)
    setSubmitted(false)
    setIsSubmitting(false)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [openKey])

  function set<K extends keyof ProductFormData>(key: K, value: ProductFormData[K]) {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  const nameError = submitted && form.name.trim() === ''
  const priceError = submitted && (form.price === '' || Number(form.price) <= 0)
  const categoryError = submitted && form.category === ''
  const imagesError = submitted && form.imageItems.length === 0

  const isValid =
    form.name.trim() !== '' &&
    Number(form.price) > 0 &&
    form.category !== '' &&
    form.imageItems.length > 0

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSubmitted(true)
    if (!isValid) return
    setIsSubmitting(true)
    try {
      const productId =
        state.open && state.mode === 'edit' ? state.product.id : undefined
      await onSubmit(form, productId)
    } catch {
      setIsSubmitting(false)
    }
  }

  const title = state.open ? (state.mode === 'add' ? 'Add Product' : 'Edit Product') : ''
  const submitLabel = state.open && state.mode === 'edit' ? 'Save changes' : 'Add product'

  return (
    <div
      className={`fixed inset-0 z-50 ${state.open ? '' : 'pointer-events-none'}`}
      role="dialog"
      aria-modal={state.open}
      aria-label={title}
    >
      {/* Backdrop */}
      <div
        className={`absolute inset-0 bg-hap-text/40 transition-opacity duration-300 ${
          state.open ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />

      {/* Slide-in panel */}
      <div
        className={`absolute right-0 top-0 h-full w-full md:w-[480px] bg-surface shadow-modal overflow-y-auto transition-transform duration-300 ${
          state.open ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Sticky header */}
        <div className="sticky top-0 z-10 bg-surface border-b border-border px-6 py-4 flex items-center justify-between">
          <h2 className="font-display text-h3 text-hap-text">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="text-muted hover:text-hap-text transition-colors p-2 -mr-2 rounded-btn"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden>
              <path
                d="M4 4l12 12M16 4L4 16"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} noValidate className="p-6 space-y-5 pb-12">
          {/* Name */}
          <div>
            <label className="block font-body text-small font-medium text-muted mb-1.5">
              Product name
            </label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => set('name', e.target.value)}
              placeholder="e.g. Handcrafted Ceramic Bowl"
              className={`w-full font-body text-body text-hap-text bg-bg border rounded-input px-4 py-3 outline-none transition-colors ${
                nameError
                  ? 'border-red-400 bg-red-50/50'
                  : 'border-border focus:border-brand'
              }`}
            />
            {nameError && (
              <p className="mt-1 font-body text-small text-red-600">Product name is required.</p>
            )}
          </div>

          {/* Price */}
          <div>
            <label className="block font-body text-small font-medium text-muted mb-1.5">
              Price (₹)
            </label>
            <input
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              value={form.price}
              onChange={(e) => set('price', e.target.value)}
              placeholder="e.g. 1200"
              className={`w-full font-body text-body text-hap-text bg-bg border rounded-input px-4 py-3 outline-none transition-colors ${
                priceError
                  ? 'border-red-400 bg-red-50/50'
                  : 'border-border focus:border-brand'
              }`}
            />
            {priceError && (
              <p className="mt-1 font-body text-small text-red-600">A valid price is required.</p>
            )}
          </div>

          {/* Category */}
          <div>
            <label className="block font-body text-small font-medium text-muted mb-1.5">
              Category
            </label>
            <select
              value={form.category}
              onChange={(e) => set('category', e.target.value as Category | '')}
              className={`w-full font-body text-body text-hap-text bg-bg border rounded-input px-4 py-3 outline-none transition-colors cursor-pointer ${
                categoryError
                  ? 'border-red-400 bg-red-50/50'
                  : 'border-border focus:border-brand'
              }`}
            >
              <option value="">Select a category…</option>
              {CATEGORIES.map((c) => (
                <option key={c.value} value={c.value}>
                  {c.label}
                </option>
              ))}
            </select>
            {categoryError && (
              <p className="mt-1 font-body text-small text-red-600">Please select a category.</p>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block font-body text-small font-medium text-muted mb-1.5">
              Description{' '}
              <span className="font-normal text-muted/60">(optional)</span>
            </label>
            <textarea
              value={form.description}
              onChange={(e) => set('description', e.target.value)}
              placeholder="A brief description of the product…"
              rows={3}
              className="w-full font-body text-body text-hap-text bg-bg border border-border rounded-input px-4 py-3 outline-none focus:border-brand transition-colors resize-none"
            />
          </div>

          {/* Colour / Size / Material */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {(
              [
                { key: 'color', label: 'Colour' },
                { key: 'size', label: 'Size' },
                { key: 'material', label: 'Material' },
              ] as const
            ).map(({ key, label }) => (
              <div key={key}>
                <label className="block font-body text-small font-medium text-muted mb-1.5">
                  {label} <span className="font-normal text-muted/60">(optional)</span>
                </label>
                <input
                  type="text"
                  value={form[key]}
                  onChange={(e) => set(key, e.target.value)}
                  placeholder={label.toLowerCase()}
                  className="w-full font-body text-small text-hap-text bg-bg border border-border rounded-input px-3 py-2.5 outline-none focus:border-brand transition-colors"
                />
              </div>
            ))}
          </div>

          {/* Images */}
          <div className="space-y-3">
            <label className="block font-body text-small font-medium text-muted mb-1.5">
              Images
            </label>
            <ImageUploader
              items={form.imageItems}
              onChange={(items) => set('imageItems', items)}
              hasError={imagesError}
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 font-body font-medium text-body text-muted border border-border rounded-btn px-4 py-3 hover:bg-surface-hover transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 font-body font-semibold text-body text-white bg-brand rounded-btn px-4 py-3 hover:bg-accent transition-colors disabled:opacity-60"
            >
              {isSubmitting ? 'Saving…' : submitLabel}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
