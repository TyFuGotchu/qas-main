import { RiskMatrix } from "@/components/tools/RiskMatrix";
import { ToolPageShell } from "@/components/tools/ToolPageShell";
import { getToolBySlug } from "@/lib/tools-registry";

export default function RiskMatrixPage() {
  const tool = getToolBySlug("risk-matrix")!;
  return (
    <ToolPageShell tool={tool}>
      <RiskMatrix />
    </ToolPageShell>
  );
}