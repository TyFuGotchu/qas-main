import { DecouplingHeatmap } from "@/components/tools/DecouplingHeatmap";
import { ToolPageShell } from "@/components/tools/ToolPageShell";
import { getToolBySlug } from "@/lib/tools-registry";

export default function DecouplingHeatmapPage() {
  const tool = getToolBySlug("decoupling-heatmap")!;
  return (
    <ToolPageShell tool={tool}>
      <DecouplingHeatmap />
    </ToolPageShell>
  );
}