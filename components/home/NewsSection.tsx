"use client";

import Link from "next/link";
import { useTranslation } from "@/hooks/useTranslation";
import Image from "next/image";

export default function NewsSection() {
  const { t } = useTranslation();

  const news = [
    {
      id: 1,
      category: "Digital Signage",
      title: "...",
      readTime: "6 min baca",
      href: "/news",
      image: "news-digital_signage.jpg",
    },
    {
      id: 2,
      category: "LED Display",
      title: "...",
      readTime: "7 min baca",
      href: "/news",
      image: "news-COB_LED.webp",
    },
    {
      id: 3,
      category: "Tren Teknologi",
      title: "...",
      readTime: "5 min baca",
      href: "/news",
      image: "news-tren.jpg",
    },
  ];

  return (
    <section className="py-20 md:py-28">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="mb-16">
          <div className="inline-block mb-4 px-4 py-2 bg-accent rounded-full text-sm font-semibold text-primary">
            Wawasan & Berita
          </div>
          <h2 className="text-4xl md:text-5xl font-bold">
            Terbaru dari BOELEDIN
          </h2>
        </div>

        {/* News Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {news.map((article) => (
            <Link
              key={article.id}
              href={article.href}
              className="group bg-background rounded-xl border border-border overflow-hidden hover:shadow-lg transition-all"
            >
              {/* Thumbnail */}
              <div className="relative h-48 overflow-hidden">
                <Image
                  src={article.image}
                  alt={article.title}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                  sizes="(max-width:768px) 100vw, (max-width:1200px) 50vw, 33vw"
                />

                <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors" />
              </div>

              {/* Content */}
              <div className="p-6">
                <div className="text-xs font-semibold text-primary mb-2">
                  {article.category}
                </div>
                <h3 className="text-lg font-semibold mb-3 group-hover:text-primary transition-colors line-clamp-2">
                  {article.title}
                </h3>
                <div className="text-xs text-muted-foreground">
                  {article.readTime}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
