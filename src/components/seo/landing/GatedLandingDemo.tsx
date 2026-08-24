import { getFreshSession } from "@/lib/access-control";
import { AccountRequiredPanel } from "@/components/auth/AccountRequiredPanel";
import { LandingDemoWidget } from "@/components/seo/landing/LandingDemoWidget";
import type { LandingDemoType } from "@/lib/seo/landing-pages";

export async function GatedLandingDemo({
  demo,
  marketName,
  returnTo,
}: {
  demo: LandingDemoType;
  marketName?: string;
  returnTo?: string;
}) {
  const user = await getFreshSession();

  if (!user) {
    return <AccountRequiredPanel title="this demo" returnTo={returnTo} />;
  }

  return <LandingDemoWidget demo={demo} marketName={marketName} />;
}
