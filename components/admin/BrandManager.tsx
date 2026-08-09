"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import { Edit, Trash2, Plus } from "lucide-react";
import toast from "react-hot-toast";

interface Brand {
  id: number;
  name: string;
  slug: string;
  count: number;
  taxonomy: string;
  language: "en" | "id" | null;

  translations: {
    en?: number;
    id?: number;
  };

  acf?: {
    brand_logo?: number;
    brand_logo_url?: string;
  };
}

export default function BrandManager() {
  const searchParams = useSearchParams();
  const lang = searchParams.get("lang") || "id";

  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);

  const [newBrand, setNewBrand] = useState("");
  const [newLogo, setNewLogo] = useState<File | null>(null);
  const [newLogoPreview, setNewLogoPreview] = useState("");

  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingName, setEditingName] = useState("");
  const [editingLogo, setEditingLogo] = useState<File | null>(null);
  const [editingLogoPreview, setEditingLogoPreview] = useState("");

  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchBrands();
  }, [lang]);

 async function fetchBrands() {
  try {
    setLoading(true);

    const res = await fetch(
      `/api/wordpress/brands?lang=${lang}&_=${Date.now()}`,
      {
        cache: "no-store",
      }
    );

    if (!res.ok) throw new Error();

    const data = await res.json();

    setBrands(data);
  } catch (err) {
    console.error(err);
    toast.error("Gagal mengambil data brand");
  } finally {
    setLoading(false);
  }
}

  async function uploadMedia(file: File) {
    const formData = new FormData();

    formData.append("file", file);

    const res = await fetch("/api/wordpress/media", {
      method: "POST",
      body: formData,
    });

    if (!res.ok) throw new Error("Upload gagal");

    return await res.json();
  }

  async function handleAddBrand() {
    if (!newBrand.trim()) return;

    try {
      setSaving(true);

      let logoId = null;

      if (newLogo) {
        const media = await uploadMedia(newLogo);
        logoId = media.id;
      }

      const res = await fetch(`/api/wordpress/brands?lang=${lang}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: newBrand,
          brand_logo: logoId,
        }),
      });

      if (!res.ok) throw new Error();

      toast.success("Brand berhasil ditambahkan");

      setNewBrand("");
      setNewLogo(null);
      setNewLogoPreview("");

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

      let logoId = undefined;

      if (editingLogo) {
        const media = await uploadMedia(editingLogo);

        console.log("MEDIA:", media);

        logoId = media.id;
      }

      const res = await fetch(`/api/wordpress/brands/${id}?lang=${lang}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: editingName,
          brand_logo: logoId,
        }),
      });

      if (!res.ok) throw new Error();

      toast.success("Brand berhasil diupdate");

      setEditingId(null);
      setEditingLogo(null);
      setEditingLogoPreview("");

      fetchBrands();
    } catch {
      toast.error("Gagal update brand");
    } finally {
      setSaving(false);
    }
  }

  async function handleDeleteBrand(id: number) {
    if (!confirm("Yakin ingin menghapus brand ini?")) return;

    try {
      const res = await fetch(`/api/wordpress/brands/${id}?lang=${lang}`, {
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
    <div className="rounded-xl border border-border bg-card p-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-xl font-bold">Brand</h2>
          <p className="text-muted-foreground text-sm">
            Kelola brand beserta logo
          </p>
        </div>
      </div>

      {/* ADD BRAND */}

      <div className="mb-8 rounded-xl border p-5 space-y-4">
        <input
          value={newBrand}
          onChange={(e) => setNewBrand(e.target.value)}
          placeholder="Nama Brand"
          className="w-full rounded-lg border px-4 py-2"
        />

        <input
          type="file"
          accept="image/*"
          onChange={(e) => {
            const file = e.target.files?.[0];

            if (!file) return;

            setNewLogo(file);
            setNewLogoPreview(URL.createObjectURL(file));
          }}
        />

        {newLogoPreview && (
          <Image
            src={newLogoPreview}
            alt=""
            width={120}
            height={60}
            className="h-16 w-auto object-contain border rounded-lg p-2"
          />
        )}

        <button
          disabled={saving}
          onClick={handleAddBrand}
          className="flex items-center gap-2 rounded-lg bg-primary px-5 py-2 text-primary-foreground"
        >
          <Plus className="h-4 w-4" />
          Tambah Brand
        </button>
      </div>

      {loading && <div className="text-center py-10">Memuat...</div>}

      {!loading && (
        <div className="divide-y">
          {brands.map((brand) => (
            <div
              key={brand.id}
              className="flex items-start justify-between gap-6 py-5"
            >
              <div className="flex flex-1 gap-4 items-start min-w-0">
                <div className="h-16 w-24 rounded-lg border flex items-center justify-center bg-white">
                  {editingId === brand.id ? (
                    editingLogoPreview ? (
                      <Image
                        src={editingLogoPreview}
                        alt=""
                        width={80}
                        height={40}
                        className="object-contain"
                      />
                    ) : (
                      brand.acf?.brand_logo_url && (
                        <Image
                          src={brand.acf.brand_logo_url}
                          alt=""
                          width={80}
                          height={40}
                          className="object-contain"
                        />
                      )
                    )
                  ) : (
                    brand.acf?.brand_logo_url && (
                      <Image
                        src={brand.acf.brand_logo_url}
                        alt={brand.name}
                        width={80}
                        height={40}
                        className="object-contain"
                      />
                    )
                  )}
                </div>

                <div>
                  {editingId === brand.id ? (
                    <div className="space-y-3 w-full max-w-md">
                      <input
                        value={editingName}
                        onChange={(e) => setEditingName(e.target.value)}
                        className="w-full rounded-lg border px-3 py-2"
                      />

                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];

                          if (!file) return;

                          setEditingLogo(file);
                          setEditingLogoPreview(URL.createObjectURL(file));
                        }}
                      />
                    </div>
                  ) : (
                    <>
                      <h3 className="font-semibold">{brand.name}</h3>

                      <p className="text-sm text-muted-foreground">
                        Digunakan oleh {brand.count} produk
                      </p>
                    </>
                  )}
                </div>
              </div>

              <div className="flex gap-2">
                {editingId === brand.id ? (
                  <>
                    <button
                      onClick={() => handleUpdateBrand(brand.id)}
                      className="rounded bg-green-600 px-4 py-2 text-white"
                    >
                      Simpan
                    </button>

                    <button
                      onClick={() => {
                        setEditingId(null);
                        setEditingLogo(null);
                        setEditingLogoPreview("");
                      }}
                      className="rounded border px-4 py-2"
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
                      className="rounded-lg p-2 hover:bg-accent"
                    >
                      <Edit className="h-4 w-4 text-primary" />
                    </button>

                    <button
                      onClick={() => handleDeleteBrand(brand.id)}
                      className="rounded-lg p-2 hover:bg-accent"
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
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
