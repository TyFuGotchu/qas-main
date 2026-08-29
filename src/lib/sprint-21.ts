/** 21-day $1k sprint — admin only. */

export const SPRINT_GOAL = "$1,000 in ~21 days";

export const SPRINT_MATH = [
  "7 Premium at $149.99 = ~$1,050",
  "Or mix: 4 Premium (~$600) + affiliates + ~14 x $29 kits (~$400)",
  "Or ~35 kit sales alone = $1,015",
];

export const SPRINT_DAILY = [
  {
    week: 1,
    title: "Cash + visibility",
    days: [
      "Post arsenal video or 1 Reel + 1 X with /quant-protocol AND /challenge-kit",
      "Reply same-day to every inbound (bot request, support, DMs)",
      "Send kit offer to people who said price is the blocker for Premium",
      "Confirm Railway green + Stripe Premium checkout works",
      "If someone asks where to trade: E8 Markets is the exclusive prop firm. Then ask bots vs manual. Brokers (HeroFX / Risen FX) are live-account options only.",
    ],
  },
  {
    week: 2,
    title: "Convert warm",
    days: [
      "Personal follow-up to bot requesters who opened/replied (not another identical bulk)",
      "1:1 close: Premium = stack + desktop bot. Kit = $29 paper system.",
      "Pin challenge-kit + Premium posts on X/IG",
      "Count cash mid-week. Double down on whatever sold.",
    ],
  },
  {
    week: 3,
    title: "Close the gap",
    days: [
      "No new products. Close remaining maybes.",
      "Schedule next week’s 5 posts so it doesn’t die after the sprint",
      "If short of $1k: more 1:1, not more code",
    ],
  },
];

export const SPRINT_EMAILS = {
  kitToWarm: `Subject: $29 paper system if Premium isn't the move yet

Quick note — if $149.99/mo isn't the right step this week, I put the 7-day challenge process on paper:

Daily caps, consistency math, printable tracker. $29 one-time.

https://quicksilveralgo.com/challenge-kit

If you want the full stack (live tracker, tools, academy, Quant Protocol on TradeLocker Desktop), Premium is still here:

https://quicksilveralgo.com/quant-protocol

Reply KIT or PREMIUM and I'll send the exact next step.

Tyler
Quicksilver Algo`,

  premiumClose: `Subject: Quant Protocol + the full stack

Following up on your TradeLocker / Quicksilver request.

Premium Quant is $149.99/mo — bot on TradeLocker Desktop + playbook + tools + academy + guidance. Not a free demo EA.

How access works: https://quicksilveralgo.com/quant-protocol

If you want the paper challenge system only: $29 kit → https://quicksilveralgo.com/challenge-kit

Reply PREMIUM or KIT.

Tyler`,
};
