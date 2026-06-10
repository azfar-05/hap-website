import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import AdminDashboard from '@/components/admin/AdminDashboard'

export default async function AdminPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/admin/login')

  const { data: products } = await supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: false })

  return <AdminDashboard initialProducts={products ?? []} />
}
