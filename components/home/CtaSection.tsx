import Link from "next/link";

interface CtaSectionProps {
  data?: {
    cta_title?: string;
    cta_sub?: string;
    cta_button_text?: string;
    cta_button_link?: string;
  };
}

export default function CtaSection({ data }: CtaSectionProps) {
  return (
    <section className="py-12 md:py-16">
      <div className="container mx-auto px-4">
        <div className="bg-slate-800/50 rounded-lg border border-slate-700/50 p-8 md:p-12 flex flex-col md:flex-row md:items-center md:justify-between gap-8">
          <div className="flex-1">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
              {data?.cta_title || "Siap merancang sistem tampilan Anda?"}
            </h2>

            <p className="text-gray-300">
              {data?.cta_sub ||
                "Tim kami siap membantu, dari konsultasi kebutuhan hingga instalasi dan pemeliharaan."}
            </p>
          </div>

          <Link
            href={data?.cta_button_link || "/contact"}
            className="inline-block px-8 py-3 bg-slate-800 border-white border-1 text-white font-semibold rounded hover:bg-slate-900 transition-colors whitespace-nowrap"
          >
            {data?.cta_button_text || "Hubungi Kami"}
          </Link>
        </div>
      </div>
    </section>
  );
}
