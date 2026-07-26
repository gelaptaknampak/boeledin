'use client'

import { useTranslation } from '@/hooks/useTranslation'

export default function StatsSection() {
  const { t } = useTranslation()

  const stats = [
    { number: '10+', label: t('home.heroStat1l') },
    { number: '500+', label: 'Employees' },
    { number: '100+', label: t('home.heroStat2l') },
    { number: '10M+', label: 'Units Shipped' },
  ]

  const partners = [
    'BOE Technology Group',
    'BOE MLED Technology',
    'Sultan Mahmud Badaruddin II Airport',
    'Enterprise & Government Partners',
  ]

  return (
    <section className="py-16 md:py-24 bg-accent/5">
      <div className="container mx-auto px-4">
        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
          {stats.map((stat, idx) => (
            <div key={idx} className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-primary mb-2">{stat.number}</div>
              <div className="text-muted-foreground">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Divider */}
        <div className="h-px bg-border my-12" />

        {/* Partners */}
        <div>
          <div className="text-sm font-semibold text-primary mb-6">Supported By</div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {partners.map((partner, idx) => (
              <div
                key={idx}
                className="px-6 py-3 bg-background rounded-lg border border-border text-center text-sm font-medium text-muted-foreground hover:border-primary transition-colors"
              >
                {partner}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
