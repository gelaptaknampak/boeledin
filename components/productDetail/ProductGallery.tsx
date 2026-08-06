"use client";

import ProductCarousel from "../products/ProductCarousel";

interface Props {
  product: any;
}

export default function ProductGallery({ product }: Props) {
  return (
    <section className="rounded-2xl border border-border bg-card p-4">
      <ProductCarousel
        images={
          product.gallery?.length
            ? product.gallery
            : ["/placeholder.png"]
        }
        title={product.title.rendered}
        large
      />
    </section>
  );
}