export const FORUM_TOPICS = [
  { id: "gold", label: "XAUUSD / Gold" },
  { id: "silver", label: "XAGUSD / Silver" },
  { id: "forex", label: "Forex Pairs" },
  { id: "indices", label: "Indices (NAS100, US30)" },
  { id: "crypto", label: "Crypto" },
  { id: "strategy", label: "Strategy & Setups" },
  { id: "prop-firm", label: "Prop Firm Challenges" },
  { id: "sessions", label: "Session Recaps" },
  { id: "education", label: "Chart & Pattern Help" },
  { id: "general", label: "General Chat" },
] as const;

export type ForumTopicId = (typeof FORUM_TOPICS)[number]["id"];

export function getTopicLabel(topicId: string): string {
  return FORUM_TOPICS.find((t) => t.id === topicId)?.label ?? topicId;
}