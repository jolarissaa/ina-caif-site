"use client";

import { useCallback, useEffect, useState } from "react";
import { productScopedKey } from "./productStorage";

// Tracks which individual breakdown sub-steps have been checked off,
// separately from the parent item's own status dropdown. A compound item
// like "Susun Dokumen V&V dengan lima komponen" isn't one atomic action, so
// its own checkbox doesn't mean much — the real checkable work happens at
// the sub-step level (each concrete component), tracked here per device via
// localStorage, same pattern as useChecklistState. Scoped per product (see
// useProducts.ts).

const STORAGE_KEY = "ina-caif-breakdown-v1";

type StepMap = Record<string, boolean>;

function keyFor(itemId: string, stepIndex: number) {
  return `${itemId}__${stepIndex}`;
}

export function useBreakdownState(productId: string = "default") {
  const [stepMap, setStepMap] = useState<StepMap>({});
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(false);
    try {
      const raw = window.localStorage.getItem(productScopedKey(STORAGE_KEY, productId));
      setStepMap(raw ? (JSON.parse(raw) as StepMap) : {});
    } catch {
      // Ignore malformed or inaccessible storage; defaults are used instead.
      setStepMap({});
    } finally {
      setHydrated(true);
    }
  }, [productId]);

  const isChecked = useCallback(
    (itemId: string, stepIndex: number) => Boolean(stepMap[keyFor(itemId, stepIndex)]),
    [stepMap]
  );

  const toggleStep = useCallback(
    (itemId: string, stepIndex: number) => {
      setStepMap((current) => {
        const k = keyFor(itemId, stepIndex);
        const next = { ...current, [k]: !current[k] };
        try {
          window.localStorage.setItem(productScopedKey(STORAGE_KEY, productId), JSON.stringify(next));
        } catch {
          // If storage is unavailable, state still updates for this session.
        }
        return next;
      });
    },
    [productId]
  );

  return { isChecked, toggleStep, hydrated };
}
