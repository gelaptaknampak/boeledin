"use client";

import { useState } from "react";

import type { LangCode } from "@/lib/wordpress";
import type { ContactFormAcf } from "@/type/contact";

type Props = {
  acf: ContactFormAcf;
  lang: LangCode;
};

type Status = "idle" | "submitting" | "success" | "error";

export default function ContactForm({ acf, lang }: Props) {
  const [status, setStatus] = useState<Status>("idle");
  const [errorText, setErrorText] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    company: "",
    email: "",
    phone: "",
    interest: "",
    message: "",
  });

  /**
   * =========================================================
   * INTEREST OPTIONS
   * =========================================================
   *
   * Dibangun dari 5 pasang label/value di ACF. Slot yang
   * value-nya kosong (belum diisi editor) otomatis di-skip,
   * jadi dropdown-nya nyesuain jumlah opsi yang aktual diisi.
   */

  const rawInterestOptions: { label?: string; value?: string }[] = [
    { label: acf.interest_1_label, value: acf.interest_1_value },
    { label: acf.interest_2_label, value: acf.interest_2_value },
    { label: acf.interest_3_label, value: acf.interest_3_value },
    { label: acf.interest_4_label, value: acf.interest_4_value },
    { label: acf.interest_5_label, value: acf.interest_5_value },
  ];

  const interestOptions: { label?: string; value: string }[] =
    rawInterestOptions.filter(
      (option): option is { label?: string; value: string } =>
        Boolean(option.value),
    );

  function handleChange(
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) {
    const { name, value } = e.target;

    setFormData((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    setStatus("submitting");
    setErrorText("");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...formData, lang }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to send message");
      }

      setStatus("success");

      setFormData({
        name: "",
        company: "",
        email: "",
        phone: "",
        interest: "",
        message: "",
      });
    } catch (err: any) {
      setStatus("error");
      setErrorText(err.message || "");
    }
  }

  return (
    <div>
      {acf.form_title && (
        <h2 className="mb-2 text-2xl font-bold text-foreground sm:text-3xl">
          {acf.form_title}
        </h2>
      )}

      {acf.form_description && (
        <p className="mb-8 text-foreground/70">{acf.form_description}</p>
      )}

      {/* ============================================
          STATUS BANNER
      ============================================ */}

      {status === "success" && (
        <div className="mb-6 rounded-xl border border-green-500/30 bg-green-500/10 px-4 py-3 text-sm text-green-600 dark:text-green-400">
          {acf.success_message ||
            "Thank you for your message. We will contact you soon."}
        </div>
      )}

      {status === "error" && (
        <div className="mb-6 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-600 dark:text-red-400">
          {errorText ||
            acf.error_message ||
            "Something went wrong. Please try again."}
        </div>
      )}

      {/* ============================================
          FORM
      ============================================ */}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid gap-5 sm:grid-cols-2">
          {/* FULL NAME */}
          <div>
            <label
              htmlFor="name"
              className="mb-2 block text-sm font-medium text-foreground"
            >
              {acf.full_name_label || "Full Name"}

              {acf.full_name_required && (
                <span className="ml-1 text-red-500">*</span>
              )}
            </label>

            <input
              id="name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              required={Boolean(acf.full_name_required)}
              placeholder={acf.full_name_placeholder || ""}
              className="w-full rounded-xl border border-border bg-background px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          {/* COMPANY */}
          <div>
            <label
              htmlFor="company"
              className="mb-2 block text-sm font-medium text-foreground"
            >
              {acf.company_label || "Company Name"}
            </label>

            <input
              id="company"
              name="company"
              type="text"
              value={formData.company}
              onChange={handleChange}
              placeholder={acf.company_placeholder || ""}
              className="w-full rounded-xl border border-border bg-background px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          {/* EMAIL */}
          <div>
            <label
              htmlFor="email"
              className="mb-2 block text-sm font-medium text-foreground"
            >
              {acf.email_label || "Email"}

              {acf.email_required && (
                <span className="ml-1 text-red-500">*</span>
              )}
            </label>

            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required={Boolean(acf.email_required)}
              placeholder={acf.email_placeholder || ""}
              className="w-full rounded-xl border border-border bg-background px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          {/* PHONE */}
          <div>
            <label
              htmlFor="phone"
              className="mb-2 block text-sm font-medium text-foreground"
            >
              {acf.phone_label || "Phone No / Mobile Phone"}
            </label>

            <input
              id="phone"
              name="phone"
              type="tel"
              value={formData.phone}
              onChange={handleChange}
              placeholder={acf.phone_placeholder || ""}
              className="w-full rounded-xl border border-border bg-background px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>

        {/* PRODUCT INTEREST */}
        {interestOptions.length > 0 && (
          <div>
            <label
              htmlFor="interest"
              className="mb-2 block text-sm font-medium text-foreground"
            >
              {acf.interest_label || "Product Interest"}
            </label>

            <select
              id="interest"
              name="interest"
              value={formData.interest}
              onChange={handleChange}
              className="w-full rounded-xl border border-border bg-background px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="">
                {acf.interest_placeholder || "Select an option..."}
              </option>

              {interestOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label || option.value}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* MESSAGE */}
        <div>
          <label
            htmlFor="message"
            className="mb-2 block text-sm font-medium text-foreground"
          >
            {acf.message_label || "Message"}

            {acf.message_required && (
              <span className="ml-1 text-red-500">*</span>
            )}
          </label>

          <textarea
            id="message"
            name="message"
            rows={5}
            value={formData.message}
            onChange={handleChange}
            required={Boolean(acf.message_required)}
            placeholder={acf.message_placeholder || ""}
            className="w-full resize-none rounded-xl border border-border bg-background px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <button
          type="submit"
          disabled={status === "submitting"}
          className="w-full rounded-xl bg-primary px-6 py-3.5 text-center font-semibold text-primary-foreground transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {status === "submitting" ? "..." : acf.submit_text || "Submit"}
        </button>
      </form>
    </div>
  );
}
