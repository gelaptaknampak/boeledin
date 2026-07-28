export default function AboutStory() {
  return (
    <section className="py-16 md:py-24 bg-accent/5">
      <div className="container mx-auto px-4">
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1.1fr 0.9fr",
            gap: "56px",
            alignItems: "flex-start",
          }}
        >
          {/* Story */}
          <div>
            <h2 className="text-xl md:text-3xl font-bold mb-6">Cerita Kami</h2>
            <div className="space-y-6 text-muted-foreground leading-relaxed">
              <p>
                BOELEDIN Indonesia sebuah unit usaha di bawah PT Future Boeled
                Indonesia didirikan dengan visi menjadi penyedia solusi
                teknologi display terkemuka di Asia Tenggara. Sebagai bagian
                dari jaringan global BOE Technology Group, kami menghadirkan
                inovasi kelas dunia ke pasar Indonesia.
              </p>
              <p>
                Komitmen kami pada riset dan pengembangan menempatkan kami di
                garis depan teknologi semikonduktor display, inovasi MLED,
                solusi sensor, konektivitas IoT, dan aplikasi smart healthcare.
              </p>
              <p>
                Hari ini, kami melayani berbagai industri mulai dari fasilitas
                publik seperti bandara, korporasi, ritel, hingga instansi
                pemerintah dengan solusi yang memenuhi standar kualitas dan
                performa tertinggi.
              </p>
            </div>
          </div>

          {/* Vision & Mission Card */}
          <div className="bg-card border border-border p-8 rounded-lg">
            <div className="mb-6">
              <div className="inline-block mb-3 px-3 py-1 bg-accent rounded-full text-xs font-semibold text-primary uppercase tracking-wider">
                Visi
              </div>
              <p className="text-foreground text-lg leading-relaxed">
                Menjadi mitra teknologi tampilan yang paling terpercaya dan
                inovatif di Indonesia, memungkinkan bisnis dan konsumen
                mengalami masa depan teknologi visual hari ini.
              </p>
            </div>

            <div className="h-px bg-border my-6" />

            <div>
              <div className="inline-block mb-3 px-3 py-1 bg-accent rounded-full text-xs font-semibold text-primary uppercase tracking-wider">
                Misi
              </div>
              <p className="text-foreground text-sm leading-relaxed">
                Menghadirkan solusi display dan semikonduktor mutakhir yang
                mendorong inovasi, meningkatkan pengalaman pengguna, dan
                menciptakan nilai jangka panjang bagi klien serta mitra kami.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
