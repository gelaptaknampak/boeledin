type Props = {
  acf: any;
};

export default function AboutJourney({ acf }: Props) {
  const milestones = [
    {
      year: acf.about_journey_year_1,
      title: acf.about_journey_title_1,
      desc: acf.about_journey_desc_1,
    },
    {
      year: acf.about_journey_year_2,
      title: acf.about_journey_title_2,
      desc: acf.about_journey_desc_2,
    },
    {
      year: acf.about_journey_year_3,
      title: acf.about_journey_title_3,
      desc: acf.about_journey_desc_3,
    },
    {
      year: acf.about_journey_year_4,
      title: acf.about_journey_title_4,
      desc: acf.about_journey_desc_4,
    },
  ].filter((item) => item.year || item.title || item.desc);

  return (
    <section className="py-16 md:py-24 lg:py-28">
      <div className="container mx-auto px-4">
        {/* Heading */}
        <div className="mb-12 max-w-3xl lg:mb-16">
          <div className="mb-5 inline-flex rounded-full border border-primary/20 bg-primary/10 px-5 py-2 text-sm font-semibold text-primary">
            {acf.about_journey_badge}
          </div>

          <h2 className="text-3xl font-bold leading-tight text-foreground md:text-4xl lg:text-5xl">
            {acf.about_journey_title}
          </h2>
        </div>

        {/* Timeline */}
        <div className="relative ml-3 border-l-2 border-primary/20 md:ml-6">
          {milestones.map((milestone, idx) => (
            <div
              key={idx}
              className="group relative mb-10 pl-8 md:pl-12 last:mb-0"
            >
              {/* Timeline Dot */}
              <div className="absolute -left-[11px] top-2 h-5 w-5 rounded-full border-4 border-background bg-primary transition-transform duration-300 group-hover:scale-125" />

              {/* Card */}
              <div className="rounded-2xl border border-border bg-card p-6 shadow-sm transition-all duration-300 group-hover:-translate-y-1 group-hover:border-primary/30 group-hover:shadow-lg md:p-8">
                <span className="mb-3 inline-flex rounded-full bg-primary/10 px-3 py-1 text-sm font-semibold text-primary">
                  {milestone.year}
                </span>

                <h3 className="mb-3 text-xl font-semibold text-foreground">
                  {milestone.title}
                </h3>

                <p className="text-base leading-7 text-foreground/80">
                  {milestone.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}