export interface RssItem {
  title: string;
  description: string;
  link: string;
  guid: string;
  pubDate?: string;
}

function decodeXml(text: string): string {
  return text
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function extractTag(block: string, tag: string): string {
  const match = block.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)</${tag}>`, "i"));
  return match ? decodeXml(match[1]) : "";
}

export function parseRssFeed(xml: string): RssItem[] {
  const items: RssItem[] = [];
  const itemBlocks = xml.match(/<item[\s\S]*?<\/item>/gi) ?? [];

  for (const block of itemBlocks) {
    const title = extractTag(block, "title");
    if (!title) continue;

    const description =
      extractTag(block, "description") || extractTag(block, "summary") || title;
    const link = extractTag(block, "link");
    const guid = extractTag(block, "guid") || link || title;
    const pubDate = extractTag(block, "pubDate") || extractTag(block, "updated");

    items.push({ title, description, link, guid, pubDate });
  }

  return items.slice(0, 15);
}

export function parseRssPubDate(pubDate?: string): Date | null {
  if (!pubDate?.trim()) return null;
  const parsed = new Date(pubDate);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}