"use client";

import Link from "next/link";
import { useTranslation } from "@/hooks/useTranslation";

export default function ProductCTA() {
  const { t } = useTranslation();

  return (
    <section className="mt-16 rounded-2xl border border-white/10 bg-[#0a0e1a] p-8 text-white">
      <div className="flex flex-col items-center justify-between gap-6 text-center md:flex-row md:text-left">

        <div>
          <h2 className="mb-4 text-3xl font-bold">
            {t("product_cta.title")}
          </h2>

          <p className="mb-0 text-gray-400">
            {t("product_cta.description")}
          </p>
        </div>

        <Link
          href="/contact"
          className="rounded-xl border border-white px-8 py-3 font-semibold text-white transition hover:bg-white hover:text-black"
        >
          {t("product_cta.button")}
        </Link>

      </div>
    </section>
  );
}