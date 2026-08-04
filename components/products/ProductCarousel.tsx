"use client";

import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import Image from "next/image";

export default function ProductCarousel({
  images,
  title,
}: {
  images: string[];
  title: string;
}) {
  const [emblaRef] = useEmblaCarousel(
    {
      loop: true,
    },
    [
      Autoplay({
        delay: 2500,
        stopOnInteraction: false,
      }),
    ],
  );

  return (
    <div ref={emblaRef} className="overflow-hidden h-72">
      <div className="flex h-full">
        {images.map((img, i) => (
          <div key={i} className="relative h-full min-w-full bg-white">
            <Image fill src={img} alt={title} className="object-contain p-6" />
          </div>
        ))}
      </div>
    </div>
  );
}
