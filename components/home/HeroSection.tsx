'use client'

import Link from 'next/link'
import { useTranslation } from '@/hooks/useTranslation'

export default function HeroSection() {
  const { t } = useTranslation()

  return (
    <section className="relative min-h-screen flex items-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white overflow-hidden">
      {/* Background Image Overlay */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImEiIHBhdHRlcm5Vbml0cz0idXNlclNwYWNlT25Vc2UiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIgZmlsbD0id2hpdGUiIG9wYWNpdHk9IjAuMiIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNhKSIvPjwvc3ZnPg==')] opacity-40" />
      </div>

      {/* Content */}
      <div className="relative container mx-auto px-4 py-20">
        <div className="max-w-3xl mx-auto text-center">
          <div className="mb-6 inline-block">
            <span className="text-sm font-semibold text-blue-300 bg-blue-950 px-4 py-2 rounded-full">
              {t('home.heroEyebrow')}
            </span>
          </div>

          <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight text-balance">
            {t('home.heroTitle')}
          </h1>

          <p className="text-xl md:text-2xl text-gray-300 mb-8 leading-relaxed max-w-2xl mx-auto text-balance">
            {t('home.heroDescription')}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link
              href="/products"
              className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
            >
              {t('home.heroCta')}
            </Link>
            <Link
              href="/contact"
              className="px-8 py-4 border-2 border-blue-400 text-blue-400 hover:bg-blue-400 hover:text-slate-900 font-semibold rounded-lg transition-colors"
            >
              {t('home.heroCtaSecondary')}
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 md:gap-8 max-w-lg mx-auto">
            <div>
              <div className="text-3xl md:text-4xl font-bold text-blue-400">{t('home.heroStat1n')}</div>
              <p className="text-gray-300 text-sm md:text-base">{t('home.heroStat1l')}</p>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold text-blue-400">{t('home.heroStat2n')}</div>
              <p className="text-gray-300 text-sm md:text-base">{t('home.heroStat2l')}</p>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold text-blue-400">{t('home.heroStat3n')}</div>
              <p className="text-gray-300 text-sm md:text-base">{t('home.heroStat3l')}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-gray-400">
        <svg className="w-6 h-6 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </div>
    </section>
  )
}
