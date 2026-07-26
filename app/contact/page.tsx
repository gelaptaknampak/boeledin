import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import ContactHero from '@/components/contact/ContactHero'
import ContactForm from '@/components/contact/ContactForm'
import ContactMapWrapper from '@/components/contact/ContactMapWrapper'
import { MapPin, Phone, Mail, Clock } from 'lucide-react'

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
        <section className="py-12 md:py-20">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
              {/* Form Column */}
              <div>
                <ContactForm />
              </div>

              {/* Info Column */}
              <div className="flex flex-col gap-8">
                <div>
                  <h3 className="text-2xl font-bold mb-2">Informasi Kontak</h3>
                  <p className="text-muted-foreground mb-6">PT Future Boeled Indonesia</p>

                  {/* Contact Items */}
                  <div className="space-y-5">
                    {/* Address */}
                    <div className="flex gap-4">
                      <div className="flex-shrink-0 flex items-start justify-center w-10 h-10 rounded-lg border border-border bg-accent/5">
                        <MapPin className="w-5 h-5 text-primary mt-0.5" />
                      </div>
                      <div>
                        <h4 className="font-semibold mb-1">Alamat Kantor</h4>
                        <p className="text-sm text-muted-foreground">Jl. Sudirman No. 123, Jakarta Selatan 12190, Indonesia</p>
                      </div>
                    </div>

                    {/* Phone */}
                    <div className="flex gap-4">
                      <div className="flex-shrink-0 flex items-start justify-center w-10 h-10 rounded-lg border border-border bg-accent/5">
                        <Phone className="w-5 h-5 text-primary mt-0.5" />
                      </div>
                      <div>
                        <h4 className="font-semibold mb-1">Telepon</h4>
                        <p className="text-sm text-muted-foreground">+62 21 1234 5678<br/>+62 21 8765 4321</p>
                      </div>
                    </div>

                    {/* Email */}
                    <div className="flex gap-4">
                      <div className="flex-shrink-0 flex items-start justify-center w-10 h-10 rounded-lg border border-border bg-accent/5">
                        <Mail className="w-5 h-5 text-primary mt-0.5" />
                      </div>
                      <div>
                        <h4 className="font-semibold mb-1">Email</h4>
                        <p className="text-sm text-muted-foreground">info@boeled.co.id<br/>sales@boeled.co.id</p>
                      </div>
                    </div>

                    {/* Hours */}
                    <div className="flex gap-4">
                      <div className="flex-shrink-0 flex items-start justify-center w-10 h-10 rounded-lg border border-border bg-accent/5">
                        <Clock className="w-5 h-5 text-primary mt-0.5" />
                      </div>
                      <div>
                        <h4 className="font-semibold mb-1">Jam Operasional</h4>
                        <p className="text-sm text-muted-foreground">Senin – Jumat: 09.00 – 18.00<br/>Sabtu: 09.00 – 13.00</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Map */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">Lokasi Kami</h3>
                  <div className="w-full h-64 md:h-80 rounded-lg overflow-hidden border border-border">
                    <ContactMapWrapper />
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
