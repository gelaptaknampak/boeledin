"use client";

import { useEffect, useMemo, useState } from "react";
import { Search } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";
import Image from "next/image";
import Link from "next/link";

import ProductCarousel from "./ProductCarousel";

export default function ProductsGrid() {
  const { t, language } = useTranslation();

  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [brandFilter, setBrandFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const [brands, setBrands] = useState<any[]>([]);
  const [productTypes, setProductTypes] = useState<any[]>([]);

  /* =========================
     LANGUAGE
  ========================= */

  const currentLanguage = language === "en" ? "en" : "id";

  /* =========================
     BRAND MAP
  ========================= */

  const brandMap = useMemo(() => {
    return new Map(brands.map((brand) => [brand.slug, brand]));
  }, [brands]);

  /* =========================
     FETCH DATA
  ========================= */

  useEffect(() => {
    setBrandFilter("all");
    setCategoryFilter("all");
    setSearchQuery("");

    fetchProducts();
    fetchBrands();
    fetchProductTypes();
  }, [currentLanguage]);

  /* =========================
     FETCH PRODUCTS
  ========================= */

  async function fetchProducts() {
    try {
      setLoading(true);

      const res = await fetch(
        `https://wp.boeledin.com/wp-json/boeledin/v1/products?lang=${currentLanguage}&_=${Date.now()}`,
        {
          cache: "no-store",
        },
      );

      if (!res.ok) {
        throw new Error("Failed fetch products");
      }

      const data = await res.json();

      console.log("PRODUCTS:", currentLanguage, data);

      const products = Array.isArray(data) ? data : [];

      const productsWithGallery = await Promise.all(
        products.map(async (product: any) => {
          const ids = String(product.acf?.feature_image ?? "")
            .split(/[\n,]+/)
            .map((id: string) => id.trim())
            .filter(Boolean);

          const urls = await Promise.all(
            ids.map(async (id: string) => {
              try {
                const res = await fetch(
                  `https://wp.boeledin.com/wp-json/wp/v2/media/${id}`,
                  {
                    cache: "no-store",
                  },
                );

                if (!res.ok) {
                  return null;
                }

                const media = await res.json();

                return media?.source_url ?? null;
              } catch {
                return null;
              }
            }),
          );

          return {
            ...product,
            gallery: urls.filter(Boolean),
          };
        }),
      );

      setProducts(productsWithGallery);
    } catch (err) {
      console.error("Failed loading products:", err);

      setProducts([]);
    } finally {
      setLoading(false);
    }
  }

  /* =========================
     FETCH BRANDS
  ========================= */

  async function fetchBrands() {
    try {
      const res = await fetch(
        `/api/wordpress/brands?lang=${currentLanguage}&_=${Date.now()}`,
        {
          cache: "no-store",
        },
      );

      if (!res.ok) {
        setBrands([]);
        return;
      }

      const data = await res.json();

      console.log("BRANDS:", currentLanguage, data);

      setBrands(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed loading brands:", err);

      setBrands([]);
    }
  }

  /* =========================
     FETCH PRODUCT TYPES
  ========================= */

  async function fetchProductTypes() {
    try {
      const res = await fetch(
        `/api/wordpress/product-types?lang=${currentLanguage}&_=${Date.now()}`,
        {
          cache: "no-store",
        },
      );

      if (!res.ok) {
        setProductTypes([]);
        return;
      }

      const data = await res.json();

      setProductTypes(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed loading product types:", err);

      setProductTypes([]);
    }
  }

  /* =========================
     PRODUCT BRAND
  ========================= */

  function getBrand(product: any) {
    return product.brand?.slug ?? "";
  }

  function getBrandName(product: any) {
    return product.brand?.name ?? "-";
  }

  function getBrandLogo(product: any) {
    const brandSlug = product.brand?.slug;

    if (!brandSlug) {
      return "";
    }

    const brand = brandMap.get(brandSlug);

    return brand?.acf?.brand_logo_url ?? "";
  }

  /* =========================
     PRODUCT CATEGORY
  ========================= */

  function getCategory(product: any) {
    return product.jenis_produk?.slug ?? "";
  }

  function getCategoryName(product: any) {
    return product.jenis_produk?.name ?? "-";
  }

  /* =========================
     FILTER PRODUCTS
  ========================= */

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const brand = getBrand(product);
      const category = getCategory(product);

      const brandMatch = brandFilter === "all" || brand === brandFilter;

      const categoryMatch =
        categoryFilter === "all" || category === categoryFilter;

      const search = searchQuery.trim().toLowerCase();

      const title = product.title?.rendered?.toLowerCase() ?? "";

      const model = String(product.acf?.model_produk ?? "").toLowerCase();

      const productName = String(product.acf?.nama_produk ?? "").toLowerCase();

      const searchMatch =
        search === "" ||
        title.includes(search) ||
        model.includes(search) ||
        productName.includes(search);

      return brandMatch && categoryMatch && searchMatch;
    });
  }, [products, brandFilter, categoryFilter, searchQuery]);

  /* =========================
     LOADING
  ========================= */

  if (loading) {
    return (
      <section className="container mx-auto px-4 py-20">
        <div className="text-center text-muted-foreground">
          Memuat produk...
        </div>
      </section>
    );
  }

  /* =========================
     RENDER
  ========================= */

  return (
    <section className="container mx-auto px-4 py-12">
      <div
        className="
          grid
          grid-cols-1
          gap-8
          lg:grid-cols-[220px_minmax(0,1fr)]
          xl:grid-cols-[240px_minmax(0,1fr)]
        "
      >
        {/* =================================
            SIDEBAR
        ================================= */}

        <aside className="space-y-8">
          {/* SEARCH */}

          <div>
            <h3 className="mb-3 text-lg font-semibold">Cari Produk</h3>

            <div className="relative">
              <Search
                className="
                  absolute
                  left-4
                  top-3.5
                  h-5
                  w-5
                  text-muted-foreground
                "
              />

              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari produk..."
                className="
                  w-full
                  rounded-xl
                  border
                  border-border
                  bg-card
                  py-3
                  pl-12
                  pr-4
                  focus:outline-none
                  focus:ring-2
                  focus:ring-primary
                "
              />
            </div>
          </div>

          {/* BRAND */}

          <div>
            <h3 className="mb-3 text-lg font-semibold">Brand</h3>

            <div className="flex flex-col gap-3">
              {[
                {
                  slug: "all",
                  name: "Semua",
                },
                ...brands,
              ].map((brand) => (
                <button
                  key={brand.slug}
                  onClick={() => setBrandFilter(brand.slug)}
                  className={`
                    rounded-xl
                    border
                    px-4
                    py-3
                    text-left
                    transition

                    ${
                      brandFilter === brand.slug
                        ? "border-primary bg-primary text-white"
                        : "border-border hover:border-primary"
                    }
                  `}
                >
                  {brand.name}
                </button>
              ))}
            </div>
          </div>

          {/* JENIS PRODUK */}

          <div>
            <h3 className="mb-3 text-lg font-semibold">Jenis Produk</h3>

            <div className="flex flex-col gap-3">
              {[
                {
                  slug: "all",
                  name: "Semua",
                },
                ...productTypes,
              ].map((cat) => (
                <button
                  key={cat.slug}
                  onClick={() => setCategoryFilter(cat.slug)}
                  className={`
                    rounded-xl
                    border
                    px-4
                    py-3
                    text-left
                    transition

                    ${
                      categoryFilter === cat.slug
                        ? "border-primary bg-primary text-white"
                        : "border-border hover:border-primary"
                    }
                  `}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>
        </aside>

        {/* =================================
            PRODUCT LIST
        ================================= */}

        <div className="min-w-0">
          {/* PRODUCT COUNT */}

          <div className="mb-5">
            <p className="text-sm text-muted-foreground">
              {t("products.showing")} <strong>{filteredProducts.length}</strong>{" "}
              {t("products.of")} <strong>{products.length}</strong>{" "}
              {t("products.products")}
            </p>
          </div>

          {/* =================================
              PRODUCT GRID
              
              MOBILE  = 1
              TABLET  = 2
              LAPTOP  = 3
              PC      = 3
              
              Product ke-4 otomatis turun
              ke baris berikutnya.
          ================================= */}

          <div
            className="
              grid
              grid-cols-1
              gap-6
              sm:grid-cols-2
              lg:grid-cols-3
            "
          >
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                className="
                  flex
                  min-w-0
                  flex-col
                  overflow-hidden
                  rounded-xl
                  border
                  border-border
                  bg-card
                  transition-all
                  duration-200
                  hover:-translate-y-1
                  hover:border-primary
                  hover:shadow-md
                "
              >
                {/* =================================
                    PRODUCT IMAGE
                ================================= */}

                <Link
                  href={`/products/${product.slug}?lang=${currentLanguage}`}
                >
                  <div className="relative h-60 bg-white">
                    <ProductCarousel
                      images={
                        product.gallery?.length > 0
                          ? product.gallery
                          : ["/placeholder.png"]
                      }
                      title={
                        product.title?.rendered ??
                        product.acf?.nama_produk ??
                        ""
                      }
                    />

                    {/* CATEGORY */}

                    <div
                      className="
                        absolute
                        bottom-3
                        left-3
                        max-w-[calc(100%-24px)]
                        truncate
                        rounded-md
                        bg-black/70
                        px-2
                        py-1
                        text-xs
                        font-medium
                        text-white
                      "
                    >
                      {getCategoryName(product)}
                    </div>
                  </div>
                </Link>

                {/* =================================
                    PRODUCT INFO
                ================================= */}

                <div className="flex flex-1 flex-col p-5">
                  {/* BRAND */}

                  <div>
                    <p
                      className="
                        truncate
                        text-xs
                        font-bold
                        uppercase
                        tracking-widest
                        text-primary
                      "
                    >
                      {getBrandName(product)}
                    </p>

                    {/* BRAND LOGO */}

                    {getBrandLogo(product) && (
                      <div className="mt-2 flex h-8 w-24 items-center">
                        <Image
                          src={getBrandLogo(product)}
                          alt={`${getBrandName(product)} logo`}
                          width={96}
                          height={32}
                          className="
                            max-h-8
                            w-auto
                            object-contain
                            object-left
                          "
                        />
                      </div>
                    )}

                    {/* MODEL */}

                    <p className="mt-1 line-clamp-1 text-sm text-muted-foreground">
                      {product.acf?.model_produk}
                    </p>
                  </div>

                  {/* PRODUCT NAME */}

                  <h3
                    className="
                      mt-3
                      line-clamp-2
                      text-xl
                      font-bold
                      leading-snug
                    "
                  >
                    {product.acf?.nama_produk}
                  </h3>

                  {/* DESCRIPTION */}

                  <div className="mt-3">
                    <p
                      className="
                        line-clamp-2
                        text-sm
                        leading-relaxed
                        text-muted-foreground
                      "
                    >
                      {product.acf?.short_description}
                    </p>

                    {(product.acf?.short_description?.length ?? 0) > 90 && (
                      <Link
                        href={`/products/${product.slug}?lang=${currentLanguage}`}
                        className="
                          mt-1
                          inline-block
                          text-sm
                          font-medium
                          text-primary
                          hover:underline
                        "
                      >
                        Read more...
                      </Link>
                    )}
                  </div>

                  {/* DETAIL BUTTON */}

                  <div className="mt-auto pt-6">
                    <Link
                      href={`/products/${product.slug}?lang=${currentLanguage}`}
                      className="
                        block
                        w-full
                        rounded-lg
                        border
                        border-primary
                        px-3
                        py-3
                        text-center
                        text-sm
                        font-semibold
                        text-primary
                        transition
                        hover:bg-primary
                        hover:text-white
                      "
                    >
                      Detail Produk
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* =================================
              EMPTY STATE
          ================================= */}

          {filteredProducts.length === 0 && (
            <div className="py-20 text-center">
              <p className="text-muted-foreground">
                Tidak ada produk yang sesuai.
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
