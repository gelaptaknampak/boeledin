import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import ContactHero from '@/components/contact/ContactHero'
import ContactForm from '@/components/contact/ContactForm'

export const metadata = {
  title: 'Hubungi Kami — BOELEDIN',
  description: 'Hubungi PT Future Boeled Indonesia untuk konsultasi digital signage, interactive flat panel, dan LED display.',
}

export default function ContactPage() {
  return (
    <>
      <Navigation />
      <main>
        <ContactHero />
        <ContactForm />
      </main>
      <Footer />
    </>
  )
}
