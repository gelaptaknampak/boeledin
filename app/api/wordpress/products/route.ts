import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { getCustomPosts, createProduct } from "@/lib/wordpress";

const WORDPRESS_URL = "https://wp.boeledin.com";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);

    const lang = searchParams.get("lang") || "id";

    const response = await fetch(
      `${WORDPRESS_URL}/wp-json/boeledin/v1/products?lang=${lang}&_=${Date.now()}`,
      {
        cache: "no-store",
      }
    );

    if (!response.ok) {
      const errorText = await response.text();

      console.error("WORDPRESS PRODUCTS ERROR:", errorText);

      return NextResponse.json(
        {
          message: "Gagal mengambil produk dari WordPress",
          error: errorText,
        },
        {
          status: response.status,
        }
      );
    }

    const products = await response.json();

    return NextResponse.json(products);
  } catch (error) {
    console.error("GET PRODUCTS ERROR:", error);

    return NextResponse.json(
      {
        message: "Gagal mengambil produk",
        error: String(error),
      },
      {
        status: 500,
      }
    );
  }
}

export async function POST(req: Request) {
  try {
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

    const body = await req.json();

    const { searchParams } = new URL(req.url);

    const lang =
      searchParams.get("lang") ||
      body.lang ||
      "id";

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
      token,
      lang as any,
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
  } catch (error) {
    console.error("CREATE PRODUCT ERROR:", error);

    return NextResponse.json(
      {
        message: "Gagal membuat produk",
        error: String(error),
      },
      {
        status: 500,
      },
    );
  }
}