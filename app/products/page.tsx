import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

import ProductsHero from "@/components/products/ProductsHero";
import ProductsGrid from "@/components/products/ProductsGrid";

import { getPostById } from "@/lib/wordpress";
import { productsSectionConfig } from "@/components/admin/sections/sectionConfig";

export const metadata = {
  title: "Katalog Produk — BOELEDIN",
  description:
    "Jelajahi katalog produk BOELEDIN: BOE BTQ & BSL LED Series, BOELED SR & SA Digital Signage, dan FBI Interactive Flat Panel.",
};

export default async function ProductsPage() {
  const hero = await getPostById(productsSectionConfig.hero.id);

  return (
    <>
      <Navigation />

      <main>
        <ProductsHero acf={hero?.acf ?? {}} />

        <ProductsGrid />
      </main>

      <Footer />
    </>
  );
}
