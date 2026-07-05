import { ExpectancyValidator } from "@/components/tools/local/ExpectancyValidator";
import { ToolPageShell } from "@/components/tools/ToolPageShell";
import { getToolBySlug } from "@/lib/tools-registry";

export default function ExpectancyValidatorPage() {
  const tool = getToolBySlug("expectancy-validator")!;
  return (
    <ToolPageShell tool={tool}>
      <ExpectancyValidator />
    </ToolPageShell>
  );
}