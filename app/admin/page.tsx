import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import AdminDashboard from '@/components/admin/AdminDashboard'
import type { HeroSlot, CategoryRow } from '@/types/database.types'

export default async function AdminPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Only the configured admin may see the dashboard (mutations are also
  // admin-gated server-side in actions.ts)
  if (!user || user.email !== process.env.ADMIN_EMAIL) redirect('/admin/login')

  const [{ data: products }, { data: heroData }, { data: categoriesData }] = await Promise.all([
    supabase.from('products').select('*').order('created_at', { ascending: false }),
    supabase.from('hero_images').select('*').order('slot', { ascending: true }),
    supabase.from('categories').select('*').order('display_order', { ascending: true }),
  ])

  return (
    <AdminDashboard
      initialProducts={products ?? []}
      initialHeroSlots={(heroData ?? []) as HeroSlot[]}
      initialCategories={(categoriesData ?? []) as CategoryRow[]}
    />
  )
}
