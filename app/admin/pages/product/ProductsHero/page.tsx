import { getPostById } from "@/lib/wordpress";
import type { LangCode } from "@/lib/wordpress";

import SectionForm from "@/components/admin/sections/SectionForm";
import { productsSectionConfig } from "@/components/admin/sections/sectionConfig";


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



export default async function ProductsHeroPage({
  searchParams,
}: {
  searchParams: Promise<{
    lang?: string | string[];
  }>;
}) {


  const config = productsSectionConfig.hero;


  const params = await searchParams;


  const rawLang = Array.isArray(params.lang)
    ? params.lang[0]
    : params.lang;


  const lang: LangCode =
    rawLang === "en"
      ? "en"
      : "id";



  // ambil ID sesuai bahasa
  const postId =
    config.id[lang];



  if (!postId) {
    throw new Error(
      `Products Hero ${lang} belum dikonfigurasi`
    );
  }



  const post =
    await getPostById(
      postId,
      lang
    );



  if (!post) {
    throw new Error(
      "Products Hero section tidak ditemukan"
    );
  }



  const acf =
    post.acf ?? {};



  const data:any = {};



  config.fields.forEach(
    (field:any)=>{

      let value =
        acf[field.acf];


      /*
      =========================
      LINK FIELD
      =========================
      */

      if(
        field.type === "link" &&
        value &&
        typeof value === "object"
      ){
        value =
          value.url ?? "";
      }



      /*
      =========================
      IMAGE FIELD
      =========================
      */

      if(
        field.type === "image" &&
        value &&
        typeof value === "object"
      ){
        value =
          value.id ?? "";
      }



      setValue(
        data,
        field.name,
        value ?? ""
      );

    }
  );



  return (
    <SectionForm
      data={data}
      config={{
        ...config,

        // penting untuk update
        id: post.id,
      }}
    />
  );

}