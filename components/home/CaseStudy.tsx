'use client'

import Link from 'next/link'
import { useTranslation } from '@/hooks/useTranslation'

export default function CaseStudy() {
  const { t } = useTranslation()

  return (
    <section className="py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div>
            <div className="text-sm font-semibold text-primary mb-3">{t('home.caseStudyEyebrow')}</div>
            <h2 className="text-3xl md:text-4xl font-bold mb-6">{t('home.caseStudyTitle')}</h2>
            <p className="text-muted-foreground text-lg mb-8">
              {t('home.caseStudyDesc')}
            </p>
            <Link
              href="/contact"
              className="inline-flex px-8 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-semibold"
            >
              Discuss Similar Project
            </Link>
          </div>

          {/* Visual */}
          <div className="relative h-80 bg-gradient-to-br from-accent/30 to-accent/10 rounded-xl border border-border flex items-center justify-center">
            <div className="text-center">
              <div className="text-6xl font-bold text-primary/20 mb-2">FIDS</div>
              <div className="text-muted-foreground">Large Format Display</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
