import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Badge } from "@/components/ui/Badge";
import { CopyBlock } from "@/components/social/CopyBlock";
import { getSession } from "@/lib/auth";
import { isAdminUser } from "@/lib/admin";
import {
  SPRINT_DAILY,
  SPRINT_EMAILS,
  SPRINT_GOAL,
  SPRINT_MATH,
} from "@/lib/sprint-21";
import {
  CHALLENGE_KIT_PATH,
  CHALLENGE_KIT_PDF,
  CHALLENGE_KIT_PRICE,
  getChallengeKitCheckoutUrl,
  PREMIUM_PRICE,
} from "@/lib/pricing-constants";

export const metadata: Metadata = {
  title: "21-day sprint | Admin",
  robots: { index: false, follow: false },
};

export default async function AdminSprintPage() {
  const session = await getSession();
  if (!session || !isAdminUser(session)) {
    redirect("/login?redirect=/admin/sprint");
  }

  const kitPay = getChallengeKitCheckoutUrl();

  return (
    <div className="mx-auto max-w-3xl space-y-10 pb-12">
      <header>
        <Badge variant="warning">Admin · $1k sprint</Badge>
        <h1 className="mt-3 font-mono text-3xl font-bold text-slate-50">
          {SPRINT_GOAL}
        </h1>
        <p className="mt-2 text-sm text-slate-400">
          Premium {PREMIUM_PRICE}/mo + kit {CHALLENGE_KIT_PRICE} + partners. No
          fake automation.
        </p>
      </header>

      <section className="rounded-xl border border-slate-800/60 p-5">
        <h2 className="font-mono text-sm font-semibold text-cyan-400">Math</h2>
        <ul className="mt-3 list-inside list-disc text-sm text-slate-400">
          {SPRINT_MATH.map((m) => (
            <li key={m}>{m}</li>
          ))}
        </ul>
        <p className="mt-4 font-mono text-xs text-slate-500">
          Kit landing:{" "}
          <Link href={CHALLENGE_KIT_PATH} className="text-cyan-400">
            {CHALLENGE_KIT_PATH}
          </Link>
          <br />
          PDF file (send after payment until checkout URL is set):{" "}
          <a href={CHALLENGE_KIT_PDF} className="text-cyan-400" target="_blank" rel="noreferrer">
            {CHALLENGE_KIT_PDF}
          </a>
          <br />
          Checkout env:{" "}
          {kitPay ? (
            <span className="text-emerald-400">set</span>
          ) : (
            <span className="text-amber-400">
              missing NEXT_PUBLIC_CHALLENGE_KIT_CHECKOUT_URL
            </span>
          )}
        </p>
      </section>

      {SPRINT_DAILY.map((w) => (
        <section key={w.week}>
          <h2 className="font-mono text-lg font-bold text-slate-100">
            Week {w.week} — {w.title}
          </h2>
          <ul className="mt-3 list-inside list-disc space-y-2 text-sm text-slate-400">
            {w.days.map((d) => (
              <li key={d}>{d}</li>
            ))}
          </ul>
        </section>
      ))}

      <CopyBlock label="Email — kit to warm leads" text={SPRINT_EMAILS.kitToWarm} />
      <CopyBlock label="Email — Premium close" text={SPRINT_EMAILS.premiumClose} />
    </div>
  );
}
