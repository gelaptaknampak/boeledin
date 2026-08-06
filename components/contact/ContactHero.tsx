type Props = {
  acf: any;
};

export default function ContactHero({ acf }: Props) {
  return (
    <section className="py-12 md:py-16 bg-gradient-to-b from-accent to-background">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl">
          <div className="inline-block mb-4 px-4 py-2 bg-blue-950 text-blue-300 rounded-full text-sm font-semibold">
            {acf?.hero_badge ?? "Hubungi Kami"}
          </div>

          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            {acf?.hero_title ?? "Mari diskusikan proyek Anda."}
          </h1>

          <p className="text-lg text-muted-foreground leading-relaxed">
            {acf?.hero_description ??
              "Kirimkan pertanyaan atau kebutuhan proyek Anda, tim kami akan merespons dalam 1×24 jam kerja."}
          </p>
        </div>
      </div>
    </section>
  );
}