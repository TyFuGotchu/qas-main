"use client";

import { useEffect, useState } from "react";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { Badge } from "@/components/ui/Badge";
import { TerminalPanel } from "@/components/ui/TerminalPanel";
import type { MacroEvent } from "@/lib/market-data/types";
import { cn } from "@/lib/utils";

function impactColor(score: number) {
  if (score >= 60) return "text-emerald-400";
  if (score <= -40) return "text-red-400";
  if (score >= 20) return "text-cyan-accent";
  return "text-amber-400";
}

function scoreBar(score: number) {
  const pct = ((score + 100) / 200) * 100;
  return (
    <div className="relative h-2 flex-1 overflow-hidden rounded-full bg-slate-800">
      <div
        className={cn(
          "absolute left-0 top-0 h-full rounded-full transition-all",
          score >= 0 ? "bg-emerald-500/80" : "bg-red-500/80"
        )}
        style={{ width: `${pct}%` }}
      />
      <div className="absolute left-1/2 top-0 h-full w-px bg-slate-600" />
    </div>
  );
}

export function EventHorizon() {
  const [events, setEvents] = useState<MacroEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [source, setSource] = useState<"live" | "mock" | "hybrid">("mock");

  useEffect(() => {
    async function load() {
      const res = await fetch("/api/market/calendar");
      const data = await res.json();
      setEvents(data.events ?? []);
      setSource(data.source ?? "mock");
      setLoading(false);
    }
    load();
    const interval = setInterval(load, 60_000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-6">
      <GlassPanel className="p-6" glow>
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-mono text-lg font-bold text-slate-100">
              Event Horizon Matrix
            </h3>
            <p className="mt-1 font-mono text-xs text-slate-500">
              Volatility Impact Score (−100 to +100) · AI sentiment derived
            </p>
          </div>
          <Badge variant={source === "mock" ? "warning" : "success"}>
            {source === "mock" ? "MOCK FEED" : "LIVE FEED"}
          </Badge>
        </div>
      </GlassPanel>

      <TerminalPanel title="Macroeconomic Calendar — Sentiment Engine" status="online">
        {loading ? (
          <p className="font-mono text-sm text-slate-500">Scanning global events...</p>
        ) : (
          <div className="space-y-4">
            {events.map((event) => (
              <GlassPanel key={event.id} className="p-4">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-sm font-semibold text-slate-200">
                        {event.title}
                      </span>
                      <Badge
                        variant={
                          event.impact === "high"
                            ? "danger"
                            : event.impact === "medium"
                            ? "warning"
                            : "default"
                        }
                      >
                        {event.impact.toUpperCase()}
                      </Badge>
                      <span className="font-mono text-[10px] text-slate-600">
                        {event.currency}
                      </span>
                    </div>
                    <p className="mt-1 font-mono text-[10px] text-slate-500">
                      {new Date(event.scheduledAt).toUTCString()}
                    </p>
                  </div>
                  <span
                    className={cn(
                      "font-mono text-2xl font-bold",
                      impactColor(event.volatilityImpactScore)
                    )}
                  >
                    {event.volatilityImpactScore > 0 ? "+" : ""}
                    {event.volatilityImpactScore}
                  </span>
                </div>

                <div className="mt-4 flex items-center gap-3">
                  {scoreBar(event.volatilityImpactScore)}
                </div>

                <div className="mt-4 grid gap-3 sm:grid-cols-3">
                  <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/5 p-3">
                    <p className="font-mono text-[10px] uppercase text-slate-500">
                      Spike Probability
                    </p>
                    <p className="font-mono text-lg font-bold text-emerald-400">
                      {(event.spikeProbability * 100).toFixed(0)}%
                    </p>
                  </div>
                  <div className="rounded-lg border border-red-500/20 bg-red-500/5 p-3">
                    <p className="font-mono text-[10px] uppercase text-slate-500">
                      Flush Probability
                    </p>
                    <p className="font-mono text-lg font-bold text-red-400">
                      {(event.flushProbability * 100).toFixed(0)}%
                    </p>
                  </div>
                  <div className="rounded-lg border border-cyan-accent/20 bg-cyan-accent/5 p-3">
                    <p className="font-mono text-[10px] uppercase text-slate-500">
                      Sentiment Bias
                    </p>
                    <p className="font-mono text-lg font-bold capitalize text-cyan-accent">
                      {event.sentiment}
                    </p>
                  </div>
                </div>
              </GlassPanel>
            ))}
          </div>
        )}
      </TerminalPanel>
    </div>
  );
}