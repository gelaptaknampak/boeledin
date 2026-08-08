"use client";

type Props = {
  acf: any;
};

export default function NewsHero({ acf }: Props) {
  return (
    <section className="bg-gradient-to-b from-accent to-background py-12 md:py-16">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl">
          {/* Eyebrow */}
          {acf?.eyebrow && (
            <div className="mb-4 inline-block rounded-full bg-blue-950 px-4 py-2 text-sm font-semibold text-blue-300">
              {acf.eyebrow}
            </div>
          )}

          {/* Title */}
          {acf?.title && (
            <h1 className="mb-6 text-4xl font-bold md:text-5xl">{acf.title}</h1>
          )}

          {/* Description */}
          {acf?.description && (
            <p className="text-lg leading-relaxed text-muted-foreground">
              {acf.description}
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
