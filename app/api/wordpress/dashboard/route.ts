import { NextResponse } from "next/server";
import { getPosts, getPagesCount } from "@/lib/wordpress";

// Paksa route ini selalu dijalanin ulang tiap request, jangan
// di-cache statis sama Next.js.
export const dynamic = "force-dynamic";
export const revalidate = 0;

const WP_URL = "https://wp.boeledin.com";

export async function GET(req: Request) {
  try {
    const lang = new URL(req.url).searchParams.get("lang") || "id";

    const [productsRes, news, sectionsRes, totalPages] = await Promise.all([
      // FIX MASALAH 1: sebelumnya pakai getCustomPosts("products", ...)
      // yang hit endpoint CORE WordPress (/wp/v2/products) -- filter
      // ?lang= di situ nggak reliable, jadi produk EN & ID counterpart
      // dua-duanya ikut kebawa walau lagi liat mode lang=en. Endpoint
      // custom ini (boeledin/v1/products) sama persis yang dipakai
      // ProductsGrid.tsx di halaman publik, yang udah terbukti filter
      // bahasanya bener.
      fetch(`${WP_URL}/wp-json/boeledin/v1/products?lang=${lang}`, {
        cache: "no-store",
      }),

      // Berita sudah lewat endpoint custom (boeledin/v1/berita),
      // filter bahasanya sudah benar dari awal -- tidak diubah.
      getPosts(lang as any),

      // FIX MASALAH 3: sebelumnya pakai getPages() yang hit /wp/v2/pages
      // (tipe konten "Page" bawaan WordPress) -- itu OBJEK YANG BEDA
      // TOTAL dari section (Hero/Footer/Contact Form/dst) yang
      // sebenarnya diedit CMS, yang tersimpan sebagai post_type "post".
      // Endpoint baru ini nyari post_type "post" yang PERNAH diedit
      // (punya meta _boeledin_last_edited_at), diurutin dari yang
      // paling baru diedit.
      fetch(
        `${WP_URL}/wp-json/boeledin/v1/sections/recent?lang=${lang}&limit=10`,
        { cache: "no-store" },
      ),

      getPagesCount(lang as any),
    ]);

    const products = productsRes.ok ? await productsRes.json() : [];
    const sections = sectionsRes.ok ? await sectionsRes.json() : [];

    const totalProducts = Array.isArray(products) ? products.length : 0;
    const totalNews = Array.isArray(news) ? news.length : 0;

    const recentItems = [
      // Catatan: endpoint custom products & berita balikin `title`
      // sebagai STRING biasa (bukan {rendered: string} kayak core
      // WordPress), makanya di sini langsung item.title / item.acf?.nama_produk,
      // tanpa .rendered.
      ...products.slice(0, 5).map((item: any) => ({
        id: item.id,
        title: item.acf?.nama_produk || item.title || "-",
        type: "product",
        date: item.modified,
        lastEditedBy: item.last_edited_by ?? null,
        lastEditedAt: item.last_edited_at ?? null,
      })),

      ...news.slice(0, 5).map((item: any) => ({
        id: item.id,
        title: item.title || "-",
        type: "news",
        date: item.modified,
        lastEditedBy: item.last_edited_by ?? null,
        lastEditedAt: item.last_edited_at ?? null,
      })),

      ...sections.map((item: any) => ({
        id: item.id,
        title: item.title || "-",
        type: "page",
        date: item.modified,
        lastEditedBy: item.last_edited_by ?? null,
        lastEditedAt: item.last_edited_at ?? null,
      })),
    ]
      .sort((a, b) => {
        // FIX MASALAH 2: sebelumnya date di-split ke tanggal doang
        // (jam dibuang), jadi item yang di-edit di HARI YANG SAMA
        // dianggap "sama persis" waktunya, dan urutannya balik ke
        // urutan asli array (product, news, page) -- kelihatan
        // kayak diurutin per kategori. Sekarang pakai timestamp
        // LENGKAP (jam-menit-detik ikut), dan prioritasin
        // lastEditedAt (lebih akurat) di atas date/modified biasa.
        const aTime = new Date(a.lastEditedAt || a.date || 0).getTime();
        const bTime = new Date(b.lastEditedAt || b.date || 0).getTime();

        return bTime - aTime;
      })
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
      { status: 500 },
    );
  }
}