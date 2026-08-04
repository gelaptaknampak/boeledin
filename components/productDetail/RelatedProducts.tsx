interface Props {
  currentProduct: any;
}

export default function RelatedProducts({
  currentProduct,
}: Props) {
  return (
    <section className="mt-20">

      <h2 className="mb-6 text-2xl font-bold">
        Related Products
      </h2>

      <div className="grid gap-6 md:grid-cols-3">

        <div className="rounded-xl border border-border p-6">
          Product 1
        </div>

        <div className="rounded-xl border border-border p-6">
          Product 2
        </div>

        <div className="rounded-xl border border-border p-6">
          Product 3
        </div>

      </div>

    </section>
  );
}