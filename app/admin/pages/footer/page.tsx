import { getPostById } from "@/lib/wordpress";

import SectionForm from "@/components/admin/sections/SectionForm";
import { footerSectionConfig } from "@/components/admin/sections/sectionConfig";

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

export default async function FooterFormPage({
  searchParams,
}: {
  searchParams: { lang?: string | string[] };
}) {
  const config = footerSectionConfig.footer;
  const lang = Array.isArray(searchParams.lang)
    ? searchParams.lang[0]
    : searchParams.lang || "id";

  const post = await getPostById(config.id, lang);

  if (!post) {
    throw new Error("Footer tidak ditemukan");
  }

  const acf = post.acf ?? {};

  const data: any = {};

  config.fields.forEach((field) => {
    let value = acf[field.acf];

    // Parse semua field bertipe *-list (brand-list, social-media-list, dll)
    if (typeof field.type === "string" && field.type.endsWith("-list")) {
      try {
        if (typeof value === "string") {
          value = value ? JSON.parse(value) : [];
        }

        if (!Array.isArray(value)) {
          value = [];
        }
      } catch {
        value = [];
      }
    }

    setValue(data, field.name, value ?? "");
  });

  return <SectionForm data={data} config={config} />;
}
