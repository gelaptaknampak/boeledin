"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, Edit, Trash2, Search } from "lucide-react";
import toast from "react-hot-toast";
import { useSearchParams } from "next/navigation";

interface Category {
  id: number;
  name: string;
  count: number;
}

interface News {
  id: number;
  title: {
    rendered: string;
  };
  categories: number[];
  status: string;
  date: string;
  author_name?: string;
}

export default function NewsManagement() {
  const [searchQuery, setSearchQuery] = useState("");
  const [newsItems, setNewsItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState<Category[]>([]);
  const [categoryName, setCategoryName] = useState("");
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [loadingCategory, setLoadingCategory] = useState(false);
  const searchParams = useSearchParams();
  const lang = searchParams.get("lang") || "id";

  useEffect(() => {
    fetchPosts();
    fetchCategories();
  }, [lang]);

  async function fetchCategories() {
    const res = await fetch(`/api/wordpress/post-categories?lang=${lang}`);

    if (!res.ok) return;

    const data = await res.json();

    setCategories(data);
  }

  async function fetchPosts() {
    try {
      setLoading(true);

      const res = await fetch(
        `/api/wordpress/posts?_embed&lang=${lang}&_=${Date.now()}`,
        {
          cache: "no-store",
        },
      );

      if (!res.ok) throw new Error();

      const data = await res.json();

      setNewsItems(data);
    } catch (err) {
      console.error(err);
      toast.error("Gagal mengambil berita");
    } finally {
      setLoading(false);
    }
  }

  async function createCategory() {
    if (!categoryName.trim()) return;

    setLoadingCategory(true);

    const res = await fetch(`/api/wordpress/post-categories?lang=${lang}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: categoryName,
      }),
    });

    if (res.ok) {
      toast.success("Kategori berhasil dibuat");
      setCategoryName("");
      fetchCategories();
    }

    setLoadingCategory(false);
  }

  async function updateCategory(id: number) {
    const res = await fetch(`/api/wordpress/post-categories/${id}?lang=${lang}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: categoryName,
      }),
    });

    if (res.ok) {
      toast.success("Kategori berhasil diupdate");
      setEditingCategory(null);
      setCategoryName("");
      fetchCategories();
    }
  }

  async function deleteCategory(id: number) {
    if (!confirm("Hapus kategori?")) return;

    const res = await fetch(`/api/wordpress/post-categories/${id}?lang=${lang}`, {
      method: "DELETE",
    });

    if (res.ok) {
      toast.success("Kategori dihapus");
      fetchCategories();
    }
  }

  const filteredNews = newsItems.filter((item) =>
    item.title.rendered.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  async function handleDelete(id: number) {
    if (!confirm("Yakin ingin menghapus berita ini?")) return;

    try {
const res = await fetch(`/api/wordpress/posts/${id}?lang=${lang}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error();

      toast.success("Berita berhasil dihapus");

      fetchPosts();
    } catch {
      toast.error("Gagal menghapus berita");
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}

      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-2">Kelola Berita</h1>

          <p className="text-muted-foreground">
            Kelola semua artikel WordPress
          </p>
        </div>

        <Link
          href={`/admin/news/new?lang=${lang}`}
          className="flex items-center gap-2 px-6 py-2 bg-primary text-primary-foreground rounded-lg font-semibold"
        >
          <Plus className="w-5 h-5" />
          Tambah Berita
        </Link>
      </div>

      {/* Search */}

      <div className="relative">
        <Search className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />

        <input
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Cari berita..."
          className="w-full border rounded-lg pl-10 pr-4 py-2"
        />
      </div>

      <div className="bg-card rounded-xl border p-6 mb-6">
        <h2 className="font-bold text-lg mb-4">Kelola Kategori</h2>

        <div className="flex gap-3">
          <input
            value={categoryName}
            onChange={(e) => setCategoryName(e.target.value)}
            placeholder="Nama kategori..."
            className="flex-1 border rounded-lg px-4 py-2"
          />

          <button
            type="button"
            disabled={loadingCategory}
            onClick={() => {
              editingCategory
                ? updateCategory(editingCategory.id)
                : createCategory();
            }}
          >
            {loadingCategory
              ? "Loading..."
              : editingCategory
                ? "Update"
                : "Tambah"}
          </button>
        </div>

        <div className="flex flex-wrap gap-2 mt-5">
          {categories.map((category) => (
            <div
              key={category.id}
              className="flex items-center gap-2 px-3 py-2 rounded-full bg-accent"
            >
              <span>
                {category.name} ({category.count})
              </span>

              <button
                onClick={() => {
                  setEditingCategory(category);
                  setCategoryName(category.name);
                }}
              >
                <Edit className="w-4 h-4" />
              </button>

              <button onClick={() => deleteCategory(category.id)}>
                <Trash2 className="w-4 h-4 text-red-500" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Table */}

      <div className="bg-card border rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-accent border-b">
              <tr>
                <th className="px-6 py-4 text-left">Judul</th>

                <th className="px-6 py-4 text-left">Kategori</th>

                <th className="px-6 py-4 text-left">Penulis</th>

                <th className="px-6 py-4 text-left">Status</th>

                <th className="px-6 py-4 text-left">Tanggal</th>

                <th className="px-6 py-4 text-left">Aksi</th>
              </tr>
            </thead>

            <tbody className="divide-y">
              {!loading &&
                filteredNews.map((item) => {
                  const category =
                    item._embedded?.["wp:term"]?.[0]?.[0]?.name ?? "-";

                  const author = item._embedded?.author?.[0]?.name ?? "-";

                  return (
                    <tr key={item.id} className="hover:bg-accent/50">
                      <td className="px-6 py-4 font-medium max-w-md">
                        {item.title.rendered}
                      </td>

                      <td className="px-6 py-4">{category}</td>

                      <td className="px-6 py-4">{author}</td>

                      <td className="px-6 py-4">
                        <span
                          className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                            item.status === "publish"
                              ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-200"
                              : "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-200"
                          }`}
                        >
                          {item.status === "publish"
                            ? "Dipublikasikan"
                            : "Draft"}
                        </span>
                      </td>

                      <td className="px-6 py-4 text-sm">
                        {new Date(item.date).toLocaleDateString("id-ID")}
                      </td>

                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <Link
                            href={`/admin/news/${item.id}/edit?lang=${lang}`}
                            className="p-2 rounded-lg hover:bg-accent"
                          >
                            <Edit className="w-4 h-4 text-primary" />
                          </Link>

                          <button
                            onClick={() => handleDelete(item.id)}
                            className="p-2 rounded-lg hover:bg-accent"
                          >
                            <Trash2 className="w-4 h-4 text-red-500" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>

        {!loading && filteredNews.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            Tidak ada berita ditemukan.
          </div>
        )}

        {loading && (
          <div className="text-center py-12 text-muted-foreground">
            Memuat data...
          </div>
        )}
      </div>

      {/* Info */}

      <div className="bg-accent border border-primary/30 rounded-lg p-6">
        <h3 className="font-semibold mb-2">Informasi</h3>

        <p className="text-sm text-muted-foreground">
          Semua artikel pada halaman ini langsung terhubung dengan WordPress
          Post. Perubahan yang dilakukan melalui CMS Next.js akan otomatis
          tersimpan di WordPress.
        </p>
      </div>
    </div>
  );
}
