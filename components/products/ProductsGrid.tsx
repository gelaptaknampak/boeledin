'use client'

import { useState, useMemo } from 'react'
import { Search } from 'lucide-react'
import { useTranslation } from '@/hooks/useTranslation'

export default function ProductsGrid() {
  const { t } = useTranslation()
  const [brandFilter, setBrandFilter] = useState('all')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')

  const products = [
    {
      id: 1,
      name: 'Ultra-Slim 4K Commercial Display',
      model: 'FBI-43Q6',
      brand: 'fbi',
      category: 'signage',
      image: '/api/placeholder/300/200',
      specs: { size: '43"', resolution: '4K UHD', brightness: '700 / 1000 / 1500 nits', mount: 'Wall Mount' },
      description: 'Desain bezel empat sisi ultra-tipis 6.9mm dengan arsitektur OD12.',
    },
    {
      id: 2,
      name: 'Android SOC Digital Signage',
      model: 'SR Series (SRAA05)',
      brand: 'boeled',
      category: 'signage',
      image: '/api/placeholder/300/200',
      specs: { brightness: '700 nits', frame: 'Aluminum', os: 'Android 13', operation: '7×24' },
      description: 'Bezel super tipis, rangka aluminium ringan untuk operasi nonstop.',
    },
    {
      id: 3,
      name: 'Fine-Pitch LED Display',
      model: 'BTQ Series (P1.25)',
      brand: 'boe',
      category: 'led',
      image: '/api/placeholder/300/200',
      specs: { pitch: 'P1.25', brightness: '3000 nits', refreshRate: '3840Hz', technology: 'COB' },
      description: 'Fine-pitch LED display dengan teknologi COB untuk command centers.',
    },
    {
      id: 4,
      name: 'Interactive Touch Panel',
      model: 'FBI-65IFP',
      brand: 'fbi',
      category: 'ifp',
      image: '/api/placeholder/300/200',
      specs: { size: '65"', resolution: '4K', touchPoints: '40-point', features: 'Multi-touch' },
      description: 'Interactive flat panel dengan dukungan 40-point multi-touch untuk kolaborasi.',
    },
    {
      id: 5,
      name: 'High-Brightness Outdoor Display',
      model: 'BSL-A Series (P2.6)',
      brand: 'boe',
      category: 'led',
      image: '/api/placeholder/300/200',
      specs: { pitch: 'P2.6', brightness: '4000+ nits', weatherproof: 'IP65', temp: '-40°C to 60°C' },
      description: 'LED display dengan brightness tinggi untuk penggunaan outdoor dengan IP65 rating.',
    },
    {
      id: 6,
      name: 'Corporate Digital Signage',
      model: 'SA Series (SAAA03)',
      brand: 'boeled',
      category: 'signage',
      image: '/api/placeholder/300/200',
      specs: { brightness: '500 nits', resolution: '1080p/4K', bezel: '9mm', color: 'Ultra HD' },
      description: 'Solusi signage untuk corporate dan retail dengan kualitas display superior.',
    },
    {
      id: 7,
      name: 'Premium COB LED',
      model: 'BYH Pro (P0.9375)',
      brand: 'boe',
      category: 'led',
      image: '/api/placeholder/300/200',
      specs: { pitch: 'P0.9375', brightness: '2000+ nits', refreshRate: '7680Hz', tech: 'COB Pro' },
      description: 'Premium LED display dengan pixel pitch terkecil untuk detail maksimal.',
    },
    {
      id: 8,
      name: 'Meeting Room Display',
      model: 'FBI-55IFP-V2',
      brand: 'fbi',
      category: 'ifp',
      image: '/api/placeholder/300/200',
      specs: { size: '55"', resolution: '4K UHD', touchPoints: '20-point', ports: 'USB-C, HDMI x2' },
      description: 'Interactive panel kompak untuk ruang rapat dengan connectivity lengkap.',
    },
  ]

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const brandMatch = brandFilter === 'all' || product.brand === brandFilter
      const categoryMatch = categoryFilter === 'all' || product.category === categoryFilter
      const searchMatch =
        searchQuery === '' ||
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.model.toLowerCase().includes(searchQuery.toLowerCase())

      return brandMatch && categoryMatch && searchMatch
    })
  }, [brandFilter, categoryFilter, searchQuery])

  return (
    <section className="py-12 md:py-16 bg-background">
      <div className="container mx-auto px-4">
        {/* Main Layout: Sidebar + Content */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Filters */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6 bg-card p-6 rounded-lg border border-border">
              {/* Brand Filter */}
              <div>
                <label className="block text-sm font-semibold mb-4">{t('products.filterBrand')}</label>
                <div className="space-y-2 flex flex-col">
                  {[
                    { value: 'all', label: t('products.allBrands') },
                    { value: 'boe', label: 'BOE' },
                    { value: 'boeled', label: 'BOELED' },
                    { value: 'fbi', label: 'FBI' },
                  ].map((option) => (
                    <button
                      key={option.value}
                      onClick={() => setBrandFilter(option.value)}
                      className={`text-left px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        brandFilter === option.value
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-accent text-foreground hover:bg-accent/80'
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Divider */}
              <div className="h-px bg-border" />

              {/* Category Filter */}
              <div>
                <label className="block text-sm font-semibold mb-4">{t('products.filterCategory')}</label>
                <div className="space-y-2 flex flex-col">
                  {[
                    { value: 'all', label: t('products.allCategories') },
                    { value: 'signage', label: t('products.digitalSignage') },
                    { value: 'ifp', label: t('products.interactiveFlatPanel') },
                    { value: 'led', label: t('products.led') },
                  ].map((option) => (
                    <button
                      key={option.value}
                      onClick={() => setCategoryFilter(option.value)}
                      className={`text-left px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        categoryFilter === option.value
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-accent text-foreground hover:bg-accent/80'
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Divider */}
              <div className="h-px bg-border" />

              {/* Search */}
              <div>
                <label className="block text-sm font-semibold mb-3">{t('products.searchLabel')}</label>
                <div className="relative">
                  <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder={t('products.searchPlaceholder')}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 border border-border rounded-lg bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>

              {/* Reset Button */}
              <button
                onClick={() => {
                  setBrandFilter('all')
                  setCategoryFilter('all')
                  setSearchQuery('')
                }}
                className="w-full px-4 py-2 text-sm font-medium bg-accent text-foreground hover:bg-accent/80 rounded-lg transition-colors"
              >
                {t('products.resetFilter')}
              </button>
            </div>
          </div>

          {/* Content Area */}
          <div className="lg:col-span-3">
            {/* Results Count */}
            <div className="mb-6">
              <p className="text-sm text-muted-foreground">
                {t('products.showing')} <span className="font-semibold text-foreground">{filteredProducts.length}</span> {t('products.of')} <span className="font-semibold text-foreground">{products.length}</span> {t('products.products')}
              </p>
            </div>

            {/* Product Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {filteredProducts.map((product) => (
            <div key={product.id} className="group border border-border rounded-lg overflow-hidden hover:border-primary transition-colors bg-card">
              {/* Image */}
              <div className="relative bg-accent h-48 overflow-hidden">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-3 left-3 px-3 py-1 bg-black/50 text-white text-xs font-semibold rounded-full backdrop-blur-sm">
                  {product.brand.toUpperCase()} · {product.category === 'ifp' ? 'IFP' : product.category === 'led' ? 'LED' : 'Signage'}
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <span className="text-xs font-semibold text-primary mb-2 block">{product.model}</span>
                <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors">
                  {product.name}
                </h3>
                <p className="text-sm text-muted-foreground mb-4">{product.description}</p>

                {/* Specs */}
                <div className="mb-6 space-y-1">
                  {Object.entries(product.specs).map(([key, value]) => (
                    <div key={key} className="flex justify-between text-xs">
                      <span className="text-muted-foreground capitalize">{key}</span>
                      <span className="font-semibold">{value as string}</span>
                    </div>
                  ))}
                </div>

                {/* Action */}
                <button className="w-full px-4 py-2 border border-primary text-primary hover:bg-primary hover:text-primary-foreground font-semibold rounded-lg transition-colors">
                  Detail Produk
                </button>
              </div>
            </div>
          ))}
        </div>

            {filteredProducts.length === 0 && (
              <div className="text-center py-12 col-span-full">
                <p className="text-muted-foreground mb-4">{t('products.noResults')}</p>
                <button
                  onClick={() => {
                    setBrandFilter('all')
                    setCategoryFilter('all')
                    setSearchQuery('')
                  }}
                  className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                >
                  {t('products.resetFilter')}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
