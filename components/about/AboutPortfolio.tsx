import Image from "next/image";

interface AboutPortfolioProps {
  acf: Record<string, any>;
}

type ResolvedImage = { url: string; alt: string };

// Sesuaikan kalau kamu punya env var lain buat base URL WordPress-nya
const WORDPRESS_URL =
  process.env.WORDPRESS_API_URL ?? "https://wp.boeledin.com";

/**
 * Kalau raw value ternyata udah berupa URL string atau ACF image array
 * (bukan ID), langsung pakai tanpa perlu fetch tambahan.
 */
function extractInlineImage(raw: any): ResolvedImage | null {
  if (!raw) return null;

  if (typeof raw === "string" && raw.startsWith("http")) {
    return { url: raw, alt: "" };
  }

  if (typeof raw === "object" && raw.url) {
    return { url: raw.url, alt: raw.alt ?? "" };
  }

  return null;
}

/**
 * Resolve banyak attachment ID sekaligus jadi { id: { url, alt } }
 * lewat WordPress REST API publik (wp-json/wp/v2/media?include=...).
 */
async function resolveImagesByIds(
  ids: number[],
): Promise<Record<number, ResolvedImage>> {
  if (ids.length === 0) return {};

  try {
    const res = await fetch(
      `${WORDPRESS_URL}/wp-json/wp/v2/media?include=${ids.join(
        ",",
      )}&per_page=${ids.length}`,
      {
        // cache 1 jam, sesuaikan kalau butuh lebih fresh/lebih statis
        next: { revalidate: 3600 },
      },
    );

    if (!res.ok) {
      console.error("[AboutPortfolio] Gagal fetch media by IDs:", res.status);
      return {};
    }

    const mediaList = await res.json();

    const map: Record<number, ResolvedImage> = {};

    for (const media of mediaList) {
      map[media.id] = {
        url: media.source_url ?? "",
        alt: media.alt_text ?? "",
      };
    }

    return map;
  } catch (error) {
    console.error("[AboutPortfolio] Error fetch media by IDs:", error);
    return {};
  }
}

export default async function AboutPortfolio({ acf }: AboutPortfolioProps) {
  const eyebrow = acf.about_portfolio_eyebrow ?? "";
  const title = acf.about_portfolio_title ?? "";
  const description = acf.about_portfolio_description ?? "";

  const rawItems = [1, 2, 3, 4, 5, 6].map((i) => ({
    iconRaw: acf[`about_portfolio_item_${i}_icon`],
    title: acf[`about_portfolio_item_${i}_title`] ?? "",
    subtitle: acf[`about_portfolio_item_${i}_subtitle`] ?? "",
  }));

  // Kumpulin ID yang beneran perlu di-resolve lewat fetch
  // (yang udah berupa URL/object langsung dilewatin, gak usah di-fetch)
  const idsToResolve = rawItems
    .filter((item) => !extractInlineImage(item.iconRaw))
    .map((item) => Number(item.iconRaw))
    .filter((id) => Number.isFinite(id) && id > 0);

  const imageMap = await resolveImagesByIds(idsToResolve);

  const items = rawItems
    .map((item) => {
      const inline = extractInlineImage(item.iconRaw);

      const image: ResolvedImage = inline ??
        imageMap[Number(item.iconRaw)] ?? { url: "", alt: "" };

      return {
        image,
        title: item.title,
        subtitle: item.subtitle,
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
                  <h3 className="text-lg font-bold text-white">{item.title}</h3>

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
