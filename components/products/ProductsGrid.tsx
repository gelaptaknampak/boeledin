"use client";

import { useEffect, useMemo, useState } from "react";
import { Search } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";
import Image from "next/image";
import Link from "next/link";

import ProductCarousel from "./ProductCarousel";

export default function ProductsGrid() {
  const { language } = useTranslation();

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
     STATIC UI TEXT
  ========================= */

  const uiText = {
    searchTitle: currentLanguage === "en" ? "Search Product" : "Cari Produk",

    searchPlaceholder:
      currentLanguage === "en" ? "Search product..." : "Cari produk...",

    brand: "Brand",

    productType: currentLanguage === "en" ? "Product Type" : "Jenis Produk",

    all: currentLanguage === "en" ? "All" : "Semua",

    readMore:
      currentLanguage === "en" ? "Read more..." : "Baca selengkapnya...",

    productDetail:
      currentLanguage === "en" ? "Product Detail" : "Detail Produk",

    noProducts:
      currentLanguage === "en"
        ? "No products found."
        : "Tidak ada produk yang sesuai.",

    loading:
      currentLanguage === "en" ? "Loading products..." : "Memuat produk...",
  };

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

    setProducts([]);
    setBrands([]);
    setProductTypes([]);

    fetchProducts();
    fetchBrands();
    fetchProductTypes();
  }, [currentLanguage]);

  /* =========================
     FETCH PRODUCTS
     ========================= 
     
     Perubahan dari versi lama:
     1. List produk sekarang lewat proxy /api/wordpress/products
        (bukan langsung ke wp.boeledin.com dari browser).
     2. Gambar TIDAK lagi di-fetch satu-satu per media ID.
        Semua media ID dari semua produk dikumpulkan dulu,
        lalu diambil sekaligus lewat satu batch request ke
        /api/wordpress/media/batch. Ini yang sebelumnya
        nyebabin "Failed to fetch" dan gambar kosong di
        sebagian produk (kena CORS / rate limit karena
        terlalu banyak request paralel).
  */

  async function fetchProducts() {
    try {
      setLoading(true);

      const res = await fetch(
        `/api/wordpress/products?lang=${currentLanguage}&_=${Date.now()}`,
        {
          cache: "no-store",
        },
      );

      if (!res.ok) {
        throw new Error("Failed fetch products");
      }

      const data = await res.json();

      console.log("PRODUCTS:", currentLanguage, data);

      const rawProducts = Array.isArray(data) ? data : [];

      // Kumpulkan id media per produk (urutannya dijaga,
      // supaya gallery tiap produk tetap sesuai urutan aslinya).
      const idsByProduct = rawProducts.map((product: any) =>
        String(product.acf?.feature_image ?? "")
          .split(/[\n,]+/)
          .map((id: string) => id.trim())
          .filter(Boolean),
      );

      const allIds = Array.from(new Set(idsByProduct.flat()));

      let mediaMap: Record<string, string> = {};

      if (allIds.length > 0) {
        try {
          const mediaRes = await fetch(
            `/api/wordpress/media?ids=${allIds.join(",")}&_=${Date.now()}`,
            {
              cache: "no-store",
            },
          );

          if (mediaRes.ok) {
            mediaMap = await mediaRes.json();
          } else {
            console.error("Failed fetching media batch:", mediaRes.status);
          }
        } catch (err) {
          console.error("Failed loading product media:", err);
        }
      }

      const productsWithGallery = rawProducts.map(
        (product: any, index: number) => {
          const ids = idsByProduct[index];

          const urls = ids
            .map((id: string) => mediaMap[id])
            .filter((url: string | undefined): url is string => Boolean(url));

          return {
            ...product,
            gallery: urls,
          };
        },
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

      console.log("PRODUCT TYPES:", currentLanguage, data);

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

      const shortDescription = String(
        product.acf?.short_description ?? "",
      ).toLowerCase();

      const searchMatch =
        search === "" ||
        title.includes(search) ||
        model.includes(search) ||
        productName.includes(search) ||
        shortDescription.includes(search);

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
          {uiText.loading}
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
            <h3 className="mb-3 text-lg font-semibold">{uiText.searchTitle}</h3>

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
                placeholder={uiText.searchPlaceholder}
                className="
                  w-full
                  rounded-xl
                  border
                  border-border
                  text-black
                  bg-white
                  py-3
                  pl-12
                  pr-4
                  placeholder:text-gray-500
                  focus:outline-none
                  focus:ring-2
                  focus:ring-primary
                "
              />
            </div>
          </div>

          {/* BRAND */}

          <div>
            <h3 className="mb-3 text-lg font-semibold">{uiText.brand}</h3>

            <div className="flex flex-col gap-3">
              {[
                {
                  slug: "all",
                  name: uiText.all,
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
            <h3 className="mb-3 text-lg font-semibold">{uiText.productType}</h3>

            <div className="flex flex-col gap-3">
              {[
                {
                  slug: "all",
                  name: uiText.all,
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
              {language === "en" ? "Showing" : "Menampilkan"}{" "}
              <strong>{filteredProducts.length}</strong>{" "}
              {language === "en" ? "of" : "dari"}{" "}
              <strong>{products.length}</strong>{" "}
              {language === "en" ? "products" : "produk"}
            </p>
          </div>

          {/* =================================
              PRODUCT GRID
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
                    bg-white
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
                      <div
                        className="
                            relative
                            z-10
                            mt-3
                            flex
                            min-h-10
                            w-28
                            items-center
                          "
                      >
                        <Image
                          src={getBrandLogo(product)}
                          alt={`${getBrandName(product)} logo`}
                          width={112}
                          height={40}
                          className="
                              relative
                              z-10
                              max-h-10
                              w-auto
                              max-w-full
                              object-contain
                              object-left
                            "
                        />
                      </div>
                    )}

                    {/* MODEL */}

                    <p className="mt-1 line-clamp-1 text-sm text-black">
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
                        text-black
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
                          text-black
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
                        {uiText.readMore}
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
                      {uiText.productDetail}
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
              <p className="text-muted-foreground">{uiText.noProducts}</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}