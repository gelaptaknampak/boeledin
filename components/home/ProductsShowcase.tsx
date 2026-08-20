"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "@/hooks/useTranslation";

type Props = {
  data: any;
};

const WORDPRESS_URL = "https://wp.boeledin.com";

export default function ProductsShowcase({ data }: Props) {
  const { language } = useTranslation();

  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  /*
   * =========================================================
   * HEADER DATA
   * =========================================================
   */

  const eyebrow =
    data?.product_eyebrow ??
    data?.eyebrow ??
    "";

  const title =
    data?.product_title ??
    data?.title ??
    "";

  const description =
    data?.product_description ??
    data?.description ??
    "";

  /*
   * =========================================================
   * RAW PRODUCT IDS FROM CMS
   * =========================================================
   *
   * page.tsx meneruskan data.products = array ID
   * yang berasal dari ACF field product_showcase_products.
   */

  const rawProducts = useMemo(() => {
    return (
      data?.products ??
      data?.selected_products ??
      data?.product_showcase_products ??
      data?.acf?.products ??
      data?.acf?.selected_products ??
      data?.acf?.product_showcase_products ??
      []
    );
  }, [data]);

  /*
   * =========================================================
   * NORMALIZE PRODUCT IDS
   * =========================================================
   */

  const selectedProductIds = useMemo(() => {
    if (
      rawProducts === null ||
      rawProducts === undefined ||
      rawProducts === ""
    ) {
      return [];
    }

    const normalizeId = (item: any): number | null => {
      if (typeof item === "number") {
        return item > 0 ? item : null;
      }

      if (typeof item === "string") {
        const trimmed = item.trim();

        if (!trimmed) {
          return null;
        }

        const id = Number(trimmed);

        return Number.isFinite(id) && id > 0 ? id : null;
      }

      if (item && typeof item === "object") {
        const possibleId =
          item.id ??
          item.ID ??
          item.value ??
          item.post_id ??
          item.postId;

        const id = Number(possibleId);

        if (Number.isFinite(id) && id > 0) {
          return id;
        }

        if (item.post && typeof item.post === "object") {
          const nestedId = Number(item.post.id ?? item.post.ID);

          if (Number.isFinite(nestedId) && nestedId > 0) {
            return nestedId;
          }
        }
      }

      return null;
    };

    if (Array.isArray(rawProducts)) {
      return rawProducts
        .map(normalizeId)
        .filter((id): id is number => id !== null);
    }

    const id = normalizeId(rawProducts);

    return id !== null ? [id] : [];
  }, [rawProducts]);

  /*
   * =========================================================
   * RESOLVE FEATURE IMAGE
   * =========================================================
   *
   * acf.feature_image tersimpan sebagai attachment ID
   * (textarea, ID per baris/koma) karena ACF yang dipakai
   * bukan versi Pro (tidak ada Gallery field).
   *
   * Resolve ID -> URL lewat endpoint media bawaan WordPress.
   */

  async function resolveFeatureImages(product: any): Promise<string[]> {
    const ids = String(product?.acf?.feature_image ?? "")
      .split(/[\n,]+/)
      .map((id: string) => id.trim())
      .filter(Boolean);

    if (ids.length === 0) {
      return [];
    }

    const urls = await Promise.all(
      ids.map(async (id: string) => {
        try {
          const res = await fetch(
            `${WORDPRESS_URL}/wp-json/wp/v2/media/${id}`,
            { cache: "no-store" }
          );

          if (!res.ok) {
            return null;
          }

          const media = await res.json();

          return media?.source_url ?? null;
        } catch {
          return null;
        }
      })
    );

    return urls.filter(Boolean) as string[];
  }

  /*
   * =========================================================
   * FETCH SELECTED PRODUCTS
   * =========================================================
   */

  useEffect(() => {
    let cancelled = false;

    async function fetchSelectedProducts() {
      if (selectedProductIds.length === 0) {
        if (!cancelled) {
          setProducts([]);
          setLoading(false);
        }

        return;
      }

      try {
        if (!cancelled) {
          setLoading(true);
        }

        const include = selectedProductIds.join(",");

        const url =
          `/api/wordpress/products` +
          `?lang=${encodeURIComponent(language)}` +
          `&include=${encodeURIComponent(include)}`;

        const res = await fetch(url, { cache: "no-store" });

        if (!res.ok) {
          const errorText = await res.text();

          console.error("PRODUCT SHOWCASE API ERROR:", errorText);

          throw new Error(`Gagal mengambil produk (${res.status})`);
        }

        const result = await res.json();

        if (!Array.isArray(result)) {
          console.error(
            "PRODUCT SHOWCASE: RESULT BUKAN ARRAY:",
            result
          );

          if (!cancelled) {
            setProducts([]);
          }

          return;
        }

        /*
         * Susun ulang sesuai urutan yang dipilih di CMS.
         */

        const orderedProducts = selectedProductIds
          .map((selectedId) =>
            result.find(
              (product: any) => Number(product?.id) === Number(selectedId)
            )
          )
          .filter(Boolean);

        if (orderedProducts.length !== selectedProductIds.length) {
          const foundIds = orderedProducts.map((product: any) =>
            Number(product.id)
          );

          const missingIds = selectedProductIds.filter(
            (id) => !foundIds.includes(Number(id))
          );

          console.warn("PRODUCT SHOWCASE: ID TIDAK DITEMUKAN:", missingIds);
        }

        /*
         * Resolve gambar untuk tiap produk.
         */

        const productsWithGallery = await Promise.all(
          orderedProducts.map(async (product: any) => {
            const gallery = await resolveFeatureImages(product);

            return {
              ...product,
              gallery,
            };
          })
        );

        if (!cancelled) {
          setProducts(productsWithGallery);
        }
      } catch (error) {
        console.error("PRODUCT SHOWCASE ERROR:", error);

        if (!cancelled) {
          setProducts([]);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    fetchSelectedProducts();

    return () => {
      cancelled = true;
    };
  }, [language, selectedProductIds]);

  /*
   * =========================================================
   * BRAND / CATEGORY
   * =========================================================
   *
   * boeledin/v1/products mengembalikan brand & jenis_produk
   * sebagai object top-level, bukan lewat _embedded["wp:term"].
   */

  function getBrandName(product: any) {
    return product?.brand?.name ?? "-";
  }

  function getCategoryName(product: any) {
    return product?.jenis_produk?.name ?? "-";
  }

  /*
   * =========================================================
   * LOADING
   * =========================================================
   */

  if (loading) {
    return (
      <section className="bg-accent/5 py-14 sm:py-20 md:py-28">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">

          <div className="mx-auto mb-10 max-w-4xl text-center sm:mb-14 md:mb-16">

            {eyebrow && (
              <div className="mb-4 inline-flex rounded-full bg-accent px-3 py-2 text-xs font-semibold text-primary sm:px-4 sm:text-sm">
                {eyebrow}
              </div>
            )}

            {title && (
              <h2
                className="
                  mb-4
                  text-3xl
                  font-bold
                  leading-tight
                  sm:text-4xl
                  md:mb-6
                  md:text-5xl
                "
              >
                {title}
              </h2>
            )}

            {description && (
              <p
                className="
                  mx-auto
                  max-w-3xl
                  text-sm
                  text-muted-foreground
                  sm:text-base
                  md:text-lg
                "
              >
                {description}
              </p>
            )}

          </div>

          <div className="py-10 text-center text-muted-foreground">
            Memuat produk...
          </div>

        </div>
      </section>
    );
  }

  /*
   * =========================================================
   * RENDER
   * =========================================================
   */

  return (
    <section className="bg-accent/5 py-14 sm:py-20 md:py-28">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">

        {/* HEADER */}

        <div className="mx-auto mb-10 max-w-4xl text-center sm:mb-14 md:mb-16">

          {eyebrow && (
            <div className="mb-4 inline-flex rounded-full bg-accent px-3 py-2 text-xs font-semibold text-primary sm:px-4 sm:text-sm">
              {eyebrow}
            </div>
          )}

          {title && (
            <h2
              className="
                mb-4
                text-3xl
                font-bold
                leading-tight
                sm:text-4xl
                md:mb-6
                md:text-5xl
              "
            >
              {title}
            </h2>
          )}

          {description && (
            <p
              className="
                mx-auto
                max-w-3xl
                text-sm
                text-muted-foreground
                sm:text-base
                md:text-lg
              "
            >
              {description}
            </p>
          )}

        </div>

        {/* NO PRODUCT SELECTED */}

        {selectedProductIds.length === 0 && (
          <div className="rounded-xl border border-border bg-card px-6 py-12 text-center">
            <p className="text-muted-foreground">
              Belum ada produk yang dipilih untuk ditampilkan.
            </p>
          </div>
        )}

        {/* PRODUCT NOT FOUND */}

        {selectedProductIds.length > 0 && products.length === 0 && (
          <div className="rounded-xl border border-border bg-card px-6 py-12 text-center">
            <p className="text-muted-foreground">
              Produk yang dipilih tidak ditemukan.
            </p>
          </div>
        )}

        {/* PRODUCT GRID */}

        {products.length > 0 && (
          <div
            className="
              grid
              grid-cols-1
              gap-5
              sm:grid-cols-2
              sm:gap-6
              lg:grid-cols-3
              lg:gap-8
            "
          >
            {products.map((product: any) => {

              const image = product?.gallery?.[0] ?? "/placeholder.png";

              const productTitle =
                product?.title ??
                product?.acf?.nama_produk ??
                "Untitled Product";

              const model = product?.acf?.model_produk ?? "";

              const productDescription =
                product?.acf?.short_description ?? "";

              const specification = product?.acf?.spesifikasi ?? "";

              return (
                <div
                  key={product.id}
                  className="
                    group
                    flex
                    flex-col
                    overflow-hidden
                    rounded-xl
                    border
                    border-border
                    bg-card
                    transition-all
                    duration-300
                    hover:border-primary
                  "
                >

                  {/* IMAGE */}

                  <div
                    className="
                      relative
                      aspect-[4/3]
                      overflow-hidden
                      sm:aspect-[5/4]
                    "
                  >
                    <Image
                      src={image}
                      alt={productTitle}
                      fill
                      className="
                        object-cover
                        transition-transform
                        duration-500
                        group-hover:scale-105
                      "
                      sizes="
                        (max-width:640px) 100vw,
                        (max-width:1024px) 50vw,
                        33vw
                      "
                      unoptimized
                    />

                    <div
                      className="
                        absolute
                        inset-0
                        bg-black/10
                        transition
                        group-hover:bg-black/25
                      "
                    />

                    {/* BRAND + CATEGORY */}

                    <span
                      className="
                        absolute
                        left-3
                        right-3
                        top-3
                        w-fit
                        max-w-[90%]
                        truncate
                        rounded-full
                        bg-primary
                        px-3
                        py-1.5
                        text-[11px]
                        font-semibold
                        text-primary-foreground
                        sm:text-xs
                      "
                    >
                      {getBrandName(product)}

                      {" · "}

                      {getCategoryName(product)}
                    </span>
                  </div>

                  {/* BODY */}

                  <div
                    className="
                      flex
                      flex-1
                      flex-col
                      p-4
                      sm:p-5
                      lg:p-6
                    "
                  >

                    {/* MODEL */}

                    {model && (
                      <span
                        className="
                          text-[11px]
                          font-semibold
                          uppercase
                          tracking-wider
                          text-primary
                          sm:text-xs
                        "
                      >
                        {model}
                      </span>
                    )}

                    {/* TITLE */}

                    <h3
                      className="
                        mb-3
                        mt-2
                        line-clamp-2
                        text-base
                        font-bold
                        sm:text-lg
                      "
                    >
                      {productTitle}
                    </h3>

                    {/* DESCRIPTION */}

                    {productDescription && (
                      <p
                        className="
                          mb-5
                          min-h-[60px]
                          line-clamp-3
                          text-xs
                          text-muted-foreground
                          sm:text-sm
                        "
                      >
                        {productDescription}
                      </p>
                    )}

                    {/* SPECIFICATION */}

                    {specification && (
                      <div
                        className="
                          prose
                          prose-sm
                          mb-5
                          max-w-none
                          border-b
                          border-border
                          pb-5
                          text-xs
                          sm:text-sm
                          prose-li:break-words
                          prose-li:before:hidden
                          prose-ul:space-y-1
                        "
                        dangerouslySetInnerHTML={{
                          __html: specification,
                        }}
                      />
                    )}

                    {/* BUTTON */}

                    <Link
                      href={`/products/${product.slug}?lang=${language}`}
                      className="
                        mt-auto
                        block
                        w-full
                        rounded-lg
                        border
                        border-primary
                        px-4
                        py-2.5
                        text-center
                        text-sm
                        font-semibold
                        text-primary
                        transition-colors
                        hover:bg-primary
                        hover:text-primary-foreground
                        sm:text-base
                      "
                    >
                      {language === "en" ? "Product Detail" : "Detail Produk"}
                    </Link>

                  </div>
                </div>
              );
            })}
          </div>
        )}

      </div>
    </section>
  );
}