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
  title: "BOELEDIN Solusi Display Digital Terkemuka",
  description:
    "BOELEDIN Indonesia menyediakan solusi teknologi display terkemuka termasuk Digital Signage, Interactive Flat Panel, dan LED Display berkualitas tinggi.",
  icons: {
    icon: "logo-icon.png",
    apple:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/logo_fix.png-mokTXw13uwHxazyPxZTavgDsUeqdWC.jpeg",
  },
};

export const viewport: Viewport = {
  colorScheme: "light dark",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#000000" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body
        className={`${montserrat.className} antialiased bg-background text-foreground`}
      >
        <Providers>{children}</Providers>
        {process.env.NODE_ENV === "production" && <Analytics />}
      </body>
    </html>
  );
}
