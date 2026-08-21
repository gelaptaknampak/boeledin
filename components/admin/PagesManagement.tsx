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
  Landmark,
  ChartColumn,
  Gem,
  Route,
  Handshake,
  PhoneCall,
  MapPin,
  PanelBottom,
} from "lucide-react";
import { useSearchParams } from "next/navigation";

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

const aboutSections = [
  {
    title: "Hero",
    description: "Hero About Us",
    href: "/admin/pages/about/AboutHero",
    icon: LayoutTemplate,
  },
  {
    title: "Story",
    description: "Cerita perusahaan",
    href: "/admin/pages/about/AboutStory",
    icon: Landmark,
  },
  {
    title: "Statistics",
    description: "Statistik perusahaan",
    href: "/admin/pages/about/AboutStats",
    icon: ChartColumn,
  },
  {
    title: "Values",
    description: "Core Values",
    href: "/admin/pages/about/AboutValues",
    icon: Gem,
  },
  // {
  //   title: "Journey",
  //   description: "Timeline perusahaan",
  //   href: "/admin/pages/about/AboutJourney",
  //   icon: Route,
  // },
  {
    title: "CTA",
    description: "Call To Action",
    href: "/admin/pages/about/AboutCTA",
    icon: Handshake,
  },
];

const productsSections = [
  {
    title: "Hero",
    description: "Hero katalog produk",
    href: "/admin/pages/product/ProductsHero",
    icon: LayoutTemplate,
  },
];

const newsSections = [
  {
    title: "Hero",
    description: "Hero wawasan dan berita",
    href: "/admin/pages/news/NewsHero",
    icon: Newspaper,
  },
];

const contactSections = [
  {
    title: "Hero",
    description: "Hero Contact Us",
    href: "/admin/pages/contact/ContactHero",
    icon: LayoutTemplate,
  },
  {
    title: "Contact Form",
    description: "Form inquiry pelanggan",
    href: "/admin/pages/contact/ContactForm",
    icon: PhoneCall,
  },
  {
    title: "Contact Info",
    description: "Informasi perusahaan, email, telepon, jam operasional & maps",
    href: "/admin/pages/contact/ContactInfo",
    icon: MapPin,
  },
];

const footerSections = [
  {
    title: "Footer",
    description: "Informasi footer website, navigasi, layanan, dan kontak",
    href: "/admin/pages/footer",
    icon: PanelBottom,
  },
];

export default function PagesManagement() {
  const [homeOpen, setHomeOpen] = useState(false);
  const [aboutOpen, setAboutOpen] = useState(false);
  const [productsOpen, setProductsOpen] = useState(false);
  const [newsOpen, setNewsOpen] = useState(false);
  const [contactOpen, setContactOpen] = useState(false);
  const [footerOpen, setFooterOpen] = useState(false);
  const searchParams = useSearchParams();
  const lang = searchParams.get("lang") || "id";

  return (
    <div className="space-y-8">
      {/* PAGE HEADER */}
      <div>
        <h1 className="text-3xl font-bold">Kelola Halaman</h1>

        <p className="mt-2 text-muted-foreground">
          Pilih halaman kemudian pilih section yang ingin diedit.
        </p>
      </div>

      {/* ===================================================== */}
      {/* HOME */}
      {/* ===================================================== */}

      <div className="overflow-hidden rounded-xl border bg-card shadow-sm">
        <button
          onClick={() => setHomeOpen(!homeOpen)}
          className="flex w-full items-center justify-between p-6 transition hover:bg-accent"
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
                    href={`${section.href}?lang=${lang}`}
                    className="inline-flex items-center gap-2 rounded-lg border px-4 py-2 text-sm transition hover:bg-accent"
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

      {/* ===================================================== */}
      {/* ABOUT */}
      {/* ===================================================== */}

      <div className="overflow-hidden rounded-xl border bg-card shadow-sm">
        <button
          onClick={() => setAboutOpen(!aboutOpen)}
          className="flex w-full items-center justify-between p-6 transition hover:bg-accent"
        >
          <div className="flex items-center gap-4">
            <div className="rounded-lg bg-primary/10 p-3">
              <Briefcase className="h-7 w-7 text-primary" />
            </div>

            <div className="text-left">
              <h2 className="text-xl font-semibold">About</h2>

              <p className="text-sm text-muted-foreground">
                Halaman Tentang Kami
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700 dark:bg-green-900 dark:text-green-200">
              Published
            </span>

            {aboutOpen ? (
              <ChevronDown className="h-5 w-5" />
            ) : (
              <ChevronRight className="h-5 w-5" />
            )}
          </div>
        </button>

        {aboutOpen && (
          <div className="border-t bg-background">
            {aboutSections.map((section) => {
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
                    href={`${section.href}?lang=${lang}`}
                    className="inline-flex items-center gap-2 rounded-lg border px-4 py-2 text-sm transition hover:bg-accent"
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

      {/* ===================================================== */}
      {/* PRODUCTS */}
      {/* ===================================================== */}

      <div className="overflow-hidden rounded-xl border bg-card shadow-sm">
        <button
          onClick={() => setProductsOpen(!productsOpen)}
          className="flex w-full items-center justify-between p-6 transition hover:bg-accent"
        >
          <div className="flex items-center gap-4">
            <div className="rounded-lg bg-primary/10 p-3">
              <Package className="h-7 w-7 text-primary" />
            </div>

            <div className="text-left">
              <h2 className="text-xl font-semibold">Products</h2>

              <p className="text-sm text-muted-foreground">
                Halaman katalog dan informasi produk
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700 dark:bg-green-900 dark:text-green-200">
              Published
            </span>

            {productsOpen ? (
              <ChevronDown className="h-5 w-5" />
            ) : (
              <ChevronRight className="h-5 w-5" />
            )}
          </div>
        </button>

        {productsOpen && (
          <div className="border-t bg-background">
            {productsSections.map((section) => {
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
                    href={`${section.href}?lang=${lang}`}
                    className="inline-flex items-center gap-2 rounded-lg border px-4 py-2 text-sm transition hover:bg-accent"
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

      {/* ===================================================== */}
      {/* NEWS */}
      {/* ===================================================== */}

      <div className="overflow-hidden rounded-xl border bg-card shadow-sm">
        <button
          onClick={() => setNewsOpen(!newsOpen)}
          className="flex w-full items-center justify-between p-6 transition hover:bg-accent"
        >
          <div className="flex items-center gap-4">
            <div className="rounded-lg bg-primary/10 p-3">
              <Newspaper className="h-7 w-7 text-primary" />
            </div>

            <div className="text-left">
              <h2 className="text-xl font-semibold">News</h2>

              <p className="text-sm text-muted-foreground">
                Halaman wawasan dan berita
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700 dark:bg-green-900 dark:text-green-200">
              Published
            </span>

            {newsOpen ? (
              <ChevronDown className="h-5 w-5" />
            ) : (
              <ChevronRight className="h-5 w-5" />
            )}
          </div>
        </button>

        {newsOpen && (
          <div className="border-t bg-background">
            {newsSections.map((section) => {
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
                    href={`${section.href}?lang=${lang}`}
                    className="inline-flex items-center gap-2 rounded-lg border px-4 py-2 text-sm transition hover:bg-accent"
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

      {/* ===================================================== */}
      {/* CONTACT */}
      {/* ===================================================== */}

      <div className="overflow-hidden rounded-xl border bg-card shadow-sm">
        <button
          onClick={() => setContactOpen(!contactOpen)}
          className="flex w-full items-center justify-between p-6 transition hover:bg-accent"
        >
          <div className="flex items-center gap-4">
            <div className="rounded-lg bg-primary/10 p-3">
              <PhoneCall className="h-7 w-7 text-primary" />
            </div>

            <div className="text-left">
              <h2 className="text-xl font-semibold">Contact Us</h2>

              <p className="text-sm text-muted-foreground">
                Halaman Hubungi Kami
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700 dark:bg-green-900 dark:text-green-200">
              Published
            </span>

            {contactOpen ? (
              <ChevronDown className="h-5 w-5" />
            ) : (
              <ChevronRight className="h-5 w-5" />
            )}
          </div>
        </button>

        {contactOpen && (
          <div className="border-t bg-background">
            {contactSections.map((section) => {
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
                    href={`${section.href}?lang=${lang}`}
                    className="inline-flex items-center gap-2 rounded-lg border px-4 py-2 text-sm transition hover:bg-accent"
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

      {/* ===================================================== */}
      {/* FOOTER */}
      {/* ===================================================== */}

      <div className="overflow-hidden rounded-xl border bg-card shadow-sm">
        <button
          onClick={() => setFooterOpen(!footerOpen)}
          className="flex w-full items-center justify-between p-6 transition hover:bg-accent"
        >
          <div className="flex items-center gap-4">
            <div className="rounded-lg bg-primary/10 p-3">
              <PanelBottom className="h-7 w-7 text-primary" />
            </div>

            <div className="text-left">
              <h2 className="text-xl font-semibold">Footer</h2>

              <p className="text-sm text-muted-foreground">
                Pengaturan footer website
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700 dark:bg-green-900 dark:text-green-200">
              Published
            </span>

            {footerOpen ? (
              <ChevronDown className="h-5 w-5" />
            ) : (
              <ChevronRight className="h-5 w-5" />
            )}
          </div>
        </button>

        {footerOpen && (
          <div className="border-t bg-background">
            {footerSections.map((section) => {
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
                    href={`${section.href}?lang=${lang}`}
                    className="inline-flex items-center gap-2 rounded-lg border px-4 py-2 text-sm transition hover:bg-accent"
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
