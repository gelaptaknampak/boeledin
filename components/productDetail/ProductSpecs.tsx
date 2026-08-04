interface Props {
  product: any;
}

export default function ProductSpecs({ product }: Props) {
  return (
    <section className="mt-20">

      <h2 className="mb-6 text-2xl font-bold">
        Specifications
      </h2>

      <div
        className="prose prose-invert max-w-none"
        dangerouslySetInnerHTML={{
          __html: product.acf?.spesifikasi ?? "",
        }}
      />

    </section>
  );
}