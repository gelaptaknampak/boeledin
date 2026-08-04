"use client";

import {
  Zap,
  Settings,
  Grid3x3,
  Lightbulb,
} from "lucide-react";

import { motion, type Variants } from "framer-motion";

type Props = {
  data: any;
};

const iconMap = {
  zap: Zap,
  settings: Settings,
  grid3x3: Grid3x3,
  lightbulb: Lightbulb,
};

export default function ServicesSection({ data }: Props) {
  const containerVariants: Variants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: {
      opacity: 0,
      y: 40,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.7,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  };

  return (
    <section className="bg-background py-20 md:py-28">
      <div className="container mx-auto px-4">

        {/* Header */}

        <motion.div
          className="mb-16"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
        >
          <motion.div
            variants={itemVariants}
            className="inline-block rounded-full bg-accent px-4 py-2 text-sm font-semibold text-primary"
          >
            {data?.eyebrow ?? ""}
          </motion.div>

          <motion.h2
            variants={itemVariants}
            className="mt-4 mb-6 text-4xl font-bold md:text-5xl"
          >
            {data?.title ?? ""}
          </motion.h2>

          <motion.p
            variants={itemVariants}
            className="max-w-3xl text-lg text-muted-foreground"
          >
            {data?.description ?? ""}
          </motion.p>
        </motion.div>

        {/* Services */}

        <motion.div
          className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          {(data?.services ?? []).map(
            (service: any, index: number) => {
              const Icon =
                iconMap[
                  service.icon as keyof typeof iconMap
                ] ?? Zap;

              return (
                <motion.div
                  key={service.number ?? index}
                  variants={itemVariants}
                  whileHover={{
                    y: -8,
                    transition: {
                      duration: 0.25,
                    },
                  }}
                  className="group"
                >
                  <div className="mb-6 inline-block rounded-lg border border-accent/20 bg-accent/10 p-4 transition-all group-hover:border-primary/50 group-hover:bg-accent/20">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>

                  <span className="mb-2 block text-5xl font-bold text-primary/10">
                    {service.number ?? ""}
                  </span>

                  <h3 className="mb-4 text-lg font-bold">
                    {service.title ?? ""}
                  </h3>

                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {service.description ?? ""}
                  </p>
                </motion.div>
              );
            }
          )}
        </motion.div>

      </div>
    </section>
  );
}