import { createOgImageResponse, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/seo/og-image-response";

export const runtime = "edge";
export const alt = "7-Day Prop Firm Playbook — Quicksilver Algo";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function Image() {
  return createOgImageResponse("launch");
}
