import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import {
  getCustomPostById,
  updateProduct,
  deleteProduct,
} from "@/lib/wordpress";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  const product = await getCustomPostById("products", Number(id));

  if (!product) {
    return NextResponse.json(
      { message: "Produk tidak ditemukan" },
      { status: 404 },
    );
  }

  return NextResponse.json(product);
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  const token = (await cookies()).get("wp_token")?.value;

  if (!token) {
    return NextResponse.json(
      {
        message: "Unauthorized",
      },
      {
        status: 401,
      },
    );
  }
  const result = await deleteProduct(Number(id), token);

  if (!result) {
    return NextResponse.json(
      {
        message: "Gagal menghapus produk",
      },
      {
        status: 500,
      },
    );
  }
  return NextResponse.json(result);
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const token = (await cookies()).get("wp_token");

  if (!token) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  const body = await req.json();

  const product = await updateProduct(
    Number(id),
    body.nama_produk,

    {
      nama_produk: body.nama_produk,
      model_produk: body.model_produk,
      short_description: body.short_description,
      description: body.description,
      spesifikasi: body.spesifikasi,
      feature_image: body.feature_image,
      download_brosur: body.download_brosur,
    },

    body.brand,
    body.jenis_produk,

    token.value,
  );

  if (!product) {
    return NextResponse.json(
      { message: "Gagal update produk" },
      { status: 500 },
    );
  }

  return NextResponse.json(product);
}
