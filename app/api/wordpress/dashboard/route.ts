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
      ...products.slice(0, 3).map((item: any) => ({
        id: item.id,
        title: item.acf?.nama_produk || item.title?.rendered || "-",
        type: "product",
        date: item.modified?.split("T")[0],
      })),
      ...news.slice(0, 3).map((item: any) => ({
        id: item.id,
        title: item.title?.rendered,
        type: "news",
        date: item.modified?.split("T")[0],
      })),
      ...pages.slice(0, 3).map((item: any) => ({
        id: item.id,
        title: item.title?.rendered,
        type: "page",
        date: item.modified?.split("T")[0],
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