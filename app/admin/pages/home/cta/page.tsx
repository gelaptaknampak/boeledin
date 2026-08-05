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

export default async function CtaPage() {
  const config = homeSectionConfig.cta;

  const post = await getPostById(config.id);

  if (!post) {
    throw new Error("CTA section tidak ditemukan");
  }

  const acf = post.acf ?? {};

  const data: any = {};

  config.fields.forEach((field) => {
    let value = acf[field.acf];

    if (field.type === "link" && value && typeof value === "object") {
      value = value.url;
    }

    // if (field.type === "image" && value && typeof value === "object") {
    //   value = value.id ?? value.url ?? "";
    // }

    setValue(data, field.name, value ?? "");
  });

  return <SectionForm data={data} config={config} />;
}
