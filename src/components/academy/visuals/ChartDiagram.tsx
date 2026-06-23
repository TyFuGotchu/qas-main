import type {
  ChartDiagramVariant,
  FibDiagramVariant,
  StructureDiagramVariant,
  StyleDiagramVariant,
} from "@/lib/academy/visual-registry";

type DiagramKind = "chart" | "structure" | "fib" | "style";
type DiagramVariant =
  | ChartDiagramVariant
  | StructureDiagramVariant
  | FibDiagramVariant
  | StyleDiagramVariant;

const TITLES: Record<string, string> = {
  "candle-anatomy": "Candle anatomy: Open · High · Low · Close",
  "bull-bear-pressure": "Bullish vs bearish candle pressure",
  "range-trend": "Range vs trending market",
  "support-resistance": "Support & resistance zones",
  "level-drawing": "Drawing levels on swing points",
  "reaction-break": "Reaction vs clean break",
  "dynamic-levels": "Dynamic vs static levels",
  "structure-overview": "Market structure: swings & trends",
  "swing-points": "Swing highs and swing lows",
  "trend-continuation": "Trend continuation signals",
  "trend-exhaustion": "Trend exhaustion & transition",
  "top-down": "Top-down analysis flow",
  "timeframe-correlation": "Multi-timeframe alignment",
  fractal: "Fractal patterns across timeframes",
  volume: "Volume confirmation context",
  "session-timing": "Session timing windows",
  summary: "Integrated chart reading workflow",
  "swing-definition": "Swing point definition",
  labeling: "HH · HL · LH · LL labels",
  "swing-trading": "Trading swing structure",
  bos: "Break of Structure (BOS)",
  "bos-sweep": "BOS vs liquidity sweep",
  "trade-bos": "Trading BOS continuation",
  choch: "Change of Character (CHoCH)",
  "choch-vs-bos": "CHoCH reversal vs BOS",
  "choch-false": "False CHoCH signals",
  liquidity: "Liquidity pools & equal highs",
  inducement: "Inducement & engineered liquidity",
  "liquidity-pools": "Liquidity pools as targets",
  fvg: "Fair Value Gap (FVG)",
  "session-ranges": "Session range structure",
  "daily-weekly": "Daily & weekly structure",
  "session-models": "Session trading models",
  integrating: "Integrating structure layers",
  basics: "Fibonacci retracement ratios",
  drawing: "Drawing Fibonacci correctly",
  "key-levels": "Key retracement levels",
  pullback: "Fib pullback entries",
  extension: "Fibonacci extensions",
  abc: "ABC projection method",
  "extension-target": "Extension profit targets",
  "golden-pocket": "Golden Pocket zone (61.8–65%)",
  "gp-entry": "Golden Pocket entry model",
  "gp-failures": "When Golden Pocket fails",
  "structure-confluence": "Fib + structure confluence",
  "supply-demand": "Supply & demand zones",
  "multi-timeframe": "Multi-timeframe Fib stack",
  validity: "When Fib is valid",
  redraw: "Fib redraw rules",
  invalidation: "Fib invalidation checklist",
  mistakes: "Common Fib mistakes",
  scalping: "Scalping: fast entries, tight risk",
  "scalping-tf": "Scalping timeframes & setups",
  "scalping-risk": "Scalping risk management",
  "day-trading": "Day trading session model",
  intraday: "Intraday structure & levels",
  playbook: "Day trading playbook",
  psychology: "Session psychology & discipline",
  swing: "Swing trading overview",
  "swing-entry": "Swing entry & exit planning",
  "swing-fundamentals": "Swing fundamentals & macro",
  ict: "Smart Money / ICT concepts",
  "liquidity-ob": "Liquidity & order blocks",
  "fvg-premium": "FVG · Premium · Discount zones",
  "kill-zones": "Kill zones & session models",
  "rally-base": "Rally-Base-Rally / Drop patterns",
  "sd-vs-sr": "Supply/Demand vs Support/Resistance",
  "zone-trading": "Trading the zone",
};

function SwingPath({ bullish = true }: { bullish?: boolean }) {
  const points = bullish
    ? "20,140 50,100 80,120 110,70 140,90 170,40 200,60"
    : "20,60 50,100 80,80 110,130 140,110 170,160 200,140";
  return (
    <polyline
      points={points}
      fill="none"
      stroke="#22d3ee"
      strokeWidth={2.5}
      strokeLinejoin="round"
    />
  );
}

function HorizontalLevel({
  y,
  label,
  color = "rgba(34,211,238,0.6)",
  dashed = false,
}: {
  y: number;
  label: string;
  color?: string;
  dashed?: boolean;
}) {
  return (
    <g>
      <line
        x1={16}
        y1={y}
        x2={224}
        y2={y}
        stroke={color}
        strokeWidth={1.5}
        strokeDasharray={dashed ? "4 4" : undefined}
      />
      <text x={228} y={y + 4} className="fill-slate-500 text-[8px] font-mono">
        {label}
      </text>
    </g>
  );
}

function Zone({
  y,
  h,
  label,
  color,
}: {
  y: number;
  h: number;
  label: string;
  color: string;
}) {
  return (
    <g>
      <rect x={16} y={y} width={208} height={h} fill={color} rx={2} />
      <text
        x={120}
        y={y + h / 2 + 3}
        textAnchor="middle"
        className="fill-slate-300 text-[8px] font-mono"
      >
        {label}
      </text>
    </g>
  );
}

function renderDiagram(variant: DiagramVariant): React.ReactNode {
  switch (variant) {
    case "candle-anatomy":
      return (
        <g>
          <rect x={100} y={70} width={40} height={50} fill="#34d399" rx={2} />
          <line x1={120} y1={50} x2={120} y2={130} stroke="#34d399" strokeWidth={2} />
          <text x={70} y={65} className="fill-emerald-400 text-[8px] font-mono">High</text>
          <text x={70} y={95} className="fill-slate-400 text-[8px] font-mono">Close</text>
          <text x={70} y={115} className="fill-slate-400 text-[8px] font-mono">Open</text>
          <text x={70} y={135} className="fill-emerald-400 text-[8px] font-mono">Low</text>
        </g>
      );
    case "bull-bear-pressure":
      return (
        <g>
          <rect x={40} y={80} width={30} height={60} fill="#34d399" rx={2} />
          <line x1={55} y1={60} x2={55} y2={150} stroke="#34d399" strokeWidth={2} />
          <text x={35} y={165} className="fill-emerald-400 text-[8px] font-mono">Bull</text>
          <rect x={150} y={60} width={30} height={70} fill="#f87171" rx={2} />
          <line x1={165} y1={50} x2={165} y2={140} stroke="#f87171" strokeWidth={2} />
          <text x={145} y={165} className="fill-red-400 text-[8px] font-mono">Bear</text>
        </g>
      );
    case "range-trend":
      return (
        <g>
          <path
            d="M 30 100 Q 60 80 90 100 T 150 100"
            fill="none"
            stroke="#94a3b8"
            strokeWidth={2}
          />
          <text x={60} y={175} className="fill-slate-500 text-[8px] font-mono">Range</text>
          <SwingPath bullish />
          <text x={150} y={175} className="fill-cyan-400 text-[8px] font-mono">Trend</text>
        </g>
      );
    case "support-resistance":
    case "level-drawing":
    case "reaction-break":
      return (
        <g>
          <SwingPath />
          <HorizontalLevel y={60} label="Resistance" color="rgba(248,113,113,0.7)" />
          <HorizontalLevel y={130} label="Support" color="rgba(52,211,153,0.7)" />
        </g>
      );
    case "dynamic-levels":
      return (
        <g>
          <SwingPath />
          <path
            d="M 20 130 Q 80 110 140 95 Q 180 85 220 75"
            fill="none"
            stroke="#fbbf24"
            strokeWidth={1.5}
            strokeDasharray="6 4"
          />
          <text x={160} y={68} className="fill-amber-400 text-[8px] font-mono">Dynamic trendline</text>
        </g>
      );
    case "top-down":
    case "timeframe-correlation":
    case "multi-timeframe":
    case "fractal":
      return (
        <g>
          {["Daily", "4H", "15m"].map((tf, i) => (
            <g key={tf} transform={`translate(0, ${i * 48})`}>
              <text x={16} y={20} className="fill-cyan-400 text-[8px] font-mono">{tf}</text>
              <SwingPath bullish={i % 2 === 0} />
            </g>
          ))}
        </g>
      );
    case "volume":
      return (
        <g>
          <SwingPath />
          {[40, 70, 100, 130, 160].map((x, i) => (
            <rect
              key={x}
              x={x}
              y={150 - i * 12}
              width={12}
              height={i * 12 + 10}
              fill={i > 2 ? "#34d399" : "#64748b"}
              opacity={0.7}
            />
          ))}
          <text x={80} y={175} className="fill-slate-500 text-[8px] font-mono">Volume bars</text>
        </g>
      );
    case "session-timing":
    case "kill-zones":
    case "session-ranges":
    case "session-models":
      return (
        <g>
          <Zone y={40} h={30} label="Asia" color="rgba(100,116,139,0.25)" />
          <Zone y={70} h={40} label="London" color="rgba(34,211,238,0.15)" />
          <Zone y={110} h={40} label="New York" color="rgba(52,211,153,0.15)" />
          <SwingPath />
        </g>
      );
    case "bos":
    case "trade-bos":
      return (
        <g>
          <SwingPath bullish />
          <line x1={110} y1={70} x2={224} y2={70} stroke="#f87171" strokeWidth={1} strokeDasharray="4 3" />
          <text x={170} y={62} className="fill-red-400 text-[8px] font-mono">Prior SH</text>
          <circle cx={170} cy={55} r={4} fill="#22d3ee" />
          <text x={178} y={58} className="fill-cyan-400 text-[8px] font-mono">BOS ↑</text>
        </g>
      );
    case "bos-sweep":
      return (
        <g>
          <SwingPath bullish />
          <line x1={110} y1={70} x2={224} y2={70} stroke="#f87171" strokeWidth={1} strokeDasharray="4 3" />
          <path d="M 155 75 L 165 65 L 175 78" fill="none" stroke="#fbbf24" strokeWidth={2} />
          <text x={140} y={90} className="fill-amber-400 text-[8px] font-mono">Sweep (wick)</text>
          <text x={178} y={55} className="fill-cyan-400 text-[8px] font-mono">True BOS (close)</text>
        </g>
      );
    case "choch":
    case "choch-vs-bos":
    case "choch-false":
      return (
        <g>
          <SwingPath bullish={false} />
          <line x1={80} y1={130} x2={224} y2={130} stroke="#34d399" strokeWidth={1} strokeDasharray="4 3" />
          <text x={150} y={145} className="fill-emerald-400 text-[8px] font-mono">CHoCH ↓</text>
        </g>
      );
    case "labeling":
    case "swing-definition":
    case "structure-overview":
    case "swing-points":
    case "swing-trading":
      return (
        <g>
          <SwingPath bullish />
          {[
            { x: 50, y: 100, l: "HL" },
            { x: 110, y: 70, l: "HH" },
            { x: 140, y: 90, l: "HL" },
            { x: 170, y: 40, l: "HH" },
          ].map((p) => (
            <g key={p.l + p.x}>
              <circle cx={p.x} cy={p.y} r={3} fill="#22d3ee" />
              <text x={p.x + 6} y={p.y + 3} className="fill-cyan-400 text-[8px] font-mono">{p.l}</text>
            </g>
          ))}
        </g>
      );
    case "liquidity":
    case "liquidity-pools":
    case "inducement":
    case "liquidity-ob":
      return (
        <g>
          <SwingPath />
          <line x1={16} y1={55} x2={224} y2={55} stroke="#f87171" strokeWidth={1} />
          <text x={60} y={48} className="fill-red-400 text-[8px] font-mono">Equal highs = buy-side liquidity</text>
          <Zone y={100} h={25} label="Order Block" color="rgba(34,211,238,0.12)" />
        </g>
      );
    case "fvg":
    case "fvg-premium":
      return (
        <g>
          <SwingPath bullish />
          <Zone y={85} h={20} label="FVG / Imbalance" color="rgba(251,191,36,0.2)" />
          <Zone y={40} h={25} label="Premium" color="rgba(248,113,113,0.1)" />
          <Zone y={130} h={25} label="Discount" color="rgba(52,211,153,0.1)" />
        </g>
      );
    case "basics":
    case "drawing":
    case "key-levels":
    case "pullback":
    case "golden-pocket":
    case "gp-entry":
    case "gp-failures":
    case "structure-confluence":
    case "supply-demand":
    case "validity":
    case "redraw":
    case "invalidation":
    case "mistakes":
      return (
        <g>
          <line x1={30} y1={150} x2={200} y2={40} stroke="#64748b" strokeWidth={1.5} />
          <HorizontalLevel y={95} label="50%" color="rgba(148,163,184,0.5)" dashed />
          <HorizontalLevel y={75} label="61.8%" color="rgba(34,211,238,0.7)" />
          <HorizontalLevel y={110} label="38.2%" color="rgba(148,163,184,0.5)" dashed />
          <Zone y={72} h={12} label="Golden Pocket" color="rgba(34,211,238,0.15)" />
          <SwingPath bullish />
        </g>
      );
    case "extension":
    case "abc":
    case "extension-target":
      return (
        <g>
          <SwingPath bullish />
          <text x={30} y={165} className="fill-slate-500 text-[8px] font-mono">A</text>
          <text x={110} y={165} className="fill-slate-500 text-[8px] font-mono">B</text>
          <text x={190} y={165} className="fill-cyan-400 text-[8px] font-mono">C target</text>
          <line x1={190} y1={40} x2={224} y2={40} stroke="#34d399" strokeWidth={1} strokeDasharray="4 3" />
        </g>
      );
    case "scalping":
    case "scalping-tf":
    case "scalping-risk":
    case "day-trading":
    case "intraday":
    case "playbook":
    case "psychology":
    case "swing":
    case "swing-entry":
    case "swing-fundamentals":
    case "ict":
    case "supply-demand":
    case "rally-base":
    case "sd-vs-sr":
    case "zone-trading":
    default:
      return (
        <g>
          <SwingPath />
          <Zone y={90} h={30} label="Entry zone" color="rgba(34,211,238,0.12)" />
          <HorizontalLevel y={55} label="Target" color="rgba(52,211,153,0.6)" />
          <HorizontalLevel y={140} label="Stop" color="rgba(248,113,113,0.6)" dashed />
        </g>
      );
  }
}

interface ChartDiagramProps {
  kind: DiagramKind;
  variant: DiagramVariant;
}

export function ChartDiagram({ kind, variant }: ChartDiagramProps) {
  const title = TITLES[variant] ?? "Trading concept diagram";
  const viewHeight = ["top-down", "timeframe-correlation", "multi-timeframe", "fractal"].includes(
    variant as string
  )
    ? 200
    : 180;

  return (
    <div className="overflow-x-auto">
      <svg
        viewBox={`0 0 260 ${viewHeight}`}
        className="mx-auto h-auto w-full max-w-lg"
        role="img"
        aria-label={title}
      >
        <rect width={260} height={viewHeight} fill="rgba(15,23,42,0.4)" rx={4} />
        <text
          x={130}
          y={16}
          textAnchor="middle"
          className="fill-cyan-400 text-[10px] font-mono font-semibold"
        >
          {title}
        </text>
        <g transform="translate(10, 10)">{renderDiagram(variant)}</g>
        <text
          x={130}
          y={viewHeight - 6}
          textAnchor="middle"
          className="fill-slate-600 text-[7px] font-mono uppercase"
        >
          {kind} · illustrative
        </text>
      </svg>
    </div>
  );
}