"use client";

import { useEffect, useMemo, useState } from "react";
import { useLiveTradeLocker } from "@/hooks/useLiveTradeLocker";
import { TradeLockerConnectForm } from "@/components/tradelocker/TradeLockerConnectForm";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import Select from "@/components/ui/Select";
import { cn } from "@/lib/utils";
import {
  Activity,
  BarChart3,
  Loader2,
  LogOut,
  TrendingDown,
  TrendingUp,
  Wallet,
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

  const {
    connected,
    environment,
    statusLoading,
    accountsLoading,
    dashboardLoading,
    accounts,
    dashboard,
    error,
    refreshStatus,
    refreshAccounts,
    disconnect,
    setConnected,
  } = useLiveTradeLocker({
    selectedAccountId,
    selectedAccNum,
  });

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

  const showMetricsSkeleton =
    connected && (!selectedAccountId || dashboardLoading);
  const showTableSkeleton =
    connected && (!selectedAccountId || dashboardLoading);

  async function handleDisconnect() {
    await disconnect();
    setSelectedAccountId(null);
    setSelectedAccNum(null);
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
                  </tr>
                </thead>
                <tbody>
                  {dashboard.positions.map((position) => {
                    const pnl = Number(position.unrealizedPl);
                    return (
                      <tr
                        key={position.id}
                        className="border-b border-slate-800/60 text-slate-300"
                      >
                        <td className="px-3 py-3">#{position.instrumentId}</td>
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
    </div>
  );
}