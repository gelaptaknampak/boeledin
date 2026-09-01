import DynamicIcon from "./DynamicIcon";

interface AboutIndustriesProps {
  acf: Record<string, any>;
}

export default function AboutIndustries({ acf }: AboutIndustriesProps) {
  const eyebrow = acf.about_industries_eyebrow ?? "";
  const title = acf.about_industries_title ?? "";
  const description = acf.about_industries_description ?? "";

  const industries = [1, 2, 3, 4, 5]
    .map((i) => ({
      icon: acf[`about_industries_item_${i}_icon`] ?? "",
      title: acf[`about_industries_item_${i}_title`] ?? "",
      description: acf[`about_industries_item_${i}_description`] ?? "",
    }))
    .filter((item) => item.title || item.description);

  if (!title && industries.length === 0) {
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

        {industries.length > 0 && (
          <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-5">
            {industries.map((industry, index) => (
              <div
                key={index}
                className="rounded-2xl border bg-card p-6 text-center shadow-sm transition hover:-translate-y-1 hover:shadow-md"
              >
                {industry.icon && (
                  <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
                    <DynamicIcon
                      name={industry.icon}
                      className="h-7 w-7 text-primary"
                    />
                  </div>
                )}

                <h3 className="mb-2 text-base font-semibold text-foreground">
                  {industry.title}
                </h3>

                <p className="text-sm text-muted-foreground">
                  {industry.description}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}