import { HEROFX_PARTNER_URL } from "@/lib/constants";
import {
  E8_AFFILIATE_URL,
  E8_DASHBOARD_PATH,
  E8_EXCLUSIVE_LINE,
  E8_FIRM_NAME,
} from "@/lib/e8-partner";

/**
 * Partner routing.
 *
 * Prop recommendations: E8 Markets only.
 * Brokers may exist as live-account options — never as competing prop firms.
 */

export type PartnerKind = "broker" | "prop_firm";
export type TradingStyle = "manual" | "bots";

export interface ActivePartner {
  id: string;
  name: string;
  kind: PartnerKind;
  kindLabel: string;
  href: string;
}

/** Exclusive recommended prop firm. Not a multi-firm list. */
export const EXCLUSIVE_PROP_PARTNER = {
  id: "e8-markets",
  name: E8_FIRM_NAME,
  kind: "prop_firm" as const,
  kindLabel: "Exclusive prop partner",
  href: E8_AFFILIATE_URL,
  dashboardHref: E8_DASHBOARD_PATH,
};

/**
 * Live-account / broker options only. Never shown as equal prop recommendations.
 * Hidden from homepage and dashboard default routing.
 */
export const LIVE_ACCOUNT_BROKERS: readonly ActivePartner[] = [
  {
    id: "herofx",
    name: "HeroFX",
    kind: "broker",
    kindLabel: "Broker",
    href: HEROFX_PARTNER_URL,
  },
  {
    id: "risen-fx",
    name: "Risen FX",
    kind: "broker",
    kindLabel: "Broker",
    href: "https://secure.risenfx.com/links/go/3587",
  },
] as const;

/**
 * @deprecated Do not use for default routing. Competing prop firms are not recommended.
 * Kept as an empty list so old imports do not render a multi-firm marketplace.
 */
export const ACTIVE_PARTNERS: readonly ActivePartner[] = [];

export const PARTNER_ROUTING_QUESTION =
  "Are you planning to run the Quicksilver automated bots (EAs), or are you looking to use our manual/discretionary trading arsenal?";

export const PARTNER_ROUTING_OPTIONS = {
  bots: {
    id: "bots" as const,
    label: "Automated / Quant Protocol",
    shortLabel: "Automated",
    description: "Optional Quant Protocol on TradeLocker Desktop — Premium, operator-supervised",
  },
  manual: {
    id: "manual" as const,
    label: "Manual / discretionary stack",
    shortLabel: "Manual",
    description: "Workflow, journal, playbook, risk presets, live growth terminal",
  },
} as const;

export function getPartnerFraming(style: TradingStyle): {
  headline: string;
  intro: string;
  highlight: string;
} {
  if (style === "manual") {
    return {
      headline: `${E8_FIRM_NAME} + the manual stack`,
      intro: `${E8_EXCLUSIVE_LINE} Use the playbook, risk presets, journal, and live growth terminal. Brokers below are live-account options only — not competing prop firms.`,
      highlight:
        "Manual first. Quant Protocol stays optional on Premium. Bot not included in free trial.",
    };
  }

  return {
    headline: `${E8_FIRM_NAME} + optional Quant Protocol`,
    intro: `${E8_EXCLUSIVE_LINE} Quant Protocol is operator-supervised on TradeLocker Desktop. Brokers below are live-account options only.`,
    highlight:
      "The bot is Premium-only and not set-and-forget. You still supervise risk, sessions, and official E8 rules.",
  };
}

export function getPartnerKindBadgeVariant(
  kind: PartnerKind
): "success" | "warning" {
  return kind === "broker" ? "success" : "warning";
}
