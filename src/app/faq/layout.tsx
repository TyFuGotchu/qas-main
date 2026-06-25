import Link from "next/link";
import { PublicNav } from "@/components/layout/PublicNav";

export default function FaqLayout({
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
          <Link href="/faq" className="text-cyan-accent hover:underline">
            FAQ
          </Link>
          {" · "}
          <Link href="/support" className="text-cyan-accent hover:underline">
            Contact Support
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