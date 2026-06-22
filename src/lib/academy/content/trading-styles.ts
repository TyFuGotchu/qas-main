import type { AcademyCategory } from "../types";

export const tradingStylesCategory: AcademyCategory = {
  id: "trading-styles",
  title: "Trading Styles & Methodologies",
  description:
    "Explore how manual traders approach scalping, day trading, swing trading, ICT-style concepts, and supply & demand — each with distinct timeframes, risk rules, and chart focus.",
  sections: [
    {
      id: "scalping",
      title: "Scalping",
      description:
        "Capture small, rapid price moves with tight risk control and intense focus on execution.",
      lessons: [
        {
          id: "what-is-scalping",
          title: "What Is Scalping?",
          summary:
            "Scalping is a manual style focused on many small profits from short-lived price movements, usually closed within minutes.",
          body: [
            "Scalpers aim to extract small slices of price movement repeatedly — often 5 to 20 ticks, pips, or cents per trade — rather than holding for large swings. Positions are typically open from seconds to a few minutes, rarely hours.",
            "The scalper's edge comes from reading immediate order flow through price action: tape speed, level reactions, spread behavior, and micro structure on 1-minute or tick charts. Indicators lag too much for pure scalping; the chart and DOM (if available) lead.",
            "Costs matter enormously. Spread, commissions, and slippage eat scalping edge faster than swing trading edge. Manual scalpers choose liquid instruments during active sessions and avoid wide-spread names.",
            "Scalping demands focus. You cannot scalp effectively while distracted. Sessions are short — many successful manual scalpers trade only 1–3 hours when their market is most liquid.",
            "Scalping is not gambling on noise. The best manual scalpers have rules: defined levels, max daily loss, fixed share/lot size, and a small set of repeatable micro setups.",
          ],
          keyPoints: [
            "Targets are small; frequency and consistency matter more than home runs.",
            "Liquid markets and active sessions reduce spread/slippage damage.",
            "Micro structure and level reactions drive decisions.",
            "Focus and session length are limited — quality over marathon hours.",
            "Strict daily loss limits are non-negotiable.",
          ],
          manualTips: [
            "Track all-in cost per round trip (spread + commission) — your average win must clear it comfortably.",
            "Trade one instrument for 30 sessions before adding another — micro behavior differs.",
            "Use a timer: 90-minute focus blocks with mandatory breaks reduce tilt scalping.",
            "If three consecutive losses occur, stop 15 minutes — micro tilt compounds fast.",
          ],
          difficulty: "advanced",
        },
        {
          id: "scalping-timeframes-setups",
          title: "Scalping Timeframes and Setups",
          summary:
            "Use higher timeframes for bias and 1-minute or tick charts for precise entries at known levels.",
          body: [
            "A common manual stack: 15-minute or 1-hour bias, 5-minute setup zone, 1-minute trigger. The HTF tells you only longs above X or shorts below Y; the LTF gives the entry candle at that zone.",
            "Repeatable micro setups include: liquidity sweep of equal lows followed by reclaim, break and retest of opening range high/low, fade of overextension into VWAP (intraday), and compression break inside the first hour range.",
            "Entries often use limit orders at retest levels or stop orders beyond micro structure confirmation. Market orders are reserved for fast breaks where limit fills would be missed — accept slippage as a planned cost.",
            "Targets are modest: next micro swing, partial at 1R, runner only if structure trends clearly. Holding for swing targets on a scalp entry usually means you changed styles mid-trade — a common mistake.",
            "Chart cleanliness is critical. One HTF level, session marks, and maybe VWAP — more overlays slow decisions when you have seconds to act.",
          ],
          keyPoints: [
            "HTF bias + LTF trigger is the standard scalping stack.",
            "Favor repeatable setups: sweeps, break-retest, opening range plays.",
            "Targets stay modest — do not turn scalps into swings emotionally.",
            "Limit vs market order choice affects fill quality — plan both.",
            "Minimal chart markup for speed.",
          ],
          manualTips: [
            "Mark opening range after first 15–30 minutes — many scalps reference it all day.",
            "Pre-define two setups you will trade today; ignore all others.",
            "Screenshot winning scalps and note exact trigger — build a micro playbook.",
            "If average hold time drifts past 30 minutes routinely, you are day trading, not scalping — adjust rules.",
          ],
          difficulty: "advanced",
        },
        {
          id: "scalping-risk-management",
          title: "Scalping Risk Management",
          summary:
            "Tight stops, fixed size, and hard daily limits protect against death by a thousand cuts.",
          body: [
            "Risk per scalp should be small fraction of daily budget — many manual scalpers risk 0.1–0.25% of account per trade with 2–5% daily max loss before full stop. Because frequency is high, per-trade risk must be tiny.",
            "Stops belong beyond micro structure invalidation, not at arbitrary pip counts. If the stop required is too wide for your size rules, skip the trade — wide stops and scalping labels do not mix.",
            "Position size is often fixed (same shares/lots every trade) to remove mid-session math. Change size only between sessions based on account growth or drawdown rules.",
            "Correlation risk: five simultaneous micro longs in correlated names equals one large bet. Manual scalpers cap concurrent exposure.",
            "Review daily: number of trades, gross P&L, net after costs, largest loser. Scalping improvement is statistical — need volume of data with disciplined sameness.",
          ],
          keyPoints: [
            "Small per-trade risk % because trade count is high.",
            "Hard daily loss cap — walk away when hit.",
            "Stops at structure invalidation, not arbitrary distances.",
            "Fixed size simplifies execution under pressure.",
            "Track costs and trade count daily.",
          ],
          manualTips: [
            "Use a physical clicker or journal tally for trade count — overtrading sneaks up.",
            "Set broker daily loss lockout if available — removes willpower from the equation.",
            "Calculate breakeven win rate given your avg win/loss and costs — know the math cold.",
            "Never widen a scalp stop 'just this once' — that is how scalpers become bag holders.",
          ],
          difficulty: "advanced",
        },
      ],
    },
    {
      id: "day-trading",
      title: "Day Trading",
      description:
        "Open and close positions within the same session using intraday structure, levels, and session rhythm.",
      lessons: [
        {
          id: "day-trading-fundamentals",
          title: "Day Trading Fundamentals",
          summary:
            "Day traders capture intraday moves without overnight exposure, relying on session structure and liquid hours.",
          body: [
            "Day trading means all positions are closed before your session ends — no overnight gap risk. Trades may last minutes to hours but share the same calendar day. Manual day traders anchor to cash session hours for stocks or London/NY for forex.",
            "Edge sources include: opening drive and reversal patterns, trend legs between session levels, breakouts from overnight range, and reactions to prior day high/low/close. The prior day leaves a map; today's auction tests it.",
            "Day trading allows larger intraday targets than scalping — 0.5–2% on stocks, 20–80 pips on forex majors in volatile conditions — but requires patience to wait for A+ setups instead of overtrading boredom.",
            "Pre-market preparation is standard: mark prior day levels, overnight high/low, economic calendar, and HTF bias. When the bell rings, you execute a plan — you do not discover levels live.",
            "Manual day trading succeeds with boring consistency: same routine, same max trades (e.g., 3 per day), same review process. Excitement is not a performance metric.",
          ],
          keyPoints: [
            "Flat by session end — no overnight holds by definition.",
            "Prior day H/L/C and overnight range are primary reference levels.",
            "Targets larger than scalps; selectivity still required.",
            "Pre-session preparation is mandatory for consistency.",
            "Cap daily number of trades to prevent overtrading.",
          ],
          manualTips: [
            "Create a one-page pre-market template: bias, levels, events, max loss, max trades.",
            "Mark prior day close — magnets and pivot references intraday.",
            "Avoid new entries in last 30 minutes unless that is your proven edge (e.g., MOC fade).",
            "Record screen on best and worst day monthly — behavior patterns reveal themselves.",
          ],
          difficulty: "intermediate",
        },
        {
          id: "intraday-structure-levels",
          title: "Intraday Structure and Key Levels",
          summary:
            "Read developing day structure — opening range, session highs/lows, and VWAP — for bias and entries.",
          body: [
            "Intraday structure forms as the day progresses: opening range, first pullback, trend leg, lunch compression, afternoon continuation or reversal. Mark session high and low continuously — they are live structure.",
            "Prior day high, low, and close often act as magnets. Price frequently tests one in the first two hours. Manual traders note which were taken out and which held — that informs bias.",
            "VWAP (volume-weighted average price) is a dynamic intraday fair value reference for stocks and liquid futures. Trading above VWAP with bullish structure supports long bias; below supports short — not as rigid law but useful filter.",
            "Opening range breakout (ORB) strategies enter when price closes beyond the first X-minute range in bias direction, stop other side. False ORBs are common — combine with HTF bias and prior day location.",
            "Midday chop (often 11:30–14:00 ET for US stocks) destroys many morning profits. Manual traders reduce size or stop trading until afternoon trend reasserts.",
          ],
          keyPoints: [
            "Session high/low update throughout the day — live structure.",
            "Prior day H/L/C are high-probability reaction zones.",
            "VWAP helps gauge intraday bullish/bearish balance on equities.",
            "Opening range strategies need HTF context to avoid false breaks.",
            "Midday often mean-reverts or chops — adapt activity.",
          ],
          manualTips: [
            "Color prior day levels differently from today's developing levels.",
            "Note in journal whether day is 'trend' or 'balance' by 11am — adapts afternoon plan.",
            "If morning trend fails at prior day high, afternoon reversal trades go on watch.",
            "Do not fight VWAP all day — repeated failures to reclaim suggest dominant side.",
          ],
          difficulty: "intermediate",
        },
        {
          id: "day-trading-playbook",
          title: "Building a Day Trading Playbook",
          summary:
            "Document 3–5 core intraday setups with entry, stop, target, and invalidation rules.",
          body: [
            "A playbook is your personal manual of setups that you have traded, reviewed, and trust. Each entry describes: market context, trigger pattern, entry method, stop placement, target logic, and when to skip.",
            "Example playbook entries: (1) Pullback long in opening trend above VWAP. (2) Failed breakout short back into range. (3) Liquidity sweep of overnight low then structure reclaim long. (4) Break and retest of prior day high in HTF uptrend.",
            "Playbooks prevent improvisation under stress. When price matches a playbook scenario, you act. When it does not, you watch. Most day traders lose by forcing trades that match no scenario.",
            "Update playbooks quarterly with screenshots and stats. Remove setups that no longer work in current volatility regime; refine triggers that show promise.",
            "Share nothing with hype — your playbook is boring, specific, and testable. That is the point.",
          ],
          keyPoints: [
            "3–5 core setups maximum for focus.",
            "Each setup needs context, trigger, stop, target, skip rules.",
            "No playbook match = no trade.",
            "Review and prune playbooks with real stats quarterly.",
            "Boring specificity beats creative improvisation.",
          ],
          manualTips: [
            "One slide per setup in a doc with annotated chart — review Sunday nights.",
            "Name setups (e.g., 'OR Reclaim') so journal tagging is fast.",
            "If you take a trade you cannot name, it is impulse — close or reduce immediately.",
            "Win rate by playbook setup reveals your true edge distribution.",
          ],
          difficulty: "intermediate",
        },
        {
          id: "day-trading-psychology-session",
          title: "Day Trading Psychology and Session Management",
          summary:
            "Manage mental energy, revenge impulses, and P&L attachment within a single session.",
          body: [
            "Day trading compresses emotional cycles into hours. Morning euphoria after wins leads to oversizing by noon. Revenge after one loss spirals into five. Manual traders use process goals (follow rules) not P&L goals (make $X) during the session.",
            "Rules that help: max daily loss, max trades, no trading first 5 minutes unless playbook says so, mandatory break after large win or loss, no size increase after wins.",
            "Attachment to being 'right' kills day traders. Your stop is the market saying your idea failed — accept it and look for the next playbook match. Redefine success as clean execution.",
            "End-of-day ritual: export trades, note emotional state, one improvement for tomorrow. Do not carry frustration into the evening — it becomes tomorrow's tilt.",
            "Physical basics matter: sleep, hydration, eyes off screen between trades. Fatigue mimics tilt in decision quality.",
          ],
          keyPoints: [
            "Process goals outperform dollar goals intraday.",
            "Hard caps on loss and trade count prevent spirals.",
            "Stops are feedback, not personal failure.",
            "End-of-day review closes the mental loop.",
            "Fatigue degrades decisions as much as anger.",
          ],
          manualTips: [
            "Hide unrealized P&L during session if it triggers size changes — show only risk.",
            "Stand up between trades — physical reset reduces tunnel vision.",
            "Write 'NO' on sticky note after max trades hit — visible barrier helps.",
            "Rate execution 1–5 independent of outcome for each trade — trains process focus.",
          ],
          difficulty: "intermediate",
        },
      ],
    },
    {
      id: "swing-trading",
      title: "Swing Trading",
      description:
        "Hold trades for days to weeks, capturing larger moves aligned with daily and weekly structure.",
      lessons: [
        {
          id: "swing-trading-overview",
          title: "Swing Trading Overview",
          summary:
            "Swing traders hold through multiple sessions to capture legs of larger trends with wider stops and patience.",
          body: [
            "Swing trading bridges day trading and investing. Holds typically last 2 days to several weeks — enough to capture a daily trend leg or weekly breakout. Overnight and weekend gap risk is accepted and managed with size and stop placement.",
            "Primary charts: daily for bias and setup, 4-hour for entry refinement. Weekly provides macro context. Indicators are optional; structure, levels, and candlesticks at HTF zones drive decisions.",
            "Swing traders trade less frequently but size larger per trade (within risk rules) because stops are wider — often beyond daily swing lows/highs. Reward targets are multiples of risk (2R–5R common).",
            "Patience is the skill. Waiting days for price to reach your limit entry is normal. Checking every hour and micro-managing is how swing traders turn winners into breakevens or losers.",
            "Swing trading fits traders with full-time jobs better than scalping — decisions are batched at open/close, alerts handle the middle.",
          ],
          keyPoints: [
            "Holds: days to weeks; daily/weekly charts dominate.",
            "Wider stops, larger targets, fewer trades than day trading.",
            "Gap risk accepted — size accordingly.",
            "Patience at entry and during hold is essential.",
            "Alerts at key levels reduce compulsive chart watching.",
          ],
          manualTips: [
            "Set good-til-canceled limit orders at pre-planned zones — do not chase daily noise.",
            "Check charts at fixed times (morning, close) unless alert fires.",
            "Size so overnight gap through stop is acceptable $ loss.",
            "Swing journal entries weekly, not per-tick — match review cadence to style.",
          ],
          difficulty: "beginner",
        },
        {
          id: "swing-entry-exit-planning",
          title: "Swing Entry and Exit Planning",
          summary:
            "Plan entries at HTF zones, exits at logical structure targets, and trail stops as swings develop.",
          body: [
            "Entries: pullbacks to daily support in weekly uptrend, bullish engulfing at demand zone, break and daily close above resistance with retest entry. Use limit orders at zones; market entries on confirmation close.",
            "Initial stop: beyond the swing that invalidates the idea — under pullback low for longs, above rally high for shorts. Stops on daily closes reduce noise vs intraday wicks if your broker allows swing hold logic.",
            "Targets: prior swing high, weekly level, measured move from range height, or Fibonacci extension (covered in Fib module). Partial profit at 2R funds patience for runner.",
            "Trailing: move stop to breakeven after 1.5R–2R, then trail below each new daily HL in uptrends. Trailing too tight on daily charts gets shaken out — give structure room.",
            "Exit early if thesis breaks: daily close through key level against you, or HTF pattern failure (e.g., failed breakout with heavy volume).",
          ],
          keyPoints: [
            "Enter at HTF zones with limit or confirmed close.",
            "Stop beyond invalidation swing, not arbitrary %.",
            "Scale out at logical structure targets; trail runner.",
            "Daily close sometimes better stop reference than intraday wick.",
            "Thesis invalidation = exit, not hope.",
          ],
          manualTips: [
            "Write entry thesis in one sentence before order — review before adding size.",
            "Use alerts for target zones — partial manually or with limit orders.",
            "After partial at 2R, move stop to breakeven on remainder — free ride psychology helps hold.",
            "Screenshot weekly chart at entry — revisit weekly to avoid micromanaging daily noise.",
          ],
          difficulty: "intermediate",
        },
        {
          id: "swing-fundamentals-context",
          title: "Swing Trading and Broader Context",
          summary:
            "Layer macro context, sector strength, and event risk without becoming a fundamentals-only investor.",
          body: [
            "Pure chart swing traders still note earnings dates, Fed weeks, and sector leadership. A perfect daily setup into earnings is a coin flip on the gap. Manual traders often stand aside or reduce size into binary events.",
            "Sector and index correlation: long a weak stock in a strong sector vs market — tailwind. Long a leader after sector breakdown — headwind. Check one layer up (XLF for banks, QQQ for tech).",
            "Weekly macro themes (risk-on/risk-off) show in indices and yields. You do not need an economics degree — note whether indices support your directional swing.",
            "Fundamentals do not replace charts for timing — they filter which charts to trade and when to sit out.",
            "Earnings winners can trend for weeks — post-earnings gap and structure on daily chart is a valid swing playbook with event noted.",
          ],
          keyPoints: [
            "Know binary event dates on symbols you hold.",
            "Sector/index alignment adds tailwind or headwind.",
            "Macro is a filter, not primary entry signal.",
            "Post-earnings trend continuation is a documented swing subtype.",
            "Reduce or exit before known high-vol events if thesis is technical only.",
          ],
          manualTips: [
            "Earnings calendar sync to watchlist — auto-flag within 5 days.",
            "Compare your symbol's daily trend to sector ETF trend before entry.",
            "If you would not hold through earnings, exit before — do not gamble on gap.",
            "Note risk-on/risk-off week in journal header — contextualizes outcomes.",
          ],
          difficulty: "intermediate",
        },
      ],
    },
    {
      id: "smart-money-ict",
      title: "Smart Money / ICT Concepts",
      description:
        "Understand institutional-style framing of liquidity, sessions, and price delivery — adapted for manual chart traders.",
      lessons: [
        {
          id: "ict-introduction",
          title: "Introduction to ICT / Smart Money Concepts",
          summary:
            "ICT-style analysis frames markets as liquidity hunts and engineered moves toward pools of resting orders.",
          body: [
            "Smart Money Concepts (SMC) and ICT (Inner Circle Trader) teachings emphasize how large participants need liquidity to fill size. Price is described as seeking stops and resting orders above highs and below lows before reversing or continuing — 'liquidity grabs' or 'sweeps.'",
            "Manual traders use these ideas without mysticism: equal highs are obvious stop clusters; news spikes can run stops; clean reversals after sweeps are tradable. Whether or not you believe in deliberate 'algorithmic' manipulation, the liquidity behavior is observable on charts.",
            "Core vocabulary: buy-side liquidity (above highs), sell-side liquidity (below lows), premium/discount (upper/lower half of range), order blocks (last opposing candle before impulse), fair value gaps (imbalance zones), kill zones (session times).",
            "ICT is not a license to see setups everywhere. Apply the same discipline: HTF bias, clear liquidity event, confirmation candle, defined invalidation.",
            "This academy presents concepts for chart reading education — not broker integration or automated execution.",
          ],
          keyPoints: [
            "Liquidity pools cluster at obvious highs, lows, and equal levels.",
            "Sweeps often precede reversals or fast continuations after stops trigger.",
            "Premium/discount helps judge if price is expensive or cheap in a range.",
            "Session timing (kill zones) matters in ICT framework.",
            "Discipline and confirmation still required — vocabulary alone does not pay.",
          ],
          manualTips: [
            "Mark equal highs/lows before session — highest-probability liquidity landmarks.",
            "After a sweep, wait for reclaim (close back inside range) before fading.",
            "Learn 3 concepts deeply first: liquidity, order blocks, FVG — add others later.",
            "If narrative says 'manipulation' but chart shows no sweep, skip — no story without price.",
          ],
          difficulty: "intermediate",
        },
        {
          id: "liquidity-order-blocks",
          title: "Liquidity Pools and Order Blocks",
          summary:
            "Identify where stops likely rest and where institutional footprints may appear as last opposing candles before impulses.",
          body: [
            "Buy-side liquidity sits above swing highs — breakout traders' stops, short stops, buy stops. Sell-side liquidity sits below swing lows. Manual traders mark these before price arrives.",
            "A sweep (run on liquidity) pierces the level, triggers orders, then price reverses or accelerates through. The wick through equal highs with bearish close is classic sell-side exhaustion above market before drop — or continuation if structure supports breakout.",
            "Order block (OB): the last down-close candle before a bullish impulse (bullish OB) or last up-close before bearish impulse (bearish OB). Idea: unfilled institutional interest remains; price may revisit for reaction.",
            "Not every opposing candle is a valid OB. Filter: must precede a strong displacement move that broke structure. Weak moves produce weak blocks.",
            "Combine: sweep of sell-side liquidity into bullish OB in discount zone during London/NY — high-confluence manual long scenario when confirmed.",
          ],
          keyPoints: [
            "Liquidity above highs / below lows is the magnet concept.",
            "Sweeps pierce levels then often reverse or ignite continuation.",
            "Order blocks precede displacement that broke structure.",
            "Weak displacement = weak order block — skip.",
            "Confluence: sweep + OB + correct premium/discount zone.",
          ],
          manualTips: [
            "Draw liquidity lines at equal highs/lows — sweeps are visible in hindsight; practice marking in advance.",
            "When OB and old support overlap, note confluence — reactions strengthen.",
            "If price blows through OB without reaction, mark OB invalid — do not cling.",
            "Use 15m OB for entries, daily OB for context — match timeframe to hold.",
          ],
          difficulty: "intermediate",
        },
        {
          id: "fvg-premium-discount",
          title: "Fair Value Gaps and Premium / Discount",
          summary:
            "Use imbalance zones and range halves to refine entries toward 'cheap' or 'expensive' prices.",
          body: [
            "Fair Value Gap (FVG): a three-candle imbalance where candle one's high is below candle three's low (bullish FVG) or candle one's low is above candle three's high (bearish FVG). Thin air where price moved fast — often partially filled on retest.",
            "Manual traders mark FVGs as potential pullback zones. Entry on tap into FVG with rejection in bias direction is common SMC entry model.",
            "Premium/discount: split a defined range (swing low to swing high) at 50%. Above equilibrium is premium (favor sells in range context); below is discount (favor buys). In uptrend pullback, seek longs in discount; in downtrend rally, seek shorts in premium.",
            "Dealing range selection matters. Use the current swing leg or weekly range — inconsistent range choice makes premium/discount meaningless.",
            "FVGs eventually fill partially or fully. Not every tap reverses — HTF bias and liquidity narrative must align.",
          ],
          keyPoints: [
            "FVG = three-candle gap in price delivery.",
            "FVG retests are pullback entry zones in bias direction.",
            "Premium = upper half of range; discount = lower half.",
            "Define dealing range consistently from clear swing points.",
            "FVG + discount + liquidity sweep = strong SMC confluence.",
          ],
          manualTips: [
            "Box FVGs on chart; delete when fully filled through.",
            "Mark 50% of dealing range with horizontal line — only take longs below in bullish bias.",
            "On lower timeframes, FVGs form often — filter by whether they align with HTF OB.",
            "If premium long in range, you are paying top dollar — expect lower win rate.",
          ],
          difficulty: "advanced",
        },
        {
          id: "kill-zones-session-models",
          title: "Kill Zones and Session Models",
          summary:
            "Time-based windows where ICT teaches liquidity events are more likely — adapt to your market's sessions.",
          body: [
            "Kill zones are session times associated with higher volatility and liquidity engineering: London open (~2–5 AM ET), NY open (~7–10 AM ET), London close, NY afternoon. Manual traders note increased sweep and reversal frequency in these windows on forex and index futures.",
            "Asia session often builds the range that London/NY later raid. Mark Asia high/low before London — breaks and sweeps reference these.",
            "Power of Three (AMD) model: accumulation (range), manipulation (sweep), distribution (trend leg) — descriptive framework for a session day, not a prediction every day.",
            "Silver Bullet and other ICT models are specific time windows — test personally before adopting. Journal 20 samples.",
            "Stock traders map similarly to cash open, first hour, and power hour — concepts transfer with different clocks.",
          ],
          keyPoints: [
            "Kill zones = high-volatility session windows for liquidity events.",
            "Asia range often defines liquidity landmarks for London/NY.",
            "AMD is descriptive (range → sweep → trend), not guaranteed daily.",
            "Validate any session model with personal journal stats.",
            "Translate forex session times to your local market hours.",
          ],
          manualTips: [
            "Vertical lines on chart at London/NY open — visual habit builds timing sense.",
            "Mark Asia box on forex before sleep if you trade London — prep matters.",
            "If a setup is perfect but outside kill zone, still trade if playbook supports — time is filter, not gate for everything.",
            "Track sweep-then-reverse win rate by session — personalize kill zone belief.",
          ],
          difficulty: "advanced",
        },
      ],
    },
    {
      id: "supply-demand",
      title: "Supply & Demand",
      description:
        "Trade reactions at zones where institutional supply and demand imbalances left visible footprints on the chart.",
      lessons: [
        {
          id: "supply-demand-zones",
          title: "Supply and Demand Zones",
          summary:
            "Supply zones are areas where selling overwhelmed buying; demand zones where buying overwhelmed selling — visible as base + impulse.",
          body: [
            "A demand zone forms at the base before a strong bullish departure — price rallied away quickly, leaving unfilled buy interest below. A supply zone forms before a sharp drop — unfilled sell interest above.",
            "Draw zones from the last opposing candles (or tight consolidation) before the impulse, extending forward as a rectangle. The zone should include the bodies where the decision happened, not random wicks far away.",
            "Fresh zones (first retest) outperform tested zones. Each touch depletes orders; third and fourth retests often break through.",
            "Strength of departure matters: explosive move breaking structure creates strong zones; sluggish drift creates weak zones.",
            "Supply and demand is horizontal thinking like support/resistance but origin-focused — you care why the level exists (imbalance departure), not just that price touched twice.",
          ],
          keyPoints: [
            "Demand = base before bullish impulse; supply = base before bearish impulse.",
            "Draw at departure origin — tight zone at decision candles.",
            "Fresh first retests are highest probability.",
            "Strong impulse away = strong zone.",
            "Zones weaken with repeated tests.",
          ],
          manualTips: [
            "Use two colors: demand green, supply red — limit active zones to 6 per chart.",
            "When zone and Fibonacci overlap, highlight — confluence entries.",
            "If retest penetrates deep into zone with no reaction, zone is failing.",
            "Remove zones after full traverse through them — keep chart honest.",
          ],
          difficulty: "beginner",
        },
        {
          id: "rally-base-rally-drop",
          title: "RBR, DBD, and Zone Patterns",
          summary:
            "Rally-Base-Rally demand and Drop-Base-Drop supply are continuation zone patterns manual traders memorize.",
          body: [
            "RBR (Rally-Base-Rally): in uptrend, price rallies, consolidates briefly (base), rallies again. The base is demand for continuation longs on retest. DBD (Drop-Base-Drop) is bearish mirror for shorts.",
            "DBR (Drop-Base-Rally): reversal — drop, base, sharp rally — base is demand origin. RBD (Rally-Base-Drop): reversal supply origin.",
            "Base characteristics: tight range, decreasing volatility, few candles — the 'pause' before next leg. Wide messy bases produce messy zones.",
            "Enter on first touch of zone in trend direction with confirmation candle (pin bar, engulfing). Stop beyond zone.",
            "Counter-trend use of reversal zones (DBR/RBD) requires HTF level alignment — same as candlestick reversal rules.",
          ],
          keyPoints: [
            "RBR/DBD = continuation zones in trend direction.",
            "DBR/RBD = reversal zones at turning points.",
            "Tight base before impulse = cleaner zone.",
            "First touch + confirmation = standard entry model.",
            "Counter-trend reversal zones need HTF confluence.",
          ],
          manualTips: [
            "Flashcard the four acronyms until pattern recognition is instant on charts.",
            "Label bases on historical winners — see how small they were relative to impulse.",
            "Do not buy DBR demand in middle of strong daily downtrend without major level.",
            "Journal RBR vs DBR win rates separately — continuation often higher probability.",
          ],
          difficulty: "intermediate",
        },
        {
          id: "supply-demand-vs-support-resistance",
          title: "Supply/Demand vs Support/Resistance",
          summary:
            "Understand when zones add information beyond horizontal lines and how to combine both.",
          body: [
            "Support/resistance marks where price reacted. Supply/demand marks where imbalance originated before a decisive move. A horizontal line at a swing low may be both S/R and demand if that low was the base of a strong rally.",
            "S/R is outcome-focused (touches). S/D is process-focused (departure story). Combining: demand zone at prior support with bullish structure is stronger than either alone.",
            "Flip: when demand breaks, it may become supply on retest (breakdown retest). Same role reversal as S/R.",
            "Do not double-count: one zone rectangle plus one line is enough. Clutter confuses.",
            "When they conflict — price at supply but above support in range — defer to HTF trend and freshness of zone.",
          ],
          keyPoints: [
            "S/R = reaction levels; S/D = imbalance origin zones.",
            "Strongest when zone aligns with structural S/R.",
            "Broken demand/supply flips role on retest.",
            "Avoid redundant markup — one clear zone per idea.",
            "Resolve conflicts with HTF trend and zone freshness.",
          ],
          manualTips: [
            "Ask 'Was there a violent departure from here?' — if no, it is S/R only.",
            "Merge overlapping S/R line and S/D box into one highlighted confluence zone.",
            "On weekly charts, mark only departure zones — reduces noise massively.",
            "When teaching a friend, show same chart with only S/R then add S/D — see added precision.",
          ],
          difficulty: "intermediate",
        },
        {
          id: "trading-the-zone",
          title: "Trading the Zone — Practical Rules",
          summary:
            "Executable manual rules for entries, stops, targets, and invalidation when trading supply and demand.",
          body: [
            "Entry rules: (1) First retest only for A-grade. (2) Confirmation candle in zone (rejection wick or engulfing). (3) HTF bias aligned. (4) Risk defined before click.",
            "Stop: beyond zone plus buffer — wick through zone is normal; close through zone on your timeframe is invalidation.",
            "Target: opposing zone, next liquidity pool, or structure swing. Minimum 2:1 reward-to-risk for swing trades; scalps may accept 1:1 with higher win rate.",
            "Skip when: zone is old (10+ touches), middle of balance range with no trend, news imminent, or departure was weak.",
            "Management: partial at first structure obstacle; trail stop under new swings if runner. Do not add to losers averaging into breaking zone.",
          ],
          keyPoints: [
            "First retest + confirmation + HTF bias = A-grade zone trade.",
            "Stop beyond zone; invalidation on close through zone.",
            "Target at opposing zone or structure.",
            "Skip stale, weak, or mid-range zones.",
            "No averaging down through breaking demand.",
          ],
          manualTips: [
            "Pre-place alerts at zone boundaries — touch happens when you are not watching.",
            "Measure zone height; if stop distance > daily ATR fraction you accept, skip or reduce size.",
            "Photograph zone at entry showing departure — builds quality eye over months.",
            "If two zones stack nearby, trade the fresher one — older often weaker.",
          ],
          difficulty: "intermediate",
        },
      ],
    },
  ],
};