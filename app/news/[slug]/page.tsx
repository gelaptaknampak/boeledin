import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft } from "lucide-react";
import ProductCTA from "@/components/productDetail/ProductCTA";

import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

import type { LangCode } from "@/lib/wordpress";

interface Props {
  params: Promise<{
    slug: string;
  }>;
  searchParams?: {
    lang?: string;
  };
}

async function getPost(slug: string, lang: string) {
  const res = await fetch(
    `https://wp.boeledin.com/wp-json/wp/v2/berita?slug=${slug}&_embed&lang=${lang}`,
    {
      cache: "no-store",
    },
  );

  if (!res.ok) return null;

  const data = await res.json();

  return data[0] ?? null;
}

/**
 * =========================================================
 * CONVERT YOUTUBE CKEDITOR EMBED
 * =========================================================
 */

function renderYoutubeEmbeds(html: string) {
  if (!html) return "";

  return html.replace(
    /<figure class="media">\s*<div data-oembed-url="([^"]+)">\s*<div><\/div>\s*<\/div>\s*<\/figure>/gi,
    (_, url) => {
      try {
        const parsedUrl = new URL(url);

        let videoId = "";

        // https://youtu.be/VIDEO_ID
        if (parsedUrl.hostname === "youtu.be") {
          videoId = parsedUrl.pathname.replace("/", "");
        }

        // https://www.youtube.com/watch?v=VIDEO_ID
        if (
          parsedUrl.hostname.includes("youtube.com") &&
          parsedUrl.searchParams.get("v")
        ) {
          videoId = parsedUrl.searchParams.get("v") ?? "";
        }

        // https://www.youtube.com/embed/VIDEO_ID
        if (
          parsedUrl.hostname.includes("youtube.com") &&
          parsedUrl.pathname.startsWith("/embed/")
        ) {
          videoId = parsedUrl.pathname.split("/embed/")[1];
        }

        if (!videoId) {
          return "";
        }

        return `
          <figure class="media youtube-embed">
            <div class="youtube-wrapper">
              <iframe
                src="https://www.youtube.com/embed/${videoId}"
                title="YouTube video"
                frameborder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowfullscreen
              ></iframe>
            </div>
          </figure>
        `;
      } catch (error) {
        console.error("INVALID YOUTUBE URL:", url);

        return "";
      }
    },
  );
}

export default async function NewsDetail({
  params,
  searchParams,
}: Props) {
  const { slug } = await params;

  const rawLang = searchParams?.lang;
  const lang: LangCode = rawLang === "en" ? "en" : "id";

  const post = await getPost(slug, lang);

  if (!post) {
    notFound();
  }

  const image =
    post._embedded?.["wp:featuredmedia"]?.[0]?.source_url ?? "";

  const publishedDate = post.date
    ? new Date(post.date).toLocaleDateString(
        lang === "en" ? "en-US" : "id-ID",
        {
          day: "numeric",
          month: "long",
          year: "numeric",
        },
      )
    : "";

  /**
   * =========================================================
   * PROCESS CONTENT
   * =========================================================
   */

  const content = renderYoutubeEmbeds(post.content.rendered);

  /**
   * =========================================================
   * STATIC UI TEXT
   * =========================================================
   *
   * Komponen ini Server Component (bukan client), jadi
   * teks di-localize manual pakai `lang`, bukan lewat
   * hook useTranslation.
   */

  // const uiText = {
  //   eyebrow: lang === "en" ? "News & Insights" : "Berita & Wawasan",
  //   back: lang === "en" ? "Back to News" : "Kembali ke Berita",
  // };

  return (
    <>
      <Navigation />

      {/* ============================================
          HERO
          ============================================
          Sama seperti AboutHero: featured image jadi
          background penuh, dengan gradient overlay biar
          judul tetap kebaca di atas foto apapun.
      */}

      <section className="relative isolate overflow-hidden">
        <div className="absolute inset-0">
          {image ? (
            <Image
              src={image}
              alt={post.title.rendered}
              fill
              priority
              unoptimized
              className="object-cover"
            />
          ) : (
            <div className="h-full w-full bg-gradient-to-br from-accent/30 via-background to-background" />
          )}

          {/* Gradient supaya teks di kiri tetap kontras */}
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-background/30" />

          {/* Vignette bawah biar transisi ke konten artikel halus */}
          <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-background to-transparent sm:h-28" />
        </div>

        <div className="container relative z-10 mx-auto flex min-h-[320px] items-center px-4 py-14 sm:min-h-[380px] sm:px-6 md:py-20 lg:min-h-[420px] lg:px-8">
          <div className="max-w-3xl">
            {/* <Link
              href={`/news?lang=${lang}`}
              className="mb-5 inline-flex items-center gap-2 text-sm font-medium text-foreground/70 transition-colors hover:text-primary"
            >
              <ArrowLeft className="h-4 w-4" />
              {uiText.back}
            </Link>

            <div className="mb-4 inline-flex rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5 text-xs font-semibold text-primary sm:px-5 sm:py-2 sm:text-sm">
              {uiText.eyebrow}
            </div> */}

            <h1
              className="text-2xl font-bold leading-tight text-foreground sm:text-3xl md:text-4xl lg:text-5xl"
              dangerouslySetInnerHTML={{ __html: post.title.rendered }}
            />

            {publishedDate && (
              <p className="mt-4 text-sm text-foreground/70 sm:text-base">
                {publishedDate}
              </p>
            )}
          </div>
        </div>
      </section>

      {/* ============================================
          ARTIKEL
          ============================================
          Nggak dibungkus card/border lagi — sebelumnya
          padding card bikin lebar konten (termasuk
          gambar-gambar di dalamnya) jadi lebih sempit
          dari yang seharusnya.
      ============================================ */}

      <section className="bg-background py-12 md:py-16">
        <div className="container mx-auto px-4">
          <article className="mx-auto max-w-4xl">
            <div
              className="ck-content"
              dangerouslySetInnerHTML={{
                __html: content,
              }}
            />
          </article>
        </div>
      </section>
      <div className="mx-auto px-4 py-16">
        <ProductCTA />
      </div>
      <Footer lang={lang} />
    </>
  );
}