import { Card, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import { TRADELOCKER_BOT_URL, HEROFX_PARTNER_URL } from "@/lib/constants";
import { ExternalLink, Building2, TrendingUp } from "lucide-react";

export function RecommendedBrokerCard() {
  return (
    <Card className="border-emerald-500/20 bg-gradient-to-br from-obsidian-900/80 to-emerald-500/5">
      <CardContent className="py-6">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center">
          <div className="flex items-start gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-lg border border-emerald-500/30 bg-emerald-500/10">
              <Building2 className="h-7 w-7 text-emerald-terminal" />
            </div>
            <div>
              <Badge variant="success" className="mb-2">
                Recommended Broker
              </Badge>
              <h3 className="font-mono text-lg font-bold text-slate-200">
                TradeLocker + HeroFX
              </h3>
              <p className="mt-2 max-w-xl text-sm text-slate-500">
                Deploy the Quicksilver Quant Protocol on{" "}
                <span className="text-cyan-400">TradeLocker</span> with{" "}
                <span className="text-emerald-400">HeroFX</span> as your
                execution broker. Institutional-grade infrastructure optimized
                for automated algo deployment.
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row lg:ml-auto lg:shrink-0">
            <a
              href={TRADELOCKER_BOT_URL}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button variant="secondary" size="md" className="w-full sm:w-auto">
                <TrendingUp className="h-4 w-4" />
                TradeLocker Platform
                <ExternalLink className="h-3.5 w-3.5" />
              </Button>
            </a>
            <a
              href={HEROFX_PARTNER_URL}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button variant="primary" size="md" className="w-full sm:w-auto">
                Open HeroFX Account
                <ExternalLink className="h-3.5 w-3.5" />
              </Button>
            </a>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}