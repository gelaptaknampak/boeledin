"use client";

import dynamic from "next/dynamic";

const NewsForm = dynamic(() => import("@/components/admin/NewsForm"), {
  ssr: false,
});

export default function Page() {
  return <NewsForm mode="create" />;
}
