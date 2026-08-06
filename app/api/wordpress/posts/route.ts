import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

import { getPosts, createPost } from "@/lib/wordpress";

export async function GET() {
  try {
    const posts = await getPosts();

    return NextResponse.json(posts);
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        message: "Gagal mengambil berita",
      },
      {
        status: 500,
      },
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

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

    const post = await createPost(
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
          message: "Gagal membuat berita",
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
