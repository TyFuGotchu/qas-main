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

/** Single bot parameter: name, exact value, and plain-language description. */
export interface QuantProtocolSetting {
  label: string;
  value: string;
  description: string;
}

/** Per-asset recommended bot parameters for Quicksilver Quant Protocol. */
export interface QuantProtocolAssetSettings {
  /** Display symbol e.g. XAUUSD, NAS100 */
  asset: string;
  /** Optional longer name */
  name?: string;
  settings: QuantProtocolSetting[];
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
  /** Public landing for TradeLocker bot access requesters */
  publicPath: "/quant-protocol",
  /**
   * TradeLocker limitation: marketplace bots (including Quant Protocol) run on
   * the desktop application only — not TradeLocker Web.
   */
  desktopRequiredTitle: "TradeLocker desktop app required",
  desktopRequiredSummary:
    "To request access and run Quicksilver Quant Protocol, you need the TradeLocker desktop application installed. The bot is not available on the TradeLocker web platform.",
  desktopRequiredDetail:
    "Download and install TradeLocker Desktop, log in with your broker account there, then request or enable Quant Protocol from the desktop marketplace. Web charts and web trading will not show or run this bot.",
} as const;

/**
 * Asset-specific settings for Quant Protocol.
 * Add new instruments over time — each setting includes label, value, and description.
 */
export const QUANT_PROTOCOL_ASSET_SETTINGS: QuantProtocolAssetSettings[] = [
  {
    asset: "NAS100",
    name: "Nasdaq 100",
    settings: [
      {
        label: "Asset / Instrument",
        value: "NAS100",
        description:
          "TradeLocker symbol to attach Quant Protocol to for this configuration.",
      },
      {
        label: "Base Equity",
        value: "100000",
        description:
          "Reference account equity used as the baseline for dynamic position sizing. When current equity equals this value, position size equals Base Lot Size.",
      },
      {
        label: "Breakout Channel Period",
        value: "55",
        description:
          "Number of prior bars used to compute the highest high and lowest low that define the straddle's upper and lower breakout barriers.",
      },
      {
        label: "ATR Period",
        value: "40",
        description:
          "Lookback period (in bars) for the Average True Range indicator, used to size the stop-loss and take-profit.",
      },
      {
        label: "Stop Loss (ATR Multiple)",
        value: "1.8",
        description:
          "Distance of the hard stop-loss from entry price, expressed as a multiple of ATR.",
      },
      {
        label: "Take Profit (ATR Multiple)",
        value: "2.1",
        description:
          "Distance of the hard take-profit from the entry price, expressed as a multiple of ATR.",
      },
      {
        label: "ADX Period",
        value: "18",
        description:
          "Lookback period (in bars) for the Average Directional Index, used to detect low-trend 'squeeze' conditions where breakout straddles are armed.",
      },
      {
        label: "ADX Squeeze Threshold",
        value: "33",
        description:
          "ADX value below which the market is considered to be in a low-trend squeeze. Straddle entry orders are only placed when ADX is under this threshold.",
      },
      {
        label: "Maximum Concurrent Positions",
        value: "1",
        description:
          "Maximum number of layers the strategy may hold open simultaneously in a strong trend.",
      },
    ],
  },
];

/** Hub + external links for the Trading Bots menu. */
export const TRADING_BOT_EXTERNAL_LINKS: TradingBotExternalLink[] = [
  {
    id: "quant-protocol-hub",
    label: "TradeLocker Hub — Quant Protocol",
    description:
      "Official marketplace listing for Quicksilver Quant Protocol. Open from TradeLocker Desktop only — not available on the web platform.",
    href: TRADELOCKER_BOT_URL,
    badge: "Primary bot",
    external: true,
  },
  {
    id: "herofx-broker",
    label: "HeroFX (optional recommended broker)",
    description:
      "Optional partner if you need a retail TradeLocker account. Not required — Quant Protocol works with any TradeLocker-compatible broker.",
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
