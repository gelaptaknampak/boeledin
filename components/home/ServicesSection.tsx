"use client";

import * as LucideIcons from "lucide-react";
import type { LucideIcon } from "lucide-react";

import {
  FaFacebook,
  FaInstagram,
  FaLinkedin,
  FaYoutube,
  FaWhatsapp,
  FaTiktok,
} from "react-icons/fa";

import { motion, type Variants } from "framer-motion";

type Props = {
  data: any;
};

/**
 * Social / Brand Icons
 *
 * Lucide tidak menyediakan brand icons seperti
 * Facebook, Instagram, WhatsApp, TikTok, dll.
 *
 * Jadi kita sediakan resolver khusus untuk brand icons.
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
 * Resolve icon berdasarkan nama yang disimpan di CMS.
 *
 * Contoh:
 *
 * "Zap"        -> Lucide Zap
 * "Shield"     -> Lucide Shield
 * "Rocket"     -> Lucide Rocket
 * "Instagram"  -> Font Awesome Instagram
 * "WhatsApp"   -> Font Awesome WhatsApp
 *
 * Jadi tidak perlu lagi membuat iconMap manual
 * yang membatasi jumlah icon.
 */
function getIcon(
  iconName?: string | null,
): React.ComponentType<any> | null {
  if (!iconName) {
    return null;
  }

  const name = iconName.trim();

  if (!name) {
    return null;
  }

  /**
   * 1. Cek brand icon terlebih dahulu
   */
  const BrandIcon =
    brandIconMap[
      name as keyof typeof brandIconMap
    ];

  if (BrandIcon) {
    return BrandIcon;
  }

  /**
   * 2. Cek semua icon Lucide secara dynamic
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
   * 3. Alias / compatibility
   *
   * Beberapa nama icon bisa berbeda antar versi
   * lucide-react.
   */
  const aliases: Record<string, string> = {
    Grid3X3: "Grid3X3",
    Grid3x3: "Grid3X3",

    CircleCheck: "CircleCheck",
    CircleAlert: "CircleAlert",
    CircleX: "CircleX",
    CircleHelp: "CircleHelp",

    Linkedin: "Linkedin",
    LinkedIn: "Linkedin",

    Youtube: "Youtube",
    YouTube: "Youtube",
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
   */
  console.warn(
    `[ServicesSection] Icon "${name}" tidak ditemukan.`,
  );

  return null;
}

export default function ServicesSection({
  data,
}: Props) {
  console.log(
    "SERVICES SECTION DATA:",
    data,
  );

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

  /**
   * Hanya tampilkan service yang memang memiliki isi.
   *
   * Icon tidak dijadikan syarat.
   *
   * Jadi service tetap bisa tampil walaupun
   * user belum memilih icon.
   */
  const services = (
    data?.services ?? []
  ).filter(
    (service: any) =>
      service?.title?.trim() ||
      service?.description?.trim(),
  );

  return (
    <section
      className="
        bg-background
        py-16
        sm:py-20
        lg:py-28
      "
    >
      <div
        className="
          container
          mx-auto
          px-4
          sm:px-6
          lg:px-8
        "
      >
        {/* =========================================
            HEADER
        ========================================= */}

        <motion.div
          className="
            mx-auto
            mb-12
            max-w-4xl
            text-center
            lg:mb-20
          "
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{
            once: true,
            amount: 0.3,
          }}
        >
          {data?.eyebrow && (
            <motion.div
              variants={itemVariants}
              className="
                inline-flex
                rounded-full
                bg-accent
                px-4
                py-2
                text-xs
                font-semibold
                uppercase
                tracking-wider
                text-primary
                sm:text-sm
              "
            >
              {data.eyebrow}
            </motion.div>
          )}

          {data?.title && (
            <motion.h2
              variants={itemVariants}
              className="
                mt-5
                text-3xl
                font-bold
                leading-tight
                text-foreground
                sm:text-4xl
                lg:text-5xl
              "
            >
              {data.title}
            </motion.h2>
          )}

          {data?.description && (
            <motion.p
              variants={itemVariants}
              className="
                mx-auto
                mt-6
                max-w-3xl
                text-sm
                leading-7
                text-muted-foreground
                sm:text-base
                lg:text-lg
              "
            >
              {data.description}
            </motion.p>
          )}
        </motion.div>

        {/* =========================================
            SERVICES
        ========================================= */}

        {services.length > 0 && (
          <motion.div
            className="
              grid
              grid-cols-1
              gap-6
              sm:grid-cols-2
              xl:grid-cols-4
            "
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{
              once: true,
              amount: 0.2,
            }}
          >
            {services.map(
              (
                service: any,
                index: number,
              ) => {
                /**
                 * Dynamic icon resolver.
                 *
                 * Tidak ada lagi pembatasan:
                 *
                 * Zap
                 * Shield
                 * Rocket
                 * Factory
                 * Database
                 * Wrench
                 * Heart
                 * Star
                 * dll.
                 *
                 * Selama nama icon valid di lucide-react,
                 * icon akan langsung ditampilkan.
                 */
                const Icon = getIcon(
                  service?.icon,
                );

                const isBrandIcon =
                  [
                    "Facebook",
                    "Instagram",
                    "Linkedin",
                    "LinkedIn",
                    "Youtube",
                    "YouTube",
                    "WhatsApp",
                    "Whatsapp",
                    "TikTok",
                    "Tiktok",
                  ].includes(
                    service?.icon,
                  );

                return (
                  <motion.div
                    key={
                      service?.id ??
                      `${service?.title}-${index}`
                    }
                    variants={itemVariants}
                    whileHover={{
                      y: -10,
                      transition: {
                        duration: 0.25,
                      },
                    }}
                    className="group h-full"
                  >
                    <div
                      className="
                        relative
                        h-full
                        overflow-hidden
                        rounded-2xl
                        border
                        border-border
                        bg-card
                        p-6
                        transition-all
                        duration-300
                        hover:border-primary/30
                        hover:shadow-xl
                        sm:p-7
                      "
                    >
                      {/* =================================
                          NUMBER
                      ================================= */}

                      {service?.number && (
                        <span
                          className="
                            pointer-events-none
                            absolute
                            bottom-1
                            right-3
                            text-6xl
                            font-black
                            leading-none
                            text-blue-900
                            opacity-20
                            dark:text-sky-300
                            sm:text-7xl
                          "
                        >
                          {service.number}
                        </span>
                      )}

                      {/* =================================
                          ICON
                      ================================= */}

                      {Icon && (
                        <div
                          className="
                            relative
                            z-10
                            mb-6
                            flex
                            h-14
                            w-14
                            items-center
                            justify-center
                            rounded-xl
                            border
                            border-primary/15
                            bg-primary/10
                            transition-all
                            duration-300
                            group-hover:scale-110
                          "
                        >
                          <Icon
                            className="
                              h-7
                              w-7
                              text-primary
                            "
                            size={
                              isBrandIcon
                                ? 28
                                : undefined
                            }
                            strokeWidth={
                              isBrandIcon
                                ? undefined
                                : 1.8
                            }
                          />
                        </div>
                      )}

                      {/* =================================
                          TITLE
                      ================================= */}

                      {service?.title && (
                        <h3
                          className="
                            relative
                            z-10
                            mb-3
                            text-xl
                            font-semibold
                            text-foreground
                          "
                        >
                          {service.title}
                        </h3>
                      )}

                      {/* =================================
                          DESCRIPTION
                      ================================= */}

                      {service?.description && (
                        <p
                          className="
                            relative
                            z-10
                            text-sm
                            leading-7
                            text-muted-foreground
                          "
                        >
                          {service.description}
                        </p>
                      )}
                    </div>
                  </motion.div>
                );
              },
            )}
          </motion.div>
        )}
      </div>
    </section>
  );
}