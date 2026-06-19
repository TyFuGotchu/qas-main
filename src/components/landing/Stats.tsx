export function Stats() {
  const stats = [
    { value: "94.2%", label: "Win Rate (Backtested)" },
    { value: "1:2.8", label: "Avg Risk:Reward" },
    { value: "<0.3%", label: "Max Daily Drawdown" },
    { value: "24/7", label: "Automated Execution" },
  ];

  return (
    <section className="border-y border-slate-800/60 bg-obsidian-900/30 px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-7xl gap-8 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.label} className="text-center">
            <p className="font-mono text-3xl font-bold text-cyan-terminal terminal-glow">
              {stat.value}
            </p>
            <p className="mt-2 font-mono text-xs uppercase tracking-widest text-slate-500">
              {stat.label}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}