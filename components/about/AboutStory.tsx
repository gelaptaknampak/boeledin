export default function AboutStory() {
  return (
    <section className="py-16 md:py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Story */}
          <div className="lg:col-span-2">
            <h2 className="text-3xl md:text-4xl font-bold mb-8">Cerita Kami</h2>
            <div className="space-y-6 text-muted-foreground leading-relaxed">
              <p>
                BOELEDIN Indonesia — sebuah unit usaha di bawah PT Future Boeled Indonesia — didirikan dengan visi menjadi penyedia solusi teknologi display terkemuka di Asia Tenggara. Sebagai bagian dari jaringan global BOE Technology Group, kami menghadirkan inovasi kelas dunia ke pasar Indonesia.
              </p>
              <p>
                Komitmen kami pada riset dan pengembangan menempatkan kami di garis depan teknologi semikonduktor display, inovasi MLED, solusi sensor, konektivitas IoT, dan aplikasi smart healthcare.
              </p>
              <p>
                Hari ini, kami melayani berbagai industri — mulai dari fasilitas publik seperti bandara, korporasi, ritel, hingga instansi pemerintah — dengan solusi yang memenuhi standar kualitas dan performa tertinggi.
              </p>
            </div>
          </div>

          {/* Vision & Mission */}
          <div className="space-y-8">
            <div className="bg-card border border-border p-8 rounded-lg">
              <div className="inline-block mb-4 px-3 py-1 bg-accent rounded-full text-sm font-semibold text-primary">
                Visi
              </div>
              <p className="text-foreground leading-relaxed">
                Menjadi mitra teknologi tampilan yang paling terpercaya dan inovatif di Indonesia, memungkinkan bisnis dan konsumen mengalami masa depan teknologi visual hari ini.
              </p>
            </div>

            <div className="bg-card border border-border p-8 rounded-lg">
              <div className="inline-block mb-4 px-3 py-1 bg-accent rounded-full text-sm font-semibold text-primary">
                Misi
              </div>
              <p className="text-foreground leading-relaxed">
                Menghadirkan solusi display dan semikonduktor mutakhir yang mendorong inovasi, meningkatkan pengalaman pengguna, dan menciptakan nilai jangka panjang bagi klien serta mitra kami.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="mt-16 pt-16 border-t border-border">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { num: '10+', label: 'Tahun Keunggulan' },
              { num: '500+', label: 'Karyawan' },
              { num: '100+', label: 'Mitra' },
              { num: '10M+', label: 'Produk Terkirim' },
            ].map((stat, idx) => (
              <div key={idx} className="text-center">
                <div className="text-4xl font-bold text-primary mb-2">{stat.num}</div>
                <p className="text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
