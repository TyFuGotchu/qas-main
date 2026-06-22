import type { Metadata } from "next";
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

export const metadata: Metadata = {
  title: "Quicksilver Algo System | Institutional Trading Platform",
  description:
    "Premium algorithmic trading SaaS platform with proprietary bot access, quant tools, and institutional-grade execution systems.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await getSession();

  return (
    <html lang="en" className="dark">
      <body
        className={`${inter.variable} ${jetbrainsMono.variable} bg-obsidian-950 text-slate-300 antialiased`}
      >
        <GoogleAnalytics />
        <SessionProvider initialUser={user}>{children}</SessionProvider>
      </body>
    </html>
  );
}