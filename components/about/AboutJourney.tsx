export default function AboutJourney() {
  const milestones = [
    {
      year: '2014',
      title: 'Didirikan di Jakarta',
      desc: 'PT Future Boeled Indonesia berdiri dengan fokus pada distribusi dan integrasi display digital.',
    },
    {
      year: '2018',
      title: 'Kemitraan Strategis dengan BOE Technology Group',
      desc: 'Memperluas akses ke lini produk MLED, digital signage, dan interactive flat panel kelas dunia.',
    },
    {
      year: '2021',
      title: 'Implementasi FIDS di Bandara Internasional',
      desc: 'Memasang Flight Information Display System di Bandara Internasional Sultan Mahmud Badaruddin II.',
    },
    {
      year: '2026',
      title: 'Ekspansi Command Center & Immersive Experience',
      desc: 'Meluncurkan lini solusi command center dan instalasi LED immersive untuk sektor korporasi dan pemerintah.',
    },
  ]

  return (
    <section className="py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="mb-16">
          <div className="inline-block mb-4 px-4 py-2 bg-accent rounded-full text-sm font-semibold text-primary">
            Perjalanan Kami
          </div>
          <h2 className="text-3xl md:text-4xl font-bold">
            Tonggak sejarah
          </h2>
        </div>

        <div className="space-y-8">
          {milestones.map((milestone, idx) => (
            <div key={idx} className="border-l-2 border-primary pl-8 pb-8 last:pb-0">
              <div className="text-sm font-mono text-accent-2 mb-2">{milestone.year}</div>
              <h3 className="text-lg font-semibold mb-2">{milestone.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{milestone.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
