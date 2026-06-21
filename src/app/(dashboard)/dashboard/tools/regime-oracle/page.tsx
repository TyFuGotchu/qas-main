import { RegimeOracle } from "@/components/tools/RegimeOracle";
import { ToolPageShell } from "@/components/tools/ToolPageShell";
import { getToolBySlug } from "@/lib/tools-registry";

export default function RegimeOraclePage() {
  const tool = getToolBySlug("regime-oracle")!;
  return (
    <ToolPageShell tool={tool}>
      <RegimeOracle />
    </ToolPageShell>
  );
}