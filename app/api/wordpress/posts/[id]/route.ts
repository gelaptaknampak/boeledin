import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

import { getPost, updatePost, deletePost } from "@/lib/wordpress";

interface Params {
  params: Promise<{
    id: string;
  }>;
}

export async function GET(req: NextRequest, { params }: Params) {
  try {
    const { id } = await params;

    const post = await getPost(Number(id));

    if (!post) {
      return NextResponse.json(
        {
          message: "Berita tidak ditemukan",
        },
        {
          status: 404,
        },
      );
    }

    return NextResponse.json(post);
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        message: "Terjadi kesalahan",
      },
      {
        status: 500,
      },
    );
  }
}

export async function PUT(req: NextRequest, { params }: Params) {
  try {
    const body = await req.json();

    const { id } = await params;

    const cookieStore = await cookies();

    const token = (await cookies()).get("wp_token");

    if (!token) {
      return NextResponse.json(
        {
          message: "Unauthorized",
        },
        {
          status: 401,
        },
      );
    }

    const post = await updatePost(
      Number(id),
      body.title,
      {
        content: body.content,
        excerpt: body.excerpt,
        status: body.status,
        featured_media: body.featured_media,
        kategori: body.kategori,
        tags: body.tags,
      },
      token.value,
    );

    if (!post) {
      return NextResponse.json(
        {
          message: "Gagal mengupdate berita",
        },
        {
          status: 500,
        },
      );
    }

    return NextResponse.json(post);
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        message: "Terjadi kesalahan",
      },
      {
        status: 500,
      },
    );
  }
}

export async function DELETE(req: NextRequest, { params }: Params) {
  try {
    const { id } = await params;

    const cookieStore = await cookies();

    const token = (await cookies()).get("wp_token");

    if (!token) {
      return NextResponse.json(
        {
          message: "Unauthorized",
        },
        {
          status: 401,
        },
      );
    }

    const post = await deletePost(Number(id), token.value);

    if (!post) {
      return NextResponse.json(
        {
          message: "Gagal menghapus berita",
        },
        {
          status: 500,
        },
      );
    }

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        message: "Terjadi kesalahan",
      },
      {
        status: 500,
      },
    );
  }
}
