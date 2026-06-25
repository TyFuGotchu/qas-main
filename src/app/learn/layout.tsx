import Link from "next/link";
import { PublicNav } from "@/components/layout/PublicNav";

export default function LearnLayout({
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
          <Link href="/learn" className="text-cyan-accent hover:underline">
            All Lesson Guides
          </Link>
          {" · "}
          <Link href="/lessons" className="text-cyan-accent hover:underline">
            Lesson Center
          </Link>
          {" · "}
          <Link href="/solutions" className="text-cyan-accent hover:underline">
            Trading Tools
          </Link>
          {" · "}
          <Link href="/support" className="text-cyan-accent hover:underline">
            Support
          </Link>
          {" · "}
          <Link href="/faq" className="text-cyan-accent hover:underline">
            FAQ
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