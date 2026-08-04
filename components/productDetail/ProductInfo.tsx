interface Props {
  product: any;
}

export default function ProductInfo({ product }: Props) {
  return (
    <section className="space-y-4">

      <span className="text-sm font-semibold text-primary uppercase">
        Brand
      </span>

      <h1 className="text-4xl font-bold">
        {product.title.rendered}
      </h1>

      <p className="text-muted-foreground">
        {product.acf?.short_description}
      </p>

      <button className="rounded-xl bg-primary px-6 py-3 font-semibold text-white">
        Download Brosur
      </button>

    </section>
  );
}