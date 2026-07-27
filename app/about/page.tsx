import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import AboutHero from '@/components/about/AboutHero'
import AboutStory from '@/components/about/AboutStory'
import AboutStats from '@/components/about/AboutStats'
import AboutValues from '@/components/about/AboutValues'
import AboutJourney from '@/components/about/AboutJourney'
import AboutCTA from '@/components/about/AboutCTA'

export const metadata = {
  title: 'Tentang Kami — BOELEDIN Indonesia',
  description: 'PT Future Boeled Indonesia, bagian dari BOE Technology Group, menghadirkan solusi display digital terkemuka di Indonesia sejak 2014.',
}

export default function AboutPage() {
  return (
    <>
      <Navigation />
      <main>
        <AboutHero />
        <AboutStory />
        <AboutStats />
        <AboutValues />
        <AboutJourney />
        <AboutCTA />
      </main>
      <Footer />
    </>
  )
}
