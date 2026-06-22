import type { AcademyCategory } from "../types";

export const marketStructureCategory: AcademyCategory = {
  id: "market-structure",
  title: "Market Structure",
  description:
    "Read swing points, breaks of structure, changes of character, liquidity, and session-based structure — the backbone of modern manual chart analysis.",
  sections: [
    {
      id: "swing-points",
      title: "Swing Points",
      description:
        "Identify and label the turning points that define trend, range, and transition on any timeframe.",
      lessons: [
        {
          id: "swing-point-definition",
          title: "Defining Valid Swing Points",
          summary:
            "A swing point is a confirmed local high or low — the building block of all structure analysis.",
          body: [
            "Market structure begins with swing points. A swing high is a peak with lower highs on both sides (on your chosen timeframe). A swing low is a trough with higher lows on both sides. Without agreed swings, HH/HL/LH/LL labels are meaningless.",
            "Manual traders use consistent pivot rules: 3-candle pivot (center candle highest/lowest), 5-candle fractal, or percentage reversal threshold (e.g., 0.5% move off extreme). Pick one method per timeframe and stick to it for months.",
            "Not every wick is a swing. In fast markets, require the reversal to hold for at least one full additional candle close beyond the pivot to confirm — reduces false swings on noise.",
            "Swing magnitude matters: a 2-tick wiggle on ES 1-minute is not the same as a daily swing low. Scale your minimum swing size to average true range of the timeframe.",
            "Document swings on chart with small labels (SH1, SL1) sequentially — clarity when explaining bias to yourself or mentor.",
          ],
          keyPoints: [
            "Swings need defined pivot rules — consistency is everything.",
            "Confirmation candle optional but reduces noise on LTF.",
            "Minimum swing size should relate to timeframe volatility.",
            "Sequential labels prevent confusion during fast sessions.",
            "Bad swing definition cascades into all structure errors.",
          ],
          manualTips: [
            "Use fractal indicator as training wheels, then verify manually until agreement >90%.",
            "On daily charts, swings are obvious — master daily before 5m swings.",
            "When two pivot methods disagree, default to higher timeframe's swings.",
            "Erase swings that price ignored without reaction — they were noise.",
          ],
          difficulty: "beginner",
        },
        {
          id: "labeling-structure",
          title: "Labeling HH, HL, LH, LL",
          summary:
            "Classify each new swing relative to the prior one to determine trend direction objectively.",
          body: [
            "Higher High (HH): new swing high exceeds prior swing high. Higher Low (HL): new swing low exceeds prior swing low. Together in sequence → uptrend structure. Lower High (LH) and Lower Low (LL) → downtrend.",
            "Label only after swing confirms. Premature HH label before close invites repaint bias intraday.",
            "Internal vs external swings: external swings define major structure; internal swings are pullbacks inside the leg. Trade decisions usually reference external structure; entries refine on internal.",
            "When HH is marginal (tiny break), note 'weak HH' — may signal compression or exhaustion rather than strength.",
            "Structure labels are descriptive, not predictive. They tell you what happened; your job is deciding if continuation or reversal is more likely at this location.",
          ],
          keyPoints: [
            "HH+HL = bullish structure; LH+LL = bearish structure.",
            "Confirm swings before labeling.",
            "Distinguish external (major) vs internal (minor) swings.",
            "Marginal breaks warrant caution labels.",
            "Structure describes history — combine with levels for prediction.",
          ],
          manualTips: [
            "Color HH/HL green text, LH/LL red — instant bias read.",
            "Screenshot weekly chart with labels only — teach a friend to test clarity.",
            "If last three labels alternate HH then LH then HH, you are in range transition — flag it.",
            "Never relabel old swings to fit narrative — only forward labels from confirmation.",
          ],
          difficulty: "beginner",
        },
        {
          id: "swing-point-trading",
          title: "Trading with Swing Points",
          summary:
            "Use swing highs and lows for stops, targets, and entry triggers in manual trade plans.",
          body: [
            "Stops: below most recent HL for longs (uptrend), above most recent LH for shorts. Choose external swing for swing trades, internal for scalps.",
            "Targets: next opposing swing high in uptrend, next swing low in downtrend. Partial before reaching swing if R multiples already satisfied.",
            "Entry triggers: break and retest of minor swing in trend direction; rejection wick at prior swing low forming new HL.",
            "Swing failure: attempted HH fails below prior high — potential LH forming. Manual traders tighten risk on longs when HH failure prints at resistance.",
            "Always know which swing invalidates your idea — write it on the order ticket.",
          ],
          keyPoints: [
            "Stops reference protected swings (HL/LH).",
            "Targets at next logical swing in direction.",
            "Failed HH/LH attempt signals potential structure shift.",
            "External vs internal swing choice sets stop width.",
            "Invalidation swing defined before entry.",
          ],
          manualTips: [
            "Horizontal ray from swing low across chart — see reactions days later.",
            "If stop requires breaking external HL, you may be counter-trend — verify.",
            "Measure distance to next swing target vs stop — skip if R < 1.5 for swings.",
            "Alerts at swing break levels automate structure monitoring.",
          ],
          difficulty: "intermediate",
        },
      ],
    },
    {
      id: "break-of-structure",
      title: "Break of Structure",
      description:
        "Recognize BOS as continuation confirmation and distinguish it from fake breaks and liquidity sweeps.",
      lessons: [
        {
          id: "what-is-bos",
          title: "What Is Break of Structure (BOS)?",
          summary:
            "BOS occurs when price breaks a prior swing extreme in the direction of the established trend — continuation signal.",
          body: [
            "In an uptrend, bullish BOS is a new HH breaking above the previous swing high. In a downtrend, bearish BOS is a new LL below prior swing low. BOS confirms trend continuation — the dominant side still controls.",
            "BOS requires a close beyond the level on your decision timeframe for manual traders. Wick-only breaks are liquidity probes until confirmed.",
            "Internal BOS: break of minor swing inside pullback — early sign pullback ending. External BOS: break of major swing — stronger continuation statement.",
            "After BOS, old resistance (prior swing high) may retest as support — classic manual long entry zone in uptrend.",
            "BOS frequency: in strong trends, serial BOS on LTF while HTF shows one large leg — align entries with HTF bias BOS, not every 1m BOS.",
          ],
          keyPoints: [
            "BOS = break of prior swing extreme in trend direction.",
            "Close beyond level confirms BOS on decision timeframe.",
            "Internal vs external BOS differ in significance.",
            "Post-BOS retest of broken level is entry opportunity.",
            "Filter LTF BOS with HTF trend alignment.",
          ],
          manualTips: [
            "Mark prior swing high with line before break — BOS obvious when close above.",
            "After BOS, set alert on retest of broken level — patience beats chase.",
            "Count BOS per day on 5m — overtrading every BOS ruins stats.",
            "Journal BOS entries separate from reversal entries — different win profiles.",
          ],
          difficulty: "intermediate",
        },
        {
          id: "bos-vs-liquidity-sweep",
          title: "BOS vs Liquidity Sweep",
          summary:
            "Learn to tell genuine continuation breaks from stop hunts that pierce levels without acceptance.",
          body: [
            "Liquidity sweep: wick through prior high/low, triggers stops, closes back inside range — no acceptance beyond level. BOS: close beyond level, often retest holds beyond side, follow-through continues.",
            "Sweeps are common at equal highs/lows; BOS more common mid-trend breaking obvious swing. Location tells story: sweep at range edge, BOS in trend channel.",
            "Manual traders wait for second candle after wick: reclaim inside = sweep (fade setup possible); hold beyond = BOS developing.",
            "Sweeps can precede real BOS — first run stops, second push breaks with conviction. Do not fade every sweep in strong HTF trend.",
            "Volume (when available): sweeps sometimes show spike then reversal; BOS may show sustained participation — secondary confirmation.",
          ],
          keyPoints: [
            "Sweep = pierce and reclaim; BOS = pierce and accept with close.",
            "Equal highs/lows favor sweep interpretation first.",
            "Second candle after wick clarifies sweep vs BOS.",
            "Sweeps can precede genuine BOS — context matters.",
            "Volume can differentiate but price close is primary.",
          ],
          manualTips: [
            "Screenshot 10 sweeps and 10 BOS side by side — train eye on close location.",
            "Do not short first wick above high in strong daily uptrend without reclaim confirmation.",
            "Mark sweep with 'S' and BOS with 'B' on chart legend for review.",
            "If stopped on BOS break and immediate reclaim inside, you traded a sweep — note it.",
          ],
          difficulty: "intermediate",
        },
        {
          id: "trading-bos",
          title: "Trading Break of Structure",
          summary:
            "Entry models after BOS: retest entry, pullback to order block, and momentum continuation with defined risk.",
          body: [
            "Retest model: BOS closes above resistance → wait for pullback to broken level → enter on rejection forming new HL → stop below retest low.",
            "Momentum model: enter on BOS close or next candle continuation — wider stop, higher chase risk. Best when HTF strongly trending and session active.",
            "Order block model: after BOS, pullback to bullish OB formed before impulse → enter in OB with stop below OB.",
            "Invalidation: close back below broken level (failed BOS) → exit or scratch. Do not hold hoping.",
            "Target: next liquidity pool or measured swing projection. Partial at 2R standard.",
          ],
          keyPoints: [
            "Retest of broken level is highest R BOS entry.",
            "Momentum BOS entry is valid but higher chase risk.",
            "OB confluence improves BOS pullback entries.",
            "Failed BOS (close back inside) = scratch rule.",
            "Targets at next liquidity or structure.",
          ],
          manualTips: [
            "Default to retest entry for 20 trades before trying momentum BOS — build baseline stats.",
            "If BOS candle is huge, retest almost always comes — skip FOMO market entry.",
            "Combine BOS retest with Fib 50% of impulse for confluence box.",
            "Time filter: BOS during kill zone retests more reliably on forex for some traders — test yourself.",
          ],
          difficulty: "intermediate",
        },
      ],
    },
    {
      id: "change-of-character",
      title: "Change of Character",
      description:
        "CHoCH signals potential trend reversal when price breaks the last protected swing against the prior trend.",
      lessons: [
        {
          id: "what-is-choch",
          title: "What Is Change of Character (CHoCH)?",
          summary:
            "CHoCH is the first structural break against the prevailing trend — early warning of potential reversal.",
          body: [
            "In uptrend, bearish CHoCH occurs when price breaks below the last significant HL — sellers took out the level bulls defended. In downtrend, bullish CHoCH breaks above last LH.",
            "CHoCH differs from BOS: BOS continues trend; CHoCH opposes it. First CHoCH does not guarantee full reversal — may lead to range or deeper correction — but bias shifts from blind trend-following to caution.",
            "Minor CHoCH on LTF inside HTF trend is often pullback, not reversal. Major CHoCH on trading timeframe or HTF matters more.",
            "Manual traders reduce size on trend trades after CHoCH and watch for confirmation: opposing BOS (LL after bearish CHoCH in former uptrend) for full reversal thesis.",
            "CHoCH at HTF key level is high significance — structural break at structural price.",
          ],
          keyPoints: [
            "CHoCH = break of last protected HL (uptrend) or LH (downtrend).",
            "First warning of trend weakness, not always full reversal.",
            "Scale significance by timeframe and HTF level proximity.",
            "Confirmation = subsequent BOS in new direction.",
            "Adjust bias and size after CHoCH — do not ignore.",
          ],
          manualTips: [
            "Label first CHoCH with vertical line — marks bias shift date in journal.",
            "After CHoCH, stop taking blind trend continuation entries until new structure clarifies.",
            "HTF CHoCH + daily level = reduce swing long exposure aggressively.",
            "Distinguish CHoCH (first break) from second LL (trend may be fully bearish now).",
          ],
          difficulty: "intermediate",
        },
        {
          id: "choch-vs-bos-reversal",
          title: "CHoCH vs Reversal BOS",
          summary:
            "Sequence from trend → CHoCH → opposing BOS defines the structural reversal narrative.",
          body: [
            "Classic reversal sequence in former uptrend: LH forms (momentum slowing) → CHoCH breaks HL → price rallies fail (LH) → bearish BOS creates LL → downtrend structure established.",
            "Trading the CHoCH: aggressive traders fade rallies to broken HL with stops above retest high. Conservative traders wait for bearish BOS LL confirmation then retest short.",
            "Premature reversal trading at CHoCH alone fails in strong trends (CHoCH becomes liquidity grab). HTF alignment and location filter essential.",
            "Range transition: CHoCH without follow-through BOS leads to balance — adapt to range playbook.",
            "Document which reversal stage fits your personality — CHoCH fade vs BOS continuation after reversal.",
          ],
          keyPoints: [
            "Reversal sequence: LH → CHoCH → LL (BOS bearish).",
            "CHoCH fade is aggressive; BOS after CHoCH is conservative.",
            "Strong HTF trends absorb LTF CHoCH often.",
            "No follow-through BOS after CHoCH → range likely.",
            "Know which reversal stage you trade.",
          ],
          manualTips: [
            "Simulate 15 reversals in replay — mark CHoCH and BOS dates, note which entry style won.",
            "If CHoCH breaks HL by 1 tick and rips back, was sweep — wait for daily close.",
            "Counter-trend shorts after CHoCH: half size until LL confirms.",
            "Weekly structure CHoCH matters for swing holders — review portfolio bias.",
          ],
          difficulty: "advanced",
        },
        {
          id: "choch-false-signals",
          title: "False CHoCH and Whipsaws",
          summary:
            "Avoid overreacting to structure breaks that reclaim quickly in volatile conditions.",
          body: [
            "False CHoCH: break below HL then strong reclaim within 1–3 candles — stop hunt or news spike. Full reversal thesis aborted; trend may resume aggressively.",
            "Filters: require close beyond level; avoid CHoCH trades into major HTF support in uptrend (may be dip not reversal); note session — Asia fake breaks common before London trend.",
            "If you entered on CHoCH short and price reclaims HL, exit rules are mechanical — no narrative override.",
            "Multiple CHoCH both directions in short window = chop — stop structural trading until clarity.",
            "Accept false CHoCH as cost of structural trading — size so false signals are survivable.",
          ],
          keyPoints: [
            "Quick reclaim after CHoCH = likely false break / sweep.",
            "HTF support/resistance context filters false CHoCH shorts/long.",
            "Mechanical exit on reclaim — no hope holding.",
            "Alternating CHoCH = chop — stand aside.",
            "Size for false signal frequency in your market.",
          ],
          manualTips: [
            "Add buffer below HL for CHoCH confirmation — 1 tick breaks are often noise on futures.",
            "News calendar: no CHoCH trades 5 min before high impact unless that is your niche.",
            "Track false CHoCH rate by symbol — some assets whipsaw more.",
            "Use higher TF close for CHoCH on swing trades — ignore 1m CHoCH for daily holds.",
          ],
          difficulty: "advanced",
        },
      ],
    },
    {
      id: "liquidity-concepts",
      title: "Liquidity Concepts",
      description:
        "Understand where resting orders cluster and how price behavior around liquidity informs manual entries.",
      lessons: [
        {
          id: "liquidity-basics",
          title: "Liquidity Basics for Chart Readers",
          summary:
            "Liquidity is the availability of opposing orders needed to fill trades — visible as obvious chart levels.",
          body: [
            "On charts, liquidity manifests at obvious levels: equal highs, equal lows, round numbers, prior day high/low, trendline clusters, obvious breakout points. Retail stops and breakout orders cluster there.",
            "Price often accelerates into liquidity to fill large institutional needs — not conspiracy, market mechanics. Manual traders mark liquidity before price arrives.",
            "Buy-side liquidity above highs: shorts' stops, breakout buy stops. Sell-side liquidity below lows: longs' stops, breakout sell stops.",
            "After liquidity taken (sweep), price may reverse (stop hunt) or continue (breakout after stops cleared). Read the close after the sweep.",
            "Liquidity concepts enhance structure — they explain why wicks happen at obvious levels.",
          ],
          keyPoints: [
            "Obvious levels = liquidity pools.",
            "Price often runs stops before larger moves.",
            "Buy-side liquidity above highs; sell-side below lows.",
            "Post-sweep behavior (reclaim vs hold) sets bias.",
            "Mark liquidity in advance on chart.",
          ],
          manualTips: [
            "Draw horizontal bands at equal highs — most common forex liquidity landmark.",
            "Round numbers (1.1000, 5000 SPX) — note reactions for your instrument.",
            "When everyone sees liquidity, it often runs — contrarian preparation helps.",
            "Liquidity taken + CHoCH = stronger reversal narrative.",
          ],
          difficulty: "intermediate",
        },
        {
          id: "inducement-engineered",
          title: "Inducement and Obvious Levels",
          summary:
            "Recognize when obvious levels may bait traders before the 'real' move — inducement framing.",
          body: [
            "Inducement (SMC term): an obvious swing or trendline that attracts retail entries/stops before price reverses toward true move. The obvious level is the bait; the move after sweeping it is the intended direction for informed traders.",
            "Manual traders stay skeptical of perfect trendline touches in strong HTF trends — third touch breakouts fail often if liquidity was the goal.",
            "Signs of inducement: very obvious level on social media charts; shallow reaction first touch; violent sweep second touch with reversal.",
            "Do not blame 'smart money' for losses — use inducement as hypothesis to wait for sweep + reclaim before committing.",
            "Combine with structure: inducement into demand zone then CHoCH is high-quality long after fake breakdown.",
          ],
          keyPoints: [
            "Obvious levels can attract liquidity deliberately.",
            "Perfect-looking trendline breaks often fail first.",
            "Sweep then reversal is inducement signature.",
            "Wait for sweep + reclaim rather than first touch.",
            "Fake breakdown into demand + structure shift = long opportunity.",
          ],
          manualTips: [
            "If level is 'too obvious' on Twitter, mark it liquidity watch — skepticism pays.",
            "Third trendline touch breakdown that instantly reverses — classic inducement screenshot for journal.",
            "Do not short blindly into first sweep of lows in daily uptrend — may be inducement long setup.",
            "Phrase trade thesis: 'If they run lows, then I long reclaim' — conditional plan beats prediction.",
          ],
          difficulty: "advanced",
        },
        {
          id: "liquidity-pools-targets",
          title: "Liquidity Pools as Targets",
          summary:
            "Use opposing liquidity as profit targets and trail logic for manual trades.",
          body: [
            "In uptrend long, target buy-side liquidity above next equal highs or prior swing high — where stops cluster and price may spike to fill.",
            "Partial profits before liquidity pool reasonable — full size into stop cluster risks reversal wick through your target.",
            "Runner trail: after liquidity hit, trail below new HL — capture extension if breakout continues.",
            "Multiple liquidity levels stack like ladder — map 1st, 2nd, 3rd pool for scale-out plan.",
            "When no obvious liquidity above, use Fib extension or measured move instead.",
          ],
          keyPoints: [
            "Opposing liquidity = logical target zone.",
            "Scale out into liquidity, not all at once blindly.",
            "Post-liquidity trail captures breakout continuation.",
            "Stack multiple pools for tiered exits.",
            "No obvious pool → use extension/structure targets.",
          ],
          manualTips: [
            "Mark next three liquidity highs above price on long — write partial % at each.",
            "If price blows through pool with BOS close, trail instead of fading at pool.",
            "ES/NQ: prior day high often daily liquidity — standard day trade target.",
            "Review runners that exceeded pool — note if BOS continuation was clue to hold more.",
          ],
          difficulty: "intermediate",
        },
        {
          id: "liquidity-voids-fvg",
          title: "Liquidity Voids and Imbalances",
          summary:
            "Fast moves leave inefficient price areas that often attract retests — fair value gaps as structure element.",
          body: [
            "Liquidity void / imbalance / FVG: area where price moved so fast one side did not trade efficiently — three-candle gap pattern. Price frequently revisits to 'fill' partially before continuing.",
            "Not all voids fill immediately — strong trends leave unfilled gaps for weeks. HTF bias tells whether to expect fill or ignore.",
            "Manual traders mark voids as potential pullback zones in trend direction — enter on tap and rejection.",
            "Filled void: price traded through imbalance — zone less relevant; delete markup.",
            "Voids above in uptrend can act as magnets on pullbacks; voids below in downtrend similarly.",
          ],
          keyPoints: [
            "FVG = fast move imbalance, potential retest zone.",
            "Trend strength affects fill probability and timing.",
            "Use unfilled FVG for pullback entries in bias direction.",
            "Delete filled voids from active map.",
            "Voids are structure tools, not magic boxes.",
          ],
          manualTips: [
            "Only mark FVGs in direction of HTF trend for entry — counter fills are lower grade.",
            "If multiple nested FVGs, trade the one aligning with OB or Fib.",
            "Crypto weekends gap — Monday fills common; note on chart.",
            "Set alert on first FVG tap — execution timing matters on fast fills.",
          ],
          difficulty: "advanced",
        },
      ],
    },
    {
      id: "session-based-structure",
      title: "Session-Based Structure",
      description:
        "Build and trade structure defined by trading sessions — Asia, London, New York, and daily boundaries.",
      lessons: [
        {
          id: "session-ranges",
          title: "Session Ranges and Boxes",
          summary:
            "Mark each session's high and low to define intraday structure and liquidity landmarks.",
          body: [
            "Forex and futures traders divide 24 hours into Asia, London, New York (and Sydney). Each session creates a range with high and low. Subsequent sessions often sweep prior session extremes before establishing direction.",
            "Manual routine: at London open, mark Asia high/low box. At NY open, mark London high/low. These boxes are session structure — breaks and sweeps reference them.",
            "Asia range often tight — compression. London expansion — breakout or false break of Asia. NY continuation or reversal of London move.",
            "Stock traders analog: pre-market range, cash open first hour range, midday balance, power hour. Same boxing concept.",
            "Session boxes expire — delete after 2 sessions unless HTF level coincides.",
          ],
          keyPoints: [
            "Each session produces high/low box — structural reference.",
            "Later sessions sweep prior session liquidity commonly.",
            "Asia compress, London expand is common forex rhythm.",
            "Stocks map to pre-market, open, midday, close sessions.",
            "Remove stale session boxes to reduce clutter.",
          ],
          manualTips: [
            "Auto-draw session indicators if platform supports — verify visually first week.",
            "Mark Asia box before bed if trading London — wake up prepared.",
            "When Asia range unusually wide, London may mean-revert not trend — note anomaly.",
            "SPY: first 30-min range is many day traders' 'Asia equivalent' structure.",
          ],
          difficulty: "intermediate",
        },
        {
          id: "daily-weekly-structure",
          title: "Daily and Weekly Structure Boundaries",
          summary:
            "Use day and week opens, highs, lows, and closes as structural anchors across sessions.",
          body: [
            "Daily open, high, low, close (OHLC) carry to next session. Weekly OHLC same on Monday. Manual traders mark Sunday/Monday weekly open and prior week high/low for swing context.",
            "Inside day: today's range inside yesterday — compression; breakout tomorrow often matters. Outside day: engulfs prior range — volatility expansion signal.",
            "Opening price acceptance: multiple candles failing to move away from open suggests balance; decisive move away sets intraday trend.",
            "End-of-day structure close determines overnight bias for futures — 4pm ET stock close is institutional bookmark.",
            "Weekly CHoCH on Friday close influences Monday gap risk for swing holders.",
          ],
          keyPoints: [
            "Prior day/week OHLC are structural magnets.",
            "Inside day = compression; outside day = expansion.",
            "Open acceptance/rejection sets intraday tone.",
            "Daily close matters for overnight swing bias.",
            "Weekly structure influences Monday positioning.",
          ],
          manualTips: [
            "Mark prior week high/low every Sunday on swing watchlist.",
            "Inside day list scan after close — tomorrow's watchlist input.",
            "Note whether price closed above/below daily open in journal — simple bias stat.",
            "Avoid large new swing entries Friday afternoon unless planned hold through weekend.",
          ],
          difficulty: "intermediate",
        },
        {
          id: "session-trading-models",
          title: "Session Trading Models",
          summary:
            "Apply repeatable session-based playbooks: sweep Asia lows, London breakout, NY reversal.",
          body: [
            "Model 1 — Asia sweep long: daily bias bullish, London dips below Asia low (sell-side liquidity), reclaims Asia low, enter long targeting London high or NY extension.",
            "Model 2 — London breakout: tight Asia, London closes above Asia high with momentum, retest entry long in NY.",
            "Model 3 — NY reversal: London trend exhausted into prior day high resistance, NY session CHoCH on 15m, fade to liquidity below.",
            "Models are hypotheses tested via journal — not daily guarantees. Skip day when structure messy.",
            "Align model with HTF bias — counter-HTF models are advanced with reduced size.",
          ],
          keyPoints: [
            "Session models link liquidity sweeps to bias direction.",
            "London/NY interaction is core forex intraday narrative.",
            "Models require HTF bias alignment for best results.",
            "Skip when session structure unclear.",
            "Personal journal validates which models fit you.",
          ],
          manualTips: [
            "Pick ONE session model for 30 trades — isolate stats before adding models.",
            "Write expected liquidity target before London open — plan not reaction.",
            "If Model 1 fails 3 days straight, check if HTF trend flipped — model may be wrong for environment.",
            "Stock traders: translate 'Asia sweep' to 'pre-market low sweep at open' — same mechanics.",
          ],
          difficulty: "advanced",
        },
        {
          id: "integrating-structure",
          title: "Integrating Structure into Your Process",
          summary:
            "Combine swing structure, BOS/CHoCH, liquidity, and sessions into a daily manual workflow.",
          body: [
            "Morning workflow: mark HTF swings and bias → prior day/week levels → session boxes → liquidity pools → active FVGs/OBs if using SMC.",
            "During session: update swings as HH/HL confirm; note BOS/CHoCH events; execute only playbook matches.",
            "Evening: screenshot chart with labels; journal which structure events mattered; prune obsolete marks.",
            "Weekly: review structure-based trades vs indicator-only trades if migrating — measure edge.",
            "Structure is the spine — sessions, liquidity, Fib, candles are ribs. All attach to spine.",
          ],
          keyPoints: [
            "Consistent marking routine beats ad-hoc analysis.",
            "Update structure live but execute pre-defined playbooks only.",
            "Evening review closes learning loop.",
            "Structure integration is incremental — add one layer per month.",
            "All tools attach to structure spine.",
          ],
          manualTips: [
            "15-minute morning markup timer — when it rings, stop drawing and start watching.",
            "Template chart layout saved with session tools and swing labels style.",
            "Monthly: delete unused markup types — simplify if BOS never traded.",
            "Teach structure workflow to peer — explaining reveals gaps in your process.",
          ],
          difficulty: "intermediate",
        },
      ],
    },
  ],
};