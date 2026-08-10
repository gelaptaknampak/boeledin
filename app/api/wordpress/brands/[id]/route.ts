import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import {
  updateBrand,
  deleteBrand,
} from "@/lib/wordpress";

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  console.log("\n========================================");
  console.log("🔥 BRAND UPDATE REQUEST");
  console.log("========================================");

  try {
    // ========================================
    // AUTH
    // ========================================

    const cookieStore = await cookies();
    const token = cookieStore.get("wp_token")?.value;

    console.log("🔐 Token exists:", !!token);

    if (!token) {
      console.error("❌ No wp_token found");

      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    // ========================================
    // PARAMS
    // ========================================

    const { id } = await params;

    console.log("🆔 Brand ID:", id);
    console.log("🆔 Brand ID Number:", Number(id));
    console.log("🆔 Is valid number:", !Number.isNaN(Number(id)));

    // ========================================
    // BODY
    // ========================================

    const body = await req.json();

    console.log("\n📦 RAW BODY:");
    console.log(JSON.stringify(body, null, 2));

    console.log("\n📌 BODY DETAILS:");
    console.log("name:", body?.name);
    console.log("brand_logo:", body?.brand_logo);
    console.log(
      "brand_logo type:",
      typeof body?.brand_logo
    );
    console.log(
      "brand_logo JSON:",
      JSON.stringify(body?.brand_logo, null, 2)
    );
    console.log("lang:", body?.lang);

    // ========================================
    // LANGUAGE
    // ========================================

    const url = new URL(req.url);

    const queryLang = url.searchParams.get("lang");

    const lang =
      queryLang ||
      body?.lang ||
      "id";

    console.log("\n🌐 LANGUAGE:");
    console.log("URL:", req.url);
    console.log("Query lang:", queryLang);
    console.log("Body lang:", body?.lang);
    console.log("Final lang:", lang);

    // ========================================
    // DATA YANG AKAN DIKIRIM KE updateBrand
    // ========================================

    const brandId = Number(id);
    const brandName = body?.name;
    const brandLogo = body?.brand_logo;

    console.log("\n📤 DATA TO updateBrand:");
    console.log({
      brandId,
      brandName,
      brandLogo,
      lang,
    });

    // ========================================
    // VALIDATION
    // ========================================

    if (Number.isNaN(brandId)) {
      console.error("❌ Invalid brand ID:", id);

      return NextResponse.json(
        {
          message: "Invalid brand ID",
          id,
        },
        { status: 400 }
      );
    }

    if (!brandName) {
      console.warn("⚠️ Brand name is empty");
    }

    if (!brandLogo) {
      console.warn(
        "⚠️ brand_logo is EMPTY / undefined / null"
      );
    }

    // ========================================
    // CALL WORDPRESS
    // ========================================

    console.log("\n🚀 Calling updateBrand...");

    const brand = await updateBrand(
      brandId,
      brandName,
      brandLogo,
      token,
      lang as any,
    );

    // ========================================
    // RESPONSE DARI WORDPRESS
    // ========================================

    console.log("\n✅ updateBrand RESPONSE:");

    console.log(
      JSON.stringify(brand, null, 2)
    );

    console.log("\n🔍 UPDATED BRAND LOGO:");

    console.log(
      "brand_logo:",
      brand?.brand_logo
    );

    console.log(
      "acf:",
      brand?.acf
    );

    console.log(
      "acf.brand_logo:",
      brand?.acf?.brand_logo
    );

    console.log("\n========================================");
    console.log("✅ BRAND UPDATE FINISHED");
    console.log("========================================\n");

    return NextResponse.json(brand);

  } catch (error: any) {
    console.error("\n========================================");
    console.error("🔥 BRAND UPDATE ERROR");
    console.error("========================================");

    console.error("Error:", error);
    console.error("Message:", error?.message);
    console.error("Stack:", error?.stack);

    return NextResponse.json(
      {
        message: "Failed to update brand",
        error: error?.message || String(error),
      },
      { status: 500 }
    );
  }
}


export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  console.log("\n========================================");
  console.log("🗑️ BRAND DELETE REQUEST");
  console.log("========================================");

  try {
    const cookieStore = await cookies();

    const token = cookieStore.get("wp_token")?.value;

    console.log("🔐 Token exists:", !!token);

    if (!token) {
      console.error("❌ No wp_token found");

      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const { id } = await params;

    console.log("🆔 Delete Brand ID:", id);
    console.log("🆔 Delete Brand ID Number:", Number(id));

    const result = await deleteBrand(
      Number(id),
      token
    );

    console.log("✅ DELETE RESPONSE:");
    console.log(
      JSON.stringify(result, null, 2)
    );

    return NextResponse.json({
      success: true,
    });

  } catch (error: any) {
    console.error("\n🔥 BRAND DELETE ERROR");
    console.error("Error:", error);
    console.error("Message:", error?.message);
    console.error("Stack:", error?.stack);

    return NextResponse.json(
      {
        message: "Failed to delete brand",
        error: error?.message || String(error),
      },
      { status: 500 }
    );
  }
}