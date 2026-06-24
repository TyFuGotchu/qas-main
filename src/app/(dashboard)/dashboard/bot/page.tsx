import { TRADELOCKER_BOT_URL } from "@/lib/constants";
import { TradeLockerPanel } from "@/components/tradelocker/TradeLockerPanel";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { TerminalPanel } from "@/components/ui/TerminalPanel";
import { Badge } from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import { Bot, ExternalLink, Settings, Sparkles } from "lucide-react";

const RUNTIME_PARAMS = [
  { key: "MaxSpread", value: "2.5", unit: "pips" },
  { key: "RiskPerTrade", value: "0.5", unit: "%" },
  { key: "MaxDailyLoss", value: "4.8", unit: "%" },
  { key: "TrailingDrawdown", value: "9.5", unit: "%" },
  { key: "SessionFilter", value: "London+NY", unit: "" },
  { key: "LotMultiplier", value: "1.0", unit: "x" },
];

export default function BotActivationPage() {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="font-mono text-2xl font-bold text-slate-200">
          TradeLocker Bots
        </h2>
        <p className="mt-1 font-mono text-sm text-slate-500">
          Connect your TradeLocker account, monitor live performance, and
          activate bots from the official TradeLocker marketplace — starting with
          Quicksilver Quant Protocol.
        </p>
      </div>

      <section>
        <h3 className="mb-4 font-mono text-sm font-semibold uppercase tracking-widest text-slate-500">
          Live TradeLocker Terminal
        </h3>
        <TradeLockerPanel />
      </section>

      <Card className="border-cyan-500/30 bg-gradient-to-br from-cyan-500/5 to-slate-950">
        <CardContent className="flex flex-col gap-6 py-8 sm:flex-row sm:items-center">
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-lg border border-cyan-500/40 bg-cyan-500/10">
            <Bot className="h-8 w-8 text-cyan-400" />
          </div>
          <div className="flex-1">
            <Badge variant="success" className="mb-3">
              Featured Bot
            </Badge>
            <h3 className="font-mono text-lg font-semibold text-slate-200">
              Quicksilver Quant Protocol — Apex Institutional Engine
            </h3>
            <p className="mt-2 text-sm text-slate-500">
              Our flagship algorithm on the TradeLocker marketplace. Subscribe
              through the hub, enable it on your connected account, and run with
              prop-firm-optimized parameters — no local installs or file
              downloads required.
            </p>
          </div>
          <a
            href={TRADELOCKER_BOT_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0"
          >
            <Button variant="primary" size="lg">
              <ExternalLink className="h-4 w-4" />
              Open TradeLocker Hub
            </Button>
          </a>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        <TerminalPanel title="Quicksilver Quant Protocol — Runtime Parameters" status="online">
          <div className="space-y-2">
            {RUNTIME_PARAMS.map((param) => (
              <div
                key={param.key}
                className="flex items-center justify-between border-b border-slate-800/60 py-2 last:border-0"
              >
                <span className="text-slate-500">{param.key}</span>
                <span className="text-cyan-terminal">
                  {param.value}
                  {param.unit && (
                    <span className="ml-1 text-slate-600">{param.unit}</span>
                  )}
                </span>
              </div>
            ))}
          </div>
          <div className="mt-4 flex items-center gap-2">
            <Badge variant="success">Applied via TradeLocker</Badge>
            <span className="font-mono text-xs text-slate-600">
              Optimized for prop firm compliance
            </span>
          </div>
        </TerminalPanel>

        <Card className="border-slate-800/60">
          <CardHeader>
            <h3 className="flex items-center gap-2 font-mono text-sm font-semibold text-slate-200">
              <Sparkles className="h-4 w-4 text-amber-400" />
              More TradeLocker Bots
            </h3>
          </CardHeader>
          <CardContent>
            <p className="text-sm leading-relaxed text-slate-500">
              Additional free bot codes and marketplace strategies for Premium
              Quant and Lifetime Alpha members are coming soon. Everything will
              deploy directly through TradeLocker — same connect-and-run flow as
              Quicksilver Quant Protocol.
            </p>
            <Badge variant="warning" className="mt-4">
              Coming soon · Tier 2+
            </Badge>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <h3 className="flex items-center gap-2 font-mono text-sm font-semibold text-slate-200">
            <Settings className="h-4 w-4 text-cyan-400" />
            TradeLocker Activation Steps
          </h3>
        </CardHeader>
        <CardContent>
          <ol className="space-y-3 font-mono text-sm text-slate-400">
            <li className="flex gap-3">
              <span className="text-cyan-400">01.</span>
              Connect your TradeLocker account in the Live Terminal section above
            </li>
            <li className="flex gap-3">
              <span className="text-cyan-400">02.</span>
              Open the TradeLocker Hub and subscribe to Quicksilver Quant Protocol
            </li>
            <li className="flex gap-3">
              <span className="text-cyan-400">03.</span>
              Enable the bot on your TradeLocker account from the marketplace
            </li>
            <li className="flex gap-3">
              <span className="text-cyan-400">04.</span>
              Confirm runtime parameters are active and monitor positions in your
              live dashboard
            </li>
          </ol>
        </CardContent>
      </Card>
    </div>
  );
}