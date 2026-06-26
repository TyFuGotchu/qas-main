"use client";

import { useCallback, useEffect, useState } from "react";
import {
  formatTradeLockerAccountLabel,
  resolveTradeLockerAccount,
  SELECTED_ACCOUNT_CHANGED_EVENT,
  SELECTED_ACCOUNT_STORAGE_KEY,
} from "@/lib/tradelocker/selected-account";
import type {
  TradeLockerAccount,
  TradeLockerDashboardData,
} from "@/lib/tradelocker/types";

interface UseConnectedTradeLockerDashboardOptions {
  refreshIntervalMs?: number;
}

export function useConnectedTradeLockerDashboard(
  options: UseConnectedTradeLockerDashboardOptions = {}
) {
  const { refreshIntervalMs = 60_000 } = options;

  const [dashboard, setDashboard] = useState<TradeLockerDashboardData | null>(
    null
  );
  const [selectedAccount, setSelectedAccount] =
    useState<TradeLockerAccount | null>(null);
  const [tlConnected, setTlConnected] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async (showSpinner: boolean) => {
    if (showSpinner) setLoading(true);
    setError(null);

    try {
      const statusRes = await fetch("/api/tradelocker/status", {
        credentials: "include",
      });

      if (!statusRes.ok) {
        setTlConnected(false);
        setSelectedAccount(null);
        setDashboard(null);
        return;
      }

      const status = await statusRes.json();
      const connected = Boolean(status.connected);
      setTlConnected(connected);

      if (!connected) {
        setSelectedAccount(null);
        setDashboard(null);
        return;
      }

      const accountsRes = await fetch("/api/tradelocker/accounts", {
        credentials: "include",
      });

      if (!accountsRes.ok) {
        setSelectedAccount(null);
        setDashboard(null);
        setError("Failed to load TradeLocker accounts");
        if (accountsRes.status === 401) setTlConnected(false);
        return;
      }

      const { accounts } = (await accountsRes.json()) as {
        accounts?: TradeLockerAccount[];
      };
      const account = resolveTradeLockerAccount(accounts ?? []);

      if (!account) {
        setSelectedAccount(null);
        setDashboard(null);
        return;
      }

      setSelectedAccount(account);

      const params = new URLSearchParams({
        accountId: account.accountId,
        accNum: account.accNum,
      });
      const dashRes = await fetch(`/api/tradelocker/dashboard?${params}`, {
        credentials: "include",
      });

      if (!dashRes.ok) {
        setDashboard(null);
        setError("Failed to load account dashboard");
        if (dashRes.status === 401) setTlConnected(false);
        return;
      }

      const dash = await dashRes.json();
      setDashboard({
        metrics: dash.metrics,
        positions: dash.positions ?? [],
        tradesToday: dash.tradesToday ?? 0,
      });
    } catch {
      setError("Network error loading TradeLocker data");
    } finally {
      if (showSpinner) setLoading(false);
    }
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function run(showSpinner: boolean) {
      await load(showSpinner);
      if (cancelled) return;
    }

    run(true);
    const interval = setInterval(() => run(false), refreshIntervalMs);

    function onAccountChanged() {
      run(false);
    }

    function onStorage(event: StorageEvent) {
      if (event.key === SELECTED_ACCOUNT_STORAGE_KEY) {
        run(false);
      }
    }

    function onVisibilityChange() {
      if (document.visibilityState === "visible") {
        run(false);
      }
    }

    window.addEventListener(SELECTED_ACCOUNT_CHANGED_EVENT, onAccountChanged);
    window.addEventListener("storage", onStorage);
    document.addEventListener("visibilitychange", onVisibilityChange);

    return () => {
      cancelled = true;
      clearInterval(interval);
      window.removeEventListener(
        SELECTED_ACCOUNT_CHANGED_EVENT,
        onAccountChanged
      );
      window.removeEventListener("storage", onStorage);
      document.removeEventListener("visibilitychange", onVisibilityChange);
    };
  }, [load, refreshIntervalMs]);

  const selectedAccountLabel = selectedAccount
    ? formatTradeLockerAccountLabel(selectedAccount)
    : null;

  return {
    dashboard,
    selectedAccount,
    selectedAccountLabel,
    tlConnected,
    loading,
    error,
    refresh: () => load(false),
  };
}