import { getPostById } from "@/lib/wordpress";

import FooterClient from "./FooterClient";

import { footerSectionConfig } from "@/components/admin/sections/sectionConfig";

export default async function Footer() {
  try {
    const post = await getPostById(
      footerSectionConfig.footer.id
    );

    return (
      <FooterClient
        data={post?.acf ?? {}}
      />
    );
  } catch (error) {
    console.error("Failed to load footer:", error);

    return <FooterClient data={{}} />;
  }
}