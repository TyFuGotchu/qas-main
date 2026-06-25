import { TRADELOCKER_BOT_URL } from "@/lib/constants";
import { TradeLockerPanel } from "@/components/tradelocker/TradeLockerPanel";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import { Bot, ExternalLink, Settings, Sparkles } from "lucide-react";

export default function BotActivationPage() {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="font-mono text-2xl font-bold text-slate-200">
          TradeLocker Bots
        </h2>
        <p className="mt-1 font-mono text-sm text-slate-500">
          Connect your TradeLocker account, monitor live performance, and use
          three pro account tools — Risk Guard, Position Sizer, and Growth Coach
          — plus bots from the TradeLocker marketplace.
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
              Our flagship algorithm, hosted live on TradeLocker. Subscribe
              through the hub, enable it on your account, and manage everything
              from TradeLocker — no local installs or file downloads required.
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
            More TradeLocker Bots
          </h3>
        </CardHeader>
        <CardContent>
          <p className="text-sm leading-relaxed text-slate-500">
              Additional free bot codes and marketplace strategies for Premium
              members are coming soon. Everything will
            deploy directly through TradeLocker — same connect-and-run flow as
            Quicksilver Quant Protocol.
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
              Use Live Risk Guard, Position Sizer, and Growth Coach on your
              connected account
            </li>
            <li className="flex gap-3">
              <span className="text-cyan-400">05.</span>
              Monitor positions and performance in the live terminal above
            </li>
          </ol>
        </CardContent>
      </Card>
    </div>
  );
}