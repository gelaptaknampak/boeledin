import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import {
  getPostCategories,
  createPostCategory,
} from "@/lib/wordpress";

export async function GET() {
  try {
    const categories = await getPostCategories();

    return NextResponse.json(categories);
  } catch {
    return NextResponse.json(
      { message: "Gagal mengambil kategori." },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const token = (await cookies()).get("wp_token");

    if (!token) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await req.json();

    const category = await createPostCategory(
      body.name,
      token.value
    );

    return NextResponse.json(category);
  } catch {
    return NextResponse.json(
      { message: "Gagal membuat kategori." },
      { status: 500 }
    );
  }
}
