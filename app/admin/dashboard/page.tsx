import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import AdminLayout from '@/components/admin/AdminLayout'
import DashboardOverview from '@/components/admin/DashboardOverview'

export const metadata = {
  title: 'Admin Dashboard — BOELEDIN CMS',
}

export default async function AdminDashboardPage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect('/admin/login')
  }

  return (
    <AdminLayout>
      <DashboardOverview />
    </AdminLayout>
  )
}
