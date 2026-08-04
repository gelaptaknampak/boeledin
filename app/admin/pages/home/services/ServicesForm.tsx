"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

type Props = {
  data: any;
};

export default function ServicesForm({ data }: Props) {
  const [form, setForm] = useState({
    ...data,
    services: (data.services ?? []).map((item: any) => ({
      ...item,
    })),
  });

  const [loading, setLoading] = useState(false);

  const router = useRouter();

  async function handleSubmit(
    e: React.FormEvent<HTMLFormElement>
  ) {
    e.preventDefault();

    try {
      setLoading(true);

      const res = await fetch(
        "/api/admin/pages/home/services",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(form),
        }
      );

      if (!res.ok) {
        throw new Error("Gagal menyimpan");
      }

      toast.success("Services berhasil diperbarui");

      setTimeout(() => {
        router.back();
      }, 1000);

    } catch (err) {
      console.error(err);
      toast.error("Gagal menyimpan Services");
    } finally {
      setLoading(false);
    }
  }

 function updateService(
  index: number,
  field: string,
  value: string
) {
  setForm({
    ...form,
    services: form.services.map((item: any, i: number) =>
      i === index
        ? {
            ...item,
            [field]: value,
          }
        : item
    ),
  });
}

  function handleReset() {
  if (!confirm("Batalkan semua perubahan?")) return;

  setForm({
    ...data,
    services: (data.services ?? []).map((item: any) => ({
      ...item,
    })),
  });

  toast.success("Perubahan berhasil direset");
}

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6"
    >

      {/* ================= SERVICES CONTENT ================= */}

      <div className="rounded-xl border bg-card p-6">

        <h2 className="text-xl font-semibold">
          Services Content
        </h2>

        <p className="mt-1 text-sm text-muted-foreground">
          Konten utama pada bagian layanan.
        </p>

        <div className="mt-6 space-y-5">

          <div>
            <label className="mb-2 block font-medium">
              Eyebrow
            </label>

            <input
              className="w-full rounded-lg border px-4 py-3"
              value={form.eyebrow ?? ""}
              onChange={(e) =>
                setForm({
                  ...form,
                  eyebrow: e.target.value,
                })
              }
            />
          </div>

          <div>
            <label className="mb-2 block font-medium">
              Title
            </label>

            <input
              className="w-full rounded-lg border px-4 py-3"
              value={form.title ?? ""}
              onChange={(e) =>
                setForm({
                  ...form,
                  title: e.target.value,
                })
              }
            />
          </div>

          <div>
            <label className="mb-2 block font-medium">
              Description
            </label>

            <textarea
              rows={5}
              className="w-full resize-none rounded-lg border px-4 py-3"
              value={form.description ?? ""}
              onChange={(e) =>
                setForm({
                  ...form,
                  description: e.target.value,
                })
              }
            />

            <p className="mt-2 text-right text-xs text-muted-foreground">
              {(form.description ?? "").length} karakter
            </p>

          </div>

        </div>

      </div>

      {/* ================= SERVICE CARDS ================= */}

      <div className="rounded-xl border bg-card p-6">

        <h2 className="text-xl font-semibold">
          Service Cards
        </h2>

        <p className="mt-1 text-sm text-muted-foreground">
          Kelola layanan yang ditampilkan pada halaman Home.
        </p>

        <div className="mt-6 grid gap-6 lg:grid-cols-2">

          {(form.services as any[]).map((service: any, index: number) => (

            <div
              key={index}
              className="space-y-4 rounded-lg border p-5"
            >

              <h3 className="font-semibold">
                Service {index + 1}
              </h3>

              <div>

                <label className="mb-2 block text-sm font-medium">
                  Number
                </label>

                <input
                  disabled
                  className="w-full rounded-lg border bg-muted px-4 py-3"
                  value={service.number ?? ""}
                />

              </div>

              <div>

                <label className="mb-2 block text-sm font-medium">
                  Icon
                </label>

                <select
                  className="w-full rounded-lg border px-4 py-3"
                  value={service.icon ?? "zap"}
                  onChange={(e) =>
                    updateService(
                      index,
                      "icon",
                      e.target.value
                    )
                  }
                >
                  <option value="zap">Zap</option>
                  <option value="settings">Settings</option>
                  <option value="grid3x3">Grid3x3</option>
                  <option value="lightbulb">Lightbulb</option>
                </select>

              </div>

              <div>

                <label className="mb-2 block text-sm font-medium">
                  Title
                </label>

                <input
                  className="w-full rounded-lg border px-4 py-3"
                  value={service.title ?? ""}
                  onChange={(e) =>
                    updateService(
                      index,
                      "title",
                      e.target.value
                    )
                  }
                />

              </div>

              <div>

                <label className="mb-2 block text-sm font-medium">
                  Description
                </label>

                <textarea
                  rows={5}
                  className="w-full resize-none rounded-lg border px-4 py-3"
                  value={service.description ?? ""}
                  onChange={(e) =>
                    updateService(
                      index,
                      "description",
                      e.target.value
                    )
                  }
                />

                <p className="mt-2 text-right text-xs text-muted-foreground">
                  {(service.description ?? "").length} karakter
                </p>

              </div>

            </div>

          ))}

        </div>

      </div>

      {/* ================= ACTION ================= */}

      <div className="flex items-center justify-end gap-3">

        <button
          type="button"
          onClick={handleReset}
          disabled={loading}
          className="rounded-lg border px-6 py-3 transition hover:bg-accent disabled:opacity-50"
        >
          Reset
        </button>

        <button
          type="submit"
          disabled={loading}
          className="rounded-lg bg-primary px-8 py-3 font-medium text-primary-foreground transition hover:bg-primary/90 disabled:opacity-50"
        >
          {loading ? "Menyimpan..." : "Simpan Perubahan"}
        </button>

      </div>

    </form>
  );
}