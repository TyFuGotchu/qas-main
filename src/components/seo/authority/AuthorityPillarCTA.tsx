import Link from "next/link";
import { ArrowRight, Zap } from "lucide-react";
import Button from "@/components/ui/Button";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { Badge } from "@/components/ui/Badge";
import {
  getPremiumCheckoutUrl,
  PREMIUM_PRICE,
} from "@/lib/pricing-constants";
import { MoneyBackGuarantee } from "@/components/marketing/MoneyBackGuarantee";
import { PLAYBOOK_LAUNCH_PATH } from "@/lib/playbook-launch";

export function AuthorityPillarCTA() {
  return (
    <GlassPanel className="border-cyan-accent/30 bg-gradient-to-br from-slate-950 to-cyan-accent/5 p-6 sm:p-8">
      <Badge variant="success" className="mb-4">
         — {PREMIUM_PRICE} first month
      </Badge>
      <div className="flex items-start gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-cyan-accent/30 bg-cyan-accent/10">
          <Zap className="h-6 w-6 text-cyan-accent" />
        </div>
        <div>
          <h2 className="font-mono text-xl font-bold text-slate-100 sm:text-2xl">
            Run the Playbook with Premium
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-slate-400">
            Interactive 7-day tracker, Prop Survival Monte Carlo, all 9 planning
            tools, Chart Academy, and TradeLocker bot — one subscription.
          </p>
        </div>
      </div>
      <div className="mt-5">
        <MoneyBackGuarantee variant="inline" />
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        <a href={getPremiumCheckoutUrl()} target="_blank" rel="noopener noreferrer">
          <Button variant="primary" size="lg">
            Subscribe — {PREMIUM_PRICE}
            <ArrowRight className="h-4 w-4" />
          </Button>
        </a>
        <Link href={PLAYBOOK_LAUNCH_PATH}>
          <Button variant="ghost" size="lg">
            View Launch Offer
          </Button>
        </Link>
        <Link href="/register">
          <Button variant="ghost" size="lg">
            Create Free Account
          </Button>
        </Link>
      </div>
    </GlassPanel>
  );
}