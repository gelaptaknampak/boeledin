"use client";

import {
  Zap,
  Settings,
  Grid3X3,
  Lightbulb,
  Sparkles,
  Shield,
  Users,
  Building2,
  Target,
  HeartHandshake,
  Globe,
  Award,
} from "lucide-react";

type Props = {
  acf: any;
};

const icons = {
  Zap,
  Settings,
  Grid3X3,
  Lightbulb,
  Sparkles,
  Shield,
  Users,
  Building2,
  Target,
  HeartHandshake,
  Globe,
  Award,
};

export default function AboutValues({ acf }: Props) {
  const values = [
    {
      title: acf.about_value_1_title,
      desc: acf.about_value_1_description,
      icon: icons[acf.about_value_1_icon as keyof typeof icons] ?? Sparkles,
    },
    {
      title: acf.about_value_2_title,
      desc: acf.about_value_2_description,
      icon: icons[acf.about_value_2_icon as keyof typeof icons] ?? Shield,
    },
    {
      title: acf.about_value_3_title,
      desc: acf.about_value_3_description,
      icon: icons[acf.about_value_3_icon as keyof typeof icons] ?? Users,
    },
  ];

  return (
    <section className="bg-accent/10 py-16 md:py-24 lg:py-28">
      <div className="container mx-auto px-4">
        {/* Heading */}
        <div className="mb-12 max-w-3xl lg:mb-16">
          <div className="mb-5 inline-flex rounded-full border border-primary/20 bg-primary/10 px-5 py-2 text-sm font-semibold text-primary">
            {acf.about_values_eyebrow}
          </div>

          <h2 className="text-3xl font-bold leading-tight text-foreground md:text-4xl lg:text-5xl">
            {acf.about_values_title}
          </h2>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
          {values.map((value, idx) => {
            const Icon = value.icon;

            return (
              <div
                key={idx}
                className="group flex h-full flex-col rounded-2xl border border-border bg-card p-8 shadow-sm transition-all duration-300 hover:-translate-y-2 hover:border-primary/30 hover:shadow-xl"
              >
                <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/15 to-primary/5 transition-transform duration-300 group-hover:scale-110">
                  <Icon className="h-8 w-8 text-primary" />
                </div>

                <h3 className="mb-4 text-xl font-semibold text-foreground">
                  {value.title}
                </h3>

                <p className="flex-1 text-base leading-7 text-foreground/80">
                  {value.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}