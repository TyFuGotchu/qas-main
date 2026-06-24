import Link from "next/link";
import { PublicNav } from "@/components/layout/PublicNav";

export default function OffersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-obsidian-950">
      <PublicNav />
      <main className="mx-auto max-w-4xl overflow-x-hidden px-4 py-8 pt-14 sm:px-6 sm:py-10 sm:pt-16">
        {children}
      </main>
      <footer className="border-t border-slate-800/60 px-4 py-8 text-center">
        <p className="font-mono text-xs text-slate-600">
          <Link href="/offers" className="text-cyan-accent hover:underline">
            All Offers
          </Link>
          {" · "}
          <Link href="/offers/first100-premium" className="text-cyan-accent hover:underline">
            FIRST100 Deal
          </Link>
          {" · "}
          <Link href="/solutions" className="text-cyan-accent hover:underline">
            Free Tools
          </Link>
          {" · "}
          <Link href="/register" className="text-cyan-accent hover:underline">
            Get Access
          </Link>
        </p>
      </footer>
    </div>
  );
}