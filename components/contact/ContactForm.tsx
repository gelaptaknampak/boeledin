"use client";

import { useState } from "react";
import {
  User,
  Building2,
  Mail,
  Phone,
  Tag,
  MessageSquare,
  ChevronDown,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Send,
} from "lucide-react";

import type { LangCode } from "@/lib/wordpress";
import type { ContactFormAcf } from "@/type/contact";

type Props = {
  acf: ContactFormAcf;
  lang: LangCode;
};

type Status = "idle" | "submitting" | "success" | "error";

/**
 * =========================================================
 * FIELD LABEL
 * =========================================================
 */

function FieldLabel({
  htmlFor,
  label,
  required,
}: {
  htmlFor: string;
  label: string;
  required?: boolean;
}) {
  return (
    <label
      htmlFor={htmlFor}
      className="mb-2 flex items-center gap-1 text-sm font-medium text-foreground"
    >
      {label}
      {required && <span className="text-red-500">*</span>}
    </label>
  );
}

/**
 * =========================================================
 * SHARED INPUT STYLE
 * =========================================================
 */

const inputClass =
  "w-full rounded-xl border border-border bg-background py-3 pl-11 pr-4 text-foreground placeholder:text-muted-foreground transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30";

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
    <div className="rounded-2xl border border-border bg-card p-6 shadow-sm sm:p-8 lg:p-10">
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
        <div className="mb-6 flex items-start gap-3 rounded-xl border border-green-500/30 bg-green-500/10 px-4 py-3.5 text-sm text-green-600 dark:text-green-400">
          <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0" />
          <span>
            {acf.success_message ||
              "Thank you for your message. We will contact you soon."}
          </span>
        </div>
      )}

      {status === "error" && (
        <div className="mb-6 flex items-start gap-3 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3.5 text-sm text-red-600 dark:text-red-400">
          <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />
          <span>
            {errorText ||
              acf.error_message ||
              "Something went wrong. Please try again."}
          </span>
        </div>
      )}

      {/* ============================================
          FORM
      ============================================ */}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid gap-5 sm:grid-cols-2">
          {/* FULL NAME */}
          <div>
            <FieldLabel
              htmlFor="name"
              label={acf.full_name_label || "Full Name"}
              required={Boolean(acf.full_name_required)}
            />

            <div className="relative">
              <User className="pointer-events-none absolute left-3.5 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-muted-foreground" />

              <input
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                required={Boolean(acf.full_name_required)}
                placeholder={acf.full_name_placeholder || ""}
                className={inputClass}
              />
            </div>
          </div>

          {/* COMPANY */}
          <div>
            <FieldLabel
              htmlFor="company"
              label={acf.company_label || "Company Name"}
            />

            <div className="relative">
              <Building2 className="pointer-events-none absolute left-3.5 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-muted-foreground" />

              <input
                id="company"
                name="company"
                type="text"
                value={formData.company}
                onChange={handleChange}
                placeholder={acf.company_placeholder || ""}
                className={inputClass}
              />
            </div>
          </div>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          {/* EMAIL */}
          <div>
            <FieldLabel
              htmlFor="email"
              label={acf.email_label || "Email"}
              required={Boolean(acf.email_required)}
            />

            <div className="relative">
              <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-muted-foreground" />

              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required={Boolean(acf.email_required)}
                placeholder={acf.email_placeholder || ""}
                className={inputClass}
              />
            </div>
          </div>

          {/* PHONE */}
          <div>
            <FieldLabel
              htmlFor="phone"
              label={acf.phone_label || "Phone No / Mobile Phone"}
            />

            <div className="relative">
              <Phone className="pointer-events-none absolute left-3.5 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-muted-foreground" />

              <input
                id="phone"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleChange}
                placeholder={acf.phone_placeholder || ""}
                className={inputClass}
              />
            </div>
          </div>
        </div>

        {/* PRODUCT INTEREST */}
        {interestOptions.length > 0 && (
          <div>
            <FieldLabel
              htmlFor="interest"
              label={acf.interest_label || "Product Interest"}
            />

            <div className="relative">
              <Tag className="pointer-events-none absolute left-3.5 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-muted-foreground" />

              <select
                id="interest"
                name="interest"
                value={formData.interest}
                onChange={handleChange}
                className={`${inputClass} appearance-none pr-10`}
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

              <ChevronDown className="pointer-events-none absolute right-3.5 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-muted-foreground" />
            </div>
          </div>
        )}

        {/* MESSAGE */}
        <div>
          <FieldLabel
            htmlFor="message"
            label={acf.message_label || "Message"}
            required={Boolean(acf.message_required)}
          />

          <div className="relative">
            <MessageSquare className="pointer-events-none absolute left-3.5 top-3.5 h-4.5 w-4.5 text-muted-foreground" />

            <textarea
              id="message"
              name="message"
              rows={5}
              value={formData.message}
              onChange={handleChange}
              required={Boolean(acf.message_required)}
              placeholder={acf.message_placeholder || ""}
              className={`${inputClass} resize-none`}
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={status === "submitting"}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3.5 text-center font-semibold text-primary-foreground transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {status === "submitting" ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Send className="h-4 w-4" />
          )}

          {status === "submitting"
            ? "Sending..."
            : acf.submit_text || "Submit"}
        </button>
      </form>
    </div>
  );
}