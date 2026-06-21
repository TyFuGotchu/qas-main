"use client";

import { useMemo } from "react";
import dynamic from "next/dynamic";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { Badge } from "@/components/ui/Badge";
import { TerminalPanel } from "@/components/ui/TerminalPanel";
import { detectTrapZones } from "@/lib/market-data/analytics";
import type { MarketSymbol } from "@/lib/market-data/types";
import { useMarketDataContext } from "@/providers/MarketDataProvider";
import { cn } from "@/lib/utils";

const LightweightChart = dynamic(
  () =>
    import("@/components/charts/LightweightChart").then((m) => m.LightweightChart),
  { ssr: false, loading: () => <div className="h-[380px] animate-pulse rounded bg-slate-900" /> }
);

const TRAP_SYMBOLS: MarketSymbol[] = ["XAUUSD", "NAS100", "US30"];

export function TrapDetector() {
  const { activeSymbol, setActiveSymbol, candles, source } = useMarketDataContext();
  const selectedSymbol = TRAP_SYMBOLS.includes(activeSymbol)
    ? activeSymbol
    : "XAUUSD";

  const chartCandles = candles[selectedSymbol] ?? [];

  const traps = useMemo(() => {
    const all: ReturnType<typeof detectTrapZones> = [];
    for (const sym of TRAP_SYMBOLS) {
      const c = candles[sym];
      if (c && c.length >= 15) all.push(...detectTrapZones(sym, c));
    }
    return all.sort((a, b) => b.strength - a.strength).slice(0, 8);
  }, [candles]);

  const filteredTraps = traps.filter((t) => t.symbol === selectedSymbol);

  const priceLines = useMemo(
    () =>
      filteredTraps.map((t) => ({
        price: t.price,
        color: t.direction === "long_trap" ? "#ef4444" : "#22c55e",
        title: t.direction === "long_trap" ? "LONG TRAP" : "SHORT TRAP",
      })),
    [filteredTraps]
  );

  return (
    <div className="space-y-6">
      <GlassPanel className="flex flex-wrap items-center justify-between gap-4 p-4">
        <div>
          <h3 className="font-mono text-sm font-bold text-slate-200">
            Trap Zone Detector
          </h3>
          <p className="font-mono text-[10px] text-slate-500">
            High-volume wick analysis · {source} polled candles
          </p>
        </div>
        <div className="flex gap-2">
          {TRAP_SYMBOLS.map((sym) => (
            <button
              key={sym}
              type="button"
              onClick={() => setActiveSymbol(sym)}
              className={cn(
                "rounded border px-4 py-2 font-mono text-xs transition-all",
                selectedSymbol === sym
                  ? "border-cyan-accent bg-cyan-accent/10 text-cyan-accent"
                  : "border-slate-700 text-slate-500"
              )}
            >
              {sym}
            </button>
          ))}
        </div>
      </GlassPanel>

      <div className="grid gap-6 lg:grid-cols-5">
        <div className="lg:col-span-3">
          <TerminalPanel title={`${selectedSymbol} — Trap Overlay`} status="online">
            <LightweightChart candles={chartCandles} height={380} priceLines={priceLines} />
          </TerminalPanel>
        </div>

        <div className="space-y-3 lg:col-span-2">
          <p className="font-mono text-[10px] uppercase tracking-widest text-slate-500">
            Live Trap Feed
          </p>
          {traps.length === 0 ? (
            <GlassPanel className="p-4">
              <p className="font-mono text-xs text-slate-500">Scanning closed candles…</p>
            </GlassPanel>
          ) : (
            traps.map((trap) => (
              <GlassPanel
                key={trap.id}
                className={cn(
                  "p-4",
                  trap.strength >= 80 && "animate-pulse-glow border-red-500/40"
                )}
                glow={trap.strength >= 80}
              >
                <div className="flex items-center justify-between">
                  <Badge variant={trap.direction === "long_trap" ? "danger" : "success"}>
                    {trap.symbol} · {trap.direction === "long_trap" ? "LONG" : "SHORT"}
                  </Badge>
                  <span className="font-mono text-xs font-bold text-cyan-accent">
                    {trap.strength}%
                  </span>
                </div>
                <p className="mt-2 font-mono text-sm font-semibold text-slate-200">
                  @ {trap.price.toFixed(2)}
                </p>
                <p className="mt-1 font-mono text-[10px] text-slate-500">{trap.description}</p>
              </GlassPanel>
            ))
          )}
        </div>
      </div>
    </div>
  );
}