import { FOUNDER_SOCIAL_LINKS, type FounderSocialPlatform } from "@/lib/founder-social";
import { cn } from "@/lib/utils";

function IconX({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden>
      <path
        fill="currentColor"
        d="M18.244 2H21.5l-7.5 8.57L22.5 22h-6.59l-5.16-6.74L5.2 22H1.94l8.02-9.16L1.5 2h6.76l4.66 6.18L18.244 2Zm-1.16 18.06h1.8L7.01 3.86H5.08l12.004 16.2Z"
      />
    </svg>
  );
}

function IconTikTok({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden>
      <path
        fill="currentColor"
        d="M14.5 3h2.12c.18 1.54 1.12 2.86 2.5 3.5V8.7c-1.16-.04-2.27-.4-3.22-1.02v6.46A6.14 6.14 0 1 1 9.4 8.14v2.2a3.94 3.94 0 1 0 2.88 3.8V3Z"
      />
    </svg>
  );
}

function IconYouTube({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden>
      <path
        fill="currentColor"
        d="M23 12.2s-.23-3.23-.94-4.65a3.04 3.04 0 0 0-2.14-2.16C17.86 5 12 5 12 5s-5.86 0-7.92.39A3.04 3.04 0 0 0 1.94 7.55C1.23 8.97 1 12.2 1 12.2s.23 3.23.94 4.65a3.04 3.04 0 0 0 2.14 2.16C6.14 19.4 12 19.4 12 19.4s5.86 0 7.92-.39a3.04 3.04 0 0 0 2.14-2.16c.71-1.42.94-4.65.94-4.65ZM9.75 15.52V8.88l6.08 3.32-6.08 3.32Z"
      />
    </svg>
  );
}

function IconInstagram({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden>
      <path
        fill="currentColor"
        d="M8 3h8a5 5 0 0 1 5 5v8a5 5 0 0 1-5 5H8a5 5 0 0 1-5-5V8a5 5 0 0 1 5-5Zm0 2a3 3 0 0 0-3 3v8a3 3 0 0 0 3 3h8a3 3 0 0 0 3-3V8a3 3 0 0 0-3-3H8Zm9.2 1.4a1.1 1.1 0 1 1 0 2.2 1.1 1.1 0 0 1 0-2.2ZM12 8.2A3.8 3.8 0 1 1 8.2 12 3.8 3.8 0 0 1 12 8.2Zm0 2A1.8 1.8 0 1 0 13.8 12 1.8 1.8 0 0 0 12 10.2Z"
      />
    </svg>
  );
}

const ICONS: Record<FounderSocialPlatform, typeof IconX> = {
  x: IconX,
  tiktok: IconTikTok,
  youtube: IconYouTube,
  instagram: IconInstagram,
};

export function FounderSocialIcons({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center gap-3", className)}>
      {FOUNDER_SOCIAL_LINKS.map((link) => {
        const Icon = ICONS[link.id];
        return (
          <a
            key={link.id}
            href={link.href}
            target="_blank"
            rel="noopener noreferrer me"
            aria-label={link.label}
            className="text-[#9AA3B2] transition-colors hover:text-[#7FE7DC]"
          >
            <Icon className="h-[18px] w-[18px]" />
          </a>
        );
      })}
    </div>
  );
}
