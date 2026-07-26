import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import HeroSection from '@/components/home/HeroSection'
import SpecStrip from '@/components/home/SpecStrip'
import ServicesSection from '@/components/home/ServicesSection'
import ProductsShowcase from '@/components/home/ProductsShowcase'
import CaseStudy from '@/components/home/CaseStudy'
import StatsSection from '@/components/home/StatsSection'
import NewsSection from '@/components/home/NewsSection'
import CtaSection from '@/components/home/CtaSection'

export const metadata = {
  title: 'BOELEDIN Indonesia — Solusi LED Display, Digital Signage & Interactive Flat Panel',
  description: 'PT Future Boeled Indonesia merancang dan mengintegrasikan LED display, digital signage, FIDS, dan interactive flat panel untuk bandara, korporasi, dan instansi publik di Indonesia.',
}

export default function Home() {
  return (
    <>
      <Navigation />
      <main>
        <HeroSection />
        <SpecStrip />
        <ServicesSection />
        <ProductsShowcase />
        <CaseStudy />
        <StatsSection />
        <NewsSection />
        <CtaSection />
      </main>
      <Footer />
    </>
  )
}
