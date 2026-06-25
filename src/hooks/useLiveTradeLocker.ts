"use client";

import { useCallback, useEffect, useState } from "react";
import type {
  TradeLockerAccount,
  TradeLockerDashboardData,
  TradeLockerInstrument,
} from "@/lib/tradelocker/types";

interface UseLiveTradeLockerOptions {
  selectedAccountId?: string | null;
  selectedAccNum?: string | null;
}

export function useLiveTradeLocker(options: UseLiveTradeLockerOptions = {}) {
  const { selectedAccountId, selectedAccNum } = options;

  const [connected, setConnected] = useState(false);
  const [environment, setEnvironment] = useState<"live" | "demo" | null>(null);
  const [statusLoading, setStatusLoading] = useState(true);
  const [accountsLoading, setAccountsLoading] = useState(false);
  const [dashboardLoading, setDashboardLoading] = useState(false);
  const [instrumentsLoading, setInstrumentsLoading] = useState(false);
  const [tradeLoading, setTradeLoading] = useState(false);
  const [accounts, setAccounts] = useState<TradeLockerAccount[]>([]);
  const [dashboard, setDashboard] = useState<TradeLockerDashboardData | null>(
    null
  );
  const [instruments, setInstruments] = useState<TradeLockerInstrument[]>([]);
  const [error, setError] = useState<string | null>(null);

  const refreshStatus = useCallback(async () => {
    setStatusLoading(true);
    try {
      const res = await fetch("/api/tradelocker/status", {
        credentials: "include",
      });
      if (!res.ok) {
        setConnected(false);
        return;
      }
      const data = await res.json();
      setConnected(Boolean(data.connected));
      setEnvironment(data.environment ?? null);
    } catch {
      setConnected(false);
    } finally {
      setStatusLoading(false);
    }
  }, []);

  const refreshAccounts = useCallback(async () => {
    setAccountsLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/tradelocker/accounts", {
        credentials: "include",
      });
      const data = await res.json();
      if (!res.ok) {
        setAccounts([]);
        setError(data.error ?? "Failed to load accounts");
        if (res.status === 401) setConnected(false);
        return;
      }
      setAccounts(data.accounts ?? []);
      setConnected(true);
    } catch {
      setError("Network error while loading accounts");
      setAccounts([]);
    } finally {
      setAccountsLoading(false);
    }
  }, []);

  const refreshDashboard = useCallback(async () => {
    if (!selectedAccountId || !selectedAccNum) {
      setDashboard(null);
      return;
    }

    setDashboardLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({
        accountId: selectedAccountId,
        accNum: selectedAccNum,
      });
      const res = await fetch(`/api/tradelocker/dashboard?${params}`, {
        credentials: "include",
      });
      const data = await res.json();
      if (!res.ok) {
        setDashboard(null);
        setError(data.error ?? "Failed to load dashboard data");
        if (res.status === 401) setConnected(false);
        return;
      }
      setDashboard({
        metrics: data.metrics,
        positions: data.positions ?? [],
      });
    } catch {
      setError("Network error while loading dashboard");
      setDashboard(null);
    } finally {
      setDashboardLoading(false);
    }
  }, [selectedAccountId, selectedAccNum]);

  const refreshInstruments = useCallback(async () => {
    if (!selectedAccountId || !selectedAccNum) {
      setInstruments([]);
      return;
    }

    setInstrumentsLoading(true);
    try {
      const params = new URLSearchParams({
        accountId: selectedAccountId,
        accNum: selectedAccNum,
      });
      const res = await fetch(`/api/tradelocker/instruments?${params}`, {
        credentials: "include",
      });
      const data = await res.json();
      if (!res.ok) {
        setInstruments([]);
        if (res.status === 401) setConnected(false);
        return;
      }
      setInstruments(data.instruments ?? []);
    } catch {
      setInstruments([]);
    } finally {
      setInstrumentsLoading(false);
    }
  }, [selectedAccountId, selectedAccNum]);

  const placeOrder = useCallback(
    async (input: {
      side: "buy" | "sell";
      qty: number;
      tradableInstrumentId: number;
      routeId: number;
      instrumentName?: string;
      gateAcknowledged?: boolean;
    }): Promise<{ ok: boolean; error?: string }> => {
      if (!selectedAccountId || !selectedAccNum) {
        return { ok: false, error: "No account selected" };
      }

      setTradeLoading(true);
      setError(null);
      try {
        const res = await fetch("/api/tradelocker/orders", {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            accountId: selectedAccountId,
            accNum: selectedAccNum,
            ...input,
          }),
        });
        const data = await res.json();
        if (!res.ok) {
          const message = data.error ?? "Failed to place order";
          setError(message);
          if (res.status === 401) setConnected(false);
          return { ok: false, error: message };
        }
        await refreshDashboard();
        return { ok: true };
      } catch {
        const message = "Network error while placing order";
        setError(message);
        return { ok: false, error: message };
      } finally {
        setTradeLoading(false);
      }
    },
    [selectedAccountId, selectedAccNum, refreshDashboard]
  );

  const closePosition = useCallback(
    async (
      positionId: string,
      qty = 0,
      context?: {
        instrumentName: string;
        side: string;
        unrealizedPl: number;
        qtyLabel?: string;
        balance?: number;
      }
    ): Promise<{ ok: boolean; error?: string }> => {
      if (!selectedAccNum) {
        return { ok: false, error: "No account selected" };
      }

      setTradeLoading(true);
      setError(null);
      try {
        const res = await fetch(
          `/api/tradelocker/positions/${encodeURIComponent(positionId)}`,
          {
            method: "DELETE",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              accNum: selectedAccNum,
              qty,
              instrumentName: context?.instrumentName,
              side: context?.side,
              unrealizedPl: context?.unrealizedPl,
              qtyLabel: context?.qtyLabel,
              balance: context?.balance,
            }),
          }
        );
        const data = await res.json();
        if (!res.ok) {
          const message = data.error ?? "Failed to close position";
          setError(message);
          if (res.status === 401) setConnected(false);
          return { ok: false, error: message };
        }
        await refreshDashboard();
        return { ok: true };
      } catch {
        const message = "Network error while closing position";
        setError(message);
        return { ok: false, error: message };
      } finally {
        setTradeLoading(false);
      }
    },
    [selectedAccNum, refreshDashboard]
  );

  const disconnect = useCallback(async () => {
    await fetch("/api/tradelocker/disconnect", {
      method: "POST",
      credentials: "include",
    });
    setConnected(false);
    setEnvironment(null);
    setAccounts([]);
    setDashboard(null);
    setInstruments([]);
  }, []);

  useEffect(() => {
    refreshStatus();
  }, [refreshStatus]);

  useEffect(() => {
    if (connected) {
      refreshAccounts();
    }
  }, [connected, refreshAccounts]);

  useEffect(() => {
    if (connected && selectedAccountId && selectedAccNum) {
      refreshDashboard();
      refreshInstruments();
    }
  }, [
    connected,
    selectedAccountId,
    selectedAccNum,
    refreshDashboard,
    refreshInstruments,
  ]);

  return {
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
    refreshDashboard,
    refreshInstruments,
    placeOrder,
    closePosition,
    disconnect,
    setConnected,
  };
}