import Link from "next/link";
import Button from "@/components/ui/Button";
import { TOTAL_SEO_LANDING_PAGES } from "@/lib/seo/seo-index";
import { Activity, BarChart3, Cpu, Shield } from "lucide-react";

export function Hero() {
  return (
    <section className="relative overflow-hidden px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
      <div className="absolute inset-0 bg-gradient-to-b from-cyan-500/5 via-transparent to-transparent" />
      <div className="relative mx-auto max-w-7xl">
        <div className="text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-500/5 px-4 py-1.5">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-mono text-xs uppercase tracking-widest text-cyan-400">
              Live System — v2.4.1
            </span>
          </div>

          <h1 className="mx-auto max-w-4xl font-mono text-3xl font-bold tracking-tight text-slate-100 sm:text-5xl lg:text-6xl">
            <span className="terminal-glow text-cyan-terminal">Quicksilver</span>{" "}
            Algo System
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-base text-slate-400 sm:text-lg">
            Institutional-grade algorithmic execution infrastructure. Deploy
            battle-tested automated strategies with proprietary QS engines,
            institutional risk matrices, and exclusive quant tooling built for
            prop firm challenges and live capital deployment.
          </p>

          <div className="mt-10 flex flex-col items-center gap-4">
            <Link href="/register">
              <Button variant="primary" size="lg">
                Create Profile to View Access Tiers
              </Button>
            </Link>
            <p className="font-mono text-xs text-slate-500">
              <Link href="/offers" className="text-emerald-400 hover:underline">
                FIRST100 — $89.99 first month
              </Link>
              {" · "}
              <Link href="/learn" className="text-cyan-accent hover:underline">
                {TOTAL_SEO_LANDING_PAGES}+ guides
              </Link>
              {" · "}
              <Link
                href="/solutions"
                className="text-cyan-accent hover:underline"
              >
                Free calculators
              </Link>
            </p>
          </div>
        </div>

        <div className="mt-20 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {[
            {
              icon: Cpu,
              title: "Tradelocker Exclusive bot Quicksilver Quant Protocol",
              desc: "TradeLocker marketplace bot with pre-tuned prop-firm parameters",
            },
            {
              icon: BarChart3,
              title: "6 Master Tools",
              desc: "Manual planning tools — confluence scoring, risk matrix, trade planner & more",
            },
            {
              icon: Activity,
              title: "Email Support",
              desc: "Priority support at support@quicksilveralgo.com for Premium members",
            },
            {
              icon: Shield,
              title: "Risk Engine",
              desc: "Prop firm drawdown compliance with mathematical precision",
            },
          ].map((feature) => (
            <div
              key={feature.title}
              className="group rounded-lg border border-slate-800/60 bg-obsidian-900/50 p-6 transition-all hover:border-cyan-500/30 hover:bg-obsidian-900"
            >
              <feature.icon className="mb-4 h-8 w-8 text-cyan-400 transition-transform group-hover:scale-110" />
              <h3 className="font-mono text-sm font-semibold text-slate-200">
                {feature.title}
              </h3>
              <p className="mt-2 text-sm text-slate-500">{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}