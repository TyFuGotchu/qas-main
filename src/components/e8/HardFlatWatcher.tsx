"use client";

import { useHardFlat } from "@/hooks/useHardFlat";

export function HardFlatWatcher() {
  useHardFlat({ watch: true });
  return null;
}
