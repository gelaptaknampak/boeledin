"use client";

import { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface Props {
  images: string[];
  title: string;
  large?: boolean;
}

export default function ProductCarousel({
  images,
  title,
  large = false,
}: Props) {
  // Autoplay dicabut -- sekarang murni kontrol manual lewat arrow
  // / klik thumbnail, nggak ada plugin Autoplay lagi.
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
  });

  const [selectedIndex, setSelectedIndex] = useState(0);

  const hasMultiple = images.length > 1;

  /* =========================================================
     ARROW NAV
     =========================================================
     preventDefault + stopPropagation WAJIB di sini, karena di
     ProductsGrid carousel ini dibungkus <Link> ke halaman
     produk -- tanpa ini, klik arrow malah ikut navigasi.
  ========================================================= */

  const scrollPrev = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      emblaApi?.scrollPrev();
    },
    [emblaApi],
  );

  const scrollNext = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      emblaApi?.scrollNext();
    },
    [emblaApi],
  );

  const scrollTo = useCallback(
    (index: number) => (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      emblaApi?.scrollTo(index);
    },
    [emblaApi],
  );

  /* =========================================================
     TRACK SELECTED SLIDE (buat highlight thumbnail aktif)
  ========================================================= */

  const onSelect = useCallback(() => {
    if (!emblaApi) return;

    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;

    onSelect();

    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);

    return () => {
      emblaApi.off("select", onSelect);
      emblaApi.off("reInit", onSelect);
    };
  }, [emblaApi, onSelect]);

  return (
    <div>
      {/* =========================================
          MAIN VIEWPORT
      ========================================= */}

      <div
        ref={emblaRef}
        className={`group/carousel relative overflow-hidden rounded-xl ${
          large ? "aspect-square" : "h-72"
        }`}
      >
        <div className="flex h-full">
          {images.map((img, i) => (
            <div
              key={i}
              className="relative min-w-full h-full bg-white"
            >
              <Image
                fill
                src={img}
                alt={title}
                className={`
                  transition-all
                  ${
                    large
                      ? "object-contain p-2"
                      : "object-contain p-6"
                  }
                `}
              />
            </div>
          ))}
        </div>

        {/* ARROWS */}
        {/*
          Mode large (detail produk): arrow selalu kelihatan.
          Mode grid (card kecil): arrow cuma muncul pas hover,
          biar nggak ramai kalau grid-nya banyak produk.
        */}

        {hasMultiple && (
          <>
            <button
              type="button"
              onClick={scrollPrev}
              aria-label="Previous image"
              className={`
                absolute left-2 top-1/2 z-10 -translate-y-1/2
                flex h-8 w-8 items-center justify-center
                rounded-full bg-white/90 text-gray-800 shadow-md
                transition-opacity hover:bg-white
                ${
                  large
                    ? "opacity-100"
                    : "opacity-0 group-hover/carousel:opacity-100"
                }
              `}
            >
              <ChevronLeft className="h-5 w-5" />
            </button>

            <button
              type="button"
              onClick={scrollNext}
              aria-label="Next image"
              className={`
                absolute right-2 top-1/2 z-10 -translate-y-1/2
                flex h-8 w-8 items-center justify-center
                rounded-full bg-white/90 text-gray-800 shadow-md
                transition-opacity hover:bg-white
                ${
                  large
                    ? "opacity-100"
                    : "opacity-0 group-hover/carousel:opacity-100"
                }
              `}
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </>
        )}
      </div>

      {/* =========================================
          THUMBNAIL STRIP -- CUMA MODE LARGE
      ========================================= */}

      {large && hasMultiple && (
        <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
          {images.map((img, i) => (
            <button
              key={i}
              type="button"
              onClick={scrollTo(i)}
              aria-label={`Go to image ${i + 1}`}
              className={`
                relative h-16 w-16 shrink-0 overflow-hidden
                rounded-lg border-2 bg-white transition-colors
                ${
                  selectedIndex === i
                    ? "border-primary"
                    : "border-border hover:border-primary/50"
                }
              `}
            >
              <Image
                fill
                src={img}
                alt={`${title} thumbnail ${i + 1}`}
                className="object-contain p-1"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}