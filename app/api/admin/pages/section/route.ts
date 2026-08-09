import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

import { updatePostACF } from "@/lib/wordpress";

import {
  homeSectionConfig,
  aboutSectionConfig,
  contactSectionConfig,
  productsSectionConfig,
  newsSectionConfig,
  footerSectionConfig,
} from "@/components/admin/sections/sectionConfig";

type LangCode = "id" | "en";

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
    const body = await req.json();

    const id = body.id;
    const data = body.data;
    const rawLang = body.lang;

    const lang: LangCode =
      rawLang === "en" ? "en" : "id";

    console.log("=================================");
    console.log("UPDATE SECTION REQUEST");
    console.log("id:", id);
    console.log("lang:", lang);
    console.log("data:", data);
    console.log("=================================");

    /**
     * ============================
     * AUTH
     * ============================
     */

    const token = (await cookies()).get("wp_token")?.value;

    if (!token) {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthorized",
        },
        {
          status: 401,
        }
      );
    }

    /**
     * ============================
     * ALL SECTIONS
     * ============================
     */

    const allSections = [
      ...Object.values(homeSectionConfig),
      ...Object.values(aboutSectionConfig),
      ...Object.values(contactSectionConfig),
      ...Object.values(productsSectionConfig),
      ...Object.values(newsSectionConfig),
      ...Object.values(footerSectionConfig),
    ];

    /**
     * ============================
     * CARI CONFIG
     * ============================
     *
     * Bisa menangani:
     *
     * id: 212
     *
     * maupun:
     *
     * id: {
     *   id: 558,
     *   en: 157
     * }
     */

    const config = allSections.find((section) => {
      if (
        typeof section.id === "object" &&
        section.id !== null
      ) {
        return (
          section.id.id === id ||
          section.id.en === id
        );
      }

      return section.id === id;
    });

    /**
     * DEBUG
     */

    console.log("SEARCHING CONFIG");
    console.log("Requested ID:", id);
    console.log(
      "Found config:",
      config?.title ?? "NOT FOUND"
    );

    /**
     * ============================
     * CONFIG NOT FOUND
     * ============================
     */

    if (!config) {
      console.error(
        "SECTION TIDAK DITEMUKAN UNTUK ID:",
        id
      );

      console.error(
        "AVAILABLE SECTIONS:",
        allSections.map((section) => ({
          title: section.title,
          id: section.id,
        }))
      );

      return NextResponse.json(
        {
          success: false,
          message: "Section tidak ditemukan",
        },
        {
          status: 404,
        }
      );
    }

    /**
     * ============================
     * POST ID
     * ============================
     *
     * Karena SectionForm sudah mengirim
     * post ID aktual, langsung gunakan id.
     */

    const postId = Number(id);

    if (!postId || Number.isNaN(postId)) {
      return NextResponse.json(
        {
          success: false,
          message: "Post ID tidak valid",
        },
        {
          status: 400,
        }
      );
    }

    /**
     * ============================
     * BUILD ACF DATA
     * ============================
     */

    const acfData: Record<string, any> = {};

    for (const field of config.fields) {
      let value = getValue(
        data,
        field.name
      );

      /**
       * ACF LINK
       */
      if (field.type === "link") {
        value = {
          url: value ?? "",
          title: "",
          target: "_self",
        };
      }

      /**
       * ACF IMAGE
       * Return format = ID
       */
      if (field.type === "image") {
        value = value || null;
      }

      /**
       * Hidden field tetap ikut dikirim
       *
       * hidden hanya berarti tidak ditampilkan
       * di form.
       */
      acfData[field.acf] = value ?? "";
    }

    /**
     * ============================
     * DEBUG ACF
     * ============================
     */

    console.log("=================================");
    console.log("UPDATE ACF");
    console.log("SECTION:", config.title);
    console.log("POST ID:", postId);
    console.log("LANG:", lang);
    console.log("ACF DATA:", acfData);
    console.log("=================================");

    /**
     * ============================
     * UPDATE WORDPRESS
     * ============================
     */

    const result = await updatePostACF(
      postId,
      acfData,
      token,
      lang
    );

    return NextResponse.json({
      success: true,
      message: "Berhasil diperbarui",
      data: result,
    });
  } catch (error: any) {
    console.error(
      "UPDATE SECTION ERROR:",
      error
    );

    console.error(
      "RESPONSE:",
      error?.response?.data
    );

    return NextResponse.json(
      {
        success: false,
        message:
          error?.response?.data?.message ??
          error?.message ??
          "Gagal menyimpan",
      },
      {
        status:
          error?.response?.status ?? 500,
      }
    );
  }
}