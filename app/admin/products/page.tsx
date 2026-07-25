import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import AdminLayout from '@/components/admin/AdminLayout'
import ProductsManagement from '@/components/admin/ProductsManagement'

export const metadata = {
  title: 'Kelola Produk — Admin BOELEDIN',
}

export default async function ProductsManagementPage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect('/admin/login')
  }

  return (
    <AdminLayout>
      <ProductsManagement />
    </AdminLayout>
  )
}
