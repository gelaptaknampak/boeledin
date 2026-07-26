'use client'

import { ArrowRight, Zap, Settings, Grid3x3, Lightbulb } from 'lucide-react'
import { useTranslation } from '@/hooks/useTranslation'

export default function ServicesSection() {
  const { t } = useTranslation()

  const services = [
    {
      num: '01',
      icon: Zap,
      title: t('home.serviceSignage'),
      desc: t('home.serviceSignageDesc'),
    },
    {
      num: '02',
      icon: Settings,
      title: t('home.serviceIT'),
      desc: t('home.serviceITDesc'),
    },
    {
      num: '03',
      icon: Grid3x3,
      title: t('home.serviceCommand'),
      desc: t('home.serviceCommandDesc'),
    },
    {
      num: '04',
      icon: Lightbulb,
      title: t('home.serviceImmersive'),
      desc: t('home.serviceImmersiveDesc'),
    },
  ]

  return (
    <section className="py-16 md:py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <div className="inline-block mb-4 px-4 py-2 bg-accent rounded-full text-sm font-semibold text-primary">
            {t('home.servicesEyebrow')}
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            {t('home.servicesTitle')}
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            {t('home.servicesSubtitle')}
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
