import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;

    const res = await fetch(
      `https://wp.boeledin.com/wp-json/wp/v2/media/${id}`
    );

    if (!res.ok) {
      return NextResponse.json(
        {
          success:false,
          message:"Media tidak ditemukan"
        },
        {
          status:404
        }
      );
    }

    const media = await res.json();

    return NextResponse.json({
      success:true,
      source_url: media.source_url
    });

  } catch(error) {
    console.error(error);

    return NextResponse.json(
      {
        success:false,
        message:"Gagal mengambil media"
      },
      {
        status:500
      }
    );
  }
}