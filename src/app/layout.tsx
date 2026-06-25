import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { GoogleAnalytics } from "@/components/analytics/GoogleAnalytics";
import { getSession } from "@/lib/auth";
import { SessionProvider } from "@/providers/SessionProvider";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
});

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ??
  process.env.NEXT_PUBLIC_APP_URL ??
  "https://quicksilveralgo.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Quicksilver Algo System | Institutional Trading Platform",
  description:
    "Premium algorithmic trading SaaS platform with proprietary bot access, quant tools, and institutional-grade execution systems.",
  icons: {
    icon: [{ url: "/icon.png", type: "image/png", sizes: "512x512" }],
    apple: [{ url: "/apple-icon.png", type: "image/png", sizes: "180x180" }],
    shortcut: "/icon.png",
  },
  openGraph: {
    type: "website",
    siteName: "Quicksilver Algo Systems",
    title: "Quicksilver Algo System | Institutional Trading Platform",
    description:
      "Premium algorithmic trading SaaS platform with proprietary bot access, quant tools, and institutional-grade execution systems.",
    images: [{ url: "/icon.png", width: 512, height: 512, alt: "Quicksilver Algo Systems" }],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#0B0C10",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await getSession();

  return (
    <html lang="en" className="dark">
      <head>
        <GoogleAnalytics />
      </head>
      <body
        className={`${inter.variable} ${jetbrainsMono.variable} overflow-x-hidden bg-obsidian-950 text-slate-300 antialiased`}
      >
        <SessionProvider initialUser={user}>{children}</SessionProvider>
      </body>
    </html>
  );
}