import type { AcademyCategory } from "../types";

export const candlestickCategory: AcademyCategory = {
  id: "candlesticks",
  title: "Candlestick Patterns",
  description:
    "Master single-, two-, and three-candle formations used by manual traders to read momentum shifts, reversals, and continuations at key chart locations.",
  sections: [
    {
      id: "single-candle-patterns",
      title: "Single-Candle Patterns",
      description:
        "Individual candles that signal indecision, rejection, or strong conviction when read in context.",
      lessons: [
        {
          id: "doji",
          title: "Doji",
          summary:
            "A doji forms when open and close are nearly equal, signaling balance and potential turning points at extremes.",
          body: [
            "A doji has a very small or nonexistent body because price closed near where it opened. The long wicks show that both buyers and sellers pushed price during the period, but neither side won by the close. Dojis are indecision candles — not automatic reversal signals.",
            "Context determines meaning. A doji after a strong uptrend at resistance suggests buyers lost momentum. A doji after a sharp drop at support suggests sellers exhausted. A doji in the middle of a range usually means nothing — balance in balance is noise.",
            "Types include the long-legged doji (large wicks both sides), dragonfly doji (long lower wick, close near high), and gravestone doji (long upper wick, close near low). Dragonfly and gravestone dojis at extremes carry more directional hint than generic small dojis.",
            "Manual traders wait for confirmation. A doji alone does not justify entry. Look for the next candle: a strong bullish close above the doji high after support dragonfly supports longs; a bearish close below gravestone doji low supports shorts.",
            "On higher timeframes, a daily doji at a major level matters more than five 1-minute dojis in chop. Scale your reaction to the timeframe and the quality of the location.",
          ],
          keyPoints: [
            "Doji = open ≈ close; signals indecision, not guaranteed reversal.",
            "Dragonfly and gravestone dojis at extremes are more informative than mid-range dojis.",
            "Always require confirmation from the following candle or structure.",
            "Dojis at support/resistance are higher quality than dojis in chop.",
            "Higher timeframe dojis carry more weight.",
          ],
          manualTips: [
            "Do not trade every doji — mark only those at HTF levels or after extended moves.",
            "Set your alert at the doji high/low and let confirmation come to you.",
            "Compare doji size to recent candles; a doji after huge trend candles is more meaningful.",
            "Journal doji failures — mid-trend dojis that led to continuation teach humility fast.",
          ],
          difficulty: "beginner",
        },
        {
          id: "hammer-hanging-man",
          title: "Hammer and Hanging Man",
          summary:
            "Single candles with small bodies atop long lower wicks — hammers at lows suggest buying rejection; hanging men at highs warn of weakness.",
          body: [
            "The hammer appears after a decline (or at support): small body at the upper portion of the range, long lower wick at least twice the body size, little or no upper wick. It shows sellers drove price down intraperiod but buyers reclaimed control before the close.",
            "The hanging man looks identical but appears after a rally or at resistance. The same shape now warns that buyers could not hold the lows of the session — selling pressure emerged from below. Context flips the interpretation.",
            "Quality filters: the hammer/hanging man should stand out from prior candles. A tiny hammer in a tight range is weak. The best examples follow extended moves and print at obvious support or resistance zones with volume expansion on the reversal follow-through.",
            "Entry logic for manual traders: wait for price to trade above the hammer high (for longs) or below the hanging man low (for shorts) on the next candle or after a retest. Stops go beyond the wick extreme.",
            "Hammers do not work in strong downtrends without structure support. If HTF structure is bearish and every hammer gets run over, you are catching falling knives. Align with higher timeframe levels or wait for structure shift.",
          ],
          keyPoints: [
            "Hammer: after decline/support — bullish rejection signal.",
            "Hanging man: after rally/resistance — bearish warning signal.",
            "Long lower wick should be ~2x body; small upper wick preferred.",
            "Confirmation above hammer high / below hanging man low before entry.",
            "HTF context determines whether the pattern is tradeable.",
          ],
          manualTips: [
            "Rename patterns in your head by location: 'hammer at support' vs 'hanging man at resistance' — shape alone misleads.",
            "Measure wick-to-body ratio with your crosshair tool — sub-2x wicks are lower grade.",
            "Best hammers often coincide with liquidity sweeps below a known low.",
            "If confirmation candle gaps away, consider partial size on retest instead of chasing.",
          ],
          difficulty: "beginner",
        },
        {
          id: "shooting-star-inverted-hammer",
          title: "Shooting Star and Inverted Hammer",
          summary:
            "Long upper wick candles that show rejection from higher prices or tentative buying after declines.",
          body: [
            "The shooting star forms after an advance: small body near the low of the candle, long upper wick, little lower wick. Buyers pushed price up but sellers overwhelmed them by the close — rejection from higher prices.",
            "The inverted hammer mirrors the shape after a decline. It suggests buyers tested higher but were pushed back — yet the attempt may foreshadow a reversal if confirmed. Alone it is weaker than a hammer because rejection of highs within a down move is less decisive.",
            "Shooting stars at resistance, prior swing highs, or HTF supply zones are prime manual short setup candidates when confirmed. Inverted hammers at support can set up longs with confirmation above the high.",
            "Combine with prior trend: shooting star after three strong green candles into resistance is textbook. Shooting star in a bull flag mid-trend may only be a pause.",
            "Stop placement: above shooting star high for shorts; below inverted hammer low for longs until confirmation shifts structure.",
          ],
          keyPoints: [
            "Shooting star: long upper wick after rally — bearish rejection.",
            "Inverted hammer: same shape after decline — needs bullish confirmation.",
            "Best at clear resistance/support, not mid-range.",
            "Confirmation = close below shooting star body/low or above inverted hammer high.",
            "Pair with liquidity sweeps above highs for higher-quality shooting stars.",
          ],
          manualTips: [
            "Shooting stars that sweep equal highs then close bearish are high-conviction — mark the sweep.",
            "Do not short every upper wick — in strong uptrends, wicks are common and shallow.",
            "Use shooting star high as a micro invalidation level when scaling into shorts.",
            "On daily charts, shooting stars at 52-week resistance deserve watchlist priority.",
          ],
          difficulty: "beginner",
        },
        {
          id: "marubozu",
          title: "Marubozu",
          summary:
            "A full-bodied candle with little or no wicks — pure conviction from open to close in one direction.",
          body: [
            "A bullish marubozu opens at the low (or very near it) and closes at the high with minimal wicks. A bearish marubozu opens at the high and closes at the low. The message is clear: one side dominated the entire period without meaningful rejection.",
            "Marubozu candles often appear on breakouts from consolidation, news-driven impulses, or continuation legs in strong trends. They signal urgency — participants accepted prices quickly in one direction.",
            "Trading marubozu: chasing the close is risky due to extended stops. Manual traders often wait for a shallow pullback to the marubozu midpoint or open on a lower timeframe, then enter with trend if structure holds.",
            "A marubozu against your bias is a warning. A bearish marubozu through support invalidates longs. A bullish marubozu through resistance invalidates shorts. Let them update your level map immediately.",
            "Compare size: a marubozu larger than the average range of the last 20 candles is an expansion candle — significant. A tiny marubozu in chop is low quality.",
          ],
          keyPoints: [
            "Marubozu = strong directional control, minimal wicks.",
            "Often appears on breakouts and trend continuation impulses.",
            "Avoid chasing; prefer pullbacks to marubozu body for entries.",
            "Counter-bias marubozu through key levels invalidates opposing ideas.",
            "Relative size vs recent candles determines significance.",
          ],
          manualTips: [
            "Mark marubozu open and midpoint — pullbacks often stall there intraday.",
            "After a bullish marubozu breakout, first red candle that does not close below midpoint is often a hold signal.",
            "News marubozus fade sometimes — note whether move held next session.",
            "Color-highlight marubozus >1.5x average range in your journal for pattern study.",
          ],
          difficulty: "beginner",
        },
        {
          id: "spinning-top",
          title: "Spinning Top",
          summary:
            "Small body with wicks on both sides — short-term balance that matters most after strong trends.",
          body: [
            "A spinning top has a small real body centered between upper and lower wicks of similar length. Neither buyers nor sellers achieved a decisive close. It is a pause candle — the market catching its breath.",
            "After a long bullish run, a spinning top near resistance hints at slowing momentum but does not confirm reversal. After a bearish leg into support, it hints at slowing selling. In a range, spinning tops are common and low value.",
            "Manual traders treat spinning tops as 'yellow lights,' not red or green. Reduce urgency to add positions in the trend direction until a clearer signal (engulfing, break, or structure shift) appears.",
            "Clusters of spinning tops show compression — volatility contraction that may precede expansion. Note the range high and low of the cluster; the breakout direction often sets the next short-term move.",
            "Do not confuse spinning tops with dojis. Both show indecision, but spinning tops have slightly more visible bodies and balanced wicks. Interpretation is similar: context and confirmation rule.",
          ],
          keyPoints: [
            "Spinning top = small body, wicks both sides, indecision.",
            "Most meaningful after extended moves near key levels.",
            "Signals pause, not confirmed reversal — wait for follow-through.",
            "Clusters of spinning tops = compression before potential expansion.",
            "Low value inside choppy ranges.",
          ],
          manualTips: [
            "When you see three spinning tops in a row, box the range and wait for a close outside.",
            "Do not exit winning swings solely on one spinning top — trends absorb many pauses.",
            "Combine with volume: spinning top on declining volume in a trend often means healthy consolidation.",
            "Tag compression zones in your journal — note breakout direction win rate.",
          ],
          difficulty: "beginner",
        },
      ],
    },
    {
      id: "two-candle-patterns",
      title: "Two-Candle Patterns",
      description:
        "Two-candle combinations reveal how the second period completely or partially negates the first — often at turning points.",
      lessons: [
        {
          id: "bullish-bearish-engulfing",
          title: "Bullish and Bearish Engulfing",
          summary:
            "The second candle's body fully engulfs the first — a strong shift in control when located at key zones.",
          body: [
            "Bullish engulfing: first candle is bearish (or small), second is a larger bullish candle whose body completely covers the first's body. It shows buyers overwhelmed sellers within two periods. Bearish engulfing is the inverse at highs.",
            "Location is everything. Engulfing at HTF support after a downtrend is a classic manual long signal. Engulfing at resistance after a rally supports shorts. Mid-range engulfing is often a trap before the next range whipsaw.",
            "The engulfing body should be meaningful — not a 1-tick engulf of a doji. Look for clear size disparity and preferably a close near the engulfing candle's extreme in the direction of the trade.",
            "Stops typically go beyond the engulfing candle's wick low (longs) or wick high (shorts). Targets aim at the next structure level or opposing liquidity pool.",
            "Failed engulfing teaches discipline: if price immediately closes back through the engulfing body, the shift failed — exit or tighten stops without narrative.",
          ],
          keyPoints: [
            "Engulfing = second body fully covers first body.",
            "High quality at support/resistance after extended moves.",
            "Require meaningful body size — not marginal engulf of tiny candles.",
            "Stop beyond engulfing wick extreme; target at next structure.",
            "Close back through engulfing body = failed pattern.",
          ],
          manualTips: [
            "Screenshot every HTF engulfing for 30 days — build a personal gallery of what followed.",
            "Engulfing plus liquidity sweep below support is a favorite manual confluence.",
            "On lower timeframes, wait for the 2-candle pattern to close before entering — partial patterns lie.",
            "If engulfing occurs on Monday against Friday's thin liquidity, confirm with Tuesday follow-through.",
          ],
          difficulty: "beginner",
        },
        {
          id: "harami",
          title: "Bullish and Bearish Harami",
          summary:
            "A smaller candle contained within the prior body's range — momentum pause that may precede reversal.",
          body: [
            "Harami means 'pregnant' in Japanese — the large first candle is the mother, the small second is inside. Bullish harami: large bearish candle followed by smaller bullish candle inside its body. Bearish harami: large bullish followed by smaller bearish inside.",
            "Harami signals deceleration more than decisive reversal. The trend that produced the mother candle is losing steam. Manual traders treat harami as setup development, not execution — wait for a third candle break of the harami high/low.",
            "Quality improves when the mother candle is a marubozu or strong trend candle into a level, and the inside candle is a doji or spinning top. The combination screams 'pause at extreme.'",
            "Bullish harami at support with HTF alignment can precede sharp reversals. Bearish harami at resistance warns long holders. In strong trends, harami may only produce shallow pullbacks — do not assume full reversal.",
            "Trading trigger: buy above harami high (bullish) or sell below harami low (bearish) with stop on the other side of the mother candle or harami structure.",
          ],
          keyPoints: [
            "Harami = second candle's body inside first candle's body.",
            "Signals momentum pause more than immediate reversal.",
            "Best after strong mother candle into support/resistance.",
            "Enter on break of harami high/low, not on harami alone.",
            "In strong trends, expect shallow reaction unless structure breaks.",
          ],
          manualTips: [
            "Draw a box around the harami pair — treat breaks of the box as your trigger.",
            "Mother candle range is your initial risk reference for sizing.",
            "Bearish harami after 5 green days at resistance beats random mid-trend harami.",
            "If third candle is another inside bar, you have a compression — prepare for expansion.",
          ],
          difficulty: "intermediate",
        },
        {
          id: "piercing-dark-cloud",
          title: "Piercing Line and Dark Cloud Cover",
          summary:
            "Two-candle reversal patterns where the second candle reclaims or rejects roughly half the prior move.",
          body: [
            "Piercing line (bullish): in a downtrend, a strong bearish candle is followed by a bullish candle that opens below the prior low (gap down on daily stocks) and closes above the midpoint of the bearish body. Buyers reclaimed significant ground.",
            "Dark cloud cover (bearish): in an uptrend, bullish candle followed by bearish opening above prior high and closing below the midpoint of the bullish body. Sellers rejected higher prices meaningfully.",
            "The 50% penetration rule matters. A close barely above bearish open is weak piercing. A close deep into the body shows conviction. Manual traders eye the 50% line as minimum quality threshold.",
            "These patterns work best at HTF demand/supply and when the first candle is large — they are reversal dialogue between two strong periods. Small bodies produce small signals.",
            "Confirmation: optional third candle continuing direction, or retest of the piercing/dark cloud midpoint holding as support/resistance.",
          ],
          keyPoints: [
            "Piercing line = bullish; dark cloud = bearish — second candle crosses ~50% of first body.",
            "Minimum 50% penetration for quality classification.",
            "Requires existing trend into a key level.",
            "Large first candle + strong second close = higher grade.",
            "Use midpoint of pattern as reference for retest entries.",
          ],
          manualTips: [
            "Mark 50% of the first candle body — second close must cross it clearly.",
            "On forex 24h markets, 'gaps' are session gaps — piercing/dark cloud still work without true gaps.",
            "Pair with morning/evening star concepts when a third confirming candle appears.",
            "If second candle closes at only 40% penetration, downgrade to 'weak' and wait.",
          ],
          difficulty: "intermediate",
        },
        {
          id: "tweezer-tops-bottoms",
          title: "Tweezer Tops and Bottoms",
          summary:
            "Matching highs or lows across two candles showing failed attempts to push beyond a level.",
          body: [
            "Tweezer tops: two or more candles share nearly the same high after a rally — price tested resistance twice and failed to exceed. Tweezer bottoms: matching lows after a decline — support held twice.",
            "The candles need not be adjacent in all traditions, but manual traders focus on back-to-back or closely spaced pairs with obvious matching wick extremes. Body colors can differ; the matched wicks tell the story.",
            "Tweezers excel at equal highs/lows liquidity zones. When the second tweezer wick sweeps the first slightly then closes back, it is often a stop hunt followed by reversal — high-quality manual setup.",
            "Entry: fade the level after confirmation — bearish close below tweezer top bodies for shorts, bullish close above tweezer bottom bodies for longs. Stops beyond the matched extremes.",
            "Not every double top is tweezer — look for proximity within a few ticks and rejection wicks. On higher timeframes, daily tweezers at yearly levels are major events.",
          ],
          keyPoints: [
            "Tweezer tops = matching highs; bottoms = matching lows.",
            "Shows failed attempts to break a level — rejection signal.",
            "Slight sweep of first extreme on second candle adds liquidity narrative.",
            "Confirm with bearish/bullish close away from the level.",
            "Strongest at obvious HTF support/resistance.",
          ],
          manualTips: [
            "Use a horizontal ray on the matched wicks — visual alignment must be obvious.",
            "Tweezer bottom + hammer on second candle is a classic confluence long.",
            "On crypto, tweezers on 4H at prior ATH/ATL zones are watchlist staples.",
            "If price blows through tweezers with a full body close, the level failed — flip bias.",
          ],
          difficulty: "intermediate",
        },
        {
          id: "inside-outside-bar",
          title: "Inside Bar and Outside Bar",
          summary:
            "Compression and expansion candles that frame breakout trades for manual execution.",
          body: [
            "Inside bar: entire range of the second candle fits within the first candle's high and low. It represents contraction — the market preparing for a move. Mother bar defines the breakout boundaries.",
            "Outside bar (engulfing of range): second candle's high exceeds first high AND low is below first low — expansion and volatility takeover. The close direction of the outside bar hints at who won the battle.",
            "Inside bar strategy: place conditional orders or manual alerts at mother bar high/low, enter on break in the direction of HTF bias, stop on opposite side of mother bar. False breaks are common — require close, not wick.",
            "Outside bar at key level can signal violent rejection or breakout absorption. A bullish close outside bar from support after a sweep is a strong long signal. A bearish close outside bar from resistance supports shorts.",
            "Multiple inside bars stacked (inside-inside) tighten compression — breakout often follows with expanded range. Patience is required; do not guess direction early.",
          ],
          keyPoints: [
            "Inside bar = range within prior bar — compression.",
            "Outside bar = range engulfs prior bar — expansion.",
            "Trade inside bar breaks in HTF bias direction with mother bar defining risk.",
            "Outside bar close direction matters for bias.",
            "Stacked inside bars increase breakout potential — wait for close.",
          ],
          manualTips: [
            "Mother bar high/low are your breakout triggers — set alerts, not predictions.",
            "Inside bars against HTF trend fail more often — note failure rate in your journal.",
            "Outside bars on news spikes need next-candle confirmation — volatility lies.",
            "Measure mother bar height for position size — wide mother bar = smaller size if fixed % risk.",
          ],
          difficulty: "intermediate",
        },
      ],
    },
    {
      id: "three-candle-patterns",
      title: "Three-Candle Patterns",
      description:
        "Classic three-bar formations including stars, soldiers, crows, and abandoned baby patterns.",
      lessons: [
        {
          id: "morning-evening-star",
          title: "Morning Star and Evening Star",
          summary:
            "Three-candle reversal sequences combining a strong move, indecision, and confirmation.",
          body: [
            "Morning star (bullish): large bearish candle, small-bodied star gapping or separating below, then strong bullish candle closing well into the first candle's body. Evening star (bearish) mirrors at tops with bearish third candle.",
            "The star is often a doji or spinning top — the market pauses after the first leg. The third candle is the confirmation manual traders wait for. Without a strong third candle, the pattern is incomplete.",
            "Ideal location: end of extended trend at HTF support (morning) or resistance (evening). The first candle should be conspicuously large relative to recent history.",
            "Risk definition: stop below morning star low (or star cluster) for longs; above evening star high for shorts. Target next swing or opposing zone.",
            "Variations include morning/evening doji star where the middle candle is a doji — slightly stronger indecision, same confirmation rules.",
          ],
          keyPoints: [
            "Three parts: strong candle, star (indecision), confirming candle.",
            "Third candle must close meaningfully into first candle's body.",
            "Incomplete without strong third candle — do not front-run.",
            "Best at HTF extremes after extended trends.",
            "Stop beyond pattern extreme; target at structure.",
          ],
          manualTips: [
            "Count only closed patterns — if third candle is still forming, it is not a star yet.",
            "Evening star into prior week high + shooting star on day 1 is triple confluence.",
            "If third candle is weak (<25% into first body), downgrade pattern grade.",
            "Daily morning stars at 200-day moving average zones are worth a dedicated watchlist column.",
          ],
          difficulty: "intermediate",
        },
        {
          id: "three-white-soldiers",
          title: "Three White Soldiers",
          summary:
            "Three consecutive strong bullish candles signaling sustained buying pressure after a base or pullback.",
          body: [
            "Three white soldiers: three bullish candles with each closing near its high, each open within or near the prior body, progressive higher closes. Shows orderly, sustained buying — not a single spike.",
            "Appears after bottoms, breakouts from consolidation, or pullbacks in uptrends. Manual traders use it as continuation confirmation rather than chasing the third close — look for pullback to the soldiers' bodies or a flag after the pattern.",
            "Quality checks: soldiers should be roughly similar size without the third being a tiny exhaustion candle. Upper wicks should be small. If the third soldier is a long-legged candle with big upper wick, buying may be tiring.",
            "Counterpart caution: three soldiers into HTF resistance is dangerous to buy blindly — expect reaction or need breakout close above resistance.",
            "Combine with volume rising across soldiers when data is available.",
          ],
          keyPoints: [
            "Three progressive bullish closes with small upper wicks.",
            "Signals sustained buying — continuation bias.",
            "Avoid chasing third candle; prefer pullback entries.",
            "Third candle weakness or long upper wick warns exhaustion.",
            "Into HTF resistance, require breakout confirmation.",
          ],
          manualTips: [
            "After three soldiers, mark the first soldier's open — pullbacks often respect it.",
            "Soldiers after a morning star third candle = powerful combo — journal these.",
            "If soldier bodies shrink each day, trend may be maturing — tighten stops on swings.",
            "Do not confuse with three random green days in a range — need prior context (base or pullback).",
          ],
          difficulty: "intermediate",
        },
        {
          id: "three-black-crows",
          title: "Three Black Crows",
          summary:
            "Three consecutive bearish candles signaling persistent selling — caution for longs, opportunity for shorts with confirmation.",
          body: [
            "Three black crows: three bearish candles each closing near their lows, opens within prior bodies, successive lower closes. Shows methodical selling pressure, often after a failed rally or from resistance.",
            "Manual traders treat crows as bias shift evidence, especially when third crow closes through support. Entering shorts on the third close chases; prefer retest of broken support or pause after crows.",
            "Quality: similar-sized bodies, small lower wicks. If third crow has long lower wick, sellers may be losing grip — pattern weakened.",
            "At HTF support, crows may lead to oversold bounce — check whether support is major before shorting blindly. Context again.",
            "Crows after evening star completion reinforce bearish narrative.",
          ],
          keyPoints: [
            "Three successive lower bearish closes near lows.",
            "Signals persistent selling — bearish continuation or reversal from highs.",
            "Third close through support is especially significant.",
            "Long lower wick on third crow weakens pattern.",
            "At major HTF support, expect potential bounce — adjust targets.",
          ],
          manualTips: [
            "Crows through a range floor often retest the floor — watch for second-entry shorts on retest.",
            "If crows appear on low volume, skepticism is warranted — confirm with next session.",
            "Long holders: crows through your swing low = structure break — honor stop, do not hope.",
            "Pair with break of last HL on your trading timeframe for structural confirmation.",
          ],
          difficulty: "intermediate",
        },
        {
          id: "three-inside-up-down",
          title: "Three Inside Up and Three Inside Down",
          summary:
            "Harami pair plus confirming third candle — a structured reversal sequence with defined risk.",
          body: [
            "Three inside up: bearish mother, bullish inside (harami), then bullish close above inside/high confirming reversal. Three inside down: bullish mother, bearish inside, bearish third closing below inside/low.",
            "This pattern formalizes the harami 'wait for third candle' rule. The third candle proves buyers or sellers took control beyond the pause.",
            "Works well on daily charts at range extremes. The mother candle defines maximum initial risk — attractive for manual traders who size from pattern geometry.",
            "Failure: third candle fails to break harami extreme and reverses — pattern aborted. Do not force the narrative.",
            "Less common than engulfing or stars but offers cleaner mechanical triggers.",
          ],
          keyPoints: [
            "Harami structure plus third confirming breakout candle.",
            "Three inside up = bullish; three inside down = bearish.",
            "Mother candle sets initial stop reference.",
            "Third must close beyond harami extreme — no shortcut.",
            "Clear abort condition if third candle fails.",
          ],
          manualTips: [
            "Alert at harami high/low before third candle closes — prepares you for the trigger.",
            "Mother bar + inside bar range is often < prior ATR — good for defined risk trades.",
            "Scan daily charts for three inside up at 20-day lows as a systematic watchlist habit.",
            "Log win rate separately from engulfing — patterns have different personalities per market.",
          ],
          difficulty: "intermediate",
        },
        {
          id: "abandoned-baby",
          title: "Abandoned Baby (Rare Gap Pattern)",
          summary:
            "A star pattern with gaps isolating the middle candle — strong but rare reversal signal on daily charts.",
          body: [
            "Bullish abandoned baby: strong bearish candle, doji or small body gapped below (no overlap in wicks with neighbors on gap markets), then strong bullish candle gapped above the star. Bearish version gaps above then below.",
            "The isolated star shows sudden sentiment vacuum — participants completely disengaged at the middle period's range, then the third candle re-engages aggressively the other way.",
            "Rare on 24-hour forex but appears on stocks with true gaps. When found at major reversals, it is high conviction — but rarity means do not hunt it everywhere.",
            "Trade like morning/evening star: confirmation on third candle close, stop beyond star, targets at structure.",
            "False abandoned babies occur when wicks overlap despite apparent gaps — verify true isolation on your platform's session settings.",
          ],
          keyPoints: [
            "Middle candle isolated by gaps from first and third candles.",
            "Rare, high-conviction reversal when genuine on gap markets.",
            "Verify true non-overlapping wicks — session gaps matter.",
            "Same execution rules as other star patterns.",
            "Low frequency — do not overfit strategy to this pattern alone.",
          ],
          manualTips: [
            "Stock traders: scan gap-up/gap-down reversals weekly for abandoned baby formations.",
            "Screenshot genuine examples — rarity makes live recognition hard without a library.",
            "If middle candle wicks overlap first candle, it is a regular star, not abandoned — adjust expectations.",
            "Size normally; rarity does not mean infinite win rate.",
          ],
          difficulty: "advanced",
        },
      ],
    },
    {
      id: "pattern-reliability-filters",
      title: "Pattern Reliability & Filters",
      description:
        "Increase candlestick edge by filtering for location, trend, confirmation, and multi-timeframe agreement.",
      lessons: [
        {
          id: "location-is-king",
          title: "Location Is King",
          summary:
            "The same candle pattern wins or loses based on where it appears on the chart.",
          body: [
            "A hammer in nowhere is a coin flip. A hammer at HTF support after a liquidity sweep is a strategy. Candlestick patterns are modifiers to location and structure — not standalone signals.",
            "Grade every pattern: A = HTF level + structure + pattern + confirmation. B = two of three. C = pattern only. Manual traders should trade A and B; skip C.",
            "Pre-mark your levels before the session. When a pattern prints at a pre-marked zone, decision speed improves and hesitation drops.",
            "Patterns into void (no nearby support/resistance) produce random follow-through. Patterns into congestion (middle of range) produce whipsaw.",
            "The professional mindset: 'Where am I on the map?' before 'What shape is this candle?'",
          ],
          keyPoints: [
            "Pattern + key level + structure = high-grade setup.",
            "Patterns without location context are low edge.",
            "Pre-mark levels to recognize quality patterns faster.",
            "Mid-range patterns deserve skepticism.",
            "Always ask location before pattern name.",
          ],
          manualTips: [
            "Before naming the pattern, say the level aloud: 'We're at weekly support' then 'hammer.'",
            "Keep a private pattern grade rubric in your journal — enforce it ruthlessly.",
            "Delete watchlist names that only had a pattern mid-range — they waste mental bandwidth.",
            "Weekly review: tally A vs C grade trades and P&L separately — the lesson will be obvious.",
          ],
          difficulty: "intermediate",
        },
        {
          id: "trend-and-counter-trend-patterns",
          title: "Trend vs Counter-Trend Pattern Trading",
          summary:
            "Match pattern type and size to whether you are trading with or against the dominant trend.",
          body: [
            "With-trend patterns: pullbacks ending in hammers, bullish engulfing in uptrends, inside bar breaks in bias direction, three soldiers after shallow pullback. Higher win rate, modest R multiples often.",
            "Counter-trend patterns: shooting stars, evening stars, tweezers at extremes against HTF trend. Lower win rate but larger R when right — require stricter confirmation and smaller size.",
            "Strong HTF trends absorb reversal patterns. Shorting every shooting star in a parabolic bull market is account suicide. Trade counter-trend only at HTF decision points with structure break confirmation.",
            "Continuation patterns can be traded larger than reversal patterns for many traders — know your statistical comfort from journaling.",
            "When trend and pattern conflict, default to trend until structure breaks.",
          ],
          keyPoints: [
            "With-trend patterns generally offer higher probability.",
            "Counter-trend requires HTF levels, confirmation, and reduced size.",
            "Strong trends invalidate many reversal patterns.",
            "Structure break is the line between pullback and reversal.",
            "Journal separately to know your edge by pattern type.",
          ],
          manualTips: [
            "Label trades WITH or AGAINST HTF trend in your log — review monthly.",
            "Counter-trend: halve size until journal proves edge.",
            "Three black crows in daily downtrend = with-trend; at yearly support = counter-trend.",
            "If you cannot articulate HTF trend in one sentence, do not take counter-trend patterns.",
          ],
          difficulty: "intermediate",
        },
        {
          id: "confirmation-filters",
          title: "Confirmation Filters",
          summary:
            "Practical filters — follow-through candles, structure breaks, and session closes — before committing capital.",
          body: [
            "Close confirmation: pattern completes only when the final candle of the formation closes. Intraperiod wicks do not count for pattern completion on your trading timeframe.",
            "Break confirmation: enter when price trades beyond a key part of the pattern (engulfing high, inside bar mother high, star third close). Retest entries after break often improve R.",
            "Structure confirmation: reversal patterns plus break of last minor HL/LH on your timeframe upgrade reliability. Continuation patterns plus hold of prior swing upgrade reliability.",
            "Time confirmation: daily pattern close matters more than 5-minute pattern during lunch lull. Match pattern timeframe to when you will hold the trade.",
            "Multiple pattern agreement: hammer plus bullish engulfing next day, or tweezer bottom plus morning star completion — confluence stacks edge.",
          ],
          keyPoints: [
            "Wait for candle close to complete pattern on your decision timeframe.",
            "Use break of pattern extreme or retest for entry timing.",
            "Structure break adds confirmation to reversal ideas.",
            "Align pattern timeframe with intended hold period.",
            "Stacked patterns at same level increase conviction.",
          ],
          manualTips: [
            "Write your confirmation rule on the order ticket comment field — accountability helps.",
            "Default rule: no entry until next candle closes unless setup doc says otherwise.",
            "Retest entries: limit order at broken level with stop beyond pattern — patience pays.",
            "Avoid confirming with indicators alone; price confirmation comes first.",
          ],
          difficulty: "intermediate",
        },
        {
          id: "common-candlestick-mistakes",
          title: "Common Candlestick Mistakes",
          summary:
            "Avoid the errors that turn classical patterns into consistent losses for discretionary traders.",
          body: [
            "Mistake 1: Pattern hunting without levels — seeing engulfing everywhere in chop. Fix: levels first.",
            "Mistake 2: Trading incomplete patterns — entering on candle two of three. Fix: wait for full formation close.",
            "Mistake 3: Ignoring HTF bias — perfect hammer into daily resistance. Fix: top-down filter.",
            "Mistake 4: Stops inside pattern noise — stopped on wick then price goes your way. Fix: stops beyond logical invalidation, size down if needed.",
            "Mistake 5: Pattern encyclopedia paralysis — 50 patterns, zero mastery. Fix: master 8–10 core patterns deeply.",
            "Mistake 6: Recency bias — one failed star does not mean all stars fail. Fix: journal 30+ samples before changing rules.",
          ],
          keyPoints: [
            "Most failures are contextual, not pattern-specific.",
            "Incomplete patterns and mid-range locations are top killers.",
            "HTF bias filter prevents many 'perfect' losing setups.",
            "Stops must reflect invalidation, not wishful tightness.",
            "Depth on few patterns beats shallow knowledge of many.",
          ],
          manualTips: [
            "Pick your 'big 8' patterns and refuse to trade others for 90 days.",
            "When stopped out, mark whether level or pattern was wrong — diagnose correctly.",
            "If you miss a move, do not lower confirmation standards on the next trade.",
            "Share charts with a peer — if they cannot see your pattern in 5 seconds, it is probably weak.",
          ],
          difficulty: "beginner",
        },
      ],
    },
  ],
};