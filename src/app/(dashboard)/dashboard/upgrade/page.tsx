import { PricingGrid } from "@/components/pricing/PricingGrid";
import { Card, CardContent } from "@/components/ui/Card";
import { TOOLS } from "@/lib/tools-registry";
import { Lock } from "lucide-react";

const PAYWALL_MESSAGES: Record<string, string> = {
  academy:
    "Chart Academy — lessons, guides, and the prop firm 1-week playbook — requires Premium Quant ($199.99/mo) or Lifetime Alpha.",
  discord:
    "VIP Discord channels and live guidance require Premium Quant ($199.99/mo) or Lifetime Alpha.",
  tools:
    "The 6 QS Planning Modules require Premium Quant ($199.99/mo) or Lifetime Alpha.",
};

export default function UpgradePage({
  searchParams,
}: {
  searchParams: { paywall?: string };
}) {
  const paywallNote =
    PAYWALL_MESSAGES[searchParams.paywall ?? ""] ??
    "Premium Quant ($199.99/mo) or Lifetime Alpha unlocks Chart Academy, planning tools, and VIP Discord.";

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
              Your current Bot Only tier provides TradeLocker bot access and
              optimized runtime parameters. Upgrade to unlock Chart Academy, all
              6 manual trading planning tools, VIP Discord, live guidance, and
              additional TradeLocker bot codes (coming soon).
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