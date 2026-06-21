"use client";

import { useMemo } from "react";
import dynamic from "next/dynamic";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { TerminalPanel } from "@/components/ui/TerminalPanel";
import { detectLiquidityVoids } from "@/lib/market-data/analytics";
import { useMarketDataContext } from "@/providers/MarketDataProvider";
import { cn } from "@/lib/utils";

const MarketChart = dynamic(
  () => import("@/components/charts/MarketChart").then((m) => m.MarketChart),
  { ssr: false, loading: () => <div className="h-[420px] animate-pulse rounded bg-slate-950" /> }
);

export function LiquidityVoidMap() {
  const { activeSymbol, setActiveSymbol, candles, activeQuote, symbols, source } =
    useMarketDataContext();

  const zones = useMemo(() => {
    const chartCandles = candles[activeSymbol] ?? [];
    const price = activeQuote?.price ?? chartCandles.at(-1)?.close ?? 0;
    return detectLiquidityVoids(chartCandles, price);
  }, [candles, activeSymbol, activeQuote]);

  const chartCandles = candles[activeSymbol] ?? [];

  const priceLines = useMemo(
    () =>
      zones.flatMap((z) => [
        { price: z.priceLow, color: "rgba(0,229,255,0.6)", title: z.label },
        { price: z.priceHigh, color: "rgba(0,229,255,0.3)", title: "" },
      ]),
    [zones]
  );

  return (
    <div className="space-y-6">
      <GlassPanel className="flex flex-wrap items-center justify-between gap-4 p-4">
        <div>
          <h3 className="font-mono text-sm font-bold text-slate-200">
            Liquidity Void Map
          </h3>
          <p className="font-mono text-[10px] text-slate-500">
            Volume profile from polled OHLCV · {source} feed
          </p>
        </div>
        <div className="flex flex-wrap gap-1">
          {symbols.map((sym) => (
            <button
              key={sym}
              type="button"
              onClick={() => setActiveSymbol(sym)}
              className={cn(
                "rounded border px-3 py-1 font-mono text-xs",
                activeSymbol === sym
                  ? "border-cyan-accent text-cyan-accent"
                  : "border-slate-700 text-slate-500"
              )}
            >
              {sym}
            </button>
          ))}
        </div>
      </GlassPanel>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <TerminalPanel title={`${activeSymbol} — Void Overlay`} status="online">
            <MarketChart
              key={activeSymbol}
              symbol={activeSymbol}
              candles={chartCandles}
              height={420}
              priceLines={priceLines}
            />
          </TerminalPanel>
        </div>

        <div className="space-y-3">
          <p className="font-mono text-[10px] uppercase tracking-widest text-slate-500">
            Detected Voids
          </p>
          {zones.map((zone) => (
            <GlassPanel
              key={`${zone.label}-${zone.priceLow}`}
              className={cn("p-4", zone.intensity > 0.8 && "border-cyan-accent/40")}
              glow={zone.intensity > 0.8}
            >
              <p className="font-mono text-xs font-semibold text-cyan-accent">
                {zone.label}
              </p>
              <p className="mt-1 font-mono text-sm text-slate-300">
                {zone.priceLow.toFixed(2)} — {zone.priceHigh.toFixed(2)}
              </p>
              <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-slate-800">
                <div
                  className="h-full rounded-full bg-cyan-accent/80"
                  style={{ width: `${zone.intensity * 100}%` }}
                />
              </div>
            </GlassPanel>
          ))}
        </div>
      </div>
    </div>
  );
}