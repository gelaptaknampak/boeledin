import { getPostById } from "@/lib/wordpress";
import type { LangCode } from "@/lib/wordpress";

import SectionForm from "@/components/admin/sections/SectionForm";
import { newsSectionConfig } from "@/components/admin/sections/sectionConfig";


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


export default async function NewsHeroPage({
  searchParams,
}: {
  searchParams: Promise<{
    lang?: string | string[];
  }>;
}) {

  /*
  =========================
  CONFIG
  =========================
  */

  const config =
    newsSectionConfig.hero;


  /*
  =========================
  LANGUAGE
  =========================
  */

  const params =
    await searchParams;

  const rawLang =
    Array.isArray(params.lang)
      ? params.lang[0]
      : params.lang;


  const lang: LangCode =
    rawLang === "en"
      ? "en"
      : "id";


  /*
  =========================
  GET POST ID
  =========================
  */

  const postId =
    config.id[lang];


  if (!postId) {
    throw new Error(
      `News Hero untuk bahasa ${lang} belum dikonfigurasi`
    );
  }


  /*
  =========================
  GET POST
  =========================
  */

  const post =
    await getPostById(
      postId,
      lang
    );


  if (!post) {
    throw new Error(
      "News Hero section tidak ditemukan"
    );
  }


  /*
  =========================
  ACF DATA
  =========================
  */

  const acf =
    post.acf ?? {};

  const data: any = {};


  config.fields.forEach(
    (field: any) => {

      let value =
        acf[field.acf];


      /*
      =========================
      LINK FIELD
      =========================
      */

      if (
        field.type === "link" &&
        value &&
        typeof value === "object"
      ) {
        value =
          value.url ?? "";
      }


      /*
      =========================
      IMAGE FIELD
      =========================
      */

      if (
        field.type === "image" &&
        value &&
        typeof value === "object"
      ) {
        value =
          value.id ?? "";
      }


      /*
      =========================
      SET FORM VALUE
      =========================
      */

      setValue(
        data,
        field.name,
        value ?? ""
      );
    }
  );


  /*
  =========================
  RENDER FORM
  =========================
  */

  return (
    <SectionForm
      data={data}
      config={{
        ...config,

        // ID post yang sedang diedit
        id: post.id,
      }}
    />
  );
}

