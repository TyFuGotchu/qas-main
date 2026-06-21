import { PropSurvivalEngine } from "@/components/tools/PropSurvivalEngine";
import { ToolPageShell } from "@/components/tools/ToolPageShell";
import { getToolBySlug } from "@/lib/tools-registry";

export default function PropSurvivalPage() {
  const tool = getToolBySlug("prop-survival")!;
  return (
    <ToolPageShell tool={tool}>
      <PropSurvivalEngine />
    </ToolPageShell>
  );
}