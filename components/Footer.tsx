"use client";

import Link from "next/link";
import { Mail, Phone, MapPin } from "lucide-react";
import Image from "next/image";
import { useTheme } from "@/hooks/useTheme";

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const { theme, toggleTheme, mounted } = useTheme();

  return (
    <footer className="bg-card border-t border-border mt-auto">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <Image
              src={theme === "dark" ? "/logo-white.png" : "/logo-black.png"}
              alt="BOELEDIN"
              width={70}
              height={70}
              className="
                          h-4
                          sm:h-4
                          md:h-5
                          lg:h-6
                          xl:h-7
                          mb-3
                          w-auto
                          transition-all
                        "
            />
            <p className="text-sm text-muted-foreground leading-relaxed mb-4">
              Jaminan Kualitas Terbaik untuk semua produk dan layanan kami.
            </p>
            <div className="flex gap-3">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg bg-accent hover:bg-primary hover:text-primary-foreground transition-colors"
                aria-label="Facebook"
              >
                <span className="text-sm font-bold">f</span>
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg bg-accent hover:bg-primary hover:text-primary-foreground transition-colors"
                aria-label="Twitter"
              >
                <span className="text-sm font-bold">𝕏</span>
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg bg-accent hover:bg-primary hover:text-primary-foreground transition-colors"
                aria-label="Instagram"
              >
                <span className="text-sm font-bold">📷</span>
              </a>
              {/* <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg bg-accent hover:bg-primary hover:text-primary-foreground transition-colors"
                aria-label="LinkedIn"
              >
                <span className="text-sm font-bold">in</span>
              </a> */}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4">Navigasi</h4>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href="/products"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  Products
                </Link>
              </li>
              <li>
                <Link
                  href="/news"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  News
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Products */}
          <div>
            <h4 className="font-semibold mb-4">Layanan</h4>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/products?category=electronics"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  Digital Signage & FIDS
                </Link>
              </li>
              <li>
                <Link
                  href="/products?category=accessories"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  Smart Command Center
                </Link>
              </li>
              <li>
                <Link
                  href="/products?category=home"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  Pengalaman Immersive
                </Link>
              </li>
              <li>
                <Link
                  href="/products?category=fashion"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  Integrasi IT & Software
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-semibold mb-4">Contact Us</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-2 text-sm text-muted-foreground">
                <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <span>
                  Rukan Exclusive, Jl. Bukit Golf Mediterania, Pantai Indah
                  Kapuk No.1A Blok G, RT.7/RW.2, Kamal Muara, Penjaringan,
                  Jakarta Utara, DKI Jakarta 14470
                </span>
              </li>
              <li className="flex items-center gap-2 text-sm text-muted-foreground">
                <Phone className="w-4 h-4 flex-shrink-0" />
                <a
                  href="tel:+6281319060606"
                  className="hover:text-primary transition-colors"
                >
                  +62 813-1906-0606
                </a>
              </li>
              <li className="flex items-center gap-2 text-sm text-muted-foreground">
                <Mail className="w-4 h-4 flex-shrink-0" />
                <a
                  href="mailto:info@boeledin.com"
                  className="hover:text-primary transition-colors"
                >
                  info@boeledin.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-border">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-muted-foreground text-center md:text-left">
              &copy; {currentYear} BOELEDIN. All rights reserved.
            </p>
            {/* <div className="flex gap-6">
              <Link
                href="/privacy"
                className="text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                Privacy Policy
              </Link>
              <Link
                href="/terms"
                className="text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                Terms of Service
              </Link>
            </div> */}
          </div>
        </div>
      </div>
    </footer>
  );
}
