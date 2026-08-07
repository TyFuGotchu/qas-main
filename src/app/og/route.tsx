import { NextRequest } from "next/server";
import {
  createOgImageResponse,
  type OgImageVariant,
} from "@/lib/seo/og-image-response";

export const runtime = "edge";

const VARIANTS = new Set<OgImageVariant>([
  "default",
  "quant-protocol",
  "launch",
  "stack",
]);

/**
 * Stable share-card image for X/social:
 * https://quicksilveralgo.com/og
 * https://quicksilveralgo.com/og?v=quant-protocol
 */
export async function GET(request: NextRequest) {
  const v = request.nextUrl.searchParams.get("v") ?? "default";
  const variant = VARIANTS.has(v as OgImageVariant)
    ? (v as OgImageVariant)
    : "default";
  return createOgImageResponse(variant);
}
