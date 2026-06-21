"use client";

import { createContext, useContext } from "react";
import { useMarketData, type UseMarketDataOptions } from "@/hooks/useMarketData";

type MarketDataContextValue = ReturnType<typeof useMarketData>;

const MarketDataContext = createContext<MarketDataContextValue | null>(null);

export function MarketDataProvider({
  children,
  options,
}: {
  children: React.ReactNode;
  options?: UseMarketDataOptions;
}) {
  const value = useMarketData(options);
  return (
    <MarketDataContext.Provider value={value}>
      {children}
    </MarketDataContext.Provider>
  );
}

export function useMarketDataContext(): MarketDataContextValue {
  const ctx = useContext(MarketDataContext);
  if (!ctx) {
    throw new Error("useMarketDataContext must be used within MarketDataProvider");
  }
  return ctx;
}