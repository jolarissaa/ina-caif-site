"use client";

import { useCallback, useEffect, useState } from "react";
import { productScopedKey } from "./productStorage";
import type { EthicsAssessmentStatus } from "./ethicsStandards";

// Per-item self-assessment (Ya/Tidak/Tidak Berlaku + catatan singkat)
// against the official KEPPKN 2021 ethics standards and AI-specific ethics
// aspects (see lib/ethicsStandards.ts). Mirrors useEvidenceLinks.ts's
// shape and storage pattern exactly, keyed by each standard's own id
// rather than a checklist item id, and scoped per product (see
// useProducts.ts) so product A's self-assessment never leaks into product
// B's export.
const STORAGE_KEY = "ina-caif-ethics-assessment-v1";

export type EthicsAssessmentValue = {
  status: EthicsAssessmentStatus;
  note: string;
};

type AssessmentMap = Record<string, EthicsAssessmentValue>;

const EMPTY_VALUE: EthicsAssessmentValue = { status: null, note: "" };

export function useEthicsAssessment(productId: string = "default") {
  const [map, setMap] = useState<AssessmentMap>({});
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(false);
    try {
      const raw = window.localStorage.getItem(productScopedKey(STORAGE_KEY, productId));
      setMap(raw ? (JSON.parse(raw) as AssessmentMap) : {});
    } catch {
      // Ignore malformed or inaccessible storage; defaults are used instead.
      setMap({});
    } finally {
      setHydrated(true);
    }
  }, [productId]);

  const getValue = useCallback((id: string) => map[id] ?? EMPTY_VALUE, [map]);

  const setValue = useCallback(
    (id: string, value: EthicsAssessmentValue) => {
      setMap((current) => {
        const next = { ...current, [id]: value };
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

  return { getValue, setValue, map, hydrated };
}
