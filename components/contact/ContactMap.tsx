"use client";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix default marker icon
const icon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

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

  return (
    <div className="w-full h-96 rounded-lg overflow-hidden border border-border">
      <MapContainer
        // key dipasang biar map beneran RE-MOUNT kalau koordinat
        // berubah (misal habis data dari CMS selesai di-fetch).
        // react-leaflet by default nggak reaktif ke perubahan
        // center/zoom setelah mount pertama, jadi tanpa key ini
        // map bisa "nyangkut" di posisi lama walau props-nya
        // udah beda.
        key={`${finalLat}-${finalLng}`}
        className="z-0"
        center={[finalLat, finalLng]}
        zoom={14}
        scrollWheelZoom={false}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <Marker position={[finalLat, finalLng]} icon={icon}>
          <Popup>
            <div className="text-sm font-semibold">{label}</div>
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
}
