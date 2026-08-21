"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Clock } from "lucide-react";

import { formatDate } from "@/lib/utils";
import { useTranslation } from "@/hooks/useTranslation";

export default function NewsGrid() {
  const { language } = useTranslation();

  const [news, setNews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNews();
  }, [language]);

  async function fetchNews() {
    try {
      const res = await fetch(
        `https://wp.boeledin.com/wp-json/boeledin/v1/berita?lang=${language}`,
        {
          cache: "no-store",
        },
      );

      if (!res.ok) {
        throw new Error("Gagal mengambil berita");
      }

      const data = await res.json();

      console.log("NEWS:", data);

      setNews(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  function getCategory(post: any) {
    return post.acf?.category ?? "News";
  }

  function getImage(post: any) {
    return post.featured_media_url ?? "/placeholder-news.jpg";
  }

  function getReadingTime(html: string) {
    const text = html.replace(/<[^>]*>/g, "");

    const words = text.trim().split(/\s+/).length;

    return `${Math.max(1, Math.ceil(words / 200))} min`;
  }

  function getCategoryColor(category: string) {
    const colors: Record<string, string> = {
      "Digital Signage":
        "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200",

      "Interactive Flat Panel":
        "bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-200",

      "LED Display":
        "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-200",
    };

    return (
      colors[category] ??
      "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-200"
    );
  }

  if (loading) {
    return <div>Memuat berita...</div>;
  }

  return (
    <section className="py-20">
      <div className="container mx-auto px-6">
        <div
          className="
grid
md:grid-cols-2
lg:grid-cols-3
gap-8
"
        >
          {news.map((post) => (
            <Link
              key={post.id}
              href={`/news/${post.slug}?lang=${language}`}
              className="
group
bg-card
border
border-border
rounded-lg
overflow-hidden
hover:border-primary
transition-all
hover:shadow-lg
hover:-translate-y-1
"
            >
              <div
                className="
relative
aspect-[16/10]
overflow-hidden
"
              >
                <Image
                  src={getImage(post)}
                  alt={post.title}
                  fill
                  className="
object-cover
group-hover:scale-105
transition-transform
"
                />

                <div
                  className="
absolute
inset-0
bg-black/10
group-hover:bg-black/20
transition-colors
"
                />
              </div>

              <div
                className="
p-6
flex
flex-col
h-full
"
              >
                <div className="mb-3">
                  <span
                    className={`
inline-block
px-3
py-1
rounded-full
text-xs
font-semibold
${getCategoryColor(getCategory(post))}
`}
                  >
                    {getCategory(post)}
                  </span>
                </div>

                <h3
                  className="
text-lg
font-semibold
mb-3
line-clamp-2
group-hover:text-primary
transition-colors
"
                  dangerouslySetInnerHTML={{
                    __html: post.title,
                  }}
                />

                <div
                  className="
text-sm
text-muted-foreground
mb-4
line-clamp-3
flex-grow
"
                  dangerouslySetInnerHTML={{
                    __html: post.excerpt,
                  }}
                />

                <div
                  className="
flex
items-center
gap-2
text-xs
text-muted-foreground
pt-4
border-t
border-border
"
                >
                  <Clock className="w-4 h-4" />

                  <span>
                    {getReadingTime(post.content)}
                    baca
                  </span>

                  <span>•</span>

                  <span>{formatDate(new Date(post.modified))}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {news.length === 0 && (
          <div
            className="
text-center
py-20
text-muted-foreground
"
          >
            Belum ada berita.
          </div>
        )}
      </div>
    </section>
  );
}