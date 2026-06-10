'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import type { Product, Category } from '@/types/database.types'

type CategoryFilter = Category | 'all'

const ADMIN_CATEGORIES: { value: CategoryFilter; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'tableware', label: 'Tableware' },
  { value: 'kitchenware', label: 'Kitchenware' },
  { value: 'crockery', label: 'Crockery' },
  { value: 'cutlery', label: 'Cutlery' },
  { value: 'home_decor', label: 'Home Decor' },
]
import {
  addProduct,
  updateProduct,
  deleteProduct,
  toggleProduct,
} from '@/app/admin/actions'
import ProductTable from './ProductTable'
import ProductFormPanel, { type PanelState, type ProductFormData } from './ProductFormPanel'
import DeleteDialog, { type DeleteDialogState } from './DeleteDialog'
import type { ImageItem } from './ImageUploader'

type Toast = { id: string; message: string; type: 'success' | 'error' }

export default function AdminDashboard({
  initialProducts,
}: {
  initialProducts: Product[]
}) {
  const router = useRouter()
  // Browser client kept only for auth.signOut() and storage uploads.
  // All DB mutations go through server actions (service-role key, server-only).
  const supabase = useRef(createClient()).current

  const [products, setProducts] = useState<Product[]>(initialProducts)
  const [toasts, setToasts] = useState<Toast[]>([])
  const [panelState, setPanelState] = useState<PanelState>({ open: false })
  const [deleteState, setDeleteState] = useState<DeleteDialogState>({ open: false })
  const [isDeleting, setIsDeleting] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [activeCategory, setActiveCategory] = useState<CategoryFilter>('all')

  function showToast(type: 'success' | 'error', message: string) {
    const id = Math.random().toString(36).slice(2)
    setToasts((prev) => [...prev, { id, type, message }])
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 3500)
  }

  async function handleSignOut() {
    await supabase.auth.signOut()
    router.refresh()
    router.push('/admin/login')
  }

  async function handleToggle(product: Product, field: 'in_stock' | 'featured') {
    const next = !product[field]
    setProducts((prev) =>
      prev.map((p) => (p.id === product.id ? { ...p, [field]: next } : p))
    )
    const result = await toggleProduct(product.id, field, next)
    if ('error' in result) {
      setProducts((prev) =>
        prev.map((p) => (p.id === product.id ? { ...p, [field]: !next } : p))
      )
      showToast('error', 'Failed to update product.')
    }
  }

  async function uploadImage(file: File): Promise<string> {
    const ext = file.name.split('.').pop() ?? 'jpg'
    const uid = typeof crypto.randomUUID === 'function'
      ? crypto.randomUUID()
      : `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
    const path = `products/${uid}.${ext}`
    const { error } = await supabase.storage
      .from('product-images')
      .upload(path, file, { cacheControl: '3600' })
    if (error) throw error
    return supabase.storage.from('product-images').getPublicUrl(path).data.publicUrl
  }

  async function resolveImages(items: ImageItem[]): Promise<string[]> {
    return Promise.all(
      items.map((item) =>
        item.type === 'existing' ? Promise.resolve(item.url) : uploadImage(item.file)
      )
    )
  }

  async function handleFormSubmit(formData: ProductFormData, productId?: string) {
    let imageUrls: string[]
    try {
      imageUrls = await resolveImages(formData.imageItems)
    } catch (storageErr) {
      showToast('error', `Image upload failed: ${storageErr instanceof Error ? storageErr.message : String(storageErr)}`)
      throw storageErr
    }

    if (productId) {
      const result = await updateProduct(productId, formData, imageUrls)
      if ('error' in result) {
        showToast('error', `Update failed: ${result.error}`)
        throw new Error(result.error)
      }
      setProducts((prev) =>
        prev.map((p) => (p.id === productId ? result.data : p))
      )
      setPanelState({ open: false })
      showToast('success', 'Product updated.')
    } else {
      const result = await addProduct(formData, imageUrls)
      if ('error' in result) {
        showToast('error', `Add failed: ${result.error}`)
        throw new Error(result.error)
      }
      setProducts((prev) => [result.data, ...prev])
      setPanelState({ open: false })
      showToast('success', 'Product added.')
    }
  }

  async function handleDelete() {
    if (!deleteState.open) return
    const product = deleteState.product
    setIsDeleting(true)

    const result = await deleteProduct(product.id)
    if ('error' in result) {
      setIsDeleting(false)
      showToast('error', 'Failed to remove product.')
      return
    }

    // Best-effort image cleanup from storage
    const paths = product.images
      .map((url) => {
        const marker = '/product-images/'
        const idx = url.indexOf(marker)
        return idx >= 0 ? url.slice(idx + marker.length) : null
      })
      .filter((p): p is string => p !== null)

    if (paths.length > 0) {
      await supabase.storage.from('product-images').remove(paths)
    }

    setProducts((prev) => prev.filter((p) => p.id !== product.id))
    setDeleteState({ open: false })
    setIsDeleting(false)
    showToast('success', 'Product removed.')
  }

  return (
    <div className="min-h-screen bg-bg">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-surface border-b border-border backdrop-blur-sm">
        <div className="max-w-content mx-auto px-4 md:px-8 h-nav-mobile md:h-nav-desktop flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <span className="font-display text-h3 text-hap-text tracking-wide shrink-0">
              HAP
            </span>
            <span className="font-body text-small text-muted hidden sm:block truncate">
              Product Manager
            </span>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => setPanelState({ open: true, mode: 'add' })}
              className="hidden md:flex items-center gap-2 font-body font-semibold text-small text-white bg-brand rounded-btn px-4 py-2 hover:bg-accent transition-colors"
            >
              <span className="text-lg leading-none">+</span>
              Add Product
            </button>
            <button
              onClick={handleSignOut}
              className="font-body text-small text-muted hover:text-hap-text transition-colors px-3 py-2 rounded-btn border border-border hover:border-brand/20"
            >
              Sign out
            </button>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="max-w-content mx-auto px-4 md:px-8 py-8">
        {products.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <p className="font-display text-h2 text-muted">No products yet</p>
            <p className="font-body text-body text-muted mt-3 max-w-xs">
              Add your first product and it will show up here and in your catalog.
            </p>
            <button
              onClick={() => setPanelState({ open: true, mode: 'add' })}
              className="mt-8 font-body font-semibold text-body text-white bg-brand rounded-btn px-6 py-3 hover:bg-accent transition-colors"
            >
              Add your first product
            </button>
          </div>
        ) : (() => {
          const outOfStock = products.filter((p) => !p.in_stock).length
          const featured = products.filter((p) => p.featured).length
          const filteredProducts = products.filter((p) => {
            const matchesSearch = p.name
              .toLowerCase()
              .includes(searchQuery.toLowerCase().trim())
            const matchesCategory =
              activeCategory === 'all' || p.category === activeCategory
            return matchesSearch && matchesCategory
          })

          return (
            <>
              {/* Stats row */}
              <p className="font-body text-small text-muted mb-5">
                {products.length} products · {outOfStock} out of stock · {featured} featured
              </p>

              {/* Filter bar */}
              <div className="mb-6 space-y-3">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search products…"
                  className="w-full md:w-72 font-body text-small text-hap-text bg-surface border border-border rounded-input px-4 py-2 outline-none focus:border-brand transition-colors"
                />
                <div className="overflow-x-auto no-scrollbar">
                  <div className="flex gap-2 pb-0.5">
                    {ADMIN_CATEGORIES.map(({ value, label }) => {
                      const isActive = activeCategory === value
                      return (
                        <button
                          key={value}
                          onClick={() => setActiveCategory(value)}
                          className={[
                            'flex-none rounded-badge font-body text-small font-medium px-4 py-1.5',
                            'transition-colors duration-150 whitespace-nowrap',
                            isActive
                              ? 'bg-brand text-surface'
                              : 'bg-surface text-muted border border-border hover:border-brand hover:text-hap-text',
                          ].join(' ')}
                        >
                          {label}
                        </button>
                      )
                    })}
                  </div>
                </div>
              </div>

              {/* Table or no-results */}
              {filteredProducts.length === 0 ? (
                <p className="font-body text-body text-muted text-center py-16">
                  No products match your search.
                </p>
              ) : (
                <ProductTable
                  products={filteredProducts}
                  onToggleInStock={(p) => handleToggle(p, 'in_stock')}
                  onToggleFeatured={(p) => handleToggle(p, 'featured')}
                  onEdit={(p) => setPanelState({ open: true, mode: 'edit', product: p })}
                  onDelete={(p) => setDeleteState({ open: true, product: p })}
                />
              )}
            </>
          )
        })()}
      </main>

      {/* Mobile FAB */}
      <button
        onClick={() => setPanelState({ open: true, mode: 'add' })}
        aria-label="Add product"
        className="md:hidden fixed bottom-6 right-6 w-14 h-14 rounded-full bg-brand text-white text-2xl shadow-modal hover:bg-accent transition-colors flex items-center justify-center z-20"
      >
        +
      </button>

      {/* Form panel */}
      <ProductFormPanel
        state={panelState}
        onClose={() => setPanelState({ open: false })}
        onSubmit={handleFormSubmit}
      />

      {/* Delete confirmation */}
      <DeleteDialog
        state={deleteState}
        isDeleting={isDeleting}
        onCancel={() => setDeleteState({ open: false })}
        onConfirm={handleDelete}
      />

      {/* Toasts */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 md:left-auto md:right-6 md:translate-x-0 flex flex-col gap-2 z-50 w-[calc(100vw-3rem)] md:w-80 pointer-events-none">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`flex items-center gap-3 px-4 py-3 rounded-card shadow-modal border font-body text-small pointer-events-auto ${
              toast.type === 'success'
                ? 'bg-surface border-brand/20 text-hap-text'
                : 'bg-surface border-red-200 text-red-700'
            }`}
          >
            <span
              className={`text-base shrink-0 ${
                toast.type === 'success' ? 'text-brand' : 'text-red-500'
              }`}
            >
              {toast.type === 'success' ? '✓' : '✕'}
            </span>
            <span className="flex-1">{toast.message}</span>
            <button
              onClick={() => setToasts((prev) => prev.filter((t) => t.id !== toast.id))}
              className="text-muted hover:text-hap-text shrink-0 text-lg leading-none"
            >
              ×
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
