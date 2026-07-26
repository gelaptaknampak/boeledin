'use client'

import Link from 'next/link'
import { useTranslation } from '@/hooks/useTranslation'

export default function CtaSection() {
  const { t } = useTranslation()

  return (
    <section className="py-20 md:py-28 bg-primary text-primary-foreground">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-8">
          <div className="flex-1">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              {t('home.ctaTitle')}
            </h2>
            <p className="text-lg opacity-95">
              {t('home.ctaSubtitle')}
            </p>
          </div>
          <Link
            href="/contact"
            className="inline-block px-8 py-4 bg-accent-2 text-primary font-semibold rounded-lg hover:bg-accent-2/90 transition-all whitespace-nowrap"
          >
            {t('home.ctaButton')}
          </Link>
        </div>
      </div>
    </section>
  )
}
