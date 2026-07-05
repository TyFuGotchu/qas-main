import { CompoundingMatrix } from "@/components/tools/local/CompoundingMatrix";
import { ToolPageShell } from "@/components/tools/ToolPageShell";
import { getToolBySlug } from "@/lib/tools-registry";

export default function CompoundingMatrixPage() {
  const tool = getToolBySlug("compounding-matrix")!;
  return (
    <ToolPageShell tool={tool}>
      <CompoundingMatrix />
    </ToolPageShell>
  );
}