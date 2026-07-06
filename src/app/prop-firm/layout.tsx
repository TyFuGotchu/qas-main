import Link from "next/link";
import { PublicPageShell } from "@/components/layout/PublicPageShell";

export default function PropFirmLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <PublicPageShell
      footer={
        <footer className="qs-footer-glass px-4 py-8 text-center">
          <p className="font-mono text-xs text-slate-600">
            <Link href="/prop-firm" className="text-cyan-accent hover:underline">
              Prop Firm Hub
            </Link>
            {" · "}
            <Link
              href="/guides/pillar/ultimate-7-day-prop-firm-playbook"
              className="text-cyan-accent hover:underline"
            >
              7-Day Playbook
            </Link>
            {" · "}
            <Link
              href="/guides/pillar/mathematical-prop-firm-model"
              className="text-cyan-accent hover:underline"
            >
              Math Model
            </Link>
          </p>
        </footer>
      }
    >
      {children}
    </PublicPageShell>
  );
}