import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import {
  getCustomPostById,
  updateProduct,
  deleteProduct,
} from "@/lib/wordpress";

const WORDPRESS_URL = "https://wp.boeledin.com";

interface RouteContext {
  params: Promise<{
    id: string;
  }>;
}

/**
 * =========================================================
 * GET TRANSLATION ID
 * =========================================================
 *
 * Mencari product ID yang sesuai dengan bahasa yang diminta.
 *
 * Contoh:
 *
 * Product EN:
 * 525
 *
 * translations:
 * {
 *   en: 525,
 *   id: 530
 * }
 *
 * Request:
 * /products/525?lang=id
 *
 * Result:
 * 530
 */
async function getTranslationId(
  productId: number,
  lang: string,
): Promise<number> {
  const response = await fetch(
    `${WORDPRESS_URL}/wp-json/boeledin/v1/products/${productId}?lang=${lang}`,
    {
      cache: "no-store",
    },
  );

  if (!response.ok) {
    throw new Error(
      `Gagal mengambil translation product ${productId}`,
    );
  }

  const data = await response.json();

  if (!data?.id) {
    throw new Error(
      `Translation product untuk bahasa ${lang} tidak ditemukan`,
    );
  }

  return Number(data.id);
}

/**
 * =========================================================
 * GET PRODUCT
 * =========================================================
 */
export async function GET(
  req: Request,
  { params }: RouteContext,
) {
  try {
    const { id } = await params;

    const requestedId = Number(id);

    if (!requestedId) {
      return NextResponse.json(
        {
          message: "ID produk tidak valid",
        },
        {
          status: 400,
        },
      );
    }

    const { searchParams } = new URL(req.url);

    const lang = searchParams.get("lang") || "id";

    /**
     * Cari ID product yang sesuai dengan bahasa.
     *
     * Kalau:
     * requestedId = 525
     * lang = id
     *
     * maka:
     * translatedId = 530
     */
    const translatedId = await getTranslationId(
      requestedId,
      lang,
    );

    /**
     * Ambil data product menggunakan ID translation.
     */
    const product = await getCustomPostById(
      "products",
      translatedId,
      {
        lang,
      },
      lang as any,
    );

    if (!product) {
      return NextResponse.json(
        {
          message: "Produk tidak ditemukan",
        },
        {
          status: 404,
        },
      );
    }

    return NextResponse.json({
      ...product,

      /**
       * ID product yang benar-benar digunakan
       * oleh form.
       */
      id: translatedId,

      /**
       * ID yang pertama kali dikirim melalui URL.
       */
      requested_id: requestedId,

      /**
       * Bahasa product yang sedang digunakan.
       */
      language: lang,
    });
  } catch (error) {
    console.error("GET PRODUCT ERROR:", error);

    return NextResponse.json(
      {
        message: "Gagal mengambil produk",
        error:
          error instanceof Error
            ? error.message
            : String(error),
      },
      {
        status: 500,
      },
    );
  }
}

/**
 * =========================================================
 * DELETE PRODUCT
 * =========================================================
 */
export async function DELETE(
  req: Request,
  { params }: RouteContext,
) {
  try {
    const token = (await cookies())
      .get("wp_token")
      ?.value;

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

    const { id } = await params;

    const productId = Number(id);

    if (!productId) {
      return NextResponse.json(
        {
          message: "ID produk tidak valid",
        },
        {
          status: 400,
        },
      );
    }

    const result = await deleteProduct(
      productId,
      token,
    );

    if (!result) {
      return NextResponse.json(
        {
          message: "Gagal menghapus produk",
        },
        {
          status: 500,
        },
      );
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error(
      "DELETE PRODUCT ERROR:",
      error,
    );

    return NextResponse.json(
      {
        message: "Gagal menghapus produk",
        error:
          error instanceof Error
            ? error.message
            : String(error),
      },
      {
        status: 500,
      },
    );
  }
}

/**
 * =========================================================
 * UPDATE PRODUCT
 * =========================================================
 */
export async function PUT(
  req: Request,
  { params }: RouteContext,
) {
  try {
    const token = (await cookies())
      .get("wp_token")
      ?.value;

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

    const { id } = await params;

    const requestedId = Number(id);

    if (!requestedId) {
      return NextResponse.json(
        {
          message: "ID produk tidak valid",
        },
        {
          status: 400,
        },
      );
    }

    const body = await req.json();

    const { searchParams } = new URL(req.url);

    const lang =
      searchParams.get("lang") ||
      body.lang ||
      "id";

    /**
     * =====================================================
     * CARI TRANSLATION ID
     * =====================================================
     *
     * Contoh:
     *
     * URL:
     * /products/525?lang=id
     *
     * 525 = EN
     * 530 = ID
     *
     * Maka:
     * productId = 530
     *
     * Update TIDAK dilakukan ke 525.
     */
    const productId =
      await getTranslationId(
        requestedId,
        lang,
      );

    /**
     * =====================================================
     * UPDATE PRODUCT
     * =====================================================
     */
    const product =
      await updateProduct(
        productId,

        body.nama_produk,

        {
          nama_produk:
            body.nama_produk,

          model_produk:
            body.model_produk,

          short_description:
            body.short_description,

          description:
            body.description,

          spesifikasi:
            body.spesifikasi,

          feature_image:
            body.feature_image,

          gallery_ids:
            body.gallery_ids,

          download_brosur:
            body.download_brosur === ""
              ? null
              : body.download_brosur
                ? Number(
                    body.download_brosur,
                  )
                : null,
        },

        Number(body.brand),

        Number(
          body["jenis-produk"],
        ),

        token,

        lang as any,
      );

    if (!product) {
      return NextResponse.json(
        {
          message:
            "Gagal update produk",
        },
        {
          status: 500,
        },
      );
    }

    return NextResponse.json({
      ...product,

      /**
       * ID product yang benar-benar
       * di-update.
       */
      id: productId,

      /**
       * ID yang dikirim dari frontend.
       */
      requested_id: requestedId,

      /**
       * Bahasa yang sedang di-update.
       */
      language: lang,
    });
  } catch (error) {
    console.error(
      "UPDATE PRODUCT ERROR:",
      error,
    );

    return NextResponse.json(
      {
        message:
          "Gagal update produk",
        error:
          error instanceof Error
            ? error.message
            : String(error),
      },
      {
        status: 500,
      },
    );
  }
}