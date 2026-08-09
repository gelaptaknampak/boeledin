import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import {
  updateProductType,
  deleteProductType,
} from "@/lib/wordpress";

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const token = (await cookies()).get("wp_token")?.value;

    if (!token) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 },
      );
    }

    const { id } = await params;

    const body = await req.json();

    if (!body.name?.trim()) {
      return NextResponse.json(
        { message: "Nama jenis produk wajib diisi" },
        { status: 400 },
      );
    }

    const lang =
      new URL(req.url).searchParams.get("lang") ||
      body.lang ||
      "id";

    const type = await updateProductType(
      Number(id),
      body.name.trim(),
      token,
      lang as any,
    );

    return NextResponse.json(type);
  } catch (error: any) {
    console.error(
      "UPDATE PRODUCT TYPE ROUTE ERROR:",
      error.response?.data || error,
    );

    return NextResponse.json(
      {
        message:
          error.response?.data?.message ||
          "Gagal mengupdate jenis produk",
        error:
          error.response?.data || null,
      },
      {
        status:
          error.response?.status || 500,
      },
    );
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const token = (await cookies()).get("wp_token")?.value;

  if (!token) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  await deleteProductType(Number(id), token);

  return NextResponse.json({
    success: true,
  });
}
