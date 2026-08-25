import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

const WP_URL = "https://wp.boeledin.com";

/**
 * =========================================================
 * GET - baca setting email saat ini
 * =========================================================
 *
 * PERUBAHAN: sebelumnya kirim header statis
 * X-Boeledin-Admin-Key (sama buat semua orang yang login).
 * Sekarang kirim Authorization: Bearer <wp_token milik user
 * yang login>, sama persis pola yang dipakai updatePostACF()
 * di lib/wordpress.ts. WordPress yang menentukan boleh/
 * tidaknya berdasarkan role ASLI user itu (manage_options).
 */

export async function GET() {
  const token = (await cookies()).get("wp_token")?.value;

  if (!token) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const res = await axios.get(
      `${WP_URL}/wp-json/boeledin-email/v1/settings`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    return NextResponse.json(res.data);
  } catch (error: any) {
    console.error(
      "Failed to fetch email settings. Status:",
      error.response?.status,
      "Data:",
      error.response?.data,
      "Message:",
      error.message,
    );

    // 403 dari WordPress di sini artinya user yang login
    // BUKAN Administrator (role dia nggak punya manage_options).
    return NextResponse.json(
      {
        message:
          error.response?.status === 403
            ? "Kamu tidak punya izin untuk mengakses pengaturan ini. Hubungi Administrator."
            : error.response?.data?.message ||
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
 */

export async function POST(request: NextRequest) {
  const token = (await cookies()).get("wp_token")?.value;

  if (!token) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();

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
          Authorization: `Bearer ${token}`,
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
          error.response?.status === 403
            ? "Kamu tidak punya izin untuk mengubah pengaturan ini. Hubungi Administrator."
            : error.response?.data?.message ||
              error.message ||
              "Failed to update settings",
      },
      { status: error.response?.status || 500 },
    );
  }
}