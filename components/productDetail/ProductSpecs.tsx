interface Props {
  product: any;
}

export default function ProductSpecs({ product }: Props) {
  const specs =
    product.acf?.spesifikasi
      ?.split("\n")
      .map((item: string) => item.trim())
      .filter(Boolean) ?? [];

  return (
    <section className="mt-20">
      <h2 className="mb-8 text-3xl font-bold">
        Specifications
      </h2>

      <div className="grid gap-5 md:grid-cols-2">
        {specs.map((spec: string, index: number) => {
          const [label, ...value] = spec.split(":");

          return (
            <div
              key={index}
              className="
                rounded-2xl
                border
                border-border
                bg-card
                p-6
                transition
                hover:border-primary
              "
            >
              <p className="text-sm font-semibold uppercase tracking-wide text-primary">
                {label.trim()}
              </p>

              <p className="mt-2 text-lg font-medium">
                {value.join(":").trim()}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
}