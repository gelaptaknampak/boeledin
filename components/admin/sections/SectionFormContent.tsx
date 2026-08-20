"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import toast from "react-hot-toast";

import IconPicker from "@/components/admin/IconPicker";

type Props = {
  data: any;
  config: any;
};

/* =========================================================
   GET VALUE
========================================================= */

function getValue(obj: any, path: string) {
  return path.split(".").reduce((current, key) => {
    if (current == null) return "";

    if (/^\d+$/.test(key)) {
      return current[Number(key)];
    }

    return current[key];
  }, obj);
}

/* =========================================================
   SET VALUE
========================================================= */

function setValue(obj: any, path: string, value: any) {
  const clone = structuredClone(obj);

  const keys = path.split(".");
  let current = clone;

  keys.forEach((key, index) => {
    const last = index === keys.length - 1;

    if (last) {
      current[key] = value;
      return;
    }

    const nextKey = keys[index + 1];

    if (current[key] == null) {
      current[key] = /^\d+$/.test(nextKey) ? [] : {};
    }

    current = current[key];
  });

  return clone;
}

/* =========================================================
   COMPONENT
========================================================= */

export default function SectionFormContent({
  data,
  config,
}: Props) {
  const searchParams = useSearchParams();
  const router = useRouter();

  /* =========================================================
     LANGUAGE
  ========================================================= */

  const lang = searchParams.get("lang") || "id";

  const returnUrl = `/admin/pages?lang=${lang}`;

  /* =========================================================
     FORM STATE
  ========================================================= */

  const [form, setForm] = useState(data);

  const [loading, setLoading] = useState(false);

  /* =========================================================
     IMAGE PREVIEW
  ========================================================= */

  const [preview, setPreview] = useState<Record<string, string>>(
    {}
  );

  /* =========================================================
     PRODUCTS
  ========================================================= */

  const [products, setProducts] = useState<any[]>([]);

  const [productSearch, setProductSearch] = useState("");

  const [productsLoading, setProductsLoading] = useState(false);

  /* =========================================================
     LOAD PRODUCTS
  ========================================================= */

  useEffect(() => {
    async function loadProducts() {
      try {
        setProductsLoading(true);

        const res = await fetch(
          `/api/wordpress/products?lang=${lang}&per_page=100`,
          {
            cache: "no-store",
          }
        );

        if (!res.ok) {
          throw new Error("Gagal mengambil produk");
        }

        const result = await res.json();

        /*
         * API bisa saja mengembalikan:
         * - array langsung
         * - { data: [] }
         */

        const productList = Array.isArray(result)
          ? result
          : Array.isArray(result?.data)
          ? result.data
          : [];

        setProducts(productList);
      } catch (error) {
        console.error("LOAD PRODUCTS ERROR:", error);

        toast.error("Gagal mengambil daftar produk");
      } finally {
        setProductsLoading(false);
      }
    }

    loadProducts();
  }, [lang]);

  /* =========================================================
     LOAD IMAGE PREVIEW
  ========================================================= */

  useEffect(() => {
    async function loadImages() {
      const images: Record<string, string> = {};

      for (const field of config.fields) {
        if (
          field.type !== "image" &&
          field.type !== "brand-list" &&
          field.type !== "social-media-list"
        ) {
          continue;
        }

        /* =====================================================
           BRAND LIST
        ===================================================== */

        if (field.type === "brand-list") {
          const brands = getValue(data, field.name) ?? [];

          if (!Array.isArray(brands)) continue;

          for (let i = 0; i < brands.length; i++) {
            const logoId = brands[i]?.logo;

            if (!logoId) continue;

            try {
              const res = await fetch(
                `/api/wordpress/media/page/${logoId}`
              );

              const result = await res.json();

              if (result?.source_url) {
                images[`${field.name}.${i}.logo`] =
                  result.source_url;
              }
            } catch (err) {
              console.error(err);
            }
          }

          continue;
        }

        /* =====================================================
           SOCIAL MEDIA LIST
        ===================================================== */

        if (field.type === "social-media-list") {
          const socials = getValue(data, field.name) ?? [];

          if (!Array.isArray(socials)) continue;

          for (let i = 0; i < socials.length; i++) {
            const logoId = socials[i]?.logo;

            if (!logoId) continue;

            try {
              const res = await fetch(
                `/api/wordpress/media/page/${logoId}`
              );

              const result = await res.json();

              if (result?.source_url) {
                images[`${field.name}.${i}.logo`] =
                  result.source_url;
              }
            } catch (err) {
              console.error(err);
            }
          }

          continue;
        }

        /* =====================================================
           SINGLE IMAGE
        ===================================================== */

        const id = getValue(data, field.name);

        if (!id) continue;

        try {
          const res = await fetch(
            `/api/wordpress/media/page/${id}`
          );

          const result = await res.json();

          if (result?.source_url) {
            images[field.name] = result.source_url;
          }
        } catch (err) {
          console.error(err);
        }
      }

      setPreview(images);
    }

    loadImages();
  }, [config.fields, data]);

  /* =========================================================
     SUBMIT
  ========================================================= */

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    try {
      setLoading(true);

      const res = await fetch(
        `/api/admin/pages/section?lang=${lang}`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            id: config.id,

            postId:
              typeof config.id === "object"
                ? config.id[lang]
                : config.id,

            data: form,

            lang,
          }),
        }
      );

      const result = await res.json();

      if (!res.ok || result.success === false) {
        throw new Error(
          result.message || "Gagal menyimpan"
        );
      }

      toast.success(
        result.message ?? "Berhasil diperbarui"
      );

      router.push(returnUrl);
    } catch (err: any) {
      console.error("SAVE SECTION ERROR:", err);

      toast.error(
        err.message ?? "Gagal menyimpan"
      );
    } finally {
      setLoading(false);
    }
  }

  /* =========================================================
     RENDER FIELD
  ========================================================= */

  function renderField(field: any) {
    const rawValue = getValue(
      form,
      field.name
    );

    let value = rawValue ?? "";

    /* =======================================================
       NORMALIZE ARRAY FIELDS
    ======================================================= */

    if (
      field.type === "brand-list" ||
      field.type === "social-media-list" ||
      field.type === "post_object"
    ) {
      try {
        if (typeof value === "string") {
          value = value
            ? JSON.parse(value)
            : [];
        }

        if (!Array.isArray(value)) {
          value = value ? [value] : [];
        }
      } catch {
        value = [];
      }
    }

    /* =======================================================
       UPDATE
    ======================================================= */

    const update = (newValue: any) => {
      setForm(
        setValue(
          form,
          field.name,
          newValue
        )
      );
    };

    /* =========================================================
       TEXTAREA
    ========================================================= */

    switch (field.type) {
      case "textarea":
      case "wysiwyg":
        return (
          <>
            <textarea
              rows={5}
              className="w-full resize-none rounded-lg border px-4 py-3"
              value={value}
              onChange={(e) =>
                update(e.target.value)
              }
            />

            <p className="mt-2 text-right text-xs text-muted-foreground">
              {String(value).length} karakter
            </p>
          </>
        );

      /* =======================================================
         LINK
      ======================================================= */

      case "link":
        return (
          <input
            type="url"
            className="w-full rounded-lg border px-4 py-3"
            value={value}
            onChange={(e) =>
              update(e.target.value)
            }
          />
        );

      /* =======================================================
         IMAGE
      ======================================================= */

      case "image":
        return (
          <div className="space-y-4">
            <input
              type="file"
              accept="image/*"
              onChange={async (e) => {
                const file =
                  e.target.files?.[0];

                if (!file) return;

                try {
                  const formData =
                    new FormData();

                  formData.append(
                    "file",
                    file
                  );

                  const res =
                    await fetch(
                      "/api/wordpress/media/page",
                      {
                        method: "POST",
                        body: formData,
                      }
                    );

                  const result =
                    await res.json();

                  if (
                    !res.ok ||
                    !result.success
                  ) {
                    toast.error(
                      result.message ??
                        "Upload gagal"
                    );

                    return;
                  }

                  update(
                    result.media.id
                  );

                  setPreview(
                    (prev) => ({
                      ...prev,
                      [field.name]:
                        result.media
                          .source_url,
                    })
                  );

                  toast.success(
                    "Upload berhasil"
                  );
                } catch (err) {
                  console.error(err);

                  toast.error(
                    "Upload gagal"
                  );
                }
              }}
            />

            {preview[field.name] && (
              <Image
                src={preview[field.name]}
                alt=""
                width={800}
                height={450}
                className="h-64 w-auto rounded-lg border object-contain"
                unoptimized
              />
            )}
          </div>
        );

      /* =======================================================
         ICON PICKER
      ======================================================= */

      case "icon":
        return (
          <IconPicker
            value={String(value ?? "")}
            onChange={(newValue) =>
              update(newValue)
            }
          />
        );

      /* =======================================================
         SELECT
      ======================================================= */

      case "select":
        return (
          <select
            className="w-full rounded-lg border bg-white px-4 py-3 text-black"
            value={value ?? ""}
            onChange={(e) =>
              update(e.target.value)
            }
          >
            <option value="">
              Pilih {field.label}
            </option>

            {field.options?.map(
              (option: any) => (
                <option
                  key={option.value}
                  value={option.value}
                >
                  {option.label}
                </option>
              )
            )}
          </select>
        );

      /* =======================================================
         POST OBJECT
         
         Digunakan untuk:
         product_showcase_products
      ======================================================= */

      case "post_object": {
        const selectedIds = Array.isArray(value)
          ? value.map(Number)
          : [];

        const filteredProducts =
          products.filter((product) => {
            const title =
              product?.title?.rendered ??
              product?.title ??
              "";

            const model =
              product?.acf?.model_produk ??
              "";

            const search =
              productSearch
                .trim()
                .toLowerCase();

            if (!search) return true;

            return (
              String(title)
                .toLowerCase()
                .includes(search) ||
              String(model)
                .toLowerCase()
                .includes(search)
            );
          });

        function toggleProduct(productId: number) {
          if (selectedIds.includes(productId)) {
            update(
              selectedIds.filter(
                (id) => id !== productId
              )
            );

            return;
          }

          update([
            ...selectedIds,
            productId,
          ]);
        }

        function removeProduct(productId: number) {
          update(
            selectedIds.filter(
              (id) => id !== productId
            )
          );
        }

        return (
          <div className="space-y-4">
            {/* =================================================
                SELECTED PRODUCTS
            ================================================= */}

            <div>
              <p className="mb-2 text-sm font-medium">
                Produk Terpilih
              </p>

              {selectedIds.length === 0 ? (
                <div className="rounded-lg border border-dashed p-4 text-sm text-muted-foreground">
                  Belum ada produk yang dipilih.
                </div>
              ) : (
                <div className="space-y-2">
                  {selectedIds.map(
                    (productId, index) => {
                      const product =
                        products.find(
                          (item) =>
                            Number(item.id) ===
                            Number(productId)
                        );

                      if (!product) {
                        return (
                          <div
                            key={productId}
                            className="flex items-center justify-between rounded-lg border bg-muted/30 px-4 py-3"
                          >
                            <div>
                              <span className="mr-2 text-xs text-muted-foreground">
                                #{index + 1}
                              </span>

                              <span>
                                Product ID{" "}
                                {productId}
                              </span>
                            </div>

                            <button
                              type="button"
                              onClick={() =>
                                removeProduct(
                                  productId
                                )
                              }
                              className="text-sm font-medium text-red-500 hover:text-red-700"
                            >
                              Hapus
                            </button>
                          </div>
                        );
                      }

                      const title =
                        product?.title
                          ?.rendered ??
                        product?.title ??
                        `Product ${productId}`;

                      return (
                        <div
                          key={productId}
                          className="flex items-center justify-between rounded-lg border bg-muted/30 px-4 py-3"
                        >
                          <div className="min-w-0">
                            <span className="mr-2 text-xs text-muted-foreground">
                              #{index + 1}
                            </span>

                            <span className="font-medium">
                              {title}
                            </span>

                            {product
                              ?.acf
                              ?.model_produk && (
                              <span className="ml-2 text-xs text-muted-foreground">
                                (
                                {
                                  product
                                    .acf
                                    .model_produk
                                }
                                )
                              </span>
                            )}
                          </div>

                          <button
                            type="button"
                            onClick={() =>
                              removeProduct(
                                productId
                              )
                            }
                            className="ml-4 shrink-0 text-sm font-medium text-red-500 hover:text-red-700"
                          >
                            Hapus
                          </button>
                        </div>
                      );
                    }
                  )}
                </div>
              )}
            </div>

            {/* =================================================
                SEARCH
            ================================================= */}

            <div>
              <label className="mb-2 block text-sm font-medium">
                Cari Produk
              </label>

              <input
                type="text"
                value={productSearch}
                onChange={(e) =>
                  setProductSearch(
                    e.target.value
                  )
                }
                placeholder="Cari berdasarkan nama atau model produk..."
                className="w-full rounded-lg border px-4 py-3"
              />
            </div>

            {/* =================================================
                PRODUCT LIST
            ================================================= */}

            <div>
              <p className="mb-2 text-sm font-medium">
                Daftar Produk
              </p>

              {productsLoading ? (
                <div className="rounded-lg border p-5 text-center text-sm text-muted-foreground">
                  Memuat produk...
                </div>
              ) : products.length === 0 ? (
                <div className="rounded-lg border border-dashed p-5 text-center text-sm text-muted-foreground">
                  Tidak ada produk.
                </div>
              ) : filteredProducts.length ===
                0 ? (
                <div className="rounded-lg border border-dashed p-5 text-center text-sm text-muted-foreground">
                  Produk tidak ditemukan.
                </div>
              ) : (
                <div className="max-h-[500px] space-y-2 overflow-y-auto rounded-lg border p-3">
                  {filteredProducts.map(
                    (product) => {
                      const productId =
                        Number(product.id);

                      const selected =
                        selectedIds.includes(
                          productId
                        );

                      const title =
                        product?.title
                          ?.rendered ??
                        product?.title ??
                        `Product ${productId}`;

                      const model =
                        product?.acf
                          ?.model_produk ??
                        "";

                      return (
                        <button
                          key={productId}
                          type="button"
                          onClick={() =>
                            toggleProduct(
                              productId
                            )
                          }
                          className={`flex w-full items-center justify-between rounded-lg border px-4 py-3 text-left transition ${
                            selected
                              ? "border-primary bg-primary/10"
                              : "border-border hover:bg-muted"
                          }`}
                        >
                          <div className="min-w-0">
                            <div className="font-medium">
                              {title}
                            </div>

                            {model && (
                              <div className="mt-1 text-xs text-muted-foreground">
                                Model: {model}
                              </div>
                            )}
                          </div>

                          <div
                            className={`ml-4 flex h-5 w-5 shrink-0 items-center justify-center rounded border ${
                              selected
                                ? "border-primary bg-primary text-primary-foreground"
                                : "border-border"
                            }`}
                          >
                            {selected && (
                              <span className="text-xs">
                                ✓
                              </span>
                            )}
                          </div>
                        </button>
                      );
                    }
                  )}
                </div>
              )}
            </div>

            {/* =================================================
                INFO
            ================================================= */}

            <p className="text-xs text-muted-foreground">
              Pilih produk sesuai urutan yang ingin
              ditampilkan. Produk yang dipilih tidak
              otomatis berdasarkan tanggal terbaru.
            </p>
          </div>
        );
      }

      /* =======================================================
         BRAND LIST
      ======================================================= */

      case "brand-list":
        return (
          <div className="space-y-4">
            {(value ?? []).map(
              (
                brand: any,
                index: number
              ) => (
                <div
                  key={index}
                  className="space-y-4 rounded-lg border p-4"
                >
                  {/* Logo */}

                  <div>
                    <label className="mb-2 block text-sm font-medium">
                      Logo Brand
                    </label>

                    <input
                      type="file"
                      accept="image/*"
                      onChange={async (
                        e
                      ) => {
                        const file =
                          e.target
                            .files?.[0];

                        if (!file) return;

                        try {
                          const formData =
                            new FormData();

                          formData.append(
                            "file",
                            file
                          );

                          const res =
                            await fetch(
                              "/api/wordpress/media/page",
                              {
                                method:
                                  "POST",
                                body: formData,
                              }
                            );

                          const result =
                            await res.json();

                          if (
                            !res.ok ||
                            !result.success
                          ) {
                            toast.error(
                              result.message ??
                                "Upload gagal"
                            );

                            return;
                          }

                          const brands =
                            [...value];

                          brands[index].logo =
                            result.media.id;

                          update(brands);

                          setPreview(
                            (prev) => ({
                              ...prev,
                              [`${field.name}.${index}.logo`]:
                                result
                                  .media
                                  .source_url,
                            })
                          );

                          toast.success(
                            "Logo berhasil diupload"
                          );
                        } catch (err) {
                          console.error(
                            err
                          );

                          toast.error(
                            "Upload logo gagal"
                          );
                        }
                      }}
                    />

                    {preview[
                      `${field.name}.${index}.logo`
                    ] && (
                      <Image
                        src={
                          preview[
                            `${field.name}.${index}.logo`
                          ]
                        }
                        alt={
                          brand.name
                        }
                        width={150}
                        height={80}
                        className="h-20 w-auto object-contain"
                        unoptimized
                      />
                    )}
                  </div>

                  {/* Nama Brand */}

                  <div>
                    <label className="mb-2 block text-sm font-medium">
                      Nama Brand
                    </label>

                    <input
                      type="text"
                      className="w-full rounded-lg border px-4 py-3"
                      placeholder="Contoh: Samsung"
                      value={
                        brand.name ??
                        ""
                      }
                      onChange={(e) => {
                        const brands =
                          [...value];

                        brands[index].name =
                          e.target.value;

                        update(brands);
                      }}
                    />
                  </div>

                  {/* Deskripsi */}

                  <div>
                    <label className="mb-2 block text-sm font-medium">
                      Deskripsi Brand
                    </label>

                    <textarea
                      rows={3}
                      className="w-full resize-none rounded-lg border px-4 py-3"
                      placeholder="Deskripsi brand"
                      value={
                        brand.description ??
                        ""
                      }
                      onChange={(e) => {
                        const brands =
                          [...value];

                        brands[
                          index
                        ].description =
                          e.target.value;

                        update(brands);
                      }}
                    />
                  </div>

                  {/* Delete */}

                  <button
                    type="button"
                    className="rounded-lg bg-red-500 px-4 py-2 text-sm text-white"
                    onClick={() => {
                      const brands =
                        value.filter(
                          (
                            _: any,
                            i: number
                          ) =>
                            i !==
                            index
                        );

                      update(brands);
                    }}
                  >
                    Hapus Brand
                  </button>
                </div>
              )
            )}

            {/* Add Brand */}

            <button
              type="button"
              className="rounded-lg border px-5 py-2"
              onClick={() => {
                update([
                  ...(value ?? []),
                  {
                    logo: "",
                    name: "",
                    description: "",
                  },
                ]);
              }}
            >
              + Tambah Brand
            </button>
          </div>
        );

      /* =======================================================
         SOCIAL MEDIA LIST
      ======================================================= */

      case "social-media-list":
        return (
          <div className="space-y-4">
            {(value ?? []).map(
              (
                social: any,
                index: number
              ) => (
                <div
                  key={index}
                  className="space-y-4 rounded-lg border p-4"
                >
                  {/* Logo */}

                  <div>
                    <label className="mb-2 block text-sm font-medium">
                      Logo Social Media
                    </label>

                    <input
                      type="file"
                      accept="image/*"
                      onChange={async (
                        e
                      ) => {
                        const file =
                          e.target
                            .files?.[0];

                        if (!file) return;

                        try {
                          const formData =
                            new FormData();

                          formData.append(
                            "file",
                            file
                          );

                          const res =
                            await fetch(
                              "/api/wordpress/media/page",
                              {
                                method:
                                  "POST",
                                body: formData,
                              }
                            );

                          const result =
                            await res.json();

                          if (
                            !res.ok ||
                            !result.success
                          ) {
                            toast.error(
                              result.message ??
                                "Upload gagal"
                            );

                            return;
                          }

                          const socials =
                            [...value];

                          socials[
                            index
                          ].logo =
                            result.media.id;

                          update(
                            socials
                          );

                          setPreview(
                            (prev) => ({
                              ...prev,
                              [`${field.name}.${index}.logo`]:
                                result
                                  .media
                                  .source_url,
                            })
                          );

                          toast.success(
                            "Logo berhasil diupload"
                          );
                        } catch {
                          toast.error(
                            "Upload gagal"
                          );
                        }
                      }}
                    />

                    {preview[
                      `${field.name}.${index}.logo`
                    ] && (
                      <Image
                        src={
                          preview[
                            `${field.name}.${index}.logo`
                          ]
                        }
                        alt=""
                        width={50}
                        height={50}
                        className="mt-3 h-12 w-12 object-contain"
                        unoptimized
                      />
                    )}
                  </div>

                  {/* Link */}

                  <div>
                    <label className="mb-2 block text-sm font-medium">
                      Link Social Media
                    </label>

                    <textarea
                      rows={2}
                      className="w-full resize-none rounded-lg border px-4 py-3"
                      value={
                        social.link ??
                        ""
                      }
                      placeholder="https://instagram.com/..."
                      onChange={(e) => {
                        const socials =
                          [...value];

                        socials[
                          index
                        ].link =
                          e.target.value;

                        update(
                          socials
                        );
                      }}
                    />
                  </div>

                  {/* Delete */}

                  <button
                    type="button"
                    className="rounded-lg bg-red-500 px-4 py-2 text-white"
                    onClick={() => {
                      update(
                        value.filter(
                          (
                            _: any,
                            i: number
                          ) =>
                            i !==
                            index
                        )
                      );
                    }}
                  >
                    Hapus Social Media
                  </button>
                </div>
              )
            )}

            <button
              type="button"
              className="rounded-lg border px-5 py-2"
              onClick={() => {
                update([
                  ...(value ?? []),
                  {
                    logo: "",
                    link: "",
                  },
                ]);
              }}
            >
              + Tambah Social Media
            </button>
          </div>
        );

      /* =======================================================
         TRUE / FALSE
      ======================================================= */

      case "true_false":
        return (
          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={Boolean(value)}
              onChange={(e) =>
                update(
                  e.target.checked
                )
              }
              className="h-5 w-5 rounded border"
            />

            <span>Required</span>
          </label>
        );

      /* =======================================================
         DEFAULT
      ======================================================= */

      default:
        return (
          <input
            type="text"
            className="w-full rounded-lg border px-4 py-3"
            value={value}
            onChange={(e) =>
              update(e.target.value)
            }
          />
        );
    }
  }

  /* =========================================================
     RENDER FORM
  ========================================================= */

  return (
    <form onSubmit={handleSubmit}>
      <div className="rounded-lg border p-6">
        <h2 className="text-xl font-semibold">
          {config.title}
        </h2>

        <div className="mt-6 space-y-5">
          {config.fields
            .filter(
              (field: any) =>
                !field.hidden
            )
            .map(
              (field: any) => (
                <div
                  key={field.name}
                >
                  <label className="mb-2 block font-medium">
                    {field.label}
                  </label>

                  {renderField(field)}
                </div>
              )
            )}
        </div>
      </div>

      {/* =====================================================
          BUTTONS
      ===================================================== */}

      <div className="mt-6 flex justify-end gap-3">
        <button
          type="button"
          onClick={() =>
            router.push(returnUrl)
          }
          className="rounded-lg border px-8 py-3"
        >
          Batal
        </button>

        <button
          type="submit"
          disabled={loading}
          className="rounded-lg bg-primary px-8 py-3 text-primary-foreground transition hover:bg-primary/90 disabled:opacity-50"
        >
          {loading
            ? "Menyimpan..."
            : "Simpan Perubahan"}
        </button>
      </div>
    </form>
  );
}