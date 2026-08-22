import { NextRequest } from "next/server";
import axios from "axios";

import { getPostById, type LangCode } from "@/lib/wordpress";
import type { ContactFormAcf } from "@/type/contact";

// TODO: sesuaikan import ini dengan sectionConfig kamu yang
// sebenarnya (yang nyimpen post ID config form contact per-bahasa,
// mirip pola `newsSectionConfig.hero.id[lang]` di NewsPage).
import { contactSectionConfig } from "@/components/admin/sections/sectionConfig";

type RequiredFieldKey = "name" | "email" | "message";

const REQUIRED_FIELD_LABELS: Record<RequiredFieldKey, string> = {
  name: "Name",
  email: "Email",
  message: "Message",
};

function getRequiredFields(acf: ContactFormAcf): RequiredFieldKey[] {
  const required: RequiredFieldKey[] = [];

  if (acf.full_name_required) required.push("name");
  if (acf.email_required) required.push("email");
  if (acf.message_required) required.push("message");

  return required;
}

export async function POST(request: NextRequest) {
  try {
    const { name, email, phone, company, interest, message, website, lang } =
      await request.json();

    const resolvedLang: LangCode = lang === "en" ? "en" : "id";

    // =========================
    // DYNAMIC VALIDATION (dari ACF)
    // =========================
    //
    // Field mana yang wajib diambil ULANG dari WordPress di sini,
    // bukan dipercaya dari body request. Kalau dipercaya dari
    // client, orang bisa POST langsung ke endpoint ini sambil
    // ngaku "nggak ada yang required" dan lolos validasi.

    let requiredFields: RequiredFieldKey[] = ["name", "email", "message"];

    try {
      const formConfigId = contactSectionConfig.form.id[resolvedLang];

      if (formConfigId) {
        const formConfigPost = await getPostById(formConfigId, resolvedLang);

        const acf: ContactFormAcf = formConfigPost?.acf ?? {};

        requiredFields = getRequiredFields(acf);
      }
    } catch (configError) {
      // Config gagal diambil (WP down, dll) -> fallback ke default
      // aman (name/email/message tetap wajib), bukan nge-skip
      // validasi sama sekali.
      console.error(
        "Failed to fetch contact form config, falling back to default required fields:",
        configError,
      );
    }

    const values: Record<RequiredFieldKey, unknown> = {
      name,
      email,
      message,
    };

    const missingFields = requiredFields.filter((field) => !values[field]);

    if (missingFields.length > 0) {
      return Response.json(
        {
          success: false,
          error: `${missingFields
            .map((field) => REQUIRED_FIELD_LABELS[field])
            .join(", ")} ${missingFields.length > 1 ? "are" : "is"} required`,
        },
        { status: 400 },
      );
    }

    // =========================
    // ENVIRONMENT VARIABLES
    // =========================

    const wpUrl = "https://wp.boeledin.com";

    const apiKey = "Boeledin@123";

    if (!apiKey) {
      console.error(
        "BOELEDIN_CONTACT_API_KEY is not configured. Cannot submit contact form.",
      );

      return Response.json(
        {
          success: false,
          error: "Contact service is not configured.",
        },
        { status: 500 },
      );
    }

    // =========================
    // SUBMIT TO WORDPRESS PLUGIN
    // =========================
    //
    // Endpoint ini (dari plugin Boeledin Email & SMTP) yang
    // handle dua-duanya sekaligus: simpan submission sebagai
    // CPT `contact_submission` DAN kirim email lewat SMTP
    // yang dikonfigurasi di wp-admin. Nggak perlu panggil
    // WordPress & email provider terpisah lagi.

    try {
      const wpResponse = await axios.post(
        `${wpUrl}/wp-json/boeledin-email/v1/contact`,
        {
          name,
          email,
          phone: phone || "",
          company: company || "",
          interest: interest || "",
          message,
          // Honeypot: field ini seharusnya selalu kosong.
          // Kalau frontend belum punya hidden field "website",
          // ini tetap aman (undefined -> dianggap kosong).
          website: website || "",
        },
        {
          headers: {
            "Content-Type": "application/json",
            "X-Boeledin-Contact-Key": apiKey,
          },
        },
      );

      console.log(
        `Contact submission sent to WordPress (id: ${
          wpResponse.data?.submission_id ?? "unknown"
        }).`,
      );

      return Response.json({
        success: true,
        message: "Thank you for your message. We will contact you soon.",
      });
    } catch (wpError: any) {
      console.error(
        "Failed to submit contact form to WordPress:",
        wpError.response?.data || wpError.message,
      );

      // Kalau WordPress ngasih pesan error yang jelas (400/401/429),
      // teruskan apa adanya biar user tau alasannya (misal rate limit).
      if (wpError.response?.data?.error) {
        return Response.json(
          {
            success: false,
            error: wpError.response.data.error,
          },
          { status: wpError.response.status || 500 },
        );
      }

      // WordPress tidak bisa dihubungi sama sekali (network error, dsb).
      return Response.json(
        {
          success: false,
          error: "Your message could not be sent. Please try again later.",
        },
        { status: 500 },
      );
    }
  } catch (error) {
    console.error("Contact form error:", error);

    return Response.json(
      {
        success: false,
        error: "Failed to process contact form",
      },
      { status: 500 },
    );
  }
}
