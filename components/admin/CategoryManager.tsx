"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Edit, Trash2, Plus } from "lucide-react";
import toast from "react-hot-toast";

interface ProductType {
  id: number;
  name: string;
  slug: string;
  count: number;
}

export default function CategoryManager() {
  const searchParams = useSearchParams();
  const lang = searchParams.get("lang") || "id";

  const [category, setCategory] = useState<ProductType[]>([]);
  const [loading, setLoading] = useState(true);

  const [newCategory, setNewCategory] = useState("");

  const [editingId, setEditingId] = useState<number | null>(null);

  const [editingName, setEditingName] = useState("");

  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, [lang]);

  async function fetchCategories() {
    try {
      setLoading(true);

      const res = await fetch(
        `/api/wordpress/product-types?lang=${lang}&_=${Date.now()}`,
        {
          cache: "no-store",
        },
      );

      if (!res.ok) {
        throw new Error();
      }

      const data = await res.json();

      setCategory(data);
    } catch (err) {
      console.error(err);
      toast.error("Gagal mengambil data jenis produk");
    } finally {
      setLoading(false);
    }
  }

  async function handleAddCategory() {
    if (!newCategory.trim()) return;

    try {
      setSaving(true);

      const res = await fetch(`/api/wordpress/product-types?lang=${lang}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: newCategory,
        }),
      });

      if (!res.ok) throw new Error();

      toast.success("Jenis produk berhasil ditambahkan");

      setNewCategory("");

      fetchCategories();
    } catch {
      toast.error("Gagal menambahkan jenis produk");
    } finally {
      setSaving(false);
    }
  }

  async function handleUpdateCategory(id: number) {
    if (!editingName.trim()) return;

    try {
      setSaving(true);

      const res = await fetch(
        `/api/wordpress/product-types/${id}?lang=${lang}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: editingName,
          }),
        },
      );

      if (!res.ok) throw new Error();

      toast.success("Jenis produk berhasil diupdate");

      setEditingId(null);
      setEditingName("");

      fetchCategories();
    } catch {
      toast.error("Gagal mengupdate jenis produk");
    } finally {
      setSaving(false);
    }
  }

  async function handleDeleteCategory(id: number) {
    if (!confirm("Yakin ingin menghapus jenis produk ini?")) return;

    try {
      const res = await fetch(`/api/wordpress/product-types/${id}?lang=${lang}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error();

      toast.success("Jenis produk berhasil dihapus");

      fetchCategories();
    } catch {
      toast.error("Gagal menghapus jenis produk");
    }
  }

  return (
    <div className="bg-card border border-border rounded-xl p-6">
      {/* Header */}

      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold">Jenis Produk</h2>

          <p className="text-sm text-muted-foreground">
            Kelola daftar jenis produk
          </p>
        </div>

        <div className="flex gap-2">
          <input
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            placeholder="Nama jenis produk..."
            className="border rounded-lg px-3 py-2"
          />

          <button
            disabled={saving || !newCategory.trim()}
            onClick={handleAddCategory}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground"
          >
            <Plus className="w-4 h-4" />
            Tambah
          </button>
        </div>
      </div>

      {/* Loading */}

      {loading && (
        <div className="py-10 text-center text-muted-foreground">
          Memuat data...
        </div>
      )}

      {/* Empty */}

      {!loading && category.length === 0 && (
        <div className="py-10 text-center text-muted-foreground">
          Belum ada jenis produk.
        </div>
      )}

      {/* List */}

      {!loading && category.length > 0 && (
        <div className="divide-y divide-border">
          {category.map((category) => (
            <div
              key={category.id}
              className="flex items-center justify-between py-4"
            >
              <div>
                {editingId === category.id ? (
                  <input
                    value={editingName}
                    onChange={(e) => setEditingName(e.target.value)}
                    className="border rounded-lg px-3 py-2 w-72"
                  />
                ) : (
                  <h3 className="font-medium">{category.name}</h3>
                )}

                <p className="text-sm text-muted-foreground">
                  Digunakan oleh {category.count} produk
                </p>
              </div>
              <div className="flex items-center gap-2">
                {editingId === category.id ? (
                  <>
                    <button
                      disabled={saving || !newCategory.trim()}
                      onClick={() => handleUpdateCategory(category.id)}
                      className="px-3 py-1 rounded bg-green-600 text-white"
                    >
                      Simpan
                    </button>

                    <button
                      onClick={() => setEditingId(null)}
                      className="px-3 py-1 rounded border"
                    >
                      Batal
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => {
                        setEditingId(category.id);
                        setEditingName(category.name);
                      }}
                      className="p-2 rounded-lg hover:bg-accent"
                    >
                      <Edit className="w-4 h-4 text-primary" />
                    </button>

                    <button
                      onClick={() => handleDeleteCategory(category.id)}
                      className="p-2 rounded-lg hover:bg-accent"
                    >
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
