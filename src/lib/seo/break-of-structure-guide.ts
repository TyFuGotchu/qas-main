/** High-intent educational page targeting GSC queries around BOS. */

export const BOS_GUIDE_PATH = "/guides/break-of-structure";

export const BOS_GUIDE = {
  path: BOS_GUIDE_PATH,
  title: "Break of Structure (BOS) in Trading: Meaning & How to Trade It",
  metaDescription:
    "What is break of structure (BOS) in trading? Clear definition, bullish vs bearish BOS, BOS vs liquidity sweep, and how to trade the retest. Free chart examples.",
  h1: "What Is Break of Structure (BOS) in Trading?",
  publishedAt: "2026-07-20",
  keywords: [
    "break of structure",
    "break of structure trading",
    "bos in trading",
    "bos trading",
    "bos means in trading",
    "what is bos trading",
  ],
  intro:
    "Break of structure (BOS) is one of the most searched ideas in modern price-action trading. In plain English: BOS means price closed beyond a prior swing high or swing low in the direction of the existing trend — a continuation signal, not a reversal.",
  directAnswer:
    "BOS (break of structure) means price breaks a previous swing extreme in the trend’s direction: a new higher high in an uptrend, or a new lower low in a downtrend. Manual traders usually require a candle close beyond the level — not a wick alone — before calling it BOS.",
  sections: [
    {
      heading: "Break of structure meaning (BOS definition)",
      paragraphs: [
        "Market structure is built from swing highs and swing lows. In an uptrend you typically see higher highs (HH) and higher lows (HL). In a downtrend: lower lows (LL) and lower highs (LH).",
        "A break of structure is when price takes out the most recent swing extreme that defined the trend. Bullish BOS: close above the last swing high while the bias is still up. Bearish BOS: close below the last swing low while the bias is still down.",
        "If you searched “bos means in trading,” that is the full answer: BOS = structure break in the direction of the trend. The opposite idea is change of character (CHoCH), which breaks structure against the prior trend and can signal a reversal.",
      ],
    },
    {
      heading: "Bullish vs bearish BOS",
      paragraphs: [
        "Bullish BOS: market has been making HHs/HLs. Price then closes above the last confirmed swing high. Traders often look for a retest of that broken high (old resistance → new support) before buying.",
        "Bearish BOS: market has been making LLs/LHs. Price closes below the last confirmed swing low. Traders may sell a retest of the broken low (old support → new resistance).",
        "Always define the timeframe first. A 1-minute BOS against a clean daily uptrend is noise. Align lower-timeframe BOS with higher-timeframe bias.",
      ],
    },
    {
      heading: "BOS vs liquidity sweep (the difference that saves accounts)",
      paragraphs: [
        "A liquidity sweep (or stop hunt) wicks through a high/low, triggers stops, then closes back inside the range. There is no acceptance beyond the level.",
        "BOS requires acceptance: typically a close beyond the swing, then often a retest that holds on the broken side with follow-through.",
        "Rule of thumb: pierce and reclaim = sweep. Pierce and hold with a close = BOS developing. Wait for the next candle when the first print is only a wick.",
      ],
    },
    {
      heading: "How to trade break of structure (practical models)",
      paragraphs: [
        "Retest model (highest quality for most discretionary traders): wait for BOS close → wait for pullback into the broken level → enter on rejection → stop beyond the retest extreme → target next liquidity or measured move.",
        "Momentum model: enter on the BOS close or next continuation candle. Faster, but worse average entry and more failed BOS risk. Use only when higher timeframe trend is strong and the session is liquid.",
        "Failed BOS rule: if price closes back through the broken level against your trade, treat structure as invalid and scratch. Hoping is not a plan.",
      ],
    },
    {
      heading: "Common mistakes with BOS trading",
      paragraphs: [
        "Trading every 1m BOS without HTF filter — overtrading and reverse snipes.",
        "Calling a wick a BOS — entering sweeps and getting trapped.",
        "Chasing a giant BOS candle with no retest — often the worst R:R of the day.",
        "Ignoring session context — structure breaks into dead liquidity often fail.",
      ],
    },
    {
      heading: "How BOS connects to prop firm challenges",
      paragraphs: [
        "Prop firm rules punish overtrading and oversized hero days. BOS retest setups force patience: fewer trades, clearer invalidation, and defined risk — which fits daily loss limits and consistency rules.",
        "Use BOS as a filter inside a written plan (max trades, risk %, profit cap). Quicksilver’s 7-Day Prop Firm Playbook pairs structure discipline with those risk constraints.",
      ],
    },
  ],
  faqs: [
    {
      question: "What does BOS mean in trading?",
      answer:
        "BOS stands for break of structure. It means price broke a prior swing high (bullish) or swing low (bearish) in the direction of the current trend, usually confirmed by a candle close beyond that level.",
    },
    {
      question: "What is break of structure trading?",
      answer:
        "Break of structure trading uses BOS as a continuation signal. Common entries are the retest of the broken level, a pullback into an order block after BOS, or a momentum entry on the break itself with a wider stop.",
    },
    {
      question: "Is BOS the same as a breakout?",
      answer:
        "They overlap, but BOS is specifically a break of a prior swing that defines market structure in a trend. A random range breakout may not be a BOS if there is no established HH/HL or LL/LH sequence.",
    },
    {
      question: "BOS vs CHoCH — what’s the difference?",
      answer:
        "BOS continues the existing trend (break of the last high in an uptrend, last low in a downtrend). CHoCH (change of character) breaks the last protected swing against the trend and can signal a potential reversal.",
    },
    {
      question: "Do I need indicators for BOS?",
      answer:
        "No. BOS is pure price action: swing labels and closes. Some traders add volume or session filters, but the structure definition does not require RSI, MACD, or moving averages.",
    },
  ],
  relatedLessons: [
    {
      href: "/lessons/market-structure-what-is-bos",
      label: "Lesson: What Is Break of Structure (BOS)?",
    },
    {
      href: "/lessons/market-structure-bos-vs-liquidity-sweep",
      label: "Lesson: BOS vs Liquidity Sweep",
    },
    {
      href: "/lessons/market-structure-trading-bos",
      label: "Lesson: Trading Break of Structure",
    },
    {
      href: "/guides/market-structure",
      label: "Full Market Structure charting guide",
    },
    {
      href: "/launch",
      label: "7-Day Prop Firm Playbook",
    },
  ],
} as const;
