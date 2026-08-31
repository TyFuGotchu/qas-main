"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FOUNDER, FOUNDER_SOCIAL_LINKS } from "@/lib/founder-social";
import {
  E8_COMPLIANCE,
  E8_DASHBOARD_PATH,
  E8_PUBLIC_PATH,
} from "@/lib/e8-partner";
import { useSession } from "@/providers/SessionProvider";

const PRODUCT_LINKS = [
  { href: E8_PUBLIC_PATH, label: "E8 Execution Center" },
  { href: "/dashboard/live-growth", label: "Live Growth Terminal" },
  { href: "/lessons", label: "Chart Academy" },
  { href: "/launch", label: "7-Day Playbook" },
  { href: "/quant-protocol", label: "Quant Protocol" },
  { href: "/dashboard/journal", label: "Journal" },
];

export function SiteFooter() {
  const year = new Date().getFullYear();
  const { user, setUser } = useSession();
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    setUser(null);
    router.push("/login");
  }

  return (
    <footer className="mt-auto border-t border-white/[0.06] bg-[#07080c]">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 sm:px-6 md:grid-cols-2 lg:grid-cols-5 lg:px-8">
        <FooterColumn title="Product">
          {PRODUCT_LINKS.map((link) => (
            <FooterLink key={link.href} href={link.href}>
              {link.label}
            </FooterLink>
          ))}
        </FooterColumn>

        <FooterColumn title="Account">
          <FooterLink href="/dashboard">Dashboard</FooterLink>
          <FooterLink href="/dashboard/upgrade">Upgrade Tier</FooterLink>
          <FooterLink href="/support">Support</FooterLink>
          {user ? (
            <button
              type="button"
              onClick={() => void handleLogout()}
              className="block font-mono text-xs text-slate-400 hover:text-gold-soft"
            >
              Logout
            </button>
          ) : (
            <FooterLink href="/login">Login</FooterLink>
          )}
        </FooterColumn>

        <FooterColumn title="Partner">
          <FooterLink href={E8_PUBLIC_PATH}>E8 Markets Execution Center</FooterLink>
          <FooterLink href={user ? E8_DASHBOARD_PATH : E8_PUBLIC_PATH}>
            Direct Signup
          </FooterLink>
        </FooterColumn>

        <FooterColumn title="Founder">
          <p className="font-mono text-xs text-slate-300">Ty</p>
          {FOUNDER_SOCIAL_LINKS.map((link) => (
            <a
              key={link.id}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer me"
              className="block font-mono text-xs text-slate-400 hover:text-gold-soft"
            >
              {link.label}
            </a>
          ))}
        </FooterColumn>

        <div>
          <p className="font-mono text-[10px] font-semibold uppercase tracking-widest text-slate-500">
            Legal / notes
          </p>
          <ul className="mt-3 space-y-1.5 text-[11px] leading-relaxed text-slate-500">
            <li>{E8_COMPLIANCE.educational}</li>
            <li>Trading and prop evaluations are high risk.</li>
            <li>You can lose money or the evaluation fee.</li>
            <li>{E8_COMPLIANCE.noGuarantee}</li>
            <li>Official E8 rules are set by E8 Markets.</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/[0.05] px-4 py-4 text-center">
        <p className="font-mono text-[10px] text-slate-600">
          © {year} Quicksilver Algo Systems · Founded by {FOUNDER.firstName} · quicksilveralgo.com
        </p>
      </div>
    </footer>
  );
}

function FooterColumn({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <div>
      <p className="font-mono text-[10px] font-semibold uppercase tracking-widest text-slate-500">
        {title}
      </p>
      <div className="mt-3 space-y-2">{children}</div>
    </div>
  );
}

function FooterLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Link href={href} className="block font-mono text-xs text-slate-400 hover:text-gold-soft">
      {children}
    </Link>
  );
}
