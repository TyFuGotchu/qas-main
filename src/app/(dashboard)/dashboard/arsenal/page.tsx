import Link from "next/link";
import { ArsenalRequestForm } from "@/components/arsenal/ArsenalRequestForm";

export default function DashboardArsenalPage() {
  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <h1 className="text-2xl font-semibold text-[#F3F5F7]">Arsenal</h1>
      <p className="text-sm text-[#C9C2D6]">
        Rule packs for firms. Quote-based.{" "}
        <Link href="/arsenal" className="text-[#7FE7DC] hover:underline">
          Public catalog
        </Link>
      </p>
      <ArsenalRequestForm />
    </div>
  );
}
