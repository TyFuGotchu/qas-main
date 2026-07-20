import Link from "next/link";
import { Cpu, ExternalLink, ArrowLeft } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import { QuantProtocolSettings } from "@/components/trading-bots/QuantProtocolSettings";
import {
  QUANT_PROTOCOL,
  QUANT_PROTOCOL_ASSET_SETTINGS,
  TRADING_BOTS_NAV,
} from "@/lib/trading-bots";

export default function QuantProtocolPage() {
  return (
    <div className="space-y-8">
      <div>
        <Link
          href={TRADING_BOTS_NAV.hub}
          className="mb-4 inline-flex items-center gap-1 font-mono text-xs text-cyan-400 hover:underline"
        >
          <ArrowLeft className="h-3 w-3" />
          Trading Bots
        </Link>
        <Badge variant="success" className="mb-3">
          TradeLocker marketplace
        </Badge>
        <h2 className="flex items-center gap-2 font-mono text-2xl font-bold text-slate-200">
          <Cpu className="h-7 w-7 text-cyan-400" />
          {QUANT_PROTOCOL.name}
        </h2>
        <p className="mt-1 font-mono text-xs uppercase tracking-widest text-cyan-400/80">
          {QUANT_PROTOCOL.tagline}
        </p>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-slate-500">
          {QUANT_PROTOCOL.description}
        </p>
      </div>

      <Card className="border-cyan-500/30 bg-gradient-to-br from-cyan-500/10 to-slate-950">
        <CardContent className="flex flex-col gap-4 py-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="font-mono text-sm font-semibold text-slate-200">
              Direct marketplace link
            </h3>
            <p className="mt-1 text-xs text-slate-500">
              Subscribe and enable the bot on your TradeLocker account from the official hub.
            </p>
          </div>
          <a
            href={QUANT_PROTOCOL.marketplaceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0"
          >
            <Button variant="primary" size="lg">
              <ExternalLink className="h-4 w-4" />
              Open Quant Protocol on TradeLocker
            </Button>
          </a>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <h3 className="font-mono text-sm font-semibold text-slate-200">Setup checklist</h3>
        </CardHeader>
        <CardContent>
          <ol className="space-y-3 font-mono text-sm text-slate-400">
            <li className="flex gap-3">
              <span className="text-cyan-400">01.</span>
              Open the TradeLocker Hub link above and subscribe to Quant Protocol
            </li>
            <li className="flex gap-3">
              <span className="text-cyan-400">02.</span>
              Enable the bot on the funded / live account you want to trade
            </li>
            <li className="flex gap-3">
              <span className="text-cyan-400">03.</span>
              Apply the per-asset settings listed below for each symbol you run
            </li>
            <li className="flex gap-3">
              <span className="text-cyan-400">04.</span>
              Monitor fills and risk in{" "}
              <Link href="/dashboard/bot" className="text-cyan-400 hover:underline">
                TradeLocker Terminal
              </Link>
            </li>
          </ol>
        </CardContent>
      </Card>

      <section>
        <h3 className="mb-4 font-mono text-sm font-semibold uppercase tracking-widest text-slate-500">
          Exact settings by asset
        </h3>
        <QuantProtocolSettings assets={QUANT_PROTOCOL_ASSET_SETTINGS} />
      </section>
    </div>
  );
}
