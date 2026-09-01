import Button from "@/components/ui/Button";
import { E8AffiliateLink } from "@/components/e8/E8AffiliateLink";
import {
  E8_PROMO_COMPLIANCE,
  E8_PROMO_COPY,
  E8_SIGNUP,
  getE8ReferralUrl,
  getLiveE8Discounts,
} from "@/lib/e8-partner";
import { cn } from "@/lib/utils";

function E8Mark() {
  return (
    <span className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-[4px] border border-[#E4D4FF] bg-[#0B0712] font-mono text-[10px] font-semibold tracking-[0.08em] text-white">
      {E8_PROMO_COPY.partnerMark}
    </span>
  );
}

function BannerFoot({ className }: { className?: string }) {
  return (
    <p className={cn("font-mono text-[10px] leading-relaxed text-[#A89BB8]", className)}>
      {E8_PROMO_COMPLIANCE}
    </p>
  );
}

export function E8PromoRail() {
  const live = getLiveE8Discounts();
  const offer = live[0]?.railOffer;
  return (
    <E8AffiliateLink className="e8-bar block border-b">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-center gap-0.5 px-4 py-1.5 text-center">
        <p className="flex flex-wrap items-center justify-center gap-x-2 gap-y-0.5 font-mono text-[11px] leading-relaxed text-white sm:text-xs">
          <E8Mark />
          <span className="uppercase tracking-[0.14em] text-[#E4D4FF]">
            {E8_PROMO_COPY.partnerLine}
          </span>
          {offer && (
            <>
              <span className="hidden text-[#E4D4FF]/40 sm:inline">·</span>
              <span>{offer}</span>
            </>
          )}
          <span className="hidden text-[#E4D4FF]/40 sm:inline">·</span>
          <span className="text-[#E4D4FF]">{E8_PROMO_COPY.openThrough}</span>
        </p>
        <BannerFoot />
      </div>
    </E8AffiliateLink>
  );
}

function heroOfferLine(): string {
  const live = getLiveE8Discounts();
  const parts = ["E8 accounts through our desk."];
  if (live.some((item) => item.id === "one-pro-perps")) {
    parts.push("Perps up to 50% off first order.");
  }
  if (live.some((item) => item.id === "sig-futures")) {
    parts.push("Signature Futures 20% off.");
  }
  if (live.some((item) => item.id === "zero")) {
    parts.push("Zero 35% off.");
  }
  return parts.join(" ");
}

export function E8PromoHeroStrip() {
  const live = getLiveE8Discounts();
  if (live.length === 0) return null;
  return (
    <div className="w-full rounded-[8px] border border-[#E4D4FF]/30 bg-[#0B0712] px-4 py-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0 max-w-xl">
          <div className="flex items-center gap-2">
            <E8Mark />
            <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-[#E4D4FF]">
              {E8_PROMO_COPY.partnerLine}
            </p>
          </div>
          <p className="mt-2 text-sm leading-relaxed text-white">{heroOfferLine()}</p>
        </div>
        <E8AffiliateLink>
          <Button variant="e8" size="md">
            {E8_PROMO_COPY.heroCta}
          </Button>
        </E8AffiliateLink>
      </div>
      <BannerFoot className="mt-3" />
    </div>
  );
}

export function E8PromoDeskCard() {
  const live = getLiveE8Discounts();
  return (
    <div className="rounded-[8px] border border-[#E4D4FF]/30 bg-[#0B0712] px-4 py-4">
      <div className="flex items-center gap-2">
        <E8Mark />
        <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-[#E4D4FF]">
          {E8_PROMO_COPY.partnerLine}
        </p>
      </div>
      {live.length > 0 && (
        <ul className="mt-3 space-y-1.5">
          {live.map((item) => (
            <li key={item.id} className="text-sm leading-relaxed text-white">
              {item.line}
            </li>
          ))}
        </ul>
      )}
      <p className="mt-3 text-xs leading-relaxed text-[#C9C2D6]">{E8_PROMO_COPY.deskNote}</p>
      <div className="mt-4">
        <E8AffiliateLink>
          <Button variant="e8" size="md">
            {E8_PROMO_COPY.heroCta}
          </Button>
        </E8AffiliateLink>
      </div>
      <BannerFoot className="mt-3" />
    </div>
  );
}

export function E8PromoSidebarCard() {
  const live = getLiveE8Discounts();
  if (live.length === 0) return null;
  return (
    <div className="rounded-[6px] border border-[#E4D4FF]/30 bg-[#0B0712] p-3">
      <div className="flex items-center gap-2">
        <E8Mark />
        <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-[#E4D4FF]">
          {E8_PROMO_COPY.sidebarTitle}
        </p>
      </div>
      <div className="mt-3 flex flex-col gap-1.5">
        {live.map((item) => (
          <E8AffiliateLink key={item.id}>
            <Button variant="e8" size="sm" className="h-8 w-full px-2 text-[11px]">
              {item.button}
            </Button>
          </E8AffiliateLink>
        ))}
      </div>
      <BannerFoot className="mt-2" />
    </div>
  );
}

export function E8PromoFooterStrip() {
  const href = getE8ReferralUrl();
  const live = getLiveE8Discounts();
  const perpsLive = live.some((item) => item.id === "one-pro-perps");
  return (
    <E8AffiliateLink className="block border-t border-[#E4D4FF]/20 bg-[#0B0712]">
      <div className="px-6 py-3 text-center sm:px-8 lg:px-10">
        <p className="font-mono text-[11px] leading-relaxed text-white">
          {perpsLive ? E8_PROMO_COPY.footerLead : "E8 Markets partner"}
          {" · "}
          <span className="text-[#E4D4FF]">{href}</span>
        </p>
        <BannerFoot className="mt-1" />
      </div>
    </E8AffiliateLink>
  );
}

export function E8PromoSignupBlock() {
  const live = getLiveE8Discounts();
  return (
    <div className="space-y-5">
      <E8AffiliateLink>
        <Button variant="e8" size="lg">
          {E8_PROMO_COPY.signupCta}
        </Button>
      </E8AffiliateLink>
      {live.length > 0 && (
        <ul className="space-y-2">
          {live.map((item) => (
            <li key={item.id} className="text-sm leading-relaxed text-[#F5F3FA]">
              {item.line}
            </li>
          ))}
        </ul>
      )}
      <p className="text-xs leading-relaxed text-[#C9C2D6]">{E8_SIGNUP.codeHint}</p>
      <BannerFoot />
    </div>
  );
}
