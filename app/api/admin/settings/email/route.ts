import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

const WP_URL = "https://wp.boeledin.com";

/**
 * =========================================================
 * GET - baca setting email saat ini
 * =========================================================
 */

export async function GET() {
  const token = (await cookies()).get("wp_token");

  if (!token) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const adminKey = process.env.BOELEDIN_ADMIN_SETTINGS_KEY;

  if (!adminKey) {
    console.error(
      "BOELEDIN_ADMIN_SETTINGS_KEY is not configured. Cannot fetch email settings.",
    );

    return NextResponse.json(
      { message: "Settings service is not configured." },
      { status: 500 },
    );
  }

  try {
    const res = await axios.get(
      `${WP_URL}/wp-json/boeledin-email/v1/settings`,
      {
        headers: {
          "X-Boeledin-Admin-Key": adminKey,
        },
      },
    );

    return NextResponse.json(res.data);
  } catch (error: any) {
    // Log LENGKAP ke terminal server (bukan browser console) --
    // di sinilah alasan asli kegagalannya kelihatan.
    console.error(
      "Failed to fetch email settings. Status:",
      error.response?.status,
      "Data:",
      error.response?.data,
      "Message:",
      error.message,
    );

    // Teruskan pesan error dari WordPress kalau ada, biar
    // ketahuan penyebabnya (key salah, endpoint belum ada di
    // plugin, dll) -- bukan cuma pesan generik yang nutupin
    // masalah aslinya.
    return NextResponse.json(
      {
        message:
          error.response?.data?.error ||
          error.response?.data?.message ||
          error.message ||
          "Failed to fetch settings",
      },
      { status: error.response?.status || 500 },
    );
  }
}

/**
 * =========================================================
 * POST - update setting email
 * =========================================================
 *
 * Body: { from_name?, from_email?, recipient_email? }
 * Field yang tidak dikirim otomatis dipertahankan nilainya
 * (sudah di-handle di sisi plugin WordPress).
 */

export async function POST(request: NextRequest) {
  const token = (await cookies()).get("wp_token");

  if (!token) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const adminKey = process.env.BOELEDIN_ADMIN_SETTINGS_KEY;

  if (!adminKey) {
    console.error(
      "BOELEDIN_ADMIN_SETTINGS_KEY is not configured. Cannot update email settings.",
    );

    return NextResponse.json(
      { message: "Settings service is not configured." },
      { status: 500 },
    );
  }

  const body = await request.json();

  // Validasi ringan di sisi Next.js sebelum diteruskan ke WP.
  const emailFields = ["from_email", "recipient_email"] as const;

  for (const field of emailFields) {
    const value = body[field];

    if (value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      return NextResponse.json(
        { message: `Invalid email address for ${field}.` },
        { status: 400 },
      );
    }
  }

  try {
    const res = await axios.post(
      `${WP_URL}/wp-json/boeledin-email/v1/settings`,
      body,
      {
        headers: {
          "Content-Type": "application/json",
          "X-Boeledin-Admin-Key": adminKey,
        },
      },
    );

    return NextResponse.json(res.data);
  } catch (error: any) {
    console.error(
      "Failed to update email settings. Status:",
      error.response?.status,
      "Data:",
      error.response?.data,
      "Message:",
      error.message,
    );

    return NextResponse.json(
      {
        message:
          error.response?.data?.error ||
          error.response?.data?.message ||
          error.message ||
          "Failed to update settings",
      },
      { status: error.response?.status || 500 },
    );
  }
}
