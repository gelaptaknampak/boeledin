import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { getCustomPosts, createProduct } from "@/lib/wordpress";

export async function GET() {
  try {
    const products = await getCustomPosts("products");

    return NextResponse.json(products);
  } catch (e) {
    console.error(e);

    return NextResponse.json(
      {
        message: "WordPress Error",
        error: String(e),
      },
      {
        status: 500,
      },
    );
  }
}

export async function POST(req: Request) {
  const token = (await cookies()).get("wp_token");

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

  const body = await req.json();

  const product = await createProduct(
    body.nama_produk,

    {
      nama_produk: body.nama_produk,
      model_produk: body.model_produk,

      short_description: body.short_description,
      description: body.description,
      spesifikasi: body.spesifikasi,

      feature_image: body.feature_image,
      gallery_ids: body.gallery_ids,
      download_brosur: body.download_brosur,
    },

    body.brand,
    Number(body["jenis-produk"]),

    token.value,
  );

  if (!product) {
    return NextResponse.json(
      {
        message: "Gagal membuat produk",
      },
      {
        status: 500,
      },
    );
  }

  return NextResponse.json(product);
}
