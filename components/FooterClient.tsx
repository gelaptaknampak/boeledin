"use client";

import { useEffect, useState } from "react";

import Link from "next/link";
import Image from "next/image";
import { Mail, Phone, MapPin } from "lucide-react";

type FooterProps = {
  data?: { 
    
    image_logo?: number;

    footer_description?: string;
    copyright_text?: string;

    navigation_title?: string;
    service_title?: string;

    contact_title?: string;
    address?: string;
    phone?: string;
    email?: string;
  };
};

export default function FooterClient({ data }: FooterProps) {
  const [logo, setLogo] = useState("/logo-white.png");

useEffect(() => {
  async function loadLogo() {
    if (!data?.image_logo) return;

    const res = await fetch(
      `/api/wordpress/media/page/${data.image_logo}`
    );

    const media = await res.json();

    if (media?.source_url) {
      setLogo(media.source_url);
    }
  }

  loadLogo();
}, [data?.image_logo]);

  const currentYear = new Date().getFullYear();

  const description =
    data?.footer_description ??
    "Jaminan Kualitas Terbaik untuk semua produk dan layanan kami.";

  const copyright =
    data?.copyright_text ??
    "BOELEDIN. All rights reserved.";

  const navigationTitle =
    data?.navigation_title ??
    "Navigasi";

  const serviceTitle =
    data?.service_title ??
    "Layanan";

  const contactTitle =
    data?.contact_title ??
    "Contact Us";

  const address =
    data?.address ??
    "Rukan Exclusive, Jl. Bukit Golf Mediterania, Pantai Indah Kapuk No.1A Blok G, RT.7/RW.2, Kamal Muara, Penjaringan, Jakarta Utara, DKI Jakarta 14470";

  const phone =
    data?.phone ??
    "+62 813-1906-0606";

  const email =
    data?.email ??
    "info@boeledin.com";

//   const logo =
//     data?.image_logo?.url ??
//     "/logo-white.png";

  const navigationItems = [
    {
      label: "Home",
      link: "/",
    },
    {
      label: "About Us",
      link: "/about",
    },
    {
      label: "Products",
      link: "/products",
    },
    {
      label: "News",
      link: "/news",
    },
    {
      label: "Contact",
      link: "/contact",
    },
  ];

  const serviceItems = [
    {
      label: "Digital Signage & FIDS",
      link: "/products?category=electronics",
    },
    {
      label: "Smart Command Center",
      link: "/products?category=accessories",
    },
    {
      label: "Pengalaman Immersive",
      link: "/products?category=home",
    },
    {
      label: "Integrasi IT & Software",
      link: "/products?category=fashion",
    },
  ];

  return (
    <footer className="bg-card border-t border-border mt-auto">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company */}
          <div>
            <Image
              src={logo}
              alt="BOELEDIN"
              width={70}
              height={70}
              className="mb-3 h-7 w-auto"
              unoptimized
            />

            <p className="mb-4 text-sm leading-relaxed text-muted-foreground">
              {description}
            </p>

            <div className="flex gap-3">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-lg bg-accent p-2 hover:bg-primary hover:text-primary-foreground"
              >
                <span className="font-bold">f</span>
              </a>

              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-lg bg-accent p-2 hover:bg-primary hover:text-primary-foreground"
              >
                <span className="font-bold">𝕏</span>
              </a>

              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-lg bg-accent p-2 hover:bg-primary hover:text-primary-foreground"
              >
                📷
              </a>
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="mb-4 font-semibold">
              {navigationTitle}
            </h4>

            <ul className="space-y-2">
              {navigationItems.map((item) => (
                <li key={item.link}>
                  <Link
                    href={item.link}
                    className="text-sm text-muted-foreground transition hover:text-primary"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="mb-4 font-semibold">
              {serviceTitle}
            </h4>

            <ul className="space-y-2">
              {serviceItems.map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.link}
                    className="text-sm text-muted-foreground transition hover:text-primary"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="mb-4 font-semibold">
              {contactTitle}
            </h4>

            <ul className="space-y-3">
              <li className="flex gap-2 text-sm text-muted-foreground">
                <MapPin className="mt-1 h-4 w-4 shrink-0" />
                <span>{address}</span>
              </li>

              <li className="flex items-center gap-2 text-sm text-muted-foreground">
                <Phone className="h-4 w-4" />
                <a href={`tel:${phone}`}>{phone}</a>
              </li>

              <li className="flex items-center gap-2 text-sm text-muted-foreground">
                <Mail className="h-4 w-4" />
                <a href={`mailto:${email}`}>{email}</a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-border pt-8">
          <p className="text-sm text-muted-foreground">
            © {currentYear} {copyright}
          </p>
        </div>
      </div>
    </footer>
  );
}