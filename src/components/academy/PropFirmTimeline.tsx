export function PropFirmTimeline({ days }: { days: number }) {
  return (
    <div className="overflow-x-auto">
      <svg viewBox="0 0 420 80" className="h-auto w-full max-w-xl" role="img" aria-label="7-day prop firm timeline">
        <line x1={20} y1={40} x2={400} y2={40} stroke="rgba(34,211,238,0.4)" strokeWidth={2} />
        {Array.from({ length: days }, (_, i) => {
          const x = 20 + (i / (days - 1)) * 380;
          return (
            <g key={i}>
              <circle cx={x} cy={40} r={14} fill="rgba(34,211,238,0.15)" stroke="#22d3ee" strokeWidth={2} />
              <text x={x} y={44} textAnchor="middle" className="fill-cyan-400 text-[10px] font-mono font-bold">
                {i + 1}
              </text>
              <text x={x} y={68} textAnchor="middle" className="fill-slate-500 text-[7px] font-mono">
                Day {i + 1}
              </text>
            </g>
          );
        })}
        <text x={210} y={16} textAnchor="middle" className="fill-cyan-400 text-[9px] font-mono font-semibold">
          7-Day Challenge Timeline
        </text>
      </svg>
    </div>
  );
}