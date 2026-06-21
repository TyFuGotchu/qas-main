"use client";

import { useEffect, useMemo, useState } from "react";
import dynamic from "next/dynamic";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { Badge } from "@/components/ui/Badge";
import { TerminalPanel } from "@/components/ui/TerminalPanel";
import type { Candle, TrapZone } from "@/lib/market-data/types";
import { cn } from "@/lib/utils";

const LightweightChart = dynamic(
  () =>
    import("@/components/charts/LightweightChart").then((m) => m.LightweightChart),
  { ssr: false, loading: () => <div className="h-[380px] animate-pulse rounded bg-slate-900" /> }
);

export function TrapDetector() {
  const [traps, setTraps] = useState<TrapZone[]>([]);
  const [candles, setCandles] = useState<Candle[]>([]);
  const [selectedSymbol, setSelectedSymbol] = useState<"XAUUSD" | "NAS100">("XAUUSD");

  useEffect(() => {
    async function loadTraps() {
      const res = await fetch("/api/market/traps");
      const data = await res.json();
      setTraps(data.traps ?? []);
    }
    loadTraps();
    const interval = setInterval(loadTraps, 10_000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    async function loadCandles() {
      const res = await fetch(`/api/market/candles?symbol=${selectedSymbol}&count=80`);
      const data = await res.json();
      setCandles(data.candles ?? []);
    }
    loadCandles();
    const interval = setInterval(loadCandles, 15_000);
    return () => clearInterval(interval);
  }, [selectedSymbol]);

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
            Retail offside positioning · XAUUSD & NAS100
          </p>
        </div>
        <div className="flex gap-2">
          {(["XAUUSD", "NAS100"] as const).map((sym) => (
            <button
              key={sym}
              onClick={() => setSelectedSymbol(sym)}
              className={cn(
                "rounded border px-4 py-2 font-mono text-xs transition-all",
                selectedSymbol === sym
                  ? "border-cyan-accent bg-cyan-accent/10 text-cyan-accent"
                  : "border-slate-700 text-slate-500 hover:border-slate-500"
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
            <LightweightChart candles={candles} height={380} priceLines={priceLines} />
          </TerminalPanel>
        </div>

        <div className="space-y-3 lg:col-span-2">
          <p className="font-mono text-[10px] uppercase tracking-widest text-slate-500">
            Live Trap Feed
          </p>
          {filteredTraps.length === 0 ? (
            <GlassPanel className="p-4">
              <p className="font-mono text-xs text-slate-500">No active traps detected</p>
            </GlassPanel>
          ) : (
            filteredTraps.map((trap) => (
              <GlassPanel
                key={trap.id}
                className={cn(
                  "p-4",
                  trap.strength >= 80 && "border-red-500/40 animate-pulse-glow"
                )}
                glow={trap.strength >= 80}
              >
                <div className="flex items-center justify-between">
                  <Badge
                    variant={trap.direction === "long_trap" ? "danger" : "success"}
                  >
                    {trap.direction === "long_trap" ? "LONG TRAP" : "SHORT TRAP"}
                  </Badge>
                  <span className="font-mono text-xs font-bold text-cyan-accent">
                    {trap.strength}%
                  </span>
                </div>
                <p className="mt-2 font-mono text-sm font-semibold text-slate-200">
                  @ {trap.price.toFixed(2)}
                </p>
                <p className="mt-1 font-mono text-[10px] text-slate-500">
                  {trap.description}
                </p>
                <p className="mt-2 font-mono text-[10px] text-slate-600">
                  {new Date(trap.detectedAt).toLocaleTimeString()} UTC
                </p>
              </GlassPanel>
            ))
          )}
        </div>
      </div>
    </div>
  );
}