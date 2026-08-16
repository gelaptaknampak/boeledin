import { notFound } from "next/navigation";
import Image from "next/image";

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

  const lang = searchParams?.lang || "id";

  const post = await getPost(slug, lang);

  if (!post) {
    notFound();
  }

  const image =
    post._embedded?.["wp:featuredmedia"]?.[0]?.source_url ??
    "/placeholder-news.jpg";

  /**
   * =========================================================
   * PROCESS CONTENT
   * =========================================================
   */

  const content = renderYoutubeEmbeds(
    post.content.rendered,
  );

  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4 max-w-5xl">

        {/* Featured Image */}
        {/* 
        <div className="relative aspect-video rounded-xl overflow-hidden mb-10">
          <Image
            src={image}
            alt={post.title.rendered}
            fill
            className="object-cover"
          />
        </div>
        */}

        {/* Isi Artikel */}
        <article className="max-w-4xl mx-auto px-4 py-16">
          <div
            className="ck-content"
            dangerouslySetInnerHTML={{
              __html: content,
            }}
          />
        </article>

      </div>
    </section>
  );
}