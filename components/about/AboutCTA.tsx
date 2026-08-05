import Link from "next/link";

type Props = {
  acf: {
    about_cta_title?: string;
    about_cta_description?: string;
    about_cta_button_text?: string;
    about_cta_button_link?:
      | string
      | {
          url: string;
        };
  };
};

export default function AboutCTA({ acf }: Props) {
  const buttonLink =
    typeof acf.about_cta_button_link === "string"
      ? acf.about_cta_button_link
      : acf.about_cta_button_link?.url ?? "#";

  return (
    <section className="py-12 md:py-16">
      <div className="container mx-auto px-4">
        <div className="flex flex-col gap-8 rounded-lg border border-slate-700/50 bg-slate-800/50 p-8 md:flex-row md:items-center md:justify-between md:p-12">
          <div className="flex-1">
            <h2 className="mb-3 text-2xl font-bold text-white md:text-3xl">
              {acf.about_cta_title}
            </h2>

            <p className="text-gray-300">
              {acf.about_cta_description}
            </p>
          </div>

          <Link
            href={buttonLink}
            className="inline-block whitespace-nowrap rounded border border-white bg-slate-800 px-8 py-3 font-semibold text-white transition-colors hover:bg-slate-900"
          >
            {acf.about_cta_button_text}
          </Link>
        </div>
      </div>
    </section>
  );
}