"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Clock } from "lucide-react";
import { formatDate } from "@/lib/utils";

export default function NewsGrid() {
  const [news, setNews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNews();
  }, []);

  async function fetchNews() {
    try {
      const res = await fetch(
        "https://wp.boeledin.com/wp-json/wp/v2/berita?_embed&per_page=100",
        {
          cache: "no-store",
        },
      );

      if (!res.ok) throw new Error("Gagal mengambil berita");

      const data = await res.json();

      setNews(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  function getCategory(post: any) {
    return (
      post._embedded?.["wp:term"]
        ?.flat()
        ?.find((term: any) => term.taxonomy === "category")?.name ?? "News"
    );
  }

  function getImage(post: any) {
    return (
      post._embedded?.["wp:featuredmedia"]?.[0]?.source_url ??
      "/placeholder-news.jpg"
    );
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
      colors[category] ||
      "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-200"
    );
  }

  if (loading) {
    return <section className="py-20 text-center">Memuat berita...</section>;
  }

  return (
    <section className="py-12 md:py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {news.map((post) => (
            <Link
              key={post.id}
              href={`/news/${post.slug}`}
              className="group bg-card border border-border rounded-lg overflow-hidden hover:border-primary transition-all hover:shadow-lg hover:-translate-y-1"
            >
              {/* Image */}
              <div className="relative h-48 overflow-hidden">
                <Image
                  src={getImage(post)}
                  alt={post.title.rendered}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                  sizes="(max-width:768px) 100vw, (max-width:1200px) 50vw, 33vw"
                />

                <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors" />
              </div>

              {/* Content */}
              <div className="p-6 flex flex-col h-full">
                {/* Category */}
                <div className="mb-3">
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${getCategoryColor(
                      getCategory(post),
                    )}`}
                  >
                    {getCategory(post)}
                  </span>
                </div>

                {/* Title */}
                <h3
                  className="text-lg font-semibold mb-3 line-clamp-2 group-hover:text-primary transition-colors"
                  dangerouslySetInnerHTML={{
                    __html: post.title.rendered,
                  }}
                />

                {/* Excerpt */}
                <div
                  className="text-sm text-muted-foreground mb-4 line-clamp-3 flex-grow"
                  dangerouslySetInnerHTML={{
                    __html: post.excerpt.rendered,
                  }}
                />

                {/* Meta */}
                <div className="flex items-center gap-2 text-xs text-muted-foreground pt-4 border-t border-border">
                  <Clock className="w-4 h-4" />

                  <span>{getReadingTime(post.content.rendered)} baca</span>

                  <span>•</span>

                  <span>{formatDate(new Date(post.date))}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {news.length === 0 && !loading && (
          <div className="text-center py-20 text-muted-foreground">
            Belum ada berita.
          </div>
        )}
      </div>
    </section>
  );
}
