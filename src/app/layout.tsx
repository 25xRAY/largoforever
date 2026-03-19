import type { Metadata } from "next";
import { Montserrat, Open_Sans, Playfair_Display } from "next/font/google";
import { Providers } from "@/components/providers/Providers";
import { Toaster } from "@/components/ui/Toast";
import "./globals.css";

const montserrat = Montserrat({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-montserrat",
});

const openSans = Open_Sans({
  weight: ["400", "500", "600"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-open-sans",
});

const playfair = Playfair_Display({
  weight: ["400", "700"],
  style: ["italic", "normal"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-playfair",
});

export const metadata: Metadata = {
  title: {
    template: "%s | Largo Lions Class of 2026",
    default: "Largo Lions Class of 2026",
  },
  description:
    "Largo High School Class of 2026 — track graduation requirements, celebrate wins, and create your digital yearbook page.",
  openGraph: {
    type: "website",
    siteName: "Largo Lions Class of 2026",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
  },
  themeColor: "#003B7A",
  viewport: { width: "device-width", initialScale: 1 },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${montserrat.variable} ${openSans.variable} ${playfair.variable}`}
    >
      <body className="min-h-screen font-body antialiased">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded focus:bg-gold-500 focus:px-4 focus:py-2 focus:text-navy-900 focus:outline-none"
        >
          Skip to content
        </a>
        <Providers>
        <Toaster>{children}</Toaster>
      </Providers>
      </body>
    </html>
  );
}
