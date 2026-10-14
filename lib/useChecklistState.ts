"use client";

import { useCallback, useEffect, useState } from "react";
import { ChecklistStatus, checklistItems } from "./checklistData";
import { productScopedKey } from "./productStorage";

// Persists checklist status per device using localStorage. No account or
// backend is involved, matching the decision to keep progress local to the
// browser the user is working in. Scoped per product (see useProducts.ts)
// so tracking two different AI products never mixes their progress.

const STORAGE_KEY = "ina-caif-checklist-v1";

type StatusMap = Record<string, ChecklistStatus>;

function defaultStatusMap(): StatusMap {
  const map: StatusMap = {};
  for (const item of checklistItems) {
    map[item.id] = item.defaultStatus;
  }
  return map;
}

export function useChecklistState(productId: string = "default") {
  const [statusMap, setStatusMap] = useState<StatusMap>(defaultStatusMap);
  const [hydrated, setHydrated] = useState(false);

  // Re-reads from storage whenever the active product changes, instead of
  // only on first mount, so switching products on /produk actually swaps
  // which progress is shown rather than carrying the previous product's
  // state over.
  useEffect(() => {
    setHydrated(false);
    try {
      const raw = window.localStorage.getItem(productScopedKey(STORAGE_KEY, productId));
      if (raw) {
        const parsed = JSON.parse(raw) as StatusMap;
        setStatusMap({ ...defaultStatusMap(), ...parsed });
      } else {
        setStatusMap(defaultStatusMap());
      }
    } catch {
      // Ignore malformed or inaccessible storage; defaults are used instead.
      setStatusMap(defaultStatusMap());
    } finally {
      setHydrated(true);
    }
  }, [productId]);

  const setStatus = useCallback(
    (id: string, status: ChecklistStatus) => {
      setStatusMap((current) => {
        const next = { ...current, [id]: status };
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

  const resetAll = useCallback(() => {
    const defaults = defaultStatusMap();
    setStatusMap(defaults);
    try {
      window.localStorage.setItem(productScopedKey(STORAGE_KEY, productId), JSON.stringify(defaults));
    } catch {
      // Ignore.
    }
  }, [productId]);

  return { statusMap, setStatus, resetAll, hydrated };
}
