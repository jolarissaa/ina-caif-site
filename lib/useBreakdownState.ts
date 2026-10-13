"use client";

import { useCallback, useEffect, useState } from "react";

// Tracks which individual breakdown sub-steps have been checked off,
// separately from the parent item's own status dropdown. A compound item
// like "Susun Dokumen V&V dengan lima komponen" isn't one atomic action, so
// its own checkbox doesn't mean much — the real checkable work happens at
// the sub-step level (each concrete component), tracked here per device via
// localStorage, same pattern as useChecklistState.

const STORAGE_KEY = "ina-caif-breakdown-v1";

type StepMap = Record<string, boolean>;

function keyFor(itemId: string, stepIndex: number) {
  return `${itemId}__${stepIndex}`;
}

export function useBreakdownState() {
  const [stepMap, setStepMap] = useState<StepMap>({});
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        setStepMap(JSON.parse(raw) as StepMap);
      }
    } catch {
      // Ignore malformed or inaccessible storage; defaults are used instead.
    } finally {
      setHydrated(true);
    }
  }, []);

  const isChecked = useCallback(
    (itemId: string, stepIndex: number) => Boolean(stepMap[keyFor(itemId, stepIndex)]),
    [stepMap]
  );

  const toggleStep = useCallback((itemId: string, stepIndex: number) => {
    setStepMap((current) => {
      const k = keyFor(itemId, stepIndex);
      const next = { ...current, [k]: !current[k] };
      try {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch {
        // If storage is unavailable, state still updates for this session.
      }
      return next;
    });
  }, []);

  return { isChecked, toggleStep, hydrated };
}
