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

    console.log("========================================");
    console.log("PRODUCT IMAGE UPLOAD");
    console.log("FILE NAME:", file.name);
    console.log("FILE SIZE:", file.size, "bytes");
    console.log("FILE TYPE:", file.type);
    console.log("========================================");

    const startTime = Date.now();

    const media = await uploadProductImage(
      file,
      token.value,
    );

    const duration = Date.now() - startTime;

    console.log("========== UPLOAD ROUTE SUCCESS ==========");
    console.log("MEDIA ID:", media?.id);
    console.log("UPLOAD TIME:", `${duration}ms`);
    console.log("==========================================");

    return NextResponse.json(media);
  } catch (error: any) {
    console.error("========== UPLOAD ROUTE ERROR ==========");

    console.error(
      "STATUS:",
      error.response?.status,
    );

    console.error(
      "DATA:",
      error.response?.data,
    );

    console.error(
      "MESSAGE:",
      error.message,
    );

    console.error(
      "CODE:",
      error.code,
    );

    console.error(
      "URL:",
      error.config?.url,
    );

    console.error("========================================");

    return NextResponse.json(
      {
        message:
          error.response?.data ||
          error.message ||
          "Upload media gagal",
      },
      {
        status:
          error.response?.status ||
          500,
      },
    );
  }
}