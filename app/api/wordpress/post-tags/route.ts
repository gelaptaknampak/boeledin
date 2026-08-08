import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { getPostTags, createPostTag } from "@/lib/wordpress";

export async function GET(req: Request) {
  const lang = new URL(req.url).searchParams.get("lang") || "id";
  const tags = await getPostTags(lang as any);

  return NextResponse.json(tags);
}

export async function POST(req: Request) {
  const token = (await cookies()).get("wp_token");

  if (!token) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const lang = new URL(req.url).searchParams.get("lang") || body.lang || "id";

  const tag = await createPostTag(body.name, token.value, lang as any);

  return NextResponse.json(tag);
}
