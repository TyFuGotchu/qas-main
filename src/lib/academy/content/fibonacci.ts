import type { AcademyCategory } from "../types";

export const fibonacciCategory: AcademyCategory = {
  id: "fibonacci",
  title: "Fibonacci Tools",
  description:
    "Use Fibonacci retracements, extensions, and the golden pocket with structure confluence — including clear drawing and invalidation rules for manual traders.",
  sections: [
    {
      id: "fib-retracements",
      title: "Fibonacci Retracements",
      description:
        "Measure how far price typically pulls back within a trend leg using standard Fib ratios.",
      lessons: [
        {
          id: "fib-basics",
          title: "Fibonacci Retracement Basics",
          summary:
            "Fib retracements divide a swing into ratios — 23.6%, 38.2%, 50%, 61.8%, 78.6% — where pullbacks often stall.",
          body: [
            "Fibonacci retracements apply horizontal levels to a price swing from low to high (uptrend pullback) or high to low (downtrend pullback). The tool calculates ratios from the impulse: 38.2% and 61.8% are the most watched by manual traders.",
            "The premise: markets often retrace a predictable fraction of a move before continuing. Not because magic numbers control price, but because many participants watch the same levels, creating self-reinforcing reactions.",
            "Draw from swing point to swing point of the impulse leg you are trading — not random wicks years apart. The leg should be clear on your timeframe: a visible trend move with a defined start and end before pullback began.",
            "50% is not a true Fibonacci number but is included because half retracements are psychologically and technically common. Treat it as a zone, not a laser line.",
            "Fib levels are probabilistic zones. Price can overshoot to 78.6% or shallow stop at 23.6%. Combine with structure, candlesticks, and volume — never trade a Fib level alone.",
          ],
          keyPoints: [
            "Key ratios: 38.2%, 50%, 61.8%, 78.6%.",
            "Draw on clear impulse legs on your trading timeframe.",
            "Fib levels are zones where pullbacks often react.",
            "50% is widely used though not 'pure' Fib.",
            "Always combine Fib with other chart context.",
          ],
          manualTips: [
            "Save a Fib template with only 38.2, 50, 61.8, 78.6 visible — clutter invites overfitting.",
            "Draw Fib after impulse completes — drawing mid-impulse changes anchors constantly.",
            "If price blows past 78.6%, the trend leg may be over — reassess structure.",
            "Practice on daily charts where swings are obvious before applying to noisy 5m charts.",
          ],
          difficulty: "beginner",
        },
        {
          id: "drawing-retracements",
          title: "How to Draw Retracements Correctly",
          summary:
            "Anchor Fib tools to the correct swing low and high — anchor errors invalidate every level.",
          body: [
            "Uptrend pullback: anchor 0% at the swing high (end of impulse) and 100% at the swing low (start of impulse). Pullback levels appear below the high as price retraces down. Some platforms reverse this convention — verify which anchor is 0% on yours.",
            "Downtrend pullback: anchor from swing high (start) to swing low (end) for the bearish impulse; retracement levels mark where rally may stall as price bounces up into the move.",
            "Use bodies for anchor when wicks are extreme outliers; use wicks when they represent true liquidity sweeps that the market respects. Consistency matters more than dogma — pick a rule and journal outcomes.",
            "On multi-leg trends, draw Fib on the most recent impulse for entries, and optionally on larger swing for macro context. Competing Fibs on one chart should be limited to two.",
            "After drawing, ask: 'Does this leg make sense?' If the swing is choppy and overlapping, Fib output is noise.",
          ],
          keyPoints: [
            "Correct anchors = correct levels — verify platform 0%/100% convention.",
            "Uptrend: measure impulse low → high; watch pullback down into levels.",
            "Be consistent about body vs wick anchors.",
            "Most recent impulse Fib for entries; larger swing for context.",
            "Choppy swings produce unreliable Fib levels.",
          ],
          manualTips: [
            "After drawing, toggle to log scale on long-term charts if asset grew 10x — linear Fib can mislead on crypto.",
            "Screenshot bad Fibs where anchors were wrong — faster learning than theory.",
            "Use shift+click fine-tune on TradingView-style tools to align to exact swing.",
            "If two valid swings exist, draw both but trade only the one matching HTF bias.",
          ],
          difficulty: "beginner",
        },
        {
          id: "key-retracement-levels",
          title: "Key Retracement Levels in Practice",
          summary:
            "What 38.2%, 50%, 61.8%, and 78.6% typically mean for manual entry planning.",
          body: [
            "23.6%–38.2%: shallow pullback zone in strong trends. Price barely pauses — flag-like behavior. Entries here are aggressive; stops tighter but miss rate higher if trend is maturing.",
            "50%: classic half retrace — institutional traders often reference 'buy the 50% pullback.' Works well when impulse was clean and HTF trend strong.",
            "61.8%: 'golden ratio' retracement — deep but healthy pullback in many trends. Last chance feel for trend continuation before structure breaks. High watch zone for manual limit orders.",
            "78.6%: last shallow Fib before full retrace territory. Deep pullbacks that hold here can still continue; failure often means trend leg over and range or reversal ahead.",
            "Beyond 100%: price erased the impulse — your Fib is invalidated; redraw or stand aside.",
          ],
          keyPoints: [
            "Shallow (38.2%): strong trend, aggressive entries.",
            "50%: widely watched half retrace.",
            "61.8%: deep healthy pullback zone in trends.",
            "78.6%: deep last-chance zone before invalidation risk rises.",
            "Beyond 100% retrace invalidates the measured leg.",
          ],
          manualTips: [
            "Place alerts at 61.8 and 50 on active swings — catches pullbacks without staring.",
            "In parabolic trends, shallow 23.6–38.2 is normal — do not demand 61.8 every time.",
            "Journal which level worked most in your market — ES may differ from EURUSD.",
            "When price chops between 50 and 61.8 for days, treat as range not trending pullback.",
          ],
          difficulty: "intermediate",
        },
        {
          id: "fib-pullback-entries",
          title: "Fibonacci Pullback Entries",
          summary:
            "Combine Fib zones with confirmation candles and structure for manual trend continuation entries.",
          body: [
            "Workflow: identify trend → mark impulse → draw Fib → wait for price to enter 38.2–61.8 zone → seek confirmation (hammer, engulfing, OB reaction) → enter with stop beyond 78.6% or structure low.",
            "Limit orders at 61.8 or 50 can get filled without confirmation — higher fill rate, lower quality. Confirmation entries sacrifice some R but filter false deep pullbacks.",
            "Multiple Fib confluence: 61.8% on 4H aligns with daily 50% — stack strengthens zone. Mark overlap bands.",
            "Counter-trend warning: deep Fib in dying trend looks like opportunity but is often trap. Check HTF structure still making HH/HL (longs) before buying 61.8.",
            "Targets: prior swing high (impulse origin) for first partial, extensions (next section) for runners.",
          ],
          keyPoints: [
            "Standard workflow: trend → impulse → Fib zone → confirmation → entry.",
            "Limit at level vs confirmation trade-off: fill rate vs quality.",
            "Stacked Fibs across timeframes strengthen zones.",
            "HTF structure must still support continuation.",
            "Targets at prior extreme and extensions.",
          ],
          manualTips: [
            "Write planned entry level before pullback arrives — prevents moving Fib to fit price.",
            "If confirmation candle closes outside zone, wait for retest — chasing hurts R.",
            "Combine Fib zone with demand zone — double box the overlap.",
            "Track missed trades where limit at 61.8 would have worked — tune aggression vs patience.",
          ],
          difficulty: "intermediate",
        },
      ],
    },
    {
      id: "fib-extensions",
      title: "Fibonacci Extensions",
      description:
        "Project profit targets beyond the original swing using extension ratios like 127.2%, 161.8%, and 261.8%.",
      lessons: [
        {
          id: "extension-basics",
          title: "Fibonacci Extension Basics",
          summary:
            "Extensions project where price may travel after retracement and continuation — primary tool for targets.",
          body: [
            "While retracements measure pullbacks within a leg, extensions measure potential expansion beyond the prior high or low after the pullback completes. Common extension levels: 127.2%, 141.4%, 161.8%, 200%, 261.8%.",
            "Manual traders use extensions primarily for profit targets, not entries. After entering on a 61.8% retracement long, 127.2% and 161.8% extensions above the swing high give logical partial and full target zones.",
            "Drawing methods vary: some tools use three-point ABC (swing low, swing high, retracement low) to project extensions from C. Others extend from the retracement leg. Learn your platform's method and stay consistent.",
            "161.8% extension is the most cited runner target in trend continuation plays. 127.2% is a conservative first target when structure obstacles sit nearby.",
            "Extensions in strong trends can be exceeded — treat levels as areas to scale out, not reasons to reverse blindly.",
          ],
          keyPoints: [
            "Extensions project targets beyond prior swing extremes.",
            "Common targets: 127.2%, 161.8%, 261.8%.",
            "Primarily for profit-taking, not entry signals.",
            "Three-point ABC drawing is standard on many platforms.",
            "Scale out at extensions; do not auto-reverse without structure shift.",
          ],
          manualTips: [
            "Pre-set extension targets at trade entry — removes mid-trade guesswork.",
            "If 127.2% aligns with prior weekly high, take partial there — double reason.",
            "Extensions failing to reach in strong trend sometimes means weakness — note for journal.",
            "Use same ABC anchors as retracement on that swing for consistency.",
          ],
          difficulty: "intermediate",
        },
        {
          id: "abc-projection-method",
          title: "The ABC Projection Method",
          summary:
            "Use three swing points — A start, B extreme, C pullback end — to project measured move targets.",
          body: [
            "Point A: start of impulse. Point B: end of impulse (extreme). Point C: end of pullback (where you enter or structure resumes). Extensions project from C beyond B in the trend direction.",
            "The ABC method embeds both retracement (A to B measured, C retraces) and extension (C to new targets). One tool can serve entry zone (Fib retracement of AB) and targets (extensions from C).",
            "C must be defined by rules: bullish close off 61.8%, break of minor structure, or clear rejection candle. Arbitrary C placement projects arbitrary targets.",
            "Measured move symmetry: AB length projected from C approximates 100% extension — quick mental math when formal tool unavailable.",
            "When C breaks below A in supposed uptrend ABC, pattern invalid — do not project long targets.",
          ],
          keyPoints: [
            "A = impulse start, B = impulse end, C = pullback end.",
            "Extensions project from C beyond B for targets.",
            "C definition must follow objective rules.",
            "AB length ≈ 100% measured move from C.",
            "Invalid ABC structure = no projection.",
          ],
          manualTips: [
            "Mark A, B, C with small labels on chart — avoids redrawing wrong leg after entry.",
            "If C is still forming, projections are premature — wait for pullback completion.",
            "Compare extension targets to horizontal resistance — take profit where tools agree.",
            "Practice ABC on 20 historical swings without trading — speed improves.",
          ],
          difficulty: "intermediate",
        },
        {
          id: "extension-target-strategy",
          title: "Extension Target Strategy",
          summary:
            "Scale out systematically at extension clusters and structure obstacles.",
          body: [
            "Tiered exits: 30–50% position at 127.2% or first structure obstacle; another 30% at 161.8%; runner to 200–261.8% or trail below swings.",
            "When extension level and HTF resistance coincide, favor larger partial — double confluence resistance.",
            "In ranges, extensions from small legs often fail early — reduce target expectations.",
            "Trail runners using structure (below last 4H HL) rather than fixed extension — captures trend extension beyond 261.8% when parabolic.",
            "Document average achieved R per setup type — tune which extension you realistically hit in your market.",
          ],
          keyPoints: [
            "Tiered scale-out at 127.2%, 161.8%, and beyond.",
            "Prioritize partials where extensions meet structure.",
            "Range environments produce shorter extension follow-through.",
            "Trail runners on structure for parabolic moves.",
            "Journal achieved vs planned targets to calibrate expectations.",
          ],
          manualTips: [
            "Set limit sell/buy orders at extension levels before entry when platform allows.",
            "If price stalls between 127 and 161 with rejection candles, take extra partial manually.",
            "Do not move initial target further away after entry to justify hold — plan stands.",
            "Review runners monthly — trailing too tight may cost more than it saves.",
          ],
          difficulty: "intermediate",
        },
      ],
    },
    {
      id: "golden-pocket",
      title: "Golden Pocket",
      description:
        "Trade the high-probability zone between 61.8% and 65% retracements where many manual traders focus entries.",
      lessons: [
        {
          id: "what-is-golden-pocket",
          title: "What Is the Golden Pocket?",
          summary:
            "The golden pocket is the tight zone between roughly 61.8% and 65% Fib retracement — a sweet spot for trend pullbacks.",
          body: [
            "The golden pocket (GP) narrows the deep retracement area to between 61.8% and 65% (some include up to 70%). The idea: the healthiest trend pullbacks often bottom or top in this band before continuation.",
            "It gained popularity in trading communities because 61.8% alone is a wide single line — the pocket defines a band where confluence of Fib, structure, and order blocks frequently cluster.",
            "GP is not guaranteed support. It is a hunting zone — place alerts, watch price action, demand confirmation. Many best trades tap 65% wick and rip without perfect 61.8 touch.",
            "Works best in clear trending environments on 4H and daily. In chop, GP gets violated repeatedly — useless.",
            "Pair GP with bullish structure: HL intact, HTF demand, liquidity sweep below prior low into GP — manual trader's high-confluence continuation setup.",
          ],
          keyPoints: [
            "GP ≈ 61.8%–65% retracement band.",
            "Hunting zone, not automatic buy line.",
            "Best in clear trends on HTF legs.",
            "Often aligns with structure and order blocks.",
            "Low value in ranging markets.",
          ],
          manualTips: [
            "Shade 61.8–65% on Fib tool if platform allows level fills between ratios.",
            "When GP overlaps demand zone, widen alert — reactions can be violent and fast.",
            "If GP fails with daily close below, exit long bias on that leg — do not average.",
            "Collect 10 GP screenshots from your favorite symbol — pattern eye trains quickly.",
          ],
          difficulty: "intermediate",
        },
        {
          id: "golden-pocket-entries",
          title: "Golden Pocket Entry Tactics",
          summary:
            "Practical entry methods inside the pocket with defined risk and confirmation options.",
          body: [
            "Aggressive: split limit orders at 61.8 and 65 with shared stop below 78.6% or swing low. Gets average entry in pocket without timing exact tick.",
            "Conservative: wait for 15m/1H rejection candle in pocket (hammer, engulfing) on LTF while on 4H GP — better confirmation, may miss fast reversals.",
            "Liquidity variant: price sweeps below 65% or prior swing low, reclaims pocket — SMC-style entry with stop below sweep wick.",
            "Size down in GP vs shallow 38.2 entries — deeper pullback means wider stop in points; keep $ risk constant.",
            "If entry fills but LTF structure breaks (LL on 1H in supposed uptrend), scratch early — GP failed this time.",
          ],
          keyPoints: [
            "Split limits at 61.8/65 or wait for LTF confirmation in pocket.",
            "Sweep-and-reclaim into GP is high-quality variant.",
            "Wider structural stops in GP — adjust size for fixed $ risk.",
            "Early scratch if LTF structure breaks after entry.",
            "Missed fast rip beats forcing market chase without plan.",
          ],
          manualTips: [
            "Pre-calculate position size from GP stop distance before session.",
            "Use lower timeframe only for trigger, not for redrawn Fib anchors every 5 minutes.",
            "If first touch of GP in a new trend, A-grade; third touch, downgrade heavily.",
            "Journal GP vs 50% only entries — know which fits your personality and market.",
          ],
          difficulty: "intermediate",
        },
        {
          id: "golden-pocket-failures",
          title: "When the Golden Pocket Fails",
          summary:
            "Recognize invalidation and avoid the common trap of averaging down in a broken pocket.",
          body: [
            "GP fails when price accepts below 78.6% or breaks the swing low that defined 100% Fib — the impulse is fully retraced or structure broke.",
            "Failure signs before full break: heavy bearish closes inside pocket, inability to reclaim 50% after GP touch, opposing HTF trend engaging.",
            "Do not move Fib anchors to 'make' GP fit after price falls through — anchor cheating destroys edge.",
            "After failure, watch for reversal setups at deeper HTF levels or flip to range playbook — do not insist on original long thesis.",
            "Failed GP longs that become breakdown shorts are valid — but require new confirmation, not anger trading.",
          ],
          keyPoints: [
            "Full retrace or 100% swing break invalidates GP long thesis.",
            "Warning: weak closes in pocket, failed reclaim of 50%.",
            "Never re-anchor Fib to force levels to price.",
            "Switch playbook after failure — range or reversal.",
            "Re-entry requires new setup, not hope.",
          ],
          manualTips: [
            "Set hard alert at 100% Fib swing low — GP thesis dies there.",
            "Mark 'GP failed' in journal with chart — review monthly for early warning signs you missed.",
            "If you averaged in GP twice, implement rule: one entry per zone max.",
            "Sometimes failure means parabolic continuation shallow trend — redraw new smaller leg Fib.",
          ],
          difficulty: "advanced",
        },
      ],
    },
    {
      id: "fib-structure-confluence",
      title: "Fib + Structure Confluence",
      description:
        "Stack Fibonacci levels with market structure, supply/demand, and liquidity for higher-quality manual setups.",
      lessons: [
        {
          id: "fib-with-swing-structure",
          title: "Fibonacci with Swing Structure",
          summary:
            "Align Fib pullback zones with intact higher lows and protected swing structure.",
          body: [
            "Fibonacci works best when structure confirms trend health: in uptrend, 50–61.8% pullback that holds above last major HL is textbook. If same pullback breaks HL, Fib level is secondary to structure break.",
            "Draw Fib on impulse that created the most recent HH. If pullback respects GP and prints new HL above prior, continuation odds improve.",
            "Structure-Fib conflict: 61.8% sits below last HL — choose structure over Fib for stop and bias. The shallower effective entry may be above GP.",
            "Multiple impulses: after first GP entry works, second leg Fib draws from new A/B — trail and add only on new confirmed legs, not mid-pullback guesses.",
            "Manual traders phrase it: 'Structure first, Fib second.'",
          ],
          keyPoints: [
            "Healthy pullback holds Fib zone AND prior HL.",
            "HL break outweighs pretty Fib level.",
            "Redraw Fib each new impulse leg after continuation.",
            "Conflict resolution favors structure for stops.",
            "Structure first, Fib second.",
          ],
          manualTips: [
            "Mark HL horizontal at same time as Fib draw — visual overlap obvious.",
            "If GP is 10 pips below HL, use HL area for stop, GP for entry — plan the gap.",
            "On 4H, structure beats 15m Fib redraw noise — anchor higher TF.",
            "Walk through 5 historical trends labeling HL + GP touches — muscle memory.",
          ],
          difficulty: "intermediate",
        },
        {
          id: "fib-supply-demand-liquidity",
          title: "Fib + Supply/Demand and Liquidity",
          summary:
            "Triple confluence when Fib zones overlap departure zones and liquidity pools.",
          body: [
            "Demand zone from impulse origin often sits near 61.8%–78.6% of prior larger swing — when GP overlaps demand, manual traders upgrade watchlist priority.",
            "Liquidity below pullback low + GP confluence: sweep then reclaim is institutional narrative AND Fib playbook combined.",
            "Supply above in downtrend: GP from bearish impulse aligns with supply for short entries on rally.",
            "When Fib level sits in 'no man's land' between zones, downgrade — confluence absent.",
            "Document confluence trades separately in journal — expect higher win rate but fewer frequency.",
          ],
          keyPoints: [
            "GP + demand/supply overlap = strong confluence.",
            "Liquidity sweep into GP + zone = premium setup.",
            "No overlap with zones = lower grade Fib trade.",
            "Confluence trades are fewer but higher quality.",
            "Track stats separately for confluence vs naked Fib.",
          ],
          manualTips: [
            "Use semi-transparent zone boxes — see Fib through demand rectangle.",
            "Three-check: GP? demand? sweep? — all yes before A+ label.",
            "If only two of three, still tradable with normal size — not max size.",
            "Weekly scan: filter symbols where price approaching HTF GP confluence.",
          ],
          difficulty: "advanced",
        },
        {
          id: "multi-timeframe-fib",
          title: "Multi-Timeframe Fibonacci",
          summary:
            "Nest daily, 4-hour, and 1-hour Fib levels to find stacked pullback zones.",
          body: [
            "Top-down Fib: weekly impulse for macro 50%, daily impulse for trade leg GP, 4H for entry timing. Entry when 4H GP sits inside daily GP — stacked pocket.",
            "Higher TF Fib outweighs lower when they conflict. Daily 61.8% matters more than 15m 61.8% if levels disagree.",
            "Lower TF Fib helps snipe entries inside HTF zone — do not use LTF Fib alone for swing bias.",
            "Refresh draws when HTF candle closes new swing — end-of-day routine for swing traders.",
            "Avoid Fib spaghetti: max two active draws per symbol unless paper trading study.",
          ],
          keyPoints: [
            "Stack HTF and LTF Fib zones for precision entries.",
            "HTF Fib dominates on conflict.",
            "LTF Fib for timing inside HTF zone only.",
            "Update anchors after confirmed HTF swing closes.",
            "Limit active Fib count for clarity.",
          ],
          manualTips: [
            "Daily GP + 4H GP overlap: set primary alert at overlap mid-point.",
            "When nested, stop uses HTF structure, entry uses LTF trigger candle.",
            "Sunday scan: redraw weekly/daily Fibs on watchlist for the week ahead.",
            "If confused by overlapping ratios, hide minor levels — show 61.8 only on each TF.",
          ],
          difficulty: "advanced",
        },
      ],
    },
    {
      id: "fib-drawing-invalidation",
      title: "Drawing & Invalidation Rules",
      description:
        "Objective rules for when Fibonacci analysis is valid, when to redraw, and when to abandon the setup.",
      lessons: [
        {
          id: "when-fib-is-valid",
          title: "When Fibonacci Analysis Is Valid",
          summary:
            "Fib applies in trending impulses with clear A/B swings — not in all market conditions.",
          body: [
            "Valid: clear directional impulse after breakout or in established trend; pullback underway or expected; swing points agreed upon on your timeframe.",
            "Invalid: horizontal range with no impulse; V-reversal spike with no pullback structure; news spike candle as sole 'leg'; overlapping choppy swings.",
            "Trend maturity: after 5th GP touch in same mega-trend, Fib edge may decay — later legs shallow. Adapt expectations.",
            "Instrument fit: liquid trending markets respect Fib better than illiquid penny stocks gapping daily.",
            "If you cannot explain the impulse in one sentence, Fib is not valid yet.",
          ],
          keyPoints: [
            "Needs clear impulse + pullback context.",
            "Ranges and chaotic spikes invalidate standard Fib use.",
            "Repeated GP touches reduce edge over long trends.",
            "Liquidity and trend quality matter.",
            "One-sentence impulse test filters bad draws.",
          ],
          manualTips: [
            "Before drawing, say aloud: 'We rallied from X to Y, now pulling back' — if awkward, wait.",
            "Tag charts TREND vs RANGE in journal — only draw Fib on TREND tag.",
            "Crypto: watch weekend gaps affecting swing anchors — adjust Monday.",
            "If valid Fib and invalid structure, skip — validity is joint condition.",
          ],
          difficulty: "beginner",
        },
        {
          id: "redraw-rules",
          title: "When to Redraw Fibonacci",
          summary:
            "Redraw after new confirmed swings — never mid-candle chase to fit desired entry.",
          body: [
            "Redraw when: new HH forms after GP continuation (new leg A/B); pullback exceeded 100% (old leg dead); timeframe shift for new trade plan; original anchors were objectively wrong in review.",
            "Do not redraw when: price approaches your level and you want it closer; single wick pierces level; emotional discomfort with stop distance.",
            "Confirmation before redraw: candle close establishing new swing, not intraday flicker.",
            "Keep ghost of old Fib faintly for session to see if price still respects it — then delete.",
            "Redraw ritual at session open and after HTF close — not every 10 minutes.",
          ],
          keyPoints: [
            "New impulse leg = new Fib draw after confirmed swing.",
            "100% break = old Fib retired.",
            "Never redraw to chase price toward your bias.",
            "Close confirms new swing before anchor move.",
            "Scheduled redraw beats constant tinkering.",
          ],
          manualTips: [
            "Duplicate chart pane: one frozen morning Fib, one live — compare respect/honesty.",
            "If you redrew more than twice on one leg, you had no valid leg — walk away.",
            "Automate alert on swing high/low break instead of manual anchor scooting.",
            "Weekly review: count redraws per trade — high count correlates with losses for most traders.",
          ],
          difficulty: "intermediate",
        },
        {
          id: "fib-invalidation-checklist",
          title: "Fibonacci Invalidation Checklist",
          summary:
            "A hard checklist for abandoning Fib-based trade ideas before and after entry.",
          body: [
            "Pre-entry invalidation: HTF structure breaks against trade; pullback closes beyond 100%; GP zone violated on close with no reclaim; economic event invalidates technical setup.",
            "Post-entry invalidation: stop hit (obvious); close below entry swing on trading TF; time stop — price stalls 3+ days in dead zone without follow-through for swings.",
            "Partial invalidation: reach 127.2% extension — take partials, do not call trend dead. Trail remainder.",
            "Psychological invalidation is not technical — 'feels wrong' without chart change is not exit signal.",
            "After invalidation, mandatory cool-off before reusing Fib on same symbol same day — prevents revenge redraws.",
          ],
          keyPoints: [
            "100% retrace + structure break = idea dead pre-entry.",
            "Post-entry: honor stop and close-based structure breaks.",
            "Time stops help dead swing trades.",
            "127.2% hit is partial win, not full invalidation.",
            "Cool-off after invalidation prevents tilt redraws.",
          ],
          manualTips: [
            "Print invalidation checklist next to Fib lessons — check literally before order.",
            "Set calendar reminder 3 days after swing entry — review time stop rule.",
            "Broker notes field: 'Inv = below X' on every Fib trade.",
            "Simulate 10 invalidated GP trades in replay — practice emotional neutrality.",
          ],
          difficulty: "intermediate",
        },
        {
          id: "common-fib-mistakes",
          title: "Common Fibonacci Mistakes",
          summary:
            "Avoid anchor errors, level obsession, and trading Fib without confirmation.",
          body: [
            "Mistake: measuring wrong leg (entire year vs current swing). Fix: most recent clear impulse.",
            "Mistake: treating 61.8 as exact price. Fix: zone + confirmation.",
            "Mistake: ignoring HTF range overhead. Fix: extensions into resistance are partial zones.",
            "Mistake: Fib on counter-trend without level. Fix: structure alignment required.",
            "Mistake: too many ratios cluttering chart. Fix: minimal template.",
            "Mistake: no stop beyond invalidation. Fix: define before entry always.",
          ],
          keyPoints: [
            "Wrong leg measurement is the #1 error.",
            "Zones and confirmation beat exact ratio religion.",
            "Respect overhead/underfoot structure at extensions.",
            "Counter-trend Fib needs extra confluence.",
            "Minimal ratios, defined stops always.",
          ],
          manualTips: [
            "Peer review: ask friend 'which leg did I measure?' — if they hesitate, redraw.",
            "Cover all Fib levels except 61.8 for a month — simplification test often improves results.",
            "Log mistake type on losing Fib trades — anchor vs confirmation vs structure.",
            "Never post 'Fib proved wrong' — either plan was invalid or stop was correct; learn which.",
          ],
          difficulty: "beginner",
        },
      ],
    },
  ],
};