'use client'

import Link from 'next/link'
import { formatDate } from '@/lib/utils'
import { Clock } from 'lucide-react'

export default function NewsGrid() {
  const news = [
    {
      id: 1,
      title: 'Apa Itu Digital Signage dan Mengapa Bisnis Anda Membutuhkannya',
      category: 'Digital Signage',
      excerpt: 'Kenali definisi, jenis, dan manfaat digital signage bagi bisnis ritel, perkantoran, dan fasilitas publik di Indonesia.',
      readTime: '6 min',
      date: new Date('2024-01-15'),
      slug: 'digital-signage-guide',
    },
    {
      id: 2,
      title: 'Interactive Flat Panel vs Proyektor: Mana yang Tepat untuk Ruang Rapat Modern',
      category: 'Interactive Flat Panel',
      excerpt: 'Perbandingan interactive flat panel dan proyektor dari sisi kualitas gambar, interaktivitas, biaya perawatan, dan pengalaman kolaborasi.',
      readTime: '7 min',
      date: new Date('2024-01-20'),
      slug: 'ifp-vs-projector',
    },
    {
      id: 3,
      title: 'Memahami Pixel Pitch pada LED Display: Panduan Memilih Jarak Piksel',
      category: 'LED Display',
      excerpt: 'Panduan lengkap memahami pixel pitch LED display dan cara menentukan jarak piksel yang tepat berdasarkan jarak pandang.',
      readTime: '7 min',
      date: new Date('2024-01-25'),
      slug: 'pixel-pitch-guide',
    },
    {
      id: 4,
      title: 'FIDS (Flight Information Display System): Standar Baru Informasi Bandara',
      category: 'Digital Signage',
      excerpt: 'Mengenal Flight Information Display System, komponen utamanya, dan bagaimana sistem ini mendukung operasional bandara 24 jam.',
      readTime: '6 min',
      date: new Date('2024-02-01'),
      slug: 'fids-airport-standard',
    },
    {
      id: 5,
      title: 'Teknologi COB vs SMD LED Display: Perbedaan dan Keunggulan Masing-Masing',
      category: 'LED Display',
      excerpt: 'Analisis mendalam tentang perbedaan teknologi COB dan SMD pada LED display, termasuk keunggulan, kelemahan, dan aplikasi ideal untuk masing-masing.',
      readTime: '8 min',
      date: new Date('2024-02-05'),
      slug: 'cob-vs-smd-led',
    },
    {
      id: 6,
      title: 'Tren 2024: Interactive Displays Mendominasi Ruang Kolaborasi Modern',
      category: 'Interactive Flat Panel',
      excerpt: 'Perkembangan terbaru dalam industri interactive displays dan bagaimana teknologi ini mengubah cara tim berkolaborasi di era digital.',
      readTime: '6 min',
      date: new Date('2024-02-10'),
      slug: 'interactive-displays-2024',
    },
  ]

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      'Digital Signage': 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200',
      'Interactive Flat Panel': 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-200',
      'LED Display': 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-200',
    }
    return colors[category] || 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-200'
  }

  return (
    <section className="py-12 md:py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {news.map((article) => (
            <Link
              key={article.id}
              href={`/news/${article.slug}`}
              className="group bg-card border border-border rounded-lg overflow-hidden hover:border-primary transition-all hover:shadow-lg hover:-translate-y-1"
            >
              {/* Placeholder Image */}
              <div className="relative bg-accent h-48 overflow-hidden flex items-center justify-center">
                <div className="text-4xl text-muted-foreground group-hover:scale-110 transition-transform duration-300">
                  📰
                </div>
              </div>

              {/* Content */}
              <div className="p-6 flex flex-col h-full">
                {/* Category */}
                <div className="mb-3">
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${getCategoryColor(article.category)}`}>
                    {article.category}
                  </span>
                </div>

                {/* Title */}
                <h3 className="text-lg font-semibold mb-3 line-clamp-2 group-hover:text-primary transition-colors">
                  {article.title}
                </h3>

                {/* Excerpt */}
                <p className="text-sm text-muted-foreground mb-4 line-clamp-2 flex-grow">
                  {article.excerpt}
                </p>

                {/* Meta */}
                <div className="flex items-center gap-2 text-xs text-muted-foreground pt-4 border-t border-border">
                  <Clock className="w-4 h-4" />
                  <span>{article.readTime} baca</span>
                  <span>•</span>
                  <span>{formatDate(article.date)}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
