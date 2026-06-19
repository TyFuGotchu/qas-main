import Link from "next/link";
import { getFreshSession } from "@/lib/access-control";
import { canAccessTools } from "@/lib/tiers";
import { TRADELOCKER_BOT_URL } from "@/lib/constants";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { TerminalPanel } from "@/components/ui/TerminalPanel";
import { Badge } from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import { Download, Settings, FileCode, ExternalLink, Lock } from "lucide-react";

const PREMIUM_BOT_FILES = [
  {
    name: "Quicksilver_Algo_v2.4.ex5",
    platform: "MetaTrader 5",
    size: "284 KB",
    version: "2.4.1",
    tier: "premium" as const,
  },
  {
    name: "quicksilver_executor.py",
    platform: "Python / MT5 Bridge",
    size: "42 KB",
    version: "2.4.1",
    tier: "premium" as const,
  },
  {
    name: "runtime_config.ini",
    platform: "MQL5 Configuration",
    size: "8 KB",
    version: "2.4.0",
    tier: "premium" as const,
  },
];

const runtimeParams = [
  { key: "MaxSpread", value: "2.5", unit: "pips" },
  { key: "RiskPerTrade", value: "0.5", unit: "%" },
  { key: "MaxDailyLoss", value: "4.8", unit: "%" },
  { key: "TrailingDrawdown", value: "9.5", unit: "%" },
  { key: "SessionFilter", value: "London+NY", unit: "" },
  { key: "LotMultiplier", value: "1.0", unit: "x" },
];

export default async function BotActivationPage() {
  const user = await getFreshSession();
  const hasPremium = user ? canAccessTools(user.accountTier) : false;

  return (
    <div className="space-y-8">
      <div>
        <h2 className="font-mono text-2xl font-bold text-slate-200">
          Bot Activation
        </h2>
        <p className="mt-1 font-mono text-sm text-slate-500">
          {hasPremium
            ? "Download MQL5 packages and deploy the Quicksilver execution system"
            : "Activate your standalone bot via the official TradeLocker marketplace"}
        </p>
      </div>

      <Card className="border-cyan-500/30 bg-cyan-500/5">
        <CardContent className="flex flex-col gap-6 py-8 sm:flex-row sm:items-center">
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-lg border border-cyan-500/40 bg-cyan-500/10">
            <ExternalLink className="h-8 w-8 text-cyan-400" />
          </div>
          <div className="flex-1">
            <Badge variant="success" className="mb-3">
              Official Marketplace Hub
            </Badge>
            <h3 className="font-mono text-lg font-semibold text-slate-200">
              Quicksilver Quant Protocol — Apex Institutional Engine
            </h3>
            <p className="mt-2 text-sm text-slate-500">
              Access the standalone bot directly through TradeLocker. Tier 1
              subscribers activate and run the algorithm from the official hub
              without local file deployment.
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
        {hasPremium ? (
          <Card>
            <CardHeader>
              <h3 className="flex items-center gap-2 font-mono text-sm font-semibold text-slate-200">
                <Download className="h-4 w-4 text-cyan-400" />
                MQL5 Deployment Packages
              </h3>
              <p className="mt-1 font-mono text-xs text-slate-600">
                Premium Quant & Lifetime Alpha clearance required
              </p>
            </CardHeader>
            <CardContent className="space-y-3">
              {PREMIUM_BOT_FILES.map((file) => (
                <div
                  key={file.name}
                  className="flex items-center justify-between rounded border border-slate-700/50 bg-obsidian-950 p-4"
                >
                  <div className="flex items-center gap-3">
                    <FileCode className="h-5 w-5 text-emerald-terminal" />
                    <div>
                      <p className="font-mono text-sm text-slate-300">
                        {file.name}
                      </p>
                      <p className="font-mono text-xs text-slate-600">
                        {file.platform} · {file.size} · v{file.version}
                      </p>
                    </div>
                  </div>
                  <Button variant="secondary" size="sm">
                    <Download className="h-3.5 w-3.5" />
                    Download
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>
        ) : (
          <Card className="border-slate-700/50">
            <CardContent className="flex flex-col items-center justify-center py-12 text-center">
              <Lock className="mb-4 h-10 w-10 text-amber-400/60" />
              <h3 className="font-mono text-sm font-semibold text-slate-400">
                MQL5 Source & Config Files Locked
              </h3>
              <p className="mt-2 max-w-sm text-xs text-slate-600">
                .ex5 executables, preset configurations, and advanced bot scripts
                require Premium Quant or Lifetime Alpha clearance.
              </p>
              <Link href="/dashboard/upgrade" className="mt-6">
                <Button variant="secondary" size="sm">
                  Upgrade for File Access
                </Button>
              </Link>
            </CardContent>
          </Card>
        )}

        <TerminalPanel
          title="Optimized Runtime Parameters"
          status="online"
        >
          <div className="space-y-2">
            {runtimeParams.map((param) => (
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
            <Badge variant="success">Parameters Locked</Badge>
            <span className="font-mono text-xs text-slate-600">
              Optimized for prop firm compliance
            </span>
          </div>
        </TerminalPanel>
      </div>

      <Card>
        <CardHeader>
          <h3 className="flex items-center gap-2 font-mono text-sm font-semibold text-slate-200">
            <Settings className="h-4 w-4 text-cyan-400" />
            {hasPremium ? "MT5 Installation Protocol" : "TradeLocker Activation Protocol"}
          </h3>
        </CardHeader>
        <CardContent>
          {hasPremium ? (
            <ol className="space-y-3 font-mono text-sm text-slate-400">
              <li className="flex gap-3">
                <span className="text-cyan-400">01.</span>
                Download the .ex5 file and place in MT5 Experts folder
              </li>
              <li className="flex gap-3">
                <span className="text-cyan-400">02.</span>
                Import runtime_config.ini via EA settings panel
              </li>
              <li className="flex gap-3">
                <span className="text-cyan-400">03.</span>
                Enable auto-trading and attach to XAUUSD M15 chart
              </li>
              <li className="flex gap-3">
                <span className="text-cyan-400">04.</span>
                Verify session filter aligns with your broker server time
              </li>
            </ol>
          ) : (
            <ol className="space-y-3 font-mono text-sm text-slate-400">
              <li className="flex gap-3">
                <span className="text-cyan-400">01.</span>
                Open the TradeLocker marketplace hub via the button above
              </li>
              <li className="flex gap-3">
                <span className="text-cyan-400">02.</span>
                Subscribe to Quicksilver Quant Protocol on your TradeLocker account
              </li>
              <li className="flex gap-3">
                <span className="text-cyan-400">03.</span>
                Enable the bot from your TradeLocker dashboard
              </li>
              <li className="flex gap-3">
                <span className="text-cyan-400">04.</span>
                Confirm optimized runtime parameters are applied automatically
              </li>
            </ol>
          )}
        </CardContent>
      </Card>
    </div>
  );
}