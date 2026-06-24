import { PricingGrid } from "@/components/pricing/PricingGrid";
import { Card, CardContent } from "@/components/ui/Card";
import { TOOLS } from "@/lib/tools-registry";
import { PREMIUM_PRICE, PREMIUM_PROMO_NOTE } from "@/lib/pricing-tiers";
import { Lock } from "lucide-react";

const PAYWALL_MESSAGES: Record<string, string> = {
  academy:
    `Chart Academy — lessons, guides, and the prop firm playbook — requires Premium (${PREMIUM_PRICE}/mo).`,
  discord:
    `VIP Discord channels and live guidance require Premium (${PREMIUM_PRICE}/mo).`,
  tools:
    `The 6 QS Planning Modules require Premium (${PREMIUM_PRICE}/mo).`,
};

export default function UpgradePage({
  searchParams,
}: {
  searchParams: { paywall?: string };
}) {
  const paywallNote =
    PAYWALL_MESSAGES[searchParams.paywall ?? ""] ??
    `Premium (${PREMIUM_PRICE}/mo) unlocks Chart Academy, all planning tools, TradeLocker bot, and VIP Discord. ${PREMIUM_PROMO_NOTE}`;

  return (
    <div className="space-y-8">
      <div>
        <h2 className="font-mono text-2xl font-bold text-slate-200">
          Upgrade Access Tier
        </h2>
        <p className="mt-1 font-mono text-sm text-slate-500">
          Unlock the full Quicksilver institutional toolkit
        </p>
      </div>

      <Card className="border-cyan-accent/20">
        <CardContent className="flex items-start gap-4 py-6">
          <Lock className="mt-1 h-6 w-6 shrink-0 text-cyan-accent" />
          <div>
            <h3 className="font-mono text-sm font-semibold text-slate-200">
              Premium Features Locked
            </h3>
            <p className="mt-2 text-sm text-slate-500">{paywallNote}</p>
            <p className="mt-2 text-sm text-slate-500">
              One Premium subscription unlocks everything — Chart Academy, all
              6 planning modules, TradeLocker bot, live dashboard, VIP Discord,
              and live guidance. {PREMIUM_PROMO_NOTE}
            </p>
            <ul className="mt-4 space-y-2 text-sm text-slate-400">
              {TOOLS.map((tool) => (
                <li key={tool.slug}>• {tool.shortName}</li>
              ))}
            </ul>
          </div>
        </CardContent>
      </Card>

      <PricingGrid />
    </div>
  );
}