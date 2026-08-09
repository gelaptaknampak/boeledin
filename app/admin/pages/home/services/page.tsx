import { getPostById } from "@/lib/wordpress";
import type { LangCode } from "@/lib/wordpress";

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

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ lang?: string | string[] }>;
}) {
  const config = homeSectionConfig.services;

  // IMPORTANT: searchParams harus di-await
  const params = await searchParams;

  const rawLang = Array.isArray(params.lang)
    ? params.lang[0]
    : params.lang;

  const lang: LangCode = rawLang === "en" ? "en" : "id";

  console.log("=== Home PAGE ===");
  console.log("rawLang:", rawLang);
  console.log("lang:", lang);

  // Ambil ID sesuai bahasa
  const postId = config.id[lang];

  console.log("postId:", postId);

  if (!postId) {
    throw new Error(
      `Post Home untuk bahasa ${lang} belum dikonfigurasi`
    );
  }

  const post = await getPostById(postId, lang);

  console.log("POST:", post);

  if (!post) {
    throw new Error(
      `Home section untuk bahasa ${lang} tidak ditemukan`
    );
  }

  const acf = post.acf ?? {};

  const data: any = {};

  config.fields.forEach((field) => {
    let value = acf[field.acf];

    if (
      // field.type === "link" &&
      value &&
      typeof value === "object"
    ) {
      value = value.url;
    }

    setValue(data, field.name, value ?? "");
  });

  return (
    <SectionForm
      data={data}
      config={{
        ...config,

        // SectionForm butuh ID POST aktual
        id: postId,
      }}
    />
  );
}