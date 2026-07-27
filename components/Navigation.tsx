"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X, Search, Globe } from "lucide-react";
import { usePathname } from "next/navigation";
import { useTranslation } from "@/hooks/useTranslation";

export default function Navigation() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { t, language, toggleLanguage } = useTranslation();
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
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="text-2xl font-bold text-primary">
            BOELEDIN
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
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
          <div className="flex items-center gap-2 md:gap-4">
            <Link
              href="/admin/login"
              className="hidden md:inline-flex px-4 py-2 text-sm font-medium bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
            >
              {t("nav.admin")}
            </Link>

            <button
              onClick={toggleLanguage}
              className="p-2 rounded-lg hover:bg-accent transition-colors flex items-center gap-2"
              aria-label={t("common.language")}
              title={t("common.language")}
            >
              <Globe className="w-5 h-5" />
              <span className="text-sm font-medium hidden md:inline">
                {language === "en" ? "EN" : "ID"}
              </span>
            </button>

            <button
              className="p-2 rounded-lg hover:bg-accent transition-colors"
              aria-label="Search"
            >
              <Search className="w-5 h-5" />
            </button>

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
              <Link
                href="/admin/login"
                onClick={() => setMobileMenuOpen(false)}
                className="text-sm font-medium bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors"
              >
                {t("nav.adminLogin")}
              </Link>
              <button
                onClick={toggleLanguage}
                className="text-sm font-medium bg-accent text-foreground px-4 py-2 rounded-lg hover:bg-accent/80 transition-colors flex items-center gap-2 justify-center"
              >
                <Globe className="w-4 h-4" />
                {language === "en"
                  ? t("common.english")
                  : t("common.indonesian")}
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
