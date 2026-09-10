import { PricingGrid } from "@/components/pricing/PricingGrid";
import { Card, CardContent } from "@/components/ui/Card";
import { PropFirmChallengePromo } from "@/components/marketing/PropFirmChallengePromo";
import { PremiumValueStack } from "@/components/tools/PremiumValueStack";
import {
  PROP_FIRM_CHALLENGE_DAYS,
  PROP_FIRM_MARKETING_HEADLINE,
} from "@/lib/prop-firm-challenge-marketing";
import { ALL_TOOLS, LOCAL_TOOL_COUNT, QS_TOOL_COUNT } from "@/lib/tools-registry";
import {
  PREMIUM_PRICE,
} from "@/lib/pricing-tiers";
import { SUPPORT_EMAIL } from "@/lib/support";
import { Lock } from "lucide-react";

const PAYWALL_MESSAGES: Record<string, string> = {
  academy:
    `Chart Academy — lessons, guides, and the playbook — unlock with a paid Desk plan. See /pricing.`,
  support:
    `Priority email support at ${SUPPORT_EMAIL} is included on paid plans.`,
  tools:
    `Playbook and planning engines unlock on Tools $39.99 / Full $119.99. Quant Protocol is a separate Desk flag.`,
};

export default function UpgradePage({
  searchParams,
}: {
  searchParams: { paywall?: string };
}) {
  const paywallNote =
    PAYWALL_MESSAGES[searchParams.paywall ?? ""] ??
    `Tools $39.99, Copy $99, Full $119.99. Bot is not inside Tools. Support: ${SUPPORT_EMAIL}.`;

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
              Tools is the risk desk. Copy is the TV→TradeLocker webhook (not live until
              the alert JSON is wired). Full is both. Quant Protocol stays a separate
              Desktop flag. {SUPPORT_EMAIL}
            </p>
            <ul className="mt-4 space-y-2 text-sm text-slate-400">
              {ALL_TOOLS.map((tool) => (
                <li key={tool.slug}>
                  • {tool.shortName}
                  {tool.category === "local-tool" ? " (included w/ Premium)" : ""}
                </li>
              ))}
            </ul>
          </div>
        </CardContent>
      </Card>

      <PropFirmChallengePromo />

      <PremiumValueStack showToolList />

      <PricingGrid />
    </div>
  );
}