import Image from "next/image";
import { ImageIcon, Sparkles } from "lucide-react";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { getLessonStaticImage } from "@/lib/academy/static-visual-registry";
import { cn } from "@/lib/utils";

interface LessonStaticVisualProps {
  categoryId: string;
  lessonId: string;
  title?: string;
}

const ASPECT_CLASS: Record<string, string> = {
  "16/9": "aspect-video",
  "4/3": "aspect-[4/3]",
  "1/1": "aspect-square",
  "3/2": "aspect-[3/2]",
};

function StaticVisualSkeleton({
  alt,
  aspectRatio,
  caption,
}: {
  alt: string;
  aspectRatio: string;
  caption?: string;
}) {
  const aspectClass = ASPECT_CLASS[aspectRatio] ?? "aspect-video";

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-lg border border-slate-800/80",
        aspectClass
      )}
      role="img"
      aria-label={alt}
    >
      <div
        className="absolute inset-0 bg-gradient-to-br from-slate-900 via-zinc-900 to-slate-950"
        aria-hidden
      />
      <div
        className="absolute inset-0 opacity-40"
        style={{
          backgroundImage:
            "radial-gradient(circle at 20% 20%, rgba(0,229,255,0.12), transparent 45%), radial-gradient(circle at 80% 70%, rgba(148,163,184,0.1), transparent 40%)",
        }}
        aria-hidden
      />
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 p-6 text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-slate-700/60 bg-slate-900/70">
          <ImageIcon className="h-6 w-6 text-slate-500" />
        </div>
        <p className="max-w-xs font-mono text-[10px] uppercase tracking-widest text-slate-500">
          Static visual loading slot
        </p>
        {caption && (
          <p className="max-w-sm text-xs text-slate-600">{caption}</p>
        )}
      </div>
    </div>
  );
}

export function LessonStaticVisual({
  categoryId,
  lessonId,
  title,
}: LessonStaticVisualProps) {
  const config = getLessonStaticImage(categoryId, lessonId);
  if (!config) return null;

  const aspectRatio = config.aspectRatio ?? "16/9";
  const aspectClass = ASPECT_CLASS[aspectRatio] ?? "aspect-video";

  return (
    <GlassPanel className="border-slate-800/60 p-4 sm:p-5">
      <div className="mb-3 flex items-center gap-2">
        <Sparkles className="h-3.5 w-3.5 text-cyan-accent" />
        <p className="font-mono text-[10px] uppercase tracking-widest text-slate-500">
          Reference visual{title ? ` · ${title}` : ""}
        </p>
      </div>

      {config.src ? (
        <div
          className={cn(
            "relative overflow-hidden rounded-lg border border-slate-800/80 bg-slate-950",
            aspectClass
          )}
        >
          <Image
            src={config.src}
            alt={config.alt}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 768px"
            priority={false}
          />
        </div>
      ) : (
        <StaticVisualSkeleton
          alt={config.alt}
          aspectRatio={aspectRatio}
          caption={config.caption}
        />
      )}

      {config.caption && config.src && (
        <p className="mt-3 font-mono text-xs text-slate-500">{config.caption}</p>
      )}
    </GlassPanel>
  );
}

export function LessonStaticVisualBySlug({
  slug,
  title,
}: {
  slug: string;
  title?: string;
}) {
  const prefix = [
    "chart-reading",
    "market-structure",
    "trading-styles",
    "candlesticks",
    "fibonacci",
  ].find((c) => slug.startsWith(`${c}-`));

  if (!prefix) return null;

  return (
    <LessonStaticVisual
      categoryId={prefix}
      lessonId={slug.slice(prefix.length + 1)}
      title={title}
    />
  );
}