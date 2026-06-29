import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getPremiumCheckoutUrl } from "@/lib/pricing-tiers";

const LOCAL_TOOLS_URL = process.env.NEXT_PUBLIC_LOCAL_TOOLS_URL;

export const metadata: Metadata = {
  title: "Local Trading Tools — Expectancy, ATR & Compounding | Quicksilver",
  description:
    "Three standalone trading calculators: Strategy Expectancy Validator ($6.99), Dynamic ATR Pip-Range ($12.99), and Prop Firm Compounding Matrix ($14.99). Premium bundle with FIRST100.",
};

export default function LocalToolsPage() {
  if (LOCAL_TOOLS_URL) {
    redirect(LOCAL_TOOLS_URL);
  }

  const premiumUrl = getPremiumCheckoutUrl(true);

  return (
    <div className="mx-auto max-w-2xl space-y-6 px-4 py-16 text-center">
      <h1 className="font-mono text-3xl font-bold text-slate-100">Local Trading Tools</h1>
      <p className="text-slate-400">
        The interactive tools funnel is deployed on Railway. Set{" "}
        <code className="text-emerald-400">NEXT_PUBLIC_LOCAL_TOOLS_URL</code> to your Railway
        service URL for automatic redirect.
      </p>
      <div className="flex flex-wrap justify-center gap-3">
        <Link
          href={premiumUrl}
          className="rounded-lg bg-emerald-600 px-5 py-2.5 font-mono text-sm font-semibold text-white hover:bg-emerald-500"
        >
          Premium — FIRST100 ($60 off)
        </Link>
        <Link
          href="/offers"
          className="rounded-lg border border-slate-700 px-5 py-2.5 font-mono text-sm text-slate-300 hover:border-slate-500"
        >
          Promo Hub
        </Link>
      </div>
    </div>
  );
}