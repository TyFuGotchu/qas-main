---
name: partner-recommendations
description: >
  How Quicksilver presents recommended brokers and prop firms. Use whenever a
  user asks about recommended platforms, funding, brokers, prop firms, partners,
  "where should I trade", Risen FX, HeroFX, FunderPro, or affiliate links.
  Enforces ask-first routing (bots vs manual), the full active partner list,
  and style-specific framing. Never invent pending firms without links.
---

# Partner recommendations (brokers & prop firms)

Follow this structure **exactly** when users ask about recommended platforms, funding, brokers, or prop firms.

## 1. Routing phase (ask first)

**Before any links**, identify trading style with this direct question:

> Are you planning to run the Quicksilver automated bots (EAs), or are you looking to use our manual/discretionary trading arsenal?

**Rule:** Do not dump all partner links at once. Wait for their answer, then tailor framing.

## 2. Universal partner list (after they answer)

Same list for **both** manual traders and bot/EA runners. **Include every active affiliate link** (maximize revenue paths):

- **Risen FX (Broker):** https://secure.risenfx.com/links/go/3587
- **HeroFX (Broker):** use product `HEROFX_PARTNER_URL` / default `https://herofx.co/?partner_code=9149459` (override env `HEROFX_PARTNER_LINK` if set)
- **FunderPro (Prop Firm):** https://funderpro.cxclick.com/visit/?bta=49026&brand=funderpro

Source of truth: `src/lib/partners.ts` → `ACTIVE_PARTNERS`.

## 3. Presentation rules

Use clear bullet points. Frame by their answer:

### Manual / discretionary

- Call these excellent platforms for **manual execution**.
- **Must** highlight that these platforms **allow trading bots and EAs**.
- Frame that as a benefit: if they later scale into Quicksilver automation, they will not need to switch brokers/firms.

### Bot / EA runners

- Give the **same full list** of partner links.
- Emphasize these platforms allow bots/EAs and work with Quicksilver algorithms (including Quant Protocol where TradeLocker is used).
- Reminder when relevant: Quant Protocol runs on **TradeLocker Desktop**, not TradeLocker Web.

## 4. Pending platforms (no live link yet — do not invent URLs)

Do not recommend until the owner adds a live affiliate URL to `ACTIVE_PARTNERS`:

- Goat Funded Trader (GFT)
- AquaFunded
- Lucid Trading

## Product UI

Dashboard/homepage: `PartnerRecommendationFlow` (ask-first, then full active list including HeroFX).