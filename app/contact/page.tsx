import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

import ContactHero from "@/components/contact/ContactHero";
import ContactForm from "@/components/contact/ContactForm";
import ContactInfo from "@/components/contact/ContactInfo";

import { getPostById } from "@/lib/wordpress";
import { contactSectionConfig } from "@/components/admin/sections/sectionConfig";

export const metadata = {
  title: "Hubungi Kami — BOELEDIN",
  description:
    "Hubungi PT Future Boeled Indonesia untuk konsultasi digital signage, interactive flat panel, dan LED display.",
};

export default async function ContactPage() {
  const [hero, form, info] = await Promise.all([
    getPostById(contactSectionConfig.hero.id),
    getPostById(contactSectionConfig.form.id),
    getPostById(contactSectionConfig.info.id),
  ]);

  return (
    <>
      <Navigation />

      <main>
        <ContactHero acf={hero?.acf ?? {}} />

        <section className="py-12 md:py-20">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-16">
              <ContactForm acf={form?.acf ?? {}} />

              <ContactInfo acf={info?.acf ?? {}} />
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}