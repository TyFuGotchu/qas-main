import { AtrPipRangeCalculator } from "@/components/tools/local/AtrPipRangeCalculator";
import { ToolPageShell } from "@/components/tools/ToolPageShell";
import { getToolBySlug } from "@/lib/tools-registry";

export default function AtrPipRangePage() {
  const tool = getToolBySlug("atr-pip-range")!;
  return (
    <ToolPageShell tool={tool}>
      <AtrPipRangeCalculator />
    </ToolPageShell>
  );
}