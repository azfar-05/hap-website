'use client'

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

function Toggle({ checked, onChange }: { checked: boolean; onChange: () => void }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={onChange}
      className={`relative inline-flex w-11 h-6 rounded-full transition-colors duration-200 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-1 ${
        checked ? 'bg-brand' : 'bg-border'
      }`}
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
    <div className="overflow-x-auto rounded-card border border-border shadow-card-rest">
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
              <td className="px-4 py-3 max-w-[200px]">
                <span className="font-body text-body text-hap-text font-medium truncate block">
                  {product.name}
                </span>
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
  )
}
