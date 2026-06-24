"use client";

import { useCallback, useEffect, useState } from "react";
import type {
  TradeLockerAccount,
  TradeLockerDashboardData,
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
  const [accounts, setAccounts] = useState<TradeLockerAccount[]>([]);
  const [dashboard, setDashboard] = useState<TradeLockerDashboardData | null>(
    null
  );
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

  const disconnect = useCallback(async () => {
    await fetch("/api/tradelocker/disconnect", {
      method: "POST",
      credentials: "include",
    });
    setConnected(false);
    setEnvironment(null);
    setAccounts([]);
    setDashboard(null);
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
    }
  }, [
    connected,
    selectedAccountId,
    selectedAccNum,
    refreshDashboard,
  ]);

  return {
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
    refreshDashboard,
    disconnect,
    setConnected,
  };
}