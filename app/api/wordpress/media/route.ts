import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { uploadProductImage } from "@/lib/wordpress";

/**
 * ============================================
 * GET — BATCH FETCH MEDIA
 * ============================================
 *
 * Ambil banyak media sekaligus dalam satu (atau
 * beberapa, kalau > 100 id) request server-to-server,
 * pakai parameter `include` REST API WordPress.
 *
 * Dipakai misalnya oleh ProductsGrid buat resolve
 * feature_image ids jadi source_url, tanpa fetch satu
 * per satu dari browser (yang rawan CORS & rate limit).
 *
 * Query: ?ids=12,34,56
 * Response: { [mediaId: string]: sourceUrl }
 */

const WP_MEDIA_ENDPOINT = "https://wp.boeledin.com/wp-json/wp/v2/media";

// Batas maksimum per_page di WordPress REST API secara default.
const CHUNK_SIZE = 100;

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const idsParam = searchParams.get("ids") ?? "";

  const ids = Array.from(
    new Set(
      idsParam
        .split(",")
        .map((id) => id.trim())
        .filter(Boolean),
    ),
  );

  if (ids.length === 0) {
    return NextResponse.json({});
  }

  const chunks: string[][] = [];

  for (let i = 0; i < ids.length; i += CHUNK_SIZE) {
    chunks.push(ids.slice(i, i + CHUNK_SIZE));
  }

  const mediaMap: Record<string, string> = {};

  try {
    await Promise.all(
      chunks.map(async (chunk) => {
        const url = `${WP_MEDIA_ENDPOINT}?include=${chunk.join(
          ",",
        )}&per_page=${chunk.length}&_fields=id,source_url`;

        const res = await fetch(url, { cache: "no-store" });

        if (!res.ok) {
          console.error(
            `Failed fetching media chunk (${chunk.length} ids): ${res.status}`,
          );
          return;
        }

        const data = await res.json();

        if (Array.isArray(data)) {
          for (const item of data) {
            if (item?.id && item?.source_url) {
              mediaMap[String(item.id)] = item.source_url;
            }
          }
        }
      }),
    );

    return NextResponse.json(mediaMap);
  } catch (err) {
    console.error("Failed to fetch media batch:", err);

    return NextResponse.json({}, { status: 500 });
  }
}

/**
 * ============================================
 * POST — UPLOAD PRODUCT IMAGE
 * ============================================
 */

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