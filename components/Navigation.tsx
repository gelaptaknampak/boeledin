"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import {
  Menu,
  X,
  Globe,
  Moon,
  Sun,
} from "lucide-react";

import {
  usePathname,
  useRouter,
  useSearchParams,
} from "next/navigation";

import { useTranslation } from "@/hooks/useTranslation";
import { useTheme } from "@/hooks/useTheme";
import ProductSearch from "./ProductSearch";

export default function Navigation() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const {
    t,
    language,
    setLanguage,
  } = useTranslation();

  const {
    theme,
    toggleTheme,
    mounted,
  } = useTheme();

  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  /*
   * =========================
   * SYNC URL -> ZUSTAND
   * =========================
   *
   * URL menjadi sumber bahasa utama.
   *
   * /?lang=id -> Zustand = id
   * /?lang=en -> Zustand = en
   *
   * Kalau URL tidak punya lang,
   * default = id.
   */
  useEffect(() => {
    const urlLanguage = searchParams.get("lang");

    /*
     * Default sekarang EN kalau nggak ada ?lang= sama
     * sekali di URL (misal buka boeledin.com polos).
     * Cuma jatuh ke ID kalau eksplisit ?lang=id.
     */
    const nextLanguage =
      urlLanguage === "id"
        ? "id"
        : "en";

    if (language !== nextLanguage) {
      setLanguage(nextLanguage);
    }
  }, [
    searchParams,
    language,
    setLanguage,
  ]);

  /*
   * =========================
   * LANGUAGE SWITCH
   * =========================
   */
  function changeLanguage() {
    const currentLanguage =
      searchParams.get("lang") === "en"
        ? "en"
        : "id";

    const nextLanguage =
      currentLanguage === "id"
        ? "en"
        : "id";

    /*
     * Update Zustand
     */
    setLanguage(nextLanguage);

    /*
     * Update URL
     */
    const params = new URLSearchParams(
      searchParams.toString()
    );

    params.set("lang", nextLanguage);

    /*
     * Refresh server component
     * dengan bahasa baru.
     */
    router.replace(
      `${pathname}?${params.toString()}`
    );

    /*
     * router.replace() doang kadang nggak maksa
     * Next.js narik ulang data server (bisa kepake
     * versi cache router yang lama). router.refresh()
     * maksa Next.js re-fetch konten server buat
     * halaman yang lagi dibuka, biar kontennya
     * beneran ganti bahasa.
     */
    router.refresh();

    /*
     * Tutup mobile menu
     */
    setMobileMenuOpen(false);
  }

  /*
   * =========================
   * LOCALIZED LINK
   * =========================
   */
  function localizedHref(href: string) {
    const params = new URLSearchParams();

    params.set("lang", language);

    return `${href}?${params.toString()}`;
  }

  /*
   * =========================
   * NAVIGATION
   * =========================
   */
  const navLinks = [
    {
      href: "/about",
      label: t("nav.about"),
    },
    {
      href: "/products",
      label: t("nav.products"),
    },
    {
      href: "/news",
      label: t("nav.news"),
    },
    {
      href: "/contact",
      label: t("nav.contact"),
    },
  ];

  /*
   * =========================
   * ACTIVE LINK
   * =========================
   */
  const isActive = (path: string) => {
    if (path === "/") {
      return pathname === "/";
    }

    return pathname === path;
  };

  return (
    <nav className="sticky top-0 z-50 border-b border-border bg-background">
      {/* =========================
          MAIN NAVBAR
      ========================= */}

      <div className="container mx-auto relative flex h-16 items-center justify-between px-4">

        {/* =========================
            LOGO
        ========================= */}

        <Link
          href={localizedHref("/")}
          onClick={() =>
            setMobileMenuOpen(false)
          }
          className="shrink-0"
        >
          <Image
            src={
              theme === "dark"
                ? "/logo-white.png"
                : "/logo-black.png"
            }
            alt="BOELEDIN"
            width={70}
            height={70}
            className="
              h-4
              w-auto
              transition-all
              sm:h-4
              md:h-5
              lg:h-6
              xl:h-7
            "
          />
        </Link>

        {/* =========================
            DESKTOP NAVIGATION
        ========================= */}

        <div
          className="
            absolute
            left-1/2
            hidden
            -translate-x-1/2
            items-center
            gap-6
            md:flex
            lg:gap-8
          "
        >
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={localizedHref(
                link.href
              )}
              className={`whitespace-nowrap text-sm font-medium transition-colors hover:text-primary ${
                isActive(link.href)
                  ? "text-primary"
                  : "text-muted-foreground"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* =========================
            RIGHT ACTIONS
        ========================= */}

        <div className="flex items-center gap-1.5 sm:gap-2 lg:gap-3">

          {/* Theme */}

          {mounted && (
            <button
              type="button"
              onClick={toggleTheme}
              className="rounded-lg p-2 transition-colors hover:bg-accent"
              aria-label="Toggle theme"
              title={
                theme === "dark"
                  ? "Switch to light mode"
                  : "Switch to dark mode"
              }
            >
              {theme === "dark" ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </button>
          )}

          {/* Language */}

          <button
            type="button"
            onClick={changeLanguage}
            className="
              flex
              items-center
              gap-2
              rounded-lg
              p-2
              transition-colors
              hover:bg-accent
            "
            aria-label={t(
              "common.language"
            )}
            title={t(
              "common.language"
            )}
          >
            <Globe className="h-4 w-4" />

            <span className="text-sm font-medium">
              {language === "en"
                ? "EN"
                : "ID"}
            </span>
          </button>

          {/* Product Search */}

          <ProductSearch />

          {/* Mobile Menu */}

          <button
            type="button"
            className="
              rounded-lg
              p-2
              transition-colors
              hover:bg-accent
              md:hidden
            "
            onClick={() =>
              setMobileMenuOpen(
                !mobileMenuOpen
              )
            }
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>

      {/* =========================
          MOBILE NAVIGATION
      ========================= */}

      {mobileMenuOpen && (
        <div className="border-t border-border py-4 md:hidden">
          <div className="container mx-auto flex flex-col gap-4 px-4">

            {/* Links */}

            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={localizedHref(
                  link.href
                )}
                onClick={() =>
                  setMobileMenuOpen(false)
                }
                className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors hover:text-primary ${
                  isActive(link.href)
                    ? "bg-accent text-primary"
                    : "text-muted-foreground"
                }`}
              >
                {link.label}
              </Link>
            ))}

            {/* Mobile Actions */}

            <div className="flex gap-2 px-4 py-2">

              {/* Theme */}

              {mounted && (
                <button
                  type="button"
                  onClick={toggleTheme}
                  className="
                    flex
                    flex-1
                    items-center
                    justify-center
                    gap-2
                    rounded-lg
                    bg-accent
                    px-4
                    py-2
                    text-sm
                    font-medium
                    text-foreground
                    transition-colors
                    hover:bg-accent/80
                  "
                  title={
                    theme === "dark"
                      ? "Switch to light mode"
                      : "Switch to dark mode"
                  }
                >
                  {theme === "dark" ? (
                    <>
                      <Sun className="h-4 w-4" />
                      Light Mode
                    </>
                  ) : (
                    <>
                      <Moon className="h-4 w-4" />
                      Dark Mode
                    </>
                  )}
                </button>
              )}

              {/* Language */}

              <button
                type="button"
                onClick={changeLanguage}
                className="
                  flex
                  flex-1
                  items-center
                  justify-center
                  gap-2
                  rounded-lg
                  bg-accent
                  px-4
                  py-2
                  text-sm
                  font-medium
                  text-foreground
                  transition-colors
                  hover:bg-accent/80
                "
              >
                <Globe className="h-4 w-4" />

                {language === "en"
                  ? t("common.english")
                  : t("common.indonesian")}
              </button>

            </div>
          </div>
        </div>
      )}
    </nav>
  );
}