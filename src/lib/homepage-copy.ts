import { PREMIUM_PRICE } from "@/lib/pricing-constants";

export const HOME_ANNOUNCEMENT =
  "TradeLocker desk for traders · Arsenals for prop firms";

export const HOME_HERO = {
  eyebrow: "TradeLocker Desktop • Trading OS",
  h1: "A TradeLocker desk for traders.",
  subhead:
    "Quicksilver is a TradeLocker desk — planning, risk, journal, live growth, and optional supervised automation. You do not need an E8 account. E8 Markets is the recommended prop firm if you want that path.",
  bullets: [
    "Works with any TradeLocker account — manual, funded, live, or another firm",
    "Live growth terminal for funded and live-account operators",
    "E8 Execution Center if you want the E8 path — Rule Desk, presets, hard equity-stop",
    "Optional Quant Protocol is Premium — TradeLocker Desktop, not in a trial",
  ],
  microcopy:
    "Educational tools only. Cancel anytime. Official E8 rules are set by E8 Markets. Quicksilver does not guarantee a pass, payout, or funded account. Trading is high risk. Not financial advice.",
} as const;

export const HOME_WORKFLOW = [
  {
    step: "01",
    title: "Plan",
    text: "Pre-trade planning and risk calculation before you execute — size, invalidation, and session intent on the desk.",
  },
  {
    step: "02",
    title: "Execute",
    text: "Take the trade you planned. The stack is built for manual operators first, with optional automation later.",
  },
  {
    step: "03",
    title: "Enforce",
    text: "Live risk guards and rule-break awareness so pressure is visible before it becomes a breach.",
  },
  {
    step: "04",
    title: "Journal",
    text: "Journal the session, not just the P&L — emotion, discipline, and habit tracking with the trade record.",
  },
  {
    step: "05",
    title: "Review",
    text: "Post-session review closes the loop so the next session starts from evidence, not impulse.",
  },
] as const;

export const HOME_LIVE_GROWTH = {
  eyebrow: "Path B · Live accounts",
  title: "Live growth terminal",
  subhead:
    "Built for live-account operators who need exposure, risk, and account-health visibility in one desk — not a separate spreadsheet stack.",
  points: [
    "Live growth terminal for real-account operators",
    "Exposure and risk visibility while the session is open",
    "Growth dashboard and account-health tracking",
    "Session review tools after the close",
    "Optional Quant Protocol for supervised automation on Premium",
  ],
} as const;

export const HOME_PROP_MODULE = {
  eyebrow: "Path A · E8 evaluation",
  title: "E8 Execution Center — recommended prop partner, not the whole product",
  subhead:
    "E8 Markets is the recommended prop firm. The E8 Execution Center is the hub if you want that path. Live growth, academy, and tools stay available to any TradeLocker trader.",
  points: [
    "E8 Execution Center: rules, direct signup, risk presets",
    "Daily-loss and trailing-drawdown awareness as software guardrails",
    "Playbook and journal for evaluation discipline",
    "Catch rule pressure before it becomes a breach — not a guaranteed pass",
  ],
} as const;

export const HOME_TRADELOCKER = {
  title: "Native to TradeLocker Desktop",
  subhead:
    "Quicksilver is built for TradeLocker Desktop operators. The workflow stack, live growth terminal, and prop module live in one product. Quant Protocol runs on Desktop only — not TradeLocker Web.",
  points: [
    "TradeLocker Desktop native desk",
    "Live terminal tools on connected accounts",
    "Quant Protocol is Desktop only",
    "Same email for Quicksilver and Hub access requests",
  ],
} as const;

export const HOME_QUANT = {
  title: "Quant Protocol — optional, operator-supervised",
  subhead:
    "Automation is part of Premium, not the product identity. Quant Protocol is an optional layer for traders who already have a workflow. It is not set-and-forget.",
  premiumNote: "Premium only",
  points: [
    "Optional Quant Protocol on TradeLocker Desktop",
    "Operator-supervised — you still own risk, sessions, and rules",
    "Not set-and-forget. Not a black box income claim",
    "Enable Quant Protocol with Premium",
  ],
} as const;

export const HOME_COMPARISON = {
  title: "Scattered tools vs Quicksilver",
  scattered: {
    label: "Scattered tools",
    items: [
      "Separate journal",
      "Separate risk calculator",
      "Separate notes",
      "Separate bot",
      "No unified workflow",
    ],
  },
  stack: {
    label: "Quicksilver",
    items: [
      "One stack from plan → execute → journal → review",
      "TradeLocker Desktop native",
      "Live growth terminal included",
      "Prop module included",
      "Manual first, optional bot on Premium",
    ],
  },
} as const;

export const HOME_PRICING = {
  title: "Choose how you want to start",
  chooserLabel: "Tools $39.99 · Copy $99 · Full $119.99",
  microcopy:
    "Cancel anytime. Educational tools only. Trading is high risk. Not financial advice. Bot is a separate Desk flag.",
  trial: {
    name: "Tools",
    price: "$39.99",
    priceNote: "/mo",
    then: "Risk desk. Bot not included.",
    body: "Rule Desk, presets, flatten, journal, live terminal.",
    exclusion: "Bot not included in Tools",
    extra: "Quant Protocol is a separate Desktop flag.",
    cta: "Tools $39.99",
    heroCta: "Tools $39.99",
  },
  discount: {
    name: "Full",
    price: PREMIUM_PRICE,
    priceNote: "/mo",
    then: "Tools + Copy",
    body: "Risk desk plus TV→TradeLocker copy (not live until alert JSON is wired).",
    extra: "No public coupons.",
    cta: "See pricing",
    heroCta: "See pricing",
  },
} as const;

export const HOME_LANDING_PREMIUM_CTA = "See pricing — $39.99 / $99 / $119.99";
export const HOME_LANDING_CODE_HINT = "No public coupons.";

export const HOME_FOR = [
  "Live-account traders who want a growth terminal, risk visibility, and a review loop",
  "Prop-challenge and evaluation traders who need rule-aware structure",
  "Funded traders who still need daily-loss and consistency discipline",
  "Manual operators who want the workflow stack without a bot",
  "Systematic traders who want optional supervised automation on Premium",
] as const;

export const HOME_NOT_FOR = [
  "TradeLocker Web-only users looking to run Quant Protocol",
  "Anyone looking for set-and-forget income",
  "Martingale / grid / recovery-lot systems",
  "Traders who will ignore stops, session filters, and their own rules",
] as const;

export const HOME_QUANT_CHIPS = [
  "ADX / directional filter",
  "HTF alignment check",
  "ATR-scaled stop and target",
  "One-position logic on published NAS100 set",
  "Risk-off / held states when conditions are poor",
] as const;

export const HOME_FAQS: { question: string; answer: string }[] = [
  {
    question: "Is Quicksilver only for prop traders?",
    answer:
      "No. Any TradeLocker trader can use the desk. Live growth, academy, and tools do not require an E8 account. E8 Markets is the recommended prop firm; the E8 Execution Center is the hub if you want that path.",
  },
  {
    question: "Is Quant Protocol included with Premium?",
    answer:
      "Yes. Quant Protocol access is part of Premium. It is optional, operator-supervised, and TradeLocker Desktop only.",
  },
  {
    question: "Can manual traders use Quicksilver without the bot?",
    answer:
      "Yes. The core system is built for manual operators. The bot is optional.",
  },
  {
    question: "What is the first-month discount?",
    answer: "There is no public 30% coupon. Plans are Tools $39.99, Copy $99, Full $119.99.",
  },
  {
    question: "How do I start a paid plan?",
    answer: "Open /pricing. Tools $39.99, Copy $99, Full $119.99. No public coupons.",
  },
  {
    question: "Which prop firm does Quicksilver recommend?",
    answer:
      "E8 Markets is the recommended prop firm. Open the E8 Execution Center for rules, risk presets, and Direct Signup. You can use Quicksilver without an E8 account.",
  },
  {
    question: "Is this a guaranteed way to pass a prop firm?",
    answer:
      "No. It is a framework and tool stack. You can lose the evaluation fee and trading capital. Official E8 rules are set by E8 Markets. Quicksilver does not guarantee a pass, payout, or funded account.",
  },
  {
    question: "Does the bot work on TradeLocker Web?",
    answer: "No. Quant Protocol is TradeLocker Desktop only.",
  },
  {
    question: "Do I buy the bot separately?",
    answer:
      "Quant Protocol is a separate TradeLocker Desktop flag. It is not bundled into Tools $39.99.",
  },
  {
    question: "Is this set and forget?",
    answer: "No. You supervise risk, sessions, symbols, and firm or broker rules.",
  },
  {
    question: "What markets is it aimed at?",
    answer:
      "Discussed around XAGUSD, XAUUSD, EURUSD, and NAS100. Confirm symbol availability and specs with E8 Markets or your live-account broker.",
  },
  {
    question: "How do I cancel?",
    answer: "Cancel anytime from your billing / profile flow or Stripe receipt portal.",
  },
];

export const QUANT_PROTOCOL_STEPS = [
  {
    step: 1,
    title: "Create Quicksilver profile",
    text: "Register with the email you actually use.",
  },
  {
    step: 2,
    title: "Pick a Desk plan",
    text: "Tools $39.99 is the risk desk (bot not included). Copy $99 is the TV webhook. Full is $119.99. See /pricing.",
  },
  {
    step: 3,
    title: "Request Quant Protocol on TradeLocker Hub",
    text: "Desktop only — not Web. Bot is a separate Desk flag.",
  },
  {
    step: 4,
    title: "Enable the bot only on approved symbols/sessions",
    text: "Copy published settings (NAS100 is live). Match lot size to your equity.",
  },
  {
    step: 5,
    title: "Keep risk and session filters on",
    text: "Daily loss, consistency, and session filters still apply. You supervise the desk.",
  },
] as const;
