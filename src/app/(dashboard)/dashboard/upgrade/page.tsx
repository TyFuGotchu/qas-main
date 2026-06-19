import { PricingGrid } from "@/components/pricing/PricingGrid";
import { Card, CardContent } from "@/components/ui/Card";
import { Lock } from "lucide-react";

export default function UpgradePage() {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="font-mono text-2xl font-bold text-slate-200">
          Upgrade Access Tier
        </h2>
        <p className="mt-1 font-mono text-sm text-slate-500">
          Unlock the full Quicksilver quant suite
        </p>
      </div>

      <Card className="border-cyan-500/20">
        <CardContent className="flex items-start gap-4 py-6">
          <Lock className="mt-1 h-6 w-6 shrink-0 text-cyan-400" />
          <div>
            <h3 className="font-mono text-sm font-semibold text-slate-200">
              Premium Features Locked
            </h3>
            <p className="mt-2 text-sm text-slate-500">
              Your current Bot Only tier provides standalone bot access and
              optimized runtime parameters. Upgrade to Premium Quant or Lifetime
              Alpha to unlock all 5 internal trading tools, VIP Discord
              integration, live trading guidance, MQL5 source files, and preset
              libraries.
            </p>
            <ul className="mt-4 space-y-2 text-sm text-slate-400">
              <li>• Prop Firm Drawdown Matrix & Simulator</li>
              <li>• XAUUSD & Index Volatility Correlation Monitor</li>
              <li>• Automated Preset Generator (MQL5/Python)</li>
              <li>• Lot-Size & Risk-to-Reward Calculator</li>
              <li>• Market Session Volatility & Playbook Aggregator</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      <PricingGrid />
    </div>
  );
}