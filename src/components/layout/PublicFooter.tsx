import Link from "next/link";
import { FOUNDER, FOUNDER_SOCIAL_LINKS } from "@/lib/founder-social";
import { TrustBox } from "@/components/marketing/TrustBox";

const PRODUCT_LINKS = [
  { href: "/e8", label: "E8 Execution Center" },
  { href: "/launch", label: "7-Day Playbook Launch" },
  { href: "/quant-protocol", label: "Quant Protocol (TradeLocker bot)" },
  { href: "/guides/pillar/ultimate-7-day-prop-firm-playbook", label: "Prop Firm Playbook Pillar" },
  { href: "/guides/pillar/mathematical-prop-firm-model", label: "Prop Firm Math Model" },
  { href: "/prop-firm", label: "Prop Firm Challenge Hub" },
  { href: "/tools", label: "Trading Tools" },
  { href: "/offers", label: "Premium Offers" },
];

const LEARN_LINKS = [
  { href: "/guides/break-of-structure", label: "Break of Structure (BOS)" },
  { href: "/guides", label: "Charting Guides" },
  { href: "/lessons", label: "Chart Academy Lessons" },
  { href: "/lessons/market-structure-what-is-bos", label: "What Is BOS Lesson" },
  { href: "/solutions", label: "Free Trading Demos" },
  { href: "/learn", label: "Learn by Market" },
  { href: "/faq", label: "FAQ" },
  { href: "/support", label: "Support" },
];

export function PublicFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-auto border-t border-slate-800/60 bg-slate-950/80">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-2 lg:grid-cols-4 lg:px-8">
        <div className="md:col-span-2 lg:col-span-1">
          <p className="font-mono text-xs font-bold tracking-wider text-slate-200">
            QUICKSILVER<span className="text-cyan-400">.ALGO</span>
          </p>
          <p className="mt-3 text-sm leading-relaxed text-slate-500">
            Official E8 Markets partner. TradeLocker workflow stack, E8 Execution Center,
            live growth tools, and optional Quant Protocol — for evaluation and live-account
            operators on TradeLocker Desktop.
          </p>
          <Link
            href="/register"
            className="mt-4 inline-block font-mono text-xs text-cyan-400 hover:underline"
          >
            Create free account →
          </Link>
        </div>

        <div>
          <h2 className="font-mono text-[10px] font-semibold uppercase tracking-widest text-slate-500">
            Products
          </h2>
          <ul className="mt-3 space-y-2">
            {PRODUCT_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="font-mono text-xs text-slate-400 hover:text-cyan-400"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="font-mono text-[10px] font-semibold uppercase tracking-widest text-slate-500">
            Learn & Guides
          </h2>
          <ul className="mt-3 space-y-2">
            {LEARN_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="font-mono text-xs text-slate-400 hover:text-cyan-400"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="font-mono text-[10px] font-semibold uppercase tracking-widest text-slate-500">
            Founder
          </h2>
          <p className="mt-3 font-mono text-xs font-semibold text-slate-300">
            {FOUNDER.displayName}
          </p>
          <p className="mt-1 text-xs leading-relaxed text-slate-500">{FOUNDER.role}</p>
          <ul className="mt-3 space-y-2">
            {FOUNDER_SOCIAL_LINKS.map((link) => (
              <li key={link.id}>
                <a
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer me"
                  className="font-mono text-xs text-slate-400 hover:text-cyan-400"
                >
                  {link.label}
                  <span className="text-slate-600"> · {link.handle}</span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="border-t border-slate-800/40 px-4 py-6 text-center">
        <TrustBox className="mx-auto max-w-3xl text-center text-[11px] text-slate-600" />
        <p className="mt-4 font-mono text-[10px] text-slate-600">
          © {year} Quicksilver Algo Systems · Founded by {FOUNDER.displayName}
        </p>
        <p className="mt-2 font-mono text-[10px] text-slate-600">
          Official support: email only (supportteam@quicksilveralgo.com). We never contact
          members on Discord. 1-on-1s are Google Meet scheduled by email.
        </p>
      </div>
    </footer>
  );
}
