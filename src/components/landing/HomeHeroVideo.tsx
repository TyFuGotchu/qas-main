"use client";

import { HOME_YOUTUBE_EMBED, HOME_YOUTUBE_ID } from "@/lib/media";

export function HomeHeroVideo() {
  return (
    <div className="mx-auto mt-10 w-full max-w-3xl">
      <p className="mb-3 font-mono text-[11px] uppercase tracking-[0.2em] text-gold-muted">
        Watch the stack
      </p>
      <div className="overflow-hidden rounded-[8px] border border-white/[0.08] bg-[#10141C]">
        <div className="relative aspect-video w-full">
          <iframe
            className="absolute inset-0 h-full w-full"
            src={`${HOME_YOUTUBE_EMBED}?rel=0&modestbranding=1`}
            title="Quicksilver Quant Protocol"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            referrerPolicy="strict-origin-when-cross-origin"
          />
        </div>
      </div>
      <p className="mt-2 font-mono text-[10px] text-slate-600">
        Plays from YouTube · {HOME_YOUTUBE_ID}
      </p>
    </div>
  );
}
