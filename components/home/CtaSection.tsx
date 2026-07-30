import Link from 'next/link'

export default function AboutCTA() {
  return (
    <section className="py-12 md:py-16">
      <div className="container mx-auto px-4">
        <div className="bg-slate-800/50 rounded-lg border border-slate-700/50 p-8 md:p-12 flex flex-col md:flex-row md:items-center md:justify-between gap-8">
          <div className="flex-1">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
              Siap merancang sistem tampilan Anda?
            </h2>
            <p className="text-gray-300">
              Tim kami siap membantu, dari konsultasi kebutuhan hingga instalasi dan pemeliharaan.
            </p>
          </div>
          <Link
            href="/contact"
            className="inline-block px-8 py-3 bg-yellow-400 text-slate-900 font-semibold rounded hover:bg-yellow-300 transition-colors whitespace-nowrap"
          >
            Hubungi Kami
          </Link>
        </div>
      </div>
    </section>
  )
}
