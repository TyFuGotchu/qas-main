import { getHeroFxPartnerLink } from "@/lib/env";

export const TRADELOCKER_BOT_URL =
  "https://tradelocker.com/hub/bots/quicksilver-quant-protocol-the-apex-institutional-engine";

/** HeroFX affiliate — live-account broker option only, not a competing prop firm. Override via HEROFX_PARTNER_LINK. */
export const HEROFX_PARTNER_URL = getHeroFxPartnerLink();
