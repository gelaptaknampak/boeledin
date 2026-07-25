import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import AdminLayout from '@/components/admin/AdminLayout'
import SettingsPage from '@/components/admin/SettingsPage'

export const metadata = {
  title: 'Pengaturan — Admin BOELEDIN',
}

export default async function AdminSettingsPage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect('/admin/login')
  }

  return (
    <AdminLayout>
      <SettingsPage />
    </AdminLayout>
  )
}
