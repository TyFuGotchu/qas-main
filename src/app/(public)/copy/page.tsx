import type { Metadata } from "next";
import Link from "next/link";
import Button from "@/components/ui/Button";
import { rankingPageMetadata } from "@/lib/seo/page-metadata";
import { SEO_RECOVERY_REFRESHED } from "@/lib/seo/money-pages";
import { LEGAL_FOOTER } from "@/lib/site-ia";
import { WEBHOOK_API_ALIAS, WEBHOOK_PUBLIC_URL } from "@/lib/plans";

export const metadata: Metadata = rankingPageMetadata({
  title: "TradingView Master Suite → TradeLocker Copy | Quicksilver",
  description:
    "TradingView webhook to TradeLocker copy. Not live until the alert JSON is wired. Copy or Full plan required. Flatten wins if armed.",
  path: "/copy",
  modifiedAt: SEO_RECOVERY_REFRESHED,
  keywords: [
    "TradingView webhook TradeLocker",
    "TV to TradeLocker copy",
    "Quicksilver Master Suite",
  ],
});

export default function CopyPage() {
  return (
    <article className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-[#9AA3B2]">
        Master Suite / Copy
      </p>
      <h1 className="mt-4 text-3xl font-semibold tracking-tight text-[#F3F5F7]">
        TradingView → TradeLocker copy
      </h1>
      <p className="mt-2 inline-block rounded-full border border-white/[0.14] px-3 py-1 font-mono text-[10px] uppercase tracking-[0.14em] text-[#F5C84C]">
        Not live
      </p>
      <p className="mt-4 text-base leading-relaxed text-[#C9C2D6]">
        Alert from TradingView hits our webhook, then maps to your TradeLocker account.
        Copy is off by default. Flatten wins if armed and equity is at or through the floor.
        Missed alerts, slippage, and disconnects happen.
      </p>
      <ol className="mt-8 list-decimal space-y-2 pl-5 text-sm text-[#C9C2D6]">
        <li>TradingView plan that can send webhooks</li>
        <li>Master Suite on the chart</li>
        <li>TradeLocker connected in Quicksilver</li>
        <li>Copy ($99) or Full ($119.99) plan</li>
        <li>Paste the webhook URL into TradingView. Secret is issued after subscribe.</li>
      </ol>
      <div className="mt-8 rounded-[12px] border border-white/[0.1] bg-[#0B0D12] p-4 font-mono text-xs text-[#7FE7DC]">
        {WEBHOOK_PUBLIC_URL}
      </div>
      <p className="mt-2 font-mono text-[11px] text-[#9AA3B2]">Alias: {WEBHOOK_API_ALIAS}</p>
      <div className="mt-6 rounded-[12px] border border-dashed border-white/[0.14] p-4 text-sm text-[#C9C2D6]">
        JSON message box: waiting on Ty. Do not treat this path as live until a test
        alert fills.
      </div>
      <div className="mt-8">
        <Link href="/pricing">
          <Button variant="primary">Open pricing</Button>
        </Link>
      </div>
      <p className="mt-10 font-mono text-[11px] leading-relaxed text-[#9AA3B2]">{LEGAL_FOOTER}</p>
    </article>
  );
}
