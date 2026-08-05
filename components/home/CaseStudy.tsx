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

      try {
        const res = await fetch(
          `/api/wordpress/media/page/${data.casestudy_image}`,
        );

        const result = await res.json();

        if (result?.source_url) {
          setImage(result.source_url);
        }
      } catch (error) {
        console.error(error);
      }
    }

    loadImage();
  }, [data]);


  return (
    <section className="py-14 sm:py-20 md:py-28">

      <div
        className="
          container 
          mx-auto 
          px-4 
          sm:px-6 
          lg:px-8
        "
      >

        <div
          className="
            grid
            grid-cols-1
            lg:grid-cols-2
            gap-8
            sm:gap-10
            lg:gap-16
            items-center
          "
        >


          {/* Content */}
          <div
            className="
              order-1
              max-w-xl
            "
          >

            {/* Eyebrow */}
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
              {data?.casestudy_eyebrow ?? ""}
            </div>


            {/* Title */}
            <h2
              className="
                text-3xl
                sm:text-4xl
                lg:text-5xl
                font-bold
                leading-tight
                mb-4
                sm:mb-6
              "
            >
              {data?.casestudy_title ?? ""}
            </h2>


            {/* Description */}
            <p
              className="
                text-sm
                sm:text-base
                lg:text-lg
                text-muted-foreground
                leading-relaxed
                mb-6
                sm:mb-8
              "
            >
              {data?.casestudy_description ?? ""}
            </p>



            {/* Button */}
            <Link
              href={
                data?.casestudy_link?.url ??
                "/contact"
              }
              className="
                inline-flex
                items-center
                justify-center
                w-full
                sm:w-fit
                px-5
                sm:px-6
                py-2.5
                sm:py-3
                border
                border-border
                rounded-lg
                hover:bg-accent
                transition-colors
                font-semibold
                text-sm
                sm:text-base
                text-center
              "
            >
              {data?.casestudy_button ??
                "Diskusikan Proyek Serupa"}
            </Link>


          </div>




          {/* Visual */}
          <div
            className="
              order-2
              relative
              w-full
              aspect-[4/3]
              sm:aspect-[16/10]
              rounded-xl
              border
              border-border
              overflow-hidden
            "
          >

            {image ? (

              <Image
                src={image}
                alt={
                  data?.casestudy_title ??
                  "Case Study"
                }
                fill
                className="
                  object-cover
                  transition-transform
                  duration-500
                  hover:scale-105
                "
                sizes="
                  (max-width:640px) 100vw,
                  (max-width:1024px) 50vw,
                  50vw
                "
              />

            ) : (

              <div
                className="
                  flex
                  h-full
                  items-center
                  justify-center
                  bg-gradient-to-br
                  from-slate-900
                  to-slate-800
                "
              >

                <div className="text-center">

                  <div
                    className="
                      text-xs
                      sm:text-sm
                      text-gray-400
                    "
                  >
                    Feature Media
                  </div>


                  <div
                    className="
                      text-5xl
                      sm:text-6xl
                      font-bold
                      text-slate-700
                      mt-2
                    "
                  >
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