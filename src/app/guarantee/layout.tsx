import Link from "next/link";
import { PublicPageShell } from "@/components/layout/PublicPageShell";

export default function GuaranteeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <PublicPageShell
      footer={
        <footer className="qs-footer-glass px-4 py-8 text-center">
          <p className="font-mono text-xs text-slate-600">
            <Link href="/guarantee" className="text-cyan-accent hover:underline">
              Money-Back Guarantee
            </Link>
            {" · "}
            <Link href="/launch" className="text-cyan-accent hover:underline">
              Launch Offer
            </Link>
            {" · "}
            <Link href="/support" className="text-cyan-accent hover:underline">
              Support
            </Link>
          </p>
        </footer>
      }
    >
      {children}
    </PublicPageShell>
  );
}