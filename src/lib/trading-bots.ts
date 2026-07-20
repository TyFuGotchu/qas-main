import { TRADELOCKER_BOT_URL, HEROFX_PARTNER_URL } from "@/lib/constants";

/** External / marketplace destinations shown under Trading Bots. */
export interface TradingBotExternalLink {
  id: string;
  label: string;
  description: string;
  href: string;
  badge?: string;
  /** Opens in new tab when true (default for external). */
  external?: boolean;
}

/** Per-asset recommended bot parameters for Quicksilver Quant Protocol. */
export interface QuantProtocolAssetSettings {
  /** Display symbol e.g. XAUUSD, NAS100 */
  asset: string;
  /** Optional longer name */
  name?: string;
  /** Key/value settings the user will fill (timeframe, risk %, SL, etc.) */
  settings: { label: string; value: string }[];
  notes?: string;
}

export const QUANT_PROTOCOL = {
  id: "quant-protocol",
  name: "Quicksilver Quant Protocol",
  shortName: "Quant Protocol",
  tagline: "Apex Institutional Engine",
  description:
    "Flagship TradeLocker marketplace algorithm. Subscribe on the hub, enable it on your account, then apply the asset settings below for consistent deployment.",
  marketplaceUrl: TRADELOCKER_BOT_URL,
  dashboardPath: "/dashboard/trading-bots/quant-protocol",
} as const;

/**
 * Asset-specific settings for Quant Protocol.
 * Populated when you provide the exact parameters per instrument.
 */
export const QUANT_PROTOCOL_ASSET_SETTINGS: QuantProtocolAssetSettings[] = [
  // Will be filled from your next message, e.g.:
  // {
  //   asset: "XAUUSD",
  //   name: "Gold",
  //   settings: [
  //     { label: "Timeframe", value: "M5" },
  //     { label: "Risk per trade", value: "0.5%" },
  //   ],
  //   notes: "Avoid high-impact news windows.",
  // },
];

/** Hub + external links for the Trading Bots menu. */
export const TRADING_BOT_EXTERNAL_LINKS: TradingBotExternalLink[] = [
  {
    id: "quant-protocol-hub",
    label: "TradeLocker Hub — Quant Protocol",
    description:
      "Official marketplace listing for Quicksilver Quant Protocol (Apex Institutional Engine).",
    href: TRADELOCKER_BOT_URL,
    badge: "Primary bot",
    external: true,
  },
  {
    id: "herofx-broker",
    label: "HeroFX (recommended broker)",
    description:
      "Partner broker for TradeLocker accounts — open or fund an account for live bot execution.",
    href: HEROFX_PARTNER_URL,
    badge: "Broker",
    external: true,
  },
  {
    id: "live-terminal",
    label: "Live TradeLocker Terminal",
    description:
      "Connect your account, monitor positions, and use Risk Guard / Position Sizer alongside the bot.",
    href: "/dashboard/bot",
    badge: "In-app",
    external: false,
  },
];

export const TRADING_BOTS_NAV = {
  hub: "/dashboard/trading-bots",
  quantProtocol: "/dashboard/trading-bots/quant-protocol",
} as const;
