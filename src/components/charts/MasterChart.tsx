"use client";

import dynamic from "next/dynamic";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { Badge } from "@/components/ui/Badge";
import { SYMBOL_LABELS } from "@/lib/market-data/symbols";
import type { Candle, MarketSymbol, Quote } from "@/lib/market-data/types";
import { cn } from "@/lib/utils";

const LightweightChart = dynamic(
  () =>
    import("@/components/charts/LightweightChart").then((m) => m.LightweightChart),
  {
    ssr: false,
    loading: () => (
      <div className="h-[420px] animate-pulse rounded-lg bg-slate-900/80" />
    ),
  }
);

interface MasterChartProps {
  candles: Candle[];
  quotes: Quote[];
  activeSymbol: MarketSymbol;
  onSymbolChange: (symbol: MarketSymbol) => void;
  symbols: MarketSymbol[];
  source: "live" | "mock" | "hybrid";
  loading?: boolean;
  lastUpdated?: number;
}

export function MasterChart({
  candles,
  quotes,
  activeSymbol,
  onSymbolChange,
  symbols,
  source,
  loading,
  lastUpdated,
}: MasterChartProps) {
  const quote = quotes.find((q) => q.symbol === activeSymbol);

  return (
    <GlassPanel className="overflow-hidden p-0" glow>
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/5 px-4 py-3">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-widest text-slate-500">
            Master Terminal Chart
          </p>
          {quote && (
            <div className="mt-1 flex items-baseline gap-3">
              <span className="font-mono text-2xl font-bold text-slate-100">
                {quote.price.toLocaleString()}
              </span>
              <span
                className={cn(
                  "font-mono text-sm font-semibold",
                  quote.changePercent >= 0 ? "text-emerald-400" : "text-red-400"
                )}
              >
                {quote.changePercent >= 0 ? "+" : ""}
                {quote.changePercent}%
              </span>
            </div>
          )}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant={source === "mock" ? "warning" : "success"}>
            {source === "mock" ? "MOCK" : "LIVE"} · 5min REST
          </Badge>
          {lastUpdated ? (
            <span className="font-mono text-[10px] text-slate-600">
              {loading ? "Updating…" : `Synced ${new Date(lastUpdated).toLocaleTimeString()}`}
            </span>
          ) : null}
        </div>
      </div>

      <div className="flex flex-wrap gap-1 border-b border-white/5 px-4 py-2">
        {symbols.map((sym) => (
          <button
            key={sym}
            type="button"
            onClick={() => onSymbolChange(sym)}
            className={cn(
              "rounded-md px-3 py-1.5 font-mono text-xs transition-all",
              activeSymbol === sym
                ? "bg-cyan-accent/15 text-cyan-accent shadow-[0_0_12px_rgba(0,229,255,0.2)]"
                : "text-slate-500 hover:bg-slate-800 hover:text-slate-300"
            )}
          >
            {sym}
            <span className="ml-1.5 hidden text-slate-600 sm:inline">
              {SYMBOL_LABELS[sym]}
            </span>
          </button>
        ))}
      </div>

      <div className="p-2">
        <LightweightChart candles={candles} height={420} />
      </div>
    </GlassPanel>
  );
}