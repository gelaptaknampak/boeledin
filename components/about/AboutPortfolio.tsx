import Image from "next/image";

interface AboutPortfolioProps {
  acf: Record<string, any>;
}

function resolveImage(raw: any, debugLabel: string): { url: string; alt: string } {
  if (!raw) return { url: "", alt: "" };

  // Kemungkinan 1: value langsung berupa string URL
  if (typeof raw === "string") {
    return { url: raw, alt: "" };
  }

  // Kemungkinan 2: ACF image array standar { url, alt, ... }
  if (typeof raw === "object") {
    return { url: raw.url ?? raw.sizes?.large ?? "", alt: raw.alt ?? "" };
  }

  // Kemungkinan 3: cuma attachment ID mentah (angka) -> gak bisa dibikin src
  // tanpa lookup tambahan. Ini nandain Return Format field ACF-nya masih
  // "Image ID", padahal harusnya "Image Array".
  if (typeof raw === "number") {
    if (process.env.NODE_ENV !== "production") {
      console.warn(
        `[AboutPortfolio] "${debugLabel}" cuma dapet attachment ID (${raw}), bukan URL/object. ` +
          `Cek Return Format field ini di Custom Fields > Field Groups > About One Portfolio, ubah ke "Image Array".`
      );
    }
    return { url: "", alt: "" };
  }

  return { url: "", alt: "" };
}

export default function AboutPortfolio({ acf }: AboutPortfolioProps) {
  const eyebrow = acf.about_portfolio_eyebrow ?? "";
  const title = acf.about_portfolio_title ?? "";
  const description = acf.about_portfolio_description ?? "";

  const items = [1, 2, 3, 4, 5, 6]
    .map((i) => {
      const image = resolveImage(
        acf[`about_portfolio_item_${i}_icon`],
        `Item ${i} Icon`
      );

      return {
        image,
        title: acf[`about_portfolio_item_${i}_title`] ?? "",
        subtitle: acf[`about_portfolio_item_${i}_subtitle`] ?? "",
      };
    })
    .filter((item) => item.title || item.image.url);

  if (!title && items.length === 0) {
    return null;
  }

  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl">
          {eyebrow && (
            <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-primary">
              {eyebrow}
            </p>
          )}

          {title && (
            <h2 className="text-3xl font-bold text-foreground sm:text-4xl">
              {title}
            </h2>
          )}

          {description && (
            <p className="mt-4 text-muted-foreground">{description}</p>
          )}
        </div>

        {items.length > 0 && (
          <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((item, index) => (
              <div
                key={index}
                className="group relative aspect-[4/3] overflow-hidden rounded-2xl"
              >
                {item.image.url ? (
                  <Image
                    src={item.image.url}
                    alt={item.image.alt || item.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover transition duration-500 group-hover:scale-105"
                  />
                ) : (
                  <div className="h-full w-full bg-muted" />
                )}

                {/* overlay gradient teal, teks nempel di bawah — mirip referensi */}
                <div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-primary/20 to-transparent" />

                <div className="absolute inset-x-0 bottom-0 p-5">
                  <h3 className="text-lg font-bold text-white">
                    {item.title}
                  </h3>

                  {item.subtitle && (
                    <p className="mt-1 text-sm text-white/85">
                      {item.subtitle}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}