"use client";

import { useEffect, useMemo, useState } from "react";
import { Search } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";
import Image from "next/image";

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
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Filters */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6 bg-card p-6 rounded-lg border border-border">
              {/* Search */}
              <div>
                <label className="block text-sm font-semibold mb-3">
                  {t("products.searchLabel")}
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder={t("products.searchPlaceholder")}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 border border-border rounded-lg bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>

              {/* Divider */}
              <div className="h-px bg-border" />
              {/* Brand Filter */}
              <div>
                <label className="block text-sm font-semibold mb-4">
                  {t("products.filterBrand")}
                </label>
                <div className="space-y-2 flex flex-col">
                  {[
                    {
                      slug: "all",
                      name: t("products.allBrands"),
                    },
                    ...brands,
                  ].map((brand) => (
                    <button
                      key={brand.slug}
                      onClick={() => setBrandFilter(brand.slug)}
                      className={`text-left px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        brandFilter === brand.slug
                          ? "bg-primary text-primary-foreground"
                          : "bg-accent hover:bg-accent/80"
                      }`}
                    >
                      {brand.name}
                    </button>
                  ))}
                </div>
              </div>
              {/* Category Filter */}
              <div>
                <label className="block text-sm font-semibold mb-4">
                  {t("products.filterCategory")}
                </label>
                <div className="space-y-2 flex flex-col">
                  {[
                    {
                      slug: "all",
                      name: t("products.allCategories"),
                    },
                    ...productTypes,
                  ].map((category) => (
                    <button
                      key={category.slug}
                      onClick={() => setCategoryFilter(category.slug)}
                      className={`text-left px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        categoryFilter === category.slug
                          ? "bg-primary text-primary-foreground"
                          : "bg-accent hover:bg-accent/80"
                      }`}
                    >
                      {category.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Divider */}
              <div className="h-px bg-border" />

              {/* Reset Button */}
              <button
                onClick={() => {
                  setBrandFilter("all");
                  setCategoryFilter("all");
                  setSearchQuery("");
                }}
                className="w-full px-4 py-2 text-sm font-medium bg-accent text-foreground hover:bg-accent/80 rounded-lg transition-colors"
              >
                {t("products.resetFilter")}
              </button>
            </div>
          </div>

          {/* Content Area */}
          <div className="lg:col-span-3">
            {/* Results Count */}
            <div className="mb-6">
              <p className="text-sm text-muted-foreground">
                {t("products.showing")}{" "}
                <span className="font-semibold text-foreground">
                  {filteredProducts.length}
                </span>{" "}
                {t("products.of")}{" "}
                <span className="font-semibold text-foreground">
                  {products.length}
                </span>{" "}
                {t("products.products")}
              </p>
            </div>

            {/* Product Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {filteredProducts.map((product) => (
                <div
                  key={product.id}
                  className="group border border-border rounded-lg overflow-hidden hover:border-primary transition-colors bg-card"
                >
                  {/* Image */}
                  <div className="relative bg-accent h-48 overflow-hidden">
                    <Image
                      src={
                        product._embedded?.["wp:featuredmedia"]?.[0]
                          ?.source_url ?? "/placeholder.png"
                      }
                      alt={product.title.rendered}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                      sizes="(max-width:768px) 100vw, (max-width:1200px) 50vw, 33vw"
                    />
                    <div className="absolute top-3 left-3 px-3 py-1 bg-black/50 text-white text-xs font-semibold rounded-full backdrop-blur-sm">
                      {getBrandName(product)} · {getCategoryName(product)}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <span className="text-xs font-semibold text-primary mb-2 block">
                      {product.acf?.model_produk}
                    </span>
                    <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors">
                      {product.title.rendered}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      {product.acf?.short_description}
                    </p>

                    {/* Specs */}
                    <div className="mb-6 space-y-1">
                      <div
                        className="prose prose-sm max-w-none text-sm mb-6 line-clamp-4"
                        dangerouslySetInnerHTML={{
                          __html: product.acf?.spesifikasi ?? "",
                        }}
                      />
                    </div>

                    {/* Action */}
                    <button
                    onClick={async () => {
                      if (!product.acf?.download_brosur) return;

                      const res = await fetch(
                        `https://wp.boeledin.com/wp-json/wp/v2/media/${product.acf.download_brosur}`
                      );

                      if (!res.ok) {
                        alert("Brosur tidak ditemukan");
                        return;
                      }

                      const media = await res.json();

                      window.open(media.source_url, "_blank");
                    }}
                    className="w-full px-4 py-2 border border-primary text-primary hover:bg-primary hover:text-primary-foreground font-semibold rounded-lg transition-colors"
                  >
                    Detail Produk
                  </button>
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
