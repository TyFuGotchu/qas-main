import type { AcademyCategory } from "../types";

export const forexCategory: AcademyCategory = {
  id: "forex",
  title: "Forex Trading",
  description:
    "How to trade the global FX market as a manual trader — pairs, sessions, pips, spreads, and TradeLocker execution for prop-style risk.",
  sections: [
    {
      id: "forex-foundations",
      title: "Forex Foundations",
      description:
        "Core concepts every forex trader needs before placing size on TradeLocker or any CFD broker.",
      lessons: [
        {
          id: "what-is-forex-trading",
          title: "What Is Forex Trading?",
          summary:
            "Forex (foreign exchange) is the market where currencies are traded in pairs. This free lesson covers how FX works, why it runs 24/5, and how manual traders approach it.",
          body: [
            "Forex is the global market for exchanging one currency for another. You never buy “EUR” alone — you trade a pair such as EURUSD (euro vs US dollar). The first currency is the base; the second is the quote. If EURUSD rises, the euro is strengthening against the dollar.",
            "Unlike stocks that close on a national exchange schedule, major forex pairs trade nearly 24 hours a day, five days a week as liquidity rolls from Asia to London to New York. That creates sessions with different character: quieter Asia ranges, London breakouts, and NY overlap volatility.",
            "Retail traders access FX through brokers — often via platforms like TradeLocker — as CFDs or spot-style contracts. You are trading the broker’s price stream, not buying banknotes. Spreads, swaps, and margin rules matter as much as your chart setup.",
            "Manual forex trading still rests on structure: bias (higher timeframe), session filter, clean levels, and defined risk. Indicators are optional; reading who is in control of the pair is not.",
            "This free lesson is your map. Premium unlocks deeper FX modules: pairs and pips, session playbooks, TradeLocker execution habits, and prop-firm-aware risk for funded challenges.",
          ],
          keyPoints: [
            "Forex trades currency pairs (base vs quote), not single currencies.",
            "The market is open ~24/5 as global sessions rotate.",
            "Retail access is usually via a broker platform (e.g. TradeLocker).",
            "Spread, margin, and session liquidity affect real results.",
            "Structure and risk come before indicators.",
          ],
          manualTips: [
            "Pick one major pair (EURUSD or GBPUSD) for 30 days before adding crosses.",
            "Mark London and NY open on your chart — note how the pair behaves each session.",
            "Write the pair as “base/quote” aloud when you first study it (EUR/USD).",
            "Disable cluttered indicators until you can mark swings and sessions by hand.",
          ],
          difficulty: "beginner",
        },
        {
          id: "currency-pairs-and-pips",
          title: "Currency Pairs, Pips & Position Size",
          summary:
            "Majors, minors, crosses, pip value, and how position size on TradeLocker maps to risk per trade.",
          body: [
            "Major pairs include USD on one side (EURUSD, GBPUSD, USDJPY, USDCHF, USDCAD, AUDUSD, NZDUSD). Crosses exclude USD (e.g. EURGBP). Exotics pair a major with a thinner currency and usually have wider spreads.",
            "A pip is the standard minimum price move for most pairs (0.0001 for EURUSD-style quotes; 0.01 for JPY pairs). Pip value depends on pair, account currency, and lot size — never risk “random lots.”",
            "On TradeLocker and similar platforms, volume is often in lots or units. Your risk formula is still: risk $ = account equity × risk %; stop distance in pips → size so that stop hit ≈ risk $.",
            "Prop challenges care about daily loss and consistency. Smaller, repeatable FX risk (0.5–0.75% per trade) beats oversized “one pip miracle” trades.",
            "Practice sizing on demo first: same stop distance, different lots — see how P&L scales before going live.",
          ],
          keyPoints: [
            "Majors vs crosses vs exotics differ in liquidity and spread.",
            "Pips are the unit of price movement; value depends on size and pair.",
            "Position size is driven by stop distance and risk %, not gut feel.",
            "Wide-spread pairs punish tight scalps.",
            "Prop rules favor small, consistent FX risk.",
          ],
          manualTips: [
            "Build a one-page sheet: pair, typical spread, average daily range, your max risk %.",
            "Use the live Position Sizer (Premium) against real TradeLocker equity.",
            "Avoid exotics during your first funded challenge.",
            "Journal spread at entry — high spread can erase edge on small targets.",
          ],
          difficulty: "beginner",
        },
        {
          id: "forex-sessions-and-liquidity",
          title: "Forex Sessions & Liquidity",
          summary:
            "Asia, London, New York — when pairs move, when they chop, and how to filter trades by session.",
          body: [
            "Asia session often ranges on EURUSD/GBPUSD while JPY and AUD pairs can be more active. London open frequently injects direction. New York can continue London trends or reverse into the US data window.",
            "Liquidity is highest when major centers overlap (London–NY). Spreads tighten; fake breaks are less common but still present around news.",
            "Manual traders pick a session and specialize. Trading every hour invites overtrading and prop rule breaches.",
            "High-impact news (NFP, CPI, central banks) can gap spreads and spike stops. Either sit out or reduce size — structure after the print is cleaner than gambling the release.",
            "Align session with pair: JPY pairs for Asia; EUR/GBP for London; indices and USD pairs for NY if you also trade CFDs.",
          ],
          keyPoints: [
            "Session choice is a filter, not a side hobby.",
            "Overlaps = more liquidity and cleaner participation.",
            "News widens spreads — plan for it.",
            "Specialize in 1–2 sessions for consistent stats.",
            "Chop in off-hours is a feature, not a bug.",
          ],
          manualTips: [
            "Block your calendar: “I only trade London open ±2 hours.”",
            "Screenshot the same pair at Asia close vs London open for a week.",
            "If you trade prop challenges, define session in your written plan.",
            "Disable alerts outside your session to reduce FOMO.",
          ],
          difficulty: "intermediate",
        },
      ],
    },
    {
      id: "forex-tradelocker",
      title: "Forex on TradeLocker",
      description:
        "Platform habits for executing FX on a next-gen TradeLocker stack.",
      lessons: [
        {
          id: "trading-forex-on-tradelocker",
          title: "Trading Forex on TradeLocker",
          summary:
            "Order types, chart workflow, and discipline when executing FX through TradeLocker.",
          body: [
            "TradeLocker is a modern multi-asset platform used by many prop and retail brokers. For forex, treat it as your execution layer: charts for bias, platform for size, stop, and flatten.",
            "Know your order types: market, limit, stop. Prefer defined risk (stop attached) especially on funded accounts. Never leave a live FX position without a hard stop unless your written plan explicitly allows it.",
            "Platform speed is not an edge if your plan is random. Pre-define entry, stop, and target before clicking. Use the same workspace every day so execution is mechanical.",
            "If you run Quicksilver Quant Protocol, understand what the algo manages vs what you still supervise (margin, news, account rules). Automation does not remove prop-firm risk limits.",
            "Reconcile platform P&L with your journal after each session — catch fat-finger size errors early.",
          ],
          keyPoints: [
            "TradeLocker is execution; your plan is still the edge filter.",
            "Hard stops protect prop daily loss limits.",
            "Consistent workspace reduces mistakes.",
            "Bots need supervision for account-level risk.",
            "Journal platform fills, not just screenshots.",
          ],
          manualTips: [
            "Create a “challenge” workspace with max two pairs and no clutter.",
            "Practice one-click flatten on demo before live.",
            "Map keyboard/hotkeys for cancel and close-all if available.",
            "After each trade, log: pair, session, size, stop pips, result R.",
          ],
          difficulty: "intermediate",
        },
        {
          id: "forex-spread-swap-margin",
          title: "Spreads, Swaps & Margin on FX",
          summary:
            "How costs and leverage turn a good chart idea into a bad trade — and how to stay funded.",
          body: [
            "Spread is the cost of entry/exit. Scalping 2-pip targets on a 1.5-pip spread is a losing game before edge. Match strategy hold time to cost.",
            "Swap (rollover) is the cost or credit of holding overnight. Swing FX trades must account for it; intraday often avoids most swaps.",
            "Margin is borrowed capacity. High leverage lets you oversize — prop firms and good process punish that. Use leverage for flexibility, not maximum exposure.",
            "Margin calls and stop-outs are platform realities. Know your broker’s margin % and how multi-pair correlation multiplies risk (EURUSD + GBPUSD are not independent).",
            "Funded challenges: treat max daily loss as sacred. FX volatility around news can hit limits faster than equity sessions.",
          ],
          keyPoints: [
            "Spread must fit your target size.",
            "Swaps matter for multi-day holds.",
            "Leverage is a tool, not a strategy.",
            "Correlated pairs stack risk.",
            "Daily loss limits beat “one more trade.”",
          ],
          manualTips: [
            "List each pair’s average spread at your session open.",
            "If target < 3× spread, skip the setup.",
            "Cap open FX risk across correlated pairs (e.g. max 1% combined).",
            "Avoid holding through major USD news unless planned.",
          ],
          difficulty: "intermediate",
        },
      ],
    },
  ],
};
