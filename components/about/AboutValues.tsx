'use client'

import { Sparkles, Shield, Users } from 'lucide-react'

export default function AboutValues() {
  const values = [
    {
      title: 'Inovasi',
      desc: 'Terus mendorong batas untuk mengembangkan teknologi terobosan bagi klien kami.',
      icon: Sparkles,
    },
    {
      title: 'Kualitas',
      desc: 'Menghadirkan keunggulan pada setiap produk dan layanan yang kami sediakan.',
      icon: Shield,
    },
    {
      title: 'Kemitraan',
      desc: 'Membangun hubungan jangka panjang berdasarkan kepercayaan dan kesuksesan bersama.',
      icon: Users,
    },
  ]

  return (
    <section className="py-16 md:py-24 bg-accent/5">
      <div className="container mx-auto px-4">
        <div className="mb-16">
          <div className="inline-block mb-4 px-4 py-2 bg-accent rounded-full text-sm font-semibold text-primary">
            Nilai Inti
          </div>
          <h2 className="text-3xl md:text-4xl font-bold">
            Prinsip yang memandu setiap langkah kami
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {values.map((value, idx) => {
            const Icon = value.icon
            return (
              <div key={idx} className="bg-card border border-border rounded-lg p-8">
                <div className="w-12 h-12 bg-accent/10 border border-accent/20 rounded-lg flex items-center justify-center mb-6">
                  <Icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold mb-3">{value.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{value.desc}</p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
