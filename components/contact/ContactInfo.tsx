"use client";

import {
  MapPin,
  Mail,
  Phone,
  Clock,
} from "lucide-react";

import ContactMapWrapper from "./ContactMapWrapper";

type Props = {
  acf: any;
};

export default function ContactInfo({ acf }: Props) {
  const emails = [
    acf?.email_1,
    acf?.email_2,
  ].filter(Boolean);

  const phones = [
    acf?.phone_1,
    acf?.phone_2,
  ].filter(Boolean);

  const businessHours = [
    {
      day: acf?.business_day_1,
      time: acf?.business_time_1,
    },
    {
      day: acf?.business_day_2,
      time: acf?.business_time_2,
    },
  ].filter((item) => item.day || item.time);

  return (
    <div>
      <h2 className="text-3xl font-bold">
        {acf?.contact_info_title ??
          "Informasi Kontak"}
      </h2>

      <p className="mb-6 text-muted-foreground">
        {acf?.company_name ??
          "PT Future Boeled Indonesia"}
      </p>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">

        {/* Address */}
        <div className="flex gap-4">
          <div className="flex h-10 w-10 flex-shrink-0 items-start justify-center rounded-lg border border-border bg-accent/5">
            <MapPin className="mt-2 h-5 w-5 text-primary" />
          </div>

          <div>
            <p className="whitespace-pre-line text-sm text-muted-foreground">
              {acf?.address ??
                "Ruko Exclusive, Jl. Bukit Golf Mediterania, Pantai Indah Kapuk No.1A Blok G, Jakarta Utara"}
            </p>
          </div>
        </div>

        {/* Email */}
        <div className="flex gap-4">
          <div className="flex h-10 w-10 flex-shrink-0 items-start justify-center rounded-lg border border-border bg-accent/5">
            <Mail className="mt-2 h-5 w-5 text-primary" />
          </div>

          <div className="space-y-1 text-sm text-muted-foreground">
            {emails.length > 0 ? (
              emails.map((email: string, index: number) => (
                <p key={index}>{email}</p>
              ))
            ) : (
              <p>info@boeledin.com</p>
            )}
          </div>
        </div>

        {/* Phone */}
        <div className="flex gap-4">
          <div className="flex h-10 w-10 flex-shrink-0 items-start justify-center rounded-lg border border-border bg-accent/5">
            <Phone className="mt-2 h-5 w-5 text-primary" />
          </div>

          <div className="space-y-1 text-sm text-muted-foreground">
            {phones.length > 0 ? (
              phones.map((phone: string, index: number) => (
                <p key={index}>{phone}</p>
              ))
            ) : (
              <p>+62 813-1906-0606</p>
            )}
          </div>
        </div>

        {/* Business Hours */}
        <div className="flex gap-4">
          <div className="flex h-10 w-10 flex-shrink-0 items-start justify-center rounded-lg border border-border bg-accent/5">
            <Clock className="mt-2 h-5 w-5 text-primary" />
          </div>

          <div className="space-y-1 text-sm text-muted-foreground">
            {businessHours.length > 0 ? (
              businessHours.map(
                (
                  item: {
                    day?: string;
                    time?: string;
                  },
                  index: number,
                ) => (
                  <p key={index}>
                    {item.day}
                    {item.day && item.time ? ": " : ""}
                    {item.time}
                  </p>
                ),
              )
            ) : (
              <p>Senin - Jumat: 08.00 - 17.00 WIB</p>
            )}
          </div>
        </div>

      </div>

      {/* Map */}
      <div className="mt-8">
        <div className="h-64 overflow-hidden rounded-lg border border-border md:h-80">
          <ContactMapWrapper />
        </div>
      </div>
    </div>
  );
}