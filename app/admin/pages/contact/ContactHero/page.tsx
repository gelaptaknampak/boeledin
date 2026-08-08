import { getPostById } from "@/lib/wordpress";

import SectionForm from "@/components/admin/sections/SectionForm";
import { contactSectionConfig } from "@/components/admin/sections/sectionConfig";

function setValue(obj: any, path: string, value: any) {
  const keys = path.split(".");

  let current = obj;

  keys.forEach((key, index) => {
    const last = index === keys.length - 1;
    const next = keys[index + 1];

    if (last) {
      current[key] = value;
      return;
    }

    if (!(key in current)) {
      current[key] = /^\d+$/.test(next) ? [] : {};
    }

    current = current[key];
  });
}

export default async function ContactHeroPage({
  searchParams,
}: {
  searchParams: { lang?: string | string[] };
}) {
  const config = contactSectionConfig.hero;
  const lang = Array.isArray(searchParams.lang)
    ? searchParams.lang[0]
    : searchParams.lang || "id";

  const post = await getPostById(config.id, lang);

  if (!post) {
    throw new Error("Contact Hero tidak ditemukan");
  }

  const acf = post.acf ?? {};

  const data: any = {};

  config.fields.forEach((field) => {
    setValue(data, field.name, acf[field.acf] ?? "");
  });

  return <SectionForm data={data} config={config} />;
}
