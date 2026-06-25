"use client";

import { useEffect, useMemo, useState } from "react";
import { useLiveTradeLocker } from "@/hooks/useLiveTradeLocker";
import { TradeLockerConnectForm } from "@/components/tradelocker/TradeLockerConnectForm";
import { TradeLockerAccountTools } from "@/components/tradelocker/TradeLockerAccountTools";
import { LiveSignalTerminal } from "@/components/tradelocker/LiveSignalTerminal";
import { PreTradeGateDialog } from "@/components/tradelocker/PreTradeGateDialog";
import { evaluatePreTradeGate } from "@/lib/pre-trade-gate";
import type { PreTradeGateResult } from "@/lib/pre-trade-gate";
import type { TraderProfileView } from "@/lib/trader-profile";
import { resolveTradesTodayCount } from "@/lib/journal/trade-count";
import type { TradeJournalEntry } from "@prisma/client";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import { useToast } from "@/components/ui/Toast";
import { cn } from "@/lib/utils";
import {
  Activity,
  BarChart3,
  Loader2,
  LogOut,
  TrendingDown,
  TrendingUp,
  Wallet,
  XCircle,
} from "lucide-react";

function MetricSkeleton() {
  return (
    <div className="animate-pulse space-y-3">
      <div className="h-3 w-20 rounded bg-slate-800" />
      <div className="h-8 w-28 rounded bg-slate-800/80" />
    </div>
  );
}

function TableSkeleton({ rows = 4 }: { rows?: number }) {
  return (
    <div className="space-y-2">
      {Array.from({ length: rows }).map((_, i) => (
        <div
          key={i}
          className="h-10 animate-pulse rounded border border-slate-800/60 bg-slate-900/40"
        />
      ))}
    </div>
  );
}

function formatCurrency(value: number): string {
  const sign = value < 0 ? "-" : "";
  return `${sign}$${Math.abs(value).toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

export function TradeLockerLiveDashboard() {
  const [selectedAccountId, setSelectedAccountId] = useState<string | null>(null);
  const [selectedAccNum, setSelectedAccNum] = useState<string | null>(null);
  const [selectedInstrumentKey, setSelectedInstrumentKey] = useState("");
  const [orderQty, setOrderQty] = useState("0.01");
  const [closingPositionId, setClosingPositionId] = useState<string | null>(
    null
  );
  const [traderProfile, setTraderProfile] = useState<TraderProfileView | null>(
    null
  );
  const [journalEntries, setJournalEntries] = useState<TradeJournalEntry[]>([]);
  const [gateOpen, setGateOpen] = useState(false);
  const [pendingOrder, setPendingOrder] = useState<{
    side: "buy" | "sell";
    qty: number;
  } | null>(null);
  const [gateResult, setGateResult] = useState<PreTradeGateResult | null>(null);
  const { toast } = useToast();

  const {
    connected,
    environment,
    statusLoading,
    accountsLoading,
    dashboardLoading,
    instrumentsLoading,
    tradeLoading,
    accounts,
    dashboard,
    instruments,
    error,
    refreshStatus,
    refreshAccounts,
    placeOrder,
    closePosition,
    disconnect,
    setConnected,
  } = useLiveTradeLocker({
    selectedAccountId,
    selectedAccNum,
  });

  useEffect(() => {
    async function loadProfileAndJournal() {
      try {
        const [profileRes, journalRes] = await Promise.all([
          fetch("/api/trader-profile"),
          fetch("/api/journal"),
        ]);
        if (profileRes.ok) {
          const data = await profileRes.json();
          setTraderProfile(data.profile ?? null);
        }
        if (journalRes.ok) {
          const data = await journalRes.json();
          setJournalEntries(data.entries ?? []);
        }
      } catch {
        // optional enrichment
      }
    }
    loadProfileAndJournal();
  }, []);

  useEffect(() => {
    if (!selectedAccountId && accounts.length > 0) {
      const first = accounts[0];
      if (first) {
        setSelectedAccountId(first.accountId);
        setSelectedAccNum(first.accNum);
      }
    }
  }, [accounts, selectedAccountId]);

  const accountOptions = useMemo(
    () =>
      accounts.map((account) => ({
        value: `${account.accountId}:${account.accNum}`,
        label: `#${account.accountId}${account.currency ? ` · ${account.currency}` : ""}${account.name ? ` · ${account.name}` : ""}`,
      })),
    [accounts]
  );

  const instrumentOptions = useMemo(
    () =>
      instruments.map((instrument) => ({
        value: `${instrument.tradableInstrumentId}:${instrument.routeId}`,
        label: instrument.name,
      })),
    [instruments]
  );

  const instrumentNameById = useMemo(() => {
    const map = new Map<string, string>();
    for (const instrument of instruments) {
      map.set(String(instrument.tradableInstrumentId), instrument.name);
    }
    return map;
  }, [instruments]);

  const selectedInstrument = useMemo(() => {
    if (!selectedInstrumentKey) return null;
    const [tradableInstrumentId, routeId] = selectedInstrumentKey
      .split(":")
      .map(Number);
    if (!Number.isFinite(tradableInstrumentId) || !Number.isFinite(routeId)) {
      return null;
    }
    return instruments.find(
      (instrument) =>
        instrument.tradableInstrumentId === tradableInstrumentId &&
        instrument.routeId === routeId
    );
  }, [instruments, selectedInstrumentKey]);

  useEffect(() => {
    if (instrumentOptions.length > 0 && !selectedInstrumentKey) {
      setSelectedInstrumentKey(instrumentOptions[0]?.value ?? "");
    }
  }, [instrumentOptions, selectedInstrumentKey]);

  const showMetricsSkeleton =
    connected && (!selectedAccountId || dashboardLoading);
  const showTableSkeleton =
    connected && (!selectedAccountId || dashboardLoading);

  async function handleDisconnect() {
    await disconnect();
    setSelectedAccountId(null);
    setSelectedAccNum(null);
    setSelectedInstrumentKey("");
  }

  async function executePlaceOrder(
    side: "buy" | "sell",
    qty: number,
    gateAcknowledged = false
  ) {
    if (!selectedInstrument) return;

    const result = await placeOrder({
      side,
      qty,
      tradableInstrumentId: selectedInstrument.tradableInstrumentId,
      routeId: selectedInstrument.routeId,
      instrumentName: selectedInstrument.name,
      gateAcknowledged,
    });

    if (result.ok) {
      const journalRes = await fetch("/api/journal");
      if (journalRes.ok) {
        const data = await journalRes.json();
        setJournalEntries(data.entries ?? []);
      }
      toast({
        title: `${side === "buy" ? "Buy" : "Sell"} order placed`,
        description: `${qty} lots · ${selectedInstrument.name}`,
      });
    } else {
      toast({
        title: "Order failed",
        description: result.error,
        variant: "error",
      });
    }
  }

  async function handlePlaceOrder(side: "buy" | "sell") {
    if (!selectedInstrument) {
      toast({
        title: "Select an instrument",
        variant: "error",
      });
      return;
    }

    const qty = Number(orderQty);
    if (!Number.isFinite(qty) || qty <= 0) {
      toast({
        title: "Invalid quantity",
        description: "Enter a positive lot size.",
        variant: "error",
      });
      return;
    }

    if (traderProfile?.profileComplete) {
      const gate = evaluatePreTradeGate(dashboard?.metrics ?? null, traderProfile, {
        tradesToday: resolveTradesTodayCount(
          dashboard?.tradesToday ?? 0,
          journalEntries
        ),
      });

      if (!gate.allowed) {
        setGateResult(gate);
        setPendingOrder({ side, qty });
        setGateOpen(true);
        return;
      }
    }

    await executePlaceOrder(side, qty);
  }

  async function handleGateConfirm() {
    if (!pendingOrder) return;
    setGateOpen(false);
    await executePlaceOrder(
      pendingOrder.side,
      pendingOrder.qty,
      true
    );
    setPendingOrder(null);
    setGateResult(null);
  }

  async function handleClosePosition(
    positionId: string,
    instrumentLabel: string,
    side: string,
    unrealizedPl: number,
    qty: string
  ) {
    setClosingPositionId(positionId);
    const result = await closePosition(positionId, 0, {
      instrumentName: instrumentLabel,
      side,
      unrealizedPl,
      qtyLabel: qty,
      balance: dashboard?.metrics.balance,
    });
    setClosingPositionId(null);

    if (result.ok) {
      const journalRes = await fetch("/api/journal");
      if (journalRes.ok) {
        const data = await journalRes.json();
        setJournalEntries(data.entries ?? []);
      }
      toast({
        title: "Position close requested",
        description: `${instrumentLabel} · logged to journal`,
      });
    } else {
      toast({
        title: "Close failed",
        description: result.error,
        variant: "error",
      });
    }
  }

  if (statusLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center gap-3 py-16">
          <Loader2 className="h-5 w-5 animate-spin text-cyan-400" />
          <span className="font-mono text-sm text-slate-500">
            Checking TradeLocker session…
          </span>
        </CardContent>
      </Card>
    );
  }

  if (!connected) {
    return (
      <TradeLockerConnectForm
        onConnected={() => {
          setConnected(true);
          refreshStatus().then(() => refreshAccounts());
        }}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3">
          <Badge variant="success">Live TradeLocker</Badge>
          {environment && (
            <Badge variant="warning">
              {environment === "demo" ? "Demo API" : "Live API"}
            </Badge>
          )}
          {accountsLoading && (
            <span className="font-mono text-xs text-slate-500">
              Syncing accounts…
            </span>
          )}
        </div>
        <div className="flex flex-wrap items-center gap-3">
          {accountOptions.length > 0 && (
            <div className="min-w-[220px]">
              <Select
                label="Account"
                value={
                  selectedAccountId && selectedAccNum
                    ? `${selectedAccountId}:${selectedAccNum}`
                    : ""
                }
                onChange={(e) => {
                  const [accountId, accNum] = e.target.value.split(":");
                  if (accountId && accNum) {
                    setSelectedAccountId(accountId);
                    setSelectedAccNum(accNum);
                    setSelectedInstrumentKey("");
                  }
                }}
                options={accountOptions}
              />
            </div>
          )}
          <Button variant="ghost" size="sm" onClick={handleDisconnect}>
            <LogOut className="h-3.5 w-3.5" />
            Disconnect
          </Button>
        </div>
      </div>

      {error && (
        <p className="rounded border border-red-500/30 bg-red-500/10 px-4 py-3 font-mono text-sm text-red-400">
          {error}
        </p>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="py-5">
            <div className="flex items-center gap-2 text-slate-500">
              <Wallet className="h-4 w-4 text-cyan-400" />
              <span className="font-mono text-[10px] uppercase tracking-widest">
                Balance
              </span>
            </div>
            {showMetricsSkeleton ? (
              <div className="mt-3">
                <MetricSkeleton />
              </div>
            ) : (
              <p className="mt-3 font-mono text-2xl font-bold text-slate-100">
                {formatCurrency(dashboard?.metrics.balance ?? 0)}
              </p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardContent className="py-5">
            <div className="flex items-center gap-2 text-slate-500">
              <TrendingUp className="h-4 w-4 text-emerald-400" />
              <span className="font-mono text-[10px] uppercase tracking-widest">
                Open PnL
              </span>
            </div>
            {showMetricsSkeleton ? (
              <div className="mt-3">
                <MetricSkeleton />
              </div>
            ) : (
              <p
                className={cn(
                  "mt-3 font-mono text-2xl font-bold",
                  (dashboard?.metrics.openNetPnL ?? 0) >= 0
                    ? "text-emerald-400"
                    : "text-red-400"
                )}
              >
                {formatCurrency(dashboard?.metrics.openNetPnL ?? 0)}
              </p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardContent className="py-5">
            <div className="flex items-center gap-2 text-slate-500">
              <Activity className="h-4 w-4 text-cyan-400" />
              <span className="font-mono text-[10px] uppercase tracking-widest">
                Today PnL
              </span>
            </div>
            {showMetricsSkeleton ? (
              <div className="mt-3">
                <MetricSkeleton />
              </div>
            ) : (
              <p
                className={cn(
                  "mt-3 font-mono text-2xl font-bold",
                  (dashboard?.metrics.todayNetPnL ?? 0) >= 0
                    ? "text-emerald-400"
                    : "text-red-400"
                )}
              >
                {formatCurrency(dashboard?.metrics.todayNetPnL ?? 0)}
              </p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardContent className="py-5">
            <div className="flex items-center gap-2 text-slate-500">
              <BarChart3 className="h-4 w-4 text-amber-400" />
              <span className="font-mono text-[10px] uppercase tracking-widest">
                Win Rate
              </span>
            </div>
            {showMetricsSkeleton ? (
              <div className="mt-3">
                <MetricSkeleton />
              </div>
            ) : (
              <>
                <p className="mt-3 font-mono text-2xl font-bold text-slate-100">
                  {dashboard?.metrics.winRate != null
                    ? `${dashboard.metrics.winRate}%`
                    : "—"}
                </p>
                <p className="mt-1 font-mono text-[10px] text-slate-600">
                  {dashboard?.metrics.closedTrades ?? 0} closed positions (90d)
                </p>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      <LiveSignalTerminal instruments={instruments} />

      <Card>
        <CardHeader>
          <h3 className="flex items-center gap-2 font-mono text-sm font-semibold text-slate-200">
            <Activity className="h-4 w-4 text-cyan-400" />
            Market Order
          </h3>
        </CardHeader>
        <CardContent>
          {instrumentsLoading ? (
            <div className="flex items-center gap-2 py-4 font-mono text-xs text-slate-500">
              <Loader2 className="h-4 w-4 animate-spin" />
              Loading instruments…
            </div>
          ) : instrumentOptions.length > 0 ? (
            <div className="flex flex-col gap-4 lg:flex-row lg:items-end">
              <div className="min-w-[220px] flex-1">
                <Select
                  label="Instrument"
                  value={selectedInstrumentKey}
                  onChange={(e) => setSelectedInstrumentKey(e.target.value)}
                  options={instrumentOptions}
                  disabled={tradeLoading}
                />
              </div>
              <div className="w-full max-w-[140px]">
                <Input
                  label="Lots"
                  type="number"
                  min="0.01"
                  step="0.01"
                  value={orderQty}
                  onChange={(e) => setOrderQty(e.target.value)}
                  disabled={tradeLoading}
                />
              </div>
              <div className="flex flex-wrap gap-2">
                <Button
                  variant="secondary"
                  size="sm"
                  disabled={tradeLoading || !selectedInstrument}
                  onClick={() => handlePlaceOrder("buy")}
                >
                  {tradeLoading ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  ) : null}
                  Buy
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  disabled={tradeLoading || !selectedInstrument}
                  onClick={() => handlePlaceOrder("sell")}
                >
                  {tradeLoading ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  ) : null}
                  Sell
                </Button>
              </div>
            </div>
          ) : (
            <p className="py-4 font-mono text-sm text-slate-500">
              No tradable instruments found for this account.
            </p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <h3 className="flex items-center gap-2 font-mono text-sm font-semibold text-slate-200">
            <TrendingDown className="h-4 w-4 text-cyan-400" />
            Active Positions
          </h3>
        </CardHeader>
        <CardContent>
          {showTableSkeleton ? (
            <TableSkeleton />
          ) : dashboard?.positions.length ? (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[640px] text-left font-mono text-xs">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-500">
                    <th className="px-3 py-2">Instrument</th>
                    <th className="px-3 py-2">Side</th>
                    <th className="px-3 py-2">Qty</th>
                    <th className="px-3 py-2">Avg Price</th>
                    <th className="px-3 py-2">Unrealized PnL</th>
                    <th className="px-3 py-2 text-right">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {dashboard.positions.map((position) => {
                    const pnl = Number(position.unrealizedPl);
                    const instrumentLabel =
                      instrumentNameById.get(position.instrumentId) ??
                      `#${position.instrumentId}`;
                    const isClosing = closingPositionId === position.id;
                    return (
                      <tr
                        key={position.id}
                        className="border-b border-slate-800/60 text-slate-300"
                      >
                        <td className="px-3 py-3">{instrumentLabel}</td>
                        <td className="px-3 py-3 uppercase">{position.side}</td>
                        <td className="px-3 py-3">{position.qty}</td>
                        <td className="px-3 py-3">{position.avgPrice}</td>
                        <td
                          className={cn(
                            "px-3 py-3",
                            pnl >= 0 ? "text-emerald-400" : "text-red-400"
                          )}
                        >
                          {Number.isFinite(pnl)
                            ? formatCurrency(pnl)
                            : position.unrealizedPl}
                        </td>
                        <td className="px-3 py-3 text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            disabled={tradeLoading || isClosing}
                            onClick={() =>
                              handleClosePosition(
                                position.id,
                                instrumentLabel,
                                position.side,
                                pnl,
                                position.qty
                              )
                            }
                          >
                            {isClosing ? (
                              <Loader2 className="h-3.5 w-3.5 animate-spin" />
                            ) : (
                              <XCircle className="h-3.5 w-3.5" />
                            )}
                            Close
                          </Button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="py-8 text-center font-mono text-sm text-slate-500">
              No open positions on this account.
            </p>
          )}
        </CardContent>
      </Card>

      <TradeLockerAccountTools
        dashboard={dashboard}
        loading={showMetricsSkeleton}
        instrumentNames={instrumentNameById}
      />

      <PreTradeGateDialog
        open={gateOpen}
        onOpenChange={setGateOpen}
        gate={gateResult}
        side={pendingOrder?.side ?? "buy"}
        symbol={selectedInstrument?.name ?? ""}
        qty={pendingOrder?.qty ?? 0}
        onConfirm={handleGateConfirm}
      />
    </div>
  );
}