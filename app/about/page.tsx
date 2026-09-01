import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

import AboutHero from "@/components/about/AboutHero";
import AboutStory from "@/components/about/AboutStory";
import AboutCoreServices from "@/components/about/AboutCoreServices";
import AboutStats from "@/components/about/AboutStats";
import AboutValues from "@/components/about/AboutValues";
import AboutIndustries from "@/components/about/AboutIndustries";
import AboutPortfolio from "@/components/about/AboutPortfolio";
import AboutJourney from "@/components/about/AboutJourney";
import AboutCTA from "@/components/about/AboutCTA";

import { getPostById } from "@/lib/wordpress";
import type { LangCode } from "@/lib/wordpress";

import { aboutSectionConfig } from "@/components/admin/sections/sectionConfig";


export const metadata = {
  title: "About Us — PT Future Boeled Indonesia",
  description:
    "PT Future Boeled Indonesia, part of the BOE Technology Group, has been providing leading digital display solutions in Indonesia since 2014.",
};


export default async function AboutPage({
  searchParams,
}: {
  searchParams: Promise<{
    lang?: string | string[];
  }>;
}) {

  const params = await searchParams;


  const rawLang = Array.isArray(params.lang)
    ? params.lang[0]
    : params.lang;


  const lang: LangCode =
    rawLang === "en" ? "en" : "id";


  const [
    hero,
    story,
    coreServices,
    stats,
    values,
    industries,
    portfolio,
    journey,
    cta,
  ] = await Promise.all([

    getPostById(
      aboutSectionConfig.hero.id[lang],
      lang
    ),

    getPostById(
      aboutSectionConfig.story.id[lang],
      lang
    ),

    getPostById(
      aboutSectionConfig.coreServices.id[lang],
      lang
    ),

    getPostById(
      aboutSectionConfig.stats.id[lang],
      lang
    ),

    getPostById(
      aboutSectionConfig.values.id[lang],
      lang
    ),

    getPostById(
      aboutSectionConfig.industriesWeServe.id[lang],
      lang
    ),

    getPostById(
      aboutSectionConfig.onePortfolio.id[lang],
      lang
    ),

    getPostById(
      aboutSectionConfig.journey.id[lang],
      lang
    ),

    getPostById(
      aboutSectionConfig.cta.id[lang],
      lang
    ),

  ]);


  return (
    <>
      <Navigation />

      <main>

        <AboutHero
          acf={hero?.acf ?? {}}
        />


        <AboutStory
          acf={story?.acf ?? {}}
        />


        <AboutCoreServices
          acf={coreServices?.acf ?? {}}
        />


        <AboutStats
          acf={stats?.acf ?? {}}
        />


        <AboutValues
          acf={values?.acf ?? {}}
        />


        <AboutIndustries
          acf={industries?.acf ?? {}}
        />


        <AboutPortfolio
          acf={portfolio?.acf ?? {}}
        />


        {/* <AboutJourney
          acf={journey?.acf ?? {}}
        /> */}


        <AboutCTA
          acf={cta?.acf ?? {}}
        />

      </main>


      <Footer
        lang={
          params.lang === "en"
            ? "en"
            : "id"
        }
      />
    </>
  );
}