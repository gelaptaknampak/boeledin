'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import toast from 'react-hot-toast'

export default function ContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const contactSchema = z.object({
    name: z.string().min(2, 'Nama lengkap harus diisi'),
    email: z.string().email('Email tidak valid'),
    phone: z.string().optional(),
    company: z.string().optional(),
    interest: z.string(),
    message: z.string().min(10, 'Pesan minimal 10 karakter'),
  })

  type ContactFormData = z.infer<typeof contactSchema>
  const { register, handleSubmit, reset, formState: { errors } } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  })

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true)
    try {
      // Simulasi pengiriman ke API
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      toast.success('Terima kasih! Pesan Anda telah kami terima.')
      reset()
    } catch (error) {
      toast.error('Gagal mengirim pesan. Silakan coba lagi.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="bg-card border border-border p-8 rounded-lg">
      <h3 className="text-2xl font-bold mb-8">Form Inquiry</h3>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Name & Company */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold mb-2">
                      Nama Lengkap <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="Nama Anda"
                      {...register('name')}
                      className="w-full px-4 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                    {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2">
                      Perusahaan / Instansi
                    </label>
                    <input
                      type="text"
                      placeholder="PT Contoh Indonesia"
                      {...register('company')}
                      className="w-full px-4 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                </div>

                {/* Email & Phone */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold mb-2">
                      Email <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      placeholder="anda@email.com"
                      {...register('email')}
                      className="w-full px-4 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                    {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2">
                      Nomor Telepon
                    </label>
                    <input
                      type="tel"
                      placeholder="+62 21 ..."
                      {...register('phone')}
                      className="w-full px-4 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                </div>

                {/* Interest */}
                <div>
                  <label className="block text-sm font-semibold mb-2">
                    Produk yang Diminati
                  </label>
                  <select
                    {...register('interest')}
                    defaultValue="digital-signage"
                    className="w-full px-4 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="digital-signage">Digital Signage</option>
                    <option value="ifp">Interactive Flat Panel</option>
                    <option value="led">LED Display</option>
                    <option value="command-center">Command Center / Smart Collaboration</option>
                    <option value="other">Lainnya</option>
                  </select>
                </div>

                {/* Message */}
                <div>
                  <label className="block text-sm font-semibold mb-2">
                    Pesan <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    placeholder="Ceritakan kebutuhan proyek Anda..."
                    rows={5}
                    {...register('message')}
                    className="w-full px-4 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                  />
                  {errors.message && <p className="text-red-500 text-sm mt-1">{errors.message.message}</p>}
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full px-6 py-3 bg-primary text-primary-foreground font-semibold rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {isSubmitting ? 'Mengirim...' : 'Kirim Pesan'}
                </button>
              </form>
            </div>
  )
}
