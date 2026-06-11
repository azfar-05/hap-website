'use client'

import { useRef, useState } from 'react'
import Image from 'next/image'
import { upsertHeroSlot, removeHeroSlot, uploadHeroImage, deleteHeroImage } from '@/app/admin/actions'
import type { HeroSlot } from '@/types/database.types'

interface Props {
  initialSlots: HeroSlot[]
  onToast: (type: 'success' | 'error', message: string) => void
}

const SLOT_LABELS = ['First image', 'Second image', 'Third image'] as const

export default function HeroCollageManager({ initialSlots, onToast }: Props) {
  const [slots, setSlots] = useState<HeroSlot[]>(initialSlots)
  const [uploadingSlot, setUploadingSlot] = useState<number | null>(null)
  const fileRefs = [
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
  ]

  function getSlot(slot: number): HeroSlot | undefined {
    return slots.find((s) => s.slot === slot)
  }

  async function handleFileChange(slot: number, files: FileList | null) {
    if (!files || files.length === 0) return
    const file = files[0]
    if (!file.type.startsWith('image/')) {
      onToast('error', 'Please select an image file.')
      return
    }

    setUploadingSlot(slot)

    // Best-effort cleanup of old file via server action
    const existing = getSlot(slot)
    if (existing) {
      const marker = '/product-images/'
      const idx = existing.image_url.indexOf(marker)
      if (idx >= 0) {
        const oldPath = existing.image_url.slice(idx + marker.length)
        await deleteHeroImage(oldPath)
      }
    }

    // Upload new file via server action
    const fd = new FormData()
    fd.append('file', file)
    const uploadResult = await uploadHeroImage(fd)

    if ('error' in uploadResult) {
      setUploadingSlot(null)
      onToast('error', `Upload failed: ${uploadResult.error}`)
      return
    }

    const { publicUrl } = uploadResult
    const result = await upsertHeroSlot(slot, publicUrl)
    setUploadingSlot(null)

    if ('error' in result) {
      onToast('error', `Failed to save: ${result.error}`)
      return
    }

    const updated: HeroSlot = {
      slot,
      image_url: publicUrl,
      updated_at: new Date().toISOString(),
    }
    setSlots((prev) => {
      const next = prev.filter((s) => s.slot !== slot)
      return [...next, updated].sort((a, b) => a.slot - b.slot)
    })
    onToast('success', `Slot ${slot} updated.`)
  }

  async function handleRemove(slot: number) {
    const existing = getSlot(slot)
    if (!existing) return

    // Best-effort storage cleanup via server action
    const marker = '/product-images/'
    const idx = existing.image_url.indexOf(marker)
    if (idx >= 0) {
      const oldPath = existing.image_url.slice(idx + marker.length)
      await deleteHeroImage(oldPath)
    }

    const result = await removeHeroSlot(slot)
    if ('error' in result) {
      onToast('error', `Failed to remove: ${result.error}`)
      return
    }

    setSlots((prev) => prev.filter((s) => s.slot !== slot))
    onToast('success', `Slot ${slot} cleared.`)
  }

  return (
    <div>
      <h3 className="font-display text-h3 text-hap-text mb-1">Hero Collage</h3>
      <p className="font-body text-sm text-muted mb-6">
        These 3 images are shown in the homepage collage. Choose your strongest lifestyle or
        product shots.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {([1, 2, 3] as const).map((slot) => {
          const current = getSlot(slot)
          const isUploading = uploadingSlot === slot
          const inputRef = fileRefs[slot - 1]

          return (
            <div key={slot} className="flex flex-col gap-2">
              <p className="font-body text-small font-medium text-muted">
                {SLOT_LABELS[slot - 1]}
              </p>

              {/* Square preview */}
              <div className="relative w-full aspect-square rounded-card overflow-hidden bg-border border border-border">
                {current ? (
                  <Image
                    src={current.image_url}
                    alt={`Hero collage slot ${slot}`}
                    fill
                    sizes="(min-width: 640px) 33vw, 90vw"
                    className="object-cover"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="font-body text-small text-muted/60">Empty</span>
                  </div>
                )}

                {/* Uploading overlay */}
                {isUploading && (
                  <div className="absolute inset-0 bg-surface/80 flex items-center justify-center">
                    <span className="font-body text-small text-brand animate-pulse">
                      Uploading…
                    </span>
                  </div>
                )}
              </div>

              {/* Hidden file input */}
              <input
                ref={inputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  handleFileChange(slot, e.target.files)
                  e.target.value = ''
                }}
              />

              {/* Action buttons */}
              <div className="flex gap-2">
                <button
                  type="button"
                  disabled={isUploading}
                  onClick={() => inputRef.current?.click()}
                  className="flex-1 font-body text-small font-medium text-brand border border-brand/30 rounded-btn px-3 py-2 hover:bg-brand/5 transition-colors disabled:opacity-50"
                >
                  {current ? 'Replace' : 'Upload'}
                </button>
                {current && (
                  <button
                    type="button"
                    disabled={isUploading}
                    onClick={() => handleRemove(slot)}
                    className="font-body text-small font-medium text-muted border border-border rounded-btn px-3 py-2 hover:border-red-300 hover:text-red-600 transition-colors disabled:opacity-50"
                  >
                    Remove
                  </button>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
