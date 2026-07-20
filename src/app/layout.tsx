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
    "7-Day Prop Firm Playbook, consistency & risk tools, Chart Academy, and Edge Radar props scanner. Built for FTMO, Apex, and funded traders.",
  icons: {
    icon: [{ url: "/icon.png", type: "image/png", sizes: "512x512" }],
    apple: [{ url: "/apple-icon.png", type: "image/png", sizes: "180x180" }],
    shortcut: "/icon.png",
  },
  openGraph: {
    type: "website",
    siteName: "Quicksilver Algo Systems",
    title: "Pass Prop Firm Challenges in 7 Days | Quicksilver Algo",
    description:
      "Day-by-day prop firm playbook, planning tools, and live prop scanner. Free demos included.",
    images: [{ url: "/icon.png", width: 512, height: 512, alt: "Quicksilver Algo Systems" }],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-snippet": -1,
      "max-image-preview": "large",
    },
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