"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";

type EmailSettings = {
  from_name: string;
  from_email: string;
  recipient_email: string;
};

export default function EmailSettingsForm() {
  const [settings, setSettings] = useState<EmailSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  /* =========================================================
     LOAD CURRENT SETTINGS
  ========================================================= */

  useEffect(() => {
    async function loadSettings() {
      try {
        const res = await fetch("/api/admin/settings/email", {
          cache: "no-store",
        });

        const data = await res.json();

        if (!res.ok || !data.success) {
          throw new Error(data.message || "Gagal memuat setting");
        }

        setSettings({
          from_name: data.settings.from_name,
          from_email: data.settings.from_email,
          recipient_email: data.settings.recipient_email,
        });
      } catch (err: any) {
        console.error("LOAD EMAIL SETTINGS ERROR:", err);

        toast.error(err.message || "Gagal memuat setting email");
      } finally {
        setLoading(false);
      }
    }

    loadSettings();
  }, []);

  /* =========================================================
     SUBMIT
  ========================================================= */

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!settings) return;

    try {
      setSaving(true);

      const res = await fetch("/api/admin/settings/email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(settings),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || "Gagal menyimpan");
      }

      toast.success("Setting email berhasil disimpan");
    } catch (err: any) {
      console.error("SAVE EMAIL SETTINGS ERROR:", err);

      toast.error(err.message || "Gagal menyimpan");
    } finally {
      setSaving(false);
    }
  }

  /* =========================================================
     RENDER
  ========================================================= */

  if (loading) {
    return (
      <div className="flex min-h-[200px] items-center justify-center rounded-lg border text-sm text-muted-foreground">
        Memuat setting email...
      </div>
    );
  }

  if (!settings) {
    return (
      <div className="rounded-lg border p-6 text-sm text-muted-foreground">
        Gagal memuat setting email. Coba muat ulang halaman.
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="rounded-lg border p-6">
        <h2 className="text-xl font-semibold">Email Notifikasi</h2>

        <p className="mt-1 text-sm text-muted-foreground">
          Atur ke mana pesan dari form contact di website dikirim.
        </p>

        <div className="mt-6 space-y-5">
          <div>
            <label className="mb-2 block font-medium">
              Nama Pengirim
            </label>

            <input
              type="text"
              value={settings.from_name}
              onChange={(e) =>
                setSettings({ ...settings, from_name: e.target.value })
              }
              className="w-full rounded-lg border px-4 py-3"
            />
          </div>

          <div>
            <label className="mb-2 block font-medium">
              Email Pengirim (From)
            </label>

            <input
              type="email"
              value={settings.from_email}
              onChange={(e) =>
                setSettings({ ...settings, from_email: e.target.value })
              }
              className="w-full rounded-lg border px-4 py-3"
            />

            <p className="mt-1 text-xs text-muted-foreground">
              Harus sesuai domain SMTP kamu, supaya email tidak dianggap
              spam.
            </p>
          </div>

          <div>
            <label className="mb-2 block font-medium">
              Email Penerima Inquiry
            </label>

            <input
              type="email"
              value={settings.recipient_email}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  recipient_email: e.target.value,
                })
              }
              className="w-full rounded-lg border px-4 py-3"
            />

            <p className="mt-1 text-xs text-muted-foreground">
              Semua pesan dari form contact di website akan dikirim ke
              email ini. Contoh: ganti dari sales@boeledin.com ke
              admin@boeledin.com.
            </p>
          </div>
        </div>
      </div>

      <div className="mt-6 flex justify-end">
        <button
          type="submit"
          disabled={saving}
          className="rounded-lg bg-primary px-8 py-3 text-primary-foreground transition hover:bg-primary/90 disabled:opacity-50"
        >
          {saving ? "Menyimpan..." : "Simpan Perubahan"}
        </button>
      </div>
    </form>
  );
}