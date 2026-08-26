import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

import NewsHero from "@/components/news/NewsHero";
import NewsGrid from "@/components/news/NewsGrid";
import ProductCTA from "@/components/productDetail/ProductCTA";

import { getPostById, type LangCode } from "@/lib/wordpress";

import { newsSectionConfig } from "@/components/admin/sections/sectionConfig";

export const metadata = {
  title: "News — PT Future Boeled Indonesia",
  description:
    "Articles and guides on LED displays, interactive flat panels, digital signage, and the latest display technology trends from PT Future Boeled Indonesia.",
};

export default async function NewsPage({
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

  const rawLang = Array.isArray(params.lang) ? params.lang[0] : params.lang;

  const lang: LangCode = rawLang === "en" ? "en" : "id";

  /*
  =========================
  NEWS HERO
  =========================
  */

  const heroConfig = newsSectionConfig.hero;

  const heroPostId = heroConfig.id[lang];

  if (!heroPostId) {
    throw new Error(`News Hero untuk bahasa ${lang} belum dikonfigurasi`);
  }

  const hero = await getPostById(heroPostId, lang);

  /*
  =========================
  RENDER
  =========================
  */

  return (
    <>
      <Navigation />

      <main>
        <NewsHero acf={hero?.acf ?? {}} />

        <NewsGrid />

        <ProductCTA />
      </main>

      <Footer lang={lang} />
    </>
  );
}
