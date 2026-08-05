"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";

type Props = {
  data: any;
};

export default function CaseStudy({ data }: Props) {
  const [image, setImage] = useState("");

  useEffect(() => {
    async function loadImage() {
      if (!data?.casestudy_image) return;

      const res = await fetch(
        `/api/wordpress/media/page/${data.casestudy_image}`,
      );

      const result = await res.json();

      if (result?.source_url) {
        setImage(result.source_url);
      }
    }

    loadImage();
  }, [data]);

  return (
    <section className="py-20 md:py-28">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 items-center">
          {/* Content */}
          <div>
            <div className="inline-block mb-4 px-4 py-2 bg-accent rounded-full text-sm font-semibold text-primary">
              {data?.casestudy_eyebrow ?? ""}
            </div>

            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              {data?.casestudy_title ?? ""}
            </h2>

            <p className="text-muted-foreground text-lg mb-8">
              {data?.casestudy_description ?? ""}
            </p>
            <Link
              href={data?.casestudy_link?.url ?? "/contact"}
              className="inline-flex px-6 py-3 border border-border rounded-lg hover:bg-accent transition-colors font-semibold text-sm"
            >
              {data?.casestudy_button ?? "Diskusikan Proyek Serupa"}
            </Link>
          </div>

          {/* Visual */}
          <div className="relative h-80 rounded-lg border border-border overflow-hidden">
            {image ? (
              <Image
                src={image}
                alt={data?.casestudy_title ?? ""}
                fill
                className="object-cover"
              />
            ) : (
              <div className="flex h-full items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800">
                <div className="text-center">
                  <div className="text-sm text-gray-400">Feature Media</div>

                  <div className="text-6xl font-bold text-slate-700 mt-2">
                    SR98
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
