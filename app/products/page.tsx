import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

import ProductsHero from "@/components/products/ProductsHero";
import ProductsGrid from "@/components/products/ProductsGrid";

import {
  getPostById,
  type LangCode,
} from "@/lib/wordpress";

import { productsSectionConfig } from "@/components/admin/sections/sectionConfig";


export const metadata = {
  title: "Katalog Produk — BOELEDIN",
  description:
    "Jelajahi katalog produk BOELEDIN: BOE BTQ & BSL LED Series, BOELED SR & SA Digital Signage, dan FBI Interactive Flat Panel.",
};


export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{
    lang?: string | string[];
  }>;
}) {

  /*
  =========================
  LANGUAGE
  =========================
  */

  const params = await searchParams;

  const rawLang = Array.isArray(params.lang)
    ? params.lang[0]
    : params.lang;

  const lang: LangCode =
    rawLang === "en"
      ? "en"
      : "id";


  /*
  =========================
  PRODUCTS HERO
  =========================
  */

  const heroConfig =
    productsSectionConfig.hero;

  const heroPostId =
    heroConfig.id[lang];


  if (!heroPostId) {
    throw new Error(
      `Products Hero untuk bahasa ${lang} belum dikonfigurasi`
    );
  }


  const hero =
    await getPostById(
      heroPostId,
      lang
    );


  /*
  =========================
  RENDER
  =========================
  */

  return (
    <>
      <Navigation />

      <main>
        <ProductsHero
          acf={hero?.acf ?? {}}
        />

        <ProductsGrid />
      </main>

      <Footer lang={lang} />
    </>
  );
}