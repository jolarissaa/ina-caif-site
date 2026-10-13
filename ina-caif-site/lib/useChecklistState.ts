"use client";

import { useCallback, useEffect, useState } from "react";
import { ChecklistStatus, checklistItems } from "./checklistData";

// Persists checklist status per device using localStorage. No account or
// backend is involved, matching the decision to keep progress local to the
// browser the user is working in.

const STORAGE_KEY = "ina-caif-checklist-v1";

type StatusMap = Record<string, ChecklistStatus>;

function defaultStatusMap(): StatusMap {
  const map: StatusMap = {};
  for (const item of checklistItems) {
    map[item.id] = item.defaultStatus;
  }
  return map;
}

export function useChecklistState() {
  const [statusMap, setStatusMap] = useState<StatusMap>(defaultStatusMap);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as StatusMap;
        setStatusMap((current) => ({ ...current, ...parsed }));
      }
    } catch {
      // Ignore malformed or inaccessible storage; defaults are used instead.
    } finally {
      setHydrated(true);
    }
  }, []);

  const setStatus = useCallback((id: string, status: ChecklistStatus) => {
    setStatusMap((current) => {
      const next = { ...current, [id]: status };
      try {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch {
        // If storage is unavailable, state still updates for this session.
      }
      return next;
    });
  }, []);

  const resetAll = useCallback(() => {
    const defaults = defaultStatusMap();
    setStatusMap(defaults);
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(defaults));
    } catch {
      // Ignore.
    }
  }, []);

  return { statusMap, setStatus, resetAll, hydrated };
}
