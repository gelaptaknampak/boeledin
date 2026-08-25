import { getPostById } from "@/lib/wordpress";
import type { LangCode } from "@/lib/wordpress";

import SectionForm from "@/components/admin/sections/SectionForm";
import { footerSectionConfig } from "@/components/admin/sections/sectionConfig";

/**
 * Tipe umum buat 1 field config, dipakai eksplisit di loop
 * bawah supaya `field.type` selalu berupa `string` biasa --
 * bukan union literal sempit hasil `as const` di sectionConfig
 * (yang beda-beda tergantung field apa aja yang ADA di config
 * masing-masing section). Kalau nggak gini, perbandingan kayak
 * `field.type === "link"` bisa di-flag TypeScript sebagai
 * "mustahil" khusus buat section yang kebetulan nggak punya
 * field bertipe "link" sama sekali (misal Footer).
 */
type SectionField = {
  name: string;
  label?: string;
  type: string;
  acf: string;
  [key: string]: any;
};

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
  searchParams: Promise<{
    lang?: string | string[];
  }>;
}) {
  const params = await searchParams;

  const rawLang = Array.isArray(params.lang) ? params.lang[0] : params.lang;

  const lang: LangCode = rawLang === "en" ? "en" : "id";

  const config = footerSectionConfig.footer;

  const postId = config.id[lang];

  console.log("ADMIN FOOTER LANG:", lang);

  console.log("ADMIN FOOTER ID:", postId);

  const post = await getPostById(postId, lang);

  if (!post) {
    throw new Error("Footer tidak ditemukan");
  }

  const acf = post.acf ?? {};

  const data: any = {};

  config.fields.forEach((field: SectionField) => {
    let value = acf[field.acf];

    // JSON LIST
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

    // IMAGE ID
    if (field.type === "image") {
      if (value && typeof value === "object") {
        value = value.id ?? "";
      }
    }

    // LINK OBJECT
    //
    // Cuma jalan buat field yang type-nya beneran "link" --
    // sebelumnya kondisi ini cuma cek `typeof value === "object"`,
    // yang juga ke-trigger buat ARRAY (array typeof-nya "object"
    // juga di JS), jadi field "-list" kayak social_media_list
    // yang udah bener jadi array di atas malah ke-reset jadi ""
    // di sini.
    if (field.type === "link" && value && typeof value === "object") {
      value = value.url ?? "";
    }

    setValue(data, field.name, value ?? "");
  });

  return (
    <SectionForm
      data={data}
      config={{
        ...config,

        // kirim ID aktif bahasa ini
        id: post.id,
      }}
    />
  );
}
