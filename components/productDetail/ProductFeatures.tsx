interface Props {
  product: any;
}

export default function ProductFeatures({ product }: Props) {
  return (
    <section className="mt-20">

      <h2 className="mb-6 text-2xl font-bold">
        Features
      </h2>

      <div className="grid gap-6 md:grid-cols-3">

        <div className="rounded-xl border border-border p-6">
          Feature 1
        </div>

        <div className="rounded-xl border border-border p-6">
          Feature 2
        </div>

        <div className="rounded-xl border border-border p-6">
          Feature 3
        </div>

      </div>

    </section>
  );
}