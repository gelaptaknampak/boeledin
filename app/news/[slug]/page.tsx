import { notFound } from "next/navigation";
import Image from "next/image";

interface Props {
  params: Promise<{
    slug: string;
  }>;
}

async function getPost(slug: string) {
  const res = await fetch(
    `https://wp.boeledin.com/wp-json/wp/v2/posts?slug=${slug}&_embed`,
    {
      cache: "no-store",
    },
  );

  if (!res.ok) return null;

  const data = await res.json();

  return data[0] ?? null;
}

export default async function NewsDetail({ params }: Props) {
  const { slug } = await params;

  const post = await getPost(slug);

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
        <article
          className="
            prose
            prose-lg
            dark:prose-invert
            max-w-none
            prose-img:rounded-xl
            prose-headings:text-foreground
            prose-p:text-muted-foreground
          "
          dangerouslySetInnerHTML={{
            __html: post.content.rendered,
          }}
        />
      </div>
    </section>
  );
}
