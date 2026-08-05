"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Home,
  ChevronDown,
  ChevronRight,
  ArrowRight,
  LayoutTemplate,
  Briefcase,
  Package,
  BarChart3,
  Newspaper,
  Megaphone,
} from "lucide-react";

const homeSections = [
  {
    title: "Hero",
    description: "Hero banner, tombol, statistik",
    href: "/admin/pages/home/hero",
    icon: LayoutTemplate,
  },
  {
    title: "Services",
    description: "Layanan utama",
    href: "/admin/pages/home/services",
    icon: Briefcase,
  },
  {
    title: "Product Showcase",
    description: "Heading Product Showcase",
    href: "/admin/pages/home/productShowcase",
    icon: Package,
  },
  {
    title: "Case Study",
    description: "Konten Case Study",
    href: "/admin/pages/home/caseStudy",
    icon: Briefcase,
  },
  {
    title: "Statistics",
    description: "Statistik perusahaan",
    href: "/admin/pages/home/stat",
    icon: BarChart3,
  },
  {
    title: "News",
    description: "Heading News",
    href: "/admin/pages/home/news",
    icon: Newspaper,
  },
  {
    title: "CTA",
    description: "Call To Action",
    href: "/admin/pages/home/cta",
    icon: Megaphone,
  },
];

export default function PagesManagement() {
  const [homeOpen, setHomeOpen] = useState(false);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Kelola Halaman</h1>

        <p className="mt-2 text-muted-foreground">
          Pilih halaman kemudian pilih section yang ingin diedit.
        </p>
      </div>

      <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
        {/* HEADER */}
        <button
          onClick={() => setHomeOpen(!homeOpen)}
          className="flex w-full items-center justify-between p-6 hover:bg-accent transition"
        >
          <div className="flex items-center gap-4">
            <div className="rounded-lg bg-primary/10 p-3">
              <Home className="h-7 w-7 text-primary" />
            </div>

            <div className="text-left">
              <h2 className="text-xl font-semibold">Home</h2>

              <p className="text-sm text-muted-foreground">
                Landing page utama BOELEDIN
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700 dark:bg-green-900 dark:text-green-200">
              Published
            </span>

            {homeOpen ? (
              <ChevronDown className="h-5 w-5" />
            ) : (
              <ChevronRight className="h-5 w-5" />
            )}
          </div>
        </button>

        {/* CONTENT */}

        {homeOpen && (
          <div className="border-t bg-background">
            {homeSections.map((section) => {
              const Icon = section.icon;

              return (
                <div
                  key={section.title}
                  className="flex items-center justify-between border-b px-6 py-4 last:border-none"
                >
                  <div className="flex items-center gap-4">
                    <div className="rounded-md bg-primary/10 p-2">
                      <Icon className="h-5 w-5 text-primary" />
                    </div>

                    <div>
                      <h3 className="font-medium">{section.title}</h3>

                      <p className="text-sm text-muted-foreground">
                        {section.description}
                      </p>
                    </div>
                  </div>

                  <Link
                    href={section.href}
                    className="inline-flex items-center gap-2 rounded-lg border px-4 py-2 text-sm hover:bg-accent transition"
                  >
                    Kelola
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
