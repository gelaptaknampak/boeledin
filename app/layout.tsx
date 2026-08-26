import { Suspense } from "react";
import { Analytics } from "@vercel/analytics/next";
import type { Metadata, Viewport } from "next";
import "./globals.css";
import Providers from "@/components/Providers";
import { Montserrat } from "next/font/google";

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "PT Future Boeled Indonesia | Display Technology Solutions",
  description:
    "PT Future Boeled Indonesia designs and integrates LED displays, digital signage, FIDS, and interactive flat panels for corporations and public institutions in Indonesia.",
  icons: {
    icon: "logo-icon.png",
    apple:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/logo_fix.png-mokTXw13uwHxazyPxZTavgDsUeqdWC.jpeg",
  },
};

export const viewport: Viewport = {
  colorScheme: "light dark",
  themeColor: [
    {
      media: "(prefers-color-scheme: light)",
      color: "#ffffff",
    },
    {
      media: "(prefers-color-scheme: dark)",
      color: "#000000",
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <body
      className={`${montserrat.className} antialiased bg-background text-foreground`}
    >
      <Suspense fallback={null}>
        {children}
      </Suspense>

      {process.env.NODE_ENV === "production" && <Analytics />}
    </body>
  );
}
