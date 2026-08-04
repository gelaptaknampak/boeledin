"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

type Props = {
  data: any;
};

export default function HeroForm({ data }: Props) {
  const [form, setForm] = useState({
    ...data,
    primaryButton: {
      ...(data.primaryButton ?? {}),
    },
    secondaryButton: {
      ...(data.secondaryButton ?? {}),
    },
    stats: (data.stats ?? []).map((item: any) => ({
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
        "/api/admin/pages/home/hero",
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

      toast.success("Hero berhasil diperbarui");

      setTimeout(() => {
        router.back();
      }, 1000);

    } catch (err) {
      console.error(err);
      toast.error("Gagal menyimpan Hero");
    } finally {
      setLoading(false);
    }
  }

  function updateStat(
    index: number,
    field: string,
    value: string
  ) {
    setForm({
      ...form,
      stats: form.stats.map((item: any, i: number) =>
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
      primaryButton: {
        ...(data.primaryButton ?? {}),
      },
      secondaryButton: {
        ...(data.secondaryButton ?? {}),
      },
      stats: (data.stats ?? []).map((item: any) => ({
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

      {/* ================= HERO CONTENT ================= */}

      <div className="rounded-xl border bg-card p-6">

        <h2 className="text-xl font-semibold">
          Hero Content
        </h2>

        <p className="mt-1 text-sm text-muted-foreground">
          Konten utama yang pertama kali dilihat pengunjung.
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
              rows={6}
              className="w-full rounded-lg border px-4 py-3 resize-none"
              value={form.description ?? ""}
              onChange={(e) =>
                setForm({
                  ...form,
                  description: e.target.value,
                })
              }
            />

            <p className="mt-2 text-xs text-muted-foreground text-right">
              {(form.description ?? "").length} karakter
            </p>

          </div>

        </div>

      </div>

      {/* ================= BUTTON ================= */}

      <div className="grid gap-6 lg:grid-cols-2">

        <div className="rounded-xl border bg-card p-6">

          <h2 className="text-lg font-semibold">
            Primary Button
          </h2>

          <div className="mt-5 space-y-5">

            <div>

              <label className="mb-2 block font-medium">
                Button Text
              </label>

              <input
                className="w-full rounded-lg border px-4 py-3"
                value={form.primaryButton.text ?? ""}
                onChange={(e) =>
                  setForm({
                    ...form,
                    primaryButton: {
                      ...form.primaryButton,
                      text: e.target.value,
                    },
                  })
                }
              />

            </div>

            <div>

              <label className="mb-2 block font-medium">
                URL
              </label>

              <input
                className="w-full rounded-lg border px-4 py-3"
                value={form.primaryButton.url ?? ""}
                onChange={(e) =>
                  setForm({
                    ...form,
                    primaryButton: {
                      ...form.primaryButton,
                      url: e.target.value,
                    },
                  })
                }
              />

            </div>

          </div>

        </div>

        <div className="rounded-xl border bg-card p-6">

          <h2 className="text-lg font-semibold">
            Secondary Button
          </h2>

          <div className="mt-5 space-y-5">

            <div>

              <label className="mb-2 block font-medium">
                Button Text
              </label>

              <input
                className="w-full rounded-lg border px-4 py-3"
                value={form.secondaryButton.text ?? ""}
                onChange={(e) =>
                  setForm({
                    ...form,
                    secondaryButton: {
                      ...form.secondaryButton,
                      text: e.target.value,
                    },
                  })
                }
              />

            </div>

            <div>

              <label className="mb-2 block font-medium">
                URL
              </label>

              <input
                className="w-full rounded-lg border px-4 py-3"
                value={form.secondaryButton.url ?? ""}
                onChange={(e) =>
                  setForm({
                    ...form,
                    secondaryButton: {
                      ...form.secondaryButton,
                      url: e.target.value,
                    },
                  })
                }
              />

            </div>

          </div>

        </div>

      </div>

      {/* ================= STATISTICS ================= */}

      <div className="rounded-xl border bg-card p-6">

        <h2 className="text-xl font-semibold">
          Statistics
        </h2>

        <p className="mt-1 text-sm text-muted-foreground">
          Statistik yang tampil di bagian bawah Hero.
        </p>

        <div className="mt-6 grid gap-6 lg:grid-cols-3">

          {(form.stats ?? []).map((stat: any, index: number) => (

            <div
              key={index}
              className="rounded-lg border p-5"
            >

              <h3 className="mb-4 font-semibold">
                Statistic {index + 1}
              </h3>

              <div className="space-y-4">

                <div>

                  <label className="mb-2 block text-sm font-medium">
                    Number
                  </label>

                  <input
                    className="w-full rounded-lg border px-4 py-3"
                    value={stat.number ?? ""}
                    onChange={(e) => {
                      const stats = [...form.stats];
                      stats[index].number = e.target.value;

                      setForm({
                        ...form,
                        stats,
                      });
                    }}
                  />

                </div>

                <div>

                  <label className="mb-2 block text-sm font-medium">
                    Label
                  </label>

                  <input
                    className="w-full rounded-lg border px-4 py-3"
                    value={stat.label ?? ""}
                    onChange={(e) => {
                      const stats = [...form.stats];
                      stats[index].label = e.target.value;

                      setForm({
                        ...form,
                        stats,
                      });
                    }}
                  />

                </div>

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