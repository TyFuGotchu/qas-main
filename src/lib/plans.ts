export const STRIPE_BUY_PUBLISHABLE_KEY =
  "pk_live_51Sb8b7DUxwVQyisqXzIVGqRP9PUBjEWp6KYDIQzsHlWuqwMD5QmbiZNUC9aJCoQpjFptt8NDnz3jFXKb0pQapuVK009wpiP4Kf";

export const CONSUMER_PLANS = [
  {
    id: "tools",
    name: "Tools",
    price: "$39.99",
    priceNumber: 39.99,
    period: "/mo",
    buyButtonId: "buy_btn_1UDW4pDUxwVQyisq8Bkish7C",
    summary: "TradeLocker risk desk: Rule Desk, presets, hard flatten, journal, live terminal.",
    includes: [
      "Rule Desk and risk presets",
      "Hard equity-stop flatten",
      "Journal and live terminal",
      "Works on any TradeLocker account",
    ],
    excludes: ["Quant Protocol / bot is a separate Desk flag", "Master Suite copy trading"],
  },
  {
    id: "copy",
    name: "Copy",
    price: "$99",
    priceNumber: 99,
    period: "/mo",
    buyButtonId: "buy_btn_1UDW66DUxwVQyisqQspr2M5g",
    summary:
      "TradingView Master Suite → TradeLocker copy via webhook. $99/mo or a performance split by request.",
    includes: [
      "Webhook endpoint after subscribe",
      "Copy OFF by default until you enable it",
      "Flatten wins if armed",
    ],
    excludes: ["Not live until Ty’s alert JSON is wired"],
    splitNote: "$99/mo or performance split (request). Split % is quoted, not published.",
  },
  {
    id: "full",
    name: "Full",
    price: "$119.99",
    priceNumber: 119.99,
    period: "/mo",
    buyButtonId: "buy_btn_1UDW8vDUxwVQyisqioTIzP5I",
    summary: "Tools + Copy together.",
    includes: [
      "Everything in Tools",
      "Everything in Copy",
      "One invoice at $119.99/mo",
    ],
    excludes: [],
  },
] as const;

export type ConsumerPlanId = (typeof CONSUMER_PLANS)[number]["id"];

export const WEBHOOK_PUBLIC_URL = "https://quicksilveralgo.com/api/webhooks/tradingview";
export const WEBHOOK_API_ALIAS = "https://api.quicksilveralgo.com/webhooks/tradingview";
