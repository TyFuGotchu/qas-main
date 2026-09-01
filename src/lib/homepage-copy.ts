import {
  DISCOUNT_FIRST_MONTH_PRICE,
  PREMIUM_PRICE,
  TRIAL_PRICE_TODAY,
} from "@/lib/pricing-constants";

export const HOME_ANNOUNCEMENT =
  "Official E8 Markets Partner | E8 Execution Center — Challenges, Rules, Direct Signup";

export const HOME_HERO = {
  eyebrow: "Official E8 Markets Partner • TradeLocker Desktop • Trading OS",
  h1: "Trade with structure, not impulse.",
  subhead:
    "Quicksilver is an execution + risk workflow stack for E8 Markets traders on TradeLocker — structure, risk presets, journaling, live growth tools, and optional supervised automation.",
  bullets: [
    "E8-exclusive routing — one recommended prop firm, not a multi-firm marketplace",
    "Risk presets for evaluation discipline: daily-loss and trailing-drawdown awareness",
    "Live growth terminal for funded and live-account operators",
    "Manual traders welcome. Optional Quant Protocol is Premium.",
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
  title: "E8 Execution Center — exclusive prop partner, not the whole product",
  subhead:
    "E8 Markets is the exclusive recommended prop firm. Challenge traders get E8-mapped risk presets, playbook, and rule-aware workflow. Live growth tools stay first-class for funded and live accounts.",
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
  chooserLabel: "First month 30% off, or request a 3-day trial",
  microcopy:
    "Cancel anytime. Educational tools only. Trading is high risk. Not financial advice. 3-day trial available on request. Bot not included.",
  trial: {
    name: "3-Day Trial",
    price: TRIAL_PRICE_TODAY,
    priceNote: "on request",
    then: `Then ${PREMIUM_PRICE}/mo if you continue`,
    body: "3-day trial available on request. Bot not included.",
    exclusion: "Bot not included in free trial",
    extra:
      "Workflow, journal, planning, live growth, and prop tools as enabled for trial. Admin grants access. Not a self-serve Stripe checkout.",
    cta: "Request 3-day trial",
    heroCta: "Request 3-day trial",
  },
  discount: {
    name: "First Month 30% Off",
    price: DISCOUNT_FIRST_MONTH_PRICE,
    priceNote: "first month",
    then: `Then ${PREMIUM_PRICE}/mo`,
    body: "Default Premium path including Quant Protocol access request on TradeLocker Desktop",
    extra: "Eligible for Quant Protocol on TradeLocker Desktop. Priority support included.",
    cta: "Start Premium — first month 30% off",
    heroCta: "Start Premium — first month 30% off with code E8",
  },
} as const;

export const HOME_LANDING_PREMIUM_CTA =
  "Start Premium — first month 30% off with code E8";
export const HOME_LANDING_CODE_HINT = "Use code E8 on Quicksilver checkout.";

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
      "No. It includes live growth terminal tools for live-account traders, plus the E8 Execution Center for evaluations. E8 Markets is the exclusive recommended prop firm — not the entire product.",
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
    answer: `30% off the first month (${DISCOUNT_FIRST_MONTH_PRICE}) with code E8 on Quicksilver checkout, then ${PREMIUM_PRICE}/mo.`,
  },
  {
    question: "How do I start Premium?",
    answer: `Start Premium — first month 30% off with code E8. Use code E8 on Quicksilver checkout (${DISCOUNT_FIRST_MONTH_PRICE} first month, then ${PREMIUM_PRICE}/mo).`,
  },
  {
    question: "Which prop firm does Quicksilver recommend?",
    answer:
      "E8 Markets is the exclusive recommended prop firm. Open the E8 Execution Center for rules, risk presets, and direct signup. Competing prop firms are not listed as equal options.",
  },
  {
    question: "Is this a guaranteed way to pass a prop firm?",
    answer:
      "No. It is a framework and tool stack. You can lose the evaluation fee and trading capital. Official account rules are set by E8 Markets. Quicksilver does not guarantee a pass, payout, or funded account.",
  },
  {
    question: "Does the bot work on TradeLocker Web?",
    answer: "No. Quant Protocol is TradeLocker Desktop only.",
  },
  {
    question: "Do I buy the bot separately?",
    answer: `No. Quant Protocol access is part of Premium Quant at ${PREMIUM_PRICE}/mo. Request access on the TradeLocker Hub with the same email you use for Desktop.`,
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
    title: "Choose trial or first-month discount",
    text: `3-day free trial is ${TRIAL_PRICE_TODAY} today, then ${PREMIUM_PRICE}/mo — bot not included. First month 30% off is ${DISCOUNT_FIRST_MONTH_PRICE}, then ${PREMIUM_PRICE}/mo — full Premium path.`,
  },
  {
    step: 3,
    title: "Request Quant Protocol on TradeLocker Hub (Premium)",
    text: "Use the same email as TradeLocker Desktop — not Web. Not available on the free trial.",
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
