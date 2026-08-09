export const translations = {
  en: {
    nav: {
      products: "Products",
      news: "News",
      about: "About Us",
      contact: "Contact Us",
      admin: "Admin",
      adminLogin: "Admin Login",
      cta: "Free Consultation",
    },

    product_cta: {
      title: "Need More Information?",
      description:
        "Contact our team to get the best display solution for your business.",
      button: "Contact Us",
    },
  },

  id: {
    nav: {
      products: "Produk",
      news: "Berita",
      about: "Tentang Kami",
      contact: "Hubungi Kami",
      admin: "Admin",
      adminLogin: "Login Admin",
      cta: "Konsultasi Gratis",
    },

    product_cta: {
      title: "Butuh Informasi Lebih Lanjut?",
      description:
        "Hubungi tim kami untuk mendapatkan solusi display terbaik untuk bisnis Anda.",
      button: "Hubungi Kami",
    },
  },
};

export type Language = "en" | "id";

export function getTranslation(
  lang: Language,
  path: string
): string {
  const keys = path.split(".");
  let value: any = translations[lang];

  for (const key of keys) {
    if (
      value &&
      typeof value === "object" &&
      key in value
    ) {
      value = value[key];
    } else {
      return path;
    }
  }

  return typeof value === "string"
    ? value
    : path;
}