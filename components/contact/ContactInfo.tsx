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
  const emails =
    acf?.emails ?? [
      {
        email: "info@boeledin.com",
      },
    ];

  const phones =
    acf?.phones ?? [
      {
        phone: "+62 813-1906-0606",
      },
    ];

  const businessHours =
    acf?.business_hours ?? [
      {
        day: "Senin - Jumat",
        time: "08.00 - 17.00 WIB",
      },
    ];

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h3 className="text-2xl font-bold mb-2">
          {acf?.contact_info_title ?? "Informasi Kontak"}
        </h3>

        <p className="text-muted-foreground mb-6">
          {acf?.company_name ??
            "PT Future Boeled Indonesia"}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
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

            <div className="text-sm text-muted-foreground">
              {emails.map(
                (
                  item: { email: string },
                  index: number
                ) => (
                  <p key={index}>
                    {item.email}
                  </p>
                )
              )}
            </div>
          </div>


          {/* Phone */}
          <div className="flex gap-4">
            <div className="flex h-10 w-10 flex-shrink-0 items-start justify-center rounded-lg border border-border bg-accent/5">
              <Phone className="mt-2 h-5 w-5 text-primary" />
            </div>

            <div className="text-sm text-muted-foreground">
              {phones.map(
                (
                  item: { phone: string },
                  index: number
                ) => (
                  <p key={index}>
                    {item.phone}
                  </p>
                )
              )}
            </div>
          </div>


          {/* Business Hours */}
          <div className="flex gap-4">
            <div className="flex h-10 w-10 flex-shrink-0 items-start justify-center rounded-lg border border-border bg-accent/5">
              <Clock className="mt-2 h-5 w-5 text-primary" />
            </div>

            <div className="text-sm text-muted-foreground">
              {businessHours.map(
                (
                  item: {
                    day: string;
                    time: string;
                  },
                  index: number
                ) => (
                  <p key={index}>
                    {item.day}: {item.time}
                  </p>
                )
              )}
            </div>
          </div>

        </div>
      </div>


      {/* Map */}
      <div>
        <div className="w-full mt-5 h-64 md:h-80 rounded-lg overflow-hidden border border-border">
          <ContactMapWrapper />
        </div>
      </div>

    </div>
  );
}