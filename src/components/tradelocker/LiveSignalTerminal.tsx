"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import type { TradeLockerInstrument } from "@/lib/tradelocker/types";
import { resolveMarketSymbol } from "@/lib/signals/market-symbols";
import type { LiveTradeSignal } from "@/lib/signals/types";
import { SYMBOL_LABELS } from "@/lib/market-data/symbols";
import { canAccessBot } from "@/lib/tiers";
import { useSession } from "@/providers/SessionProvider";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { useToast } from "@/components/ui/Toast";
import { cn } from "@/lib/utils";
import {
  ArrowDownRight,
  ArrowUpRight,
  Copy,
  Loader2,
  Lock,
  Radio,
  Zap,
} from "lucide-react";

interface LiveSignalTerminalProps {
  accountId: string;
  accNum: string;
  balance: number;
  instruments: TradeLockerInstrument[];
  onAfterCopyTrade?: () => void;
}

function formatPrice(value: number, asset: string): string {
  const digits = asset === "BTCUSD" ? 2 : asset.includes("USD") && asset !== "BTCUSD" ? 2 : 2;
  return value.toLocaleString(undefined, {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  });
}

function formatTime(iso: string): string {
  return new Date(iso).toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function LiveSignalTerminal({
  accountId,
  accNum,
  balance,
  instruments,
  onAfterCopyTrade,
}: LiveSignalTerminalProps) {
  const { user } = useSession();
  const { toast } = useToast();
  const hasPremium = canAccessBot(user?.subscriptionTier ?? "FREE");

  const [signals, setSignals] = useState<LiveTradeSignal[]>([]);
  const [connected, setConnected] = useState(false);
  const [copyingId, setCopyingId] = useState<string | null>(null);
  const [riskPerTradePct, setRiskPerTradePct] = useState("1");
  const eventSourceRef = useRef<EventSource | null>(null);

  const instrumentByAsset = useMemo(() => {
    const map = new Map<string, TradeLockerInstrument>();
    for (const instrument of instruments) {
      const asset = resolveMarketSymbol(instrument.name);
      if (asset && !map.has(asset)) {
        map.set(asset, instrument);
      }
    }
    return map;
  }, [instruments]);

  const upsertSignal = useCallback((signal: LiveTradeSignal) => {
    setSignals((prev) => {
      const idx = prev.findIndex((s) => s.id === signal.id);
      if (idx === -1) {
        return [signal, ...prev].filter((s) => s.status === "active");
      }
      const next = [...prev];
      next[idx] = signal;
      return next.filter((s) => s.status === "active");
    });
  }, []);

  useEffect(() => {
    if (!hasPremium) return;

    const source = new EventSource("/api/signals/stream", {
      withCredentials: true,
    });
    eventSourceRef.current = source;

    source.onopen = () => setConnected(true);
    source.onerror = () => setConnected(false);

    source.onmessage = (event) => {
      try {
        const payload = JSON.parse(event.data) as {
          type: string;
          signals?: LiveTradeSignal[];
          signal?: LiveTradeSignal;
        };

        if (payload.type === "connected" && payload.signals) {
          setSignals(payload.signals);
        } else if (payload.type === "signal" && payload.signal) {
          upsertSignal(payload.signal);
          toast({
            title: `New ${payload.signal.direction} signal`,
            description: `${SYMBOL_LABELS[payload.signal.asset]} @ ${formatPrice(payload.signal.entryPrice, payload.signal.asset)}`,
          });
        } else if (payload.type === "signal_update" && payload.signal) {
          upsertSignal(payload.signal);
        }
      } catch {
        // ignore malformed SSE frames
      }
    };

    return () => {
      source.close();
      eventSourceRef.current = null;
      setConnected(false);
    };
  }, [hasPremium, toast, upsertSignal]);

  async function handleCopyTrade(signal: LiveTradeSignal) {
    const instrument = instrumentByAsset.get(signal.asset);
    if (!instrument) {
      toast({
        title: "Instrument not available",
        description: `${signal.asset} is not tradable on your connected account.`,
        variant: "error",
      });
      return;
    }

    setCopyingId(signal.id);

    try {
      const res = await fetch("/api/signals/copy-trade", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          signalId: signal.id,
          accountId,
          accNum,
          tradableInstrumentId: instrument.tradableInstrumentId,
          routeId: instrument.routeId,
          balance,
          riskPerTradePct: Number(riskPerTradePct) || 1,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast({
          title: "Copy trade failed",
          description: data.error ?? "Execution failed",
          variant: "error",
        });
        return;
      }

      toast({
        title: "Copy trade placed",
        description: `${data.side?.toUpperCase()} ${data.executedQty} lots · ${instrument.name}`,
      });
      onAfterCopyTrade?.();
    } catch {
      toast({
        title: "Network error",
        description: "Could not reach TradeLocker.",
        variant: "error",
      });
    } finally {
      setCopyingId(null);
    }
  }

  if (!hasPremium) {
    return (
      <Card className="border-cyan-500/30 bg-gradient-to-br from-cyan-500/5 to-slate-950">
        <CardContent className="flex flex-col items-center gap-4 py-10 text-center sm:flex-row sm:text-left">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-lg border border-cyan-500/40 bg-cyan-500/10">
            <Lock className="h-7 w-7 text-cyan-400" />
          </div>
          <div className="flex-1">
            <Badge variant="warning" className="mb-2">
              Premium
            </Badge>
            <h3 className="font-mono text-lg font-semibold text-slate-200">
              Live Trade Signals
            </h3>
            <p className="mt-2 text-sm text-slate-500">
              Real-time 9/21 EMA crossover alerts — you decide when to execute
              on your TradeLocker account.
            </p>
          </div>
          <Link href="/onboarding/pricing" className="shrink-0">
            <Button variant="primary">
              <Zap className="h-4 w-4" />
              Upgrade to Premium
            </Button>
          </Link>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-cyan-500/30 bg-gradient-to-br from-cyan-500/5 via-slate-950 to-slate-950">
      <CardHeader>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="flex items-center gap-2 font-mono text-sm font-semibold text-slate-200">
              <Radio className="h-4 w-4 text-cyan-400" />
              Live Trade Signals
            </h3>
            <p className="mt-1 text-xs text-slate-500">
              Quicksilver Pulse 9/21 EMA — signals only, manual 1-click execution
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {connected ? (
              <Badge variant="success" className="animate-pulse">
                Live feed
              </Badge>
            ) : (
              <Badge variant="warning">Connecting…</Badge>
            )}
            <Badge variant="default">{signals.length} active</Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-5">
        <div className="max-w-[200px]">
          <Input
            label="Risk per copy trade (%)"
            type="number"
            min="0.25"
            max="5"
            step="0.25"
            value={riskPerTradePct}
            onChange={(e) => setRiskPerTradePct(e.target.value)}
          />
        </div>

        {signals.length === 0 ? (
          <div className="rounded-lg border border-slate-800/80 bg-slate-900/40 px-6 py-12 text-center">
            <Radio className="mx-auto h-8 w-8 text-slate-600" />
            <p className="mt-4 font-mono text-sm text-slate-400">
              Scanning markets for 9/21 EMA crossovers…
            </p>
            <p className="mt-2 text-xs text-slate-600">
              New signals appear here in real time. You execute manually — no
              auto-trading.
            </p>
          </div>
        ) : (
          <div className="grid gap-4 lg:grid-cols-2">
            {signals.map((signal) => {
              const instrument = instrumentByAsset.get(signal.asset);
              const isBuy = signal.direction === "BUY";
              const isCopying = copyingId === signal.id;

              return (
                <div
                  key={signal.id}
                  className="rounded-lg border border-slate-800/80 bg-slate-900/50 p-4"
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div
                        className={cn(
                          "flex h-10 w-10 items-center justify-center rounded-lg border",
                          isBuy
                            ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-400"
                            : "border-red-500/40 bg-red-500/10 text-red-400"
                        )}
                      >
                        {isBuy ? (
                          <ArrowUpRight className="h-5 w-5" />
                        ) : (
                          <ArrowDownRight className="h-5 w-5" />
                        )}
                      </div>
                      <div>
                        <p className="font-mono text-sm font-semibold text-slate-200">
                          {SYMBOL_LABELS[signal.asset]}
                        </p>
                        <p className="font-mono text-[10px] uppercase tracking-widest text-slate-500">
                          {signal.direction} · {formatTime(signal.timestamp)}
                        </p>
                      </div>
                    </div>
                    <Badge variant="success">{signal.status}</Badge>
                  </div>

                  <div className="mt-4 grid grid-cols-3 gap-3 font-mono text-xs">
                    <div>
                      <p className="text-slate-600">Entry</p>
                      <p className="mt-1 text-cyan-400">
                        {formatPrice(signal.entryPrice, signal.asset)}
                      </p>
                    </div>
                    <div>
                      <p className="text-slate-600">Stop</p>
                      <p className="mt-1 text-red-400">
                        {formatPrice(signal.stopLoss, signal.asset)}
                      </p>
                    </div>
                    <div>
                      <p className="text-slate-600">Target</p>
                      <p className="mt-1 text-emerald-400">
                        {formatPrice(signal.takeProfit, signal.asset)}
                      </p>
                    </div>
                  </div>

                  {signal.reason && (
                    <p className="mt-3 text-xs text-slate-500">{signal.reason}</p>
                  )}

                  <div className="mt-4 flex flex-wrap items-center gap-2">
                    <Button
                      variant={isBuy ? "secondary" : "danger"}
                      size="sm"
                      disabled={!instrument || isCopying}
                      onClick={() => void handleCopyTrade(signal)}
                    >
                      {isCopying ? (
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      ) : (
                        <Copy className="h-3.5 w-3.5" />
                      )}
                      1-Click Copy Trade
                    </Button>
                    {!instrument && (
                      <span className="font-mono text-[10px] text-amber-400">
                        {signal.asset} not on your account
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}