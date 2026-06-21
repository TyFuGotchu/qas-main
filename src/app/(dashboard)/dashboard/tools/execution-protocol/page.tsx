import { ExecutionProtocol } from "@/components/tools/ExecutionProtocol";
import { ToolPageShell } from "@/components/tools/ToolPageShell";
import { getToolBySlug } from "@/lib/tools-registry";

export default function ExecutionProtocolPage() {
  const tool = getToolBySlug("execution-protocol")!;
  return (
    <ToolPageShell tool={tool}>
      <ExecutionProtocol />
    </ToolPageShell>
  );
}