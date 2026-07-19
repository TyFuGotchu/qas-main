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
  title: {
    default: "Quicksilver Algo | Prop Firm Tools & Edge Radar",
    template: "%s | Quicksilver Algo",
  },
  description:
    "Prop firm challenge playbook, quant planning tools, Chart Academy, and Edge Radar sports prop scanner. Free demos and Premium access.",
  icons: {
    icon: [{ url: "/icon.png", type: "image/png", sizes: "512x512" }],
    apple: [{ url: "/apple-icon.png", type: "image/png", sizes: "180x180" }],
    shortcut: "/icon.png",
  },
  openGraph: {
    type: "website",
    siteName: "Quicksilver Algo Systems",
    title: "Quicksilver Algo | Prop Firm Tools & Edge Radar",
    description:
      "Pass prop firm challenges with the 7-Day Playbook. Scan player prop line lag with Edge Radar. Free demos included.",
    images: [{ url: "/icon.png", width: 512, height: 512, alt: "Quicksilver Algo Systems" }],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#06070a",
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
        className={`${inter.variable} ${jetbrainsMono.variable} overflow-x-hidden bg-transparent text-slate-300 antialiased`}
      >
        <SessionProvider initialUser={user}>{children}</SessionProvider>
      </body>
    </html>
  );
}