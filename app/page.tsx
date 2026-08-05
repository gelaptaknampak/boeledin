import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

import HeroSection from "@/components/home/HeroSection";
import ServicesSection from "@/components/home/ServicesSection";
import ProductsShowcase from "@/components/home/ProductsShowcase";
import CaseStudy from "@/components/home/CaseStudy";
import StatsSection from "@/components/home/StatsSection";
import NewsSection from "@/components/home/NewsSection";
import CtaSection from "@/components/home/CtaSection";

import { getPostBySlug, getACFFields } from "@/lib/wordpress";

export const metadata = {
  title:
    "BOELEDIN Indonesia — Solusi LED Display, Digital Signage & Interactive Flat Panel",
  description:
    "PT Future Boeled Indonesia merancang dan mengintegrasikan LED display, digital signage, FIDS, dan interactive flat panel untuk bandara, korporasi, dan instansi publik di Indonesia.",
};

async function getHomeSection(slug: string) {
  const post = await getPostBySlug(slug);

  if (!post) return null;

  console.log("POST DATA:", post);

  return post.acf ?? null;
}

export default async function Home() {
  const [
    heroData,
    servicesData,
    productData,
    caseStudyData,
    statsData,
    newsData,
    ctaData,
  ] = await Promise.all([
    getHomeSection("home-hero"),
    getHomeSection("home-service"),
    getHomeSection("product-showcase"),
    getHomeSection("case-study"),
    getHomeSection("stats-section"),
    getHomeSection("news-section"),
    getHomeSection("cta-section"),
  ]);

  console.log("FULL SERVICES DATA:", servicesData);


  return (
    <>
      <Navigation />

      <main>
        <HeroSection
          data={{
            eyebrow: heroData?.hero_eyebrow,

            title: heroData?.hero_title,

            description: heroData?.hero_description,

            primaryButton: {
              text: heroData?.primary_button_text,

              url: heroData?.primary_button_link?.url ?? "#",
            },

            secondaryButton: {
              text: heroData?.secondary_button_text,

              url: heroData?.secondary_button_link?.url ?? "#",
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

        <ProductsShowcase
          data={{
            product_eyebrow: productData?.product_eyebrow,

            product_title: productData?.product_title,

            product_description: productData?.product_description,
          }}
        />

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
          }}
        />

        <NewsSection
          data={{
            news_eyebrow: newsData?.news_eyebrow,

            news_title: newsData?.news_title,
          }}
        />

        <CtaSection
          data={{
            cta_title: ctaData?.cta_title,
            cta_sub: ctaData?.cta_sub,

            cta_button_text: ctaData?.cta_button_text,

            cta_button_link: ctaData?.cta_button_link?.url ?? "#",
          }}
        />
      </main>

      <Footer />
    </>
  );
}
