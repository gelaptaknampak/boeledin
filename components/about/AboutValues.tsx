"use client";

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
function getIcon(
  iconName?: string | null,
): React.ComponentType<any> {
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
  const BrandIcon =
    brandIconMap[
      name as keyof typeof brandIconMap
    ];

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
    LucideIcons as Record<
      string,
      React.ComponentType<any> | undefined
    >
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
      LucideIcons as Record<
        string,
        React.ComponentType<any> | undefined
      >
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

export default function AboutValues({
  acf,
}: Props) {
  /**
   * ==========================================
   * VALUES
   * ==========================================
   */

  const values = [
    {
      title: acf.about_value_1_title,

      desc: acf.about_value_1_description,

      icon: getIcon(
        acf.about_value_1_icon,
      ),
    },

    {
      title: acf.about_value_2_title,

      desc: acf.about_value_2_description,

      icon: getIcon(
        acf.about_value_2_icon,
      ),
    },

    {
      title: acf.about_value_3_title,

      desc: acf.about_value_3_description,

      icon: getIcon(
        acf.about_value_3_icon,
      ),
    },
  ];

  return (
    <section className="bg-accent/10 py-16 md:py-24 lg:py-28">
      <div className="container mx-auto px-4">

        {/* ========================================
            HEADING
        ======================================== */}

        <div className="mb-12 max-w-3xl lg:mb-16">

          {acf.about_values_eyebrow && (
            <div
              className="
                mb-5
                inline-flex
                rounded-full
                border
                border-primary/20
                bg-primary/10
                px-5
                py-2
                text-sm
                font-semibold
                text-primary
              "
            >
              {acf.about_values_eyebrow}
            </div>
          )}

          {acf.about_values_title && (
            <h2
              className="
                text-3xl
                font-bold
                leading-tight
                text-foreground
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
            gap-6
            md:grid-cols-2
            xl:grid-cols-3
          "
        >

          {values.map(
            (value, idx) => {
              const Icon = value.icon;

              return (
                <div
                  key={idx}
                  className="
                    group
                    flex
                    h-full
                    flex-col
                    rounded-2xl
                    border
                    border-border
                    bg-card
                    p-8
                    shadow-sm
                    transition-all
                    duration-300
                    hover:-translate-y-2
                    hover:border-primary/30
                    hover:shadow-xl
                  "
                >

                  {/* ==================================
                      ICON
                  ================================== */}

                  <div
                    className="
                      mb-6
                      flex
                      h-16
                      w-16
                      items-center
                      justify-center
                      rounded-2xl
                      bg-gradient-to-br
                      from-primary/15
                      to-primary/5
                      transition-transform
                      duration-300
                      group-hover:scale-110
                    "
                  >
                    <Icon
                      className="
                        h-8
                        w-8
                        text-primary
                      "
                      size={32}
                    />
                  </div>

                  {/* ==================================
                      TITLE
                  ================================== */}

                  {value.title && (
                    <h3
                      className="
                        mb-4
                        text-xl
                        font-semibold
                        text-foreground
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
                        text-base
                        leading-7
                        text-foreground/80
                      "
                    >
                      {value.desc}
                    </p>
                  )}

                </div>
              );
            },
          )}

        </div>
      </div>
    </section>
  );
}