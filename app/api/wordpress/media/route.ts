import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { uploadProductImage } from "@/lib/wordpress";

export async function POST(req: Request) {
  try {
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

    const formData = await req.formData();

    const file = formData.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json(
        {
          message: "File tidak ditemukan",
        },
        {
          status: 400,
        },
      );
    }

    const media = await uploadProductImage(file, token.value);

    if (!media) {
      return NextResponse.json(
        {
          message: "Upload media gagal",
        },
        {
          status: 500,
        },
      );
    }

    return NextResponse.json(media);
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        message: "Internal Server Error",
      },
      {
        status: 500,
      },
    );
  }
}