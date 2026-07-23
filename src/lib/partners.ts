import { HEROFX_PARTNER_URL } from "@/lib/constants";

/**
 * Quicksilver partner / platform recommendations.
 *
 * ACTIVE partners are the only ones shown to users (UI, support, marketing).
 * Keep every live affiliate / partner URL here so we maximize revenue paths.
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

/**
 * Currently active partners with live affiliate links.
 * Same list for manual and bot users — order: brokers first, then prop firms.
 */
export const ACTIVE_PARTNERS: readonly ActivePartner[] = [
  {
    id: "risen-fx",
    name: "Risen FX",
    kind: "broker",
    kindLabel: "Broker",
    href: "https://secure.risenfx.com/links/go/3587",
  },
  {
    id: "herofx",
    name: "HeroFX",
    kind: "broker",
    kindLabel: "Broker",
    href: HEROFX_PARTNER_URL,
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
 * Pending partners — no live affiliate URL yet. Do not display until approved:
 * - Goat Funded Trader (GFT)
 * - AquaFunded
 * - Lucid Trading
 *
 * When ready, add to ACTIVE_PARTNERS with the partner link.
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
        "These are our currently active partners with live signup links — excellent for discretionary trading with our playbook, planning engines, and live terminal tools.",
      highlight:
        "Important benefit: these platforms allow trading bots and EAs. If you later scale into Quicksilver automated systems, you will not need to switch brokers or firms.",
    };
  }

  return {
    headline: "Verified bot-friendly partners",
    intro:
      "These platforms are on our partner list because they allow trading bots / EAs and work well with Quicksilver algorithms (including Quant Protocol on TradeLocker where supported).",
    highlight:
      "Use any partner link below to open or fund an account, then enable Quant Protocol from the TradeLocker desktop app when you are ready.",
  };
}

export function getPartnerKindBadgeVariant(
  kind: PartnerKind
): "success" | "warning" {
  return kind === "broker" ? "success" : "warning";
}
