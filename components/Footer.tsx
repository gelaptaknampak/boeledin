import { getPostById } from "@/lib/wordpress";
import type { LangCode } from "@/lib/wordpress";

import FooterClient from "./FooterClient";

import { footerSectionConfig } from "@/components/admin/sections/sectionConfig";

export default async function Footer({
  lang = "id",
}: {
  lang?: LangCode;
}) {
  try {
    const config = footerSectionConfig.footer;

    const normalizedLang: "id" | "en" =
      lang === "en" ? "en" : "id";

    const postId = config.id[normalizedLang];

    console.log("FOOTER LANG:", normalizedLang);
    console.log("FOOTER ID:", postId);

    if (!postId) {
      throw new Error(
        `Footer ${normalizedLang} belum memiliki ID`
      );
    }

    const post = await getPostById(
      postId,
      normalizedLang
    );

    console.log(
      "FOOTER RESULT:",
      post?.id,
      post?.title?.rendered
    );

    return (
      <FooterClient
        data={post?.acf ?? {}}
      />
    );

  } catch (error) {
    console.error(
      "Failed loading footer:",
      error
    );

    return (
      <FooterClient
        data={{}}
      />
    );
  }
}