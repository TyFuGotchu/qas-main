import { getLessonVisual, type LessonVisualConfig } from "@/lib/academy/visual-registry";
import { CandlestickDiagram } from "@/components/academy/visuals/CandlestickDiagram";
import { ChartDiagram } from "@/components/academy/visuals/ChartDiagram";
import { GlassPanel } from "@/components/ui/GlassPanel";

interface LessonVisualProps {
  categoryId: string;
  lessonId: string;
  title?: string;
}

function VisualContent({ config }: { config: LessonVisualConfig }) {
  switch (config.kind) {
    case "candle":
      return <CandlestickDiagram pattern={config.pattern} />;
    case "chart":
      return <ChartDiagram kind="chart" variant={config.variant} />;
    case "structure":
      return <ChartDiagram kind="structure" variant={config.variant} />;
    case "fib":
      return <ChartDiagram kind="fib" variant={config.variant} />;
    case "style":
      return <ChartDiagram kind="style" variant={config.variant} />;
  }
}

export function LessonVisual({ categoryId, lessonId, title }: LessonVisualProps) {
  const config = getLessonVisual(categoryId, lessonId);

  return (
    <GlassPanel className="border-cyan-accent/20 p-4 sm:p-5">
      <p className="mb-3 font-mono text-[10px] uppercase tracking-widest text-cyan-accent">
        Visual guide{title ? ` · ${title}` : ""}
      </p>
      <VisualContent config={config} />
    </GlassPanel>
  );
}

export function LessonVisualBySlug({ slug, title }: { slug: string; title?: string }) {
  const prefix = [
    "chart-reading",
    "market-structure",
    "trading-styles",
    "candlesticks",
    "fibonacci",
  ].find((c) => slug.startsWith(`${c}-`));

  if (!prefix) return null;
  return (
    <LessonVisual
      categoryId={prefix}
      lessonId={slug.slice(prefix.length + 1)}
      title={title}
    />
  );
}