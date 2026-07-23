import { PartnerRecommendationFlow } from "@/components/broker/PartnerRecommendationFlow";

/**
 * Dashboard / homepage partner block.
 * Ask-first routing (manual vs bots), then active verified partners only.
 */
export function RecommendedBrokerCard() {
  return <PartnerRecommendationFlow />;
}
