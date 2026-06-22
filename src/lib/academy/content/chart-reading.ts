import type { AcademyCategory } from "../types";

export const chartReadingCategory: AcademyCategory = {
  id: "chart-reading",
  title: "Chart Reading Fundamentals",
  description:
    "Build a solid foundation for reading price charts manually. Learn how to interpret candles, levels, trends, timeframes, and volume without relying on indicators or automation.",
  sections: [
    {
      id: "price-action-basics",
      title: "Price Action Basics",
      description:
        "Understand what price is telling you on a chart and how to read individual bars in context.",
      lessons: [
        {
          id: "what-is-price-action",
          title: "What Is Price Action?",
          summary:
            "Price action is the study of raw price movement on a chart — the language markets speak before any indicator is applied.",
          body: [
            "Price action refers to the movement of an asset's price over time, displayed as candles, bars, or a line on a chart. Every candle tells a story: who was in control during that period, how much conviction buyers or sellers showed, and where the battle between them ended.",
            "Manual traders use price action because it is universal. Whether you trade forex, stocks, crypto, or futures, the same principles apply: higher highs suggest bullish pressure, lower lows suggest bearish pressure, and the size and shape of candles reveal the intensity of that pressure.",
            "Unlike lagging indicators that summarize past data, price action shows you what is happening right now. A long bullish candle closing near its high after a pullback tells you buyers stepped in aggressively. A small-bodied candle with long wicks after a strong move often signals indecision or exhaustion.",
            "Your job as a manual trader is not to predict every tick. It is to read the auction: who is willing to pay more, who is willing to sell cheaper, and where that balance shifts. Price action gives you that auction in visual form.",
            "Start by stripping your chart down. Remove unnecessary overlays and focus on clean candles on one or two timeframes. The clarity you gain will outweigh any signal an indicator might give you in isolation.",
          ],
          keyPoints: [
            "Price action is the raw movement of price — the most direct market feedback available.",
            "Every candle reflects a battle between buyers and sellers during a specific time period.",
            "Reading price action works across all markets and timeframes.",
            "Context matters: a bullish candle means more after a pullback in an uptrend than in a choppy range.",
            "Simplicity beats clutter — fewer overlays often lead to clearer decisions.",
          ],
          manualTips: [
            "Open a blank chart with only candles and mark the last 20 swings by hand. Notice patterns before adding any tools.",
            "Pause after each candle closes on your trading timeframe and ask: who won this period, and did they finish strong?",
            "Screenshot charts where you were wrong and label what price was actually saying — this builds pattern recognition faster than indicators.",
            "Use the same chart layout every session so your eye learns one visual language.",
          ],
          difficulty: "beginner",
        },
        {
          id: "reading-candle-components",
          title: "Reading Open, High, Low, and Close",
          summary:
            "Learn how the four data points inside every candle reveal control, rejection, and conviction.",
          body: [
            "Every candlestick has four essential prices: open, high, low, and close. The open is where trading began for that period. The close is where it ended — and in manual trading, the close often matters most because it shows who held control when the period finished.",
            "The high and low show the full range of the auction. A long upper wick means price was pushed up but sellers rejected those levels before the close. A long lower wick means sellers drove price down but buyers reclaimed ground. The body shows the distance between open and close; a large body signals decisive movement, a small body signals hesitation.",
            "Bullish candles typically close above the open (often colored green or white). Bearish candles close below the open (often red or black). On any platform, learn how to toggle colors and ensure wicks are visible — you cannot read rejection without seeing the full range.",
            "Compare consecutive candles rather than reading each in isolation. A bearish candle after three strong bullish candles may simply be profit-taking, not a reversal. Look at where the close sits relative to the prior candle's range: closing above the previous high is a sign of continuation; closing below the previous low is a sign of weakness.",
            "On higher timeframes, each candle compresses hours or days of behavior. On lower timeframes, each candle is a snapshot of minutes. Always know which timeframe you are reading — the same wick pattern means different things on a 1-minute chart versus a daily chart.",
          ],
          keyPoints: [
            "Open, high, low, and close define every candle's story.",
            "The close reveals who controlled the period when it ended.",
            "Wicks show rejection; bodies show conviction.",
            "Always read candles in sequence, not in isolation.",
            "Timeframe determines how much information each candle compresses.",
          ],
          manualTips: [
            "Hover over any candle on your platform and verify O/H/L/C — build the habit of checking the numbers, not just the shape.",
            "Mark candles that close in the top or bottom 25% of their range during trends; these often lead the next leg.",
            "When a candle has a small body and long wicks on both sides, note the location — at support or resistance it often precedes a breakout or reversal.",
            "Practice on daily charts first; larger candles are easier to read before moving to intraday timeframes.",
          ],
          difficulty: "beginner",
        },
        {
          id: "bullish-vs-bearish-pressure",
          title: "Bullish vs Bearish Pressure",
          summary:
            "Identify who is in control by reading the sequence of highs, lows, and candle closes across multiple bars.",
          body: [
            "Bullish pressure appears when buyers consistently push price to higher highs and higher lows. You will see candles closing near their highs, shallow pullbacks, and quick recoveries when price dips. Bearish pressure is the mirror: lower highs, lower lows, closes near the lows, and weak bounces.",
            "Pressure is not binary — markets rotate between bullish, bearish, and balanced phases. A balanced market chops sideways with overlapping candles and no clear progression of highs or lows. Manual traders lose money most often by forcing trend trades inside balance. Learn to recognize when pressure is one-sided versus when it is contested.",
            "Momentum within pressure matters. Strong bullish pressure shows large-bodied candles in the trend direction and small-bodied candles against it. When bullish candles shrink and bearish candles grow, pressure is shifting even before structure formally breaks.",
            "Use swing points as anchors. In bullish pressure, each pullback low should hold above the prior swing low. In bearish pressure, each rally high should stay below the prior swing high. When that pattern breaks, pressure is changing — your bias should change with it.",
            "Pressure also shows in how price reacts at key levels. In a bullish environment, support holds and resistance breaks. In a bearish environment, resistance holds and support breaks. Reading pressure means watching these reactions, not just drawing lines.",
          ],
          keyPoints: [
            "Bullish pressure = higher highs and higher lows with strong bullish closes.",
            "Bearish pressure = lower highs and lower lows with strong bearish closes.",
            "Balanced markets chop — avoid forcing directional trades in ranges.",
            "Shrinking trend candles and growing counter-trend candles signal weakening pressure.",
            "How price reacts at levels confirms whether pressure is still intact.",
          ],
          manualTips: [
            "Label your chart with HH, HL, LH, LL at swing points for a week — pressure becomes obvious quickly.",
            "During a trend, count how many candles close in the trend direction vs against it over 10 bars.",
            "When unsure of bias, zoom out one timeframe; pressure is clearer on higher timeframes.",
            "Do not short just because price is 'high' or buy just because price is 'low' — follow pressure, not location alone.",
          ],
          difficulty: "beginner",
        },
        {
          id: "ranges-vs-trends",
          title: "Ranges vs Trends",
          summary:
            "Distinguish between trending and ranging markets so you apply the right strategy to each environment.",
          body: [
            "A trending market moves directionally with sustained higher highs and higher lows (uptrend) or lower highs and lower lows (downtrend). A ranging market oscillates between a defined ceiling (resistance) and floor (support) without making sustained progress in either direction.",
            "Trends reward patience with the direction: buy pullbacks in uptrends, sell rallies in downtrends. Ranges reward patience at the boundaries: buy near support, sell near resistance, or stand aside until a breakout occurs. The most common mistake is applying trend logic in a range — chasing breakouts that fail and getting stopped out repeatedly.",
            "Visually, ranges show overlapping candles, horizontal swing highs and lows, and mean reversion. Trends show directional separation: pullbacks are shallow, and price spends more time on one side of a moving average of price (even if you do not use indicators, you can eyeball whether price rides above or below recent mids).",
            "Transitions from range to trend often start with a false break or a compression phase where candles get smaller and range tightens. Manual traders watch for expansion: a large candle closing outside the range with follow-through often signals the start of a new trend leg.",
            "Define the environment before every trade. Ask: are we trending or ranging on this timeframe? Then ask: does my higher timeframe agree? Trading with the environment — not against it — is one of the highest-leverage skills in manual chart reading.",
          ],
          keyPoints: [
            "Trends progress directionally; ranges oscillate between support and resistance.",
            "Use trend strategies in trends and range strategies in ranges.",
            "Overlapping candles and flat swing points signal balance.",
            "Compression inside a range often precedes expansion and breakout.",
            "Always classify the environment on your trading timeframe and one level above.",
          ],
          manualTips: [
            "Draw a box around the last 20–40 candles — if price stays inside, you are in a range.",
            "In ranges, reduce position size or trade less; edge is thinner and whipsaws are common.",
            "Wait for a candle to close outside a range before calling a breakout — wicks alone are not enough.",
            "Keep a simple journal tag: TREND or RANGE for every session; review win rate by environment.",
          ],
          difficulty: "beginner",
        },
      ],
    },
    {
      id: "support-resistance",
      title: "Support & Resistance",
      description:
        "Identify where price is likely to react, how levels form, and how to trade reactions manually.",
      lessons: [
        {
          id: "what-are-support-resistance",
          title: "What Are Support and Resistance?",
          summary:
            "Support and resistance are price zones where buying or selling pressure has historically concentrated.",
          body: [
            "Support is a price zone where buying interest tends to emerge, slowing or reversing downward movement. Resistance is where selling interest tends to emerge, slowing or reversing upward movement. These are not exact lines — they are zones where the market has previously agreed that price was cheap (support) or expensive (resistance).",
            "Levels form because traders remember prior prices. Someone who bought at a swing low may defend that area again. Someone who sold at a swing high may sell again when price returns. Institutional orders and large resting liquidity also cluster at obvious chart points, reinforcing these zones.",
            "The more times price tests a level without breaking through, the more visible it becomes — but also the more likely it eventually breaks when liquidity is consumed. Fresh levels from recent swing points often produce sharper reactions than old levels tested many times.",
            "Support can become resistance after a break (and vice versa). When price breaks below support and later rallies back to that zone, former buyers may sell to exit at breakeven, turning support into resistance. This role reversal is a core manual trading concept.",
            "Draw zones, not razor-thin lines. A cluster of wicks or a consolidation base is more honest than a single tick. Your entries and stops should respect the zone width, especially on volatile assets.",
          ],
          keyPoints: [
            "Support and resistance are zones of concentrated buying or selling interest.",
            "Levels form at prior swing points, consolidations, and areas of heavy trading.",
            "Role reversal: broken support often becomes resistance, and vice versa.",
            "Fresh levels often react more cleanly than over-tested levels.",
            "Always think in zones rather than single-price lines.",
          ],
          manualTips: [
            "Mark the last three swing highs and lows on your chart before every session — these are your first support/resistance candidates.",
            "Use a rectangle or shaded band on your platform instead of a single horizontal line.",
            "When price pierces a level with a wick but closes back inside, the level is still intact — do not call the break early.",
            "Review weekly charts for major levels; they often matter on lower timeframes months later.",
          ],
          difficulty: "beginner",
        },
        {
          id: "drawing-levels-manually",
          title: "Drawing Levels Manually",
          summary:
            "A repeatable process for marking support and resistance that holds up across timeframes.",
          body: [
            "Start from the highest timeframe relevant to your hold time. A swing trader begins on weekly or daily; a day trader begins on daily or 4-hour. Mark obvious swing highs and lows where price reversed sharply — these are your primary levels.",
            "Connect areas, not single candles. If three swing lows sit within a narrow band, draw one zone covering all three. The zone should include the bodies and wicks that matter, not just the extreme tick. Platforms like TradingView, Thinkorswim, and MetaTrader all offer rectangle or horizontal ray tools — use what keeps your chart readable.",
            "Prioritize levels that align across timeframes. A daily support zone that matches a 4-hour consolidation floor is stronger than a level visible on only one chart. Manual traders build confluence by stacking independent reasons to care about a price area.",
            "Remove levels that price has clearly invalidated. A level broken with conviction (strong close beyond the zone with follow-through) should be deleted or flipped to the opposite role. Cluttered charts with dozens of old lines create paralysis.",
            "Re-draw weekly. Markets evolve; new swings create new levels. A five-minute ritual at the start of each week keeps your map current without over-analyzing every tick.",
          ],
          keyPoints: [
            "Begin level drawing on the timeframe above your trading timeframe.",
            "Draw zones that encompass multiple touch points, not isolated wicks.",
            "Multi-timeframe alignment strengthens a level.",
            "Delete or flip levels after clean breaks to reduce chart noise.",
            "Refresh your level map regularly as new structure forms.",
          ],
          manualTips: [
            "Limit yourself to 5–8 active levels per chart — if everything is important, nothing is.",
            "Color-code: one color for major HTF levels, another for intraday levels.",
            "Snap your horizontal tool to the bodies of consolidation bases; wicks can be outliers.",
            "Screenshot your level map and compare it to price action at week end — prune what did not matter.",
          ],
          difficulty: "beginner",
        },
        {
          id: "reaction-vs-break",
          title: "Reaction vs Break",
          summary:
            "Learn to tell when price will respect a level versus when it is likely to break through.",
          body: [
            "A reaction is when price approaches a level and reverses — buyers step in at support or sellers at resistance. A break is when price moves through the level and holds on the other side, often retesting it from above or below.",
            "Reactions show deceleration: candles get smaller as price nears the level, wicks form into the zone, and momentum candles fade. Breaks show acceleration: large candles close beyond the zone, volume often expands (if available), and pullbacks to the level are shallow.",
            "False breaks trap traders. Price pokes through support or resistance with a wick, triggers stops, then reverses hard. Manual traders wait for a candle close beyond the zone on their decision timeframe before treating a level as broken. Wicks are probes; closes are commitments.",
            "The third touch rule is a guideline, not a law: levels often hold on the first two tests and break on the third as liquidity is exhausted. Combine touch count with candle behavior — a weak third test with shrinking bodies is more likely to break than a sharp rejection with long wicks.",
            "Your trade plan should specify whether you are playing a reaction or a break. Mixing the two leads to inconsistent stops: reaction trades need stops beyond the zone; break trades need stops back inside the zone if the break fails.",
          ],
          keyPoints: [
            "Reactions show deceleration and rejection at a zone; breaks show acceleration through it.",
            "Require a close beyond the zone to confirm a break — wicks alone are insufficient.",
            "False breaks are common; wait for confirmation before committing.",
            "Touch count and candle quality help assess break probability.",
            "Reaction trades and break trades need different stop placement logic.",
          ],
          manualTips: [
            "Before entering, write one sentence: 'I expect a reaction' or 'I expect a break' — if you cannot decide, skip the trade.",
            "After a break, watch the retest: a hold on the first retest of flipped support/resistance adds confidence.",
            "If you get stopped on a break trade and price immediately re-enters the range, you likely caught a false break — note it.",
            "Measure how many pips or points price typically reacts at your level; this helps size targets realistically.",
          ],
          difficulty: "intermediate",
        },
        {
          id: "dynamic-vs-static-levels",
          title: "Dynamic vs Static Levels",
          summary:
            "Combine fixed horizontal zones with moving reference points like trendlines and prior day levels.",
          body: [
            "Static levels are horizontal zones based on fixed prices from prior swings, opens, or session extremes. They do not move as time passes. Dynamic levels adjust with price — trendlines connecting rising lows, moving averages of price, or VWAP on intraday charts are common examples.",
            "Static levels excel at marking major decision points: all-time highs, yearly lows, round numbers, and multi-touch horizontal zones. Dynamic levels excel at tracking trend health: as long as price respects a rising trendline or holds above a session VWAP, intraday bias can stay bullish.",
            "Manual traders use dynamic levels as filters, not gospel. A trendline break does not always mean trend death — sometimes price is just retesting horizontal structure below. Combine dynamic and static: for example, buy a pullback to a rising trendline only if it aligns with a known support zone.",
            "Prior session levels are powerful static references for day traders: previous day high, low, and close. Markets often revisit these prices in the next session. Mark them at the start of each day before the open.",
            "Avoid indicator overload. One or two dynamic references plus a handful of static zones is enough. The goal is clarity at the moment you pull the trigger manually.",
          ],
          keyPoints: [
            "Static levels are fixed price zones; dynamic levels move with price structure.",
            "Use static levels for major decisions and dynamic levels for trend tracking.",
            "Prior day high, low, and close are high-value static references for intraday trading.",
            "Confluence between dynamic and static levels strengthens a setup.",
            "Keep dynamic tools minimal — clarity beats complexity.",
          ],
          manualTips: [
            "Mark previous day high/low/close at session open — many platforms offer session tools or indicators for this.",
            "Draw trendlines connecting the last two to three swing lows in an uptrend; update when a swing is clearly superseded.",
            "If price is between static support below and static resistance above, treat dynamic tools as secondary.",
            "Erase trendlines that price has ignored for multiple swings — they are no longer relevant.",
          ],
          difficulty: "intermediate",
        },
      ],
    },
    {
      id: "trend-structure",
      title: "Trend & Structure",
      description:
        "Read market structure to define bias, spot transitions, and align entries with the dominant flow.",
      lessons: [
        {
          id: "market-structure-overview",
          title: "Market Structure Overview",
          summary:
            "Structure is the skeleton of price — swing highs and lows that reveal trend, balance, and transition.",
          body: [
            "Market structure is the sequence of swing highs and swing lows price creates as it moves. In an uptrend, swings form higher highs (HH) and higher lows (HL). In a downtrend, lower highs (LH) and lower lows (LL). In balance, swings are roughly equal and overlap.",
            "Structure gives manual traders objective bias. You are not guessing direction — you are reading what price has already done. As long as HLs hold in an uptrend, bias stays bullish until a HL is broken. That break is your signal that structure may be shifting.",
            "Not every minor wiggle is structure. Define swing points with rules: for example, a swing high must have lower highs on both sides, or price must reverse by a minimum amount. Consistent rules prevent you from seeing structure everywhere.",
            "Structure exists on every timeframe simultaneously. A bullish 15-minute structure can exist inside a bearish daily structure. Your trading timeframe structure defines entries; your higher timeframe structure defines whether those entries have tailwind or headwind.",
            "Learning structure is learning to read history. The chart is a record of agreed value. Your edge is interpreting that record faster and more consistently than reactive, emotional decisions.",
          ],
          keyPoints: [
            "Structure = sequence of swing highs and lows.",
            "Uptrend: HH + HL. Downtrend: LH + LL. Range: overlapping swings.",
            "Use consistent rules to define valid swing points.",
            "Align trading timeframe structure with higher timeframe bias.",
            "Broken structure is an early warning — adjust bias when key swings give way.",
          ],
          manualTips: [
            "Pick one swing definition (e.g., 3-candle pivot) and use it for 30 days before changing rules.",
            "Mark only the most recent 4–6 swings on your trading chart — older structure is context, not clutter.",
            "When structure on two timeframes conflicts, default to the higher timeframe for bias and lower for timing.",
            "Verbally describe structure out loud: 'We are making HLs' — if you cannot say it simply, simplify your marks.",
          ],
          difficulty: "intermediate",
        },
        {
          id: "identifying-swing-highs-lows",
          title: "Identifying Swing Highs and Lows",
          summary:
            "Mark reliable swing points that other traders also see — the anchors for structure and levels.",
          body: [
            "A swing high is a peak where price turned down meaningfully. A swing low is a trough where price turned up meaningfully. The simplest manual method: a swing high has at least one lower high to its left and one to its right on your chosen timeframe.",
            "Fractals make swings visible: significant highs and lows stand out as V-shaped or clear reversals. In fast markets, require a larger reversal or a pause (multiple small candles) before labeling a swing — this filters noise on lower timeframes.",
            "Equal highs and equal lows are special swings where price tests the same level twice without breaking. These clusters often hold liquidity and attract stop hunts. Mark them carefully; they frequently precede sharp moves when one side is swept.",
            "Swing points become support and resistance automatically. The low of a bullish impulse leg is support until broken. The high of a bearish impulse leg is resistance until broken. This links structure reading directly to level drawing.",
            "Review swings at session end. Did you mark the same points you would mark in hindsight? Consistency in swing labeling is a skill that separates discretionary traders who improve from those who stay random.",
          ],
          keyPoints: [
            "Swing highs/lows are turning points with lower highs or higher lows on both sides.",
            "Use minimum reversal criteria to avoid over-marking noise on fast timeframes.",
            "Equal highs/lows are liquidity magnets — watch for sweeps and reversals.",
            "Swing points naturally define support and resistance levels.",
            "Consistent swing labeling is essential for repeatable structure analysis.",
          ],
          manualTips: [
            "Use your platform's fractal or pivot markers if available, but verify visually — tools can over-plot.",
            "On higher timeframes, swings are fewer and more trustworthy; start there and work down.",
            "Circle equal highs/lows in a distinct color — they deserve extra attention before entries.",
            "When in doubt, wait for one more candle to confirm the swing; late labels beat false ones.",
          ],
          difficulty: "intermediate",
        },
        {
          id: "trend-continuation-signals",
          title: "Trend Continuation Signals",
          summary:
            "Recognize when a trend is healthy and pullbacks offer high-quality manual entry opportunities.",
          body: [
            "Healthy trends pull back shallowly and resume quickly. After an impulse leg up, a brief consolidation or small bearish candles into prior support — without breaking the last HL — often sets up continuation longs. The same logic applies inverted for downtrends.",
            "Continuation signals include: holding a prior swing level, rejecting a broken resistance now acting as support, forming a tight flag or pennant, and printing a strong candle in the trend direction off a pullback low.",
            "Timing matters. Entering mid-impulse chases price and tightens stops. Entering at the end of a pullback aligns stop below structure and target with the next liquidity pool or swing high. Manual traders wait for the pullback to finish, not for the trend to prove itself twice.",
            "Multiple timeframe alignment strengthens continuation trades. If daily structure is bullish and your 1-hour chart pulls back to demand, you are trading with structural tailwind. If daily is bearish but 1-hour rallies, treat longs as counter-trend scalps with smaller size.",
            "Not every pullback is buyable. Deep pullbacks that break intermediate structure, or slow grinding reversals with heavy opposing candles, suggest trend weakness. Continuation requires evidence that the dominant side still controls.",
          ],
          keyPoints: [
            "Healthy trends show shallow pullbacks and quick resumption.",
            "Best entries are at the end of pullbacks, not mid-impulse.",
            "Prior swing levels and flipped S/R are prime continuation zones.",
            "Higher timeframe bias should support your continuation direction.",
            "Deep, slow pullbacks with broken intermediate structure warn of trend exhaustion.",
          ],
          manualTips: [
            "Measure pullback depth as a fraction of the last impulse — shallow (38–50%) pullbacks often continue in strong trends.",
            "Set alerts at the prior HL in an uptrend instead of staring at the chart — let price come to your level.",
            "After entry, trail logic should respect structure: move stop below each new HL as it forms.",
            "If two continuation setups fail in a row in the same trend, step back — structure may be transitioning.",
          ],
          difficulty: "intermediate",
        },
        {
          id: "trend-exhaustion-transitions",
          title: "Trend Exhaustion and Transitions",
          summary:
            "Spot when trends lose momentum and structure shifts from directional to balanced or opposing.",
          body: [
            "Trend exhaustion appears when impulse legs shorten, pullbacks deepen, and opposing candles grow larger. You may see repeated failures to make new highs in an uptrend — price pushes up but cannot sustain, creating LH on minor swings while major HL still holds.",
            "Climactic moves can end trends abruptly: several large candles in one direction followed by a sharp reversal candle that erases much of the move. Manual traders treat climaxes as warnings, not invitations to chase.",
            "Structure transition often begins with a break of the last protected swing: the HL in an uptrend or LH in a downtrend. That break is change of character on your timeframe — bias shifts from trend-following to caution or counter-trend.",
            "Ranges frequently emerge between trends. Price may chop for days after exhaustion before the next directional leg. Forcing trades during transition bleeds accounts. Reduce frequency until a clear HH/HL or LH/LL sequence re-establishes.",
            "Volume and session context help confirm exhaustion (covered elsewhere), but price alone often tells the story: failed breakouts, long wicks at extremes, and overlapping candles are enough to tighten risk.",
          ],
          keyPoints: [
            "Exhaustion: smaller impulsive legs, deeper pullbacks, stronger counter-trend candles.",
            "Climactic spikes often precede sharp reversals — avoid chasing late trend entries.",
            "Breaking the last protected HL/LH signals structural transition on that timeframe.",
            "Post-exhaustion ranges are low-edge environments — trade less.",
            "Wait for a fresh structure sequence before re-committing to strong directional bias.",
          ],
          manualTips: [
            "When you miss a trend, do not chase the last 10% — exhaustion entries hurt more than late FOMO gains.",
            "Mark the last protected swing at the start of each trend leg; when it breaks, review all open bias.",
            "Compare current impulse size to the average of the last three — shrinking size is a red flag.",
            "Journal 'transition weeks' separately — most traders give back gains by overtrading chop.",
          ],
          difficulty: "advanced",
        },
      ],
    },
    {
      id: "multi-timeframe-analysis",
      title: "Multi-Timeframe Analysis",
      description:
        "Combine higher-timeframe bias with lower-timeframe execution for clearer manual trade decisions.",
      lessons: [
        {
          id: "top-down-analysis",
          title: "Top-Down Analysis",
          summary:
            "Start from the big picture and drill down to find entries that align with dominant structure.",
          body: [
            "Top-down analysis means beginning on a higher timeframe (HTF) to establish bias, then moving to your trading timeframe for setup, and optionally to a lower timeframe for precise entry. The HTF tells you what to look for; the lower timeframes tell you when and where.",
            "A practical stack for swing traders: weekly bias, daily setup, 4-hour entry. Day traders might use daily bias, 1-hour setup, 15-minute entry. Scalpers compress further but should still anchor to at least one HTF level or session structure.",
            "On the HTF, answer three questions: Is structure trending or ranging? Where are the nearest major support and resistance zones? Is price approaching a decision point (HTF level, swing, or session extreme)?",
            "Drop to your trading timeframe only after HTF answers are clear. Look for setups that agree — for example, bullish daily structure pulling back to daily support aligns with a 1-hour bullish rejection candle.",
            "Top-down prevents counter-trend gambling. A beautiful 5-minute long means little if daily structure is bearish and price is under major resistance. Alignment does not guarantee success, but misalignment guarantees harder odds.",
          ],
          keyPoints: [
            "HTF defines bias; trading timeframe defines setup; LTF refines entry.",
            "Answer structure, levels, and location on HTF before dropping down.",
            "Aligned timeframes improve probability — misalignment increases risk.",
            "Use a consistent timeframe stack matched to your hold time.",
            "Top-down is a filter, not a second trade idea on every chart.",
          ],
          manualTips: [
            "Write HTF bias on a sticky note at your desk: BULL / BEAR / RANGE — update once per session.",
            "Keep three chart tabs or a multi-layout with synchronized symbol — switching symbols without switching timeframes causes mistakes.",
            "If LTF setup looks perfect but HTF is mid-range with no room to target, pass.",
            "Practice top-down on one pair or stock for 20 sessions before expanding watchlists.",
          ],
          difficulty: "intermediate",
        },
        {
          id: "timeframe-correlation",
          title: "Timeframe Correlation",
          summary:
            "Understand how the same market tells different stories on different timeframes — and which story to trust.",
          body: [
            "Each timeframe is a zoom level on the same auction. A 5-minute downtrend can be a single pullback candle on the 1-hour chart. Neither is wrong — they describe different periods. Problems arise when traders mix biases without hierarchy.",
            "Hierarchy rule: the higher timeframe dominates direction for swing and position context; the trading timeframe dominates for stop and target placement. A lower timeframe counter-trend move is acceptable for entry precision if HTF bias is clear and risk is small.",
            "Correlation also appears in levels: a 4-hour support zone may contain several 15-minute swings. When levels from multiple timeframes cluster, reactions are often stronger. Mark these stacks on your chart.",
            "Divergence between timeframes signals caution. If 1-hour makes HH/HL but 15-minute breaks its HL, short-term weakness may deepen into HTF pullback — or it may be a shakeout. Use HTF structure to judge whether the LTF break matters.",
            "Avoid analysis paralysis. You need two, maybe three timeframes — not six. Pick a stack, learn it deeply, and ignore the rest until proficiency is automatic.",
          ],
          keyPoints: [
            "Different timeframes show different structure on the same instrument — all can be valid.",
            "Higher timeframe bias takes priority for directional trades.",
            "Stacked levels across timeframes create high-interest zones.",
            "LTF structure breaks against HTF bias require extra confirmation or smaller size.",
            "Limit yourself to 2–3 timeframes to stay decisive.",
          ],
          manualTips: [
            "When LTF and HTF conflict, reduce size by 50% or wait — do not average up conviction.",
            "Use one color for HTF zones and another for LTF zones where they overlap, highlight the overlap.",
            "Set your trading timeframe at 4–6x smaller than your bias timeframe (e.g., 1H bias, 10–15m entries).",
            "Replay historical days and label when LTF misled you despite HTF — pattern recognition improves quickly.",
          ],
          difficulty: "intermediate",
        },
        {
          id: "fractal-nature-of-markets",
          title: "The Fractal Nature of Markets",
          summary:
            "Patterns repeat across scales — use fractal thinking to transfer skills between timeframes.",
          body: [
            "Markets are fractal: similar patterns of impulse, pullback, consolidation, and breakout appear on minute charts and monthly charts. A bull flag on the 15-minute often resembles a weekly consolidation — the psychology is the same, only the time scale changes.",
            "Fractal awareness helps you transfer experience. Skills learned on daily charts — patience, waiting for pullbacks, respecting levels — apply directly when you zoom in. The mistake is thinking lower timeframes require less discipline; they usually require more.",
            "Self-similarity does not mean identical outcomes. A pattern that works on daily may fail on 1-minute because noise, spread, and session effects dominate. Scale your expectations: targets and stops must respect the volatility of the timeframe you trade.",
            "Use fractals for practice. Study a completed pattern on HTF, then find the same pattern type on LTF in historical data. This builds a library of visual references your brain recognizes under pressure.",
            "When teaching yourself a new market, start HTF and work down. Fractal structure reveals itself more clearly when you are not drowning in tick noise.",
          ],
          keyPoints: [
            "Impulse-pullback-consolidation patterns repeat across timeframes.",
            "Trading skills transfer across scales — discipline must scale too.",
            "Lower timeframes have more noise; adjust stops and targets accordingly.",
            "Build a visual pattern library by studying HTF and LTF examples side by side.",
            "Learn new instruments on higher timeframes first.",
          ],
          manualTips: [
            "Take a weekly chart pattern you understand and scroll intraday history to find 5 miniature versions — study reactions.",
            "Match your stop distance to average candle range on your trading timeframe, not someone else's template.",
            "If a setup 'looks right' but feels rushed, check if you dropped too many timeframes at once.",
            "Fractal thinking helps journaling: tag pattern type (flag, range, sweep) independent of timeframe.",
          ],
          difficulty: "advanced",
        },
      ],
    },
    {
      id: "volume-context",
      title: "Volume & Context",
      description:
        "Add volume and situational context to price reading for stronger manual trade validation.",
      lessons: [
        {
          id: "volume-basics",
          title: "Volume Basics for Price Readers",
          summary:
            "Volume shows participation — how many shares, contracts, or units traded during a move.",
          body: [
            "Volume is the number of units traded in a period. It answers: how many participants agreed on that price move? A rally on rising volume suggests broad participation and conviction. A rally on falling volume suggests fewer buyers pushing price — the move may be fragile.",
            "Volume is not available on all forex charts (spot FX is decentralized), but futures, stocks, and crypto spot markets provide it. If your instrument lacks reliable volume, use tick volume or order book depth as a proxy, or lean more on price structure and session context.",
            "Basic manual rules: breakouts on expanding volume are more trustworthy than breakouts on thin volume. Pullbacks on declining volume often indicate trend health. Climactic volume spikes at extremes can mark exhaustion as late participants pile in.",
            "Compare volume relatively, not absolutely. Today's volume matters versus the 20-day average, not versus a different stock. Use your platform's volume histogram and note whether current bars are above or below recent norms.",
            "Volume confirms; it does not replace price. A high-volume failed breakout still failed — price closed back in the range. Always let candle closes and structure lead; volume is a second opinion.",
          ],
          keyPoints: [
            "Volume measures participation behind a price move.",
            "Rising price + rising volume = stronger conviction (general rule).",
            "Breakouts prefer expanding volume; weak volume breakouts are suspect.",
            "Climactic volume at extremes can signal exhaustion.",
            "Price and structure remain primary; volume confirms.",
          ],
          manualTips: [
            "Toggle volume histogram below your main chart — make it visible even if you trade mostly structure.",
            "On breakout days, note volume in your journal; compare win rate vs low-volume breakouts.",
            "If volume data is poor for your market, note session time (London/NY overlap) as participation proxy.",
            "Watch for volume drying up inside a range — it often precedes expansion.",
          ],
          difficulty: "beginner",
        },
        {
          id: "session-timing-context",
          title: "Session Timing and Market Context",
          summary:
            "Time of day, week, and scheduled events change how price behaves — context is part of chart reading.",
          body: [
            "Markets have rhythms. Equity cash sessions open and close with distinct volume bursts. Forex moves differently during Asia, London, and New York. Crypto trades 24/7 but still shows periodic liquidity patterns. Manual traders align activity with when their market actually moves.",
            "Opening ranges — the first 15–60 minutes of a session — often establish the day's initial balance. Breakouts or failures from that range set intraday tone. Mark the opening range high and low before deciding on mid-day trades.",
            "Economic calendars matter. High-impact releases (employment, inflation, central bank decisions) create spikes that invalidate technical setups temporarily. Many manual traders step aside 30 minutes before and after major news on affected instruments.",
            "Day of week effects are real but subtle. Monday can be slow as participants reposition; Friday afternoons may see profit-taking and thinner follow-through. Adapt expectations, not superstition — still trade the chart, but know typical liquidity.",
            "Context includes broader market correlation. A stock may reject perfectly at support but fail if the index dumps. Check one correlated benchmark (sector ETF, index futures, BTC for alts) before sizing up.",
          ],
          keyPoints: [
            "Liquidity and volatility vary by session — trade when your market is active.",
            "Opening ranges often define early intraday structure.",
            "Major scheduled news can invalidate setups — plan stand-aside windows.",
            "Correlated markets affect individual instrument behavior.",
            "Context adjusts expectations; it does not replace technical rules.",
          ],
          manualTips: [
            "Mark economic events on a calendar visible from your desk — color-code high impact.",
            "For US stocks, note pre-market high/low; gaps often fill or defend those levels.",
            "Track your win rate by session hour for 30 trades — you may discover you only have edge at certain times.",
            "Before entry, glance at the index or sector — 10 seconds can prevent a correlated stop-out.",
          ],
          difficulty: "intermediate",
        },
        {
          id: "putting-it-together",
          title: "Putting It All Together",
          summary:
            "A pre-trade checklist that combines price action, levels, structure, timeframes, and context.",
          body: [
            "Before every manual trade, run a consistent checklist. Direction: what is HTF structure — bullish, bearish, or range? Location: is price at a meaningful support/resistance or liquidity zone? Timing: is your setup candle closed, and does session context support the move?",
            "Confirmation: do you see rejection (wicks, engulfing, failed break) or continuation (hold of level, strong close with trend)? Risk: where is structure invalidated — the swing low/high beyond which your idea is wrong? Reward: is there room to the next level, or are you entering into HTF opposition?",
            "Scoring can be simple: require at least three independent reasons (structure + level + candle signal). If you only have one reason ('it looks like it's going up'), pass. Manual trading edge comes from selectivity.",
            "After entry, manage mechanically: stop at invalidation, target at next logical level or partial at 1R. Do not rewrite the story mid-trade because of fear. The chart either confirms with follow-through or hits your stop.",
            "Weekly review ties it together. Which checklist items appeared in winners vs losers? Double down on filters that correlate with success. Chart reading improves through closed-loop review, not through more indicators.",
          ],
          keyPoints: [
            "Use a fixed pre-trade checklist: bias, location, timing, confirmation, risk, reward.",
            "Require multiple independent reasons before entering.",
            "Define invalidation before entry — not after price moves against you.",
            "Post-trade review is how checklist quality improves over time.",
            "Selectivity is the main edge for manual discretionary traders.",
          ],
          manualTips: [
            "Print your checklist and keep it beside your monitor until it is muscle memory.",
            "Rate each trade A/B/C for setup quality at entry — correlate grades with P&L monthly.",
            "If you break your checklist three times in one week, stop trading for a day and reset.",
            "Screenshot the full multi-timeframe view at entry — future you will learn faster from visual records.",
          ],
          difficulty: "intermediate",
        },
      ],
    },
  ],
};