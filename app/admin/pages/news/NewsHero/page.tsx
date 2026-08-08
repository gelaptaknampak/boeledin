import { getPostById } from "@/lib/wordpress";

import SectionForm from "@/components/admin/sections/SectionForm";
import { newsSectionConfig } from "@/components/admin/sections/sectionConfig";

function getValue(obj: any, path: string) {
  return path.split(".").reduce((acc, key) => {
    if (acc == null) return "";

    if (/^\d+$/.test(key)) {
      return acc[Number(key)];
    }

    return acc[key];
  }, obj);
}

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

export default async function NewsHeroPage({
  searchParams,
}: {
  searchParams: { lang?: string | string[] };
}) {
  const config = newsSectionConfig.hero;
  const lang = Array.isArray(searchParams.lang)
    ? searchParams.lang[0]
    : searchParams.lang || "id";

  const post = await getPostById(config.id, lang);

  if (!post) {
    throw new Error("News Hero section tidak ditemukan");
  }

  const acf = post.acf ?? {};

  const data: any = {};

  config.fields.forEach((field) => {
    let value = acf[field.acf];

    // if (field.type === "link" && value && typeof value === "object") {
    //   value = value.url;
    // }

    setValue(data, field.name, value ?? "");
  });

  return <SectionForm data={data} config={config} />;
}
