export default function AboutHero() {
  return (
    <section className="py-12 md:py-20 bg-gradient-to-b from-accent to-background">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-block mb-4 px-4 py-2 bg-blue-950 text-blue-300 rounded-full text-sm font-semibold">
              Tentang Kami
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Memelopori teknologi display di Indonesia.
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Kami berkomitmen menghadirkan solusi tampilan digital dan
              semikonduktor yang inovatif mengubah cara industri berkomunikasi
              dan menyampaikan informasi.
            </p>
          </div>
          <div className="bg-accent rounded-lg overflow-hidden h-80 md:h-96">
            <div className="w-full h-full bg-gradient-to-br from-blue-200 to-blue-100 flex items-center justify-center">
              <span className="text-muted-foreground">
                Instalasi Command Center
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
