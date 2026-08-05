"use client";

import Link from "next/link";
import { useTranslation } from "@/hooks/useTranslation";
import { useEffect, useMemo, useState } from "react";
import Image from "next/image";

type Props = {
  data: any;
};

export default function ProductsShowcase({ data }: Props) {
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
        "https://wp.boeledin.com/wp-json/wp/v2/products?_embed&per_page=3&orderby=date&order=desc",
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
    <section className="py-20 md:py-28 bg-accent/5">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="mb-16">
          <div className="inline-block mb-4 px-4 py-2 bg-accent rounded-full text-sm font-semibold text-primary">
            {data?.product_eyebrow ?? ""}
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            {data?.product_title ?? ""}
          </h2>

          <p className="text-lg text-muted-foreground max-w-3xl">
            {data?.product_description ?? ""}
          </p>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              className="group bg-card rounded-lg border border-border overflow-hidden hover:border-primary transition-colors"
            >
              {/* Product Image */}
              <div className="relative h-56 overflow-hidden">
                <Image
                  src={
                    product._embedded?.["wp:featuredmedia"]?.[0]?.source_url ??
                    "/placeholder.png"
                  }
                  alt={product.title.rendered}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                  sizes="(max-width:768px) 100vw, (max-width:1200px) 50vw, 33vw"
                />

                <div className="absolute inset-0 bg-black/15 group-hover:bg-black/25 transition-colors" />

                <span className="absolute top-4 left-4 bg-primary text-primary-foreground px-3 py-1 rounded-full text-xs font-semibold">
                  {getBrandName(product)} · {getCategoryName(product)}
                </span>
              </div>

              {/* Body */}
              <div className="p-6">
                {/* Model */}
                <span className="text-xs text-primary font-semibold uppercase tracking-wider">
                  {product.acf?.model_produk}
                </span>

                {/* Title */}
                <h3 className="text-lg font-bold mt-2 mb-3">
                  {product.title.rendered}
                </h3>

                {/* Description */}
                <p className="text-muted-foreground text-sm mb-6 line-clamp-3">
                  {product.acf?.short_description}
                </p>

                {/* Specs */}
                <div
                  className="prose prose-sm max-w-none mb-6 pb-6 border-b border-border
                     prose-ul:space-y-2
                     prose-li:flex
                     prose-li:justify-between
                     prose-li:before:hidden"
                  dangerouslySetInnerHTML={{
                    __html: product.acf?.spesifikasi ?? "",
                  }}
                />

                {/* Button */}
                <button
                  onClick={async () => {
                    if (!product.acf?.download_brosur) return;

                    const res = await fetch(
                      `https://wp.boeledin.com/wp-json/wp/v2/media/${product.acf.download_brosur}`,
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
      </div>
    </section>
  );
}
