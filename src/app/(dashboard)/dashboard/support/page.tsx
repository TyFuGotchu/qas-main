import { getFreshSession } from "@/lib/access-control";
import { SupportContactPanel } from "@/components/support/SupportContactPanel";
import { FaqSection } from "@/components/support/FaqSection";
import { Card, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import Link from "next/link";
import { SUPPORT_EMAIL, SUPPORT_RESPONSE_SLA } from "@/lib/support";
import { canAccessToolsBySubscription } from "@/lib/tiers";
import { HelpCircle, Mail } from "lucide-react";

export default async function DashboardSupportPage() {
  const user = await getFreshSession();
  const isPremium = user
    ? canAccessToolsBySubscription(user.subscriptionTier)
    : false;

  return (
    <div className="space-y-8">
      <div>
        <h2 className="font-mono text-2xl font-bold text-slate-200">
          Support Center
        </h2>
        <p className="mt-1 font-mono text-sm text-slate-500">
          All requests → {SUPPORT_EMAIL}
        </p>
      </div>

      <Card className="border-cyan-accent/20">
        <CardContent className="flex items-start gap-4 py-6">
          <HelpCircle className="mt-1 h-6 w-6 shrink-0 text-cyan-accent" />
          <div>
            <p className="font-mono text-sm text-slate-300">
              {isPremium ? "Premium support tier" : "Free account support"}
            </p>
            <p className="mt-2 text-sm text-slate-500">
              Expected response:{" "}
              <span className="text-slate-300">
                {isPremium
                  ? SUPPORT_RESPONSE_SLA.premium
                  : SUPPORT_RESPONSE_SLA.free}
              </span>
              . Include your account email (
              <span className="text-cyan-accent">{user?.email}</span>) in every
              message.
            </p>
            {isPremium && (
              <Badge variant="success" className="mt-3">
                Priority queue
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>

      <SupportContactPanel
        accountEmail={user?.email}
      />

      <section>
        <div className="mb-4 flex items-center justify-between">
          <h3 className="font-mono text-sm font-bold uppercase tracking-widest text-slate-500">
            Quick answers
          </h3>
          <Link
            href="/faq"
            target="_blank"
            className="font-mono text-xs text-cyan-accent hover:underline"
          >
            Open full FAQ
          </Link>
        </div>
        <FaqSection showCategories={false} limitPerCategory={1} />
      </section>

      <Card>
        <CardContent className="flex items-center gap-4 py-5">
          <Mail className="h-5 w-5 text-slate-500" />
          <p className="text-sm text-slate-500">
            Public support page:{" "}
            <Link href="/support" className="text-cyan-accent hover:underline">
              /support
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}