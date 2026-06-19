import { requirePremiumAccess } from "@/lib/access-control";

export default async function DiscordLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requirePremiumAccess();
  return <>{children}</>;
}