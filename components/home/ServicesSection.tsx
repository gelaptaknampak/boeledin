'use client'

import { ArrowRight, Zap, Settings, Users, Lightbulb } from 'lucide-react'

export default function ServicesSection() {
  const services = [
    {
      num: '01',
      icon: Zap,
      title: 'Digital Signage & FIDS',
      desc: 'Perangkat layar bermitra dengan merek ternama seperti BOE untuk fasilitas publik, termasuk implementasi Flight Information Display System (FIDS) di bandara.',
    },
    {
      num: '02',
      icon: Settings,
      title: 'Integrasi IT & Software',
      desc: 'Menggabungkan perangkat keras layar dengan perangkat lunak pendukung agar informasi dapat disampaikan secara real-time dan efisien.',
    },
    {
      num: '03',
      icon: Users,
      title: 'Instalasi & Customization',
      desc: 'Tim ahli kami menangani pemasangan, kalibrasi, dan kustomisasi sesuai kebutuhan spesifik proyek Anda di lokasi manapun.',
    },
    {
      num: '04',
      icon: Lightbulb,
      title: 'Konsultasi Teknis',
      desc: 'Dapatkan rekomendasi solusi terbaik dari konsultan berpengalaman kami untuk proyek digital signage dan display Anda.',
    },
  ]

  return (
    <section className="py-16 md:py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <div className="inline-block mb-4 px-4 py-2 bg-accent rounded-full text-sm font-semibold text-primary">
            Fokus Layanan Utama
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Empat pilar solusi tampilan digital kami
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Dari bandara hingga command center, kami merancang sistem yang bekerja tanpa henti — 7 hari seminggu, 24 jam sehari.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {services.map((service) => {
            const Icon = service.icon
            return (
              <div
                key={service.num}
                className="group p-8 rounded-lg bg-card border border-border hover:border-primary transition-colors"
              >
                <div className="flex items-start gap-6 mb-4">
                  <div className="text-4xl font-bold text-muted-foreground group-hover:text-primary transition-colors">
                    {service.num}
                  </div>
                  <div className="p-3 rounded-lg bg-accent group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                    <Icon className="w-6 h-6" />
                  </div>
                </div>
                <h3 className="text-xl font-semibold mb-3 group-hover:text-primary transition-colors">
                  {service.title}
                </h3>
                <p className="text-muted-foreground mb-4 leading-relaxed">
                  {service.desc}
                </p>
                <div className="flex items-center gap-2 text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="text-sm font-semibold">Pelajari Lebih Lanjut</span>
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
