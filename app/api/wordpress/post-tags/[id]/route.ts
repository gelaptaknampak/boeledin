import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { updatePostTag, deletePostTag } from "@/lib/wordpress";

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const token = (await cookies()).get("wp_token");

  if (!token) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const body = await req.json();

  const tag = await updatePostTag(Number(id), body.name, token.value);

  return NextResponse.json(tag);
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const token = (await cookies()).get("wp_token");

  if (!token) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  await deletePostTag(Number(id), token.value);

  return NextResponse.json({
    success: true,
  });
}
