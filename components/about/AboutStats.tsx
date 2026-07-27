export default function AboutStats() {
  return (
    <section className="py-16 md:py-20">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="text-center">
            <div className="text-4xl md:text-5xl font-bold text-primary mb-2">10+</div>
            <p className="text-muted-foreground text-sm">Tahun Keunggulan</p>
          </div>
          <div className="text-center">
            <div className="text-4xl md:text-5xl font-bold text-primary mb-2">500+</div>
            <p className="text-muted-foreground text-sm">Karyawan</p>
          </div>
          <div className="text-center">
            <div className="text-4xl md:text-5xl font-bold text-primary mb-2">100+</div>
            <p className="text-muted-foreground text-sm">Mitra</p>
          </div>
          <div className="text-center">
            <div className="text-4xl md:text-5xl font-bold text-primary mb-2">10M+</div>
            <p className="text-muted-foreground text-sm">Produk Terkirim</p>
          </div>
        </div>
      </div>
    </section>
  )
}
