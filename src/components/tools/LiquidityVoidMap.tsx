"use client";

import { useEffect, useMemo, useState } from "react";
import dynamic from "next/dynamic";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { TerminalPanel } from "@/components/ui/TerminalPanel";
import Select from "@/components/ui/Select";
import type { Candle, LiquidityZone, MarketSymbol } from "@/lib/market-data/types";
import { MARKET_SYMBOLS } from "@/lib/market-data/symbols";
import { cn } from "@/lib/utils";

const LightweightChart = dynamic(
  () =>
    import("@/components/charts/LightweightChart").then((m) => m.LightweightChart),
  { ssr: false, loading: () => <div className="h-[420px] animate-pulse rounded bg-slate-900" /> }
);

export function LiquidityVoidMap() {
  const [symbol, setSymbol] = useState<MarketSymbol>("XAUUSD");
  const [candles, setCandles] = useState<Candle[]>([]);
  const [zones, setZones] = useState<LiquidityZone[]>([]);

  useEffect(() => {
    async function load() {
      const [candleRes, zoneRes] = await Promise.all([
        fetch(`/api/market/candles?symbol=${symbol}&count=100`),
        fetch(`/api/market/liquidity?symbol=${symbol}`),
      ]);
      const candleData = await candleRes.json();
      const zoneData = await zoneRes.json();
      setCandles(candleData.candles ?? []);
      setZones(zoneData.zones ?? []);
    }
    load();
    const interval = setInterval(load, 20_000);
    return () => clearInterval(interval);
  }, [symbol]);

  const priceLines = useMemo(
    () =>
      zones.flatMap((z) => [
        {
          price: z.priceLow,
          color: "rgba(0,229,255,0.6)",
          title: z.label,
        },
        {
          price: z.priceHigh,
          color: "rgba(0,229,255,0.3)",
          title: "",
        },
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
            Institutional order-book zones — no brokerage connection required
          </p>
        </div>
        <Select
          label="Asset"
          value={symbol}
          onChange={(e) => setSymbol(e.target.value as MarketSymbol)}
          options={MARKET_SYMBOLS.map((s) => ({ value: s, label: s }))}
        />
      </GlassPanel>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <TerminalPanel title={`${symbol} — Void Overlay Chart`} status="online">
            <LightweightChart candles={candles} height={420} priceLines={priceLines} />
          </TerminalPanel>
        </div>

        <div className="space-y-3">
          <p className="font-mono text-[10px] uppercase tracking-widest text-slate-500">
            Detected Voids
          </p>
          {zones.map((zone) => (
            <GlassPanel
              key={zone.label}
              className={cn(
                "p-4",
                zone.intensity > 0.8 && "border-cyan-accent/40"
              )}
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
              <p className="mt-1 font-mono text-[10px] text-slate-500">
                Intensity {(zone.intensity * 100).toFixed(0)}%
              </p>
            </GlassPanel>
          ))}
        </div>
      </div>
    </div>
  );
}