"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

type Props = {
  acf: any;
};

export default function AboutHero({ acf = {} }: Props) {
  const [imageUrl, setImageUrl] = useState("");
  const [imageLoading, setImageLoading] = useState(false);

  useEffect(() => {
    async function loadImage() {
      if (!acf?.about_hero_image) return;

      setImageLoading(true);

      try {
        const res = await fetch(
          `/api/wordpress/media/page/${acf.about_hero_image}`,
        );

        const media = await res.json();

        if (media.success) {
          setImageUrl(media.source_url);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setImageLoading(false);
      }
    }

    loadImage();
  }, [acf?.about_hero_image]);

  const hasImageField = Boolean(acf?.about_hero_image);

  return (
    <section className="relative isolate overflow-hidden">
      {/* ============================================
          BACKGROUND
          ============================================
          Foto sekarang jadi background penuh section,
          bukan card terpisah di samping teks lagi.
      */}

      <div className="absolute inset-0">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={
              acf.about_hero_image_caption ||
              acf.about_hero_title ||
              "Hero background"
            }
            fill
            priority
            unoptimized
            className="object-cover"
          />
        ) : (
          <div className="h-full w-full bg-gradient-to-br from-accent/30 via-background to-background" />
        )}

        {/* Skeleton halus selagi gambar masih di-fetch */}
        {hasImageField && !imageUrl && imageLoading && (
          <div className="absolute inset-0 animate-pulse bg-accent/20" />
        )}

        {/* Gradient supaya teks di kiri tetap kontras di atas foto apapun */}
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-background/30" />

        {/* Vignette bawah biar transisi ke section berikutnya halus */}
        <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-background to-transparent sm:h-28" />
      </div>

      {/* ============================================
          CONTENT
      ============================================ */}

      <div className="container relative z-10 mx-auto flex min-h-[420px] items-center px-4 py-16 sm:min-h-[500px] sm:px-6 md:py-24 lg:min-h-[600px] lg:px-8 lg:py-32">
        <div className="max-w-2xl">
          {acf.about_hero_eyebrow && (
            <div className="mb-5 inline-flex rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5 text-xs font-semibold text-primary sm:px-5 sm:py-2 sm:text-sm">
              {acf.about_hero_eyebrow}
            </div>
          )}

          {acf.about_hero_title && (
            <h1 className="mb-5 text-3xl font-bold leading-tight text-foreground sm:mb-6 sm:text-5xl lg:text-6xl">
              {acf.about_hero_title}
            </h1>
          )}

          {acf.about_hero_description && (
            <p className="max-w-xl text-base leading-7 text-foreground/80 sm:leading-8 md:text-lg">
              {acf.about_hero_description}
            </p>
          )}
        </div>
      </div>

      {/* Caption foto, sekarang jadi tag kecil di pojok kanan bawah */}
      {acf.about_hero_image_caption && imageUrl && (
        <div className="absolute bottom-4 right-4 z-10 rounded-full border border-border/50 bg-background/60 px-3 py-1.5 text-[11px] font-medium uppercase tracking-wider text-foreground/70 backdrop-blur-sm sm:bottom-6 sm:right-6 sm:px-4 sm:py-2 sm:text-xs lg:right-8">
          {acf.about_hero_image_caption}
        </div>
      )}
    </section>
  );
}