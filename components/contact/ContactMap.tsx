"use client";

interface Props {
  lat?: number | string;
  lng?: number | string;
  label?: string;
}

// Default: BOELEDIN Office (Jakarta) -- dipakai sebagai
// fallback kalau CMS belum diisi atau koordinatnya nggak valid.
const DEFAULT_LAT = -6.111602791048489;
const DEFAULT_LNG = 106.74596102766824;

function toValidCoord(value: number | string | undefined, fallback: number) {
  if (value === undefined || value === null || value === "") {
    return fallback;
  }

  const parsed = Number(value);

  return Number.isFinite(parsed) ? parsed : fallback;
}

export default function ContactMap({
  lat,
  lng,
  label = "BOELEDIN Office",
}: Props) {
  const finalLat = toValidCoord(lat, DEFAULT_LAT);
  const finalLng = toValidCoord(lng, DEFAULT_LNG);

  // Embed Google Maps pakai URL "output=embed" -- ini cara paling
  // simpel, nggak butuh API key sama sekali. Query-nya berupa
  // "lat,lng" jadi pin-nya otomatis nempel di koordinat itu.
  const mapSrc = `https://maps.google.com/maps?q=${finalLat},${finalLng}&z=14&output=embed`;

  return (
    <div className="w-full h-96 rounded-lg overflow-hidden border border-border">
      <iframe
        title={label}
        src={mapSrc}
        className="w-full h-full border-0"
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      />
    </div>
  );
}
