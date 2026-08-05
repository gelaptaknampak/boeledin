import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

import AboutHero from "@/components/about/AboutHero";
import AboutStory from "@/components/about/AboutStory";
import AboutStats from "@/components/about/AboutStats";
import AboutValues from "@/components/about/AboutValues";
import AboutJourney from "@/components/about/AboutJourney";
import AboutCTA from "@/components/about/AboutCTA";

import { getPostById } from "@/lib/wordpress";
import { aboutSectionConfig } from "@/components/admin/sections/sectionConfig";

export const metadata = {
  title: "Tentang Kami — BOELEDIN Indonesia",
  description:
    "PT Future Boeled Indonesia, bagian dari BOE Technology Group, menghadirkan solusi display digital terkemuka di Indonesia sejak 2014.",
};

export default async function AboutPage() {
  const [
    hero,
    story,
    stats,
    values,
    journey,
    cta,
  ] = await Promise.all([
    getPostById(aboutSectionConfig.hero.id),
    getPostById(aboutSectionConfig.story.id),
    getPostById(aboutSectionConfig.stats.id),
    getPostById(aboutSectionConfig.values.id),
    getPostById(aboutSectionConfig.journey.id),
    getPostById(aboutSectionConfig.cta.id),
  ]);

  return (
    <>
      <Navigation />

      <main>
        <AboutHero acf={hero?.acf ?? {}} />
        <AboutStory acf={story?.acf ?? {}} />
        <AboutStats acf={stats?.acf ?? {}} />
        <AboutValues acf={values?.acf ?? {}} />
        <AboutJourney acf={journey?.acf ?? {}} />
        <AboutCTA acf={cta?.acf ?? {}} />
      </main>

      <Footer />
    </>
  );
}