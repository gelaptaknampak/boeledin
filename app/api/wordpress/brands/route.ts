import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { getBrands, createBrand } from "@/lib/wordpress";

export async function GET(req: Request) {
  try {
    const lang = new URL(req.url).searchParams.get("lang") || "id";
    const brands = await getBrands(undefined, lang as any);

    return NextResponse.json(brands);
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { message: "Gagal mengambil Merek" },
      { status: 500 },
    );
  }
}

export async function POST(req: Request) {
  try {
    const token = (await cookies()).get("wp_token")?.value;

    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();

    const lang = new URL(req.url).searchParams.get("lang") || body.lang || "id";
    const brand = await createBrand(
      body.name,
      body.brand_logo,
      token,
      lang as any,
    );

    if (!brand) {
      return NextResponse.json(
        { message: "Gagal membuat Merek" },
        { status: 500 },
      );
    }

    return NextResponse.json(brand);
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 },
    );
  }
}
