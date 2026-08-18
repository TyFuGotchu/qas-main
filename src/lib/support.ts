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
      "Quicksilver is manual-trading education and planning software. You analyze charts, score setups, plan risk, and optionally connect TradeLocker for bot execution. We are not a broker and do not provide personalized investment advice.",
  },
  {
    id: "free-vs-premium",
    category: "Getting Started",
    question: "What is included in the free tier?",
    answer:
      "Free accounts get one full lesson, one charting guide, and the Setup Scorer planning module. You can preview all other lessons and tools before upgrading to Premium.",
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
      "Premium is $149.99/month for the full stack: Quant Protocol on TradeLocker, the 7-Day Prop Firm Playbook (day-by-day challenge plan under the 20% consistency rule), all nine planning engines and Trading Tools, Chart Academy, and priority email support.",
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
    id: "recommended-partners",
    category: "Trading",
    question: "Which brokers or prop firms do you recommend?",
    answer:
      "First tell us your workflow: Quicksilver automated bots (EAs) or manual/discretionary trading. Active partner links for both: Risen FX and HeroFX (brokers) and FunderPro (prop firm) — bot/EA friendly. Full list with framing is on the dashboard under Recommended platforms.",
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
      "Premium unlocks the 7-Day Prop Firm Playbook — daily profit caps, consistency rules, and QS tool workflows designed to pass a standard challenge in one week. Prop Survival simulates pass probability before day one. We do not guarantee passes — you execute every trade yourself.",
  },
  {
    id: "prop-firm-rules",
    category: "Prop Firms",
    question: "Are prop firm rules in the tools up to date?",
    answer:
      "Prop firm parameters in demos and SEO pages are illustrative. Always verify current rules on the firm's official website before trading a challenge.",
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
      `All support requests go to ${SUPPORT_EMAIL}. Include your account email, a clear subject line, and as much detail as possible. We do not offer phone or live chat support at this time.`,
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