import ProductGallery from "@/components/productDetail/ProductGallery";
import ProductInfo from "@/components/productDetail/ProductInfo";
import ProductFeatures from "@/components/productDetail/ProductFeatures";
import ProductSpecs from "@/components/productDetail/ProductSpecs";
import ProductCTA from "@/components/productDetail/ProductCTA";
import RelatedProducts from "@/components/productDetail/RelatedProducts";

interface Props {
  params: Promise<{
    slug: string;
  }>;
}

export default async function ProductDetail({ params }: Props) {
  const { slug } = await params;

  const res = await fetch(
    `https://wp.boeledin.com/wp-json/wp/v2/products?slug=${slug}&_embed`,
    {
      cache: "no-store",
    }
  );

  const data = await res.json();

  const product = data[0];

  if (!product) {
    return <div>Produk tidak ditemukan</div>;
  }

  return (
  <main className="bg-background">

    <section className="container mx-auto px-4 py-16">

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">

        <ProductGallery product={product} />

        <ProductInfo product={product} />

      </div>

      <ProductFeatures product={product} />

      <ProductSpecs product={product} />

      <RelatedProducts currentProduct={product} />

      <ProductCTA />

    </section>

  </main>
  );
}