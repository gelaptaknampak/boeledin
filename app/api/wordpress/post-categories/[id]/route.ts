import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import { updatePostCategory, deletePostCategory } from "@/lib/wordpress";

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const token = (await cookies()).get("wp_token");

    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();

    const { id } = await params;

    const lang = new URL(req.url).searchParams.get("lang") || body.lang || "id";

    const category = await updatePostCategory(
      Number(id),
      body.name,
      token.value,
      lang as any,
    );

    return NextResponse.json(category);
  } catch {
    return NextResponse.json(
      { message: "Gagal mengupdate kategori." },
      { status: 500 },
    );
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const token = (await cookies()).get("wp_token");

    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    await deletePostCategory(Number(id), token.value);

    return NextResponse.json({
      success: true,
    });
  } catch {
    return NextResponse.json(
      { message: "Gagal menghapus kategori." },
      { status: 500 },
    );
  }
}
