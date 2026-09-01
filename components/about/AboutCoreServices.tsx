import DynamicIcon from "./DynamicIcon";

interface AboutCoreServicesProps {
  acf: Record<string, any>;
}

export default function AboutCoreServices({ acf }: AboutCoreServicesProps) {
  const eyebrow = acf.about_coreservices_eyebrow ?? "";
  const title = acf.about_coreservices_title ?? "";
  const description = acf.about_coreservices_description ?? "";
  const footnote = acf.about_coreservices_footnote ?? "";

  const services = [1, 2, 3, 4]
    .map((i) => ({
      icon: acf[`about_coreservices_service_${i}_icon`] ?? "",
      title: acf[`about_coreservices_service_${i}_title`] ?? "",
      description: acf[`about_coreservices_service_${i}_description`] ?? "",
    }))
    .filter((service) => service.title || service.description);

  if (!title && services.length === 0) {
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

        {services.length > 0 && (
          <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {services.map((service, index) => (
              <div
                key={index}
                className="rounded-2xl border bg-card p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
              >
                {service.icon && (
                  <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
                    <DynamicIcon
                      name={service.icon}
                      className="h-7 w-7 text-primary"
                    />
                  </div>
                )}

                <h3 className="mb-2 text-lg font-semibold text-foreground">
                  {service.title}
                </h3>

                <p className="text-sm text-muted-foreground">
                  {service.description}
                </p>
              </div>
            ))}
          </div>
        )}

        {footnote && (
          <p className="mt-10 text-sm text-muted-foreground">{footnote}</p>
        )}
      </div>
    </section>
  );
}