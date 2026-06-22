export interface PropFirmDayPlan {
  day: number;
  title: string;
  profitCapPercent: number;
  maxRiskPercent: number;
  focus: string;
  tasks: string[];
  consistencyCheck: string;
}

export interface PropFirmOneWeekGuide {
  slug: string;
  title: string;
  description: string;
  consistencyTargetPercent: number;
  overview: string[];
  consistencyRules: string[];
  dailyPlans: PropFirmDayPlan[];
  faqs: { question: string; answer: string }[];
}

export const PROP_FIRM_ONE_WEEK_GUIDE: PropFirmOneWeekGuide = {
  slug: "prop-firm-one-week",
  title: "Pass Your Prop Firm Challenge in 1 Week",
  description:
    "A day-by-day manual trading playbook to hit your profit target in seven sessions while keeping your consistency score at or below 20% — the threshold most funded programs require.",
  consistencyTargetPercent: 20,
  overview: [
    "This guide assumes a standard 2-phase or 1-phase challenge with an 8–10% profit target, 5% max daily loss, and 10% max trailing drawdown. Adjust lot sizes in the Prop Survival module if your firm uses different rules.",
    "The 20% consistency rule means your single best profitable day cannot exceed 20% of your total accumulated profit toward the target. Spread gains evenly — one hero day will fail consistency on most prop platforms.",
    "You will trade fewer times with higher selectivity. Every day has a profit cap so you never outrun the consistency meter.",
  ],
  consistencyRules: [
    "Track cumulative profit daily: Consistency % = (Best Day Profit ÷ Total Profit) × 100. Keep this ≤ 20% at all times.",
    "If a day produces more than 20% of running total profit, stop trading immediately — bank the day and do not add to the tally until other days catch up.",
    "Cap each winning day at roughly 1.4–1.8% account growth when targeting 8% in 7 days (≈1.15% average per day with buffer).",
    "Never exceed 0.5–1.0% risk per trade. Two losses in a row ends the session — protect the daily loss limit.",
    "Run every setup through Edge Confluence (score ≥ 70) and Risk Matrix before entry. Log each trade for Alpha Durability review.",
    "Use Prop Survival before day 1 to confirm your win rate and R:R support a ≥60% pass probability at your planned frequency.",
  ],
  dailyPlans: [
    {
      day: 1,
      title: "Foundation & First Strike",
      profitCapPercent: 1.5,
      maxRiskPercent: 0.75,
      focus: "Establish rhythm without overtrading",
      tasks: [
        "Pre-market: mark HTF structure, liquidity pools, and session open levels on XAUUSD or NAS100.",
        "Maximum 2 trades — only A+ setups with full confluence alignment.",
        "Target +1.0% to +1.5% account; stop session at +1.5% regardless of open positions quality.",
        "Journal: screenshot entry, confluence score, and planned R:R before clicking buy/sell.",
      ],
      consistencyCheck:
        "Day 1 profit = 100% of total so far — acceptable on day 1 only. From day 2 onward, enforce the 20% cap.",
    },
    {
      day: 2,
      title: "Controlled Build",
      profitCapPercent: 1.4,
      maxRiskPercent: 0.75,
      focus: "Add profit without creating a spike day",
      tasks: [
        "Review day 1 journal — one improvement for entry timing or stop placement.",
        "Maximum 2 trades; if day 1 was green, reduce size by 10% to stay calm.",
        "Target +1.0% to +1.4%; hard stop at +1.4% account.",
        "Recalculate consistency: best day ÷ total profit must stay ≤ 20%.",
      ],
      consistencyCheck:
        "If day 1 was +1.5% and you add +1.4%, total = 2.9%. Best day (1.5) ÷ 2.9 = 51.7% — TOO HIGH. Cap day 2 at +0.6% max to bring ratio down, or skip if setups are weak.",
    },
    {
      day: 3,
      title: "Midweek Balance",
      profitCapPercent: 1.3,
      maxRiskPercent: 0.5,
      focus: "Even distribution — no hero trades",
      tasks: [
        "Run Regime Oracle: only trade if session bias matches your playbook direction.",
        "Maximum 2 trades; 0.5% risk per trade after two consecutive green days.",
        "Target +1.0% to +1.3%; stop at cap even if 8% target feels close.",
        "Update running consistency score in Prop Survival inputs.",
      ],
      consistencyCheck:
        "Aim for three days each contributing roughly equal slices of total profit (±15% of daily average).",
    },
    {
      day: 4,
      title: "Red Day Protocol",
      profitCapPercent: 1.2,
      maxRiskPercent: 0.5,
      focus: "Survive drawdown without breaching daily limit",
      tasks: [
        "If cumulative profit ≥ 3.5%, you may take only 1 trade today — preservation mode.",
        "If red on day 3, today is recovery: 1 trade max, 0.5% risk, +0.8% target only.",
        "Never revenge trade; -2% daily closes the terminal.",
        "Re-run Prop Survival with updated win rate if you took losses.",
      ],
      consistencyCheck:
        "Red days help consistency math — a small green day after red is ideal for keeping best-day ratio low.",
    },
    {
      day: 5,
      title: "Acceleration Window",
      profitCapPercent: 1.4,
      maxRiskPercent: 0.75,
      focus: "Push toward 6–7% cumulative without spiking",
      tasks: [
        "Trade London–NY overlap only; 2 high-quality setups maximum.",
        "Scale risk back to 0.75% only if cumulative drawdown < 2% and consistency ≤ 18%.",
        "Target +1.2% to +1.4%; verify consistency after every closed trade.",
        "If within 1.5% of profit target, switch to 0.5% risk and single trade.",
      ],
      consistencyCheck:
        "Before each trade, ask: 'If I win full R:R, does my best day still stay under 20% of new total?'",
    },
    {
      day: 6,
      title: "Target Approach",
      profitCapPercent: 1.2,
      maxRiskPercent: 0.5,
      focus: "Close the gap methodically",
      tasks: [
        "Calculate remaining % to target; divide by 2 days for daily budget.",
        "Do not exceed daily budget even if setups are perfect — consistency matters for payout.",
        "1–2 trades; partials at 1R to lock consistency-friendly gains.",
        "Export Risk Matrix PNG for personal accountability post.",
      ],
      consistencyCheck:
        "If one day dominates profit, add a micro-green day 7 (+0.3%) rather than another large win.",
    },
    {
      day: 7,
      title: "Finish & Verify",
      profitCapPercent: 1.0,
      maxRiskPercent: 0.5,
      focus: "Cross the line cleanly",
      tasks: [
        "If target already hit with consistency ≤ 20%, stop — do not trade for excitement.",
        "If 0.5–1.5% short, one trade only at 0.5% risk during highest-probability session.",
        "Screenshot final equity curve and consistency calculation for records.",
        "Submit challenge; begin funded phase with same daily caps until payout rules clear.",
      ],
      consistencyCheck:
        "Final audit: Best Day ÷ Total Profit ≤ 20%. If over, delay submission until additional small green days rebalance.",
    },
  ],
  faqs: [
    {
      question: "What is the 20% consistency rule on prop firms?",
      answer:
        "Most firms calculate consistency as your largest single profitable day divided by total profit earned toward the target. If that ratio exceeds 20%, you fail the consistency requirement even after hitting the profit goal. This guide caps daily gains so you never breach that threshold.",
    },
    {
      question: "Can I pass an 8% challenge in one week?",
      answer:
        "Yes, with ~1.15% average daily growth across 7 trading days you reach ~8% while keeping days evenly sized. The playbook prioritizes survival and consistency over speed — skipping a day is better than a blow-up.",
    },
    {
      question: "Which QS tools should I use with this guide?",
      answer:
        "Start with Prop Survival to validate pass probability, Edge Confluence for setup scoring, Risk Matrix for daily heat, and Alpha Durability to confirm your journal edge supports the plan.",
    },
    {
      question: "What if I hit the profit target but fail consistency?",
      answer:
        "Keep trading small, controlled green days until the best-day ratio drops below 20%. Do not withdraw or celebrate early — many firms auto-flag consistency on submission.",
    },
  ],
};