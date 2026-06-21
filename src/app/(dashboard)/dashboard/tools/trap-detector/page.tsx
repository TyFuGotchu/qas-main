import { TrapDetector } from "@/components/tools/TrapDetector";
import { ToolPageShell } from "@/components/tools/ToolPageShell";
import { getToolBySlug } from "@/lib/tools-registry";

export default function TrapDetectorPage() {
  const tool = getToolBySlug("trap-detector")!;
  return (
    <ToolPageShell tool={tool}>
      <TrapDetector />
    </ToolPageShell>
  );
}