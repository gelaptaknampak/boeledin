import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import ContactHero from "@/components/contact/ContactHero";
import ContactForm from "@/components/contact/ContactForm";
import ContactMapWrapper from "@/components/contact/ContactMapWrapper";
import { MapPin, Phone, Mail, Clock } from "lucide-react";

export const metadata = {
  title: "Hubungi Kami — BOELEDIN",
  description:
    "Hubungi PT Future Boeled Indonesia untuk konsultasi digital signage, interactive flat panel, dan LED display.",
};

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
                <div className="flex flex-col gap-8">
                  <div>
                    <h3 className="text-2xl font-bold mb-2">
                      Informasi Kontak
                    </h3>
                    <p className="text-muted-foreground mb-6">
                      PT Future Boeled Indonesia
                    </p>

                    {/* Contact Items */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      {/* Address */}
                      <div className="flex gap-4">
                        <div className="flex-shrink-0 flex items-start justify-center w-10 h-10 rounded-lg border border-border bg-accent/5">
                          <MapPin className="w-5 h-5 text-primary mt-2" />
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">
                            Rukan Exclusive, Jl. Bukit Golf Mediterania, Pantai
                            Indah Kapuk No.1A Blok G, RT.7/RW.2, Kamal Muara,
                            Penjaringan, Jakarta Utara, DKI Jakarta 14470
                          </p>
                        </div>
                      </div>

                      {/* Email */}
                      <div className="flex gap-4">
                        <div className="flex-shrink-0 flex items-start justify-center w-10 h-10 rounded-lg border border-border bg-accent/5">
                          <Mail className="w-5 h-5 text-primary mt-2" />
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">
                            info@boeled.co.id
                            <br />
                            sales@boeled.co.id
                          </p>
                        </div>
                      </div>

                      {/* Phone */}
                      <div className="flex gap-4">
                        <div className="flex-shrink-0 flex items-start justify-center w-10 h-10 rounded-lg border border-border bg-accent/5">
                          <Phone className="w-5 h-5 text-primary mt-2" />
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">
                            +62 813-1906-0606
                          </p>
                        </div>
                      </div>

                      {/* Hours */}
                      <div className="flex gap-4">
                        <div className="flex-shrink-0 flex items-start justify-center w-10 h-10 rounded-lg border border-border bg-accent/5">
                          <Clock className="w-5 h-5 text-primary mt-2" />
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">
                            Senin – Jumat: 09.00 – 18.00
                            <br />
                            Sabtu: 09.00 – 13.00
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Map */}
                <div>
                  <div className="w-full mt-5 h-64 md:h-80 rounded-lg overflow-hidden border border-border">
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
  );
}
