'use client'

import type { Product } from '@/types/database.types'

export type DeleteDialogState = { open: false } | { open: true; product: Product }

type Props = {
  state: DeleteDialogState
  isDeleting: boolean
  onCancel: () => void
  onConfirm: () => void
}

export default function DeleteDialog({ state, isDeleting, onCancel, onConfirm }: Props) {
  const productName = state.open ? state.product.name : ''

  return (
    <div
      className={`fixed inset-0 z-50 flex items-end sm:items-center justify-center px-4 pb-safe ${
        state.open ? '' : 'pointer-events-none'
      }`}
    >
      <div
        className={`absolute inset-0 bg-hap-text/40 transition-opacity duration-200 ${
          state.open ? 'opacity-100' : 'opacity-0'
        }`}
        onClick={onCancel}
      />

      <div
        className={`relative w-full sm:max-w-sm bg-surface rounded-t-card sm:rounded-card p-6 shadow-modal transition-all duration-200 ${
          state.open ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
        }`}
      >
        <h2 className="font-display text-h3 text-hap-text">Remove this product?</h2>
        <p className="font-body text-body text-muted mt-2">
          <span className="text-hap-text font-medium">{productName}</span> will be permanently
          removed. This cannot be undone.
        </p>

        <div className="flex gap-3 mt-6">
          <button
            type="button"
            onClick={onCancel}
            disabled={isDeleting}
            className="flex-1 font-body font-medium text-body text-muted border border-border rounded-btn px-4 py-3 hover:bg-surface-hover transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isDeleting}
            className="flex-1 font-body font-semibold text-body text-white bg-red-500 rounded-btn px-4 py-3 hover:bg-red-600 transition-colors disabled:opacity-60"
          >
            {isDeleting ? 'Removing…' : 'Remove'}
          </button>
        </div>
      </div>
    </div>
  )
}
