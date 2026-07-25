import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import AboutHero from '@/components/about/AboutHero'
import AboutStory from '@/components/about/AboutStory'
import AboutValues from '@/components/about/AboutValues'

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
        <AboutValues />
      </main>
      <Footer />
    </>
  )
}
