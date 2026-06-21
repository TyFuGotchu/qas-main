import { requirePremiumAccess } from "@/lib/access-control";
import { MarketDataProvider } from "@/providers/MarketDataProvider";

export default async function ToolsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requirePremiumAccess();
  return (
    <MarketDataProvider options={{ includeCorrelation: true }}>
      {children}
    </MarketDataProvider>
  );
}