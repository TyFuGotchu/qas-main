import Link from "next/link";
import { Card, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import { HEROFX_PARTNER_URL } from "@/lib/constants";
import { ExternalLink, Building2 } from "lucide-react";

/**
 * Broker recommendation only — not bot setup.
 * Quant Protocol runs on any TradeLocker-compatible broker; HeroFX is optional.
 */
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
                HeroFX
              </h3>
              <p className="mt-2 max-w-xl text-sm text-slate-500">
                Looking for a retail broker with TradeLocker access? We
                recommend{" "}
                <span className="text-emerald-400">HeroFX</span> as a smooth
                place to open or fund an account.{" "}
                <span className="text-slate-400">
                  Not required — any TradeLocker-compatible broker works
                </span>{" "}
                (prop firms, funded accounts, and other TL brokers included).
              </p>
              <p className="mt-2 max-w-xl text-xs text-slate-600">
                Bot setup lives under{" "}
                <Link
                  href="/dashboard/trading-bots"
                  className="text-cyan-500/80 underline-offset-2 hover:text-cyan-400 hover:underline"
                >
                  Trading Bots
                </Link>
                , separate from this broker recommendation.
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row lg:ml-auto lg:shrink-0">
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
