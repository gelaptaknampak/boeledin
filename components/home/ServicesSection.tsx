"use client";

import { ArrowRight, Zap, Settings, Grid3x3, Lightbulb } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";

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

  return (
    <section className="py-20 md:py-28 bg-background">
      <div className="container mx-auto px-4">
        <div className="mb-16">
          <div className="inline-block mb-4 px-4 py-2 bg-accent rounded-full text-sm font-semibold text-primary">
            Fokus Layanan Utama
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Empat pilar solusi tampilan digital kami
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl">
            Dari bandara hingga command center, kami merancang sistem yang
            bekerja tanpa henti — 7 hari seminggu, 24 jam sehari.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.map((service) => {
            const Icon = service.icon;
            return (
              <div key={service.num} className="group">
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
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
