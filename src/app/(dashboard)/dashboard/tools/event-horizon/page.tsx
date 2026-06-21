import { EventHorizon } from "@/components/tools/EventHorizon";
import { ToolPageShell } from "@/components/tools/ToolPageShell";
import { getToolBySlug } from "@/lib/tools-registry";

export default function EventHorizonPage() {
  const tool = getToolBySlug("event-horizon")!;
  return (
    <ToolPageShell tool={tool}>
      <EventHorizon />
    </ToolPageShell>
  );
}