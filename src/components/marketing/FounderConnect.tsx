import { FOUNDER, FOUNDER_SOCIAL_LINKS } from "@/lib/founder-social";

export function FounderConnect({ compact = false }: { compact?: boolean }) {
  return (
    <div className={compact ? "text-center" : undefined}>
      <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-slate-500">
        Founder
      </p>
      <p className="mt-1 font-mono text-sm text-slate-300">{FOUNDER.firstName}</p>
      <div className="mt-3 flex flex-wrap items-center justify-center gap-x-4 gap-y-2">
        {FOUNDER_SOCIAL_LINKS.map((link) => (
          <a
            key={link.id}
            href={link.href}
            target="_blank"
            rel="noopener noreferrer me"
            className="font-mono text-xs text-slate-400 hover:text-gold-soft"
          >
            {link.label}
          </a>
        ))}
      </div>
    </div>
  );
}
