export const HOME_ANNOUNCEMENT =
  "TradeLocker Desktop only. Premium Quant includes Quant Protocol + the full prop-challenge stack. $149.99/mo, cancel anytime.";

export const HOME_HERO = {
  eyebrow: "TradeLocker Desktop • Prop Challenge OS • Operator-Supervised Automation",
  h1: "Run a cleaner prop-firm challenge. Don’t just fire trades.",
  subhead:
    "Quicksilver is the operating system for TradeLocker traders who need daily loss control, consistency discipline, and an optional bot that stays out of dead tape.",
  bullets: [
    "Built around common 8–10% targets and 5% daily loss limits",
    "Quant Protocol waits for directional conditions instead of overtrading chop",
    "Playbook, risk engines, journal, and academy included in one plan",
  ],
  microcopy:
    "Educational tools only. You still supervise risk, sessions, and your firm’s rules. Not a promise you will pass.",
} as const;

export const HOME_FOR = [
  "Prop-firm traders on TradeLocker Desktop",
  "Traders who keep blowing consistency or daily loss",
  "Manual traders who want a structured 7-day plan",
  "Systematic traders who want supervised automation, not a black box",
] as const;

export const HOME_NOT_FOR = [
  "TradeLocker Web-only users",
  "Anyone looking for set-and-forget income",
  "Martingale / grid / recovery-lot systems",
  "Traders who will ignore stops and session filters",
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
    question: "Is this a guaranteed way to pass a prop firm?",
    answer:
      "No. It is a framework and tool stack. You can still lose. Prop firms have different rules. You are responsible for following yours.",
  },
  {
    question: "Does the bot work on TradeLocker Web?",
    answer: "No. Quant Protocol is TradeLocker Desktop only.",
  },
  {
    question: "Do I buy the bot separately?",
    answer:
      "No. Access is included in Premium Quant at $149.99/mo. Request access on the TradeLocker Hub with the same email you use for Desktop.",
  },
  {
    question: "Is this set and forget?",
    answer: "No. You supervise risk, sessions, symbols, and firm rules.",
  },
  {
    question: "What markets is it aimed at?",
    answer:
      "Discussed around XAGUSD, XAUUSD, EURUSD, and NAS100. Confirm symbol availability and specs with the broker or prop firm.",
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
    title: "Subscribe to Premium Quant",
    text: "$149.99/mo, cancel anytime. No separate bot license.",
  },
  {
    step: 3,
    title: "Request access on TradeLocker Hub",
    text: "Use the same email as TradeLocker Desktop — not Web.",
  },
  {
    step: 4,
    title: "Enable the bot only on approved symbols/sessions",
    text: "Copy published settings (NAS100 is live). Match lot size to your equity.",
  },
  {
    step: 5,
    title: "Keep playbook caps on while any evaluation is active",
    text: "Daily loss, consistency, and session filters still apply. You supervise the desk.",
  },
] as const;
