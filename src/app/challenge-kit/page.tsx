import type { Metadata } from "next";
import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import { PartnerRecommendationFlow } from "@/components/broker/PartnerRecommendationFlow";
import { TrackedCheckoutLink } from "@/components/analytics/TrackedCheckoutLink";
import { rankingPageMetadata } from "@/lib/seo/page-metadata";
import {
  CHALLENGE_KIT_PATH,
  CHALLENGE_KIT_PRICE,
  getChallengeKitCheckoutUrl,
  getPremiumCheckoutUrl,
  PREMIUM_PRICE,
} from "@/lib/pricing-constants";
import { SUPPORT_EMAIL } from "@/lib/support";

export const metadata: Metadata = rankingPageMetadata({
  title: "7-Day Prop Firm Challenge Kit — $29",
  description:
    "Printable 7-day challenge tracker: daily profit caps, consistency math, red-day rules. $29. Upgrade anytime to Premium Quant.",
  path: CHALLENGE_KIT_PATH,
  keywords: [
    "prop firm challenge tracker",
    "7 day prop firm playbook",
    "consistency rule worksheet",
  ],
});

export default function ChallengeKitPage() {
  const kitCheckout = getChallengeKitCheckoutUrl();
  const buyHref =
    kitCheckout ??
    `mailto:${SUPPORT_EMAIL}?subject=Buy%207-Day%20Challenge%20Kit%20(%2429)`;

  return (
    <article className="space-y-12">
      <header className="text-center">
        <Badge variant="success" className="mb-4">
          Instant PDF · {CHALLENGE_KIT_PRICE}
        </Badge>
        <h1 className="font-mono text-3xl font-bold text-slate-50 sm:text-4xl">
          7-Day Prop Firm Challenge Kit
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-slate-400">
          Paper system for funded evaluations: daily caps, consistency math, and a
          printable tracker. Not a bot. Not a guarantee. Process you can run this week.
        </p>
        <p className="mt-6 font-mono text-3xl font-bold text-slate-100">
          {CHALLENGE_KIT_PRICE}
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <a href={buyHref} target={kitCheckout ? "_blank" : undefined} rel="noopener noreferrer">
            <Button variant="primary" size="lg">
              Get the kit — {CHALLENGE_KIT_PRICE}
            </Button>
          </a>
          <TrackedCheckoutLink source="challenge_kit_upsell">
            <Button variant="secondary" size="lg">
              Full Premium — {PREMIUM_PRICE}/mo
            </Button>
          </TrackedCheckoutLink>
        </div>
        {!kitCheckout && (
          <p className="mx-auto mt-4 max-w-lg font-mono text-[11px] text-slate-600">
            Checkout link not set yet — button emails {SUPPORT_EMAIL}. Add{" "}
            NEXT_PUBLIC_CHALLENGE_KIT_CHECKOUT_URL (Stripe or Gumroad $29) on Railway.
          </p>
        )}
      </header>

      <section className="grid gap-4 sm:grid-cols-3">
        {[
          { t: "Daily caps", b: "1.1–1.5% style targets so you don’t blow the 20% consistency rule." },
          { t: "Printable tracker", b: "Seven rows + end-of-week audit. Fill by hand. No app required." },
          { t: "Red-day rules", b: "Two losses and you’re done. Skipping a day is allowed." },
        ].map((x) => (
          <div
            key={x.t}
            className="rounded-xl border border-slate-800/60 bg-slate-950/40 p-5"
          >
            <h2 className="font-mono text-sm font-semibold text-slate-200">{x.t}</h2>
            <p className="mt-2 text-xs leading-relaxed text-slate-500">{x.b}</p>
          </div>
        ))}
      </section>

      <section>
        <h2 className="mb-3 font-mono text-lg font-bold text-slate-200">
          What’s inside
        </h2>
        <ul className="list-inside list-disc space-y-2 text-sm text-slate-400">
          <li>Rules that actually fail evaluations (hero days, oversizing, tilt)</li>
          <li>Days 1–7: cap, risk, max trades, tasks</li>
          <li>Fill-in P&amp;L + consistency lines each day</li>
          <li>Week tracker table + close-out audit</li>
          <li>Path to Premium if you want the live stack + Quant Protocol</li>
        </ul>
      </section>

      <section className="rounded-xl border border-cyan-500/25 bg-cyan-500/5 p-6">
        <h2 className="font-mono text-lg font-bold text-slate-100">
          Want the full arsenal instead?
        </h2>
        <p className="mt-2 text-sm text-slate-400">
          Premium Quant ({PREMIUM_PRICE}/mo) includes the interactive playbook tracker,
          planning tools, academy, live terminal, guidance, and Quant Protocol on
          TradeLocker Desktop. The $29 kit is the paper companion — not a substitute.
        </p>
        <div className="mt-4 flex flex-wrap gap-3">
          <Link href="/quant-protocol">
            <Button variant="secondary" size="md">
              See Premium stack
            </Button>
          </Link>
          <a href={getPremiumCheckoutUrl()} target="_blank" rel="noopener noreferrer">
            <Button variant="primary" size="md">
              Subscribe Premium
            </Button>
          </a>
        </div>
      </section>

      <section>
        <h2 className="mb-3 font-mono text-lg font-bold text-slate-200">
          Need a broker or prop first?
        </h2>
        <p className="mb-4 text-sm text-slate-500">
          We ask bots vs manual first. Same verified partners either way.
        </p>
        <PartnerRecommendationFlow />
      </section>
    </article>
  );
}
