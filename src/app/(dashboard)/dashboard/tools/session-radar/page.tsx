import { SessionVolatilityRadar } from "@/components/tools/SessionVolatilityRadar";
import { ToolPageShell } from "@/components/tools/ToolPageShell";
import { getToolBySlug } from "@/lib/tools-registry";

export default function SessionRadarPage() {
  const tool = getToolBySlug("session-radar")!;
  return (
    <ToolPageShell tool={tool}>
      <SessionVolatilityRadar />
    </ToolPageShell>
  );
}