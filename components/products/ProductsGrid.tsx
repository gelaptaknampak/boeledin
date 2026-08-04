"use client";

import { useEffect, useMemo, useState } from "react";
import { Search } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";
import Image from "next/image";
import Link from "next/link";

export default function ProductsGrid() {
  const { t } = useTranslation();

  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [brandFilter, setBrandFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [brands, setBrands] = useState<any[]>([]);
  const [productTypes, setProductTypes] = useState<any[]>([]);

  useEffect(() => {
    fetchProducts();
    fetchBrands();
    fetchProductTypes();
  }, []);

  async function fetchBrands() {
    const res = await fetch("/api/wordpress/brands");
    if (!res.ok) return;

    setBrands(await res.json());
  }

  async function fetchProductTypes() {
    const res = await fetch("/api/wordpress/product-types");
    if (!res.ok) return;

    setProductTypes(await res.json());
  }

  async function fetchProducts() {
    try {
      setLoading(true);

      const res = await fetch(
        `https://wp.boeledin.com/wp-json/wp/v2/products?_embed&_=${Date.now()}`,
        {
          cache: "no-store",
        },
      );

      if (!res.ok) throw new Error();

      const data = await res.json();

      setProducts(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  function getBrand(product: any) {
    return (
      product._embedded?.["wp:term"]
        ?.flat()
        ?.find((term: any) => term.taxonomy === "brand")?.slug ?? ""
    );
  }

  function getBrandName(product: any) {
    return (
      product._embedded?.["wp:term"]
        ?.flat()
        ?.find((term: any) => term.taxonomy === "brand")?.name ?? "-"
    );
  }

  function getCategory(product: any) {
    return (
      product._embedded?.["wp:term"]
        ?.flat()
        ?.find((term: any) => term.taxonomy === "jenis-produk")?.slug ?? ""
    );
  }

  function getCategoryName(product: any) {
    return (
      product._embedded?.["wp:term"]
        ?.flat()
        ?.find((term: any) => term.taxonomy === "jenis-produk")?.name ?? "-"
    );
  }

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const brand = getBrand(product);
      const category = getCategory(product);

      const brandMatch = brandFilter === "all" || brand === brandFilter;

      const categoryMatch =
        categoryFilter === "all" || category === categoryFilter;

      const searchMatch =
        searchQuery === "" ||
        product.title.rendered
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        (product.acf?.model_produk ?? "")
          .toLowerCase()
          .includes(searchQuery.toLowerCase());

      return brandMatch && categoryMatch && searchMatch;
    });
  }, [products, brandFilter, categoryFilter, searchQuery]);

  if (loading) {
    return <section className="py-20 text-center">Memuat produk...</section>;
  }

  return (
    <section className="py-12 md:py-16 bg-background">
      <div className="container mx-auto px-4">
        {/* Main Layout: Sidebar + Content */}
        <div className="space-y-8">
          <div className="mb-10 space-y-6">

            <div className="relative max-w-xl">
  <Search className="absolute left-4 top-3.5 h-5 w-5 text-muted-foreground" />

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
      pl-12
      pr-4
      py-3
      focus:outline-none
      focus:ring-2
      focus:ring-primary
    "
  />
</div>

            {/* Brand */}
<div className="space-y-3">

    <h4 className="font-semibold">
        Brand
    </h4>
            <div className="flex flex-wrap gap-3">
              {[
                { slug: "all", name: "Semua" },
                ...brands
              ].map((brand) => (
                <button
                  key={brand.slug}
                  onClick={() => setBrandFilter(brand.slug)}
                  className={`rounded-full px-5 py-2 text-sm transition
        ${brandFilter === brand.slug
                      ? "bg-primary text-white"
                      : "border border-border hover:border-primary"
                    }`}
                >
                  {brand.name}
                </button>
              ))}
            </div>
          </div>

            {/* Category */}
<div className="space-y-3">

    <h4 className="font-semibold">
        Jenis Produk
    </h4>
            <div className="flex flex-wrap gap-3">
              {[
                { slug: "all", name: "Semua" },
                ...productTypes
              ].map((cat) => (
                <button
                  key={cat.slug}
                  onClick={() => setCategoryFilter(cat.slug)}
                  className={`rounded-full px-5 py-2 text-sm transition
        ${categoryFilter === cat.slug
                      ? "bg-primary text-white"
                      : "border border-border hover:border-primary"
                    }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>

          </div>
        </div>

          {/* Content Area */}
          <div className="lg:col-span-3">
            {/* Results Count */}
            <div className="mb-6">
              <p className="text-sm text-muted-foreground">
                {t("products.showing")}{" "}
                <span className="font-semibold text-foreground">
                  <strong> {filteredProducts.length}</strong>
                </span>{" "}
                {t("products.of")}{" "}
                <span className="font-semibold text-foreground">
                  <strong> {products.length}</strong>
                </span>{" "}
                {t("products.products")}
              </p>
            </div>

            {/* Product Grid */}
            <div className="grid grid-cols-1
sm:grid-cols-2
xl:grid-cols-4 gap-8">
              {filteredProducts.map((product) => (

                <div
  key={product.id}
  className="
    flex flex-col
    overflow-hidden
    rounded-xl
    border border-border
    bg-card
    transition
    hover:border-primary
    hover:-translate-y-1
  "
>

                  <Link href={`/products/${product.slug}`}>

                    <div className="relative h-72 bg-white">

                      <Image
                        fill
                        alt={product.title.rendered}
                        src={
                          product._embedded?.["wp:featuredmedia"]?.[0]?.source_url ??
                          "/placeholder.png"
                        }
                        className="object-contain p-6 transition group-hover:scale-105"
                      />

                      <div className="absolute left-3 bottom-3 rounded bg-black/70 px-2 py-1 text-xs text-white">
                        {getCategoryName(product)}
                      </div>

                    </div>

                  </Link>

                  <div className="flex flex-1 flex-col p-5">

                    {/* Logo brand nanti */}

                    {/*
        <div className="relative h-10 w-10">
            <Image
                src={getBrandLogo(product)}
                fill
                alt={getBrandName(product)}
            />
        </div>
        */}

                    <div>

                      <p className="text-xs uppercase tracking-widest text-primary font-bold">
                          {getBrandName(product)}
                      </p>

                      <p className="text-sm text-muted-foreground">
                          {product.acf?.model_produk}
                      </p>

                    </div>

                    <h3 className="mt-3 text-xl font-bold line-clamp-2">
                        {product.title.rendered}
                    </h3>

                    <div className="mt-3">
                      <p className="line-clamp-2 text-sm text-muted-foreground">
                        {product.acf?.short_description}
                      </p>

                      {(product.acf?.short_description?.length ?? 0) > 90 && (
                        <Link
                          href={`/products/${product.slug}`}
                          className="mt-1 inline-block text-sm font-medium text-primary hover:underline"
                        >
                          Read more...
                        </Link>
                      )}
                    </div>
                  
                    <div className="mt-auto pt-6">
                      <Link
                        href={`/products/${product.slug}`}
                        className="
                          block
                          w-full
                          rounded-xl
                          border
                          border-primary
                          py-3
                          text-center
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

            {filteredProducts.length === 0 && (
              <div className="text-center py-12 col-span-full">
                <p className="text-muted-foreground mb-4">
                  {t("products.noResults")}
                </p>
                <button
                  onClick={() => {
                    setBrandFilter("all");
                    setCategoryFilter("all");
                    setSearchQuery("");
                  }}
                  className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                >
                  {t("products.resetFilter")}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
