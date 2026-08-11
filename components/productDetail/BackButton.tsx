"use client";

import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

interface BackButtonProps {
  lang: string;
}

export default function BackButton({ lang }: BackButtonProps) {
  const router = useRouter();

  const currentLanguage = lang === "en" ? "en" : "id";

  function handleBack() {
    router.push(`/products?lang=${currentLanguage}`);
  }

  return (
    <button
      type="button"
      onClick={handleBack}
      className="
        mb-8
        inline-flex
        items-center
        gap-2
        rounded-lg
        border
        border-border
        px-4
        py-2.5
        text-sm
        font-medium
        text-foreground
        transition
        hover:border-primary
        hover:bg-primary
        hover:text-white
      "
    >
      <ArrowLeft className="h-4 w-4" />

      {currentLanguage === "en" ? "Back to Products" : "Kembali ke Produk"}
    </button>
  );
}