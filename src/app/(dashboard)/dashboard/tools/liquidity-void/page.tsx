import { LiquidityVoidMap } from "@/components/tools/LiquidityVoidMap";
import { ToolPageShell } from "@/components/tools/ToolPageShell";
import { getToolBySlug } from "@/lib/tools-registry";

export default function LiquidityVoidPage() {
  const tool = getToolBySlug("liquidity-void")!;
  return (
    <ToolPageShell tool={tool}>
      <LiquidityVoidMap />
    </ToolPageShell>
  );
}