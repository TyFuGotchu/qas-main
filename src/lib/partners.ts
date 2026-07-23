/**
 * Quicksilver partner / platform recommendations.
 *
 * ACTIVE partners are the only ones shown to users (UI, support, marketing).
 * Pending platforms stay in comments + Grok skill only — never render them.
 *
 * Presentation rule: always identify trading style (manual vs bots/EAs) BEFORE
 * dumping links when the user is asking for recommendations.
 */

export type PartnerKind = "broker" | "prop_firm";
export type TradingStyle = "manual" | "bots";

export interface ActivePartner {
  id: string;
  name: string;
  kind: PartnerKind;
  /** Short label e.g. "Broker" | "Prop Firm" */
  kindLabel: string;
  href: string;
}

/** Currently active, verified partners — same list for manual and bot users. */
export const ACTIVE_PARTNERS: readonly ActivePartner[] = [
  {
    id: "risen-fx",
    name: "Risen FX",
    kind: "broker",
    kindLabel: "Broker",
    href: "https://secure.risenfx.com/links/go/3587",
  },
  {
    id: "funderpro",
    name: "FunderPro",
    kind: "prop_firm",
    kindLabel: "Prop Firm",
    href: "https://funderpro.cxclick.com/visit/?bta=49026&brand=funderpro",
  },
] as const;

/**
 * Pending partners — NOT READY. Do not display, mention, or recommend.
 * Waiting on official links / back-end approval:
 * - Goat Funded Trader (GFT)
 * - AquaFunded
 * - HeroFX
 * - Lucid Trading
 *
 * Add here only after green light + live URLs, then move into ACTIVE_PARTNERS.
 */

export const PARTNER_ROUTING_QUESTION =
  "Are you planning to run the Quicksilver automated bots (EAs), or are you looking to use our manual/discretionary trading arsenal?";

export const PARTNER_ROUTING_OPTIONS = {
  bots: {
    id: "bots" as const,
    label: "Automated bots / EAs",
    shortLabel: "Bots / EAs",
    description: "Quicksilver Quant Protocol and automated execution",
  },
  manual: {
    id: "manual" as const,
    label: "Manual / discretionary",
    shortLabel: "Manual trading",
    description: "Chart Academy, playbook, planning tools, live terminal",
  },
} as const;

/** Framing shown after the user picks a style (same partner links either way). */
export function getPartnerFraming(style: TradingStyle): {
  headline: string;
  intro: string;
  highlight: string;
} {
  if (style === "manual") {
    return {
      headline: "Top-tier platforms for manual execution",
      intro:
        "These are our currently active, verified partners — excellent for discretionary trading with our playbook, planning engines, and live terminal tools.",
      highlight:
        "Important benefit: both platforms fully allow trading bots and EAs. If you later scale into Quicksilver automated systems, you will not need to switch brokers or firms.",
    };
  }

  return {
    headline: "Verified bot-friendly partners",
    intro:
      "These platforms are specifically verified by Quicksilver because they explicitly allow trading bots / EAs and are optimized for our automated algorithms (including Quant Protocol on TradeLocker where supported).",
    highlight:
      "Use the partner links below to open or fund an account, then enable Quant Protocol from the TradeLocker desktop app when you are ready.",
  };
}

export function getPartnerKindBadgeVariant(
  kind: PartnerKind
): "success" | "warning" {
  return kind === "broker" ? "success" : "warning";
}
