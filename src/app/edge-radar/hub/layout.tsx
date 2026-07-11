import { PublicPageShell } from "@/components/layout/PublicPageShell";

export default function EdgeRadarHubLayout({ children }: { children: React.ReactNode }) {
  return <PublicPageShell mainClassName="max-w-5xl">{children}</PublicPageShell>;
}