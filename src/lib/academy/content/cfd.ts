import type { AcademyCategory } from "../types";

export const cfdCategory: AcademyCategory = {
  id: "cfd",
  title: "CFD Trading",
  description:
    "Contracts for difference on indices, metals, energy, and more — how CFDs work, risks, and TradeLocker workflows for manual and prop-style traders.",
  sections: [
    {
      id: "cfd-foundations",
      title: "CFD Foundations",
      description: "What CFDs are, what you actually trade, and what can go wrong.",
      lessons: [
        {
          id: "what-are-cfds",
          title: "What Are CFDs?",
          summary:
            "A contract for difference (CFD) lets you speculate on price without owning the underlying asset. This free lesson covers how CFDs work and how they differ from spot ownership.",
          body: [
            "A CFD is an agreement with your broker to exchange the difference in price of an instrument from open to close of your trade. You can go long or short indices (e.g. NAS100), metals (XAUUSD), energy, and sometimes stocks — depending on your broker’s offering on platforms like TradeLocker.",
            "You do not own the index or the gold bar. You are trading a price stream with leverage, financing (swap), and the broker’s spread or commission. That is powerful and dangerous: small deposits can control large notional size.",
            "CFDs suit active traders who want short-term directional exposure and shorting flexibility. They are a poor substitute for long-term investment if your goal is ownership, dividends, or zero overnight financing.",
            "Risk is asymmetric if you oversize. A 1% adverse move on high leverage can liquidate accounts. Prop firm challenges amplify this: daily loss limits are hit fast on NAS100 or gold when size is wrong.",
            "This free lesson is the definition layer. Premium unlocks CFD product types, margin mechanics, TradeLocker index workflows, and how to pair CFDs with a prop playbook.",
          ],
          keyPoints: [
            "CFDs track price difference — no ownership of the underlying.",
            "Long and short are both available on most CFD menus.",
            "Leverage multiplies gains and losses.",
            "Costs include spread/commission and often overnight financing.",
            "Oversizing is the #1 account killer on indices and gold.",
          ],
          manualTips: [
            "Read your broker’s CFD product specs: contract size, margin %, trading hours.",
            "Start with one index CFD (e.g. NAS100) before adding metals and energy.",
            "Write “I do not own the asset” on your desk card if you came from stocks.",
            "Demo a full week of CFD size before live challenge capital.",
          ],
          difficulty: "beginner",
        },
        {
          id: "cfd-vs-spot-futures",
          title: "CFDs vs Spot vs Futures",
          summary:
            "When CFDs make sense versus owning spot or trading futures — and what stays the same: risk and structure.",
          body: [
            "Spot ownership (shares, physical-ish ETFs) means you hold an asset. CFDs are pure price exposure via the broker. Futures are exchange-traded contracts with expiry and different margin regimes.",
            "CFDs often win for accessibility: lower minimums, easy shorting, multi-asset one login (TradeLocker). Futures win for transparent exchange liquidity and no broker “price book” debates — but need different accounts and often more capital.",
            "Pricing: CFD quotes can differ slightly from futures or cash indices. Your edge is on *your* chart and *your* fills — do not mix signals from three platforms without knowing which feed you trade.",
            "For prop firms offering TradeLocker CFDs, optimize for that environment: same sessions, same product specs, same risk rules as your challenge.",
            "Structure (BOS, levels, sessions) transfers across vehicles. Product rules (swap, margin, halt) do not — always re-learn the instrument.",
          ],
          keyPoints: [
            "CFD = broker contract; futures = exchange contract; spot = ownership.",
            "Trade the feed you execute on.",
            "Prop + TradeLocker usually means CFD product specs rule.",
            "Chart structure skills transfer; product risk does not.",
            "Don’t mix three instruments until one is mastered.",
          ],
          manualTips: [
            "Save the contract specification PDF for each CFD you trade.",
            "Compare one NAS100 CFD candle session to a futures chart — note differences.",
            "Never size a CFD like a share count; use risk % and stop distance.",
            "If your prop firm lists “US100” vs “NAS100,” confirm symbol mapping.",
          ],
          difficulty: "beginner",
        },
        {
          id: "indices-gold-energy-cfds",
          title: "Indices, Gold & Energy CFDs",
          summary:
            "How major CFD asset classes behave and how to pick one lane for consistent trading.",
          body: [
            "Index CFDs (NAS100, US30, GER40, etc.) track baskets of stocks. They trend hard in risk-on/off regimes and react to US data. Session: often best around US cash open for US indices.",
            "Gold (XAUUSD CFD) mixes USD strength, rates, and risk sentiment. It can trend cleanly or whip during macro events. Spreads and swap differ from FX majors.",
            "Energy CFDs (oil, etc.) can gap on inventory data and geopolitics. Wider risk and thinner off-hours liquidity — advanced territory for funded challenges.",
            "Specialize: one index + optional gold is enough for most discretionary prop plans. Product hopping destroys stats.",
            "Quicksilver tools (confluence, risk matrix, playbook caps) apply the same way — instrument choice only changes volatility and session filters.",
          ],
          keyPoints: [
            "Indices: equity risk sentiment + US session focus.",
            "Gold: macro + USD; respect event volatility.",
            "Energy: higher gap risk; size smaller or skip early on.",
            "Specialize for prop consistency.",
            "Same risk process across CFDs; different ATR.",
          ],
          manualTips: [
            "Measure 14-day ATR on your CFD and set stop templates in R.",
            "Trade NAS100 only during your defined session for 20 trades.",
            "If gold and NAS100 both open risk, cut total exposure — they can move together.",
            "Use Premium NAS100 Quant Protocol settings only after you understand the product.",
          ],
          difficulty: "intermediate",
        },
      ],
    },
    {
      id: "cfd-tradelocker",
      title: "CFDs on TradeLocker",
      description: "Execution and risk habits for CFD products on TradeLocker.",
      lessons: [
        {
          id: "trading-cfds-on-tradelocker",
          title: "Trading CFDs on TradeLocker",
          summary:
            "Workspace setup, order discipline, and multi-asset pitfalls on a next-gen TradeLocker platform.",
          body: [
            "TradeLocker often surfaces FX, indices, metals, and more in one UI. That convenience invites overtrading. Lock a watchlist of 1–2 CFDs during challenges.",
            "Confirm contract size and margin before first live click. Index CFDs can move dozens of points quickly — a “small” lot may still be large risk.",
            "Use hard stops. Trailing and break-even rules belong in your written plan, not improvisation mid-candle.",
            "If you deploy Quicksilver Quant Protocol on an index CFD (e.g. NAS100), match the bot’s symbol and settings to the product you actually have on the account.",
            "End of day: flat or reduced risk if your prop firm daily loss is close — CFDs can gap into the next session.",
          ],
          keyPoints: [
            "Watchlist discipline beats multi-asset FOMO.",
            "Know contract size before sizing.",
            "Hard stops protect funded accounts.",
            "Bot symbol must match account product.",
            "Manage overnight/gap risk deliberately.",
          ],
          manualTips: [
            "Name workspaces “Challenge-NAS100” with one chart layout.",
            "Pre-calculate size for 0.5% risk at 1× and 1.5× ATR stops.",
            "Disable unused symbols from the sidebar.",
            "Review Quant Protocol NAS100 settings after this lesson.",
          ],
          difficulty: "intermediate",
        },
        {
          id: "cfd-margin-and-risk",
          title: "CFD Margin, Leverage & Prop Risk",
          summary:
            "How margin and leverage interact with prop firm daily loss and consistency rules.",
          body: [
            "Margin is the collateral to open a leveraged CFD. Available margin falls as floating loss grows. Hitting margin limits can force close — sometimes worse than your planned stop if multiple positions are open.",
            "Prop daily loss is independent of margin. You can be “fine” on margin and still fail the challenge on daily loss. Track both.",
            "Consistency rules punish outsized winning days. Huge CFD winners early can force smaller later days — plan profit caps (playbook) before the first trade.",
            "Correlation: NAS100 long + US100 long is the same bet. Gold long with short USD pairs can stack macro risk.",
            "Process: max risk per trade, max open risk, session filter, news filter. CFDs do not get special exceptions.",
          ],
          keyPoints: [
            "Margin ≠ prop daily loss — monitor both.",
            "Leverage enables oversizing; rules must cap it.",
            "Profit caps protect consistency scores.",
            "Correlated CFDs stack risk.",
            "Playbook risk rules apply to every CFD.",
          ],
          manualTips: [
            "Before each trade: check daily P&L vs daily loss limit.",
            "Never open a second correlated CFD to “average.”",
            "Use the Premium Risk Guard / Position Sizer on live equity.",
            "If daily cap is 50% consumed, stop trading CFDs for the day.",
          ],
          difficulty: "advanced",
        },
      ],
    },
  ],
};
