import { NextResponse } from "next/server";
import { loginWordPress } from "@/lib/wordpress";

export async function POST(req: Request) {
  const body = await req.json();

  const data = await loginWordPress(body.username, body.password);

  if (!data) {
    return NextResponse.json(
      {
        success: false,
        message: "Username atau Password salah",
      },
      {
        status: 401,
      },
    );
  }

  const response = NextResponse.json({
    success: true,
    user: {
      name: data.user_display_name,
      email: data.user_email,
    },
  });

  response.cookies.set("wp_token", data.token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24,
  });

  return response;
}
