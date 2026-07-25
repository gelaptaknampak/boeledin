'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import toast from 'react-hot-toast'
import { Phone, Mail, MapPin } from 'lucide-react'
import { useTranslation } from '@/hooks/useTranslation'

export default function ContactForm() {
  const { t } = useTranslation()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const contactSchema = z.object({
    name: z.string().min(2, t('contact.form.nameRequired')),
    email: z.string().email(t('contact.form.emailInvalid')),
    phone: z.string().optional(),
    company: z.string().optional(),
    interest: z.string(),
    message: z.string().min(10, t('contact.form.messageRequired')),
  })

  type ContactFormData = z.infer<typeof contactSchema>
  const { register, handleSubmit, reset, formState: { errors } } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  })

  const { register, handleSubmit, reset, formState: { errors } } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  })

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true)
    try {
      // Simulasi pengiriman ke API
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      toast.success(t('contact.form.success'))
      reset()
    } catch (error) {
      toast.error(t('contact.form.error'))
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section className="py-12 md:py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Form */}
          <div className="lg:col-span-2">
            <div className="bg-card border border-border p-8 rounded-lg">
              <h2 className="text-2xl font-bold mb-8">Form Inquiry</h2>
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
          </div>

          {/* Contact Info */}
          <div>
            <h2 className="text-2xl font-bold mb-8">Informasi Kontak</h2>
            <p className="font-semibold mb-8">PT Future Boeled Indonesia</p>

            <div className="space-y-8">
              {/* Address */}
              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="p-3 rounded-lg bg-accent">
                    <MapPin className="w-6 h-6 text-primary" />
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Alamat Kantor</h3>
                  <p className="text-sm text-muted-foreground">
                    Jl. Sudirman No. 123<br />
                    Jakarta Selatan 12190<br />
                    Indonesia
                  </p>
                </div>
              </div>

              {/* Phone */}
              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="p-3 rounded-lg bg-accent">
                    <Phone className="w-6 h-6 text-primary" />
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Telepon</h3>
                  <p className="text-sm text-muted-foreground">
                    <a href="tel:+622112345678" className="hover:text-primary transition-colors">
                      +62 21 1234 5678
                    </a>
                    <br />
                    <a href="tel:+622187654321" className="hover:text-primary transition-colors">
                      +62 21 8765 4321
                    </a>
                  </p>
                </div>
              </div>

              {/* Email */}
              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="p-3 rounded-lg bg-accent">
                    <Mail className="w-6 h-6 text-primary" />
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Email</h3>
                  <p className="text-sm text-muted-foreground">
                    <a href="mailto:info@boeledin.com" className="hover:text-primary transition-colors">
                      info@boeledin.com
                    </a>
                    <br />
                    <a href="mailto:sales@boeledin.com" className="hover:text-primary transition-colors">
                      sales@boeledin.com
                    </a>
                  </p>
                </div>
              </div>
            </div>

            {/* Operating Hours */}
            <div className="mt-8 p-6 bg-card border border-border rounded-lg">
              <h3 className="font-semibold mb-3">Jam Operasional</h3>
              <div className="space-y-2 text-sm text-muted-foreground">
                <p>Senin - Jumat: 08:00 - 17:00 WIB</p>
                <p>Sabtu: 09:00 - 13:00 WIB</p>
                <p>Minggu & Hari Libur: Tutup</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
