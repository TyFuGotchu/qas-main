import Link from "next/link";
import { WEBHOOK_PUBLIC_URL } from "@/lib/plans";

export default function DashboardCopyPage() {
  return (
    <div className="mx-auto max-w-2xl space-y-4">
      <h1 className="text-2xl font-semibold text-[#F3F5F7]">Master Suite / Copy</h1>
      <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-[#F5C84C]">Not live</p>
      <p className="text-sm text-[#C9C2D6]">
        TradingView webhook → TradeLocker. Copy off by default. Flatten wins if armed.
        Secret issued after Copy or Full subscribe. JSON waiting on Ty.
      </p>
      <p className="font-mono text-xs text-[#7FE7DC]">{WEBHOOK_PUBLIC_URL}</p>
      <Link href="/copy" className="text-sm text-[#9AA3B2] hover:underline">
        Setup notes →
      </Link>
    </div>
  );
}
