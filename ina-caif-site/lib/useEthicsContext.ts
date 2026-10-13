"use client";

import { useCallback, useEffect, useState } from "react";

// Short, structured fields that supplement (never replace) the official
// KEPKN ethics protocol submission. Kept intentionally brief: this is meant
// to give a research ethics committee quick orientation before they open
// the full protocol, not to duplicate it.

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

export function useEthicsContext() {
  const [context, setContext] = useState<EthicsContext>(EMPTY_CONTEXT);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        setContext((current) => ({ ...current, ...JSON.parse(raw) }));
      }
    } catch {
      // Ignore malformed or inaccessible storage.
    } finally {
      setHydrated(true);
    }
  }, []);

  const updateField = useCallback((field: keyof EthicsContext, value: string) => {
    setContext((current) => {
      const next = { ...current, [field]: value };
      try {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch {
        // Ignore.
      }
      return next;
    });
  }, []);

  return { context, updateField, hydrated };
}
