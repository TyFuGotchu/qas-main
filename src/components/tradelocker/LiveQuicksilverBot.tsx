"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import type { TradeLockerInstrument } from "@/lib/tradelocker/types";
import {
  defaultPipValue,
  defaultStopPips,
  resolveMarketSymbol,
} from "@/lib/tradelocker/live-bot";
import { SYMBOL_LABELS } from "@/lib/market-data/symbols";
import { canAccessBot } from "@/lib/tiers";
import { useSession } from "@/providers/SessionProvider";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import { useToast } from "@/components/ui/Toast";
import { cn } from "@/lib/utils";
import {
  AlertTriangle,
  Bot,
  Loader2,
  Lock,
  Pause,
  Play,
  RotateCcw,
  Zap,
} from "lucide-react";

interface LiveQuicksilverBotProps {
  accountId: string;
  accNum: string;
  balance: number;
  instruments: TradeLockerInstrument[];
  instrumentsLoading?: boolean;
  onAfterTick?: () => void;
}

interface BotLogEntry {
  id: string;
  at: string;
  action: string;
  message: string;
  executed?: boolean;
  error?: string | null;
}

interface TickResponse {
  action: string;
  message: string;
  executed?: boolean;
  executionError?: string | null;
  tradesThisSession?: number;
  riskHalted?: boolean;
  signal?: { direction: string; reason: string } | null;
  suggestedLots?: number;
  balance?: number;
  error?: string;
}

const MIN_SCAN_SECONDS = 30;
const MAX_SCAN_SECONDS = 300;
const DEFAULT_SCAN_SECONDS = 60;

function formatTime(iso: string): string {
  return new Date(iso).toLocaleTimeString(undefined, {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}

export function LiveQuicksilverBot({
  accountId,
  accNum,
  balance,
  instruments,
  instrumentsLoading,
  onAfterTick,
}: LiveQuicksilverBotProps) {
  const { user } = useSession();
  const { toast } = useToast();
  const hasPremium = canAccessBot(user?.subscriptionTier ?? "FREE");

  const [instrumentKey, setInstrumentKey] = useState("");
  const [riskPerTradePct, setRiskPerTradePct] = useState("1");
  const [stopLossPips, setStopLossPips] = useState("20");
  const [pipValuePerLot, setPipValuePerLot] = useState("10");
  const [dailyLossLimitPct, setDailyLossLimitPct] = useState("5");
  const [maxDrawdownPct, setMaxDrawdownPct] = useState("10");
  const [maxOpenPositions, setMaxOpenPositions] = useState("3");
  const [maxTradesPerSession, setMaxTradesPerSession] = useState("10");
  const [candleInterval, setCandleInterval] = useState<"5min" | "15min">("5min");
  const [scanSeconds, setScanSeconds] = useState(String(DEFAULT_SCAN_SECONDS));
  const [disclaimerAccepted, setDisclaimerAccepted] = useState(false);
  const [running, setRunning] = useState(false);
  const [ticking, setTicking] = useState(false);
  const [tradesThisSession, setTradesThisSession] = useState(0);
  const [log, setLog] = useState<BotLogEntry[]>([]);

  const tradesRef = useRef(0);
  const runningRef = useRef(false);
  const runTickRef = useRef<(execute: boolean) => Promise<void>>(async () => {});

  const instrumentOptions = useMemo(
    () =>
      instruments.map((instrument) => ({
        value: `${instrument.tradableInstrumentId}:${instrument.routeId}`,
        label: instrument.name,
      })),
    [instruments]
  );

  const selectedInstrument = useMemo(() => {
    if (!instrumentKey) return null;
    const [tradableInstrumentId, routeId] = instrumentKey.split(":").map(Number);
    if (!Number.isFinite(tradableInstrumentId) || !Number.isFinite(routeId)) {
      return null;
    }
    return instruments.find(
      (i) =>
        i.tradableInstrumentId === tradableInstrumentId && i.routeId === routeId
    );
  }, [instrumentKey, instruments]);

  const marketSymbol = selectedInstrument
    ? resolveMarketSymbol(selectedInstrument.name)
    : null;

  useEffect(() => {
    if (instrumentOptions.length > 0 && !instrumentKey) {
      setInstrumentKey(instrumentOptions[0]?.value ?? "");
    }
  }, [instrumentOptions, instrumentKey]);

  useEffect(() => {
    if (!marketSymbol) return;
    setStopLossPips(String(defaultStopPips(marketSymbol)));
    setPipValuePerLot(String(defaultPipValue(marketSymbol)));
  }, [marketSymbol]);

  useEffect(() => {
    tradesRef.current = tradesThisSession;
  }, [tradesThisSession]);

  useEffect(() => {
    runningRef.current = running;
  }, [running]);

  const pushLog = useCallback((entry: Omit<BotLogEntry, "id" | "at">) => {
    setLog((prev) => [
      {
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        at: new Date().toISOString(),
        ...entry,
      },
      ...prev.slice(0, 49),
    ]);
  }, []);

  const runTick = useCallback(
    async (execute: boolean) => {
      if (!selectedInstrument) return;

      setTicking(true);
      try {
        const res = await fetch("/api/tradelocker/bot/tick", {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            accountId,
            accNum,
            instrumentName: selectedInstrument.name,
            tradableInstrumentId: selectedInstrument.tradableInstrumentId,
            routeId: selectedInstrument.routeId,
            riskPerTradePct: Number(riskPerTradePct) || 1,
            stopLossPips: Number(stopLossPips) || 20,
            pipValuePerLot: Number(pipValuePerLot) || 10,
            dailyLossLimitPct: Number(dailyLossLimitPct) || 5,
            maxDrawdownPct: Number(maxDrawdownPct) || 10,
            maxOpenPositions: Number(maxOpenPositions) || 3,
            maxTradesPerSession: Number(maxTradesPerSession) || 10,
            tradesThisSession: tradesRef.current,
            candleInterval,
            execute,
          }),
        });

        const data = (await res.json()) as TickResponse;

        if (!res.ok) {
          const message = data.error ?? "Bot tick failed";
          pushLog({
            action: "error",
            message,
            error: message,
          });
          if (res.status === 403) {
            setRunning(false);
          }
          return;
        }

        if (typeof data.tradesThisSession === "number") {
          setTradesThisSession(data.tradesThisSession);
          tradesRef.current = data.tradesThisSession;
        }

        pushLog({
          action: data.action,
          message: data.message,
          executed: data.executed,
          error: data.executionError,
        });

        if (data.executed) {
          toast({
            title: `Bot ${data.action}`,
            description: data.message,
          });
          onAfterTick?.();
        }

        if (data.riskHalted) {
          setRunning(false);
          toast({
            title: "Bot halted",
            description: data.message,
            variant: "error",
          });
        }
      } catch {
        pushLog({
          action: "error",
          message: "Network error during bot tick",
          error: "Network error",
        });
      } finally {
        setTicking(false);
      }
    },
    [
      accountId,
      accNum,
      selectedInstrument,
      riskPerTradePct,
      stopLossPips,
      pipValuePerLot,
      dailyLossLimitPct,
      maxDrawdownPct,
      maxOpenPositions,
      maxTradesPerSession,
      candleInterval,
      pushLog,
      toast,
      onAfterTick,
    ]
  );

  runTickRef.current = runTick;

  useEffect(() => {
    if (!running) return;

    const seconds = Math.min(
      MAX_SCAN_SECONDS,
      Math.max(MIN_SCAN_SECONDS, Number(scanSeconds) || DEFAULT_SCAN_SECONDS)
    );

    const intervalId = window.setInterval(() => {
      if (runningRef.current) {
        void runTickRef.current(true);
      }
    }, seconds * 1000);

    return () => window.clearInterval(intervalId);
  }, [running, scanSeconds]);

  useEffect(() => {
    setRunning(false);
    setTradesThisSession(0);
    tradesRef.current = 0;
  }, [accountId, accNum]);

  function handleStart() {
    if (!hasPremium) return;
    if (!disclaimerAccepted) {
      toast({
        title: "Accept risk disclaimer",
        description: "Confirm you understand live trading risks before starting.",
        variant: "error",
      });
      return;
    }
    if (!selectedInstrument) {
      toast({
        title: "Select an asset",
        variant: "error",
      });
      return;
    }
    setRunning(true);
    pushLog({
      action: "start",
      message: `Quicksilver Pulse started on ${selectedInstrument.name} — risk ${riskPerTradePct}% of $${balance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} balance`,
    });
    void runTick(true);
  }

  function handleStop() {
    setRunning(false);
    pushLog({
      action: "stop",
      message: "Bot stopped — no further automated orders",
    });
  }

  function handleResetSession() {
    setTradesThisSession(0);
    tradesRef.current = 0;
    pushLog({
      action: "reset",
      message: "Session trade counter reset",
    });
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
              Quicksilver Pulse Live Bot
            </h3>
            <p className="mt-2 text-sm text-slate-500">
              Automate entries and exits on your connected TradeLocker account.
              Position size is calculated from your live balance and the risk %
              you choose.
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
              <Bot className="h-4 w-4 text-cyan-400" />
              Quicksilver Pulse Live Bot
            </h3>
            <p className="mt-1 text-xs text-slate-500">
              EMA 9/21 crossover strategy · account-sized risk · runs while this
              page is open
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {running ? (
              <Badge variant="success" className="animate-pulse">
                Live
              </Badge>
            ) : (
              <Badge variant="warning">Stopped</Badge>
            )}
            <Badge variant="default">
              {tradesThisSession} / {maxTradesPerSession} session trades
            </Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {instrumentsLoading ? (
          <div className="flex items-center gap-2 py-2 font-mono text-xs text-slate-500">
            <Loader2 className="h-4 w-4 animate-spin" />
            Loading tradable assets…
          </div>
        ) : instrumentOptions.length === 0 ? (
          <p className="font-mono text-sm text-slate-500">
            No tradable instruments on this account.
          </p>
        ) : (
          <>
            <div className="grid gap-4 lg:grid-cols-2">
              <Select
                label="Asset to trade"
                value={instrumentKey}
                onChange={(e) => setInstrumentKey(e.target.value)}
                options={instrumentOptions}
                disabled={running}
              />
              <Select
                label="Candle interval"
                value={candleInterval}
                onChange={(e) =>
                  setCandleInterval(
                    e.target.value === "15min" ? "15min" : "5min"
                  )
                }
                options={[
                  { value: "5min", label: "5 minute" },
                  { value: "15min", label: "15 minute" },
                ]}
                disabled={running}
              />
            </div>

            {selectedInstrument && (
              <p className="font-mono text-xs text-slate-500">
                {marketSymbol ? (
                  <>
                    Market data:{" "}
                    <span className="text-cyan-400">
                      {SYMBOL_LABELS[marketSymbol]}
                    </span>
                  </>
                ) : (
                  <span className="text-amber-400">
                    No mapped market data for this symbol — bot will wait until
                    data is available
                  </span>
                )}
              </p>
            )}

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <Input
                label="Risk per trade (%)"
                type="number"
                min="0.25"
                max="5"
                step="0.25"
                value={riskPerTradePct}
                onChange={(e) => setRiskPerTradePct(e.target.value)}
                disabled={running}
              />
              <Input
                label="Stop loss (pips)"
                type="number"
                min="1"
                step="1"
                value={stopLossPips}
                onChange={(e) => setStopLossPips(e.target.value)}
                disabled={running}
              />
              <Input
                label="$ per pip (1 lot)"
                type="number"
                min="0.1"
                step="0.1"
                value={pipValuePerLot}
                onChange={(e) => setPipValuePerLot(e.target.value)}
                disabled={running}
              />
              <Input
                label="Scan interval (sec)"
                type="number"
                min={String(MIN_SCAN_SECONDS)}
                max={String(MAX_SCAN_SECONDS)}
                step="15"
                value={scanSeconds}
                onChange={(e) => setScanSeconds(e.target.value)}
                disabled={running}
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <Input
                label="Daily loss limit (%)"
                type="number"
                min="1"
                max="20"
                step="0.5"
                value={dailyLossLimitPct}
                onChange={(e) => setDailyLossLimitPct(e.target.value)}
                disabled={running}
              />
              <Input
                label="Max drawdown (%)"
                type="number"
                min="2"
                max="30"
                step="0.5"
                value={maxDrawdownPct}
                onChange={(e) => setMaxDrawdownPct(e.target.value)}
                disabled={running}
              />
              <Input
                label="Max open positions"
                type="number"
                min="1"
                max="10"
                step="1"
                value={maxOpenPositions}
                onChange={(e) => setMaxOpenPositions(e.target.value)}
                disabled={running}
              />
              <Input
                label="Max trades / session"
                type="number"
                min="1"
                max="50"
                step="1"
                value={maxTradesPerSession}
                onChange={(e) => setMaxTradesPerSession(e.target.value)}
                disabled={running}
              />
            </div>

            <div className="rounded-lg border border-amber-500/30 bg-amber-500/5 px-4 py-3">
              <label className="flex cursor-pointer items-start gap-3">
                <input
                  type="checkbox"
                  className="mt-1 h-4 w-4 rounded border-slate-600 bg-slate-900 text-cyan-500 focus:ring-cyan-500/40"
                  checked={disclaimerAccepted}
                  onChange={(e) => setDisclaimerAccepted(e.target.checked)}
                  disabled={running}
                />
                <span className="text-xs leading-relaxed text-slate-400">
                  <AlertTriangle className="mr-1 inline h-3.5 w-3.5 text-amber-400" />
                  I understand this bot places real orders on my TradeLocker
                  account. Past performance does not guarantee future results. I
                  accept full responsibility for losses. The bot only runs while
                  this page stays open.
                </span>
              </label>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              {!running ? (
                <Button
                  variant="primary"
                  disabled={
                    ticking ||
                    !selectedInstrument ||
                    !disclaimerAccepted ||
                    instrumentsLoading
                  }
                  onClick={handleStart}
                >
                  {ticking ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Play className="h-4 w-4" />
                  )}
                  Start live bot
                </Button>
              ) : (
                <Button variant="danger" disabled={ticking} onClick={handleStop}>
                  {ticking ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Pause className="h-4 w-4" />
                  )}
                  Stop bot
                </Button>
              )}
              <Button
                variant="ghost"
                size="sm"
                disabled={running}
                onClick={handleResetSession}
              >
                <RotateCcw className="h-3.5 w-3.5" />
                Reset session trades
              </Button>
              <Button
                variant="ghost"
                size="sm"
                disabled={running || ticking || !selectedInstrument}
                onClick={() => void runTick(false)}
              >
                Preview signal
              </Button>
            </div>

            {log.length > 0 && (
              <div className="rounded-lg border border-slate-800/80 bg-slate-900/40">
                <p className="border-b border-slate-800/60 px-4 py-2 font-mono text-[10px] uppercase tracking-widest text-slate-500">
                  Activity log
                </p>
                <ul className="max-h-48 space-y-0 overflow-y-auto">
                  {log.map((entry) => (
                    <li
                      key={entry.id}
                      className="border-b border-slate-800/40 px-4 py-2.5 font-mono text-xs last:border-0"
                    >
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-slate-600">
                          {formatTime(entry.at)}
                        </span>
                        <span
                          className={cn(
                            "uppercase",
                            entry.action === "buy" && "text-emerald-400",
                            entry.action === "sell" && "text-red-400",
                            entry.action === "close" && "text-amber-400",
                            entry.action === "halt" && "text-red-400",
                            entry.action === "error" && "text-red-400",
                            entry.action === "start" && "text-cyan-400",
                            entry.action === "stop" && "text-slate-400"
                          )}
                        >
                          {entry.action}
                        </span>
                        {entry.executed && (
                          <Badge variant="success">executed</Badge>
                        )}
                        {entry.error && (
                          <Badge variant="warning">{entry.error}</Badge>
                        )}
                      </div>
                      <p className="mt-1 text-slate-400">{entry.message}</p>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}