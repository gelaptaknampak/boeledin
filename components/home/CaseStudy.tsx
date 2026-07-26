'use client'

import Link from 'next/link'
import { useTranslation } from '@/hooks/useTranslation'

export default function CaseStudy() {
  const { t } = useTranslation()

  return (
    <section className="py-20 md:py-28">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 items-center">
          {/* Content */}
          <div>
            <div className="inline-block mb-4 px-4 py-2 bg-accent rounded-full text-sm font-semibold text-primary">
              Studi Kasus
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Flight Information Display System — Bandara SMB II</h2>
            <p className="text-muted-foreground text-lg mb-8">
              Salah satu implementasi kami yang menonjol adalah pemasangan Flight Information Display System (FIDS) di Bandara Internasional Sultan Mahmud Badaruddin II — sistem yang menyampaikan informasi penerbangan secara real-time, 24 jam nonstop, dengan standar keandalan bandara internasional.
            </p>
            <Link
              href="/contact"
              className="inline-flex px-6 py-3 border border-border rounded-lg hover:bg-accent transition-colors font-semibold text-sm"
            >
              Diskusikan Proyek Serupa
            </Link>
          </div>

          {/* Visual */}
          <div className="relative h-80 bg-gradient-to-br from-slate-900 to-slate-800 rounded-lg border border-border flex items-center justify-center overflow-hidden">
            <div className="absolute inset-0 opacity-20 bg-[linear-gradient(45deg,#1e293b_25%,transparent_25%,transparent_75%,#1e293b_75%,#1e293b),linear-gradient(45deg,#1e293b_25%,transparent_25%,transparent_75%,#1e293b_75%,#1e293b)] bg-[length:40px_40px]" />
            <div className="relative text-center">
              <div className="text-sm text-gray-400">Feature Media</div>
              <div className="text-6xl font-bold text-slate-700 mt-2">SR98</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
