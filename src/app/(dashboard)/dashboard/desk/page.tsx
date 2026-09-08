import Link from "next/link";
import { HardFlatDesk } from "@/components/e8/HardFlatDesk";
import { HardFlatWatcher } from "@/components/e8/HardFlatWatcher";

export default function DashboardDeskPage() {
  return (
    <div className="space-y-6">
      <HardFlatWatcher />
      <header>
        <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-[#9AA3B2]">Desk</p>
        <h1 className="mt-2 text-2xl font-semibold text-[#F3F5F7]">TradeLocker risk desk</h1>
        <p className="mt-2 max-w-2xl text-sm text-[#C9C2D6]">
          Works on any TradeLocker account. Flatten overrides copy. Arm $100–$200 above
          the firm’s real drawdown limit. FX / metals / indices on TradeLocker — not perps
          unless that path is live.
        </p>
        <div className="mt-4 flex flex-wrap gap-3 font-mono text-xs text-[#7FE7DC]">
          <Link href="/dashboard/journal" className="hover:underline">
            Journal
          </Link>
          <Link href="/dashboard/bot" className="hover:underline">
            Live terminal
          </Link>
          <Link href="/dashboard/copy" className="hover:underline">
            Master Suite / Copy
          </Link>
          <Link href="/dashboard/trading-bots/quant-protocol" className="hover:underline">
            Quant Protocol
          </Link>
        </div>
      </header>
      <HardFlatDesk />
    </div>
  );
}
