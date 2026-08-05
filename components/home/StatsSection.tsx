"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

type Props = {
  data: any;
};

export default function StatsSection({ data }: Props) {
  const [brandImages, setBrandImages] = useState<Record<string, string>>({});

  useEffect(() => {
    async function loadBrandImages() {
      const images: any = {};

      for (const brand of data?.index_brand_list ?? []) {
        if (!brand.logo) continue;

        try {
          const res = await fetch(`/api/wordpress/media/page/${brand.logo}`);

          const media = await res.json();

          if (media?.source_url) {
            images[brand.logo] = media.source_url;
          }
        } catch (err) {
          console.error(err);
        }
      }

      setBrandImages(images);
    }

    loadBrandImages();
  }, [data]);

  const stats = [
    {
      number: data?.stat_number_1,
      label: data?.label_1,
    },
    {
      number: data?.stat_number_2,
      label: data?.label_2,
    },
    {
      number: data?.stat_number_3,
      label: data?.label_3,
    },
    {
      number: data?.stat_number_4,
      label: data?.label_4,
    },
  ];

  // const partners = [
  //   "BOE Technology Group",
  //   "BOE MLED Technology",
  //   "Sultan Mahmud Badaruddin II Airport",
  //   "Enterprise & Government Partners",
  // ];

  return (
    <section className="py-20 md:py-28 bg-accent/5">
      <div className="container mx-auto px-4">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-primary mb-2">
                {stat.number ?? ""}
              </div>

              <div className="text-muted-foreground text-sm">
                {stat.label ?? ""}
              </div>
            </div>
          ))}
        </div>

        <div className="h-px bg-border my-12" />

        {/* Brand Support */}

        <div>
          <div
            className="
inline-block
mb-10
px-4
py-2
bg-accent
rounded-full
text-sm
font-semibold
text-primary
"
          >
            {data?.stat_support ?? "Didukung Oleh"}
          </div>

          <div
            className="
grid
grid-cols-1
sm:grid-cols-2
lg:grid-cols-4
gap-8
"
          >
            {(data?.index_brand_list ?? []).map((brand: any, index: number) => (
              <div
                key={index}
                className="
rounded-xl
border
border-border
bg-[#101f33]
p-8
text-center
transition
hover:border-primary
"
              >
                {/* Logo */}
                <div
                  className="
h-20
rounded-lg
bg-white
flex
items-center
justify-center
mb-8
overflow-hidden
"
                >
                  {brandImages[brand.logo] ? (
                    <Image
                      src={brandImages[brand.logo]}
                      alt={brand.name}
                      width={160}
                      height={80}
                      className="
object-contain
max-h-14
"
                    />
                  ) : (
                    <span className="text-xs text-gray-400">Logo</span>
                  )}
                </div>

                {/* line */}
                <div
                  className="
w-8
h-px
bg-primary/40
mx-auto
mb-5
"
                />

                <h3
                  className="
text-sm
font-semibold
text-blue-300
mb-3
"
                >
                  {brand.name}
                </h3>

                <p
                  className="
text-xs
leading-relaxed
text-blue-200/80
mb-5
"
                >
                  {brand.description}
                </p>

                {brand.link && (
                  <a
                    href={brand.link}
                    target="_blank"
                    className="
text-xs
tracking-wider
font-semibold
text-blue-400
hover:text-blue-300
"
                  >
                    KUNJUNGI WEBSITE ↗
                  </a>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
