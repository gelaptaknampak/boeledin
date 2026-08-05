import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { uploadMediaPage } from "@/lib/wordpress";

export async function POST(req: Request) {
  try {
    const token = (await cookies()).get("wp_token")?.value;

    if (!token) {
      return NextResponse.json(
        {
          success: false,
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
          success: false,
          message: "File tidak ditemukan",
        },
        {
          status: 400,
        },
      );
    }

    const media = await uploadMediaPage(file, token);

    console.log("MEDIA =", media);

    if (!media) {
      return NextResponse.json(
        {
          success: false,
          message: "Upload media gagal",
        },
        {
          status: 500,
        },
      );
    }

    return NextResponse.json({
      success: true,
      media,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message: "Internal Server Error",
      },
      {
        status: 500,
      },
    );
  }
}
