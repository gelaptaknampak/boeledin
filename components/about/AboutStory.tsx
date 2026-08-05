type Props = {
  acf: any;
};

export default function AboutStory({ acf }: Props) {
  return (
    <section className="bg-accent/10 py-16 md:py-24 lg:py-28">
      <div className="container mx-auto px-4">
        <div className="grid items-start gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:gap-16">
          {/* Story */}
          <div>
            <h2 className="mb-8 text-3xl font-bold leading-tight text-foreground md:text-4xl">
              {acf.about_story_title}
            </h2>

            <div className="space-y-6 text-base leading-8 text-foreground/80 md:text-lg">
              <p>{acf.about_story_paragraph_1}</p>

              <p>{acf.about_story_paragraph_2}</p>

              <p>{acf.about_story_paragraph_3}</p>
            </div>
          </div>

          {/* Vision & Mission */}
          <div className="rounded-2xl border border-border bg-card p-8 shadow-lg lg:p-10">
            {/* Vision */}
            <div>
              <div className="mb-4 inline-flex rounded-full border border-primary/20 bg-primary/10 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-primary">
                {acf.about_story_vision_title}
              </div>

              <p className="text-base leading-8 text-foreground md:text-lg">
                {acf.about_story_vision}
              </p>
            </div>

            <div className="my-8 border-t border-border" />

            {/* Mission */}
            <div>
              <div className="mb-4 inline-flex rounded-full border border-primary/20 bg-primary/10 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-primary">
                {acf.about_story_mission_title}
              </div>

              <p className="text-base leading-8 text-foreground/90">
                {acf.about_story_mission}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}