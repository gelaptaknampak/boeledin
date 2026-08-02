"use client";

import { useEffect, useState } from "react";
import { Edit, Trash2, Plus } from "lucide-react";
import toast from "react-hot-toast";

interface Brand {
  id: number;
  name: string;
  slug: string;
  count: number;
}

export default function BrandManager() {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);

  const [newBrand, setNewBrand] = useState("");

  const [editingId, setEditingId] = useState<number | null>(null);

  const [editingName, setEditingName] = useState("");

  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchBrands();
  }, []);

  async function fetchBrands() {
    try {
      setLoading(true);

      const res = await fetch(`/api/wordpress/brands?_=${Date.now()}`, {
        cache: "no-store",
      });

      if (!res.ok) {
        throw new Error();
      }

      const data = await res.json();

      setBrands(data);
    } catch (err) {
      console.error(err);
      toast.error("Gagal mengambil data brand");
    } finally {
      setLoading(false);
    }
  }

  async function handleAddBrand() {
    if (!newBrand.trim()) return;

    try {
      setSaving(true);

      const res = await fetch("/api/wordpress/brands", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: newBrand,
        }),
      });

      if (!res.ok) throw new Error();

      toast.success("Brand berhasil ditambahkan");

      setNewBrand("");

      fetchBrands();
    } catch {
      toast.error("Gagal menambahkan brand");
    } finally {
      setSaving(false);
    }
  }

  async function handleUpdateBrand(id: number) {
    if (!editingName.trim()) return;

    try {
      setSaving(true);

      const res = await fetch(`/api/wordpress/brands/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: editingName,
        }),
      });

      if (!res.ok) throw new Error();

      toast.success("Brand berhasil diupdate");

      setEditingId(null);

      fetchBrands();
    } catch {
      toast.error("Gagal mengupdate brand");
    } finally {
      setSaving(false);
    }
  }

  async function handleDeleteBrand(id: number) {
    if (!confirm("Yakin ingin menghapus brand ini?")) return;

    try {
      const res = await fetch(`/api/wordpress/brands/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error();

      toast.success("Brand berhasil dihapus");

      fetchBrands();
    } catch {
      toast.error("Gagal menghapus brand");
    }
  }

  return (
    <div className="bg-card border border-border rounded-xl p-6">
      {/* Header */}

      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold">Brand</h2>

          <p className="text-sm text-muted-foreground">
            Kelola daftar brand produk
          </p>
        </div>

        <div className="flex gap-2">
          <input
            value={newBrand}
            onChange={(e) => setNewBrand(e.target.value)}
            placeholder="Nama brand..."
            className="border rounded-lg px-3 py-2"
          />

          <button
            disabled={saving}
            onClick={handleAddBrand}
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

      {!loading && brands.length === 0 && (
        <div className="py-10 text-center text-muted-foreground">
          Belum ada brand.
        </div>
      )}

      {/* List */}

      {!loading && brands.length > 0 && (
        <div className="divide-y divide-border">
          {brands.map((brand) => (
            <div
              key={brand.id}
              className="flex items-center justify-between py-4"
            >
              <div>
                {editingId === brand.id ? (
                  <input
                    value={editingName}
                    onChange={(e) => setEditingName(e.target.value)}
                    className="border rounded-lg px-3 py-2 w-72"
                  />
                ) : (
                  <h3 className="font-medium">{brand.name}</h3>
                )}

                <p className="text-sm text-muted-foreground">
                  Digunakan oleh {brand.count} produk
                </p>
              </div>
              <div className="flex items-center gap-2">
                {editingId === brand.id ? (
                  <>
                    <button
                      disabled={saving}
                      onClick={() => handleUpdateBrand(brand.id)}
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
                        setEditingId(brand.id);
                        setEditingName(brand.name);
                      }}
                      className="p-2 rounded-lg hover:bg-accent"
                    >
                      <Edit className="w-4 h-4 text-primary" />
                    </button>

                    <button
                      onClick={() => handleDeleteBrand(brand.id)}
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
