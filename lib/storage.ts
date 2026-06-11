/** Extracts the storage object path from a `product-images` public URL. */
export function storagePathFromUrl(url: string): string | null {
  const marker = '/product-images/'
  const idx = url.indexOf(marker)
  return idx >= 0 ? url.slice(idx + marker.length) : null
}
