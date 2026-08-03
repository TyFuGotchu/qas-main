import Link from "next/link";
import {
  moneyPagesExcept,
  type MoneyPageLink,
} from "@/lib/seo/money-pages";

type Props = {
  /** Current page path (e.g. /quant-protocol) so it is excluded from the grid. */
  currentPath: string;
  title?: string;
  subtitle?: string;
  /** Max links to show (default 8). */
  limit?: number;
  className?: string;
};

/**
 * Dense internal links between money pages — recovery signal for crawl priority.
 */
export function AuthorityCrossLinks({
  currentPath,
  title = "Explore the Quicksilver stack",
  subtitle = "Core pages Google and traders should crawl first — bot, playbook, prop firm guides, and tools.",
  limit = 8,
  className = "",
}: Props) {
  const links: MoneyPageLink[] = moneyPagesExcept(currentPath)
    .filter((p) => p.priority === "core" || p.priority === "learn")
    .slice(0, limit);

  if (links.length === 0) return null;

  return (
    <section
      aria-labelledby="authority-cross-links-heading"
      className={`border-t border-slate-800/60 pt-10 ${className}`}
    >
      <h2
        id="authority-cross-links-heading"
        className="text-center font-mono text-lg font-bold text-slate-200 sm:text-xl"
      >
        {title}
      </h2>
      <p className="mx-auto mt-2 max-w-2xl text-center text-sm text-slate-500">
        {subtitle}
      </p>
      <ul className="mx-auto mt-6 grid max-w-5xl gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {links.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className="block h-full rounded-xl border border-slate-800/60 bg-slate-950/40 p-4 transition-colors hover:border-cyan-500/35"
            >
              <span className="font-mono text-sm font-semibold text-slate-200">
                {link.title}
              </span>
              <span className="mt-1.5 block text-xs leading-relaxed text-slate-500">
                {link.description}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
