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

    // cari post "home-services"
    const services = await getPostBySlug("home-services");

    if (!services) {
      return NextResponse.json(
        {
          success: false,
          message: "Post Home Services tidak ditemukan",
        },
        {
          status: 404,
        }
      );
    }

    const result = await updatePostACF(
      services.id,
      {
        services_eyebrow: body.eyebrow,
        services_title: body.title,
        services_description: body.description,

        service_1_number: body.services[0].number,
        service_1_icon: body.services[0].icon,
        service_1_title: body.services[0].title,
        service_1_description: body.services[0].description,

        service_2_number: body.services[1].number,
        service_2_icon: body.services[1].icon,
        service_2_title: body.services[1].title,
        service_2_description: body.services[1].description,

        service_3_number: body.services[2].number,
        service_3_icon: body.services[2].icon,
        service_3_title: body.services[2].title,
        service_3_description: body.services[2].description,

        service_4_number: body.services[3].number,
        service_4_icon: body.services[3].icon,
        service_4_title: body.services[3].title,
        service_4_description: body.services[3].description,
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
        message: "Gagal mengupdate Services Section",
      },
      {
        status: 500,
      }
    );
  }
}