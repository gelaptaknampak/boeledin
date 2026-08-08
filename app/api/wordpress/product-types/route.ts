import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { getProductTypes, createProductType } from "@/lib/wordpress";

export async function GET(req: Request) {
  try {
    const lang = new URL(req.url).searchParams.get("lang") || "id";
    const types = await getProductTypes(undefined, lang as any);

    return NextResponse.json(types);
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { message: "Gagal mengambil jenis produk" },
      { status: 500 },
    );
  }
}

export async function POST(req: Request) {
  const token = (await cookies()).get("wp_token")?.value;

  if (!token) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();

  const lang = new URL(req.url).searchParams.get("lang") || body.lang || "id";
  const type = await createProductType(body.name, token, lang as any);

  return NextResponse.json(type);
}
