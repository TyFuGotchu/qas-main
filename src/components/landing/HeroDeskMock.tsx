export function HeroDeskMock() {
  return (
    <div
      className="relative overflow-hidden rounded-[8px] border border-white/[0.08] bg-[#10141C]"
      aria-hidden
    >
      <div className="flex items-center gap-2 border-b border-white/[0.06] px-4 py-2.5">
        <span className="h-2 w-2 rounded-full bg-white/15" />
        <span className="h-2 w-2 rounded-full bg-white/15" />
        <span className="h-2 w-2 rounded-full bg-gold-soft/70" />
        <p className="ml-2 font-mono text-[10px] uppercase tracking-[0.22em] text-silver-muted">
          Quicksilver Desk · TradeLocker Desktop
        </p>
      </div>

      <div className="grid gap-3 p-3 sm:grid-cols-2">
        <Panel
          label="Live growth terminal"
          status="Session open"
          rows={[
            ["Equity", "48,240"],
            ["Day P&L", "+0.42R"],
            ["Exposure", "1.1%"],
          ]}
        />
        <Panel
          label="Risk"
          status="Guards on"
          rows={[
            ["Daily loss left", "3.8%"],
            ["Open heat", "Low"],
            ["Rule pressure", "Clear"],
          ]}
        />
        <Panel
          label="Journal"
          status="Session notes"
          rows={[
            ["Plan followed", "Yes"],
            ["Emotion", "Steady"],
            ["Review", "Pending close"],
          ]}
        />
        <div className="rounded-xl border border-gold-soft/25 bg-gold-soft/[0.04] p-3">
          <div className="flex items-center justify-between">
            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-gold-bright">
              Quant Protocol
            </p>
            <span className="rounded border border-gold-soft/40 px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-widest text-gold-soft">
              Premium
            </span>
          </div>
          <p className="mt-3 font-mono text-xs text-slate-300">Operator-supervised</p>
          <p className="mt-1 font-mono text-[10px] text-silver-muted">
            Status: idle · not in free trial
          </p>
          <p className="mt-3 font-mono text-[10px] leading-relaxed text-slate-500">
            Enable Quant Protocol with Premium. Bot not included in free trial.
          </p>
        </div>
      </div>
    </div>
  );
}

function Panel({
  label,
  status,
  rows,
}: {
  label: string;
  status: string;
  rows: [string, string][];
}) {
  return (
    <div className="rounded-xl border border-white/[0.07] bg-white/[0.02] p-3">
      <div className="flex items-center justify-between gap-2">
        <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-silver-mist">
          {label}
        </p>
        <span className="font-mono text-[9px] uppercase tracking-widest text-gold-muted">
          {status}
        </span>
      </div>
      <dl className="mt-3 space-y-1.5">
        {rows.map(([k, v]) => (
          <div key={k} className="flex items-center justify-between gap-3">
            <dt className="font-mono text-[10px] text-slate-500">{k}</dt>
            <dd className="font-mono text-[11px] text-white">{v}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
