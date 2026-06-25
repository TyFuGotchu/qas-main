export const SUPPORT_EMAIL = "support@quicksilveralgo.com";

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
      "Premium is $149.99/month and includes everything — Chart Academy, all six QS Planning Modules, TradeLocker bot access, and priority email support. Use promo code FIRST100 for $60 off your first month (first 100 users).",
  },
  {
    id: "first100-promo",
    category: "Billing & Premium",
    question: "How do I use the FIRST100 promo code?",
    answer:
      "Enter FIRST100 at Stripe checkout when subscribing to Premium. Your first month is $89.99 instead of $149.99. The code is limited to the first 100 redemptions.",
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
      `Contact ${SUPPORT_EMAIL} within 7 days of your first Premium charge if you believe there was a billing error. Refund requests are reviewed case by case.`,
  },
  {
    id: "lesson-access",
    category: "Chart Academy",
    question: "How many lessons are in Chart Academy?",
    answer:
      "Chart Academy includes 89 interactive lessons across chart reading, candlesticks, market structure, Fibonacci, trading styles, and a prop firm playbook. Premium unlocks the full library.",
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
      "Premium includes Setup Scorer (Edge Confluence), Risk Matrix, Prop Survival Engine, Execution Protocol, Regime Oracle, and Alpha Durability — six institutional planning modules for manual traders.",
  },
  {
    id: "broker-connection",
    category: "Trading Tools",
    question: "Does Quicksilver connect to my broker?",
    answer:
      "Planning tools work on any charting platform — no broker connection required. TradeLocker integration is optional for bot execution and live dashboard features only.",
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
      "Our Prop Survival Engine and consistency tools help you plan risk and simulate drawdown paths. We do not guarantee challenge passes — you execute all trades yourself.",
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
    description: "Upgrades, FIRST100 promo, cancellations, and Stripe receipts",
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