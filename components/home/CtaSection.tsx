import Link from 'next/link'

export default function CtaSection() {
  return (
    <section className="py-16 md:py-24 bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-6 max-w-2xl mx-auto">
          Siap untuk mengubah komunikasi visual Anda?
        </h2>
        <p className="text-lg opacity-90 mb-8 max-w-xl mx-auto">
          Hubungi tim kami hari ini untuk konsultasi gratis dan temukan solusi display yang sempurna untuk kebutuhan Anda.
        </p>
        <Link
          href="/contact"
          className="inline-block px-8 py-4 bg-primary-foreground text-primary font-semibold rounded-lg hover:bg-opacity-90 transition-all transform hover:scale-105"
        >
          Konsultasi Gratis Sekarang
        </Link>
      </div>
    </section>
  )
}
