"use client";

import Link from "next/link";
import { useTranslation } from "@/hooks/useTranslation";

export default function ProductCTA() {
  const { t } = useTranslation();

  return (
    <section className="mt-16 rounded-2xl bg-primary p-8 text-white">
      <div className="flex flex-col items-center justify-between gap-6 text-center md:flex-row md:text-left">

        <div>
          <h2 className="mb-4 text-3xl font-bold">
            {t("product_cta.title")}
          </h2>

          <p className="mb-0 opacity-90">
            {t("product_cta.description")}
          </p>
        </div>

        <Link
          href="/contact"
          className="rounded-xl bg-white px-8 py-3 font-semibold text-primary transition hover:bg-gray-100"
        >
          {t("product_cta.button")}
        </Link>

      </div>
    </section>
  );
}