import { getPostById } from "@/lib/wordpress";

import SectionForm from "@/components/admin/sections/SectionForm";
import { homeSectionConfig } from "@/components/admin/sections/sectionConfig";

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

export default async function StatPage({
  searchParams,
}: {
  searchParams: { lang?: string | string[] };
}) {
  const config = homeSectionConfig.stat;
  const lang = Array.isArray(searchParams.lang)
    ? searchParams.lang[0]
    : searchParams.lang || "id";

  const post = await getPostById(config.id, lang);

  if (!post) {
    throw new Error("Statistics section tidak ditemukan");
  }

  const acf = post.acf ?? {};

  const data: any = {};

  config.fields.forEach((field) => {
    let value = acf[field.acf];

    // Link ACF
    // if (field.type === "link" && value && typeof value === "object") {
    //   value = value.url;
    // }

    // // Image ACF (kalau suatu saat dipakai)
    // if (field.type === "image" && value && typeof value === "object") {
    //   value = value.url ?? value.id ?? "";
    // }

    // Brand List JSON
    if (field.type === "brand-list") {
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
