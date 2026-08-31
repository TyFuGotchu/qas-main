import Link from "next/link";
import { PlaybookChallengeWidget } from "@/components/playbook/PlaybookChallengeWidget";
import { PropFirmChallengePromo } from "@/components/marketing/PropFirmChallengePromo";
import { Badge } from "@/components/ui/Badge";
import { PROP_FIRM_MARKETING_SUBHEADLINE } from "@/lib/prop-firm-challenge-marketing";

export default function PlaybookDashboardPage() {
  return (
    <div className="mx-auto max-w-4xl space-y-8">
      <header>
        <Badge variant="success" className="mb-3">
          Premium Challenge Hub
        </Badge>
        <h1 className="font-mono text-2xl font-bold text-slate-100 sm:text-3xl">
          7-Day Prop Firm Playbook
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-slate-400">
          {PROP_FIRM_MARKETING_SUBHEADLINE}
        </p>
        <p className="mt-3 font-mono text-xs text-slate-600">
          Mark each day complete to unlock the next — daily emails keep you on track.
        </p>
      </header>

      <PlaybookChallengeWidget variant="full" />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { href: "/dashboard/e8", label: "E8 Execution Center", desc: "One / Pro / Signature maps" },
          { href: "/dashboard/tools/prop-survival", label: "Prop Survival", desc: "Simulate before day 1" },
          { href: "/dashboard/journal", label: "Trade Journal", desc: "Log every session" },
          { href: "/dashboard/prop-command", label: "Prop OS", desc: "Live risk telemetry" },
        ].map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="rounded-xl border border-slate-800/60 bg-slate-950/40 p-4 transition-colors hover:border-cyan-accent/30"
          >
            <p className="font-mono text-sm font-semibold text-slate-200">{item.label}</p>
            <p className="mt-1 text-xs text-slate-500">{item.desc}</p>
          </Link>
        ))}
      </div>

      <PropFirmChallengePromo variant="banner" />
    </div>
  );
}