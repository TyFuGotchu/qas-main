import { MonteCarloSimulator } from "@/components/tools/MonteCarloSimulator";
import { ToolPageShell } from "@/components/tools/ToolPageShell";
import { getToolBySlug } from "@/lib/tools-registry";

export default function MonteCarloPage() {
  const tool = getToolBySlug("monte-carlo")!;
  return (
    <ToolPageShell tool={tool}>
      <MonteCarloSimulator />
    </ToolPageShell>
  );
}