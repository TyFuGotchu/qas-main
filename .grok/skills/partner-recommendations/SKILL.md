---
name: partner-recommendations
description: >
  How Quicksilver presents recommended brokers and prop firms. Use whenever a
  user asks about recommended platforms, funding, brokers, prop firms, partners,
  "where should I trade", Risen FX, FunderPro, or affiliate links. Enforces
  ask-first routing (bots vs manual), the active partner list only, and style-
  specific framing. Never show pending partners.
---

# Partner recommendations (brokers & prop firms)

Follow this structure **exactly** when users ask about recommended platforms, funding, brokers, or prop firms.

## 1. Routing phase (ask first)

**Before any links**, identify trading style with this direct question:

> Are you planning to run the Quicksilver automated bots (EAs), or are you looking to use our manual/discretionary trading arsenal?

**Rule:** Do not dump all partner links at once. Wait for their answer, then tailor framing.

## 2. Universal partner list (after they answer)

Same list for **both** manual traders and bot/EA runners:

- **Risen FX (Broker):** https://secure.risenfx.com/links/go/3587
- **FunderPro (Prop Firm):** https://funderpro.cxclick.com/visit/?bta=49026&brand=funderpro

Source of truth in the product: `src/lib/partners.ts` → `ACTIVE_PARTNERS`.

## 3. Presentation rules

Use clear bullet points. Frame by their answer:

### Manual / discretionary

- Call these excellent top-tier platforms for **manual execution**.
- **Must** highlight that both platforms **fully allow trading bots and EAs**.
- Frame that as a benefit: if they later scale into Quicksilver automation, they will not need to switch brokers/firms.

### Bot / EA runners

- Give the same links.
- **Heavily emphasize** these platforms are verified by us **because** they explicitly allow bots/EAs and are optimized for Quicksilver algorithms (including Quant Protocol where TradeLocker is used).
- Reminder when relevant: Quant Protocol runs on **TradeLocker Desktop**, not TradeLocker Web.

## 4. Pending platforms (internal only — never display)

Keep in memory only. **Do not name, recommend, or link** these until the user (owner) green-lights live URLs:

- Goat Funded Trader (GFT)
- AquaFunded
- HeroFX
- Lucid Trading

## Product UI

Dashboard/homepage use `PartnerRecommendationFlow` (ask-first, then list). Do not reintroduce HeroFX or other pending names into user-facing UI.