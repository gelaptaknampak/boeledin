import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import ContactHero from '@/components/contact/ContactHero'
import ContactForm from '@/components/contact/ContactForm'
import ContactMap from '@/components/contact/ContactMap'

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
        <div className="container mx-auto px-4 py-16 md:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <h2 className="text-2xl font-bold mb-4">Hubungi Kami</h2>
              <ContactForm />
            </div>
            <div>
              <h2 className="text-2xl font-bold mb-4">Lokasi Kami</h2>
              <ContactMap />
              <div className="mt-6 space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground">Alamat</p>
                  <p className="font-semibold">Jl. Sudirman No. 123, Jakarta Selatan 12190</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Telepon</p>
                  <p className="font-semibold">+62 21 1234 5678</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="font-semibold">info@boeled.co.id</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
