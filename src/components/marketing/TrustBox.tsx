export function TrustBox({ className = "" }: { className?: string }) {
  return (
    <p className={`text-xs leading-relaxed text-slate-500 ${className}`}>
      Quicksilver Algo Systems provides educational software and trading tools. Trading
      leveraged products is high risk. Prop firm evaluations can be failed. Nothing on this
      site is a recommendation to buy or sell any instrument. Testimonials are individual
      opinions and not typical. Past backtests and examples do not predict future results.
    </p>
  );
}
