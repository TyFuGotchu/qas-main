import Link from "next/link";
import {
  EDGE_RADAR_HUB_PATH,
  EDGE_RADAR_PILLAR_PATH,
} from "@/lib/seo/edge-radar-authority";
import { EDGE_RADAR_PATH } from "@/lib/edge-radar";

const PRODUCT_LINKS = [
  { href: "/launch", label: "7-Day Playbook Launch" },
  { href: "/guides/pillar/ultimate-7-day-prop-firm-playbook", label: "Prop Firm Playbook" },
  { href: "/guides/pillar/mathematical-model-prop-firm-success", label: "Prop Firm Math Model" },
  { href: EDGE_RADAR_PATH, label: "Edge Radar Props Scanner" },
  { href: EDGE_RADAR_PILLAR_PATH, label: "Player Props Edge Playbook" },
  { href: "/guarantee", label: "Money-Back Guarantee" },
  { href: "/tools", label: "Trading Tools" },
  { href: "/offers", label: "Premium Offers" },
];

const LEARN_LINKS = [
  { href: "/guides/break-of-structure", label: "Break of Structure (BOS)" },
  { href: "/prop-firm", label: "Prop Firm Guides Hub" },
  { href: "/guides", label: "Charting Guides" },
  { href: "/lessons", label: "Chart Academy Lessons" },
  { href: "/lessons/market-structure-what-is-bos", label: "What Is BOS Lesson" },
  { href: "/solutions", label: "Free Trading Demos" },
  { href: "/learn", label: "Learn by Market" },
  { href: EDGE_RADAR_HUB_PATH, label: "Sports Props Guides" },
  { href: "/faq", label: "FAQ" },
  { href: "/support", label: "Support" },
];

const SPORT_LINKS = [
  { href: "/edge-radar/guides/nba-player-props-scanner", label: "NBA Props Scanner" },
  { href: "/edge-radar/guides/nfl-player-props-scanner", label: "NFL Props Scanner" },
  { href: "/edge-radar/guides/mlb-player-props-scanner", label: "MLB Props Scanner" },
  { href: "/edge-radar/guides/line-lag-detection", label: "Line Lag Detection" },
  { href: "/edge-radar/guides/injury-prop-betting", label: "Injury Prop Betting" },
];

export function PublicFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-auto border-t border-slate-800/60 bg-slate-950/80">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-3 lg:px-8">
        <div>
          <p className="font-mono text-xs font-bold tracking-wider text-slate-200">
            QUICKSILVER<span className="text-cyan-400">.ALGO</span>
          </p>
          <p className="mt-3 text-sm leading-relaxed text-slate-500">
            Prop firm challenge tools, 7-day playbook, Chart Academy, and Edge Radar
            sports prop scanner — built for manual traders and bettors.
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
          <h2 className="mt-6 font-mono text-[10px] font-semibold uppercase tracking-widest text-slate-500">
            Sports props
          </h2>
          <ul className="mt-3 space-y-2">
            {SPORT_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="font-mono text-xs text-slate-400 hover:text-amber-400"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="border-t border-slate-800/40 px-4 py-4 text-center">
        <p className="font-mono text-[10px] text-slate-600">
          © {year} Quicksilver Algo Systems · Educational tools only — not financial advice
        </p>
      </div>
    </footer>
  );
}
