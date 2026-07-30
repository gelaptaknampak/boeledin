"use client";

import { ArrowRight, Zap, Settings, Grid3x3, Lightbulb } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";
import { motion, type Variants } from "framer-motion";

export default function ServicesSection() {
  const { t } = useTranslation();

  const services = [
    {
      num: "01",
      icon: Zap,
      title: "Digital Signage",
      desc: "Perangkat layar bermitra dengan merek ternama seperti BOE untuk fasilitas publik, termasuk implementasi Flight Information Display System (FIDS) di bandara.",
    },
    {
      num: "02",
      icon: Settings,
      title: "Pengalaman Immersive",
      desc: "Menciptakan instalasi visual atau LED interaktif untuk keperluan promosi dan branding perusahaan.",
    },
    {
      num: "03",
      icon: Grid3x3,
      title: "Smart Command Center",
      desc: "Membantu dunia usaha hingga instansi pemerintah membangun pusat kendali yang membutuhkan visualisasi data berskala besar.",
    },
    {
      num: "04",
      icon: Lightbulb,
      title: "Integrasi IT & Software",
      desc: "Menggabungkan perangkat keras layar dengan perangkat lunak pendukung agar informasi dapat disampaikan secara real-time.",
    },
  ];

  const containerVariants = {
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
        ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
      },
    },
  };

  return (
    <section className="py-20 md:py-28 bg-background">
      <div className="container mx-auto px-4">
        <motion.div
          className="mb-16"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
        >
          <motion.div
            variants={itemVariants}
            className="inline-block mb-4 px-4 py-2 bg-accent rounded-full text-sm font-semibold text-primary"
          >
            Fokus Layanan Utama
          </motion.div>

          <motion.h2
            variants={itemVariants}
            className="text-4xl md:text-5xl font-bold mb-6"
          >
            Empat pilar solusi tampilan digital kami
          </motion.h2>

          <motion.p
            variants={itemVariants}
            className="text-lg text-muted-foreground max-w-3xl"
          >
            Dari bandara hingga command center, kami merancang sistem yang
            bekerja tanpa henti 7 hari seminggu, 24 jam sehari.
          </motion.p>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          {services.map((service) => {
            const Icon = service.icon;
            return (
              <motion.div
                key={service.num}
                variants={itemVariants}
                whileHover={{
                  y: -8,
                  transition: { duration: 0.25 },
                }}
                className="group"
              >
                <div className="mb-6 inline-block p-4 bg-accent/10 rounded-lg border border-accent/20 group-hover:border-primary/50 group-hover:bg-accent/20 transition-all">
                  <Icon className="w-6 h-6 text-primary" />
                </div>

                <span className="text-5xl font-bold text-primary/10 block mb-2">
                  {service.num}
                </span>

                <h3 className="text-lg font-bold mb-4">{service.title}</h3>
                <p className="text-muted-foreground leading-relaxed text-sm">
                  {service.desc}
                </p>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
