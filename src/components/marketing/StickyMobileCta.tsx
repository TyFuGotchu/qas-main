import Link from "next/link";
import Button from "@/components/ui/Button";

export function StickyMobileCta() {
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-white/[0.08] bg-[#07080C]/95 p-3 backdrop-blur-xl md:hidden">
      <div className="flex flex-col gap-2">
        <Link href="/desk">
          <Button variant="primary" size="sm" className="w-full">
            Start on the Desk
          </Button>
        </Link>
        <Link href="/pricing">
          <Button variant="secondary" size="sm" className="w-full">
            Pricing
          </Button>
        </Link>
      </div>
    </div>
  );
}
