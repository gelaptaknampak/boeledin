"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
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

  feature_image: string;
  feature_image_urls: string[];

  download_brosur: number | File | null;
  download_brosur_url: string;
}

export default function ProductForm({
  mode,
  productId,
}: ProductFormProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const lang = searchParams.get("lang") || "id";

  const returnUrl = `/admin/products?lang=${lang}`;

  const [loading, setLoading] = useState(false);

  const [brands, setBrands] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);

  const [selectedImages, setSelectedImages] = useState<File[]>([]);

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

  /**
   * ============================
   * FETCH BRANDS
   * ============================
   */
  async function fetchBrands() {
    try {
      const res = await fetch(
        `/api/wordpress/brands?lang=${lang}`,
        {
          cache: "no-store",
        },
      );

      if (!res.ok) {
        throw new Error("Gagal mengambil brand");
      }

      const data = await res.json();

      setBrands(data);
    } catch (error) {
      console.error("FETCH BRANDS ERROR:", error);
      toast.error("Gagal mengambil brand");
    }
  }

  /**
   * ============================
   * FETCH PRODUCT TYPES
   * ============================
   */
  async function fetchCategories() {
    try {
      const res = await fetch(
        `/api/wordpress/product-types?lang=${lang}`,
        {
          cache: "no-store",
        },
      );

      if (!res.ok) {
        throw new Error("Gagal mengambil jenis produk");
      }

      const data = await res.json();

      setCategories(data);
    } catch (error) {
      console.error(
        "FETCH PRODUCT TYPES ERROR:",
        error,
      );

      toast.error("Gagal mengambil jenis produk");
    }
  }

  /**
   * Load brand & category ketika language berubah.
   */
  useEffect(() => {
    fetchBrands();
    fetchCategories();
  }, [lang]);

  /**
   * ============================
   * HANDLE INPUT
   * ============================
   */
  function handleChange(
    e: React.ChangeEvent<
      HTMLInputElement |
      HTMLTextAreaElement |
      HTMLSelectElement
    >,
  ) {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]:
        name === "brand" ||
        name === "jenis_produk"
          ? Number(value)
          : value,
    }));
  }

  /**
   * ============================
   * FETCH PRODUCT
   * ============================
   */
  useEffect(() => {
    if (
      mode === "edit" &&
      productId
    ) {
      fetchProduct();
    }
  }, [mode, productId, lang]);

  async function fetchProduct() {
    try {
      setLoading(true);

      /**
       * Tidak perlu mencari translation
       * di frontend.
       *
       * API /products/[id]
       * akan otomatis menentukan
       * translation ID berdasarkan lang.
       */
      const res = await fetch(
        `/api/wordpress/products/${productId}?lang=${lang}`,
        {
          cache: "no-store",
        },
      );

      if (!res.ok) {
        throw new Error(
          "Produk tidak ditemukan",
        );
      }

      const product = await res.json();

      /**
       * ============================
       * GALLERY
       * ============================
       */
      const ids = (
        product.acf?.feature_image ?? ""
      )
        .split(/[\n,]+/)
        .map((id: string) => id.trim())
        .filter(Boolean);

      const urls: string[] = [];

      for (const id of ids) {
        try {
          const imageRes = await fetch(
            `https://wp.boeledin.com/wp-json/wp/v2/media/${id}`,
            {
              cache: "no-store",
            },
          );

          if (!imageRes.ok) continue;

          const image = await imageRes.json();

          if (image.source_url) {
            urls.push(image.source_url);
          }
        } catch (error) {
          console.error(
            `Gagal mengambil image ${id}:`,
            error,
          );
        }
      }

      /**
       * ============================
       * PDF
       * ============================
       */
      let pdfUrl = "";

      const pdfId =
        product.acf?.download_brosur;

      if (pdfId) {
        try {
          const pdfRes = await fetch(
            `https://wp.boeledin.com/wp-json/wp/v2/media/${pdfId}`,
            {
              cache: "no-store",
            },
          );

          if (pdfRes.ok) {
            const pdf = await pdfRes.json();

            pdfUrl = pdf.source_url ?? "";
          }
        } catch (error) {
          console.error(
            "Gagal mengambil PDF:",
            error,
          );
        }
      }

      /**
       * ============================
       * SET FORM
       * ============================
       */
      setForm({
        nama_produk:
          product.acf?.nama_produk ?? "",

        model_produk:
          product.acf?.model_produk ?? "",

        brand:
          product.brand?.[0] ?? 0,

        jenis_produk:
          product["jenis-produk"]?.[0] ?? 0,

        short_description:
          product.acf?.short_description ?? "",

        description:
          product.acf?.description ?? "",

        spesifikasi:
          product.acf?.spesifikasi ?? "",

        feature_image:
          product.acf?.feature_image ?? "",

        feature_image_urls: urls,

        download_brosur:
          product.acf?.download_brosur ?? null,

        download_brosur_url: pdfUrl,
      });
    } catch (error) {
      console.error(
        "FETCH PRODUCT ERROR:",
        error,
      );

      toast.error(
        "Gagal mengambil produk",
      );
    } finally {
      setLoading(false);
    }
  }

  /**
   * ============================
   * UPLOAD MEDIA
   * ============================
   */
  async function uploadMedia(
    file: File,
  ) {
    const formData = new FormData();

    formData.append("file", file);

    const res = await fetch(
      "/api/wordpress/media",
      {
        method: "POST",
        body: formData,
      },
    );

    if (!res.ok) {
      throw new Error(
        "Upload media gagal",
      );
    }

    return res.json();
  }

  /**
   * ============================
   * SUBMIT
   * ============================
   */
  async function handleSubmit(
    e: React.FormEvent,
  ) {
    e.preventDefault();

    setLoading(true);

    try {
      const url =
        mode === "create"
          ? `/api/wordpress/products?lang=${lang}`
          : `/api/wordpress/products/${productId}?lang=${lang}`;

      /**
       * ============================
       * GALLERY
       * ============================
       */
      let gallery =
        form.feature_image;

      const uploadedIds: number[] = [];

      if (
        selectedImages.length > 0
      ) {
        for (const file of selectedImages) {
          const media =
            await uploadMedia(file);

          uploadedIds.push(media.id);
        }

        gallery = form.feature_image
          ? `${form.feature_image}\n${uploadedIds.join("\n")}`
          : uploadedIds.join("\n");
      }

      /**
       * ============================
       * PDF
       * ============================
       */
      let pdfId =
        form.download_brosur;

      if (
        form.download_brosur instanceof
        File
      ) {
        const pdf =
          await uploadMedia(
            form.download_brosur,
          );

        pdfId = pdf.id;
      }

      /**
       * ============================
       * PAYLOAD
       * ============================
       */
      const payload = {
        nama_produk:
          form.nama_produk,

        model_produk:
          form.model_produk,

        brand: form.brand,

        "jenis-produk":
          [Number(form.jenis_produk)],

        short_description:
          form.short_description,

        description:
          form.description,

        spesifikasi:
          form.spesifikasi,

        feature_image:
          gallery,

        download_brosur:
          pdfId,
      };

      const res = await fetch(
        url,
        {
          method:
            mode === "create"
              ? "POST"
              : "PUT",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify(
            payload,
          ),
        },
      );

      const data =
        await res.json();

      if (res.status === 401) {
        toast.error(
          "Sesi login telah habis. Silakan login kembali.",
        );

        router.push(
          "/admin/login",
        );

        return;
      }

      if (!res.ok) {
        toast.error(
          data.message ||
            "Terjadi kesalahan",
        );

        return;
      }

      toast.success(
        mode === "create"
          ? `Produk ${lang.toUpperCase()} berhasil dibuat`
          : `Produk ${lang.toUpperCase()} berhasil diupdate`,
      );

      router.push(returnUrl);
      router.refresh();
    } catch (error) {
      console.error(
        "SUBMIT PRODUCT ERROR:",
        error,
      );

      toast.error(
        "Terjadi kesalahan",
      );
    } finally {
      setLoading(false);
    }
  }

  /**
   * ============================
   * REMOVE IMAGE
   * ============================
   */
  function removeImage(
    index: number,
  ) {
    setSelectedImages(
      (prev) =>
        prev.filter(
          (_, i) =>
            i !== index,
        ),
    );

    setForm((prev) => ({
      ...prev,

      feature_image_urls:
        prev.feature_image_urls.filter(
          (_, i) =>
            i !== index,
        ),
    }));
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 max-w-5xl"
    >
      <div>
        <h1 className="text-3xl font-bold">
          {mode === "create"
            ? "Tambah Produk"
            : "Edit Produk"}
        </h1>

        <p className="text-sm text-muted-foreground mt-1">
          Bahasa:{" "}
          <strong>
            {lang === "en"
              ? "English"
              : "Indonesia"}
          </strong>
        </p>
      </div>

      {/* Nama */}
      <div>
        <label className="font-semibold block mb-2">
          Nama Produk
        </label>

        <input
          name="nama_produk"
          value={
            form.nama_produk
          }
          onChange={
            handleChange
          }
          className="w-full border rounded-lg px-4 py-2"
        />
      </div>

      {/* Model */}
      <div>
        <label className="font-semibold block mb-2">
          Model Produk
        </label>

        <input
          name="model_produk"
          value={
            form.model_produk
          }
          onChange={
            handleChange
          }
          className="w-full border rounded-lg px-4 py-2"
        />
      </div>

      {/* Brand */}
      <div>
        <label className="font-semibold block mb-2">
          Brand
        </label>

        <select
          name="brand"
          value={form.brand}
          onChange={
            handleChange
          }
          className="px-4 py-2 border rounded-lg w-full bg-white text-black"
        >
          <option value={0}>
            Pilih Brand
          </option>

          {brands.map(
            (brand) => (
              <option
                key={brand.id}
                value={brand.id}
              >
                {brand.name}
              </option>
            ),
          )}
        </select>
      </div>

      {/* Jenis Produk */}
      <div>
        <label className="font-semibold block mb-2">
          Jenis Produk
        </label>

        <select
          name="jenis_produk"
          value={
            form.jenis_produk
          }
          onChange={
            handleChange
          }
          className="px-4 py-2 border rounded-lg w-full bg-white text-black"
        >
          <option value={0}>
            Pilih Jenis
          </option>

          {categories.map(
            (category) => (
              <option
                key={category.id}
                value={
                  category.id
                }
              >
                {category.name}
              </option>
            ),
          )}
        </select>
      </div>

      {/* Short Description */}
      <div>
        <label className="font-semibold block mb-2">
          Short Description
        </label>

        <textarea
          rows={3}
          name="short_description"
          value={
            form.short_description
          }
          onChange={
            handleChange
          }
          className="w-full border rounded-lg px-4 py-2"
        />
      </div>

      {/* Description */}
      <div>
        <label className="font-semibold block mb-2">
          Description
        </label>

        <textarea
          rows={8}
          name="description"
          value={
            form.description
          }
          onChange={
            handleChange
          }
          className="w-full border rounded-lg px-4 py-2"
        />
      </div>

      {/* Spesifikasi */}
      <div>
        <label className="font-semibold block mb-2">
          Spesifikasi
        </label>

        <textarea
          rows={8}
          name="spesifikasi"
          value={
            form.spesifikasi
          }
          onChange={
            handleChange
          }
          className="w-full border rounded-lg px-4 py-2"
        />
      </div>

      {/* Gambar */}
      <div>
        <label className="font-semibold block mb-2">
          Gambar Produk
        </label>

        <input
          type="file"
          multiple
          accept="image/*"
          onChange={(e) => {
            const files =
              Array.from(
                e.target.files ??
                  [],
              );

            if (
              files.length ===
              0
            ) {
              return;
            }

            setSelectedImages(
              (prev) => [
                ...prev,
                ...files,
              ],
            );

            setForm(
              (prev) => ({
                ...prev,

                feature_image_urls:
                  [
                    ...prev.feature_image_urls,
                    ...files.map(
                      (file) =>
                        URL.createObjectURL(
                          file,
                        ),
                    ),
                  ],
              }),
            );

            e.target.value =
              "";
          }}
        />

        <div className="mt-4 grid grid-cols-4 gap-4">
          {form.feature_image_urls.map(
            (url, index) => (
              <div
                key={`${url}-${index}`}
                className="relative group"
              >
                <img
                  src={url}
                  className="h-28 w-full rounded-lg object-cover border"
                  alt={`Product image ${index + 1}`}
                />

                <button
                  type="button"
                  onClick={() =>
                    removeImage(
                      index,
                    )
                  }
                  className="absolute top-2 right-2 hidden group-hover:flex h-7 w-7 items-center justify-center rounded-full bg-red-600 text-white text-sm"
                >
                  ✕
                </button>
              </div>
            ),
          )}
        </div>
      </div>

      {/* PDF */}
      <div>
        <label className="font-semibold block mb-2">
          Download Brosur
        </label>

        <input
          type="file"
          accept=".pdf"
          onChange={(e) => {
            const file =
              e.target.files?.[0];

            if (!file) {
              return;
            }

            setForm(
              (prev) => ({
                ...prev,

                download_brosur:
                  file,

                download_brosur_url:
                  URL.createObjectURL(
                    file,
                  ),
              }),
            );
          }}
        />

        {form.download_brosur_url && (
          <a
            href={
              form.download_brosur_url
            }
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 underline block mt-2"
          >
            Lihat Brosur Saat Ini
          </a>
        )}
      </div>

      {/* Buttons */}
      <div className="flex gap-4">
        <button
          type="submit"
          disabled={loading}
          className="px-8 py-3 rounded-lg bg-primary text-primary-foreground font-semibold disabled:opacity-50"
        >
          {loading
            ? "Menyimpan..."
            : mode === "create"
              ? "Simpan Produk"
              : "Update Produk"}
        </button>

        <button
          type="button"
          onClick={() =>
            router.push(
              returnUrl,
            )
          }
          className="px-8 py-3 rounded-lg border text-white font-semibold"
        >
          Batal
        </button>
      </div>
    </form>
  );
}