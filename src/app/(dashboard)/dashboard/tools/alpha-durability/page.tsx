import { AlphaDurabilityEngine } from "@/components/tools/AlphaDurabilityEngine";
import { ToolPageShell } from "@/components/tools/ToolPageShell";
import { getToolBySlug } from "@/lib/tools-registry";

export default function AlphaDurabilityPage() {
  const tool = getToolBySlug("alpha-durability")!;
  return (
    <ToolPageShell tool={tool}>
      <AlphaDurabilityEngine />
    </ToolPageShell>
  );
}