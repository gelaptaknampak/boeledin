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
  brand: number;
  jenis_produk: number;
  short_description: string;
  description: string;
  spesifikasi: string;

  feature_image: string; // isi: "123\n124\n125"
  feature_image_urls: string[];

  download_brosur: number | File | null;
  download_brosur_url: string;
}

export default function ProductForm({ mode, productId }: ProductFormProps) {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [brands, setBrands] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [selectedImages,setSelectedImages] = useState<File[]>([]);

  async function fetchBrands() {
    const res = await fetch("/api/wordpress/brands");
    const data = await res.json();

    setBrands(data);
  }

  async function fetchCategories() {
    const res = await fetch("/api/wordpress/product-types");
    const data = await res.json();

    setCategories(data);
  }

  useEffect(() => {
    fetchBrands();
    fetchCategories();
  }, []);

  const [form, setForm] = useState<ProductFormData>({
    nama_produk: "",
    model_produk: "",
    brand: 0,
    jenis_produk: 0,
    short_description: "",
    description: "",
    spesifikasi: "",
    feature_image: "",
    feature_image_urls: [],

    download_brosur: null,
    download_brosur_url: "",
  });

  function handleChange(
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) {
    const target = e.target;
    const name = target.name as keyof ProductFormData;
    const value = target.value;

    setForm(
      (prev) =>
        ({
          ...prev,
          [name]:
            name === "brand" || name === "jenis_produk" ? Number(value) : value,
        }) as ProductFormData,
    );
  }

  useEffect(() => {
    if (mode === "edit" && productId) {
      fetchProduct();
    }
  }, [mode, productId]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    setLoading(true);

    try {
      const url =
        mode === "create"
          ? "/api/wordpress/products"
          : `/api/wordpress/products/${productId}`;

      let gallery = form.feature_image;

      const ids: number[] = [];

      if (selectedImages.length > 0) {

          for (const file of selectedImages) {
              const media = await uploadMedia(file);
              ids.push(media.id);
          }

          gallery =
              form.feature_image
                  ? `${form.feature_image}\n${ids.join("\n")}`
                  : ids.join("\n");
      }

      let pdfId = form.download_brosur;

      if (form.download_brosur instanceof File) {
        const pdf = await uploadMedia(form.download_brosur);

        pdfId = pdf.id;
      }

      const payload = {
        nama_produk: form.nama_produk,
        model_produk: form.model_produk,
        brand: form.brand,
        "jenis-produk": [Number(form.jenis_produk)],
        short_description: form.short_description,
        description: form.description,
        spesifikasi: form.spesifikasi,
        feature_image: gallery,
        download_brosur: pdfId,
      };

      // console.log(payload);
      // console.log(typeof payload["jenis-produk"]);
      // console.log(payload["jenis-produk"]);
      // console.log(typeof payload["jenis-produk"][0]);

      const res = await fetch(url, {
        method: mode === "create" ? "POST" : "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.status === 401) {
        toast.error("Sesi login telah habis. Silakan login kembali.");
        router.push("/admin/login");
        return;
      }

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

  async function uploadMedia(file: File) {
    const formData = new FormData();

    formData.append("file", file);

    const res = await fetch("/api/wordpress/media", {
      method: "POST",
      body: formData,
    });

    if (!res.ok) {
      throw new Error("Upload media gagal");
    }

    return await res.json();
  }

  async function fetchProduct() {
  try {
    setLoading(true);

    const res = await fetch(`/api/wordpress/products/${productId}?_embed`);
    const product = await res.json();

    let pdfUrl = "";

    // =========================
    // Gallery
    // =========================

    const ids = (product.acf.feature_image ?? "")
      .split(/[\n,]+/)
      .map((id: string) => id.trim())
      .filter(Boolean);

    const urls: string[] = [];

    for (const id of ids) {
      const imageRes = await fetch(
        `https://wp.boeledin.com/wp-json/wp/v2/media/${id}`
      );

      if (imageRes.ok) {
        const image = await imageRes.json();
        urls.push(image.source_url);
      }
    }

    // =========================
    // PDF
    // =========================

    if (product.acf.download_brosur) {
      const pdfRes = await fetch(
        `https://wp.boeledin.com/wp-json/wp/v2/media/${product.acf.download_brosur}`
      );

      if (pdfRes.ok) {
        const pdf = await pdfRes.json();
        pdfUrl = pdf.source_url;
      }
    }

    setForm({
      nama_produk: product.acf.nama_produk ?? "",
      model_produk: product.acf.model_produk ?? "",
      brand: product.brand?.[0] ?? 0,
      jenis_produk: product["jenis-produk"]?.[0] ?? 0,
      short_description: product.acf.short_description ?? "",
      description: product.acf.description ?? "",
      spesifikasi: product.acf.spesifikasi ?? "",

      // string "12\n15\n18"
      feature_image: product.acf.feature_image ?? "",

      // preview gallery
      feature_image_urls: urls,

      download_brosur: product.acf.download_brosur ?? null,
      download_brosur_url: pdfUrl,
    });
  } catch (err) {
    console.error(err);
    toast.error("Gagal mengambil produk");
  } finally {
    setLoading(false);
  }
}

function removeImage(index: number) {
  setSelectedImages((prev) => prev.filter((_, i) => i !== index));

  setForm((prev) => ({
    ...prev,
    feature_image_urls: prev.feature_image_urls.filter((_, i) => i !== index),
  }));
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
          className="px-4 py-2 border rounded-lg w-full bg-white text-black"
        >
          <option value="">Pilih Brand</option>

          {brands.map((brand: any) => (
            <option key={brand.id} value={brand.id}>
              {brand.name}
            </option>
          ))}
        </select>
      </div>

      {/* Jenis */}

      <div>
        <label className="font-semibold block mb-2">Jenis Produk</label>

        <select
          name="jenis_produk"
          value={form.jenis_produk}
          onChange={handleChange}
          className="px-4 py-2 border rounded-lg w-full bg-white text-black"
        >
          <option value="">Pilih Jenis</option>

          {categories.map((cat: any) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
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

      {/* Gambar Produk */}
      <div>
        <label>Gambar Produk</label>

        <input
            type="file"
            multiple
            accept="image/*"
            onChange={(e) => {
              const files = Array.from(e.target.files ?? []);

              if (files.length === 0) return;

              setSelectedImages((prev) => [...prev, ...files]);

              setForm((prev) => ({
                ...prev,
                feature_image_urls: [
                  ...prev.feature_image_urls,
                  ...files.map((file) => URL.createObjectURL(file)),
                ],
              }));

              // supaya pilih file yang sama tetap memicu onChange
              e.target.value = "";
            }}
        />
        <div className="mt-4 grid grid-cols-4 gap-4">
          {form.feature_image_urls.map((url, index) => (
            <div
              key={index}
              className="relative group"
            >
              <img
                src={url}
                className="h-28 w-full rounded-lg object-cover border"
              />

              <button
                type="button"
                onClick={() => removeImage(index)}
                className="
                  absolute
                  top-2
                  right-2
                  hidden
                  group-hover:flex
                  h-7
                  w-7
                  items-center
                  justify-center
                  rounded-full
                  bg-red-600
                  text-white
                  text-sm
                "
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Download Brosur */}
      <div>
        <label>Download Brosur</label>

        <input
          type="file"
          accept=".pdf"
          onChange={(e) => {
            const file = e.target.files?.[0];

            if (!file) return;

            setForm({
              ...form,
              download_brosur: file,
              download_brosur_url: URL.createObjectURL(file),
            });
          }}
        />
        {form.download_brosur_url && (
          <a
            href={form.download_brosur_url}
            target="_blank"
            className="text-blue-600 underline block mt-2"
          >
            Lihat Brosur Saat Ini
          </a>
        )}
      </div>

      <div className="flex gap-4">
        <button
          disabled={loading}
          className="px-8 py-3 rounded-lg bg-primary text-primary-foreground font-semibold"
        >
          {mode === "create" ? "Simpan Produk" : "Update Produk"}
        </button>
        <button
          type="button"
          onClick={() => router.push("/admin/products")}
          className="px-8 py-3 rounded-lg bg-primary text-primary-foreground font-semibold"
        >
          Kembali
        </button>
      </div>
    </form>
  );
}
