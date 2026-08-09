import { getPostById } from "@/lib/wordpress";
import type { LangCode } from "@/lib/wordpress";

import SectionForm from "@/components/admin/sections/SectionForm";
import { footerSectionConfig } from "@/components/admin/sections/sectionConfig";


function setValue(
  obj: any,
  path: string,
  value: any
) {
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
      current[key] = /^\d+$/.test(next)
        ? []
        : {};
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

  const rawLang = Array.isArray(params.lang)
    ? params.lang[0]
    : params.lang;


  const lang: LangCode =
    rawLang === "en"
      ? "en"
      : "id";


  const config =
    footerSectionConfig.footer;


  const postId =
    config.id[lang];


  console.log(
    "ADMIN FOOTER LANG:",
    lang
  );

  console.log(
    "ADMIN FOOTER ID:",
    postId
  );


  const post = await getPostById(
    postId,
    lang
  );


  if (!post) {
    throw new Error(
      "Footer tidak ditemukan"
    );
  }


  const acf = post.acf ?? {};

  const data: any = {};


  config.fields.forEach((field) => {

    let value =
      acf[field.acf];


    // JSON LIST
    if (
      typeof field.type === "string" &&
      field.type.endsWith("-list")
    ) {

      try {

        if (
          typeof value === "string"
        ) {
          value =
            value
              ? JSON.parse(value)
              : [];
        }


        if (
          !Array.isArray(value)
        ) {
          value = [];
        }


      } catch {

        value = [];

      }

    }


    // IMAGE ID
    if (
      field.type === "image"
    ) {

      if (
        value &&
        typeof value === "object"
      ) {
        value =
          value.id ??
          "";
      }

    }


    // LINK OBJECT
    if (
      value &&
      typeof value === "object"
    ) {
      value =
        value.url ?? "";
    }


    setValue(
      data,
      field.name,
      value ?? ""
    );

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