'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Plus, Edit, Trash2, Search } from 'lucide-react'
import toast from 'react-hot-toast'

export default function NewsManagement() {
  const [searchQuery, setSearchQuery] = useState('')
  const [newsItems, setNewsItems] = useState([
    {
      id: 1,
      title: 'Apa Itu Digital Signage dan Mengapa Bisnis Anda Membutuhkannya',
      category: 'Digital Signage',
      status: 'publish',
      author: 'Admin',
      date: '2024-01-15',
    },
    {
      id: 2,
      title: 'Interactive Flat Panel vs Proyektor: Mana yang Tepat untuk Ruang Rapat Modern',
      category: 'Interactive Flat Panel',
      status: 'publish',
      author: 'Admin',
      date: '2024-01-20',
    },
    {
      id: 3,
      title: 'Memahami Pixel Pitch pada LED Display: Panduan Memilih Jarak Piksel',
      category: 'LED Display',
      status: 'draft',
      author: 'Admin',
      date: '2024-01-25',
    },
  ])

  const filteredNews = newsItems.filter((item) =>
    item.title.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleDelete = (id: number) => {
    if (confirm('Yakin ingin menghapus berita ini?')) {
      setNewsItems(newsItems.filter((item) => item.id !== id))
      toast.success('Berita berhasil dihapus')
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-2">Kelola Berita</h1>
          <p className="text-muted-foreground">Kelola semua artikel dan berita dari WordPress CMS</p>
        </div>
        <Link
          href="/admin/news/new"
          className="flex items-center gap-2 px-6 py-2 bg-primary text-primary-foreground font-semibold rounded-lg hover:bg-primary/90 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Tambah Berita
        </Link>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
        <input
          type="text"
          placeholder="Cari berita..."
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
                <th className="px-6 py-4 text-left font-semibold">Judul</th>
                <th className="px-6 py-4 text-left font-semibold">Kategori</th>
                <th className="px-6 py-4 text-left font-semibold">Penulis</th>
                <th className="px-6 py-4 text-left font-semibold">Status</th>
                <th className="px-6 py-4 text-left font-semibold">Tanggal</th>
                <th className="px-6 py-4 text-left font-semibold">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredNews.map((item) => (
                <tr key={item.id} className="hover:bg-accent/50 transition-colors">
                  <td className="px-6 py-4 font-medium max-w-xs truncate">{item.title}</td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">{item.category}</td>
                  <td className="px-6 py-4 text-sm">{item.author}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                        item.status === 'publish'
                          ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-200'
                          : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-200'
                      }`}
                    >
                      {item.status === 'publish' ? 'Dipublikasikan' : 'Draft'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">{item.date}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/admin/news/${item.id}/edit`}
                        className="p-2 rounded-lg hover:bg-accent transition-colors"
                        title="Edit"
                      >
                        <Edit className="w-4 h-4 text-primary" />
                      </Link>
                      <button
                        onClick={() => handleDelete(item.id)}
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

        {filteredNews.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Tidak ada berita ditemukan</p>
          </div>
        )}
      </div>

      {/* Info Box */}
      <div className="bg-accent border border-primary/30 rounded-lg p-6">
        <h3 className="font-semibold mb-2">Informasi</h3>
        <p className="text-sm text-muted-foreground">
          Kelola semua artikel berita dari dashboard ini. Setiap artikel akan langsung ditampilkan di halaman Berita website.
        </p>
      </div>
    </div>
  )
}
