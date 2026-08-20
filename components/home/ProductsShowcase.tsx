"use client";

import Link from "next/link";
import { useTranslation } from "@/hooks/useTranslation";
import { useEffect, useMemo, useState } from "react";
import Image from "next/image";

type Props = {
  data: any;
};

export default function ProductsShowcase({ data }: Props) {
  const { language } = useTranslation();

  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [brandFilter, setBrandFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const [brands, setBrands] = useState<any[]>([]);
  const [productTypes, setProductTypes] = useState<any[]>([]);

  /*
   * =========================================================
   * SELECTED PRODUCT IDS
   * =========================================================
   *
   * ACF Post Object -> Return Format: Post ID
   *
   * Example:
   * data.products = [123, 456, 789]
   *
   */

  const selectedProductIds = useMemo(() => {
    const value = data?.products;

    if (!value) {
      return [];
    }

    if (Array.isArray(value)) {
      return value
        .map((item) => {
          if (typeof item === "number") {
            return item;
          }

          if (typeof item === "string") {
            const id = Number(item);
            return Number.isNaN(id) ? null : id;
          }

          // Fallback jika ACF ternyata mengembalikan object
          if (item && typeof item === "object") {
            return Number(item.id);
          }

          return null;
        })
        .filter(
          (id): id is number =>
            typeof id === "number" &&
            !Number.isNaN(id) &&
            id > 0
        );
    }

    if (typeof value === "number") {
      return [value];
    }

    if (typeof value === "string") {
      const id = Number(value);

      return Number.isNaN(id) ? [] : [id];
    }

    return [];
  }, [data?.products]);

  /*
   * =========================================================
   * FETCH DATA
   * =========================================================
   */

  useEffect(() => {
    fetchSelectedProducts();
    fetchBrands();
    fetchProductTypes();
  }, [language, selectedProductIds]);

  /*
   * =========================================================
   * FETCH SELECTED PRODUCTS
   * =========================================================
   */

  async function fetchSelectedProducts() {
    try {
      setLoading(true);

      /*
       * Tidak ada produk yang dipilih admin
       */
      if (selectedProductIds.length === 0) {
        setProducts([]);
        return;
      }

      /*
       * WordPress REST API:
       *
       * ?include=123,456,789
       *
       * Hanya mengambil product yang dipilih.
       */

      const include = selectedProductIds.join(",");

      const res = await fetch(
        `https://wp.boeledin.com/wp-json/wp/v2/products?_embed&include=${include}&per_page=100&lang=${language}`,
        {
          cache: "no-store",
        }
      );

      if (!res.ok) {
        throw new Error(
          "Gagal mengambil produk yang dipilih"
        );
      }

      const result = await res.json();

      /*
       * WordPress kadang tidak menjamin urutan
       * berdasarkan include.
       *
       * Jadi kita susun kembali sesuai urutan
       * pilihan admin di ACF.
       */

      const orderedProducts = selectedProductIds
        .map((id) =>
          result.find(
            (product: any) =>
              Number(product.id) === Number(id)
          )
        )
        .filter(Boolean);

      setProducts(orderedProducts);
    } catch (error) {
      console.error(
        "FETCH SELECTED PRODUCTS ERROR:",
        error
      );

      setProducts([]);
    } finally {
      setLoading(false);
    }
  }

  /*
   * =========================================================
   * FETCH BRANDS
   * =========================================================
   */

  async function fetchBrands() {
    try {
      const res = await fetch(
        `/api/wordpress/brands?lang=${language}`,
        {
          cache: "no-store",
        }
      );

      if (!res.ok) {
        setBrands([]);
        return;
      }

      const result = await res.json();

      setBrands(
        Array.isArray(result)
          ? result
          : []
      );
    } catch (error) {
      console.error(
        "FETCH BRANDS ERROR:",
        error
      );

      setBrands([]);
    }
  }

  /*
   * =========================================================
   * FETCH PRODUCT TYPES
   * =========================================================
   */

  async function fetchProductTypes() {
    try {
      const res = await fetch(
        `/api/wordpress/product-types?lang=${language}`,
        {
          cache: "no-store",
        }
      );

      if (!res.ok) {
        setProductTypes([]);
        return;
      }

      const result = await res.json();

      setProductTypes(
        Array.isArray(result)
          ? result
          : []
      );
    } catch (error) {
      console.error(
        "FETCH PRODUCT TYPES ERROR:",
        error
      );

      setProductTypes([]);
    }
  }

  /*
   * =========================================================
   * GET BRAND
   * =========================================================
   */

  function getBrand(product: any) {
    return (
      product?._embedded?.["wp:term"]
        ?.flat()
        ?.find(
          (term: any) =>
            term.taxonomy === "brand"
        )?.slug ?? ""
    );
  }

  /*
   * =========================================================
   * GET BRAND NAME
   * =========================================================
   */

  function getBrandName(product: any) {
    return (
      product?._embedded?.["wp:term"]
        ?.flat()
        ?.find(
          (term: any) =>
            term.taxonomy === "brand"
        )?.name ?? "-"
    );
  }

  /*
   * =========================================================
   * GET CATEGORY
   * =========================================================
   */

  function getCategory(product: any) {
    return (
      product?._embedded?.["wp:term"]
        ?.flat()
        ?.find(
          (term: any) =>
            term.taxonomy ===
            "jenis-produk"
        )?.slug ?? ""
    );
  }

  /*
   * =========================================================
   * GET CATEGORY NAME
   * =========================================================
   */

  function getCategoryName(product: any) {
    return (
      product?._embedded?.["wp:term"]
        ?.flat()
        ?.find(
          (term: any) =>
            term.taxonomy ===
            "jenis-produk"
        )?.name ?? "-"
    );
  }

  /*
   * =========================================================
   * FILTER PRODUCTS
   * =========================================================
   */

  const filteredProducts = useMemo(() => {
    return products.filter(
      (product) => {
        const brand =
          getBrand(product);

        const category =
          getCategory(product);

        const brandMatch =
          brandFilter === "all" ||
          brand === brandFilter;

        const categoryMatch =
          categoryFilter === "all" ||
          category === categoryFilter;

        const title =
          product?.title?.rendered ??
          "";

        const model =
          product?.acf?.model_produk ??
          "";

        const search =
          searchQuery
            .toLowerCase()
            .trim();

        const searchMatch =
          search === "" ||
          title
            .toLowerCase()
            .includes(search) ||
          model
            .toLowerCase()
            .includes(search);

        return (
          brandMatch &&
          categoryMatch &&
          searchMatch
        );
      }
    );
  }, [
    products,
    brandFilter,
    categoryFilter,
    searchQuery,
  ]);

  /*
   * =========================================================
   * LOADING
   * =========================================================
   */

  if (loading) {
    return (
      <section className="py-20 text-center">
        Memuat produk...
      </section>
    );
  }

  /*
   * =========================================================
   * EMPTY STATE
   * =========================================================
   */

  if (
    selectedProductIds.length === 0
  ) {
    return (
      <section className="bg-accent/5 py-14 sm:py-20 md:py-28">
        <div className="container mx-auto px-4 text-center sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl">
            <div className="mb-4 inline-flex rounded-full bg-accent px-4 py-2 text-sm font-semibold text-primary">
              {data?.product_eyebrow ?? ""}
            </div>

            <h2 className="mb-4 text-3xl font-bold sm:text-4xl md:text-5xl">
              {data?.product_title ?? ""}
            </h2>

            <p className="text-muted-foreground">
              {data?.product_description ?? ""}
            </p>
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

        {/* =================================================
            HEADER
        ================================================= */}

        <div className="mb-10 max-w-4xl sm:mb-14 md:mb-16">

          {data?.product_eyebrow && (
            <div className="mb-4 inline-flex rounded-full bg-accent px-3 py-2 text-xs font-semibold text-primary sm:px-4 sm:text-sm">
              {data.product_eyebrow}
            </div>
          )}

          {data?.product_title && (
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
              {data.product_title}
            </h2>
          )}

          {data?.product_description && (
            <p
              className="
                max-w-3xl
                text-sm
                text-muted-foreground
                sm:text-base
                md:text-lg
              "
            >
              {data.product_description}
            </p>
          )}
        </div>

        {/* =================================================
            FILTERS
        ================================================= */}

        <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-3">

          {/* Search */}

          <div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) =>
                setSearchQuery(
                  e.target.value
                )
              }
              placeholder="Cari produk..."
              className="
                w-full
                rounded-lg
                border
                border-border
                bg-white
                px-4
                py-3
                text-sm
                text-black
                outline-none
                transition
                focus:border-primary
              "
            />
          </div>

          {/* Brand */}

          <div>
            <select
              value={brandFilter}
              onChange={(e) =>
                setBrandFilter(
                  e.target.value
                )
              }
              className="
                w-full
                rounded-lg
                border
                border-border
                bg-white
                px-4
                py-3
                text-sm
                text-black
                outline-none
                focus:border-primary
              "
            >
              <option value="all">
                Semua Brand
              </option>

              {brands.map(
                (brand: any) => (
                  <option
                    key={
                      brand.id ??
                      brand.slug
                    }
                    value={
                      brand.slug
                    }
                  >
                    {brand.name}
                  </option>
                )
              )}
            </select>
          </div>

          {/* Product Type */}

          <div>
            <select
              value={categoryFilter}
              onChange={(e) =>
                setCategoryFilter(
                  e.target.value
                )
              }
              className="
                w-full
                rounded-lg
                border
                border-border
                bg-white
                px-4
                py-3
                text-sm
                text-black
                outline-none
                focus:border-primary
              "
            >
              <option value="all">
                Semua Jenis Produk
              </option>

              {productTypes.map(
                (type: any) => (
                  <option
                    key={
                      type.id ??
                      type.slug
                    }
                    value={
                      type.slug
                    }
                  >
                    {type.name}
                  </option>
                )
              )}
            </select>
          </div>
        </div>

        {/* =================================================
            PRODUCT GRID
        ================================================= */}

        {filteredProducts.length ===
        0 ? (
          <div className="rounded-xl border border-border bg-card px-6 py-12 text-center">
            <p className="text-muted-foreground">
              Tidak ada produk yang
              sesuai dengan filter.
            </p>
          </div>
        ) : (
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
            {filteredProducts.map(
              (product) => {

                const image =
                  product?._embedded?.[
                    "wp:featuredmedia"
                  ]?.[0]
                    ?.source_url ??
                  "/placeholder.png";

                const title =
                  product?.title
                    ?.rendered ??
                  "Untitled Product";

                const model =
                  product?.acf
                    ?.model_produk ??
                  "";

                const description =
                  product?.acf
                    ?.short_description ??
                  "";

                const specification =
                  product?.acf
                    ?.spesifikasi ??
                  "";

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

                    {/* =====================================
                        IMAGE
                    ===================================== */}

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
                        alt={title}
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

                      {/* Brand + Category */}

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
                        {getBrandName(
                          product
                        )}{" "}
                        ·{" "}
                        {getCategoryName(
                          product
                        )}
                      </span>
                    </div>

                    {/* =====================================
                        BODY
                    ===================================== */}

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

                      {/* Model */}

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

                      {/* Title */}

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
                        {title}
                      </h3>

                      {/* Description */}

                      {description && (
                        <p
                          className="
                            mb-5
                            line-clamp-3
                            min-h-[60px]
                            text-xs
                            text-muted-foreground
                            sm:text-sm
                          "
                        >
                          {description}
                        </p>
                      )}

                      {/* Specifications */}

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
                            __html:
                              specification,
                          }}
                        />
                      )}

                      {/* =================================
                          BUTTON
                      ================================= */}

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
                        Detail Produk
                      </Link>
                    </div>
                  </div>
                );
              }
            )}
          </div>
        )}
      </div>
    </section>
  );
}