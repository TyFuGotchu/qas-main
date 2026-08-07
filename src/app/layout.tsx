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
    default: "Pass Prop Firm Challenges in 7 Days | Quicksilver Algo",
    template: "%s | Quicksilver Algo",
  },
  description:
    "7-Day Prop Firm Playbook, consistency & risk tools, Chart Academy, and TradeLocker Quant Protocol. Built for FTMO, Apex, FundedNext, and funded traders.",
  applicationName: "Quicksilver Algo Systems",
  authors: [{ name: "Quicksilver Algo Systems", url: siteUrl }],
  creator: "Quicksilver Algo Systems",
  publisher: "Quicksilver Algo Systems",
  category: "Finance",
  keywords: [
    "prop firm challenge",
    "pass prop firm challenge",
    "TradeLocker bot",
    "Quicksilver Quant Protocol",
    "7 day prop firm playbook",
    "FTMO challenge plan",
    "break of structure",
    "prop firm consistency rule",
  ],
  icons: {
    icon: [{ url: "/icon.png", type: "image/png", sizes: "512x512" }],
    apple: [{ url: "/apple-icon.png", type: "image/png", sizes: "180x180" }],
    shortcut: "/icon.png",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    siteName: "Quicksilver Algo Systems",
    title: "Pass Prop Firm Challenges in 7 Days | Quicksilver Algo",
    description:
      "Day-by-day prop firm playbook, planning tools, Chart Academy, and TradeLocker Quant Protocol. Free demos included.",
    images: [
      {
        url: "/og?v=default",
        width: 1200,
        height: 630,
        alt: "Quicksilver Algo — full trader arsenal",
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Pass Prop Firm Challenges in 7 Days | Quicksilver Algo",
    description:
      "Prop firm playbook, risk tools, academy, live terminal — Premium Quant stack.",
    images: ["/og?v=default"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-snippet": -1,
      "max-image-preview": "large",
      "max-video-preview": -1,
    },
  },
  verification: {
    // Set GOOGLE_SITE_VERIFICATION in env when you have a GSC meta token
    ...(process.env.GOOGLE_SITE_VERIFICATION
      ? { google: process.env.GOOGLE_SITE_VERIFICATION }
      : {}),
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