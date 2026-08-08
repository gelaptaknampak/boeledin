import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

import NewsHero from "@/components/news/NewsHero";
import NewsGrid from "@/components/news/NewsGrid";

import { getPostById } from "@/lib/wordpress";
import { newsSectionConfig } from "@/components/admin/sections/sectionConfig";

export const metadata = {
  title: "Berita & Wawasan — BOELEDIN",
  description:
    "Artikel dan panduan seputar LED display, interactive flat panel, digital signage, dan tren teknologi tampilan terbaru dari BOELEDIN Indonesia.",
};

export default async function NewsPage() {
  const hero = await getPostById(newsSectionConfig.hero.id);

  return (
    <>
      <Navigation />

      <main>
        <NewsHero acf={hero?.acf ?? {}} />

        <NewsGrid />
      </main>

      <Footer />
    </>
  );
}
