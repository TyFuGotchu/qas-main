import { PublicPageShell } from "@/components/layout/PublicPageShell";

export default function EdgeRadarGuidesLayout({ children }: { children: React.ReactNode }) {
  return <PublicPageShell mainClassName="max-w-4xl">{children}</PublicPageShell>;
}