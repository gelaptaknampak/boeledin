"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import toast from "react-hot-toast";

import {
  Zap,
  Settings,
  Grid3X3,
  Lightbulb,
  Shield,
  Sparkles,
  Users,
  Monitor,
  Cpu,
  Globe,
  Building2,
  Handshake,
} from "lucide-react";

const icons = {
  Zap,
  Settings,
  Grid3X3,
  Lightbulb,
  Shield,
  Sparkles,
  Users,
  Monitor,
  Cpu,
  Globe,
  Building2,
  Handshake,
};

type Props = {
  data: any;
  config: any;
};

function getValue(obj: any, path: string) {
  return path.split(".").reduce((current, key) => {
    if (current == null) return "";

    if (/^\d+$/.test(key)) {
      return current[Number(key)];
    }

    return current[key];
  }, obj);
}

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

export default function SectionForm({ data, config }: Props) {
  const searchParams = useSearchParams();
  const lang = searchParams.get("lang") || "id";
  const returnUrl = `/admin/pages?lang=${lang}`;

  const [form, setForm] = useState(data);

  const [loading, setLoading] = useState(false);

  const [preview, setPreview] = useState<Record<string, string>>({});

  const router = useRouter();

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

        if (field.type === "brand-list") {
          const brands = getValue(data, field.name) ?? [];

          console.log("BRANDS");
          console.log(brands);
          console.log(typeof brands);
          console.log(Array.isArray(brands));

          for (let i = 0; i < brands.length; i++) {
            const logoId = brands[i].logo;

            if (!logoId) continue;

            try {
              const res = await fetch(`/api/wordpress/media/page/${logoId}`);

              const result = await res.json();

              if (result?.source_url) {
                images[`${field.name}.${i}.logo`] = result.source_url;
              }
            } catch (err) {
              console.error(err);
            }
          }

          continue;
        }

        if (field.type === "social-media-list") {
          const socials = getValue(data, field.name) ?? [];

          console.log("SOCIALS");
          console.log(socials);
          console.log(typeof socials);
          console.log(Array.isArray(socials));

          for (let i = 0; i < socials.length; i++) {
            const logoId = socials[i].logo;

            if (!logoId) continue;

            try {
              const res = await fetch(`/api/wordpress/media/page/${logoId}`);
              const result = await res.json();

              if (result?.source_url) {
                images[`${field.name}.${i}.logo`] = result.source_url;
              }
            } catch (err) {
              console.error(err);
            }
          }

          continue;
        }

        const id = getValue(data, field.name);

        if (!id) continue;

        try {
          const res = await fetch(`/api/wordpress/media/page/${id}`);

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

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    try {
      setLoading(true);

      const res = await fetch(`/api/admin/pages/section?lang=${lang}`, {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          id: config.id,
          data: form,
          lang,
        }),
      });

      const result = await res.json();

      if (!res.ok || result.success === false) {
        throw new Error(result.message || "Gagal menyimpan");
      }

      toast.success(result.message ?? "Berhasil diperbarui");

      router.push(returnUrl);
    } catch (err: any) {
      console.error(err);

      toast.error(err.message ?? "Gagal menyimpan");
    } finally {
      setLoading(false);
    }
  }

  function renderField(field: any) {
    const rawValue = getValue(form, field.name);

    const value =
      field.type === "brand-list" || field.type === "social-media-list"
        ? (rawValue ?? [])
        : (rawValue ?? "");

    const update = (newValue: any) =>
      setForm(setValue(form, field.name, newValue));

    switch (field.type) {
      case "textarea":
      case "wysiwyg":
        return (
          <>
            <textarea
              rows={5}
              className="w-full resize-none rounded-lg border px-4 py-3"
              value={value}
              onChange={(e) => update(e.target.value)}
            />

            <p className="mt-2 text-right text-xs text-muted-foreground">
              {String(value).length} karakter
            </p>
          </>
        );

      case "link":
        return (
          <input
            type="url"
            className="w-full rounded-lg border px-4 py-3"
            value={value}
            onChange={(e) => update(e.target.value)}
          />
        );

      case "image":
        return (
          <div className="space-y-4">
            <input
              type="file"
              accept="image/*"
              onChange={async (e) => {
                const file = e.target.files?.[0];

                if (!file) return;

                try {
                  const formData = new FormData();
                  formData.append("file", file);

                  const res = await fetch("/api/wordpress/media/page", {
                    method: "POST",
                    body: formData,
                  });

                  const result = await res.json();

                  if (!res.ok || !result.success) {
                    toast.error(result.message ?? "Upload gagal");
                    return;
                  }

                  // simpan URL gambar ke state
                  update(result.media.id);

                  setPreview((prev) => ({
                    ...prev,
                    [field.name]: result.media.source_url,
                  }));

                  toast.success("Upload berhasil");
                } catch (err) {
                  console.error(err);
                  toast.error("Upload gagal");
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

      case "select":
        return (
          <select
            className="w-full rounded-lg border px-4 py-3 bg-white text-black"
            value={value ?? ""}
            onChange={(e) => update(e.target.value)}
          >
            <option value="">Pilih {field.label}</option>

            {field.options?.map((option: any) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        );

      case "brand-list":
        return (
          <div className="space-y-4">
            {(value ?? []).map((brand: any, index: number) => (
              <div key={index} className="space-y-4 rounded-lg border p-4">
                {/* Logo */}
                <div>
                  <label className="mb-2 block text-sm font-medium">
                    Logo Brand
                  </label>

                  <input
                    type="file"
                    accept="image/*"
                    onChange={async (e) => {
                      const file = e.target.files?.[0];

                      if (!file) return;

                      try {
                        const formData = new FormData();

                        formData.append("file", file);

                        const res = await fetch("/api/wordpress/media/page", {
                          method: "POST",
                          body: formData,
                        });

                        const result = await res.json();

                        if (!res.ok || !result.success) {
                          toast.error(result.message ?? "Upload gagal");
                          return;
                        }

                        const brands = [...value];

                        brands[index].logo = result.media.id;

                        update(brands);

                        setPreview((prev) => ({
                          ...prev,
                          [`${field.name}.${index}.logo`]:
                            result.media.source_url,
                        }));

                        toast.success("Logo berhasil diupload");
                      } catch (err) {
                        console.error(err);

                        toast.error("Upload logo gagal");
                      }
                    }}
                  />

                  {preview[`${field.name}.${index}.logo`] && (
                    <Image
                      src={preview[`${field.name}.${index}.logo`]}
                      alt={brand.name}
                      width={150}
                      height={80}
                      className="h-20 w-auto object-contain"
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
                    value={brand.name ?? ""}
                    onChange={(e) => {
                      const brands = [...value];

                      brands[index].name = e.target.value;

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
                    value={brand.description ?? ""}
                    onChange={(e) => {
                      const brands = [...value];

                      brands[index].description = e.target.value;

                      update(brands);
                    }}
                  />
                </div>

                {/* Delete */}
                <button
                  type="button"
                  className="rounded-lg bg-red-500 px-4 py-2 text-sm text-white"
                  onClick={() => {
                    const brands = value.filter(
                      (_: any, i: number) => i !== index,
                    );

                    update(brands);
                  }}
                >
                  Hapus Brand
                </button>
              </div>
            ))}

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

      case "social-media-list":
        return (
          <div className="space-y-4">
            {(value ?? []).map((social: any, index: number) => (
              <div key={index} className="space-y-4 rounded-lg border p-4">
                {/* Logo */}
                <div>
                  <label className="mb-2 block text-sm font-medium">
                    Logo Social Media
                  </label>

                  <input
                    type="file"
                    accept="image/*"
                    onChange={async (e) => {
                      const file = e.target.files?.[0];

                      if (!file) return;

                      try {
                        const formData = new FormData();
                        formData.append("file", file);

                        const res = await fetch("/api/wordpress/media/page", {
                          method: "POST",
                          body: formData,
                        });

                        const result = await res.json();

                        if (!res.ok || !result.success) {
                          toast.error(result.message ?? "Upload gagal");
                          return;
                        }

                        const socials = [...value];

                        socials[index].logo = result.media.id;

                        update(socials);

                        setPreview((prev) => ({
                          ...prev,
                          [`${field.name}.${index}.logo`]:
                            result.media.source_url,
                        }));

                        toast.success("Logo berhasil diupload");
                      } catch {
                        toast.error("Upload gagal");
                      }
                    }}
                  />

                  {preview[`${field.name}.${index}.logo`] && (
                    <Image
                      src={preview[`${field.name}.${index}.logo`]}
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
                    value={social.link ?? ""}
                    placeholder="[https://instagram.com/](https://instagram.com/)..."
                    onChange={(e) => {
                      const socials = [...value];

                      socials[index].link = e.target.value;

                      update(socials);
                    }}
                  />
                </div>

                <button
                  type="button"
                  className="rounded-lg bg-red-500 px-4 py-2 text-white"
                  onClick={() => {
                    update(value.filter((_: any, i: number) => i !== index));
                  }}
                >
                  Hapus Social Media
                </button>
              </div>
            ))}

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

        case "true_false":
  return (
    <label className="flex items-center gap-3">
      <input
        type="checkbox"
        checked={Boolean(value)}
        onChange={(e) => update(e.target.checked)}
        className="h-5 w-5 rounded border"
      />

      <span>
        Required
      </span>
    </label>
  );

      default:
        return (
          <input
            type="text"
            className="w-full rounded-lg border px-4 py-3"
            value={value}
            onChange={(e) => update(e.target.value)}
          />
        );
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="rounded-xl border bg-card p-6">
        <h2 className="text-xl font-semibold">{config.title}</h2>

        <div className="mt-6 space-y-5">
          {config.fields
            .filter((field: any) => !field.hidden)
            .map((field: any) => (
              <div key={field.name}>
                <label className="mb-2 block font-medium">{field.label}</label>

                {renderField(field)}
              </div>
            ))}
        </div>
      </div>

      <div className="flex justify-end gap-3">
        <button
          type="button"
          onClick={() => router.push(returnUrl)}
          className="rounded-lg border px-8 py-3"
        >
          Batal
        </button>

        <button
          type="submit"
          disabled={loading}
          className="rounded-lg bg-primary px-8 py-3 text-primary-foreground transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? "Menyimpan..." : "Simpan Perubahan"}
        </button>
      </div>
    </form>
  );
}
