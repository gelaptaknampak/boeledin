import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

import { updatePostACF } from "@/lib/wordpress";
import { homeSectionConfig } from "@/components/admin/sections/sectionConfig";

function getValue(obj: any, path: string) {
  return path.split(".").reduce((current, key) => {
    if (current == null) return undefined;

    if (/^\d+$/.test(key)) {
      return current[Number(key)];
    }

    return current[key];
  }, obj);
}

export async function POST(req: NextRequest) {
  try {
    const { id, data } = await req.json();

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

    const config = Object.values(homeSectionConfig).find(
      (section) => section.id === id,
    );

    if (!config) {
      return NextResponse.json(
        {
          success: false,
          message: "Section tidak ditemukan",
        },
        {
          status: 404,
        },
      );
    }

    const acfData: Record<string, any> = {};

    for (const field of config.fields) {
      let value = getValue(data, field.name);

      if (field.type === "link") {
        value = {
          url: value ?? "",
          title: "",
          target: "_self",
        };
      }

      acfData[field.acf] = value ?? "";
    }

    console.log("UPDATE ACF:");
    console.log(acfData);

    const result = await updatePostACF(id, acfData, token);

    return NextResponse.json({
      success: true,
      message: "Berhasil diperbarui",
      data: result,
    });
  } catch (error: any) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message:
          error?.response?.data?.message ?? error?.message ?? "Gagal menyimpan",
      },
      {
        status: error?.response?.status ?? 500,
      },
    );
  }
}
