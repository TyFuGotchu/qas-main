import { TRADELOCKER_BOT_URL } from "@/lib/constants";
import { TradeLockerPanel } from "@/components/tradelocker/TradeLockerPanel";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import { Bot, ExternalLink, LineChart, Settings, Sparkles } from "lucide-react";

export default function TradingPage() {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="font-mono text-2xl font-bold text-slate-200">Trading</h2>
        <p className="mt-1 font-mono text-sm text-slate-500">
          Connect your TradeLocker account, manage live positions, and use four
          pro tools — Risk Guard, Position Sizer, Growth Coach, and Exposure
          Scanner — plus marketplace algos.
        </p>
      </div>

      <section>
        <h3 className="mb-4 font-mono text-sm font-semibold uppercase tracking-widest text-slate-500">
          Live Terminal
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
              Featured Algo
            </Badge>
            <h3 className="font-mono text-lg font-semibold text-slate-200">
              Quicksilver Quant Protocol — Apex Institutional Engine
            </h3>
            <p className="mt-2 text-sm text-slate-500">
              Our flagship algorithm on the TradeLocker marketplace. Subscribe
              through the hub, enable it on your account, and run it alongside
              your live terminal — no local installs required.
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

      <Card className="border-slate-800/60">
        <CardHeader>
          <h3 className="flex items-center gap-2 font-mono text-sm font-semibold text-slate-200">
            <Sparkles className="h-4 w-4 text-amber-400" />
            Marketplace Algos
          </h3>
        </CardHeader>
        <CardContent>
          <p className="text-sm leading-relaxed text-slate-500">
            Additional marketplace strategies for Premium members are coming
            soon — same connect-and-run flow as Quicksilver Quant Protocol.
          </p>
          <Badge variant="warning" className="mt-4">
            Coming soon · Premium
          </Badge>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <h3 className="flex items-center gap-2 font-mono text-sm font-semibold text-slate-200">
            <Settings className="h-4 w-4 text-cyan-400" />
            Getting Started
          </h3>
        </CardHeader>
        <CardContent>
          <ol className="space-y-3 font-mono text-sm text-slate-400">
            <li className="flex gap-3">
              <span className="text-cyan-400">01.</span>
              Connect your TradeLocker account in the Live Terminal above
            </li>
            <li className="flex gap-3">
              <span className="text-cyan-400">02.</span>
              Use Risk Guard, Position Sizer, Growth Coach & Exposure Scanner
            </li>
            <li className="flex gap-3">
              <span className="text-cyan-400">03.</span>
              Monitor and manage open positions in the live terminal
            </li>
            <li className="flex gap-3">
              <span className="text-cyan-400">04.</span>
              Optional: subscribe to Quicksilver Quant Protocol on TradeLocker Hub
            </li>
            <li className="flex gap-3">
              <span className="text-cyan-400">05.</span>
              Enable marketplace algos on your connected account
            </li>
          </ol>
        </CardContent>
      </Card>

      <Card className="border-violet-500/20 bg-violet-500/5">
        <CardContent className="flex items-start gap-4 py-5">
          <LineChart className="mt-1 h-5 w-5 shrink-0 text-violet-400" />
          <p className="text-sm text-slate-400">
            <strong className="text-slate-300">Exposure Scanner</strong> is the
            newest live tool — it maps long/short bias, concentration in one
            symbol, and flags when your open book needs attention before you add
            size.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}