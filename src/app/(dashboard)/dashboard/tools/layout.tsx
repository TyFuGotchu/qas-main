import { requirePremiumAccess } from "@/lib/access-control";

export default async function ToolsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requirePremiumAccess();
  return <>{children}</>;
}