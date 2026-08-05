"use client";

import Link from "next/link";
import { motion } from "framer-motion";

import MosaicTransition from "./MosaicTransition";
import AnimatedGrid from "./AnimatedGrid";

type Props = {
  data: any;
};

const images = [
  "/hero1.jpg",
  "/hero2.jpg",
  "/hero3.jpg",
  "/hero4.jpg",
];

export default function HeroSection({ data }: Props) {
  return (
    <section className="relative min-h-screen overflow-hidden bg-black text-white">
      {/* Background */}
      <MosaicTransition images={images} interval={7000} />

      {/* Animated Grid */}
      <AnimatedGrid />

      {/* Overlay */}
      <div className="absolute inset-0 z-10 bg-gradient-to-r from-black via-black/80 md:from-black/90 md:via-black/60 md:to-black/20" />

      {/* Content */}
      <div className="relative z-20 flex min-h-screen items-center py-24 sm:py-28">
        <div className="container mx-auto px-5 sm:px-6 lg:px-10 xl:px-16">
          <div className="max-w-xl lg:max-w-2xl">

            {/* Eyebrow */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              className="mb-6 inline-block"
            >
              <span
                className="
                  inline-flex
                  rounded-full
                  border
                  border-blue-400/20
                  bg-blue-600/10
                  px-3
                  py-1.5
                  text-[10px]
                  font-semibold
                  uppercase
                  tracking-[0.22em]
                  text-blue-300
                  backdrop-blur-md
                  sm:px-4
                  sm:text-xs
                "
              >
                {data?.eyebrow ?? ""}
              </span>
            </motion.div>

            {/* Title */}
            <motion.h1
              initial={{ opacity: 0, y: 35 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.8,
                delay: 0.15,
              }}
              className="
                max-w-3xl
                text-3xl
                font-bold
                leading-tight
                tracking-[-0.03em]
                text-balance
                sm:text-4xl
                md:text-5xl
                lg:text-6xl
                xl:text-7xl
              "
            >
              {data?.title ?? ""}
            </motion.h1>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 35 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.8,
                delay: 0.3,
              }}
              className="
                mt-6
                max-w-xl
                text-sm
                leading-7
                text-gray-300
                sm:text-base
                md:text-lg
                lg:text-xl
              "
            >
              {data?.description ?? ""}
            </motion.p>

            {/* Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 35 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.8,
                delay: 0.45,
              }}
              className="
                mt-10
                flex
                flex-col
                gap-4
                sm:flex-row
                sm:items-center
              "
            >
              <Link
                href={data?.primaryButton?.url ?? "#"}
                className="
                  inline-flex
                  w-full
                  items-center
                  justify-center
                  rounded-xl
                  bg-blue-600
                  px-7
                  py-3.5
                  text-sm
                  font-semibold
                  transition-all
                  duration-300
                  hover:scale-105
                  hover:bg-blue-500
                  hover:shadow-[0_0_35px_rgba(59,130,246,.45)]
                  sm:w-auto
                "
              >
                {data?.primaryButton?.text ?? ""}
              </Link>

              <Link
                href={data?.secondaryButton?.url ?? "#"}
                className="
                  inline-flex
                  w-full
                  items-center
                  justify-center
                  rounded-xl
                  border
                  border-white/20
                  bg-white/5
                  px-7
                  py-3.5
                  text-sm
                  font-semibold
                  backdrop-blur-md
                  transition-all
                  duration-300
                  hover:scale-105
                  hover:border-white/60
                  hover:bg-white/10
                  sm:w-auto
                "
              >
                {data?.secondaryButton?.text ?? ""}
              </Link>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{
                delay: 0.8,
              }}
              className="
                mt-14
                grid
                grid-cols-3
                gap-3
                border-t
                border-white/10
                pt-8
                sm:gap-6
              "
            >
              {(data?.stats ?? []).map(
                (stat: any, index: number) => (
                  <div key={index}>
                    <h3
                      className="
                        text-2xl
                        font-bold
                        text-blue-400
                        sm:text-3xl
                        lg:text-4xl
                      "
                    >
                      {stat.number ?? ""}
                    </h3>

                    <p
                      className="
                        mt-2
                        text-xs
                        leading-relaxed
                        text-gray-300
                        sm:text-sm
                      "
                    >
                      {stat.label ?? ""}
                    </p>
                  </div>
                )
              )}
            </motion.div>

          </div>
        </div>
      </div>

      {/* Bottom Fade */}
      <div className="absolute inset-x-0 bottom-0 z-20 h-40 bg-gradient-to-t from-black via-black/70 to-transparent" />
    </section>
  );
}