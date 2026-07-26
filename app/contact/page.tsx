import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import ContactHero from '@/components/contact/ContactHero'
import ContactForm from '@/components/contact/ContactForm'
import ContactMapWrapper from '@/components/contact/ContactMapWrapper'

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
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16">
              {/* Form Column */}
              <div className="flex flex-col justify-start">
                <h2 className="text-3xl font-bold mb-8">Hubungi Kami</h2>
                <div className="w-full">
                  <ContactForm />
                </div>
              </div>

              {/* Map & Info Column */}
              <div className="flex flex-col gap-8">
                <div>
                  <h2 className="text-3xl font-bold mb-6">Lokasi Kami</h2>
                  <div className="w-full h-64 md:h-80 rounded-lg overflow-hidden border border-border">
                    <ContactMapWrapper />
                  </div>
                </div>

                {/* Contact Info */}
                <div className="space-y-6">
                  <div className="p-4 bg-card rounded-lg border border-border">
                    <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2">Alamat</p>
                    <p className="font-semibold text-base">Jl. Sudirman No. 123, Jakarta Selatan 12190, Indonesia</p>
                  </div>
                  <div className="p-4 bg-card rounded-lg border border-border">
                    <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2">Telepon</p>
                    <p className="font-semibold text-base">+62 21 1234 5678</p>
                  </div>
                  <div className="p-4 bg-card rounded-lg border border-border">
                    <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2">Email</p>
                    <p className="font-semibold text-base">info@boeled.co.id</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
