import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import {
  getPostTags,
  createPostTag,
} from "@/lib/wordpress";

export async function GET() {
  const tags = await getPostTags();

  return NextResponse.json(tags);
}

export async function POST(req: Request) {
  const token = (await cookies()).get("wp_token");

  if (!token) {
    return NextResponse.json(
      { message: "Unauthorized" },
      { status: 401 }
    );
  }

  const body = await req.json();

  const tag = await createPostTag(
    body.name,
    token.value
  );

  return NextResponse.json(tag);
}