import { NextRequest } from "next/server";
import axios from "axios";

function escapeHtml(value: string = "") {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

export async function POST(request: NextRequest) {
  try {
    const { name, email, phone, company, interest, message } =
      await request.json();

    // =========================
    // VALIDATION
    // =========================

    if (!name || !email || !message) {
      return Response.json(
        {
          success: false,
          error: "Name, email, and message are required",
        },
        { status: 400 },
      );
    }

    // =========================
    // ENVIRONMENT VARIABLES
    // =========================

    const wpUrl = "https://wp.boeledin.com";

    const sendgridKey = process.env.SENDGRID_API_KEY;
    const fromEmail = "sales@boeledin.com";
    const toEmail = process.env.CONTACT_EMAIL_TO || "sales@boeledin.com";

    // =========================
    // ESCAPE USER INPUT
    // =========================

    const safeName = escapeHtml(name);
    const safeEmail = escapeHtml(email);
    const safePhone = escapeHtml(phone || "");
    const safeCompany = escapeHtml(company || "");
    const safeInterest = escapeHtml(interest || "");
    const safeMessage = escapeHtml(message).replace(/\n/g, "<br />");

    // =========================
    // SAVE TO WORDPRESS
    // =========================

    if (wpUrl) {
      try {
        await axios.post(
          `${wpUrl}/wp-json/wp/v2/contact_submissions`,
          {
            title: `Contact from ${name}`,
            content: message,
            status: "publish",

            meta: {
              contact_name: name,
              contact_email: email,
              contact_phone: phone || "",
              contact_company: company || "",
              contact_interest: interest || "",
            },
          },
          {
            headers: {
              "Content-Type": "application/json",
            },
          },
        );

        console.log("Contact submission saved to WordPress.");
      } catch (wpError) {
        console.error(
          "Failed to save contact submission to WordPress:",
          wpError,
        );

        // Jangan menghentikan proses.
        // Email tetap akan dikirim ke sales.
      }
    } else {
      console.warn(
        "WORDPRESS_API_URL is not configured. Skipping WordPress submission.",
      );
    }

    // =========================
    // SEND EMAIL USING SENDGRID
    // =========================

    if (!sendgridKey || !fromEmail) {
      console.error(
        "SendGrid configuration is incomplete. Required: SENDGRID_API_KEY and CONTACT_EMAIL_FROM",
      );

      return Response.json(
        {
          success: false,
          error: "Email service is not configured.",
        },
        { status: 500 },
      );
    }

    try {
      await axios.post(
        "https://api.sendgrid.com/v3/mail/send",
        {
          personalizations: [
            {
              to: [
                {
                  email: toEmail,
                },
              ],
              subject: `New Sales Inquiry from ${name}`,
            },
          ],

          from: {
            email: fromEmail,
            name: "BOELEDIN Website",
          },

          reply_to: {
            email: email,
            name: name,
          },

          content: [
            {
              type: "text/html",
              value: `
                <!DOCTYPE html>
                <html>
                  <body
                    style="
                      font-family: Arial, Helvetica, sans-serif;
                      line-height: 1.6;
                      color: #333;
                    "
                  >
                    <h2>New Sales Inquiry</h2>

                    <table
                      cellpadding="8"
                      cellspacing="0"
                      style="
                        border-collapse: collapse;
                        width: 100%;
                        max-width: 700px;
                      "
                    >
                      <tr>
                        <td style="font-weight: bold; width: 180px;">
                          Name
                        </td>
                        <td>
                          ${safeName}
                        </td>
                      </tr>

                      <tr>
                        <td style="font-weight: bold;">
                          Email
                        </td>
                        <td>
                          ${safeEmail}
                        </td>
                      </tr>

                      <tr>
                        <td style="font-weight: bold;">
                          Phone
                        </td>
                        <td>
                          ${safePhone || "Not provided"}
                        </td>
                      </tr>

                      <tr>
                        <td style="font-weight: bold;">
                          Company
                        </td>
                        <td>
                          ${safeCompany || "Not provided"}
                        </td>
                      </tr>

                      <tr>
                        <td style="font-weight: bold;">
                          Product Interest
                        </td>
                        <td>
                          ${safeInterest || "Not specified"}
                        </td>
                      </tr>
                    </table>

                    <h3>Message</h3>

                    <div
                      style="
                        padding: 16px;
                        background: #f5f5f5;
                        border-radius: 8px;
                      "
                    >
                      ${safeMessage}
                    </div>

                    <hr
                      style="
                        margin-top: 30px;
                        border: none;
                        border-top: 1px solid #ddd;
                      "
                    />

                    <p
                      style="
                        font-size: 12px;
                        color: #777;
                      "
                    >
                      This message was submitted through the
                      BOELEDIN website contact form.
                    </p>
                  </body>
                </html>
              `,
            },
          ],
        },
        {
          headers: {
            Authorization: `Bearer ${sendgridKey}`,
            "Content-Type": "application/json",
          },
        },
      );

      console.log(`Contact email successfully sent to ${toEmail}`);
    } catch (emailError) {
      console.error("Failed to send email through SendGrid:", emailError);

      return Response.json(
        {
          success: false,
          error: "Your message could not be sent. Please try again later.",
        },
        { status: 500 },
      );
    }

    // =========================
    // SUCCESS
    // =========================

    return Response.json({
      success: true,
      message: "Thank you for your message. We will contact you soon.",
    });
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
