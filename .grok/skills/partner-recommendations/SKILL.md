---
name: partner-recommendations
description: >
  How Quicksilver presents recommended brokers and prop firms. Use whenever a
  user asks about recommended platforms, funding, brokers, prop firms, partners,
  "where should I trade", E8 Markets, HeroFX, or affiliate links. E8 Markets is
  the exclusive recommended prop firm. Never list competing prop firms. Never
  invent pending firms or live referral URLs.
---

# Partner recommendations

Follow this structure **exactly** when users ask about recommended platforms, funding, brokers, or prop firms.

## 1. Exclusive prop firm

**E8 Markets is the only recommended prop firm.**

Primary line:

> Quicksilver is the execution + risk workflow stack for E8 Markets traders on TradeLocker.

Route them to:

- Public: `/e8` (E8 Execution Center)
- Dashboard: `/dashboard/e8`

Do **not** recommend FunderPro, FTMO, Apex, FundedNext, Topstep, Goat Funded Trader, AquaFunded, Lucid Trading, or any other prop firm as a Quicksilver partner.

## 2. Routing phase (after E8, not instead of E8)

Keep the bot vs manual split as a **secondary** step:

> Are you planning to run the Quicksilver automated bots (EAs), or are you looking to use our manual/discretionary trading arsenal?

Do not dump a multi-firm list. E8 stays first.

## 3. Brokers (live-account options only)

HeroFX and Risen FX may be mentioned **only** as live-account / broker options — never as competing prop recommendations.

- **HeroFX (Broker):** product `HEROFX_PARTNER_URL` / default `https://herofx.co/?partner_code=9149459` (override env `HEROFX_PARTNER_LINK`)
- **Risen FX (Broker):** https://secure.risenfx.com/links/go/3587

Source of truth: `src/lib/e8-partner.ts` and `src/lib/partners.ts` (`LIVE_ACCOUNT_BROKERS`).

## 4. Placeholders — do not invent live terms

If the E8 referral, discount code, or bundle is not live, say **Coming Soon** or **Partner Preview**. Placeholders:

- `E8_REFERRAL_LINK` → `NEXT_PUBLIC_E8_REFERRAL_LINK`
- `CODE_QUICKSILVER`
- `CODE_E8LAUNCH`
- `BUNDLE_CHECKOUT_LINK`

Do not promise a guaranteed pass, payout, or funded account.

## 5. Framing

### Manual / discretionary

- E8 Execution Center + Quicksilver workflow, journal, presets, live growth terminal.
- Bot is optional Premium.

### Bot / EA runners

- Same exclusive prop partner: E8 Markets.
- Quant Protocol is TradeLocker **Desktop** only, operator-supervised, not in the free trial.

## Product UI

Dashboard/homepage: E8 Execution Center first. `PartnerRecommendationFlow` is secondary bot/manual routing only — no competing prop list.
