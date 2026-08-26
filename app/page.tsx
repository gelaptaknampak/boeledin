import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

import HeroSection from "@/components/home/HeroSection";
import ServicesSection from "@/components/home/ServicesSection";
import ProductsShowcase from "@/components/home/ProductsShowcase";
import CaseStudy from "@/components/home/CaseStudy";
import StatsSection from "@/components/home/StatsSection";
import NewsSection from "@/components/home/NewsSection";
import CtaSection from "@/components/home/CtaSection";

import { getPostById } from "@/lib/wordpress";
import { homeSectionConfig } from "@/components/admin/sections/sectionConfig";

import type { LangCode } from "@/lib/wordpress";

export const metadata = {
  title: "PT Future Boeled Indonesia | Display Technology Solutions",
  description:
    "PT Future Boeled Indonesia designs and integrates LED displays, digital signage, FIDS, and interactive flat panels for corporations and public institutions in Indonesia.",
};

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{
    lang?: string | string[];
  }>;
}) {
  // =========================================================
  // LANGUAGE
  // =========================================================

  const params = await searchParams;

  const rawLang = Array.isArray(params.lang) ? params.lang[0] : params.lang;

  const lang: LangCode = rawLang === "en" ? "en" : "id";

  console.log("================================");
  console.log("HOME LANGUAGE:", lang);
  console.log("================================");

  // =========================================================
  // ACF LINK HELPER
  // =========================================================

  const getAcfLinkUrl = (link: any): string => {
    if (!link) return "#";

    if (typeof link === "object") {
      return link.url ?? link.href ?? "#";
    }

    if (typeof link === "string") {
      const value = link.trim();

      const markdownMatch = value.match(/^\[.*?\]\((.*?)\)$/);

      if (markdownMatch?.[1]) {
        return markdownMatch[1];
      }

      return value;
    }

    return "#";
  };

  // =========================================================
  // GET SECTION ID
  // =========================================================

  const getSectionId = (section: any) => {
    if (typeof section.id === "object") {
      return section.id[lang];
    }

    return section.id;
  };

  const heroId = getSectionId(homeSectionConfig.hero);

  const servicesId = getSectionId(homeSectionConfig.services);

  const productId = getSectionId(homeSectionConfig.productShowcase);

  const caseStudyId = getSectionId(homeSectionConfig.caseStudy);

  const statsId = getSectionId(homeSectionConfig.statSection);

  const newsId = getSectionId(homeSectionConfig.news);

  const ctaId = getSectionId(homeSectionConfig.cta);

  console.log("HOME SECTION IDS:", {
    heroId,
    servicesId,
    productId,
    caseStudyId,
    statsId,
    newsId,
    ctaId,
  });

  // =========================================================
  // GET WORDPRESS POSTS
  // =========================================================

  const [
    heroPost,
    servicesPost,
    productPost,
    caseStudyPost,
    statsPost,
    newsPost,
    ctaPost,
  ] = await Promise.all([
    getPostById(heroId, lang),
    getPostById(servicesId, lang),
    getPostById(productId, lang),
    getPostById(caseStudyId, lang),
    getPostById(statsId, lang),
    getPostById(newsId, lang),
    getPostById(ctaId, lang),
  ]);

  // =========================================================
  // ACF DATA
  // =========================================================

  const heroData = heroPost?.acf ?? {};

  const servicesData = servicesPost?.acf ?? {};

  const productData = productPost?.acf ?? {};

  const caseStudyData = caseStudyPost?.acf ?? {};

  const statsData = statsPost?.acf ?? {};

  const newsData = newsPost?.acf ?? {};

  const ctaData = ctaPost?.acf ?? {};

  // =========================================================
  // PRODUCT IDS
  // =========================================================

  const selectedProductIds = Array.isArray(
    productData?.product_showcase_products,
  )
    ? productData.product_showcase_products
    : [];

  // =========================================================
  // NEWS ARTICLES
  // =========================================================

  const selectedNewsArticles =
    newsData?.news_articles ??
    newsData?.selected_articles ??
    newsData?.articles ??
    newsData?.selected_news ??
    newsData?.news_showcase_articles ??
    newsData?.news_showcase_news ??
    [];

  console.log("================================");
  console.log("📰 NEWS POST:", newsPost);
  console.log("📰 NEWS POST ID:", newsPost?.id);
  console.log("📰 NEWS POST ACF:", newsPost?.acf);
  console.log("📰 NEWS DATA:", newsData);
  console.log("📰 NEWS DATA KEYS:", Object.keys(newsData));
  console.log("📰 SELECTED NEWS ARTICLES:", selectedNewsArticles);
  console.log(
    "📰 SELECTED NEWS ARTICLES JSON:",
    JSON.stringify(selectedNewsArticles, null, 2),
  );
  console.log("================================");

  // =========================================================
  // RENDER
  // =========================================================

  return (
    <>
      <Navigation />

      <main>
        {/* =====================================================
            HERO
        ===================================================== */}

        <HeroSection
          data={{
            eyebrow: heroData?.hero_eyebrow,

            title: heroData?.hero_title,

            description: heroData?.hero_description,

            primaryButton: {
              text: heroData?.primary_button_text,

              url: getAcfLinkUrl(heroData?.primary_button_link),
            },

            secondaryButton: {
              text: heroData?.secondary_button_text,

              url: getAcfLinkUrl(heroData?.secondary_button_link),
            },

            stats: [
              {
                number: heroData?.stat_1,
                label: heroData?.label_1,
              },
              {
                number: heroData?.stat_2,
                label: heroData?.label_2,
              },
              {
                number: heroData?.stat_3,
                label: heroData?.label_3,
              },
            ],
          }}
        />

        {/* =====================================================
            SERVICES
        ===================================================== */}

        <ServicesSection
          data={{
            eyebrow: servicesData?.services_eyebrow,

            title: servicesData?.services_title,

            description: servicesData?.services_description,

            services: [
              {
                number: servicesData?.service_1_number,

                title: servicesData?.service_1_title,

                description: servicesData?.service_1_description,

                icon: servicesData?.service_1_icon,
              },
              {
                number: servicesData?.service_2_number,

                title: servicesData?.service_2_title,

                description: servicesData?.service_2_description,

                icon: servicesData?.service_2_icon,
              },
              {
                number: servicesData?.service_3_number,

                title: servicesData?.service_3_title,

                description: servicesData?.service_3_description,

                icon: servicesData?.service_3_icon,
              },
              {
                number: servicesData?.service_4_number,

                title: servicesData?.service_4_title,

                description: servicesData?.service_4_description,

                icon: servicesData?.service_4_icon,
              },
            ],
          }}
        />

        {/* =====================================================
            PRODUCTS
        ===================================================== */}

        <ProductsShowcase
          data={{
            product_eyebrow: productData?.product_eyebrow,

            product_title: productData?.product_title,

            product_description: productData?.product_description,

            products: selectedProductIds,
          }}
        />

        {/* =====================================================
            CASE STUDY
        ===================================================== */}

        <CaseStudy
          data={{
            casestudy_eyebrow: caseStudyData?.casestudy_eyebrow,

            casestudy_title: caseStudyData?.casestudy_title,

            casestudy_description: caseStudyData?.casestudy_description,

            casestudy_button: caseStudyData?.casestudy_button,

            casestudy_link: caseStudyData?.casestudy_link,

            casestudy_image: caseStudyData?.casestudy_image,
          }}
        />

        {/* =====================================================
            STATS
        ===================================================== */}

        <StatsSection
          data={{
            stat_number_1: statsData?.stat_number_1,

            label_1: statsData?.label_1,

            stat_number_2: statsData?.stat_number_2,

            label_2: statsData?.label_2,

            stat_number_3: statsData?.stat_number_3,

            label_3: statsData?.label_3,

            stat_number_4: statsData?.stat_number_4,

            label_4: statsData?.label_4,

            stat_support: statsData?.stat_support,

            index_brand_list: statsData?.index_brand_list ?? [],

            hide_and_show: statsData?.hide_and_show ?? false,
          }}
        />

        {/* =====================================================
            NEWS
        ===================================================== */}

        <NewsSection
          data={{
            news_eyebrow: newsData?.news_eyebrow,

            news_title: newsData?.news_title,

            news_description: newsData?.news_description,

            /*
             * ACF Relationship / Post Object
             * dari CMS
             */
            articles: selectedNewsArticles,
          }}
        />

        {/* =====================================================
            CTA
        ===================================================== */}

        <CtaSection
          data={{
            cta_title: ctaData?.cta_title,

            cta_sub: ctaData?.cta_sub,

            cta_button_text: ctaData?.cta_button_text,

            cta_button_link: getAcfLinkUrl(ctaData?.cta_button_link),
          }}
        />
      </main>

      <Footer lang={lang} />
    </>
  );
}
