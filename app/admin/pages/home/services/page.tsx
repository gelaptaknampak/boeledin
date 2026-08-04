import Link from "next/link";
import { ChevronLeft } from "lucide-react";

import { getPostBySlug } from "@/lib/wordpress";
import ServicesForm from "./ServicesForm";

export default async function ServicesPage() {
  const post = await getPostBySlug("home-services");

  if (!post) {
    throw new Error("Post Home Services tidak ditemukan");
  }

  const services = {
    eyebrow: post.acf?.services_eyebrow ?? "",
    title: post.acf?.services_title ?? "",
    description: post.acf?.services_description ?? "",

    services: [
      {
        number: post.acf?.service_1_number ?? "01",
        icon: post.acf?.service_1_icon ?? "zap",
        title: post.acf?.service_1_title ?? "",
        description: post.acf?.service_1_description ?? "",
      },
      {
        number: post.acf?.service_2_number ?? "02",
        icon: post.acf?.service_2_icon ?? "settings",
        title: post.acf?.service_2_title ?? "",
        description: post.acf?.service_2_description ?? "",
      },
      {
        number: post.acf?.service_3_number ?? "03",
        icon: post.acf?.service_3_icon ?? "grid3x3",
        title: post.acf?.service_3_title ?? "",
        description: post.acf?.service_3_description ?? "",
      },
      {
        number: post.acf?.service_4_number ?? "04",
        icon: post.acf?.service_4_icon ?? "lightbulb",
        title: post.acf?.service_4_title ?? "",
        description: post.acf?.service_4_description ?? "",
      },
    ],
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <Link
            href="/admin/pages/home"
            className="mb-3 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
          >
            <ChevronLeft className="h-4 w-4" />
            Kembali
          </Link>

          <h1 className="text-3xl font-bold">
            Services Section
          </h1>

          <p className="mt-2 text-muted-foreground">
            Kelola konten bagian layanan pada halaman Home.
          </p>
        </div>
      </div>

      {/* Form */}
      <ServicesForm data={services} />
    </div>
  );
}