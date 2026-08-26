"use client";

import dynamic from "next/dynamic";

const ContactMap = dynamic(() => import("./ContactMap"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-64 md:h-80 bg-slate-200 rounded-lg animate-pulse" />
  ),
});

interface Props {
  lat?: number | string;
  lng?: number | string;
  label?: string;
}

export default function ContactMapWrapper({ lat, lng, label }: Props) {
  return <ContactMap lat={lat} lng={lng} label={label} />;
}