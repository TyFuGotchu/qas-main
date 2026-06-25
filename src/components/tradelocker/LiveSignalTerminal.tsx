"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { resolveMarketSymbol } from "@/lib/signals/market-symbols";
import type { TradeLockerInstrument } from "@/lib/tradelocker/types";
import type { AssetLiveState, LiveTradeSignal } from "@/lib/signals/types";
import { MARKET_SYMBOLS, SYMBOL_LABELS } from "@/lib/market-data/symbols";
import type { MarketSymbol } from "@/lib/market-data/types";
import { canAccessBot } from "@/lib/tiers";
import { useSession } from "@/providers/SessionProvider";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import Select from "@/components/ui/Select";
import { useToast } from "@/components/ui/Toast";
import { cn } from "@/lib/utils";
import {
  Activity,
  ArrowDownRight,
  ArrowUpRight,
  Lock,
  Radio,
  Target,
  TrendingDown,
  TrendingUp,
  Zap,
} from "lucide-react";

interface LiveSignalTerminalProps {
  instruments?: TradeLockerInstrument[];
}

const DEFAULT_STATE: AssetLiveState = {
  asset: "XAUUSD",
  timestamp: new Date().toISOString(),
  price: 0,
  changePercent: 0,
  confluenceScore: 0,
  bias: "NEUTRAL",
  trend: "ranging",
  setupStatus: "scanning",
  ema21: 0,
  ema55: 0,
  rsi: 50,
  atr: 0,
  support: 0,
  resistance: 0,
  reasons: ["Connecting to live feed…"],
};

function formatPrice(value: number, asset: string): string {
  const digits = asset === "BTCUSD" ? 2 : 2;
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

function setupBadgeVariant(
  status: AssetLiveState["setupStatus"]
): "default" | "success" | "warning" | "danger" {
  switch (status) {
    case "triggered":
      return "success";
    case "ready":
      return "warning";
    case "forming":
      return "default";
    default:
      return "default";
  }
}

export function LiveSignalTerminal({
  instruments = [],
}: LiveSignalTerminalProps) {
  const { user } = useSession();
  const { toast } = useToast();
  const hasPremium = canAccessBot(user?.subscriptionTier ?? "FREE");

  const tradableAssets = useMemo(() => {
    const fromAccount = new Set<MarketSymbol>();
    for (const instrument of instruments) {
      const asset = resolveMarketSymbol(instrument.name);
      if (asset) fromAccount.add(asset);
    }
    if (fromAccount.size > 0) {
      return MARKET_SYMBOLS.filter((s) => fromAccount.has(s));
    }
    return [...MARKET_SYMBOLS];
  }, [instruments]);

  const [selectedAsset, setSelectedAsset] = useState<MarketSymbol>("XAUUSD");
  const [liveState, setLiveState] = useState<AssetLiveState>(DEFAULT_STATE);
  const [signals, setSignals] = useState<LiveTradeSignal[]>([]);
  const [connected, setConnected] = useState(false);
  const eventSourceRef = useRef<EventSource | null>(null);

  useEffect(() => {
    if (tradableAssets.length > 0 && !tradableAssets.includes(selectedAsset)) {
      setSelectedAsset(tradableAssets[0] ?? "XAUUSD");
    }
  }, [tradableAssets, selectedAsset]);

  const assetOptions = useMemo(
    () =>
      tradableAssets.map((asset) => ({
        value: asset,
        label: `${SYMBOL_LABELS[asset]} (${asset})`,
      })),
    [tradableAssets]
  );

  const upsertSignal = useCallback((signal: LiveTradeSignal) => {
    if (signal.asset !== selectedAsset) return;
    setSignals((prev) => {
      const idx = prev.findIndex((s) => s.id === signal.id);
      if (idx === -1) {
        return [signal, ...prev].filter((s) => s.status === "active");
      }
      const next = [...prev];
      next[idx] = signal;
      return next.filter((s) => s.status === "active");
    });
  }, [selectedAsset]);

  const refreshMarketState = useCallback(async (asset: MarketSymbol) => {
    try {
      const res = await fetch(`/api/signals/market-state?asset=${asset}`, {
        credentials: "include",
      });
      if (!res.ok) return;
      const data = await res.json();
      if (data.state) setLiveState(data.state);
    } catch {
      // ignore polling errors
    }
  }, []);

  useEffect(() => {
    if (!hasPremium) return;

    setLiveState({ ...DEFAULT_STATE, asset: selectedAsset });
    setSignals([]);

    eventSourceRef.current?.close();

    const source = new EventSource(
      `/api/signals/stream?asset=${encodeURIComponent(selectedAsset)}`,
      { withCredentials: true }
    );
    eventSourceRef.current = source;

    source.onopen = () => setConnected(true);
    source.onerror = () => setConnected(false);

    source.onmessage = (event) => {
      try {
        const payload = JSON.parse(event.data) as {
          type: string;
          signals?: LiveTradeSignal[];
          signal?: LiveTradeSignal;
          state?: AssetLiveState;
          marketState?: AssetLiveState | null;
        };

        if (payload.type === "connected") {
          if (payload.signals) setSignals(payload.signals);
          if (payload.marketState) setLiveState(payload.marketState);
        } else if (payload.type === "market_state" && payload.state) {
          setLiveState(payload.state);
        } else if (payload.type === "signal" && payload.signal) {
          upsertSignal(payload.signal);
          toast({
            title: `New ${payload.signal.direction} signal`,
            description: `${SYMBOL_LABELS[payload.signal.asset]} · Confluence ${payload.signal.confluenceScore ?? "—"}`,
          });
        } else if (payload.type === "signal_update" && payload.signal) {
          upsertSignal(payload.signal);
        }
      } catch {
        // ignore malformed frames
      }
    };

    void refreshMarketState(selectedAsset);

    return () => {
      source.close();
      eventSourceRef.current = null;
      setConnected(false);
    };
  }, [hasPremium, selectedAsset, toast, upsertSignal, refreshMarketState]);

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
              Quicksilver Confluence Engine — multi-factor setup alerts for your
              watchlist. Execute on your broker when you are ready.
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

  const priceUp = liveState.changePercent >= 0;

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
              Quicksilver Confluence — EMA 21/55 · RSI · structure · ATR stops
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
            <Badge variant="default">{signals.length} active signals</Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="max-w-xs">
          <Select
            label="Signal asset"
            value={selectedAsset}
            onChange={(e) => setSelectedAsset(e.target.value as MarketSymbol)}
            options={assetOptions}
          />
        </div>

        {/* Live asset panel — always visible */}
        <div className="rounded-xl border border-cyan-500/20 bg-slate-900/60 p-5">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-widest text-slate-500">
                Live · {SYMBOL_LABELS[selectedAsset]}
              </p>
              <p
                className={cn(
                  "mt-2 font-mono text-3xl font-bold tabular-nums",
                  priceUp ? "text-emerald-400" : "text-red-400"
                )}
              >
                {liveState.price > 0
                  ? formatPrice(liveState.price, selectedAsset)
                  : "—"}
              </p>
              <p
                className={cn(
                  "mt-1 font-mono text-sm",
                  priceUp ? "text-emerald-400/80" : "text-red-400/80"
                )}
              >
                {liveState.price > 0
                  ? `${priceUp ? "+" : ""}${liveState.changePercent.toFixed(3)}%`
                  : "Loading price…"}
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              <Badge variant={setupBadgeVariant(liveState.setupStatus)}>
                {liveState.setupStatus}
              </Badge>
              <Badge
                variant={
                  liveState.bias === "BUY"
                    ? "success"
                    : liveState.bias === "SELL"
                      ? "danger"
                      : "default"
                }
              >
                {liveState.bias} bias
              </Badge>
              <Badge variant="default">{liveState.trend}</Badge>
            </div>
          </div>

          <div className="mt-5">
            <div className="flex items-center justify-between font-mono text-[10px] uppercase tracking-widest text-slate-500">
              <span>Confluence score</span>
              <span className="text-cyan-400">{liveState.confluenceScore}/100</span>
            </div>
            <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-800">
              <div
                className={cn(
                  "h-full rounded-full transition-all duration-500",
                  liveState.confluenceScore >= 78
                    ? "bg-emerald-500"
                    : liveState.confluenceScore >= 55
                      ? "bg-amber-500"
                      : "bg-cyan-500/60"
                )}
                style={{ width: `${Math.min(100, liveState.confluenceScore)}%` }}
              />
            </div>
          </div>

          <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4 font-mono text-xs">
            <div>
              <p className="text-slate-600">EMA 21</p>
              <p className="mt-1 text-slate-300">
                {liveState.ema21 > 0 ? formatPrice(liveState.ema21, selectedAsset) : "—"}
              </p>
            </div>
            <div>
              <p className="text-slate-600">EMA 55</p>
              <p className="mt-1 text-slate-300">
                {liveState.ema55 > 0 ? formatPrice(liveState.ema55, selectedAsset) : "—"}
              </p>
            </div>
            <div>
              <p className="text-slate-600">RSI</p>
              <p className="mt-1 text-slate-300">{liveState.rsi}</p>
            </div>
            <div>
              <p className="text-slate-600">ATR</p>
              <p className="mt-1 text-slate-300">
                {liveState.atr > 0 ? formatPrice(liveState.atr, selectedAsset) : "—"}
              </p>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-3 font-mono text-xs">
            <div className="flex items-center gap-2 rounded border border-slate-800/80 px-3 py-2">
              <TrendingDown className="h-3.5 w-3.5 text-red-400" />
              <div>
                <p className="text-slate-600">Support</p>
                <p className="text-red-400">
                  {liveState.support > 0
                    ? formatPrice(liveState.support, selectedAsset)
                    : "—"}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 rounded border border-slate-800/80 px-3 py-2">
              <TrendingUp className="h-3.5 w-3.5 text-emerald-400" />
              <div>
                <p className="text-slate-600">Resistance</p>
                <p className="text-emerald-400">
                  {liveState.resistance > 0
                    ? formatPrice(liveState.resistance, selectedAsset)
                    : "—"}
                </p>
              </div>
            </div>
          </div>

          {liveState.reasons.length > 0 && (
            <ul className="mt-4 space-y-1">
              {liveState.reasons.map((reason) => (
                <li
                  key={reason}
                  className="flex items-start gap-2 font-mono text-[11px] text-slate-500"
                >
                  <Activity className="mt-0.5 h-3 w-3 shrink-0 text-cyan-500/60" />
                  {reason}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Active signals for selected asset */}
        <div>
          <h4 className="mb-3 flex items-center gap-2 font-mono text-xs font-semibold uppercase tracking-widest text-slate-500">
            <Target className="h-3.5 w-3.5 text-cyan-400" />
            Active signals · {SYMBOL_LABELS[selectedAsset]}
          </h4>

          {signals.length === 0 ? (
            <div className="rounded-lg border border-slate-800/80 bg-slate-900/40 px-6 py-8 text-center">
              <p className="font-mono text-sm text-slate-400">
                No triggered signal yet — watching live confluence on{" "}
                {SYMBOL_LABELS[selectedAsset]}.
              </p>
              <p className="mt-2 text-xs text-slate-600">
                Signals fire when score ≥ 78 with trend, structure, RSI, and EMA
                pullback alignment.
              </p>
            </div>
          ) : (
            <div className="grid gap-4 lg:grid-cols-2">
              {signals.map((signal) => {
                const isBuy = signal.direction === "BUY";

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
                      <div className="flex flex-col items-end gap-1">
                        <Badge variant="success">{signal.status}</Badge>
                        {signal.confluenceScore != null && (
                          <span className="font-mono text-[10px] text-cyan-400">
                            Score {signal.confluenceScore}
                          </span>
                        )}
                      </div>
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
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}