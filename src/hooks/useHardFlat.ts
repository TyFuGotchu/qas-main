"use client";

import { useEffect, useState } from "react";
import {
  getHardFlatView,
  hydrateHardFlat,
  startHardFlatEngine,
  subscribeHardFlat,
  type HardFlatView,
} from "@/lib/e8-hard-flat";

export function useHardFlat(options: { watch?: boolean } = {}) {
  const { watch = false } = options;
  const [view, setView] = useState<HardFlatView>(() => getHardFlatView());

  useEffect(() => {
    hydrateHardFlat();
    setView(getHardFlatView());
    return subscribeHardFlat(() => setView(getHardFlatView()));
  }, []);

  useEffect(() => {
    if (!watch) return;
    return startHardFlatEngine();
  }, [watch]);

  return view;
}
