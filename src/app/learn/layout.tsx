import Link from "next/link";
import { PublicPageShell } from "@/components/layout/PublicPageShell";

export default function LearnLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <PublicPageShell
      footer={
        <footer className="qs-footer-glass px-4 py-8 text-center">
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
      }
    >
      {children}
    </PublicPageShell>
  );
}