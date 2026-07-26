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
      description: 'Ultra-thin 6.9mm bezel, brightness up to 1500 nits, OD12 design without rear cover.',
      specs: [
        { label: 'Size', value: '43"' },
        { label: 'Resolution', value: '4K UHD' },
      ],
    },
    {
      id: 2,
      brand: 'FBI',
      model: 'FBI-A5',
      category: 'IFP',
      title: 'Interactive Flat Panel Collaboration',
      description: '4K UHD, Android 15, 40-point multi-touch, smart whiteboard, 48MP AI camera for modern meeting rooms.',
      specs: [
        { label: 'Size', value: '65"–110"' },
        { label: 'Touch', value: '40-Point' },
      ],
    },
    {
      id: 3,
      brand: 'BOE',
      model: 'BYH Pro',
      category: 'LED',
      title: 'Ultra Fine-Pitch COB LED',
      description: 'Pixel pitch up to 0.9375mm with COB technology, ideal for command centers and data visualization rooms.',
      specs: [
        { label: 'Pitch', value: 'P0.9375–P1.56' },
        { label: 'Brightness', value: 'Peak 1500 nits' },
      ],
    },
  ]

  return (
    <section className="py-16 md:py-24 bg-accent/5">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="max-w-2xl mx-auto text-center mb-16">
          <div className="text-sm font-semibold text-primary mb-3">{t('home.productsEyebrow')}</div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">{t('home.productsTitle')}</h2>
          <p className="text-muted-foreground text-lg">{t('home.productsSubtitle')}</p>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {products.map((product) => (
            <div key={product.id} className="bg-background rounded-xl border border-border overflow-hidden hover:shadow-lg transition-shadow">
              {/* Product Badge & Image */}
              <div className="relative h-48 bg-accent/10 flex items-center justify-center overflow-hidden">
                <div className="absolute top-4 right-4 bg-primary text-primary-foreground px-3 py-1 rounded-full text-xs font-semibold">
                  {product.brand} · {product.category}
                </div>
                <div className="text-center">
                  <div className="text-sm text-muted-foreground mb-2">Featured Product</div>
                  <div className="text-2xl font-bold text-primary">{product.model}</div>
                </div>
              </div>

              {/* Product Info */}
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2">{product.title}</h3>
                <p className="text-muted-foreground mb-4 text-sm">{product.description}</p>

                {/* Specs */}
                <div className="space-y-2 mb-6">
                  {product.specs.map((spec, idx) => (
                    <div key={idx} className="flex justify-between text-sm">
                      <span className="text-muted-foreground">{spec.label}</span>
                      <span className="font-semibold">{spec.value}</span>
                    </div>
                  ))}
                </div>

                {/* CTA */}
                <Link
                  href="/products"
                  className="block w-full py-2 px-4 text-center border border-border rounded-lg hover:bg-accent transition-colors text-sm font-medium"
                >
                  View Details
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
