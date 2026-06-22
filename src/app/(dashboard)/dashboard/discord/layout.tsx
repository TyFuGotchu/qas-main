import { requireDiscordAccess } from "@/lib/access-control";

export default async function DiscordLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireDiscordAccess();
  return <>{children}</>;
}