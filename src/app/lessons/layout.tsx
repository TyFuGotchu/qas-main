import Link from "next/link";
import { PublicNav } from "@/components/layout/PublicNav";

export default function LessonsLayout({
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
          <Link href="/lessons" className="text-cyan-accent hover:underline">
            Lesson Center
          </Link>
          {" · "}
          <Link href="/guides" className="text-cyan-accent hover:underline">
            Charting Guides
          </Link>
          {" · "}
          <Link href="/register" className="text-cyan-accent hover:underline">
            Create Free Account
          </Link>
        </p>
      </footer>
    </div>
  );
}