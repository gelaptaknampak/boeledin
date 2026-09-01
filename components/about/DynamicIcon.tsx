import * as LucideIcons from "lucide-react";
import type { LucideIcon as LucideIconType } from "lucide-react";

interface DynamicIconProps {
  name?: string | null;
  className?: string;
}

/**
 * Render icon dari lucide-react berdasarkan nama komponennya (string),
 * mis. "Monitor", "Cog", "Package", "CheckCircle".
 *
 * Ini yang disimpan di ACF text field untuk section yang icon-nya
 * berupa nama lucide-react (About Core Services, About Industries, dll).
 * Penulisan nama HARUS persis PascalCase sesuai export lucide-react,
 * contoh: "Wrench", "Building2", "MonitorPlay" — bukan "wrench" / "monitor-play".
 */
export default function DynamicIcon({
  name,
  className = "h-7 w-7",
}: DynamicIconProps) {
  if (!name) return null;

  const Icon = (LucideIcons as unknown as Record<string, LucideIconType>)[
    name.trim()
  ];

  if (!Icon) {
    if (process.env.NODE_ENV !== "production") {
      console.warn(
        `[DynamicIcon] Icon "${name}" tidak ditemukan di lucide-react. Cek penulisan namanya (harus PascalCase, sama persis dengan nama export lucide-react).`
      );
    }
    return null;
  }

  return <Icon className={className} />;
}