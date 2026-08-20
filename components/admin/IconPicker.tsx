"use client";

import { useMemo, useState, type SVGProps } from "react";
import * as Icons from "lucide-react";
import {
  Search,
  Check,
  X,
  ChevronDown,
} from "lucide-react";

/* =========================================================
   TYPES
========================================================= */

type IconComponent = React.ComponentType<
  SVGProps<SVGSVGElement>
>;

type IconPickerProps = {
  value: string;
  onChange: (value: string) => void;
};

/* =========================================================
   SOCIAL ICON COMPONENTS
========================================================= */

function FacebookIcon(
  props: SVGProps<SVGSVGElement>
) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path d="M13.5 22v-8h2.75l.5-3h-3.25V9.05c0-.87.24-1.46 1.48-1.46h1.58V4.91c-.27-.04-1.2-.11-2.28-.11-2.26 0-3.81 1.38-3.81 3.91V11H8v3h2.47v8h3.03Z" />
    </svg>
  );
}

function InstagramIcon(
  props: SVGProps<SVGSVGElement>
) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <rect
        x="3"
        y="3"
        width="18"
        height="18"
        rx="5"
      />

      <circle
        cx="12"
        cy="12"
        r="4"
      />

      <circle
        cx="17.5"
        cy="6.5"
        r="0.8"
        fill="currentColor"
        stroke="none"
      />
    </svg>
  );
}

function LinkedinIcon(
  props: SVGProps<SVGSVGElement>
) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path d="M6.5 8.5A1.75 1.75 0 1 0 6.5 5a1.75 1.75 0 0 0 0 3.5ZM5 10h3v9H5v-9Zm5 0h2.88v1.23h.04c.4-.75 1.38-1.54 2.84-1.54 3.04 0 3.6 2 3.6 4.6V19h-3v-4.18c0-1-.02-2.28-1.39-2.28-1.39 0-1.6 1.09-1.6 2.21V19h-3v-9Z" />
    </svg>
  );
}

function YoutubeIcon(
  props: SVGProps<SVGSVGElement>
) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path d="M23.5 6.2a3 3 0 0 0-2.12-2.12C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.38.58A3 3 0 0 0 .5 6.2C0 8.08 0 12 0 12s0 3.92.5 5.8a3 3 0 0 0 2.12 2.12c1.88.58 9.38.58 9.38.58s7.5 0 9.38-.58a3 3 0 0 0 2.12-2.12C24 15.92 24 12 24 12s0-3.92-.5-5.8ZM9.6 15.5v-7l6.2 3.5-6.2 3.5Z" />
    </svg>
  );
}

function WhatsappIcon(
  props: SVGProps<SVGSVGElement>
) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path d="M20.52 3.48A11.84 11.84 0 0 0 12.08 0C5.53 0 .2 5.33.2 11.88c0 2.1.55 4.15 1.59 5.96L.1 23.9l6.2-1.63a11.9 11.9 0 0 0 5.78 1.48h.01c6.55 0 11.88-5.33 11.88-11.88 0-3.18-1.24-6.17-3.45-8.39ZM12.09 21.7h-.01a9.82 9.82 0 0 1-5-1.36l-.36-.21-3.68.97.98-3.59-.23-.37a9.85 9.85 0 0 1-1.51-5.26c0-5.43 4.42-9.85 9.86-9.85a9.8 9.8 0 0 1 6.97 2.89 9.82 9.82 0 0 1 2.89 6.98c0 5.43-4.42 9.85-9.86 9.85Zm5.4-7.38c-.3-.15-1.77-.87-2.05-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.95 1.17-.17.2-.35.22-.65.07-.3-.15-1.24-.46-2.36-1.47-.87-.78-1.46-1.74-1.63-2.04-.17-.3-.02-.46.13-.61.14-.14.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.07-.15-.67-1.61-.92-2.2-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.49s1.07 2.89 1.22 3.09c.15.2 2.1 3.2 5.09 4.49.71.31 1.26.49 1.69.63.71.23 1.35.2 1.86.12.57-.08 1.77-.72 2.02-1.42.25-.7.25-1.29.17-1.42-.07-.12-.27-.2-.57-.35Z" />
    </svg>
  );
}

function TiktokIcon(
  props: SVGProps<SVGSVGElement>
) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.14V2h-3.45v13.67a2.9 2.9 0 1 1-2-2.75V9.4a6.35 6.35 0 1 0 5.45 6.27V8.26a8.23 8.23 0 0 0 4.82 1.55V6.69h-1.05Z" />
    </svg>
  );
}

/* =========================================================
   SOCIAL ICON MAP
========================================================= */

const SOCIAL_ICONS: Record<
  string,
  IconComponent
> = {
  Facebook: FacebookIcon,
  Instagram: InstagramIcon,
  Linkedin: LinkedinIcon,
  YouTube: YoutubeIcon,
  WhatsApp: WhatsappIcon,
  TikTok: TiktokIcon,
};

/* =========================================================
   LUCIDE ICON NAMES
========================================================= */

const LUCIDE_ICON_NAMES = [
  "Zap",
  "Settings",
  "Grid3X3",
  "Lightbulb",
  "Shield",
  "Sparkles",
  "Users",
  "Monitor",
  "Cpu",
  "Globe",
  "Building2",
  "Handshake",

  "ArrowDown",
  "ArrowLeft",
  "ArrowRight",
  "ArrowUp",
  "ArrowDownLeft",
  "ArrowDownRight",
  "ArrowLeftRight",
  "ArrowUpLeft",
  "ArrowUpRight",

  "Check",
  "X",
  "Plus",
  "Minus",

  "Home",
  "Search",
  "Menu",

  "Mail",
  "Phone",
  "MapPin",
  "Map",
  "Navigation",

  "Calendar",
  "Clock",

  "CircleCheck",
  "CircleAlert",
  "CircleX",
  "CircleHelp",

  "Heart",
  "Star",
  "Bookmark",

  "Download",
  "Upload",
  "ExternalLink",
  "Link",

  "Briefcase",
  "Award",
  "BadgeCheck",
  "Target",
  "Rocket",
  "TrendingUp",
  "BarChart",
  "PieChart",

  "Database",
  "Server",
  "Cloud",
  "Wifi",
  "Smartphone",
  "Laptop",
  "Tablet",

  "Lock",
  "Unlock",
  "Key",
  "Eye",
  "EyeOff",

  "File",
  "FileText",
  "Folder",
  "Image",
  "Paperclip",

  "Bell",
  "MessageCircle",
  "MessageSquare",
  "Send",

  "ShoppingCart",
  "ShoppingBag",
  "Package",
  "Box",

  "Factory",
  "Warehouse",
  "Construction",
  "Wrench",
  "Hammer",

  "Layers",
  "LayoutGrid",
  "List",
  "MoreHorizontal",
  "MoreVertical",

  "Info",
  "AlertTriangle",
  "HelpCircle",

  "Circle",
  "Square",
  "Triangle",
  "Diamond",

  // Additional useful icons
  "BookOpen",
  "Book",
  "GraduationCap",
  "User",
  "UserCheck",
  "UserPlus",
  "UsersRound",
  "Contact",
  "AtSign",
  "Globe2",

  "House",
  "Building",
  "Store",
  "Landmark",

  "Truck",
  "Car",
  "Plane",
  "Ship",

  "Gauge",
  "BarChart3",
  "LineChart",
  "Activity",
  "Percent",
  "DollarSign",
  "CreditCard",

  "Camera",
  "Video",
  "Mic",
  "Headphones",

  "Play",
  "Pause",
  "Volume2",

  "Menu",
  "MoreHorizontal",
  "MoreVertical",

  "RefreshCw",
  "RotateCw",
  "RefreshCcw",

  "Edit",
  "Pencil",
  "Trash2",
  "Save",

  "Filter",
  "SlidersHorizontal",

  "Eye",
  "EyeOff",

  "CalendarDays",
  "Timer",
  "AlarmClock",

  "CheckCircle",
  "XCircle",

  "Loader",
  "Loader2",

  "CircleDot",
  "Dot",

  "Sun",
  "Moon",
  "CloudSun",
  "CloudRain",

  "Leaf",
  "TreePine",
  "Flower2",

  "Glasses",
  "Stethoscope",
  "HeartPulse",

  "Code",
  "Terminal",
  "Braces",
  "Bug",

  "PenTool",
  "Palette",
  "Brush",

  "Megaphone",
  "Newspaper",
  "MessageCircleMore",

  "QrCode",
  "Scan",

  "ShieldCheck",
  "ShieldAlert",
  "ShieldOff",

  "KeyRound",
  "Fingerprint",

  "WifiOff",
  "Bluetooth",
  "Radio",

  "Printer",
  "MonitorSmartphone",

  "Cpu",
  "MemoryStick",

  "FolderOpen",
  "Files",

  "Paperclip",
  "Clipboard",
  "ClipboardCheck",

  "Inbox",
  "Archive",

  "SendHorizontal",
  "Reply",
  "Forward",

  "PhoneCall",
  "PhoneIncoming",
  "PhoneOutgoing",

  "MapPinned",
  "Locate",
  "Compass",

  "Ruler",
  "Scale",
  "Weight",

  "ToolCase",
  "Cog",
  "CogIcon",

  "HardHat",
  "Drill",

  "Factory",
  "Warehouse",

  "Boxes",
  "PackageCheck",

  "ShoppingCart",
  "ShoppingBasket",

  "Gift",
  "Tag",
  "Tags",

  "Ticket",
  "Receipt",

  "Banknote",
  "Wallet",

  "TrendingDown",
  "ArrowUpRight",
  "ArrowDownRight",

  "Maximize",
  "Minimize",
  "Expand",
  "Shrink",

  "PanelLeft",
  "PanelRight",
  "PanelTop",
  "PanelBottom",

  "Columns3",
  "Rows3",

  "AlignLeft",
  "AlignCenter",
  "AlignRight",
  "AlignJustify",

  "Bold",
  "Italic",
  "Underline",

  "Type",
  "Text",
] as const;

/* =========================================================
   ALL ICON NAMES
========================================================= */

const ICON_NAMES = [
  ...LUCIDE_ICON_NAMES,
  ...Object.keys(SOCIAL_ICONS),
] as string[];

/* =========================================================
   GET ICON COMPONENT
========================================================= */

function getIconComponent(
  iconName: string
): IconComponent | null {
  // Check custom/social icons first
  if (SOCIAL_ICONS[iconName]) {
    return SOCIAL_ICONS[iconName];
  }

  // Get Lucide icon
  const icon =
    Icons[
      iconName as keyof typeof Icons
    ];

  // Prevent undefined from being rendered
  if (!icon) {
    return null;
  }

  // Lucide exports React components
  return icon as IconComponent;
}

/* =========================================================
   ICON PICKER
========================================================= */

export default function IconPicker({
  value,
  onChange,
}: IconPickerProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  /* =======================================================
     FILTER ICONS
  ======================================================= */

  const filteredIcons = useMemo(() => {
    const keyword = search
      .toLowerCase()
      .trim();

    return ICON_NAMES.filter((name) => {
      // Make sure icon actually exists
      const Icon = getIconComponent(name);

      if (!Icon) {
        return false;
      }

      if (!keyword) {
        return true;
      }

      return name
        .toLowerCase()
        .includes(keyword);
    });
  }, [search]);

  /* =======================================================
     SELECTED ICON
  ======================================================= */

  const SelectedIcon = value
    ? getIconComponent(value)
    : null;

  /* =======================================================
     HANDLERS
  ======================================================= */

  function handleSelect(
    iconName: string
  ) {
    onChange(iconName);
    setOpen(false);
    setSearch("");
  }

  function handleClose() {
    setOpen(false);
    setSearch("");
  }

  function handleClear() {
    onChange("");
    handleClose();
  }

  /* =======================================================
     RENDER
  ======================================================= */

  return (
    <>
      {/* ===================================================
          SELECT BUTTON
      =================================================== */}

      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex w-full items-center justify-between rounded-lg border bg-white px-4 py-3 text-left text-black transition hover:bg-gray-50"
      >
        <div className="flex min-w-0 items-center gap-3">
          {SelectedIcon ? (
            <SelectedIcon
              width={22}
              height={22}
              strokeWidth={1.8}
              className="shrink-0"
            />
          ) : (
            <div className="h-[22px] w-[22px] shrink-0" />
          )}

          <span
            className={
              value
                ? "truncate text-black"
                : "text-gray-400"
            }
          >
            {value || "Pilih Icon"}
          </span>
        </div>

        <ChevronDown
          width={18}
          height={18}
          className="shrink-0 text-gray-400"
        />
      </button>

      {/* ===================================================
          MODAL
      =================================================== */}

      {open && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 p-4"
          onMouseDown={handleClose}
        >
          <div
            className="flex max-h-[85vh] w-full max-w-5xl flex-col overflow-hidden rounded-xl bg-white shadow-2xl"
            onMouseDown={(e) =>
              e.stopPropagation()
            }
          >
            {/* =============================================
                HEADER
            ============================================= */}

            <div className="flex items-center justify-between border-b px-6 py-4">
              <div>
                <h2 className="text-lg font-semibold text-black">
                  Pilih Icon
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  Cari dan pilih icon untuk
                  digunakan pada section.
                </p>
              </div>

              <button
                type="button"
                onClick={handleClose}
                className="rounded-lg p-2 text-gray-500 transition hover:bg-gray-100 hover:text-black"
              >
                <X
                  width={20}
                  height={20}
                />
              </button>
            </div>

            {/* =============================================
                SEARCH
            ============================================= */}

            <div className="border-b p-4">
              <div className="relative">
                <Search
                  width={18}
                  height={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />

                <input
                  type="text"
                  autoFocus
                  value={search}
                  onChange={(e) =>
                    setSearch(
                      e.target.value
                    )
                  }
                  placeholder="Cari icon... contoh: arrow, user, shield, instagram"
                  className="w-full rounded-lg border bg-white py-3 pl-10 pr-4 text-black outline-none transition placeholder:text-gray-400 focus:border-black"
                />
              </div>
            </div>

            {/* =============================================
                ICON GRID
            ============================================= */}

            <div className="min-h-0 flex-1 overflow-y-auto p-5">
              {filteredIcons.length === 0 ? (
                <div className="flex min-h-[200px] items-center justify-center">
                  <div className="text-center">
                    <Search
                      width={32}
                      height={32}
                      className="mx-auto mb-3 text-gray-300"
                    />

                    <p className="text-sm font-medium text-gray-600">
                      Icon tidak ditemukan
                    </p>

                    <p className="mt-1 text-xs text-gray-400">
                      Coba gunakan kata kunci
                      lainnya.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8">
                  {filteredIcons.map(
                    (iconName) => {
                      const Icon =
                        getIconComponent(
                          iconName
                        );

                      // Extra safety
                      if (!Icon) {
                        return null;
                      }

                      const isSelected =
                        value === iconName;

                      return (
                        <button
                          key={iconName}
                          type="button"
                          onClick={() =>
                            handleSelect(
                              iconName
                            )
                          }
                          title={iconName}
                          className={`
                            relative
                            flex
                            min-h-[90px]
                            flex-col
                            items-center
                            justify-center
                            gap-2
                            rounded-lg
                            border
                            p-3
                            transition
                            ${
                              isSelected
                                ? "border-black bg-gray-100"
                                : "border-gray-200 bg-white hover:border-gray-400 hover:bg-gray-50"
                            }
                          `}
                        >
                          <Icon
                            width={28}
                            height={28}
                            strokeWidth={1.8}
                            className="shrink-0 text-black"
                          />

                          <span className="w-full truncate text-center text-xs text-black">
                            {iconName}
                          </span>

                          {isSelected && (
                            <span className="absolute right-2 top-2 flex h-5 w-5 items-center justify-center rounded-full bg-black text-white">
                              <Check
                                width={12}
                                height={12}
                                strokeWidth={3}
                              />
                            </span>
                          )}
                        </button>
                      );
                    }
                  )}
                </div>
              )}
            </div>

            {/* =============================================
                FOOTER
            ============================================= */}

            <div className="flex items-center justify-between border-t px-6 py-4">
              <span className="text-sm text-gray-500">
                {filteredIcons.length} icon
                tersedia
              </span>

              <div className="flex gap-2">
                {value && (
                  <button
                    type="button"
                    onClick={handleClear}
                    className="rounded-lg border border-red-200 px-4 py-2 text-sm text-red-500 transition hover:bg-red-50"
                  >
                    Hapus Icon
                  </button>
                )}

                <button
                  type="button"
                  onClick={handleClose}
                  className="rounded-lg border px-4 py-2 text-sm text-gray-700 transition hover:bg-gray-50"
                >
                  Batal
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}