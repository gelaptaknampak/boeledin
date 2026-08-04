interface Props {
  product: any;
}

export default function ProductGallery({ product }: Props) {
  return (
    <section className="rounded-2xl border border-border bg-card p-6">
      <h2 className="mb-4 text-lg font-bold">Product Gallery</h2>

      <div className="aspect-square rounded-xl bg-muted flex items-center justify-center">
        Gallery Placeholder
      </div>
    </section>
  );
}