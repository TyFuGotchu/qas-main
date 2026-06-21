"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { Badge } from "@/components/ui/Badge";
import { TerminalPanel } from "@/components/ui/TerminalPanel";
import Button from "@/components/ui/Button";
import type { MarketSessions } from "@/lib/market-data/types";
import { cn } from "@/lib/utils";
import { Volume2, VolumeX } from "lucide-react";

const SESSION_COLORS = {
  Asia: "from-amber-500/30 to-transparent",
  London: "from-cyan-accent/40 to-transparent",
  NewYork: "from-emerald-500/30 to-transparent",
};

export function SessionVolatilityRadar() {
  const [sessions, setSessions] = useState<MarketSessions | null>(null);
  const [audioEnabled, setAudioEnabled] = useState(false);
  const alertedRef = useRef(false);
  const audioCtxRef = useRef<AudioContext | null>(null);

  const playAlert = useCallback(() => {
    if (!audioEnabled) return;
    try {
      if (!audioCtxRef.current) {
        audioCtxRef.current = new AudioContext();
      }
      const ctx = audioCtxRef.current;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.frequency.value = 880;
      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.4);
    } catch {
      // Audio not available
    }
  }, [audioEnabled]);

  useEffect(() => {
    async function load() {
      const res = await fetch("/api/market/sessions");
      const data: MarketSessions = await res.json();
      setSessions(data);

      if (data.overlapActive && data.compositeAtr >= 45 && !alertedRef.current) {
        playAlert();
        alertedRef.current = true;
      }
      if (!data.overlapActive) {
        alertedRef.current = false;
      }
    }
    load();
    const interval = setInterval(load, 30_000);
    return () => clearInterval(interval);
  }, [playAlert]);

  const utcNow = new Date();
  const clockAngle = ((utcNow.getUTCHours() + utcNow.getUTCMinutes() / 60) / 24) * 360;

  return (
    <div className="space-y-6">
      <GlassPanel
        className={cn(
          "p-6 transition-all",
          sessions?.overlapActive && "border-glow-cyan animate-pulse-glow"
        )}
        glow={sessions?.overlapActive}
      >
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h3 className="font-mono text-lg font-bold text-slate-100">
              Session Volatility Radar
            </h3>
            <p className="font-mono text-xs text-slate-500">
              UTC {utcNow.toISOString().slice(11, 19)} · Composite ATR{" "}
              {sessions?.compositeAtr ?? "—"}
            </p>
          </div>
          <div className="flex items-center gap-3">
            {sessions?.overlapActive && (
              <Badge variant="success">OVERLAP ACTIVE</Badge>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setAudioEnabled((v) => !v)}
            >
              {audioEnabled ? (
                <Volume2 className="h-4 w-4 text-cyan-accent" />
              ) : (
                <VolumeX className="h-4 w-4 text-slate-500" />
              )}
            </Button>
          </div>
        </div>
      </GlassPanel>

      <div className="grid gap-6 lg:grid-cols-2">
        <TerminalPanel title="Global Session Clock" status="online">
          <div className="relative mx-auto aspect-square max-w-sm">
            <div className="absolute inset-0 rounded-full border border-cyan-accent/20 bg-slate-950" />
            <div
              className="absolute left-1/2 top-1/2 h-[45%] w-0.5 origin-bottom -translate-x-1/2 bg-cyan-accent shadow-[0_0_12px_#00E5FF]"
              style={{ transform: `translateX(-50%) rotate(${clockAngle}deg)` }}
            />
            <div className="absolute left-1/2 top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-accent" />

            {(["Asia", "London", "NewYork"] as const).map((name, i) => {
              const angle = i * 120 - 90;
              const rad = (angle * Math.PI) / 180;
              const x = 50 + Math.cos(rad) * 38;
              const y = 50 + Math.sin(rad) * 38;
              const session = sessions?.sessions.find((s) => s.name === name);
              return (
                <div
                  key={name}
                  className={cn(
                    "absolute flex flex-col items-center rounded-lg border px-2 py-1 font-mono text-[10px]",
                    session?.open
                      ? "border-cyan-accent/50 bg-cyan-accent/10 text-cyan-accent"
                      : "border-slate-700 text-slate-600"
                  )}
                  style={{
                    left: `${x}%`,
                    top: `${y}%`,
                    transform: "translate(-50%, -50%)",
                  }}
                >
                  <span className="font-bold">{name}</span>
                  <span>ATR {session?.atr ?? "—"}</span>
                </div>
              );
            })}
          </div>

          {sessions?.overlapLabel && (
            <p className="mt-4 text-center font-mono text-sm text-cyan-accent terminal-glow">
              {sessions.overlapLabel} overlap — volatility expansion detected
            </p>
          )}
        </TerminalPanel>

        <TerminalPanel title="ATR Volatility Bands" status="warning">
          <div className="space-y-4">
            {sessions?.sessions.map((s) => (
              <div key={s.name}>
                <div className="mb-1 flex justify-between font-mono text-xs">
                  <span className="text-slate-400">{s.name}</span>
                  <span className={s.open ? "text-cyan-accent" : "text-slate-600"}>
                    {s.open ? "OPEN" : "CLOSED"} · ATR {s.atr}
                  </span>
                </div>
                <div className="h-3 overflow-hidden rounded-full bg-slate-800">
                  <div
                    className={cn(
                      "h-full rounded-full bg-gradient-to-r transition-all duration-700",
                      SESSION_COLORS[s.name],
                      s.open && "shadow-[0_0_12px_rgba(0,229,255,0.5)]"
                    )}
                    style={{ width: `${Math.min(100, (s.atr / 60) * 100)}%` }}
                  />
                </div>
              </div>
            ))}

            <GlassPanel className="mt-4 p-4">
              <p className="font-mono text-[10px] uppercase text-slate-500">
                Composite Volatility Index
              </p>
              <p className="font-mono text-3xl font-bold text-cyan-accent">
                {sessions?.compositeAtr ?? "—"}
              </p>
              <p className="mt-1 font-mono text-[10px] text-slate-500">
                Threshold for audio alert: ATR ≥ 45 during session overlap
              </p>
            </GlassPanel>
          </div>
        </TerminalPanel>
      </div>
    </div>
  );
}