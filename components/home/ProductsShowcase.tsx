'use client'

import Link from 'next/link'
import { useTranslation } from '@/hooks/useTranslation'

export default function ProductsShowcase() {
  const { t } = useTranslation()

  const products = [
    {
      id: 1,
      brand: 'FBI',
      model: 'FBI-43Q6',
      category: 'Signage',
      title: 'Ultra-Slim 4K Digital Signage',
      description: 'Bezel ultra-tipis 6.9mm, kecerahan hingga 1500 nits, desain OD12 tanpa penutup belakang.',
      specs: [
        { label: 'Ukuran', value: '43"' },
        { label: 'Resolusi', value: '4K UHD' },
      ],
    },
    {
      id: 2,
      brand: 'FBI',
      model: 'FBI-A5 Series',
      category: 'IFP',
      title: 'Interactive Flat Panel Collaboration',
      description: '4K UHD, Android 15, 40-point multi-touch, smart whiteboard, kamera AI 48MP untuk ruang rapat modern.',
      specs: [
        { label: 'Ukuran', value: '65"–110"' },
        { label: 'Touch', value: '40-Point' },
      ],
    },
    {
      id: 3,
      brand: 'BOE',
      model: 'BYH Pro Series',
      category: 'LED',
      title: 'Ultra Fine-Pitch COB LED',
      description: 'Pixel pitch hingga 0.9375mm dengan teknologi COB, ideal untuk command center dan ruang visualisasi data.',
      specs: [
        { label: 'Pitch', value: 'P0.9375–P1.56' },
        { label: 'Brightness', value: 'Peak 1500 nits' },
      ],
    },
  ]

  return (
    <section className="py-20 md:py-28 bg-accent/5">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="mb-16">
          <div className="inline-block mb-4 px-4 py-2 bg-accent rounded-full text-sm font-semibold text-primary">
            Katalog Unggulan
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Produk yang kami rekomendasikan
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl">
            Model paling banyak diminati dari lini Digital Signage, Interactive Flat Panel, dan LED Display kami — gambar diambil langsung dari spec sheet resmi produk.
          </p>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {products.map((product) => (
            <div key={product.id} className="bg-card rounded-lg border border-border overflow-hidden hover:border-primary transition-colors">
              {/* Product Visual */}
              <div className="relative h-56 bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center overflow-hidden">
                <span className="absolute top-4 left-4 bg-primary text-primary-foreground px-3 py-1 rounded-full text-xs font-semibold">
                  {product.brand} · {product.category}
                </span>
                <div className="text-center">
                  <div className="text-sm text-gray-400 mb-2">Product Image</div>
                </div>
              </div>

              {/* Product Body */}
              <div className="p-6">
                <span className="text-xs text-primary font-semibold uppercase tracking-wider">{product.model}</span>
                <h3 className="text-lg font-bold mt-2 mb-3">{product.title}</h3>
                <p className="text-muted-foreground text-sm mb-6">{product.description}</p>

                {/* Specs */}
                <ul className="space-y-2 mb-6 pb-6 border-b border-border">
                  {product.specs.map((spec, idx) => (
                    <li key={idx} className="flex justify-between text-sm">
                      <span className="text-muted-foreground">{spec.label}</span>
                      <span className="font-semibold">{spec.value}</span>
                    </li>
                  ))}
                </ul>

                {/* Product Actions */}
                <div className="flex gap-2">
                  <Link
                    href="/products"
                    className="flex-1 px-4 py-2 text-center border border-border rounded-lg hover:bg-accent transition-colors text-sm font-medium"
                  >
                    Lihat Detail
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
