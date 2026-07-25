import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import NewsHero from '@/components/news/NewsHero'
import NewsGrid from '@/components/news/NewsGrid'

export const metadata = {
  title: 'Berita & Wawasan — BOELEDIN',
  description: 'Artikel dan panduan seputar LED display, interactive flat panel, digital signage, dan tren teknologi tampilan terbaru dari BOELEDIN Indonesia.',
}

export default function NewsPage() {
  return (
    <>
      <Navigation />
      <main>
        <NewsHero />
        <NewsGrid />
      </main>
      <Footer />
    </>
  )
}
