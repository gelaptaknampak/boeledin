'use client'

import { signIn } from 'next-auth/react'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import Link from 'next/link'
import { Lock, Mail } from 'lucide-react'

export default function AdminLoginPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({ username: '', password: '' })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const result = await signIn('credentials', {
        username: formData.username,
        password: formData.password,
        redirect: false,
      })

      if (result?.error) {
        toast.error('Username atau password salah')
      } else if (result?.ok) {
        toast.success('Login berhasil!')
        router.push('/admin/dashboard')
      }
    } catch (error) {
      toast.error('Terjadi kesalahan saat login')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 px-4">
      <div className="w-full max-w-md bg-card border border-border rounded-lg p-8 shadow-lg">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-primary mb-2">BOELEDIN</h1>
          <p className="text-muted-foreground">Admin Dashboard Login</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Username */}
          <div>
            <label className="block text-sm font-semibold mb-2">
              <div className="flex items-center gap-2 mb-2">
                <Mail className="w-4 h-4" />
                Username
              </div>
            </label>
            <input
              type="text"
              placeholder="Username atau Email"
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              className="w-full px-4 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
              disabled={isLoading}
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-semibold mb-2">
              <div className="flex items-center gap-2 mb-2">
                <Lock className="w-4 h-4" />
                Password
              </div>
            </label>
            <input
              type="password"
              placeholder="Masukkan password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="w-full px-4 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
              disabled={isLoading}
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full px-6 py-2 bg-primary text-primary-foreground font-semibold rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        {/* Info */}
        <div className="mt-8 p-4 bg-accent rounded-lg border border-border">
          <p className="text-sm text-muted-foreground">
            <strong>Demo Account:</strong>
            <br />
            Username: admin
            <br />
            Password: password
          </p>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center">
          <Link href="/" className="text-sm text-primary hover:underline">
            Kembali ke Website
          </Link>
        </div>
      </div>
    </div>
  )
}
