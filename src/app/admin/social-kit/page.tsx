import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Badge } from "@/components/ui/Badge";
import { CopyBlock } from "@/components/social/CopyBlock";
import { getSession } from "@/lib/auth";
import { isAdminUser } from "@/lib/admin";
import {
  CAROUSEL_STACK,
  COMPLIANCE_LINES,
  CONTENT_PILLARS,
  HASHTAG_SETS,
  IG_TT_CAPTIONS,
  POSITIONING,
  PROFILE_BIOS,
  REEL_SCRIPTS,
  SOCIAL_LINKS,
  WEEKLY_CADENCE,
  X_POSTS,
} from "@/lib/social-kit";

export const metadata: Metadata = {
  title: "Social Kit | Admin",
  description: "Internal bios, posts, Reels scripts, and carousels for Quicksilver social.",
  robots: { index: false, follow: false },
};

function Section({
  id,
  title,
  children,
}: {
  id: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-28 space-y-4">
      <h2 className="font-mono text-lg font-bold text-slate-100 sm:text-xl">{title}</h2>
      {children}
    </section>
  );
}

export default async function AdminSocialKitPage() {
  const session = await getSession();
  if (!session || !isAdminUser(session)) {
    redirect("/login?redirect=/admin/social-kit");
  }

  return (
    <div className="mx-auto max-w-3xl space-y-14 pb-10">
      <header className="space-y-4">
        <Badge variant="warning">Admin only · noindex</Badge>
        <h1 className="font-mono text-3xl font-bold text-slate-50 sm:text-4xl">
          Social kit
        </h1>
        <p className="text-sm leading-relaxed text-slate-400">
          Copy-ready bios, posts, Reels scripts, carousels, and links. Bookmark{" "}
          <span className="font-mono text-cyan-400/90">/admin/social-kit</span>.
          Primary destination is always the full arsenal — not bot-only.
        </p>
        <p className="rounded-lg border border-cyan-500/20 bg-cyan-500/5 px-4 py-3 text-sm text-slate-300">
          {POSITIONING.oneLiner}
        </p>
        <p className="font-mono text-xs text-slate-500">{POSITIONING.rule}</p>
        <nav className="flex flex-wrap gap-2 font-mono text-[11px] uppercase tracking-wider text-cyan-400/90">
          {[
            ["bios", "Bios"],
            ["links", "Links"],
            ["x", "X posts"],
            ["ig", "IG / TikTok"],
            ["reels", "Reel scripts"],
            ["carousel", "Carousel"],
            ["calendar", "Calendar"],
            ["rules", "Rules"],
          ].map(([id, label]) => (
            <a
              key={id}
              href={`#${id}`}
              className="rounded-full border border-slate-800 px-3 py-1 hover:border-cyan-500/40"
            >
              {label}
            </a>
          ))}
        </nav>
      </header>

      <Section id="bios" title="1. Profile bios">
        <CopyBlock label="Short (IG / TikTok)" text={PROFILE_BIOS.short} />
        <CopyBlock label="Medium" text={PROFILE_BIOS.medium} />
      </Section>

      <Section id="links" title="2. Links (UTM ready)">
        <p className="text-sm text-slate-500">
          Default share page:{" "}
          <Link href="/quant-protocol" className="text-cyan-400 hover:underline">
            /quant-protocol
          </Link>
          . Playbook posts can use{" "}
          <Link href="/launch" className="text-cyan-400 hover:underline">
            /launch
          </Link>
          .
        </p>
        <CopyBlock label="Link in bio" text={SOCIAL_LINKS.quantBio} />
        <CopyBlock label="X — quant-protocol" text={SOCIAL_LINKS.quantX} />
        <CopyBlock label="Instagram — quant-protocol" text={SOCIAL_LINKS.quantIg} />
        <CopyBlock label="TikTok — quant-protocol" text={SOCIAL_LINKS.quantTt} />
        <CopyBlock label="X — launch / playbook" text={SOCIAL_LINKS.launchX} />
        <CopyBlock
          label="YouTube live sample (performance varies)"
          text={SOCIAL_LINKS.youtubeSample}
        />
        <CopyBlock label="Hashtags — core" text={HASHTAG_SETS.core} />
        <CopyBlock label="Hashtags — TradeLocker" text={HASHTAG_SETS.tradelocker} />
        <CopyBlock label="Hashtags — education" text={HASHTAG_SETS.education} />
      </Section>

      <Section id="x" title="3. X posts">
        {X_POSTS.map((post) => (
          <CopyBlock key={post.id} label={post.label} text={post.body} />
        ))}
      </Section>

      <Section id="ig" title="4. Instagram / TikTok captions">
        <p className="text-sm text-slate-500">
          Put the URL in bio — captions say “link in bio.” 5–8 hashtags max.
        </p>
        {IG_TT_CAPTIONS.map((c) => (
          <CopyBlock key={c.id} label={c.label} text={c.body} />
        ))}
      </Section>

      <Section id="reels" title="5. Reel / TikTok scripts (10)">
        <div className="space-y-6">
          {REEL_SCRIPTS.map((reel) => (
            <div
              key={reel.id}
              className="space-y-3 rounded-xl border border-slate-800/60 bg-slate-950/40 p-5"
            >
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <h3 className="font-mono text-sm font-semibold text-slate-100">
                  {reel.id.toUpperCase()}. {reel.title}
                </h3>
                <span className="font-mono text-[10px] uppercase tracking-wider text-slate-500">
                  {reel.duration}
                </span>
              </div>
              <CopyBlock
                label="On-screen text (sequence)"
                text={reel.onScreen.map((line, i) => `${i + 1}. ${line}`).join("\n")}
              />
              <CopyBlock label="Voiceover (optional)" text={reel.vo} />
              <CopyBlock label="End CTA" text={reel.cta} />
            </div>
          ))}
        </div>
      </Section>

      <Section id="carousel" title="6. IG carousel — full stack (8 slides)">
        <CopyBlock
          label="All slides (for designer / Canva)"
          text={CAROUSEL_STACK.map(
            (s) => `Slide ${s.slide} — ${s.title}\n${s.body}`
          ).join("\n\n")}
        />
        <ul className="space-y-2">
          {CAROUSEL_STACK.map((s) => (
            <li
              key={s.slide}
              className="rounded-lg border border-slate-800/50 px-4 py-3 text-sm"
            >
              <span className="font-mono text-xs text-cyan-400">Slide {s.slide}</span>
              <p className="mt-1 font-mono text-sm font-semibold text-slate-200">
                {s.title}
              </p>
              <p className="mt-1 text-slate-500">{s.body}</p>
            </li>
          ))}
        </ul>
      </Section>

      <Section id="calendar" title="7. Pillars + weekly cadence">
        <div className="grid gap-3 sm:grid-cols-2">
          {CONTENT_PILLARS.map((p) => (
            <div
              key={p.name}
              className="rounded-xl border border-slate-800/60 bg-slate-950/40 p-4"
            >
              <p className="font-mono text-sm font-semibold text-slate-200">
                {p.name}{" "}
                <span className="text-cyan-400/80">{p.pct}</span>
              </p>
              <ul className="mt-2 list-inside list-disc text-xs text-slate-500">
                {p.ideas.map((idea) => (
                  <li key={idea}>{idea}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <CopyBlock
          label="Week plan"
          text={WEEKLY_CADENCE.map((d) => `${d.day}: ${d.post}`).join("\n")}
        />
      </Section>

      <Section id="rules" title="8. Compliance / positioning">
        <CopyBlock label="Not this" text={POSITIONING.notThis} />
        <ul className="space-y-2 text-sm text-slate-400">
          {COMPLIANCE_LINES.map((line) => (
            <li
              key={line}
              className="rounded-lg border border-slate-800/50 px-3 py-2 font-mono text-xs"
            >
              {line}
            </li>
          ))}
        </ul>
      </Section>
    </div>
  );
}
