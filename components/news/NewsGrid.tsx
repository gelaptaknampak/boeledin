"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Clock } from "lucide-react";

import { formatDate } from "@/lib/utils";
import { useTranslation } from "@/hooks/useTranslation";

const ITEMS_PER_PAGE = 6;

// Batas karakter (plain text, tanpa tag HTML) sebelum
// tulisan "Read more" / "Selengkapnya" dimunculkan.
// Disesuaikan kira-kira dengan kapasitas 3 baris di line-clamp-3.
const EXCERPT_CHAR_LIMIT = 150;

export default function NewsGrid() {
  const { language } = useTranslation();

  const [news, setNews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    fetchNews();
    setCurrentPage(1);
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

  /* =========================
     EXCERPT PLAIN TEXT
     (buat ngecek perlu "read more" atau enggak)
  ========================= */

  function getExcerptPlainText(html: string) {
    return String(html ?? "")
      .replace(/<[^>]*>/g, "")
      .replace(/&nbsp;/g, " ")
      .trim();
  }

  function isExcerptLong(post: any) {
    return getExcerptPlainText(post.excerpt).length > EXCERPT_CHAR_LIMIT;
  }

  /* =========================
     PAGINATION
  ========================= */

  const totalPages = Math.max(1, Math.ceil(news.length / ITEMS_PER_PAGE));

  const paginatedNews = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;

    return news.slice(start, start + ITEMS_PER_PAGE);
  }, [news, currentPage]);

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
          {paginatedNews.map((post) => (
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

                {/* =================================
                    EXCERPT (max 3 baris) + READ MORE
                ================================= */}

                <div className="mb-4 flex-grow">
                  <div
                    className="
text-sm
text-muted-foreground
line-clamp-3
"
                    dangerouslySetInnerHTML={{
                      __html: post.excerpt,
                    }}
                  />

                  {isExcerptLong(post) && (
                    <span
                      className="
mt-1
inline-block
text-sm
font-medium
text-primary
group-hover:underline
"
                    >
                      {language === "en" ? "Read more..." : "Selengkapnya..."}
                    </span>
                  )}
                </div>

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

        {/* =================================
            PAGINATION
        ================================= */}

        {news.length > 0 && totalPages > 1 && (
          <div className="mt-12 flex flex-wrap items-center justify-center gap-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="
rounded-lg
border
border-border
px-3
py-2
text-sm
font-medium
transition
hover:border-primary
disabled:cursor-not-allowed
disabled:opacity-40
"
            >
              {language === "en" ? "Prev" : "Sebelumnya"}
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map(
              (page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`
flex
h-10
w-10
items-center
justify-center
rounded-lg
border
text-sm
font-semibold
transition
${
  currentPage === page
    ? "border-primary bg-primary text-white"
    : "border-border hover:border-primary"
}
`}
                >
                  {page}
                </button>
              ),
            )}

            <button
              onClick={() =>
                setCurrentPage((p) => Math.min(totalPages, p + 1))
              }
              disabled={currentPage === totalPages}
              className="
rounded-lg
border
border-border
px-3
py-2
text-sm
font-medium
transition
hover:border-primary
disabled:cursor-not-allowed
disabled:opacity-40
"
            >
              {language === "en" ? "Next" : "Selanjutnya"}
            </button>
          </div>
        )}

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