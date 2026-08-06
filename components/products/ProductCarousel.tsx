"use client";

import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import Image from "next/image";

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
  const [emblaRef] = useEmblaCarousel(
    {
      loop: true,
    },
    [
      Autoplay({
        delay: 2500,
        stopOnInteraction: false,
      }),
    ]
  );

  return (
    <div
      ref={emblaRef}
      className={`overflow-hidden rounded-xl ${
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
    </div>
  );
}