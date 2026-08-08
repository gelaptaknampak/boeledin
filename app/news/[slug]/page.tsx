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

export default async function NewsDetail({ params, searchParams }: Props) {
  const { slug } = await params;
  const lang = searchParams?.lang || "id";

  const post = await getPost(slug, lang);

  if (!post) {
    notFound();
  }

  const image =
    post._embedded?.["wp:featuredmedia"]?.[0]?.source_url ??
    "/placeholder-news.jpg";

  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4 max-w-5xl">
        {/* Featured Image */}
        {/* <div className="relative aspect-video rounded-xl overflow-hidden mb-10">
          <Image
            src={image}
            alt={post.title.rendered}
            fill
            className="object-cover"
          />
        </div> */}

        {/* Isi Artikel */}
        <article className="max-w-4xl mx-auto px-4 py-16">
          <div
            className="ck-content"
            dangerouslySetInnerHTML={{
              __html: post.content.rendered,
            }}
          />
        </article>
      </div>
    </section>
  );
}
