import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import { getPostCategories, createPostCategory } from "@/lib/wordpress";

export async function GET(req: Request) {
  try {
    const lang = new URL(req.url).searchParams.get("lang") || "id";
    const categories = await getPostCategories(lang as any);

    return NextResponse.json(categories);
  } catch {
    return NextResponse.json(
      { message: "Gagal mengambil kategori." },
      { status: 500 },
    );
  }
}

export async function POST(req: Request) {
  try {
    const token = (await cookies()).get("wp_token");

    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const lang = new URL(req.url).searchParams.get("lang") || body.lang || "id";

    const category = await createPostCategory(
      body.name,
      token.value,
      lang as any,
    );

    return NextResponse.json(category);
  } catch {
    return NextResponse.json(
      { message: "Gagal membuat kategori." },
      { status: 500 },
    );
  }
}
