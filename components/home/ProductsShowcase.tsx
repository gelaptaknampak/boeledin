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
  <section className="py-14 sm:py-20 md:py-28 bg-accent/5">
    <div className="container mx-auto px-4 sm:px-6 lg:px-8">

      {/* Section Header */}
      <div className="mb-10 sm:mb-14 md:mb-16 max-w-4xl">

        <div className="inline-flex mb-4 px-3 sm:px-4 py-2 bg-accent rounded-full text-xs sm:text-sm font-semibold text-primary">
          {data?.product_eyebrow ?? ""}
        </div>

        <h2 className="
          text-3xl 
          sm:text-4xl 
          md:text-5xl 
          font-bold 
          leading-tight 
          mb-4 sm:mb-6
        ">
          {data?.product_title ?? ""}
        </h2>

        <p className="
          text-sm 
          sm:text-base 
          md:text-lg 
          text-muted-foreground 
          max-w-3xl
        ">
          {data?.product_description ?? ""}
        </p>

      </div>


      {/* Product Grid */}
      <div
        className="
          grid 
          grid-cols-1 
          sm:grid-cols-2 
          lg:grid-cols-3 
          gap-5 
          sm:gap-6 
          lg:gap-8
        "
      >

        {filteredProducts.map((product) => (

          <div
            key={product.id}
            className="
              group 
              bg-card 
              rounded-xl 
              border 
              border-border 
              overflow-hidden 
              flex 
              flex-col
              hover:border-primary 
              transition-all
              duration-300
            "
          >


            {/* Product Image */}
            <div
              className="
                relative 
                aspect-[4/3]
                sm:aspect-[5/4]
                overflow-hidden
              "
            >

              <Image
                src={
                  product._embedded?.["wp:featuredmedia"]?.[0]?.source_url ??
                  "/placeholder.png"
                }
                alt={product.title.rendered}
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
              />


              <div
                className="
                  absolute 
                  inset-0 
                  bg-black/10 
                  group-hover:bg-black/25
                  transition
                "
              />


              <span
                className="
                  absolute
                  top-3
                  left-3
                  right-3
                  w-fit
                  max-w-[90%]
                  bg-primary
                  text-primary-foreground
                  px-3
                  py-1.5
                  rounded-full
                  text-[11px]
                  sm:text-xs
                  font-semibold
                  truncate
                "
              >
                {getBrandName(product)} · {getCategoryName(product)}
              </span>

            </div>



            {/* Body */}
            <div
              className="
                p-4
                sm:p-5
                lg:p-6
                flex
                flex-col
                flex-1
              "
            >

              {/* Model */}
              <span
                className="
                  text-[11px]
                  sm:text-xs
                  text-primary
                  font-semibold
                  uppercase
                  tracking-wider
                "
              >
                {product.acf?.model_produk}
              </span>


              {/* Title */}
              <h3
                className="
                  text-base
                  sm:text-lg
                  font-bold
                  mt-2
                  mb-3
                  line-clamp-2
                "
              >
                {product.title.rendered}
              </h3>



              {/* Description */}
              <p
                className="
                  text-xs
                  sm:text-sm
                  text-muted-foreground
                  mb-5
                  line-clamp-3
                  min-h-[60px]
                "
              >
                {product.acf?.short_description}
              </p>



              {/* Specs */}
              <div
                className="
                  prose
                  prose-sm
                  max-w-none
                  text-xs
                  sm:text-sm
                  mb-5
                  pb-5
                  border-b
                  border-border

                  prose-ul:space-y-1
                  prose-li:break-words
                  prose-li:before:hidden
                "
                dangerouslySetInnerHTML={{
                  __html: product.acf?.spesifikasi ?? "",
                }}
              />



              {/* Button */}
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

                  window.open(media.source_url,"_blank");

                }}
                className="
                  mt-auto
                  w-full
                  px-4
                  py-2.5
                  text-sm
                  sm:text-base
                  border
                  border-primary
                  text-primary
                  hover:bg-primary
                  hover:text-primary-foreground
                  font-semibold
                  rounded-lg
                  transition-colors
                "
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
