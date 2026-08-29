import { StartOfferCtas } from "@/components/marketing/StartOfferCtas";

export function StickyMobileCta() {
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-gold-soft/20 bg-obsidian-950/95 p-3 backdrop-blur-xl md:hidden">
      <StartOfferCtas
        source="homepage_sticky_mobile"
        size="sm"
        layout="stack"
        className="gap-2"
      />
      <p className="mt-2 text-center font-mono text-[10px] text-slate-500">
        Bot not included in free trial
      </p>
    </div>
  );
}
