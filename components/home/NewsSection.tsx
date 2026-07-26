'use client'

import Link from 'next/link'
import { useTranslation } from '@/hooks/useTranslation'

export default function NewsSection() {
  const { t } = useTranslation()

  const news = [
    {
      id: 1,
      category: 'Digital Signage',
      title: 'Apa Itu Digital Signage dan Mengapa Bisnis Anda Membutuhkannya',
      readTime: '6 min read',
      href: '/news',
    },
    {
      id: 2,
      category: 'LED Display',
      title: 'Memahami Pixel Pitch pada LED Display: Panduan Memilih Jarak Piksel',
      readTime: '7 min read',
      href: '/news',
    },
    {
      id: 3,
      category: 'Technology Trends',
      title: 'Tren Digital Signage 2026: AI, IoT, dan Konten Real-Time',
      readTime: '5 min read',
      href: '/news',
    },
  ]

  return (
    <section className="py-16 md:py-24">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="max-w-2xl mx-auto text-center mb-16">
          <div className="text-sm font-semibold text-primary mb-3">{t('home.newsEyebrow')}</div>
          <h2 className="text-3xl md:text-4xl font-bold">{t('home.newsTitle')}</h2>
        </div>

        {/* News Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {news.map((article) => (
            <Link
              key={article.id}
              href={article.href}
              className="group bg-background rounded-xl border border-border overflow-hidden hover:shadow-lg transition-all"
            >
              {/* Thumbnail */}
              <div className="h-40 bg-gradient-to-br from-accent/20 to-accent/5 flex items-center justify-center group-hover:from-accent/30 group-hover:to-accent/10 transition-colors">
                <div className="text-center">
                  <div className="text-4xl mb-2">📊</div>
                  <div className="text-xs text-muted-foreground">{article.category}</div>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <div className="text-xs font-semibold text-primary mb-2">{article.category}</div>
                <h3 className="text-lg font-semibold mb-3 group-hover:text-primary transition-colors line-clamp-2">
                  {article.title}
                </h3>
                <div className="text-xs text-muted-foreground">{article.readTime}</div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
