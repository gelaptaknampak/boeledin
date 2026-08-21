import { Eye, Target } from "lucide-react";

type Props = {
  acf: any;
};

export default function AboutStory({ acf = {} }: Props) {
  /**
   * Paragraf yang kosong difilter, dan paragraf
   * pertama diberi gaya "lead" supaya ada hierarki
   * visual, tidak flat sama besar semua.
   */
  const paragraphs: string[] = [
    acf.about_story_paragraph_1,
    acf.about_story_paragraph_2,
    acf.about_story_paragraph_3,
  ].filter(Boolean);

  const hasVision = Boolean(acf.about_story_vision);
  const hasMission = Boolean(acf.about_story_mission);

  return (
    <section className="bg-accent/10 py-16 md:py-24 lg:py-28">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid items-start gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:gap-14">
          {/* ========================================
              STORY
          ======================================== */}

          <div>
            {acf.about_story_eyebrow && (
              <div className="mb-5 inline-flex rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5 text-xs font-semibold text-primary sm:px-5 sm:py-2 sm:text-sm">
                {acf.about_story_eyebrow}
              </div>
            )}

            {acf.about_story_title && (
              <h2 className="mb-6 text-2xl font-bold leading-tight text-foreground sm:text-3xl md:mb-8 md:text-4xl">
                {acf.about_story_title}
              </h2>
            )}

            <div className="space-y-5 sm:space-y-6">
              {paragraphs.map((paragraph, idx) =>
                idx === 0 ? (
                  <p
                    key={`story-p-${idx}`}
                    className="text-lg font-medium leading-8 text-foreground sm:text-xl sm:leading-9"
                  >
                    {paragraph}
                  </p>
                ) : (
                  <p
                    key={`story-p-${idx}`}
                    className="text-base leading-7 text-foreground/80 sm:text-lg sm:leading-8"
                  >
                    {paragraph}
                  </p>
                ),
              )}
            </div>
          </div>

          {/* ========================================
              VISION & MISSION
              ========================================
              Dipecah jadi 2 card terpisah dengan ikon,
              bukan 1 card panjang yang dibagi garis lagi.
          ======================================== */}

          <div className="space-y-5 sm:space-y-6">
            {hasVision && (
              <div className="rounded-2xl border border-l-4 border-border border-l-primary bg-card p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg sm:p-7 lg:p-8">
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <Eye className="h-5 w-5" />
                  </div>

                  <span className="text-xs font-semibold uppercase tracking-wider text-primary sm:text-sm">
                    {acf.about_story_vision_title || "Our Vision"}
                  </span>
                </div>

                <p className="text-base leading-7 text-foreground/85 sm:text-lg sm:leading-8">
                  {acf.about_story_vision}
                </p>
              </div>
            )}

            {hasMission && (
              <div className="rounded-2xl border border-l-4 border-border border-l-primary bg-card p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg sm:p-7 lg:p-8">
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <Target className="h-5 w-5" />
                  </div>

                  <span className="text-xs font-semibold uppercase tracking-wider text-primary sm:text-sm">
                    {acf.about_story_mission_title || "Our Mission"}
                  </span>
                </div>

                <p className="text-base leading-7 text-foreground/85 sm:text-lg sm:leading-8">
                  {acf.about_story_mission}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}