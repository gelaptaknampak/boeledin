import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import ProductsHero from '@/components/products/ProductsHero'
import ProductsGrid from '@/components/products/ProductsGrid'

export const metadata = {
  title: 'Katalog Produk — BOELEDIN',
  description: 'Jelajahi katalog produk BOELEDIN: BOE BTQ & BSL LED Series, BOELED SR & SA Digital Signage, dan FBI Interactive Flat Panel.',
}

export default function ProductsPage() {
  return (
    <>
      <Navigation />
      <main>
        <ProductsHero />
        <ProductsGrid />
      </main>
      <Footer />
    </>
  )
}
