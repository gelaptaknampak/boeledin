import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

import HeroSection from "@/components/home/HeroSection";
import ServicesSection from "@/components/home/ServicesSection";
import ProductsShowcase from "@/components/home/ProductsShowcase";
import CaseStudy from "@/components/home/CaseStudy";
import StatsSection from "@/components/home/StatsSection";
import NewsSection from "@/components/home/NewsSection";
import CtaSection from "@/components/home/CtaSection";

import {
  getPostBySlug,
  getACFFields,
} from "@/lib/wordpress";

export const metadata = {
  title:
    "BOELEDIN Indonesia — Solusi LED Display, Digital Signage & Interactive Flat Panel",
  description:
    "PT Future Boeled Indonesia merancang dan mengintegrasikan LED display, digital signage, FIDS, dan interactive flat panel untuk bandara, korporasi, dan instansi publik di Indonesia.",
};

export default async function Home() {
  // Home Hero
  const heroPost = await getPostBySlug("home-hero");

  const heroData = heroPost
    ? await getACFFields("posts", heroPost.id)
    : null;

  // Home Services
  const servicesPost = await getPostBySlug("home-services");

  const servicesData = servicesPost
    ? await getACFFields("posts", servicesPost.id)
    : null;

  return (
    <>
      <Navigation />

      <main>
        <HeroSection data={heroData?.acf} />

        {/* <SpecStrip /> */}

        <ServicesSection data={servicesData?.acf} />

        <ProductsShowcase />

        <CaseStudy />

        <StatsSection />

        <NewsSection />

        <CtaSection />
      </main>

      <Footer />
    </>
  );
}