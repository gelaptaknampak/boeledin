"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { Menu, X, Globe, Moon, Sun } from "lucide-react";
import { usePathname } from "next/navigation";
import { useTranslation } from "@/hooks/useTranslation";
import { useTheme } from "@/hooks/useTheme";
import ProductSearch from "./ProductSearch";

export default function Navigation() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { t, language, toggleLanguage } = useTranslation();
  const { theme, toggleTheme, mounted } = useTheme();
  const pathname = usePathname();

  const navLinks = [
    // { href: '/', label: t('nav.home') },
    { href: "/about", label: t("nav.about") },
    { href: "/products", label: t("nav.products") },
    { href: "/news", label: t("nav.news") },
    { href: "/contact", label: t("nav.contact") },
  ];

  const isActive = (path: string) => pathname === path;

  return (
    <nav className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
      <div className="container mx-auto px-5 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <Image
              src={theme === "dark" ? "/logo-white.png" : "/logo-black.png"}
              alt="BOELEDIN"
              width={110}
              height={55}
              className="
              h-5
              sm:h-6
              md:h-8
              lg:h-9
              xl:h-10
              w-auto
              transition-all
            "
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6 lg:gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  isActive(link.href) ? "text-primary" : "text-muted-foreground"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right Actions */}
          <div
            className="flex items-center gap-1.5
sm:gap-2
lg:gap-3"
          >
            {mounted && (
              <button
                onClick={toggleTheme}
                className="p-2 rounded-lg hover:bg-accent transition-colors"
                aria-label="Toggle theme"
                title={
                  theme === "dark"
                    ? "Switch to light mode"
                    : "Switch to dark mode"
                }
              >
                {theme === "dark" ? (
                  <Sun className="w-5 h-5" />
                ) : (
                  <Moon className="w-5 h-5" />
                )}
              </button>
            )}

            <button
              onClick={toggleLanguage}
              className="p-2 rounded-lg hover:bg-accent transition-colors flex items-center gap-2"
              aria-label={t("common.language")}
              title={t("common.language")}
            >
              {/* <Globe className="w-5 h-5" /> */}
              <span className="text-sm font-medium md:inline">
                {language === "en" ? "EN" : "ID"}
              </span>
            </button>

            <ProductSearch />

            {/* Mobile Menu Toggle */}
            <button
              className="md:hidden p-2 rounded-lg hover:bg-accent transition-colors"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-border">
            <div className="flex flex-col gap-4">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`text-sm font-medium transition-colors hover:text-primary px-4 py-2 rounded-lg ${
                    isActive(link.href)
                      ? "text-primary bg-accent"
                      : "text-muted-foreground"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              <div className="flex gap-2 px-4 py-2">
                {mounted && (
                  <button
                    onClick={toggleTheme}
                    className="flex-1 text-sm font-medium bg-accent text-foreground px-4 py-2 rounded-lg hover:bg-accent/80 transition-colors flex items-center gap-2 justify-center"
                    title={
                      theme === "dark"
                        ? "Switch to light mode"
                        : "Switch to dark mode"
                    }
                  >
                    {theme === "dark" ? (
                      <>
                        <Sun className="w-4 h-4" />
                        Light Mode
                      </>
                    ) : (
                      <>
                        <Moon className="w-4 h-4" />
                        Dark Mode
                      </>
                    )}
                  </button>
                )}
                <button
                  onClick={toggleLanguage}
                  className="flex-1 text-sm font-medium bg-accent text-foreground px-4 py-2 rounded-lg hover:bg-accent/80 transition-colors flex items-center gap-2 justify-center"
                >
                  <Globe className="w-4 h-4" />
                  {language === "en"
                    ? t("common.english")
                    : t("common.indonesian")}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
