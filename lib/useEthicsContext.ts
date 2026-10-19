"use client";

import { useCallback, useEffect, useState } from "react";
import { productScopedKey } from "./productStorage";

// Short, structured fields that supplement (never replace) the official
// KEPKN ethics protocol submission. Kept intentionally brief: this is meant
// to give a research ethics committee quick orientation before they open
// the full protocol, not to duplicate it. Scoped per product (see
// useProducts.ts), so exporting product A's summary never pulls in
// product B's title/institution/etc.

export type EthicsContext = {
  judulProyek: string;
  institusi: string;
  namaPenelitiUtama: string;
  lokasi: string;
  perkiraanWaktu: string;
  ringkasan: string;
};

const STORAGE_KEY = "ina-caif-ethics-context-v1";

export const RINGKASAN_MAX_LENGTH = 400;

const EMPTY_CONTEXT: EthicsContext = {
  judulProyek: "",
  institusi: "",
  namaPenelitiUtama: "",
  lokasi: "",
  perkiraanWaktu: "",
  ringkasan: "",
};

export function useEthicsContext(productId: string = "default") {
  const [context, setContext] = useState<EthicsContext>(EMPTY_CONTEXT);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(false);
    try {
      const raw = window.localStorage.getItem(productScopedKey(STORAGE_KEY, productId));
      setContext(raw ? { ...EMPTY_CONTEXT, ...JSON.parse(raw) } : EMPTY_CONTEXT);
    } catch {
      // Ignore malformed or inaccessible storage.
      setContext(EMPTY_CONTEXT);
    } finally {
      setHydrated(true);
    }
  }, [productId]);

  const updateField = useCallback(
    (field: keyof EthicsContext, value: string) => {
      setContext((current) => {
        const next = { ...current, [field]: value };
        try {
          window.localStorage.setItem(productScopedKey(STORAGE_KEY, productId), JSON.stringify(next));
        } catch {
          // Ignore.
        }
        return next;
      });
    },
    [productId]
  );

  return { context, updateField, hydrated };
}
