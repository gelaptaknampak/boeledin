import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import HeroSection from '@/components/home/HeroSection'
import SpecStrip from '@/components/home/SpecStrip'
import ServicesSection from '@/components/home/ServicesSection'
import CtaSection from '@/components/home/CtaSection'

export const metadata = {
  title: 'BOELEDIN Indonesia — Solusi LED Display & Digital Signage',
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
        <CtaSection />
      </main>
      <Footer />
    </>
  )
}
