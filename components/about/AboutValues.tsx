"use client";

import type { ComponentType } from "react";
import * as LucideIcons from "lucide-react";

import {
  FaFacebook,
  FaInstagram,
  FaLinkedin,
  FaYoutube,
  FaWhatsapp,
  FaTiktok,
} from "react-icons/fa";

type Props = {
  acf: any;
};

/**
 * ============================================
 * BRAND / SOCIAL ICONS
 * ============================================
 *
 * Brand icons tidak tersedia di Lucide.
 * Karena itu kita ambil dari react-icons.
 */
const brandIconMap = {
  Facebook: FaFacebook,

  Instagram: FaInstagram,

  Linkedin: FaLinkedin,
  LinkedIn: FaLinkedin,

  Youtube: FaYoutube,
  YouTube: FaYoutube,

  WhatsApp: FaWhatsapp,
  Whatsapp: FaWhatsapp,

  TikTok: FaTiktok,
  Tiktok: FaTiktok,
} as const;

/**
 * ============================================
 * ICON RESOLVER
 * ============================================
 *
 * Bisa menerima:
 *
 * "Zap"
 * "Shield"
 * "Sparkles"
 * "Users"
 * "Building2"
 * "Target"
 * "Rocket"
 * "Factory"
 * "Database"
 * dll.
 *
 * Dan juga:
 *
 * "Facebook"
 * "Instagram"
 * "LinkedIn"
 * "YouTube"
 * "WhatsApp"
 * "TikTok"
 */
function getIcon(iconName?: string | null): ComponentType<any> {
  /**
   * Default icon jika icon kosong
   * atau tidak ditemukan.
   */
  const fallbackIcon = LucideIcons.Sparkles;

  if (!iconName) {
    return fallbackIcon;
  }

  const name = iconName.trim();

  if (!name) {
    return fallbackIcon;
  }

  /**
   * ------------------------------------------
   * 1. BRAND ICON
   * ------------------------------------------
   */
  const BrandIcon = brandIconMap[name as keyof typeof brandIconMap];

  if (BrandIcon) {
    return BrandIcon;
  }

  /**
   * ------------------------------------------
   * 2. LUCIDE ICON
   * ------------------------------------------
   *
   * Ambil icon berdasarkan nama secara dynamic.
   */
  const LucideIcon = (
    LucideIcons as Record<string, ComponentType<any> | undefined>
  )[name];

  if (LucideIcon) {
    return LucideIcon;
  }

  /**
   * ------------------------------------------
   * 3. ALIAS
   * ------------------------------------------
   *
   * Untuk mengantisipasi variasi penamaan.
   */
  const aliases: Record<string, string> = {
    Grid3x3: "Grid3X3",

    Linkedin: "Linkedin",
    LinkedIn: "Linkedin",

    Youtube: "Youtube",
    YouTube: "Youtube",

    Whatsapp: "Whatsapp",
    WhatsApp: "Whatsapp",

    Tiktok: "Tiktok",
    TikTok: "Tiktok",
  };

  const aliasName = aliases[name];

  if (aliasName) {
    const AliasIcon = (
      LucideIcons as Record<string, ComponentType<any> | undefined>
    )[aliasName];

    if (AliasIcon) {
      return AliasIcon;
    }
  }

  /**
   * Icon tidak ditemukan.
   *
   * Jangan sampai React mencoba render undefined.
   */
  console.warn(
    `[AboutValues] Icon "${name}" tidak ditemukan. Menggunakan Sparkles sebagai fallback.`,
  );

  return fallbackIcon;
}

export default function AboutValues({ acf = {} }: Props) {
  /**
   * ==========================================
   * VALUES
   * ==========================================
   *
   * Card yang title & description-nya
   * sama-sama kosong difilter, supaya tidak
   * ada kotak kosong ikut tampil di grid.
   */

  const rawValues = [
    {
      title: acf.about_value_1_title,
      desc: acf.about_value_1_description,
      icon: getIcon(acf.about_value_1_icon),
    },
    {
      title: acf.about_value_2_title,
      desc: acf.about_value_2_description,
      icon: getIcon(acf.about_value_2_icon),
    },
    {
      title: acf.about_value_3_title,
      desc: acf.about_value_3_description,
      icon: getIcon(acf.about_value_3_icon),
    },
    {
      title: acf.about_value_4_title,
      desc: acf.about_value_4_description,
      icon: getIcon(acf.about_value_4_icon),
    },
  ];

  const values = rawValues.filter((value) => value.title || value.desc);

  if (values.length === 0) {
    return null;
  }

  return (
    <section className="bg-accent/10 py-16 md:py-24 lg:py-28">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* ========================================
            HEADING
        ======================================== */}

        <div className="mb-10 max-w-3xl md:mb-12 lg:mb-16">
          {acf.about_values_eyebrow && (
            <div
              className="
                mb-4
                inline-flex
                rounded-full
                border
                border-primary/20
                bg-primary/10
                px-4
                py-1.5
                text-xs
                font-semibold
                text-primary
                sm:mb-5
                sm:px-5
                sm:py-2
                sm:text-sm
              "
            >
              {acf.about_values_eyebrow}
            </div>
          )}

          {acf.about_values_title && (
            <h2
              className="
                text-2xl
                font-bold
                leading-tight
                text-foreground
                sm:text-3xl
                md:text-4xl
                lg:text-5xl
              "
            >
              {acf.about_values_title}
            </h2>
          )}
        </div>

        {/* ========================================
            CARDS
        ======================================== */}

        <div
          className="
            grid
            grid-cols-1
            gap-5
            sm:grid-cols-2
            sm:gap-6
            lg:grid-cols-4
          "
        >
          {values.map((value, idx) => {
            const Icon = value.icon;

            return (
              <div
                key={`value-${idx}`}
                className="
                  group
                  flex
                  h-full
                  flex-col
                  rounded-2xl
                  border
                  border-border
                  bg-card
                  p-6
                  shadow-sm
                  transition-all
                  duration-300
                  hover:-translate-y-2
                  hover:border-primary/30
                  hover:shadow-xl
                  sm:p-7
                  lg:p-8
                "
              >
                {/* ==================================
                    ICON
                ================================== */}

                <div
                  className="
                    mb-5
                    flex
                    h-14
                    w-14
                    items-center
                    justify-center
                    rounded-2xl
                    bg-gradient-to-br
                    from-primary/15
                    to-primary/5
                    transition-transform
                    duration-300
                    group-hover:scale-110
                    sm:mb-6
                    sm:h-16
                    sm:w-16
                  "
                >
                  <Icon className="h-7 w-7 text-primary sm:h-8 sm:w-8" />
                </div>

                {/* ==================================
                    TITLE
                ================================== */}

                {value.title && (
                  <h3
                    className="
                      mb-3
                      text-lg
                      font-semibold
                      text-foreground
                      sm:mb-4
                      sm:text-xl
                    "
                  >
                    {value.title}
                  </h3>
                )}

                {/* ==================================
                    DESCRIPTION
                ================================== */}

                {value.desc && (
                  <p
                    className="
                      flex-1
                      text-sm
                      leading-6
                      text-foreground/80
                      sm:text-base
                      sm:leading-7
                    "
                  >
                    {value.desc}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}