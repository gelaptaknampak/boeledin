"use client";

import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import toast from "react-hot-toast";

type Props = {
  acf: any;
};

export default function ContactForm({ acf }: Props) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const contactSchema = useMemo(() => {
    return z.object({
      name: acf?.full_name_required
        ? z.string().min(2, "Nama lengkap harus diisi")
        : z.string().optional(),

      company: z.string().optional(),

      email: acf?.email_required
        ? z.string().email("Email tidak valid")
        : z.string().optional(),

      phone: z.string().optional(),

      interest: z.string().optional(),

      message: acf?.message_required
        ? z.string().min(10, "Pesan minimal 10 karakter")
        : z.string().optional(),
    });
  }, [acf]);

  type ContactFormData = z.infer<typeof contactSchema>;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      interest: "",
    },
  });

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true);

    try {
      // TODO:
      // Kirim ke API contact
      console.log(data);

      await new Promise((resolve) => setTimeout(resolve, 1000));

      toast.success(
        acf?.success_message ?? "Terima kasih! Pesan Anda telah kami terima.",
      );

      reset();
    } catch (err) {
      console.error(err);

      toast.error(acf?.error_message ?? "Gagal mengirim pesan.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="rounded-3xl bg-card border border-border p-8 shadow-lg">
      <h2 className="text-3xl font-bold">
        {acf?.form_title ?? "Form Inquiry"}
      </h2>

      {acf?.form_description && (
        <p className="mt-3 text-muted-foreground">{acf.form_description}</p>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-6">
        {/* Name & Company */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-semibold">
              {acf?.full_name_label ?? "Nama Lengkap"}

              {acf?.full_name_required && (
                <span className="ml-1 text-red-500">*</span>
              )}
            </label>

            <input
              type="text"
              placeholder={acf?.full_name_placeholder ?? "Nama Lengkap"}
              {...register("name")}
              className="w-full rounded-lg border border-border bg-background px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary"
            />

            {errors.name && (
              <p className="mt-1 text-sm text-red-500">{errors.name.message}</p>
            )}
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold">
              {acf?.company_label ?? "Perusahaan / Instansi"}
            </label>

            <input
              type="text"
              placeholder={acf?.company_placeholder ?? "PT Contoh Indonesia"}
              {...register("company")}
              className="w-full rounded-lg border border-border bg-background px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>

        {/* Email & Phone */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-semibold">
              {acf?.email_label ?? "Email"}

              {acf?.email_required && (
                <span className="ml-1 text-red-500">*</span>
              )}
            </label>

            <input
              type="email"
              placeholder={acf?.email_placeholder ?? "email@example.com"}
              {...register("email")}
              className="w-full rounded-lg border border-border bg-background px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary"
            />

            {errors.email && (
              <p className="mt-1 text-sm text-red-500">
                {errors.email.message}
              </p>
            )}
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold">
              {acf?.phone_label ?? "Nomor Telepon"}
            </label>

            <input
              type="tel"
              placeholder={acf?.phone_placeholder ?? "+62 812..."}
              {...register("phone")}
              className="w-full rounded-lg border border-border bg-background px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>

        {/* Interest */}
        <div>
          <label className="mb-2 block text-sm font-semibold">
            {acf?.interest_label ?? "Produk yang Diminati"}
          </label>

          <select
            {...register("interest")}
            className="w-full rounded-lg border border-border bg-background px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="">
              {acf?.interest_placeholder ?? "Pilih kebutuhan"}
            </option>

            {acf?.interest_1_label && (
              <option value={acf.interest_1_value}>
                {acf.interest_1_label}
              </option>
            )}

            {acf?.interest_2_label && (
              <option value={acf.interest_2_value}>
                {acf.interest_2_label}
              </option>
            )}

            {acf?.interest_3_label && (
              <option value={acf.interest_3_value}>
                {acf.interest_3_label}
              </option>
            )}

            {acf?.interest_4_label && (
              <option value={acf.interest_4_value}>
                {acf.interest_4_label}
              </option>
            )}

            {acf?.interest_5_label && (
              <option value={acf.interest_5_value}>
                {acf.interest_5_label}
              </option>
            )}
          </select>
        </div>
        {/* Message */}
        <div>
          <label className="block text-sm font-semibold mb-2">
            {acf?.message_label ?? "Pesan"}

            {acf?.message_required && <span className="text-red-500"> *</span>}
          </label>

          <textarea
            rows={5}
            placeholder={
              acf?.message_placeholder ?? "Ceritakan kebutuhan proyek Anda..."
            }
            {...register("message")}
            className="w-full resize-none rounded-lg border border-border bg-background px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
          />

          {errors.message && (
            <p className="mt-1 text-sm text-red-500">
              {errors.message.message}
            </p>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-lg bg-primary px-6 py-3 font-semibold text-primary-foreground transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isSubmitting
            ? (acf?.button_loading ?? acf?.submit_loading ?? "Mengirim...")
            : (acf?.submit_text ?? acf?.button_text ?? "Kirim Pesan")}
        </button>
      </form>
    </div>
  );
}
