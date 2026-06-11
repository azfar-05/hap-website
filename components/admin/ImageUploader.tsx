'use client'

import Image from 'next/image'
import { useRef, useState } from 'react'

export type ImageItem =
  | { type: 'existing'; url: string }
  | { type: 'new'; file: File; preview: string }

type Props = {
  items: ImageItem[]
  onChange: (items: ImageItem[]) => void
  hasError?: boolean
}

export default function ImageUploader({ items, onChange, hasError }: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isDropOver, setIsDropOver] = useState(false)
  const [dragIndex, setDragIndex] = useState<number | null>(null)
  const [dropIndex, setDropIndex] = useState<number | null>(null)

  function addFiles(files: FileList | null) {
    if (!files) return
    const newItems: ImageItem[] = Array.from(files)
      .filter((f) => f.type.startsWith('image/'))
      .map((file) => ({
        type: 'new' as const,
        file,
        preview: URL.createObjectURL(file),
      }))
    onChange([...items, ...newItems])
  }

  function removeItem(index: number) {
    const item = items[index]
    if (item.type === 'new') URL.revokeObjectURL(item.preview)
    onChange(items.filter((_, i) => i !== index))
  }

  function setCover(index: number) {
    const next = [...items]
    const [item] = next.splice(index, 1)
    next.unshift(item)
    onChange(next)
  }

  function handleZoneDrop(e: React.DragEvent) {
    e.preventDefault()
    setIsDropOver(false)
    if (dragIndex === null) {
      addFiles(e.dataTransfer.files)
    }
  }

  function handleThumbDragStart(index: number) {
    setDragIndex(index)
  }

  function handleThumbDragOver(e: React.DragEvent, index: number) {
    e.preventDefault()
    e.stopPropagation()
    if (dragIndex !== null && dragIndex !== index) setDropIndex(index)
  }

  function handleThumbDrop(e: React.DragEvent, index: number) {
    e.preventDefault()
    e.stopPropagation()
    if (dragIndex === null || dragIndex === index) return
    const next = [...items]
    const [moved] = next.splice(dragIndex, 1)
    next.splice(index, 0, moved)
    onChange(next)
    setDragIndex(null)
    setDropIndex(null)
  }

  function handleThumbDragEnd() {
    setDragIndex(null)
    setDropIndex(null)
  }

  return (
    <div className="space-y-3">
      <div
        onDragOver={(e) => {
          e.preventDefault()
          if (dragIndex === null) setIsDropOver(true)
        }}
        onDragLeave={() => setIsDropOver(false)}
        onDrop={handleZoneDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`border-2 border-dashed rounded-card p-6 text-center cursor-pointer transition-colors select-none ${
          hasError && items.length === 0
            ? 'border-red-300 bg-red-50'
            : isDropOver
            ? 'border-brand bg-brand/5'
            : 'border-border hover:border-brand/50 hover:bg-surface'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(e) => {
            addFiles(e.target.files)
            e.target.value = ''
          }}
        />
        <p className="font-body text-small text-muted">
          {isDropOver ? 'Drop images here' : 'Drag images here or tap to upload'}
        </p>
        <p className="font-body text-small text-muted/60 mt-1">JPG, PNG, WEBP · multiple allowed</p>
      </div>

      {items.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {items.map((item, i) => (
            <div key={i} className="flex flex-col items-center gap-1 flex-shrink-0">
              <div
                draggable
                onDragStart={() => handleThumbDragStart(i)}
                onDragOver={(e) => handleThumbDragOver(e, i)}
                onDrop={(e) => handleThumbDrop(e, i)}
                onDragEnd={handleThumbDragEnd}
                className={`relative group w-20 h-20 rounded-input overflow-hidden border-2 transition-all cursor-grab active:cursor-grabbing ${
                  dropIndex === i
                    ? 'border-brand scale-105 shadow-card-hover'
                    : dragIndex === i
                    ? 'opacity-40 border-transparent'
                    : 'border-border'
                }`}
              >
                <Image
                  src={item.type === 'existing' ? item.url : item.preview}
                  fill
                  alt=""
                  unoptimized={item.type === 'new'}
                  sizes="80px"
                  className="object-cover pointer-events-none"
                />
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation()
                    removeItem(i)
                  }}
                  aria-label="Remove image"
                  className="absolute inset-0 flex items-center justify-center bg-hap-text/60 opacity-0 group-hover:opacity-100 transition-opacity text-white text-xl font-semibold"
                >
                  ×
                </button>
              </div>
              {i === 0 ? (
                <span className="font-body text-[10px] font-medium text-white bg-brand rounded-badge px-2 py-0.5 whitespace-nowrap pointer-events-none">
                  Cover · shown in catalog
                </span>
              ) : (
                <button
                  type="button"
                  onClick={() => setCover(i)}
                  className="font-body text-[10px] font-medium text-brand hover:text-accent transition-colors whitespace-nowrap"
                >
                  Set as cover
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      <p className="font-body text-sm text-muted">
        For best results, shoot on a white or warm neutral background. Your full image will always be shown — nothing is ever cropped.
      </p>

      {hasError && items.length === 0 && (
        <p className="font-body text-small text-red-600">At least one image is required.</p>
      )}
    </div>
  )
}
