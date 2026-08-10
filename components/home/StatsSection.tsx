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
      const images: Record<string, string> = {};

      for (const brand of data?.index_brand_list ?? []) {

        if (!brand.logo) continue;

        try {
          const res = await fetch(
            `/api/wordpress/media/page/${brand.logo}`
          );

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



  return (
    <section
      className="
        py-14
        sm:py-15
        md:py-20
        bg-accent/5
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


        {/* Stats */}
        <div
          className="
            grid
            grid-cols-2
            lg:grid-cols-4
            gap-6
            sm:gap-8
            mb-10
            sm:mb-14
          "
        >

          {stats.map((stat,index)=>(
            <div
              key={index}
              className="
                text-center
              "
            >

              <div
                className="
                  text-3xl
                  sm:text-4xl
                  lg:text-5xl
                  font-bold
                  text-primary
                  mb-1
                  sm:mb-2
                "
              >
                {stat.number ?? ""}
              </div>


              <div
                className="
                  text-xs
                  sm:text-sm
                  text-muted-foreground
                  leading-relaxed
                "
              >
                {stat.label ?? ""}
              </div>


            </div>
          ))}

        </div>




        <div
          className="
            h-px
            bg-border
            my-8
            sm:my-12
          "
        />





        {/* Brand Support */}
        <div>


          <div
            className="
              inline-flex
              mb-8
              sm:mb-10
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
            {data?.stat_support ?? "Didukung Oleh"}
          </div>




          <div
            className="
              grid
              grid-cols-1
              sm:grid-cols-2
              lg:grid-cols-4
              gap-5
              sm:gap-6
              lg:gap-8
            "
          >

            {(data?.index_brand_list ?? []).map(
              (brand:any,index:number)=>(
                
              <div
                key={index}
                className="
                  rounded-xl
                  border
                  border-border
                  bg-card
                  p-5
                  sm:p-6
                  lg:p-8
                  text-center
                  transition-all
                  duration-300
                  hover:border-primary
                  flex
                  flex-col
                "
              >


                {/* Logo */}
                <div
                  className="
                    w-full
                    h-16
                    sm:h-20
                    rounded-lg
                    flex
                    items-center
                    justify-center
                    mb-5
                    sm:mb-8
                    overflow-hidden
                    px-3
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
                        max-h-12
                        sm:max-h-14
                        w-auto
                      "
                    />

                  ) : (

                    <span
                      className="
                        text-xs
                        text-gray-400
                      "
                    >
                      Logo
                    </span>

                  )}

                </div>




                {/* Divider */}
                <div
                  className="
                    w-8
                    h-px
                    bg-primary/40
                    mx-auto
                    mb-4
                    sm:mb-5
                  "
                />





                {/* Name */}
                <h3
                  className="
                    text-xs
                    sm:text-sm
                    font-semibold
                    text-primary
                    mb-2
                    line-clamp-2
                  "
                >
                  {brand.name}
                </h3>




                {/* Description */}
                <p
                  className="
                    text-xs
                    leading-relaxed
                    text-muted-foreground
                    mb-4
                    line-clamp-4
                  "
                >
                  {brand.description}
                </p>



                {/* Link */}
                {brand.link && (

                  <a
                    href={brand.link}
                    target="_blank"
                    className="
                      mt-auto
                      text-[11px]
                      sm:text-xs
                      tracking-wider
                      font-semibold
                      text-primary
                      hover:opacity-80
                      transition
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