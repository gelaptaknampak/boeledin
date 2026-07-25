export default function NewsHero() {
  return (
    <section className="py-12 md:py-16 bg-gradient-to-b from-accent to-background">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl">
          <div className="inline-block mb-4 px-4 py-2 bg-blue-950 text-blue-300 rounded-full text-sm font-semibold">
            Wawasan & Berita
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Wawasan Teknologi Display
          </h1>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Artikel dan panduan seputar LED display, interactive flat panel, digital signage, dan perkembangan teknologi tampilan terkini.
          </p>
        </div>
      </div>
    </section>
  )
}
