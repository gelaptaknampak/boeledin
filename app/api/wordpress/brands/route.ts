import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { getBrands, createBrand } from "@/lib/wordpress";

export async function GET() {
  try {
    const brands = await getBrands();

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

    const brand = await createBrand(
      body.name,
      body.brand_logo,
      token,
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
