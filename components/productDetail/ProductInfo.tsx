interface Props {
  product: any;
}

export default function ProductInfo({ product }: Props) {
  const brand =
    product._embedded?.["wp:term"]
      ?.flat()
      ?.find((term: any) => term.taxonomy === "brand")?.name ?? "-";

  return (
    <section className="space-y-6">
      <div>
        <p className="text-sm font-semibold uppercase tracking-widest text-primary">
          {brand}
        </p>

        <h1 className="mt-2 text-4xl font-bold">
          {product.acf?.nama_produk}
        </h1>

        {product.acf?.model_produk && (
          <p className="mt-2 text-lg text-muted-foreground">
            Model : {product.acf.model_produk}
          </p>
        )}
      </div>

      {product.acf?.description && (
        <div className="text-muted-foreground leading-8 whitespace-pre-line">
          {product.acf.description}
        </div>
      )}

      {product.brochureUrl && (
        <a
          href={product.brochureUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="
            inline-flex
            items-center
            rounded-xl
            bg-primary
            px-6
            py-3
            font-semibold
            text-white
            transition
            hover:opacity-90
          "
        >
          Download Brosur
        </a>
      )}
    </section>
  );
}