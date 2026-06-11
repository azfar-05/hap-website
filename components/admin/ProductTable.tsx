'use client'

import Image from 'next/image'
import type { Product } from '@/types/database.types'

const CATEGORY_LABELS: Record<string, string> = {
  tableware: 'Tableware',
  kitchenware: 'Kitchenware',
  crockery: 'Crockery',
  cutlery: 'Cutlery',
  home_decor: 'Home Decor',
}

function formatPrice(price: number) {
  return `₹${price.toLocaleString('en-IN')}`
}

function Toggle({
  checked,
  onChange,
  compact = false,
}: {
  checked: boolean
  onChange: () => void
  compact?: boolean
}) {
  const base = `relative inline-flex rounded-full transition-colors duration-200 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-1 ${
    checked ? 'bg-brand' : 'bg-border'
  }`

  if (compact) {
    return (
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={onChange}
        className={`${base} w-9 h-5`}
      >
        <span
          className={`absolute top-[3px] left-[3px] w-3.5 h-3.5 rounded-full bg-white shadow-sm transition-transform duration-200 ${
            checked ? 'translate-x-4' : 'translate-x-0'
          }`}
        />
      </button>
    )
  }

  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={onChange}
      className={`${base} w-11 h-6`}
    >
      <span
        className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white shadow-sm transition-transform duration-200 ${
          checked ? 'translate-x-5' : 'translate-x-0'
        }`}
      />
    </button>
  )
}

type Props = {
  products: Product[]
  onToggleInStock: (product: Product) => void
  onToggleFeatured: (product: Product) => void
  onEdit: (product: Product) => void
  onDelete: (product: Product) => void
}

export default function ProductTable({
  products,
  onToggleInStock,
  onToggleFeatured,
  onEdit,
  onDelete,
}: Props) {
  return (
    <>
      {/* ── Mobile card list (< md) ── */}
      <div className="md:hidden rounded-card border border-border shadow-card-rest overflow-hidden">
        {/* Column labels */}
        <div className="flex items-center gap-3 px-3 py-2 bg-surface border-b border-border">
          <span className="flex-1 font-body text-[10px] font-medium text-muted uppercase tracking-widest">
            Product
          </span>
          <div className="flex items-center gap-2 shrink-0">
            <span className="w-9 text-center font-body text-[10px] font-medium text-muted uppercase tracking-widest">
              Stock
            </span>
            <span className="w-9 text-center font-body text-[10px] font-medium text-muted uppercase tracking-widest">
              Feat.
            </span>
            {/* spacer matches two w-8 icon buttons + gap-2 between them */}
            <span className="w-[72px]" />
          </div>
        </div>

        <div className="divide-y divide-border">
          {products.map((product) => (
            <div
              key={product.id}
              className="flex items-center gap-3 px-3 bg-surface hover:bg-surface-hover transition-colors min-h-[72px]"
            >
              {/* Tapping the thumbnail or name opens edit */}
              <button
                onClick={() => onEdit(product)}
                className="flex-1 min-w-0 py-3 text-left flex items-center gap-3"
              >
                <span className="relative w-10 h-10 flex-none rounded-lg overflow-hidden bg-bg ring-1 ring-border">
                  {product.images[0] && (
                    <Image
                      src={product.images[0]}
                      alt=""
                      fill
                      sizes="40px"
                      className="object-cover"
                    />
                  )}
                </span>
                <span className="min-w-0">
                  <span className="font-body text-[14px] font-medium text-hap-text block truncate leading-snug">
                    {product.name}
                  </span>
                  <span className="block mt-0.5 font-body text-[12px] text-muted truncate">
                    {formatPrice(product.price)} ·{' '}
                    {CATEGORY_LABELS[product.category] ?? product.category}
                  </span>
                </span>
              </button>

              {/* Toggles + icon actions */}
              <div className="flex items-center gap-2 shrink-0">
                <Toggle
                  compact
                  checked={product.in_stock}
                  onChange={() => onToggleInStock(product)}
                />
                <Toggle
                  compact
                  checked={product.featured}
                  onChange={() => onToggleFeatured(product)}
                />
                <button
                  onClick={() => onEdit(product)}
                  aria-label="Edit product"
                  className="w-8 h-8 flex items-center justify-center rounded-btn text-brand hover:text-accent hover:bg-accent/5 transition-colors"
                >
                  <svg
                    width="15"
                    height="15"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                  </svg>
                </button>
                <button
                  onClick={() => onDelete(product)}
                  aria-label="Remove product"
                  className="w-8 h-8 flex items-center justify-center rounded-btn text-muted hover:text-red-600 hover:bg-red-50 transition-colors"
                >
                  <svg
                    width="15"
                    height="15"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <polyline points="3 6 5 6 21 6" />
                    <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                    <path d="M10 11v6M14 11v6" />
                    <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Desktop table (≥ md) — unchanged ── */}
      <div className="hidden md:block overflow-x-auto rounded-card border border-border shadow-card-rest">
        <table className="w-full min-w-[680px]">
          <thead>
            <tr className="border-b border-border bg-surface">
              <th className="text-left px-4 py-3 font-body text-small font-medium text-muted">
                Name
              </th>
              <th className="text-left px-4 py-3 font-body text-small font-medium text-muted">
                Category
              </th>
              <th className="text-left px-4 py-3 font-body text-small font-medium text-muted">
                Price
              </th>
              <th className="text-center px-4 py-3 font-body text-small font-medium text-muted">
                In Stock
              </th>
              <th className="text-center px-4 py-3 font-body text-small font-medium text-muted">
                Featured
              </th>
              <th className="text-right px-4 py-3 font-body text-small font-medium text-muted">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {products.map((product, i) => (
              <tr
                key={product.id}
                className={`border-b border-border last:border-0 hover:bg-surface-hover transition-colors ${
                  i % 2 === 0 ? 'bg-bg' : 'bg-surface'
                }`}
              >
                <td className="px-4 py-3 max-w-[240px]">
                  <div className="flex items-center gap-3">
                    <span className="relative w-10 h-10 flex-none rounded-lg overflow-hidden bg-bg ring-1 ring-border">
                      {product.images[0] && (
                        <Image
                          src={product.images[0]}
                          alt=""
                          fill
                          sizes="40px"
                          className="object-cover"
                        />
                      )}
                    </span>
                    <span className="font-body text-body text-hap-text font-medium truncate block">
                      {product.name}
                    </span>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <span className="font-body text-small text-muted">
                    {CATEGORY_LABELS[product.category] ?? product.category}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span className="font-body text-small font-semibold text-hap-text">
                    {formatPrice(product.price)}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex justify-center">
                    <Toggle
                      checked={product.in_stock}
                      onChange={() => onToggleInStock(product)}
                    />
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="flex justify-center">
                    <Toggle
                      checked={product.featured}
                      onChange={() => onToggleFeatured(product)}
                    />
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => onEdit(product)}
                      className="font-body text-small font-medium text-brand hover:text-accent transition-colors px-3 py-1.5 rounded-btn border border-brand/20 hover:border-accent/40 hover:bg-accent/5"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => onDelete(product)}
                      className="font-body text-small font-medium text-muted hover:text-red-600 transition-colors px-3 py-1.5 rounded-btn border border-border hover:border-red-200 hover:bg-red-50"
                    >
                      Remove
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  )
}
