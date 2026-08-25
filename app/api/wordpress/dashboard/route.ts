import { NextResponse } from "next/server";
import {
  getCustomPosts,
  getCustomPostsCount,
  getPages,
  getPagesCount,
  getPosts,
  getPostsCount,
} from "@/lib/wordpress";

export async function GET(req: Request) {
  try {
    const lang = new URL(req.url).searchParams.get("lang") || "id";

    const [
      products,
      news,
      pages,
      totalProducts,
      totalNews,
      totalPages,
    ] = await Promise.all([
      getCustomPosts("products", undefined, lang as any),
      getPosts(lang as any),
      getPages(undefined, lang as any),
      getCustomPostsCount("products", lang as any),
      getPostsCount(lang as any),
      getPagesCount(lang as any),
    ]);

    const recentItems = [
      // Products & Pages lewat endpoint CORE WordPress
      // (/wp/v2/products, /wp/v2/pages) -- title berbentuk
      // {rendered: string}, dan last_edited_by/at sekarang
      // ikut muncul lewat register_rest_field() di plugin.
      ...products.slice(0, 3).map((item: any) => ({
        id: item.id,
        title: item.acf?.nama_produk || item.title?.rendered || "-",
        type: "product",
        date: item.modified?.split("T")[0],
        lastEditedBy: item.last_edited_by ?? null,
        lastEditedAt: item.last_edited_at ?? null,
      })),

      // Berita lewat endpoint CUSTOM kita (boeledin/v1/berita).
      // PENTING: title di endpoint ini berbentuk string BIASA
      // (dari get_the_title()), BUKAN {rendered: string} kayak
      // endpoint core. Sebelumnya kode ini pakai item.title?.rendered
      // yang selalu undefined buat berita -- itu penyebab judul
      // Berita kosong di dashboard. Sekarang dibenerin jadi
      // item.title langsung.
      ...news.slice(0, 3).map((item: any) => ({
        id: item.id,
        title: item.title || "-",
        type: "news",
        date: item.modified?.split("T")[0],
        lastEditedBy: item.last_edited_by ?? null,
        lastEditedAt: item.last_edited_at ?? null,
      })),

      ...pages.slice(0, 3).map((item: any) => ({
        id: item.id,
        title: item.title?.rendered || "-",
        type: "page",
        date: item.modified?.split("T")[0],
        lastEditedBy: item.last_edited_by ?? null,
        lastEditedAt: item.last_edited_at ?? null,
      })),
    ]
      .sort(
        (a, b) =>
          new Date(b.date).getTime() -
          new Date(a.date).getTime()
      )
      .slice(0, 5);

    return NextResponse.json({
      totalPages,
      totalProducts,
      totalNews,
      recentItems,
    });
  } catch (err) {
    console.error(err);

    return NextResponse.json(
      { message: "Gagal mengambil dashboard" },
      { status: 500 }
    );
  }
}