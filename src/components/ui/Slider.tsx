"use client";

import * as SliderPrimitive from "@radix-ui/react-slider";
import { cn } from "@/lib/utils";

interface SliderProps {
  value: number[];
  onValueChange: (value: number[]) => void;
  min?: number;
  max?: number;
  step?: number;
  className?: string;
  disabled?: boolean;
}

export function Slider({
  value,
  onValueChange,
  min = 0,
  max = 100,
  step = 1,
  className,
  disabled,
}: SliderProps) {
  return (
    <SliderPrimitive.Root
      value={value}
      onValueChange={onValueChange}
      min={min}
      max={max}
      step={step}
      disabled={disabled}
      className={cn(
        "relative flex w-full touch-none select-none items-center",
        className
      )}
    >
      <SliderPrimitive.Track className="relative h-1.5 w-full grow overflow-hidden rounded-full bg-slate-800">
        <SliderPrimitive.Range className="absolute h-full bg-cyan-500/60" />
      </SliderPrimitive.Track>
      <SliderPrimitive.Thumb className="block h-4 w-4 rounded-full border border-cyan-400/50 bg-cyan-terminal shadow-[0_0_12px_rgba(102,252,241,0.35)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500/40 disabled:pointer-events-none disabled:opacity-50" />
    </SliderPrimitive.Root>
  );
}