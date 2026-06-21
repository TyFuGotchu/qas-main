import { EdgeConfluenceEngine } from "@/components/tools/EdgeConfluenceEngine";
import { ToolPageShell } from "@/components/tools/ToolPageShell";
import { getToolBySlug } from "@/lib/tools-registry";

export default function EdgeConfluencePage() {
  const tool = getToolBySlug("edge-confluence")!;
  return (
    <ToolPageShell tool={tool}>
      <EdgeConfluenceEngine />
    </ToolPageShell>
  );
}