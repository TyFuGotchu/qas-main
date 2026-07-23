import { getHeroFxPartnerLink } from "@/lib/env";

export const TRADELOCKER_BOT_URL =
  "https://tradelocker.com/hub/bots/quicksilver-quant-protocol-the-apex-institutional-engine";

/** HeroFX affiliate — also listed in ACTIVE_PARTNERS. Override via HEROFX_PARTNER_LINK. */
export const HEROFX_PARTNER_URL = getHeroFxPartnerLink();
