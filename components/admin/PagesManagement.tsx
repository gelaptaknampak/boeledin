'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Plus, Edit, Trash2, Search } from 'lucide-react'
import toast from 'react-hot-toast'

export default function PagesManagement() {
  const [searchQuery, setSearchQuery] = useState('')
  const [pages, setPages] = useState([
    { id: 1, title: 'Home', slug: 'home', status: 'publish', modified: '2024-02-15' },
    { id: 2, title: 'Tentang Kami', slug: 'tentang-kami', status: 'publish', modified: '2024-02-14' },
    { id: 3, title: 'Kebijakan Privasi', slug: 'privacy', status: 'publish', modified: '2024-01-20' },
    { id: 4, title: 'Syarat & Ketentuan', slug: 'terms', status: 'draft', modified: '2024-01-15' },
    { id: 5, title: 'Sitemap', slug: 'sitemap', status: 'publish', modified: '2024-02-10' },
  ])

  const filteredPages = pages.filter((page) =>
    page.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    page.slug.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleDelete = (id: number) => {
    if (confirm('Yakin ingin menghapus halaman ini?')) {
      setPages(pages.filter((p) => p.id !== id))
      toast.success('Halaman berhasil dihapus')
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-2">Kelola Halaman</h1>
          <p className="text-muted-foreground">Kelola semua halaman statis dari WordPress CMS</p>
        </div>
        <Link
          href="/admin/pages/new"
          className="flex items-center gap-2 px-6 py-2 bg-primary text-primary-foreground font-semibold rounded-lg hover:bg-primary/90 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Tambah Halaman
        </Link>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
        <input
          type="text"
          placeholder="Cari halaman..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>

      {/* Table */}
      <div className="bg-card border border-border rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-accent border-b border-border">
              <tr>
                <th className="px-6 py-4 text-left font-semibold">Judul Halaman</th>
                <th className="px-6 py-4 text-left font-semibold">Slug</th>
                <th className="px-6 py-4 text-left font-semibold">Status</th>
                <th className="px-6 py-4 text-left font-semibold">Diubah</th>
                <th className="px-6 py-4 text-left font-semibold">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredPages.map((page) => (
                <tr key={page.id} className="hover:bg-accent/50 transition-colors">
                  <td className="px-6 py-4 font-medium">{page.title}</td>
                  <td className="px-6 py-4 text-sm text-muted-foreground font-mono">/{page.slug}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                        page.status === 'publish'
                          ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-200'
                          : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-200'
                      }`}
                    >
                      {page.status === 'publish' ? 'Dipublikasikan' : 'Draft'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">{page.modified}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/admin/pages/${page.id}/edit`}
                        className="p-2 rounded-lg hover:bg-accent transition-colors"
                        title="Edit"
                      >
                        <Edit className="w-4 h-4 text-primary" />
                      </Link>
                      <button
                        onClick={() => handleDelete(page.id)}
                        className="p-2 rounded-lg hover:bg-accent transition-colors"
                        title="Hapus"
                      >
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredPages.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Tidak ada halaman ditemukan</p>
          </div>
        )}
      </div>

      {/* Info Box */}
      <div className="bg-accent border border-primary/30 rounded-lg p-6">
        <h3 className="font-semibold mb-2">Informasi</h3>
        <p className="text-sm text-muted-foreground">
          Kelola halaman-halaman statis seperti Home, Tentang Kami, Privacy Policy, dan Syarat & Ketentuan dari dashboard ini.
        </p>
      </div>
    </div>
  )
}
