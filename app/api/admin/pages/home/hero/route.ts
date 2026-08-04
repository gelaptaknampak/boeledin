import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

import {
  getPostBySlug,
  updatePostACF,
} from "@/lib/wordpress";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const token = (await cookies()).get("wp_token")?.value;

    if (!token) {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthorized",
        },
        {
          status: 401,
        }
      );
    }

    // cari post "home-hero"
    const hero = await getPostBySlug("home-hero");

    if (!hero) {
      return NextResponse.json(
        {
          success: false,
          message: "Post Home Hero tidak ditemukan",
        },
        {
          status: 404,
        }
      );
    }

    const result = await updatePostACF(
      hero.id,
      {
        hero_eyebrow: body.eyebrow,
        hero_title: body.title,
        hero_description: body.description,

        primary_button_text: body.primaryButton.text,
        primary_button_link: body.primaryButton.url,

        hero_secondary_button_text:
          body.secondaryButton.text,

        hero_secondary_button_link:
          body.secondaryButton.url,

        stat_1_number: body.stats[0].number,
        stat_1_label: body.stats[0].label,

        stat_2_number: body.stats[1].number,
        stat_2_label: body.stats[1].label,

        stat_3_number: body.stats[2].number,
        stat_3_label: body.stats[2].label,
      },
      token
    );

    return NextResponse.json({
      success: true,
      data: result,
    });

  } catch (err) {
    console.error(err);

    return NextResponse.json(
      {
        success: false,
        message: "Gagal mengupdate Hero Section",
      },
      {
        status: 500,
      }
    );
  }
}