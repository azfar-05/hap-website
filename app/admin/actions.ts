'use server'

import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import type { Product } from '@/types/database.types'
import type { ProductFormData } from '@/components/admin/ProductFormPanel'

// ── Auth ──────────────────────────────────────────────────────────────────────

export async function loginAction(
  email: string,
  password: string
): Promise<{ error: string }> {
  if (email !== process.env.ADMIN_EMAIL) {
    return { error: 'Access denied.' }
  }
  const supabase = await createClient()
  const { error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) {
    return { error: 'Incorrect email or password.' }
  }
  redirect('/admin')
}

// ── Mutations (service-role — bypasses RLS safely, server-only) ───────────────

type MutationResult = { error: string } | { data: Product }

function buildFields(formData: ProductFormData, imageUrls: string[]) {
  return {
    name: formData.name.trim(),
    price: Number(formData.price),
    category: formData.category as string,
    description: formData.description.trim() || null,
    color: formData.color.trim() || null,
    size: formData.size.trim() || null,
    material: formData.material.trim() || null,
    images: imageUrls,
  }
}

export async function addProduct(
  formData: ProductFormData,
  imageUrls: string[]
): Promise<MutationResult> {
  const supabase = createAdminClient()
  const { data, error } = await supabase
    .from('products')
    .insert({ ...buildFields(formData, imageUrls), in_stock: true, featured: false })
    .select()
    .single()
  if (error) return { error: error.message }
  return { data: data as unknown as Product }
}

export async function updateProduct(
  id: string,
  formData: ProductFormData,
  imageUrls: string[]
): Promise<MutationResult> {
  const supabase = createAdminClient()
  const { data, error } = await supabase
    .from('products')
    .update(buildFields(formData, imageUrls))
    .eq('id', id)
    .select()
    .single()
  if (error) return { error: error.message }
  return { data: data as unknown as Product }
}

export async function deleteProduct(id: string): Promise<{ error: string } | { ok: true }> {
  const supabase = createAdminClient()
  const { error } = await supabase.from('products').delete().eq('id', id)
  if (error) return { error: error.message }
  return { ok: true }
}

export async function toggleProduct(
  id: string,
  field: 'in_stock' | 'featured',
  value: boolean
): Promise<{ error: string } | { ok: true }> {
  const supabase = createAdminClient()
  const patch =
    field === 'in_stock'
      ? { in_stock: value }
      : { featured: value, featured_at: value ? new Date().toISOString() : null }
  const { error } = await supabase.from('products').update(patch).eq('id', id)
  if (error) return { error: error.message }
  return { ok: true }
}

// ── Hero collage ──────────────────────────────────────────────────────────────

export async function upsertHeroSlot(
  slot: number,
  imageUrl: string
): Promise<{ error: string } | { ok: true }> {
  const supabase = createAdminClient()
  const { error } = await supabase
    .from('hero_images')
    .upsert({ slot, image_url: imageUrl, updated_at: new Date().toISOString() })
  if (error) return { error: error.message }
  return { ok: true }
}

export async function removeHeroSlot(slot: number): Promise<{ error: string } | { ok: true }> {
  const supabase = createAdminClient()
  const { error } = await supabase.from('hero_images').delete().eq('slot', slot)
  if (error) return { error: error.message }
  return { ok: true }
}

export async function uploadHeroImage(
  formData: FormData
): Promise<{ error: string } | { publicUrl: string }> {
  const supabase = createAdminClient()
  const file = formData.get('file') as File
  if (!file) return { error: 'No file provided' }

  const ext = file.name.split('.').pop() ?? 'jpg'
  const uid = crypto.randomUUID()
  const path = `hero/${uid}.${ext}`

  const { error: uploadError } = await supabase.storage
    .from('product-images')
    .upload(path, file, { cacheControl: '3600' })

  if (uploadError) return { error: uploadError.message }

  const { data: { publicUrl } } = supabase.storage
    .from('product-images')
    .getPublicUrl(path)

  return { publicUrl }
}

export async function deleteHeroImage(
  path: string
): Promise<{ error: string } | { ok: true }> {
  const supabase = createAdminClient()
  const { error } = await supabase.storage.from('product-images').remove([path])
  if (error) return { error: error.message }
  return { ok: true }
}
