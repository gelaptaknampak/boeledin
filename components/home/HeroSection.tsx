'use client'

import Link from 'next/link'
import { useTranslation } from '@/hooks/useTranslation'

export default function HeroSection() {
  const { t } = useTranslation()

  return (
    <section className="hero-media relative w-full bg-black text-white overflow-hidden">
      {/* Background with overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-black/40 z-10" />
      
      <div className="absolute inset-0">
        <div className="w-full h-full bg-slate-900" style={{
          backgroundImage: 'linear-gradient(135deg, rgba(15,23,42,0.9) 0%, rgba(30,41,59,0.8) 50%, rgba(51,65,85,0.7) 100%)',
        }} />
      </div>

      {/* Content */}
      <div className="relative z-20 py-32 md:py-48">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl">
            <div className="mb-6 inline-block">
              <span className="text-sm font-semibold text-blue-300 bg-blue-950/50 px-4 py-2 rounded-full border border-blue-800/30">
                {t('home.heroEyebrow')}
              </span>
            </div>

            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight text-balance">
              {t('home.heroTitle')}
            </h1>

            <p className="text-lg md:text-xl text-gray-300 mb-8 leading-relaxed max-w-2xl text-balance">
              {t('home.heroDescription')}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mb-16">
              <Link
                href="/products"
                className="inline-flex px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors w-fit"
              >
                {t('home.heroCta')}
              </Link>
              <Link
                href="/contact"
                className="inline-flex px-8 py-4 border-2 border-gray-400/40 text-white hover:border-white hover:bg-white/10 font-semibold rounded-lg transition-colors w-fit"
              >
                {t('home.heroCtaSecondary')}
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-8 pt-8 border-t border-gray-600/30">
              <div>
                <div className="text-4xl font-bold text-blue-400">10+</div>
                <p className="text-gray-400 text-sm mt-2">Tahun Pengalaman</p>
              </div>
              <div>
                <div className="text-4xl font-bold text-blue-400">100+</div>
                <p className="text-gray-400 text-sm mt-2">Mitra & Klien</p>
              </div>
              <div>
                <div className="text-4xl font-bold text-blue-400">10M+</div>
                <p className="text-gray-400 text-sm mt-2">Unit Terkirim Global</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
