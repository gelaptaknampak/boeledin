import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import AdminLayout from '@/components/admin/AdminLayout'
import PagesManagement from '@/components/admin/PagesManagement'

export const metadata = {
  title: 'Kelola Halaman — Admin BOELEDIN',
}

export default async function PagesManagementPage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect('/admin/login')
  }

  return (
    <AdminLayout>
      <PagesManagement />
    </AdminLayout>
  )
}
