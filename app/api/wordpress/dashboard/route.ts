import { NextResponse } from "next/server";
import {
  getCustomPosts,
  getPages,
} from "@/lib/wordpress";

export async function GET() {
  try {
    const products = await getCustomPosts("products");
    const news = await getCustomPosts("news");
    const pages = await getPages();

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
      totalPages: pages.length,
      totalProducts: products.length,
      totalNews: news.length,
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