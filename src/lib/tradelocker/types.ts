export interface TradeLockerCredentials {
  email: string;
  password: string;
  server: string;
}

export interface TradeLockerTokens {
  accessToken: string;
  refreshToken: string;
  expireDate: string;
}

export interface TradeLockerAccount {
  accountId: string;
  accNum: string;
  name?: string;
  currency?: string;
  status?: string;
  balance?: number;
}

export interface TradeLockerPosition {
  id: string;
  instrumentId: string;
  side: string;
  qty: string;
  avgPrice: string;
  openDate: string;
  unrealizedPl: string;
}

export interface TradeLockerDashboardMetrics {
  balance: number;
  openNetPnL: number;
  todayNetPnL: number;
  winRate: number | null;
  closedTrades: number;
  openPositionsCount: number;
}

export interface TradeLockerDashboardData {
  metrics: TradeLockerDashboardMetrics;
  positions: TradeLockerPosition[];
}

export interface PanelColumn {
  id: string;
  description?: string;
}