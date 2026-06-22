import { enforceAuthenticatedDashboardAccess } from "@/lib/access-control";

export default async function ToolsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await enforceAuthenticatedDashboardAccess();
  return <>{children}</>;
}