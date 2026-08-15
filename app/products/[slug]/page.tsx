import ProductGallery from "@/components/productDetail/ProductGallery";
import ProductInfo from "@/components/productDetail/ProductInfo";
import ProductSpecs from "@/components/productDetail/ProductSpecs";
import ProductCTA from "@/components/productDetail/ProductCTA";
import BackButton from "@/components/productDetail/BackButton";

interface Props {
  params: Promise<{
    slug: string;
  }>;
  searchParams: Promise<{
    lang?: string;
  }>;
}

export default async function ProductDetail({
  params,
  searchParams,
}: Props) {
  const { slug } = await params;
  const paramsSearch = await searchParams;

  const lang =
    paramsSearch.lang === "en"
      ? "en"
      : "id";

  const res = await fetch(
    `https://wp.boeledin.com/wp-json/wp/v2/products?slug=${slug}&_embed&lang=${lang}`,
    {
      cache: "no-store",
    }
  );

  const data = await res.json();

  const product = data[0];

  if (!product) {
    return (
      <div>
        {lang === "en"
          ? "Product not found"
          : "Produk tidak ditemukan"}
      </div>
    );
  }

  // ===========================
  // Ambil Gallery dari ACF
  // ===========================

  const ids = (product.acf?.feature_image ?? "")
    .split(/[\n,]+/)
    .map((id: string) => id.trim())
    .filter(Boolean);

  const gallery = (
    await Promise.all(
      ids.map(async (id: string) => {
        try {
          const mediaRes = await fetch(
            `https://wp.boeledin.com/wp-json/wp/v2/media/${id}`,
            {
              cache: "no-store",
            }
          );

          if (!mediaRes.ok) return null;

          const media = await mediaRes.json();

          return media?.source_url ?? null;
        } catch {
          return null;
        }
      })
    )
  ).filter(Boolean);

  product.gallery = gallery;

  // ===========================
  // Ambil Brosur
  // ===========================

  let brochureUrl = "";

  if (product.acf?.download_brosur) {
    try {
      const mediaRes = await fetch(
        `https://wp.boeledin.com/wp-json/wp/v2/media/${product.acf.download_brosur}`,
        {
          cache: "no-store",
        }
      );

      if (mediaRes.ok) {
        const media = await mediaRes.json();

        brochureUrl =
          media?.source_url ?? "";
      }
    } catch {}
  }

  product.brochureUrl = brochureUrl;

  // ===========================
  // RENDER
  // ===========================

  return (
    <main className="bg-background">
      <section className="container mx-auto px-4 py-16">

        {/* BACK BUTTON */}
        <BackButton lang={lang} />

        {/* PRODUCT MAIN */}
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
          <ProductGallery product={product} />

          <ProductInfo product={product} />
        </div>

        {/* PRODUCT SPECS */}
        <ProductSpecs product={product} />

        {/* CTA */}
        <ProductCTA />

      </section>
    </main>
  );
}