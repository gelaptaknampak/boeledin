"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

interface ProductFormProps {
  mode: "create" | "edit";
  productId?: number;
}

interface ProductFormData {
  nama_produk: string;
  model_produk: string;
  brand: string;
  jenis_produk: string;
  short_description: string;
  description: string;
  spesifikasi: string;
}

export default function ProductForm({ mode, productId }: ProductFormProps) {
  const router = useRouter();

  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState<ProductFormData>({
    nama_produk: "",
    model_produk: "",
    brand: "",
    jenis_produk: "",
    short_description: "",
    description: "",
    spesifikasi: "",
  });

  function handleChange(
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  }

  useEffect(() => {
    if (mode === "edit" && productId) {
      fetchProduct();
    }
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    setLoading(true);

    try {
      const url =
        mode === "create"
          ? "/api/wordpress/products"
          : `/api/wordpress/products/${productId}`;

      const method = mode === "create" ? "POST" : "PUT";

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message || "Terjadi kesalahan");
        return;
      }

      toast.success(
        mode === "create"
          ? "Produk berhasil dibuat"
          : "Produk berhasil diupdate",
      );

      router.push("/admin/products");
      router.refresh();
    } catch (err) {
      console.error(err);
      toast.error("Terjadi kesalahan");
    } finally {
      setLoading(false);
    }
  }

  async function fetchProduct() {
    try {
      setLoading(true);

      const res = await fetch(`/api/wordpress/products/${productId}`);

      const product = await res.json();

      setForm({
        nama_produk: product.acf.nama_produk ?? "",

        model_produk: product.acf.model_produk ?? "",

        brand: product.acf.brand ?? "",

        jenis_produk: product.acf.jenis_produk ?? "",

        short_description: product.acf.short_description ?? "",

        description: product.acf.description ?? "",

        spesifikasi: product.acf.spesifikasi ?? "",
      });
    } catch (err) {
      console.error(err);

      toast.error("Gagal mengambil produk");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-5xl">
      <h1 className="text-3xl font-bold">
        {mode === "create" ? "Tambah Produk" : "Edit Produk"}
      </h1>

      {/* Nama */}

      <div>
        <label className="font-semibold block mb-2">Nama Produk</label>

        <input
          name="nama_produk"
          value={form.nama_produk}
          onChange={handleChange}
          className="w-full border rounded-lg px-4 py-2"
        />
      </div>

      {/* Model */}

      <div>
        <label className="font-semibold block mb-2">Model Produk</label>

        <input
          name="model_produk"
          value={form.model_produk}
          onChange={handleChange}
          className="w-full border rounded-lg px-4 py-2"
        />
      </div>

      {/* Brand */}

      <div>
        <label className="font-semibold block mb-2">Brand</label>

        <select
          name="brand"
          value={form.brand}
          onChange={handleChange}
          className="w-full border rounded-lg px-4 py-2"
        >
          <option value="">Pilih Brand</option>

          <option value="BOE">BOE</option>

          <option value="BOELED">BOELED</option>

          <option value="FBI">FBI</option>
        </select>
      </div>

      {/* Jenis */}

      <div>
        <label className="font-semibold block mb-2">Jenis Produk</label>

        <select
          name="jenis_produk"
          value={form.jenis_produk}
          onChange={handleChange}
          className="w-full border rounded-lg px-4 py-2"
        >
          <option value="">Pilih Jenis</option>

          <option value="Digital Signage">Digital Signage</option>

          <option value="Interactive Flat Panel">Interactive Flat Panel</option>

          <option value="LED Display">LED Display</option>
        </select>
      </div>

      {/* Short */}

      <div>
        <label className="font-semibold block mb-2">Short Description</label>

        <textarea
          rows={3}
          name="short_description"
          value={form.short_description}
          onChange={handleChange}
          className="w-full border rounded-lg px-4 py-2"
        />
      </div>

      {/* Description */}

      <div>
        <label className="font-semibold block mb-2">Description</label>

        <textarea
          rows={8}
          name="description"
          value={form.description}
          onChange={handleChange}
          className="w-full border rounded-lg px-4 py-2"
        />
      </div>

      {/* Spesifikasi */}

      <div>
        <label className="font-semibold block mb-2">Spesifikasi</label>

        <textarea
          rows={8}
          name="spesifikasi"
          value={form.spesifikasi}
          onChange={handleChange}
          className="w-full border rounded-lg px-4 py-2"
        />
      </div>

      <button
        disabled={loading}
        className="px-8 py-3 rounded-lg bg-primary text-primary-foreground font-semibold"
      >
        {mode === "create" ? "Simpan Produk" : "Update Produk"}
      </button>
    </form>
  );
}
