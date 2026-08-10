"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useTranslation } from "@/hooks/useTranslation";

interface Props {
  product: any;
}

export default function ProductInfo({ product }: Props) {
  const { language } = useTranslation();

  const currentLanguage =
    language === "en"
      ? "en"
      : "id";

  const [brandData, setBrandData] =
    useState<any>(null);

  const [loadingBrand, setLoadingBrand] =
    useState(true);

  /*
   * =================================================
   * GET BRAND TERM
   * =================================================
   */

  const brandTerm =
    product._embedded?.["wp:term"]
      ?.flat()
      ?.find(
        (term: any) =>
          term.taxonomy === "brand"
      );

  const brand =
    brandTerm?.name ?? "-";

  const brandId =
    brandTerm?.id ?? null;

  /*
   * =================================================
   * FETCH BRAND
   * =================================================
   */

  useEffect(() => {
    async function fetchBrand() {
      if (!brandId) {
        setBrandData(null);
        setLoadingBrand(false);
        return;
      }

      try {
        setLoadingBrand(true);

        const res = await fetch(
          `/api/wordpress/brands?lang=${currentLanguage}&_=${Date.now()}`,
          {
            cache: "no-store",
          }
        );

        if (!res.ok) {
          throw new Error(
            "Gagal mengambil data brand"
          );
        }

        const data = await res.json();

        const brands =
          Array.isArray(data)
            ? data
            : [];

        /*
         * Cari brand berdasarkan ID
         */
        const matchedBrand =
          brands.find(
            (item: any) =>
              Number(item.id) ===
              Number(brandId)
          );

        console.log(
          "PRODUCT BRAND:",
          brandTerm
        );

        console.log(
          "BRAND DATA:",
          matchedBrand
        );

        setBrandData(
          matchedBrand ?? null
        );

      } catch (error) {
        console.error(
          "Failed loading brand:",
          error
        );

        setBrandData(null);

      } finally {
        setLoadingBrand(false);
      }
    }

    fetchBrand();

  }, [
    brandId,
    currentLanguage,
  ]);

  /*
   * =================================================
   * BRAND LOGO
   * =================================================
   */

  const brandLogo =
    brandData?.acf?.brand_logo_url ??
    "";

  return (
    <section className="space-y-8">

      {/* =========================================
          BRAND
          ========================================= */}

      <div className="flex items-center gap-3">
  <p
    className="
      text-sm
      font-bold
      uppercase
      tracking-widest
      text-primary
    "
  >
    {brand}
  </p>

  {!loadingBrand && brandLogo && (
    <div
      className="
        relative
        flex
        h-10
        w-20
        items-center
        justify-center
        overflow-hidden
      "
    >
      <Image
        src={brandLogo}
        alt={brand}
        fill
        sizes="80px"
        className="object-contain"
      />
    </div>
  )}
</div>


      {/* =========================================
          PRODUCT NAME
          ========================================= */}

      <h1
        className="
          mt-2
          text-4xl
          font-bold
        "
      >
        {product.acf?.nama_produk}
      </h1>


      {/* =========================================
          MODEL
          ========================================= */}

      {product.acf?.model_produk && (
        <p
          className="
            mt-2
            text-lg
            text-muted-foreground
          "
        >
          Model :{" "}
          {product.acf.model_produk}
        </p>
      )}


      {/* =========================================
          DESCRIPTION
          ========================================= */}

      {product.acf?.description && (
        <div
          className="
            text-muted-foreground
            leading-8
            whitespace-pre-line
          "
        >
          {product.acf.description}
        </div>
      )}


      {/* =========================================
          BROCHURE
          ========================================= */}

      {product.brochureUrl && (
        <a
          href={product.brochureUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="
            inline-flex
            items-center
            rounded-xl
            bg-primary
            px-6
            py-3
            font-semibold
            text-white
            transition
            hover:opacity-90
          "
        >
          Download Brosur
        </a>
      )}

    </section>
  );
}