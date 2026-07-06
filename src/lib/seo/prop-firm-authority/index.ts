export {
  PILLAR_PLAYBOOK_SLUG,
  PILLAR_MATH_SLUG,
  PILLAR_PATHS,
  AUTHORITY_PROP_FIRMS,
  ACCOUNT_SIZES,
  CLUSTER_TOPICS,
} from "@/lib/seo/prop-firm-authority/data";

export {
  PROP_FIRM_CLUSTER_PAGES,
  PROP_FIRM_CLUSTER_COUNT,
  getClusterPageBySlug,
  getClustersByFirm,
} from "@/lib/seo/prop-firm-authority/cluster-builder";

export { PILLAR_PLAYBOOK_PAGE } from "@/lib/seo/prop-firm-authority/pillar-playbook";
export { PILLAR_MATH_PAGE } from "@/lib/seo/prop-firm-authority/pillar-math";

import { PILLAR_PLAYBOOK_PAGE } from "@/lib/seo/prop-firm-authority/pillar-playbook";
import { PILLAR_MATH_PAGE } from "@/lib/seo/prop-firm-authority/pillar-math";
import type { PillarPage } from "@/lib/seo/prop-firm-authority/types";

export const PILLAR_PAGES: PillarPage[] = [PILLAR_PLAYBOOK_PAGE, PILLAR_MATH_PAGE];

export function getPillarBySlug(slug: string): PillarPage | undefined {
  return PILLAR_PAGES.find((p) => p.slug === slug);
}