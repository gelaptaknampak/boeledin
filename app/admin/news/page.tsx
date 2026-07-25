import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import AdminLayout from '@/components/admin/AdminLayout'
import NewsManagement from '@/components/admin/NewsManagement'

export const metadata = {
  title: 'Kelola Berita — Admin BOELEDIN',
}

export default async function NewsManagementPage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect('/admin/login')
  }

  return (
    <AdminLayout>
      <NewsManagement />
    </AdminLayout>
  )
}
