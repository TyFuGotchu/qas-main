import Link from "next/link";

export default function DashboardFirmsPage() {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold text-[#F3F5F7]">Firms</h1>
      <p className="text-sm text-[#C9C2D6]">Optional packs. Desk works without them.</p>
      <Link href="/dashboard/firms/e8" className="block text-[#7FE7DC] hover:underline">
        E8 Markets →
      </Link>
      <Link href="/dashboard/arsenal" className="block text-[#9AA3B2] hover:underline">
        Add firm / request Arsenal →
      </Link>
    </div>
  );
}
