"use client";

import { useEffect, useState } from "react";

import Link from "next/link";
import Image from "next/image";

import { Mail, Phone, MapPin } from "lucide-react";

import { useTranslation } from "@/hooks/useTranslation";

type SocialMediaItem = {
  logo: number;
  link: string;
};

type FooterProps = {
  data?: {
    image_logo?: number;

    image_logo_width?: number;
    image_logo_height?: number;

    footer_description?: string;

    copyright_text?: string;

    navigation_title?: string;

    navigation_items?:
      | string
      | {
          label: string;
          link: string;
        }[];

    service_title?: string;

    service_items?:
      | string
      | {
          label: string;
          link: string;
        }[];

    contact_title?: string;

    address?: string;

    phone?: string;

    email?: string;

    social_media_list?: string | SocialMediaItem[];
  };
};

export default function FooterClient({ data }: FooterProps) {
  const [logo, setLogo] = useState("/logo-white.png");

  const [socialMedia, setSocialMedia] = useState<
    {
      logo: string;
      link: string;
    }[]
  >([]);

  /* =========================================================
     LANGUAGE
  ========================================================= */

  const { language } = useTranslation();

  function localizedHref(href: string) {
    const params = new URLSearchParams();

    params.set("lang", language);

    return `${href}?${params.toString()}`;
  }

  useEffect(() => {
    async function loadAssets() {
      // Logo
      if (data?.image_logo) {
        try {
          const res = await fetch(
            `/api/wordpress/media/page/${data.image_logo}`,
          );

          const media = await res.json();

          if (media?.source_url) {
            setLogo(media.source_url);
          }
        } catch (err) {
          console.error(err);
        }
      }

      // Social Media
      let socials: any[] = [];

      try {
        if (typeof data?.social_media_list === "string") {
          socials = JSON.parse(data.social_media_list);
        } else {
          socials = data?.social_media_list ?? [];
        }
      } catch {
        socials = [];
      }

      if (socials.length) {
        const result = await Promise.all(
          socials.map(async (item) => {
            if (!item.logo) {
              return {
                logo: "",
                link: item.link,
              };
            }

            try {
              const res = await fetch(`/api/wordpress/media/page/${item.logo}`);

              const media = await res.json();

              return {
                logo: media?.source_url ?? "",
                link: item.link,
              };
            } catch {
              return {
                logo: "",
                link: item.link,
              };
            }
          }),
        );

        setSocialMedia(result);
      }
    }

    loadAssets();
  }, [data]);

  function parseList(value: any) {
    try {
      if (Array.isArray(value)) {
        return value;
      }

      if (typeof value === "string") {
        return JSON.parse(value);
      }

      return [];
    } catch {
      return [];
    }
  }

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

  const description =
    data?.footer_description ??
    "Jaminan Kualitas Terbaik untuk semua produk dan layanan kami.";

  const copyright = data?.copyright_text ?? "BOELEDIN. All rights reserved.";

  const navigationTitle = data?.navigation_title ?? "Navigasi";

  const serviceTitle = data?.service_title ?? "Layanan";

  const contactTitle = data?.contact_title ?? "Contact Us";

  const address = data?.address ?? "Rukan Exclusive, Jakarta";

  const phone = data?.phone ?? "+62 813-1906-0606";

  const email = data?.email ?? "info@boeledin.com";

  const logoWidth = Number(data?.image_logo_width) || 220;

  const logoHeight = Number(data?.image_logo_height) || 70;

  return (
    <footer
      className="bg-[#071827] text-white"
      style={{
        backgroundColor: "#071827",
        color: "#ffffff",
      }}
    >
      <div className="container mx-auto px-4 py-12 sm:px-6 md:py-16 lg:px-8 lg:py-20">
        {/*
          Grid disesuaikan jadi 3 kolom ASLI di desktop (bukan 4
          kayak sebelumnya, padahal Services lagi di-comment jadi
          cuma 3 yang render). Company dikasih porsi lebih lebar
          (1.4fr) karena isinya lebih banyak -- logo, deskripsi,
          ikon sosmed -- dibanding Navigation/Contact yang cuma
          daftar singkat.
        */}
        <div className="grid gap-10 sm:grid-cols-2 sm:gap-12 lg:grid-cols-[1.4fr_1fr_1fr] lg:gap-16">
          {/* Company */}
          <div className="sm:col-span-2 lg:col-span-1">
            <Link href={localizedHref("/")} className="inline-block">
              <Image
                src={logo}
                alt="BOELEDIN"
                width={logoWidth}
                height={logoHeight}
                style={{
                  width: `${logoWidth}px`,
                  height: `${logoHeight}px`,
                }}
                className="mb-5 object-contain"
                unoptimized
              />
            </Link>

            <p className="mb-6 max-w-sm text-sm leading-relaxed text-[#b8c5d3]">
              {description}
            </p>

            <div className="flex gap-3">
              {socialMedia.map((item, index) => (
                <Link
                  key={index}
                  href={item.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-lg bg-[#12263d] p-2.5 transition-all hover:-translate-y-0.5 hover:bg-[#1992ff]"
                >
                  <Image
                    src={item.logo}
                    alt="social"
                    width={24}
                    height={24}
                    className="h-5 w-5 object-contain"
                    unoptimized
                  />
                </Link>
              ))}
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="mb-5 text-base font-semibold text-white lg:text-lg">
              {navigationTitle}
            </h4>

            <ul className="space-y-3">
              {navigationItems.map((item: any) => (
                <li key={item.link}>
                  <Link
                    href={localizedHref(item.link)}
                    className="text-sm text-[#b8c5d3] transition-colors hover:text-[#5db8ff]"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          {/* <div>
            <h4 className="mb-5 text-base font-semibold text-white lg:text-lg">
              {serviceTitle}
            </h4>

            <ul className="space-y-3">
              {serviceItems.map((item: any) => (
                <li key={item.link}>
                  <Link
                    href={localizedHref(item.link)}
                    className="text-sm text-[#b8c5d3] transition-colors hover:text-[#5db8ff]"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div> */}

          {/* Contact */}
          <div>
            <h4 className="mb-5 text-base font-semibold text-white lg:text-lg">
              {contactTitle}
            </h4>

            <ul className="space-y-4">
              <li className="flex gap-3 text-sm text-[#b8c5d3]">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[#5db8ff]" />

                <span className="leading-relaxed">{address}</span>
              </li>

              <li className="flex items-center gap-3 text-sm text-[#b8c5d3]">
                <Phone className="h-4 w-4 shrink-0 text-[#5db8ff]" />

                <a
                  href={`tel:${phone}`}
                  className="transition-colors hover:text-[#5db8ff]"
                >
                  {phone}
                </a>
              </li>

              <li className="flex items-center gap-3 text-sm text-[#b8c5d3]">
                <Mail className="h-4 w-4 shrink-0 text-[#5db8ff]" />

                <a
                  href={`mailto:${email}`}
                  className="transition-colors hover:text-[#5db8ff]"
                >
                  {email}
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-12 border-t border-[#1b3856] pt-8 lg:mt-16">
          <p className="text-sm text-[#8fa3b8]">
            © {new Date().getFullYear()} {copyright}
          </p>
        </div>
      </div>
    </footer>
  );
}
