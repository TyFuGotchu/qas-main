"use client";

import Link from "next/link";
import { MasterChart } from "@/components/charts/MasterChart";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { useMarketDataContext } from "@/providers/MarketDataProvider";
import { TOOLS, TOOL_COUNT } from "@/lib/tools-registry";
import { cn } from "@/lib/utils";

export function TradingTerminal() {
  const {
    quotes,
    activeSymbol,
    setActiveSymbol,
    activeCandles,
    symbols,
    source,
    loading,
    lastUpdated,
  } = useMarketDataContext();

  return (
    <div className="space-y-8">
      <GlassPanel className="p-6" glow>
        <h2 className="font-mono text-2xl font-bold text-slate-100">
          Quicksilver Trading Terminal
        </h2>
        <p className="mt-2 font-mono text-sm text-slate-500">
          {TOOL_COUNT} institutional instruments · 5 core assets · smart REST
          polling (90s) · no brokerage required
        </p>
      </GlassPanel>

      <div className="grid gap-2 sm:grid-cols-5">
        {quotes.map((q) => (
          <button
            key={q.symbol}
            type="button"
            onClick={() => setActiveSymbol(q.symbol)}
            className={cn(
              "rounded-lg border px-3 py-2 text-left transition-all",
              activeSymbol === q.symbol
                ? "border-cyan-accent/40 bg-cyan-accent/5"
                : "border-white/5 bg-slate-950/60 hover:border-slate-600"
            )}
          >
            <p className="font-mono text-[10px] text-slate-500">{q.symbol}</p>
            <p className="font-mono text-sm font-bold text-slate-200">
              {q.price.toLocaleString()}
            </p>
            <p
              className={cn(
                "font-mono text-[10px]",
                q.changePercent >= 0 ? "text-emerald-400" : "text-red-400"
              )}
            >
              {q.changePercent >= 0 ? "+" : ""}
              {q.changePercent}%
            </p>
          </button>
        ))}
      </div>

      <MasterChart
        candles={activeCandles}
        quotes={quotes}
        activeSymbol={activeSymbol}
        onSymbolChange={setActiveSymbol}
        symbols={symbols}
        source={source}
        loading={loading}
        lastUpdated={lastUpdated}
      />

      <div>
        <h3 className="mb-4 font-mono text-sm font-semibold uppercase tracking-widest text-slate-400">
          Toolkit Modules
        </h3>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {TOOLS.map((tool) => {
            const Icon = tool.icon;
            return (
              <Link key={tool.href} href={tool.href}>
                <Card className="h-full border-white/5 bg-slate-950/60 backdrop-blur transition-all hover:border-cyan-accent/30 hover:shadow-[0_0_24px_rgba(0,229,255,0.12)]">
                  <CardHeader className="flex flex-row items-start gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-cyan-accent/30 bg-cyan-accent/10">
                      <Icon className="h-5 w-5 text-cyan-accent" />
                    </div>
                    <div className="flex-1">
                      <Badge variant="success" className="mb-2">
                        {tool.tag}
                      </Badge>
                      <h3 className="font-mono text-sm font-semibold text-slate-200">
                        {tool.shortName}
                      </h3>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-slate-500">{tool.desc}</p>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}