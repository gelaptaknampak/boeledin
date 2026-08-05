"use client";

import Link from "next/link";
import Image from "next/image";

type Props = {
  data: any;
};

export default function NewsSection({ data }: Props) {

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
    <section
      className="
        py-14
        sm:py-20
        md:py-28
      "
    >

      <div
        className="
          container
          mx-auto
          px-4
          sm:px-6
          lg:px-8
        "
      >


        {/* Section Header */}
        <div
          className="
            mb-10
            sm:mb-14
            md:mb-16
            max-w-3xl
          "
        >

          <div
            className="
              inline-flex
              mb-4
              px-3
              sm:px-4
              py-2
              bg-accent
              rounded-full
              text-xs
              sm:text-sm
              font-semibold
              text-primary
            "
          >
            {data?.news_eyebrow ?? ""}
          </div>


          <h2
            className="
              text-3xl
              sm:text-4xl
              lg:text-5xl
              font-bold
              leading-tight
            "
          >
            {data?.news_title ?? ""}
          </h2>


        </div>




        {/* News Grid */}
        <div
          className="
            grid
            grid-cols-1
            sm:grid-cols-2
            lg:grid-cols-3
            gap-5
            sm:gap-6
            lg:gap-8
          "
        >

          {news.map((article)=>(

            <Link
              key={article.id}
              href={article.href}
              className="
                group
                bg-background
                rounded-xl
                border
                border-border
                overflow-hidden
                flex
                flex-col
                transition-all
                duration-300
                hover:shadow-lg
                hover:border-primary/50
              "
            >


              {/* Thumbnail */}
              <div
                className="
                  relative
                  aspect-[16/10]
                  overflow-hidden
                "
              >

                <Image
                  src={article.image}
                  alt={article.title}
                  fill
                  className="
                    object-cover
                    transition-transform
                    duration-500
                    group-hover:scale-105
                  "
                  sizes="
                    (max-width:640px) 100vw,
                    (max-width:1024px) 50vw,
                    33vw
                  "
                />


                <div
                  className="
                    absolute
                    inset-0
                    bg-black/10
                    group-hover:bg-black/25
                    transition-colors
                  "
                />


              </div>




              {/* Content */}
              <div
                className="
                  p-4
                  sm:p-5
                  lg:p-6
                  flex
                  flex-col
                  flex-1
                "
              >


                {/* Category */}
                <div
                  className="
                    text-[11px]
                    sm:text-xs
                    font-semibold
                    text-primary
                    mb-2
                    uppercase
                    tracking-wider
                  "
                >
                  {article.category}
                </div>




                {/* Title */}
                <h3
                  className="
                    text-base
                    sm:text-lg
                    font-semibold
                    mb-3
                    leading-snug
                    line-clamp-2
                    group-hover:text-primary
                    transition-colors
                  "
                >
                  {article.title}
                </h3>




                {/* Read Time */}
                <div
                  className="
                    mt-auto
                    text-xs
                    text-muted-foreground
                  "
                >
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