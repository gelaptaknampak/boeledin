import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { updateProductType, deleteProductType } from "@/lib/wordpress";

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const token = (await cookies()).get("wp_token")?.value;

  if (!token) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  const body = await req.json();

  const type = await updateProductType(Number(id), body.name, token);

  return NextResponse.json(type);
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const token = (await cookies()).get("wp_token")?.value;

  if (!token) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  await deleteProductType(Number(id), token);

  return NextResponse.json({
    success: true,
  });
}
