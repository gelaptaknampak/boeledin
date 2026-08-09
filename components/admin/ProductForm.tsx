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

interface Brand {
  id: number;
  name: string;
  slug: string;
}

interface Category {
  id: number;
  name: string;
  slug: string;
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

  /**
   * =========================================================
   * RESOLVED PRODUCT ID
   * =========================================================
   *
   * productId:
   * ID yang datang dari URL.
   *
   * resolvedProductId:
   * ID product sesuai bahasa yang sedang diedit.
   *
   * Contoh:
   *
   * /admin/products/525/edit?lang=id
   *
   * 525 = EN
   * 530 = ID
   *
   * Maka:
   *
   * productId         = 525
   * resolvedProductId = 530
   */
  const [resolvedProductId, setResolvedProductId] = useState<
    number | null
  >(null);

  const [brands, setBrands] = useState<Brand[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

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
   * =========================================================
   * FETCH BRANDS
   * =========================================================
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

      const normalizedBrands: Brand[] = Array.isArray(data)
        ? data
            .map((item: any) => ({
              id: Number(item.id),
              name: item.name ?? "",
              slug: item.slug ?? "",
            }))
            .filter((item: Brand) => item.id > 0)
        : [];

      console.log(`BRANDS [${lang}]:`, normalizedBrands);

      setBrands(normalizedBrands);
    } catch (error) {
      console.error("FETCH BRANDS ERROR:", error);

      setBrands([]);

      toast.error("Gagal mengambil brand");
    }
  }

  /**
   * =========================================================
   * FETCH PRODUCT TYPES
   * =========================================================
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

      const normalizedCategories: Category[] = Array.isArray(data)
        ? data
            .map((item: any) => ({
              id: Number(item.id),
              name: item.name ?? "",
              slug: item.slug ?? "",
            }))
            .filter((item: Category) => item.id > 0)
        : [];

      console.log(
        `CATEGORIES [${lang}]:`,
        normalizedCategories,
      );

      setCategories(normalizedCategories);
    } catch (error) {
      console.error(
        "FETCH PRODUCT TYPES ERROR:",
        error,
      );

      setCategories([]);

      toast.error("Gagal mengambil jenis produk");
    }
  }

  /**
   * =========================================================
   * LOAD BRAND & CATEGORY
   * =========================================================
   */

  /**
   * =========================================================
   * HANDLE INPUT
   * =========================================================
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
   * =========================================================
   * GET MEDIA URL
   * =========================================================
   */

  async function getMediaUrl(
    mediaId: number | string,
  ): Promise<string> {
    try {
      const id = Number(mediaId);

      if (!id) {
        return "";
      }

      const res = await fetch(
        `https://wp.boeledin.com/wp-json/wp/v2/media/${id}`,
        {
          cache: "no-store",
        },
      );

      if (!res.ok) {
        return "";
      }

      const media = await res.json();

      return media.source_url ?? "";
    } catch (error) {
      console.error(
        `Gagal mengambil media ${mediaId}:`,
        error,
      );

      return "";
    }
  }

  /**
   * =========================================================
   * FETCH PRODUCT
   * =========================================================
   */

useEffect(() => {
  if (mode === "edit" && productId) {
    fetchBrands();
    fetchCategories();
    fetchProduct();
    return;
  }

  fetchBrands();
  fetchCategories();
}, [mode, productId, lang]);

async function fetchProduct() {
  try {
    setLoading(true);
    setResolvedProductId(null);

    /**
     * =====================================================
     * FETCH PRODUCT DARI ENDPOINT YANG SUDAH LENGKAP
     * =====================================================
     *
     * Endpoint ini sudah mengembalikan:
     *
     * {
     *   id,
     *   acf,
     *   brand: {
     *     id,
     *     name,
     *     slug
     *   },
     *   jenis_produk: {
     *     id,
     *     name,
     *     slug
     *   }
     * }
     */
    const res = await fetch(
      `/api/wordpress/products?lang=${lang}`,
      {
        cache: "no-store",
      },
    );

    if (!res.ok) {
      throw new Error("Gagal mengambil daftar produk");
    }

    const products = await res.json();

    /**
     * Cari product berdasarkan ID yang sedang diedit
     */
    const product = Array.isArray(products)
      ? products.find(
          (item: any) =>
            Number(item.id) === Number(productId),
        )
      : null;

    if (!product) {
      throw new Error(
        `Produk dengan ID ${productId} tidak ditemukan`,
      );
    }

    console.log("========================================");
    console.log("PRODUCT RESPONSE:", product);
    console.log("REQUESTED PRODUCT ID:", productId);
    console.log("REQUESTED LANGUAGE:", lang);
    console.log("RESOLVED PRODUCT ID:", product.id);
    console.log("PRODUCT BRAND:", product.brand);
    console.log(
      "PRODUCT JENIS PRODUK:",
      product.jenis_produk,
    );
    console.log("========================================");

    /**
     * =====================================================
     * RESOLVE PRODUCT ID
     * =====================================================
     */

    const currentProductId = Number(product.id);

    if (!currentProductId) {
      throw new Error("Product ID tidak valid");
    }

    setResolvedProductId(currentProductId);

    /**
     * =====================================================
     * BRAND
     * =====================================================
     */

    const brandId = Number(
      product.brand?.id ?? 0,
    );

    console.log(
      "RESOLVED BRAND ID:",
      brandId,
    );

    if (brandId > 0) {
  setBrands((prev) => {
    const exists = prev.some(
      (brand) => Number(brand.id) === brandId,
    );

    if (exists) {
      return prev;
    }

    return [
      ...prev,
      {
        id: brandId,
        name: product.brand?.name ?? "",
        slug: product.brand?.slug ?? "",
      },
    ];
  });
} else {
      setBrands([]);
    }

    /**
     * =====================================================
     * JENIS PRODUK
     * =====================================================
     */

    const jenisProdukId = Number(
      product.jenis_produk?.id ?? 0,
    );

    console.log(
      "RESOLVED JENIS PRODUK ID:",
      jenisProdukId,
    );

    if (jenisProdukId > 0) {
  setCategories((prev) => {
    const exists = prev.some(
      (category) =>
        Number(category.id) === jenisProdukId,
    );

    if (exists) {
      return prev;
    }

    return [
      ...prev,
      {
        id: jenisProdukId,
        name: product.jenis_produk?.name ?? "",
        slug: product.jenis_produk?.slug ?? "",
      },
    ];
  });
} else {
      setCategories([]);
    }

    /**
     * =====================================================
     * GALLERY
     * =====================================================
     */

    const rawGallery =
      product.acf?.feature_image ?? "";

    const ids = String(rawGallery)
      .split(/[\n,]+/)
      .map((id: string) => id.trim())
      .filter(Boolean);

    const urls = await Promise.all(
      ids.map((id: string) =>
        getMediaUrl(id),
      ),
    );

    const validUrls = urls.filter(Boolean);

    /**
     * =====================================================
     * PDF
     * =====================================================
     */

    let pdfUrl = "";

    const pdfId =
      product.acf?.download_brosur;

    if (pdfId) {
      pdfUrl = await getMediaUrl(pdfId);
    }

    /**
     * =====================================================
     * SET FORM
     * =====================================================
     */

    setForm({
      nama_produk:
        product.acf?.nama_produk ?? "",

      model_produk:
        product.acf?.model_produk ?? "",

      brand: brandId,

      jenis_produk:
        jenisProdukId,

      short_description:
        product.acf?.short_description ?? "",

      description:
        product.acf?.description ?? "",

      spesifikasi:
        product.acf?.spesifikasi ?? "",

      feature_image:
        rawGallery,

      feature_image_urls:
        validUrls,

      download_brosur:
        product.acf?.download_brosur
          ? Number(
              product.acf.download_brosur,
            )
          : null,

      download_brosur_url:
        pdfUrl,
    });

    console.log("========================================");
    console.log("FORM VALUES SET:");
    console.log({
      brand: brandId,
      jenis_produk: jenisProdukId,
    });
    console.log("========================================");

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
   * =========================================================
   * UPLOAD MEDIA
   * =========================================================
   */

  async function uploadMedia(
    file: File,
  ) {
    const formData = new FormData();

    formData.append(
      "file",
      file,
    );

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
   * =========================================================
   * SUBMIT
   * =========================================================
   */

  async function handleSubmit(
    e: React.FormEvent,
  ) {
    e.preventDefault();

    /**
     * Edit harus memiliki resolved product ID.
     */

    if (
      mode === "edit" &&
      !resolvedProductId
    ) {
      toast.error(
        "ID produk sesuai bahasa belum ditemukan.",
      );

      return;
    }

    /**
     * Brand dan category wajib valid.
     */

    if (
      !form.brand ||
      form.brand <= 0
    ) {
      toast.error(
        "Silakan pilih brand.",
      );

      return;
    }

    if (
      !form.jenis_produk ||
      form.jenis_produk <= 0
    ) {
      toast.error(
        "Silakan pilih jenis produk.",
      );

      return;
    }

    setLoading(true);

    try {
      /**
       * =====================================================
       * TARGET PRODUCT ID
       * =====================================================
       */

      const targetProductId =
        resolvedProductId;

      const url =
        mode === "create"
          ? `/api/wordpress/products?lang=${lang}`
          : `/api/wordpress/products/${targetProductId}?lang=${lang}`;

      /**
       * =====================================================
       * GALLERY
       * =====================================================
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

          uploadedIds.push(
            Number(media.id),
          );
        }

        gallery = form.feature_image
          ? `${form.feature_image}\n${uploadedIds.join("\n")}`
          : uploadedIds.join("\n");
      }

      /**
       * =====================================================
       * PDF
       * =====================================================
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

        pdfId = Number(pdf.id);
      }

      /**
       * =====================================================
       * PAYLOAD
       * =====================================================
       *
       * Kirim number.
       *
       * updateProduct() akan mengubah:
       *
       * brand -> [brand]
       * jenis-produk -> [jenisProduk]
       */

      const payload = {
        nama_produk:
          form.nama_produk,

        model_produk:
          form.model_produk,

        brand:
          Number(form.brand),

        "jenis-produk":
          Number(form.jenis_produk),

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

      console.log(
        "========================================",
      );

      console.log(
        "SUBMIT PRODUCT",
        {
          mode,
          lang,
          originalProductId:
            productId,
          resolvedProductId,
          payload,
        },
      );

      console.log(
        "========================================",
      );

      /**
       * =====================================================
       * REQUEST
       * =====================================================
       */

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

      /**
       * =====================================================
       * AUTH ERROR
       * =====================================================
       */

      if (
        res.status === 401
      ) {
        toast.error(
          "Sesi login telah habis. Silakan login kembali.",
        );

        router.push(
          "/admin/login",
        );

        return;
      }

      /**
       * =====================================================
       * API ERROR
       * =====================================================
       */

      if (!res.ok) {
        console.error(
          "UPDATE PRODUCT ERROR RESPONSE:",
          data,
        );

        toast.error(
          data.message ||
            "Terjadi kesalahan",
        );

        return;
      }

      /**
       * =====================================================
       * SUCCESS
       * =====================================================
       */

      toast.success(
        mode === "create"
          ? `Produk ${lang.toUpperCase()} berhasil dibuat`
          : `Produk ${lang.toUpperCase()} berhasil diupdate`,
      );

      router.push(
        returnUrl,
      );

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
   * =========================================================
   * REMOVE IMAGE
   * =========================================================
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

  /**
   * =========================================================
   * RENDER
   * =========================================================
   */

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

        {mode === "edit" &&
          resolvedProductId && (
            <p className="text-xs text-muted-foreground mt-1">
              Product ID:{" "}
              {resolvedProductId}
            </p>
          )}
      </div>

      {/* Nama Produk */}

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

      {/* Model Produk */}

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
          disabled={loading}
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

        {mode === "edit" &&
          form.brand > 0 &&
          !brands.some(
            (brand) =>
              Number(brand.id) ===
              form.brand,
          ) && (
            <p className="text-xs text-red-500 mt-1">
              Brand ID {form.brand} tidak
              ditemukan pada daftar brand
              bahasa {lang.toUpperCase()}.
            </p>
          )}
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
          disabled={loading}
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

        {mode === "edit" &&
          form.jenis_produk > 0 &&
          !categories.some(
            (category) =>
              Number(category.id) ===
              form.jenis_produk,
          ) && (
            <p className="text-xs text-red-500 mt-1">
              Jenis produk ID{" "}
              {form.jenis_produk} tidak
              ditemukan pada daftar jenis
              produk bahasa{" "}
              {lang.toUpperCase()}.
            </p>
          )}
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
                e.target.files ?? [],
              );

            if (
              files.length === 0
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

            e.target.value = "";
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
                  alt={`Product image ${
                    index + 1
                  }`}
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
          disabled={
            loading ||
            (mode === "edit" &&
              !resolvedProductId)
          }
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