"use client";

import dynamic from "next/dynamic";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { Badge } from "@/components/ui/Badge";
import { SYMBOL_LABELS } from "@/lib/market-data/symbols";
import type { Candle, MarketSymbol, Quote } from "@/lib/market-data/types";
import { cn } from "@/lib/utils";

const MarketChart = dynamic(
  () => import("@/components/charts/MarketChart").then((m) => m.MarketChart),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-[420px] items-center justify-center rounded-lg bg-slate-950">
        <p className="font-mono text-xs text-slate-500">Initializing native chart…</p>
      </div>
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
    <GlassPanel className="overflow-hidden border-white/5 bg-slate-950 p-0" glow>
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/5 px-4 py-3">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-widest text-slate-500">
            Master Terminal Chart · {SYMBOL_LABELS[activeSymbol]}
            {(activeSymbol === "NAS100" || activeSymbol === "US30") && (
              <span className="text-slate-600"> · ETF proxy</span>
            )}
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
            {source === "mock" ? "MOCK" : "LIVE"} · REST polled
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
        <MarketChart
          symbol={activeSymbol}
          candles={candles}
          height={420}
          loading={loading}
        />
      </div>
    </GlassPanel>
  );
}