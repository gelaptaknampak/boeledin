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

  useEffect(() => {
    fetchProducts();
    fetchBrands();
    fetchProductTypes();
  }, []);

  async function fetchBrands() {
    const res = await fetch(`/api/wordpress/brands?lang=${language}`);
    if (!res.ok) return;

    setBrands(await res.json());
  }

  async function fetchProductTypes() {
    const res = await fetch(`/api/wordpress/product-types?lang=${language}`);
    if (!res.ok) return;

    setProductTypes(await res.json());
  }

  async function fetchProducts() {
    try {
      setLoading(true);

      const res = await fetch(
        `https://wp.boeledin.com/wp-json/wp/v2/products?_embed&lang=${language}`,
        {
          cache: "no-store",
        },
      );

      if (!res.ok) throw new Error("Failed fetch products");

      const data = await res.json();

      const productsWithGallery = await Promise.all(
        data.map(async (product: any) => {
          const ids = (product.acf?.feature_image ?? "")
            .split(/[\n,]+/)
            .map((id: string) => id.trim())
            .filter(Boolean);

          const urls = await Promise.all(
            ids.map(async (id: string) => {
              try {
                const res = await fetch(
                  `https://wp.boeledin.com/wp-json/wp/v2/media/${id}`,
                );

                if (!res.ok) return null;

                const media = await res.json();
                return media.source_url;
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
        {/* Main Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
          {/* ================================= */}
          {/* Sidebar */}
          {/* ================================= */}

          <aside className="lg:col-span-1 space-y-8">
            {/* Search */}
            <div>
              <h3 className="mb-3 text-lg font-semibold">Cari Produk</h3>

              <div className="relative">
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

            {/* Brand */}
            <div>
              <h3 className="mb-3 text-lg font-semibold">Brand</h3>

              <div className="flex flex-col gap-3">
                {[{ slug: "all", name: "Semua" }, ...brands].map((brand) => (
                  <button
                    key={brand.slug}
                    onClick={() => setBrandFilter(brand.slug)}
                    className={`rounded-xl border px-4 py-3 text-left transition
              ${
                brandFilter === brand.slug
                  ? "bg-primary text-white border-primary"
                  : "border-border hover:border-primary"
              }`}
                  >
                    {brand.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Jenis Produk */}
            <div>
              <h3 className="mb-3 text-lg font-semibold">Jenis Produk</h3>

              <div className="flex flex-col gap-3">
                {[{ slug: "all", name: "Semua" }, ...productTypes].map(
                  (cat) => (
                    <button
                      key={cat.slug}
                      onClick={() => setCategoryFilter(cat.slug)}
                      className={`rounded-xl border px-4 py-3 text-left transition
              ${
                categoryFilter === cat.slug
                  ? "bg-primary text-white border-primary"
                  : "border-border hover:border-primary"
              }`}
                    >
                      {cat.name}
                    </button>
                  ),
                )}
              </div>
            </div>
          </aside>

          {/* ================================= */}
          {/* Product List */}
          {/* ================================= */}

          <div className="lg:col-span-3">
            <div className="mb-6">
              <p className="text-sm text-muted-foreground">
                {t("products.showing")}{" "}
                <strong>{filteredProducts.length}</strong> {t("products.of")}{" "}
                <strong>{products.length}</strong> {t("products.products")}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
              {filteredProducts.map((product) => (
                <div
                  key={product.id}
                  className="
            flex
            flex-col
            overflow-hidden
            rounded-xl
            border
            border-border
            bg-card
            transition
            hover:border-primary
            hover:-translate-y-1
          "
                >
                  <Link href={`/products/${product.slug}`}>
                    <div className="relative h-72 bg-white">
                      <ProductCarousel
                        images={
                          product.gallery.length > 0
                            ? product.gallery
                            : ["/placeholder.png"]
                        }
                        title={product.title.rendered}
                      />

                      <div className="absolute left-3 bottom-3 rounded bg-black/70 px-2 py-1 text-xs text-white">
                        {getCategoryName(product)}
                      </div>
                    </div>
                  </Link>

                  <div className="flex flex-1 flex-col p-5">
                    <div>
                      <p className="text-xs font-bold uppercase tracking-widest text-primary">
                        {getBrandName(product)}
                      </p>

                      <p className="text-sm text-muted-foreground">
                        {product.acf?.model_produk}
                      </p>
                    </div>

                    <h3 className="mt-3 text-xl font-bold line-clamp-2">
                      {product.acf?.nama_produk}
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
          </div>
        </div>
      </div>
    </section>
  );
}
