import { CheckCircle2 } from 'lucide-react'

export default function AboutValues() {
  const values = [
    { title: 'Inovasi', desc: 'Kami terus mendorong batasan teknologi display untuk menciptakan solusi yang lebih baik dan lebih efisien.' },
    { title: 'Kualitas', desc: 'Setiap produk melalui kontrol kualitas ketat untuk memastikan performa dan daya tahan optimal.' },
    { title: 'Keandalan', desc: 'Sistem kami dirancang untuk operasi 24/7 tanpa kompromi pada performa atau keamanan.' },
    { title: 'Kolaborasi', desc: 'Kami bekerja sama dengan klien untuk memahami kebutuhan mereka dan memberikan solusi custom.' },
    { title: 'Keberlanjutan', desc: 'Komitmen kami terhadap praktik ramah lingkungan dalam manufaktur dan operasi.' },
    { title: 'Kepercayaan', desc: 'Transparansi dan integritas adalah fondasi hubungan kami dengan semua stakeholder.' },
  ]

  return (
    <section className="py-16 md:py-24 bg-card border-t border-border">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <div className="inline-block mb-4 px-4 py-2 bg-accent rounded-full text-sm font-semibold text-primary">
            Nilai Inti
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Prinsip yang memandu setiap langkah kami
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {values.map((value, idx) => (
            <div key={idx} className="p-8 bg-background border border-border rounded-lg hover:border-primary transition-colors">
              <div className="flex items-start gap-4">
                <CheckCircle2 className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-lg font-semibold mb-3">{value.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{value.desc}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
