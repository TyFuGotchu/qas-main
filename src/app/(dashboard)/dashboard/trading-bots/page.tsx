import Link from "next/link";
import { Bot, ExternalLink, Cpu, ArrowRight } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import {
  QUANT_PROTOCOL,
  TRADING_BOT_EXTERNAL_LINKS,
  TRADING_BOTS_NAV,
} from "@/lib/trading-bots";
import { cn } from "@/lib/utils";

export default function TradingBotsHubPage() {
  return (
    <div className="space-y-8">
      <div>
        <Badge variant="success" className="mb-3">
          Trading Bots
        </Badge>
        <h2 className="flex items-center gap-2 font-mono text-2xl font-bold text-slate-200">
          <Bot className="h-7 w-7 text-cyan-400" />
          Trading Bots
        </h2>
        <p className="mt-2 max-w-2xl font-mono text-sm text-slate-500">
          Marketplace bots, direct TradeLocker links, and recommended settings — all in one
          place. Start with Quicksilver Quant Protocol, then use the live terminal to monitor
          execution.
        </p>
      </div>

      <Card className="border-cyan-500/30 bg-gradient-to-br from-cyan-500/10 to-slate-950">
        <CardContent className="flex flex-col gap-6 py-8 sm:flex-row sm:items-center">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl border border-cyan-500/40 bg-cyan-500/10">
            <Cpu className="h-7 w-7 text-cyan-400" />
          </div>
          <div className="min-w-0 flex-1">
            <Badge variant="success" className="mb-2">
              Flagship
            </Badge>
            <h3 className="font-mono text-lg font-semibold text-slate-100">
              {QUANT_PROTOCOL.name}
            </h3>
            <p className="mt-1 font-mono text-xs uppercase tracking-widest text-cyan-400/80">
              {QUANT_PROTOCOL.tagline}
            </p>
            <p className="mt-2 text-sm leading-relaxed text-slate-400">
              {QUANT_PROTOCOL.description}
            </p>
          </div>
          <div className="flex shrink-0 flex-col gap-2 sm:items-end">
            <Link href={TRADING_BOTS_NAV.quantProtocol}>
              <Button variant="primary" size="md">
                Open settings & setup
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <a
              href={QUANT_PROTOCOL.marketplaceUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button variant="secondary" size="sm">
                <ExternalLink className="h-3.5 w-3.5" />
                TradeLocker Hub
              </Button>
            </a>
          </div>
        </CardContent>
      </Card>

      <section>
        <h3 className="mb-4 font-mono text-sm font-semibold uppercase tracking-widest text-slate-500">
          Links & destinations
        </h3>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {TRADING_BOT_EXTERNAL_LINKS.map((link) => {
            const isExternal = link.external !== false;
            const className = cn(
              "block h-full rounded-xl border border-slate-800/60 bg-slate-950/40 transition-colors hover:border-cyan-500/25"
            );

            const inner = (
              <>
                <div className="flex items-start justify-between gap-2 p-5 pb-0">
                  <h4 className="font-mono text-sm font-semibold text-slate-200">
                    {link.label}
                  </h4>
                  {link.badge && (
                    <Badge variant="warning" className="shrink-0">
                      {link.badge}
                    </Badge>
                  )}
                </div>
                <div className="p-5 pt-3">
                  <p className="text-xs leading-relaxed text-slate-500">{link.description}</p>
                  <p className="mt-3 flex items-center gap-1 font-mono text-[10px] uppercase tracking-wider text-cyan-400">
                    {isExternal ? (
                      <>
                        Open external <ExternalLink className="h-3 w-3" />
                      </>
                    ) : (
                      <>
                        Open in dashboard <ArrowRight className="h-3 w-3" />
                      </>
                    )}
                  </p>
                </div>
              </>
            );

            if (isExternal) {
              return (
                <a
                  key={link.id}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={className}
                >
                  {inner}
                </a>
              );
            }

            return (
              <Link key={link.id} href={link.href} className={className}>
                {inner}
              </Link>
            );
          })}
        </div>
      </section>
    </div>
  );
}
