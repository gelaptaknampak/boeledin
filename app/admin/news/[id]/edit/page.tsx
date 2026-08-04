"use client";

import dynamic from "next/dynamic";

const NewsForm = dynamic(() => import("@/components/admin/NewsForm"), {
  ssr: false,
});

interface Props {
  params: Promise<{
    id: string;
  }>;
}

export default async function EditNewsPage({ params }: Props) {
  const { id } = await params;

  return <NewsForm mode="edit" postId={Number(id)} />;
}
