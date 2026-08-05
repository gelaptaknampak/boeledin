"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

type Props = {
  acf: any;
};

export default function AboutHero({ acf }: Props) {
  const [imageUrl, setImageUrl] = useState("");

  useEffect(() => {
    async function loadImage() {
      if (!acf?.about_hero_image) return;

      try {
        const res = await fetch(
          `/api/wordpress/media/page/${acf.about_hero_image}`
        );

        const media = await res.json();

        if (media.success) {
          setImageUrl(media.source_url);
        }
      } catch (err) {
        console.error(err);
      }
    }

    loadImage();
  }, [acf?.about_hero_image]);

  return (
    <section className="bg-gradient-to-b from-accent/30 via-background to-background py-14 md:py-20 lg:py-28">
      <div className="container mx-auto px-4">
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
          {/* Content */}
          <div className="order-2 lg:order-1">
            <div className="mb-5 inline-flex rounded-full border border-primary/20 bg-primary/10 px-5 py-2 text-sm font-semibold text-primary">
              {acf.about_hero_eyebrow}
            </div>

            <h1 className="mb-6 max-w-2xl text-4xl font-bold leading-tight text-foreground sm:text-5xl lg:text-6xl">
              {acf.about_hero_title}
            </h1>

            <p className="max-w-xl text-base leading-8 text-foreground/80 md:text-lg">
              {acf.about_hero_description}
            </p>
          </div>

          {/* Image */}
          <div className="order-1 lg:order-2">
            <div className="relative h-[280px] overflow-hidden rounded-2xl border border-border bg-accent shadow-2xl sm:h-[360px] lg:h-[520px]">
              {imageUrl ? (
                <>
                  <Image
                    src={imageUrl}
                    alt={acf.about_hero_image_caption || acf.about_hero_title}
                    fill
                    className="object-cover transition-transform duration-500 hover:scale-105"
                    unoptimized
                  />

                  {acf.about_hero_image_caption && (
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-6">
                      <p className="text-center text-sm font-medium text-white md:text-base">
                        {acf.about_hero_image_caption}
                      </p>
                    </div>
                  )}
                </>
              ) : (
                <div className="flex h-full items-center justify-center bg-gradient-to-br from-blue-200 to-blue-100">
                  <span className="text-muted-foreground">
                    {acf.about_hero_image_caption || "No Image"}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}