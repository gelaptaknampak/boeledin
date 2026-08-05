type Props = {
  acf: any;
};

export default function AboutStats({ acf }: Props) {
  const stats = [
    {
      number: acf.about_stat_number_1,
      label: acf.about_stat_label_1,
    },
    {
      number: acf.about_stat_number_2,
      label: acf.about_stat_label_2,
    },
    {
      number: acf.about_stat_number_3,
      label: acf.about_stat_label_3,
    },
    {
      number: acf.about_stat_number_4,
      label: acf.about_stat_label_4,
    },
  ];

  return (
    <section className="py-16 md:py-20 lg:py-24">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4 lg:gap-8">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="rounded-2xl border border-border bg-card p-6 text-center shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg md:p-8"
            >
              <div className="mb-3 text-3xl font-bold text-primary sm:text-4xl lg:text-5xl">
                {stat.number}
              </div>

              <p className="mx-auto max-w-[180px] text-sm font-medium leading-6 text-foreground/80 sm:text-base">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}