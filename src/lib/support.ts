/** Live inbox until support@ is connected in Google/Resend. */
export const CANONICAL_SUPPORT_EMAIL = "supportteam@quicksilveralgo.com";

const BLOCKED_SUPPORT_ALIASES = new Set(["support@quicksilveralgo.com"]);

function resolveSupportEmail(): string {
  const raw = process.env.SUPPORT_EMAIL?.trim();
  if (!raw || BLOCKED_SUPPORT_ALIASES.has(raw.toLowerCase())) {
    return CANONICAL_SUPPORT_EMAIL;
  }
  return raw;
}

/** Primary support mailbox (inbound + reply-to). */
export const SUPPORT_EMAIL = resolveSupportEmail();

export const SUPPORT_MAILTO = `mailto:${SUPPORT_EMAIL}`;

export const SUPPORT_HOURS = "Monday–Friday, 9:00 AM – 6:00 PM ET";

/** Public anti-impersonation policy. Do not add Discord/Telegram as official support. */
export const OFFICIAL_CONTACT_POLICY = {
  email: CANONICAL_SUPPORT_EMAIL,
  loginUrl: "https://quicksilveralgo.com/login",
  oneOnOne: "Google Meet only, scheduled by email after you are a client",
  never: [
    "Discord",
    "Telegram",
    "WhatsApp",
    "Instagram DMs",
    "random Google Meet links we did not email you",
  ],
} as const;

export const SUPPORT_RESPONSE_SLA = {
  free: "2–3 business days",
  premium: "1 business day",
};

export interface FaqItem {
  id: string;
  category: string;
  question: string;
  answer: string;
}

export const FAQ_CATEGORIES = [
  "Getting Started",
  "Billing & Premium",
  "Chart Academy",
  "Trading Tools",
  "Trading",
  "Prop Firms",
  "Account & Technical",
] as const;

export const SITE_FAQS: FaqItem[] = [
  {
    id: "what-is-quicksilver",
    category: "Getting Started",
    question: "What is Quicksilver Algo?",
    answer:
      "Quicksilver is the TradeLocker Desktop operating system for traders who need structure, risk control, journaling, growth tracking, and optional supervised automation in one stack. It serves live-account traders using the growth terminal and prop-challenge / evaluation traders via a dedicated prop module. We are not a broker and do not provide personalized investment advice.",
  },
  {
    id: "only-for-prop",
    category: "Getting Started",
    question: "Is Quicksilver only for prop traders?",
    answer:
      "No. Any TradeLocker trader can use the desk. Live growth, academy, and tools do not require an E8 account. E8 Markets is the recommended prop firm; the E8 Execution Center is the hub if you want that path.",
  },
  {
    id: "manual-without-bot",
    category: "Getting Started",
    question: "Can manual traders use Quicksilver without the bot?",
    answer:
      "Yes. The core system is built for manual operators. The bot is optional.",
  },
  {
    id: "free-vs-premium",
    category: "Getting Started",
    question: "What is included in the free tier?",
    answer:
      "Free accounts get one full lesson, one charting guide, and the Setup Scorer planning module. You can preview all other lessons and tools before upgrading. 3-day trial available on request. Bot not included.",
  },
  {
    id: "trial-includes",
    category: "Billing & Premium",
    question: "Is the bot included in the free trial?",
    answer:
      "No. 3-day trial available on request. Bot not included. The trial covers the workflow/manual stack. Quant Protocol requires Premium.",
  },
  {
    id: "first-month-discount",
    category: "Billing & Premium",
    question: "What is the first-month discount?",
    answer:
      "30% off the first month ($104.99), then $149.99/mo. That path is the full Premium stack, including Quant Protocol access request on TradeLocker Desktop.",
  },
  {
    id: "how-to-register",
    category: "Getting Started",
    question: "How do I create an account?",
    answer:
      "Click Get Access or Register, enter your email and password, then complete onboarding by choosing Free or Premium. Free users enter the dashboard immediately; Premium users subscribe via Stripe.",
  },
  {
    id: "premium-price",
    category: "Billing & Premium",
    question: "How much does Premium cost?",
    answer:
      "Default public offer is first month 30% off ($104.99), then $149.99/mo. That is the full Premium stack, including Quant Protocol access request on TradeLocker Desktop. 3-day trial available on request. Bot not included.",
  },
  {
    id: "prop-firm-playbook",
    category: "Prop Firms",
    question: "What is the 7-Day Prop Firm Playbook?",
    answer:
      "A Premium guide at quicksilveralgo.com/guides/prop-firm-one-week with daily profit caps, consistency checks, and tasks wired to QS planning tools. Follow the plan across seven sessions to hit a typical 8–10% profit target without breaching the 20% best-day consistency rule most firms enforce.",
  },
  {
    id: "local-trading-tools",
    category: "Trading Tools",
    question: "What are the Premium Trading Tools?",
    answer:
      "Three proprietary calculators — Strategy Expectancy Validator, Dynamic ATR Pip-Range, and Prop Firm Compounding Matrix. All three are included with Premium alongside the six QS Planning Modules. Browse previews at quicksilveralgo.com/tools or unlock inside Dashboard → Trading Tools.",
  },
  {
    id: "cancel-subscription",
    category: "Billing & Premium",
    question: "How do I cancel or change my subscription?",
    answer:
      `Email ${SUPPORT_EMAIL} with the subject line "Billing" and include the email on your Quicksilver account. We will help you manage cancellation or plan changes through Stripe.`,
  },
  {
    id: "refund-policy",
    category: "Billing & Premium",
    question: "What is your refund policy?",
    answer:
      `Premium is a monthly subscription billed through Stripe. You can cancel anytime to stop future billing. For billing errors or payment issues, email ${SUPPORT_EMAIL} with subject "Billing" and the email on your account. We do not offer a general money-back guarantee on subscription fees.`,
  },
  {
    id: "lesson-access",
    category: "Chart Academy",
    question: "How many lessons are in Chart Academy?",
    answer:
      "Chart Academy covers chart reading, candlesticks, market structure, Fibonacci, trading styles, forex, CFDs, and a prop firm playbook. Free members get selected intro lessons; Premium unlocks the full library.",
  },
  {
    id: "lesson-progress",
    category: "Chart Academy",
    question: "Is my lesson progress saved?",
    answer:
      "Lesson completion is tracked in your browser for now. Log in from the same device to continue your learning path. Contact support if you need help recovering progress.",
  },
  {
    id: "tools-list",
    category: "Trading Tools",
    question: "What planning tools are included?",
    answer:
      "Premium includes nine planning engines: Edge Confluence, Risk Matrix, Prop Survival, Execution Protocol, Regime Oracle, Alpha Durability, plus Expectancy Validator, ATR Pip-Range, and Compounding Matrix. Each tool connects to the 7-day prop firm playbook workflow.",
  },
  {
    id: "broker-connection",
    category: "Trading Tools",
    question: "Does Quicksilver connect to my broker?",
    answer:
      "Planning tools work on any charting platform — no broker connection required. TradeLocker integration is optional for bot execution and live dashboard features only.",
  },
  {
    id: "e8-exclusive",
    category: "Prop Firms",
    question: "Is E8 Markets the only recommended prop firm?",
    answer:
      "E8 Markets is the recommended prop firm and in-house collab partner. The E8 Execution Center covers challenge rules, risk presets, and Direct Signup. You can use Quicksilver without an E8 account. HeroFX and Risen FX are live-account broker options only.",
  },
  {
    id: "recommended-partners",
    category: "Trading",
    question: "Which brokers or prop firms do you recommend?",
    answer:
      "E8 Markets is the recommended prop firm. Open the E8 Execution Center at /e8 if you want that path. You do not need an E8 account to use live growth, academy, or tools. HeroFX and Risen FX are live-account brokers only. Quant Protocol remains optional Premium.",
  },
  {
    id: "tradelocker-setup",
    category: "Trading",
    question: "How do I connect TradeLocker?",
    answer:
      "Premium members open Trading in the dashboard, connect TradeLocker credentials, and use the live terminal plus four account tools. You must accept the risk disclaimer before connecting.",
  },
  {
    id: "bot-guarantee",
    category: "Trading",
    question: "Does the bot guarantee profits?",
    answer:
      "No. Automated and manual trading involve substantial risk. Past backtests do not guarantee future results. Read the TradeLocker disclaimer and only risk capital you can afford to lose.",
  },
  {
    id: "prop-firm-pass",
    category: "Prop Firms",
    question: "Will Quicksilver help me pass a prop firm challenge?",
    answer:
      "Quicksilver is the workflow stack for E8 Markets traders: playbook, E8-mapped risk presets, journal, and live growth tools. It does not guarantee a pass, payout, or funded account. You can lose the evaluation fee and trading capital. Official rules are set by E8 Markets.",
  },
  {
    id: "prop-firm-rules",
    category: "Prop Firms",
    question: "Are prop firm rules in the tools up to date?",
    answer:
      "Risk presets are educational software guardrails. Always verify current official E8 Markets rules on E8’s site before trading an evaluation.",
  },
  {
    id: "password-reset",
    category: "Account & Technical",
    question: "I forgot my password. What do I do?",
    answer:
      `Email ${SUPPORT_EMAIL} from your registered address with the subject "Password Reset" and we will assist you.`,
  },
  {
    id: "email-change",
    category: "Account & Technical",
    question: "How do I change my account email?",
    answer:
      `Send a request to ${SUPPORT_EMAIL} from your current registered email with the subject "Email Change" and your new address.`,
  },
  {
    id: "technical-issues",
    category: "Account & Technical",
    question: "Something is not working. How do I get help?",
    answer:
      `Email ${SUPPORT_EMAIL} with a description of the issue, your browser, and screenshots if possible. Premium members receive responses within ${SUPPORT_RESPONSE_SLA.premium}; free accounts within ${SUPPORT_RESPONSE_SLA.free}.`,
  },
  {
    id: "contact-support",
    category: "Account & Technical",
    question: "How do I contact support?",
    answer:
      `Official support is email only: ${SUPPORT_EMAIL}. Include your account email and a clear subject. We do not use Discord, Telegram, WhatsApp, or Instagram DMs for billing, bot access, or support. Paid 1-on-1 sessions are Google Meet only and are scheduled through that same email — never a cold Discord add. Log in only at https://quicksilveralgo.com/login.`,
  },
  {
    id: "impersonation",
    category: "Account & Technical",
    question: "Someone messaged me on Discord / chat claiming to be Quicksilver. Is that you?",
    answer:
      `No. Quicksilver staff will not DM you on Discord or other chat apps for support, payments, or bot access. If someone does, it is not us. Do not send money, passwords, or card details. Email ${SUPPORT_EMAIL} and we will confirm from this domain. The only live video we use with clients is Google Meet that we schedule by email.`,
  },
];

export function getFaqsByCategory(category: string): FaqItem[] {
  return SITE_FAQS.filter((faq) => faq.category === category);
}

export const SUPPORT_TOPICS = [
  {
    title: "Billing & subscriptions",
    description: "Upgrades, cancellations, and Stripe receipts",
    subject: "Billing",
  },
  {
    title: "Account access",
    description: "Login issues, password resets, and email changes",
    subject: "Account",
  },
  {
    title: "Chart Academy",
    description: "Lessons, guides, progress, and content access",
    subject: "Academy",
  },
  {
    title: "Trading tools",
    description: "Planning modules, exports, and tool access by tier",
    subject: "Tools",
  },
  {
    title: "TradeLocker & bot",
    description: "Connection, bot activation, dashboard, and positions",
    subject: "TradeLocker",
  },
  {
    title: "Technical issues",
    description: "Bugs, errors, browser issues, and feature requests",
    subject: "Technical",
  },
] as const;

export function buildSupportMailto(subject: string, body?: string): string {
  const params = new URLSearchParams();
  if (subject) params.set("subject", `Quicksilver Support — ${subject}`);
  if (body) params.set("body", body);
  const query = params.toString();
  return query ? `${SUPPORT_MAILTO}?${query}` : SUPPORT_MAILTO;
}