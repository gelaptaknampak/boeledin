'use client'

import { useState } from 'react'
import { Search, X } from 'lucide-react'
import Link from 'next/link'

const products = [
  { id: 1, name: 'FBI-43Q6', type: 'Digital Signage', brand: 'FBI' },
  { id: 2, name: 'FBI-A5 Series', type: 'Interactive Flat Panel', brand: 'FBI' },
  { id: 3, name: 'BYH Pro Series', type: 'LED Display', brand: 'BOE' },
  { id: 4, name: 'FIDS System', type: 'Digital Signage', brand: 'FBI' },
]

export default function ProductSearch() {
  const [isOpen, setIsOpen] = useState(false)
  const [query, setQuery] = useState('')

  const results = query.trim()
    ? products.filter(p =>
        p.name.toLowerCase().includes(query.toLowerCase()) ||
        p.type.toLowerCase().includes(query.toLowerCase()) ||
        p.brand.toLowerCase().includes(query.toLowerCase())
      )
    : []

  const handleOpen = () => {
    setIsOpen(true)
  }

  const handleClose = () => {
    setIsOpen(false)
    setQuery('')
  }

  return (
    <>
      <button
        onClick={handleOpen}
        className="p-2 rounded-lg hover:bg-accent transition-colors"
        aria-label="Search products"
      >
        <Search className="w-5 h-5" />
      </button>

      {/* Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-40 bg-black/50 transition-opacity" onClick={handleClose} />
      )}

      {/* Search Panel */}
      {isOpen && (
        <div className="fixed top-0 left-0 right-0 z-50 pt-16">
          <div className="container mx-auto px-4 max-w-2xl">
            <div className="bg-background rounded-lg shadow-lg border border-border overflow-hidden">
              {/* Input */}
              <div className="flex items-center px-4 py-3 border-b border-border">
                <Search className="w-5 h-5 text-muted-foreground mr-3" />
                <input
                  type="text"
                  placeholder="Cari produk, jenis, atau merek..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  autoFocus
                  className="flex-1 bg-transparent outline-none text-foreground placeholder:text-muted-foreground"
                />
                <button
                  onClick={handleClose}
                  className="p-1 hover:bg-accent rounded transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Results */}
              {query.trim() && (
                <div className="max-h-96 overflow-y-auto">
                  {results.length > 0 ? (
                    <div className="py-2">
                      {results.map((product) => (
                        <Link
                          key={product.id}
                          href={`/products?search=${encodeURIComponent(product.name)}`}
                          onClick={handleClose}
                          className="flex flex-col px-4 py-3 hover:bg-accent transition-colors"
                        >
                          <div className="font-medium text-foreground">{product.name}</div>
                          <div className="text-sm text-muted-foreground">
                            {product.brand} · {product.type}
                          </div>
                        </Link>
                      ))}
                    </div>
                  ) : (
                    <div className="px-4 py-8 text-center text-muted-foreground">
                      Produk tidak ditemukan
                    </div>
                  )}
                </div>
              )}

              {/* Empty State */}
              {!query.trim() && (
                <div className="px-4 py-8 text-center text-muted-foreground text-sm">
                  Ketik untuk mencari produk berdasarkan nama, jenis, atau merek
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
