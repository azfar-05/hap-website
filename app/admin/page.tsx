import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import AdminDashboard from '@/components/admin/AdminDashboard'
import type { HeroSlot } from '@/types/database.types'

export default async function AdminPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/admin/login')

  const [{ data: products }, { data: heroData }] = await Promise.all([
    supabase.from('products').select('*').order('created_at', { ascending: false }),
    supabase.from('hero_images').select('*').order('slot', { ascending: true }),
  ])

  return (
    <AdminDashboard
      initialProducts={products ?? []}
      initialHeroSlots={(heroData ?? []) as HeroSlot[]}
    />
  )
}
