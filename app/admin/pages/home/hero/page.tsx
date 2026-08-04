import { getPostBySlug } from "@/lib/wordpress";
import HeroForm from "./HeroForm";

export default async function HeroPage() {
  const post = await getPostBySlug("home-hero");

  if (!post) {
    throw new Error("Post Home Hero tidak ditemukan");
  }

  const hero = {
    eyebrow: post.acf?.hero_eyebrow ?? "",
    title: post.acf?.hero_title ?? "",
    description: post.acf?.hero_description ?? "",

    primaryButton: {
      text: post.acf?.primary_button_text ?? "",
      url: post.acf?.primary_button_link ?? "",
    },

    secondaryButton: {
      text: post.acf?.hero_secondary_button_text ?? "",
      url: post.acf?.hero_secondary_button_link ?? "",
    },

    stats: [
      {
        number: post.acf?.stat_1_number ?? "",
        label: post.acf?.stat_1_label ?? "",
      },
      {
        number: post.acf?.stat_2_number ?? "",
        label: post.acf?.stat_2_label ?? "",
      },
      {
        number: post.acf?.stat_3_number ?? "",
        label: post.acf?.stat_3_label ?? "",
      },
    ],
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">
          Home • Hero Section
        </h1>

        <p className="text-muted-foreground mt-2">
          Edit konten Hero Section yang tampil pada halaman Home.
        </p>
      </div>

      <HeroForm data={hero} />
    </div>
  );
}