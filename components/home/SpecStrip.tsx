export default function SpecStrip() {
  const specs = [
    { title: 'P0.9375', desc: 'BYH Pro COB' },
    { title: 'P1.25', desc: 'BTQ Fine-Pitch' },
    { title: 'P2.6', desc: 'BSL-A Series' },
    { title: '700 nits', desc: 'SR Series Signage' },
    { title: '4K UHD', desc: 'Interactive Flat Panel' },
    { title: '7×24', desc: 'Operasi Nonstop' },
    { title: '40-Point', desc: 'Multi-Touch' },
  ]

  return (
    <section className="bg-card border-y border-border py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-6 md:gap-4">
          {specs.map((spec, idx) => (
            <div key={idx} className="text-center py-4">
              <div className="text-lg md:text-xl font-bold text-primary mb-1">
                {spec.title}
              </div>
              <p className="text-xs md:text-sm text-muted-foreground">
                {spec.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
