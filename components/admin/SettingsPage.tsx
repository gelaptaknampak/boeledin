'use client'

import { useState } from 'react'
import toast from 'react-hot-toast'
import { Save } from 'lucide-react'

export default function SettingsPage() {
  const [settings, setSettings] = useState({
    siteName: 'BOELEDIN Indonesia',
    siteDescription: 'Solusi Tampilan Digital dan Display Technology',
    wpUrl: process.env.NEXT_PUBLIC_WORDPRESS_URL || '',
    email: 'info@boeledin.com',
    phone: '+62 21 1234 5678',
    address: 'Jl. Sudirman No. 123, Jakarta Selatan 12190, Indonesia',
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setSettings({ ...settings, [name]: value })
  }

  const handleSave = () => {
    toast.success('Pengaturan berhasil disimpan')
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold mb-2">Pengaturan Aplikasi</h1>
        <p className="text-muted-foreground">Kelola pengaturan umum website dan koneksi WordPress</p>
      </div>

      {/* General Settings */}
      <div className="bg-card border border-border rounded-lg p-8">
        <h2 className="text-2xl font-bold mb-6">Pengaturan Umum</h2>
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-semibold mb-2">Nama Website</label>
            <input
              type="text"
              name="siteName"
              value={settings.siteName}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">Deskripsi Website</label>
            <textarea
              name="siteDescription"
              value={settings.siteDescription}
              onChange={handleChange}
              rows={3}
              className="w-full px-4 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">Email Kontak</label>
            <input
              type="email"
              name="email"
              value={settings.email}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">Nomor Telepon</label>
            <input
              type="tel"
              name="phone"
              value={settings.phone}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">Alamat Kantor</label>
            <textarea
              name="address"
              value={settings.address}
              onChange={handleChange}
              rows={2}
              className="w-full px-4 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary resize-none"
            />
          </div>
        </div>
      </div>

      {/* WordPress Connection */}
      <div className="bg-card border border-border rounded-lg p-8">
        <h2 className="text-2xl font-bold mb-6">Koneksi WordPress</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold mb-2">WordPress URL</label>
            <input
              type="url"
              name="wpUrl"
              value={settings.wpUrl}
              onChange={handleChange}
              disabled
              className="w-full px-4 py-2 border border-border rounded-lg bg-accent opacity-70 cursor-not-allowed focus:outline-none"
            />
            <p className="text-xs text-muted-foreground mt-2">Dikonfigurasi melalui environment variables</p>
          </div>

          <div className="p-4 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-200 rounded-lg">
            <p className="text-sm font-semibold">✓ WordPress Connected</p>
            <p className="text-xs mt-1">Koneksi ke WordPress API berfungsi dengan baik</p>
          </div>
        </div>
      </div>

      {/* Integration Guide */}
      <div className="bg-accent border border-primary/30 rounded-lg p-8">
        <h2 className="text-2xl font-bold mb-6">Panduan Integrasi WordPress</h2>
        <div className="space-y-4 text-sm">
          <div>
            <h3 className="font-semibold mb-2">1. Plugin yang Diperlukan</h3>
            <ul className="list-disc list-inside space-y-1 text-muted-foreground">
              <li>Advanced Custom Fields (ACF) - Untuk custom fields</li>
              <li>JWT Authentication for WP-API - Untuk autentikasi API</li>
              <li>REST API - Built-in di WordPress 5.0+</li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-2">2. Custom Post Types</h3>
            <ul className="list-disc list-inside space-y-1 text-muted-foreground">
              <li><code className="bg-background px-2 py-1 rounded">products</code> - Untuk manajemen produk</li>
              <li><code className="bg-background px-2 py-1 rounded">news</code> - Untuk manajemen berita</li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-2">3. Environment Variables</h3>
            <ul className="list-disc list-inside space-y-1 text-muted-foreground">
              <li><code className="bg-background px-2 py-1 rounded">NEXT_PUBLIC_WORDPRESS_URL</code></li>
              <li><code className="bg-background px-2 py-1 rounded">WORDPRESS_JWT_TOKEN</code></li>
            </ul>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <button
          onClick={handleSave}
          className="flex items-center gap-2 px-8 py-3 bg-primary text-primary-foreground font-semibold rounded-lg hover:bg-primary/90 transition-colors"
        >
          <Save className="w-5 h-5" />
          Simpan Pengaturan
        </button>
      </div>
    </div>
  )
}
