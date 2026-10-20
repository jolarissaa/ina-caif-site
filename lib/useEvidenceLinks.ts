"use client";

import { useCallback, useEffect, useState } from "react";
import { productScopedKey } from "./productStorage";

// A link to the developer's OWN completed evidence for one checklist item
// — e.g. a Google Doc they duplicated from "Simpan Template" and actually
// filled in, or a Drive folder with their supporting files — pasted once
// here and then reused everywhere that item is referenced, instead of
// retyping it. Built specifically for the "Ringkasan untuk Komite Etik"
// export (see app/checklist/cetak/page.tsx): per Jo, repeating the full
// breakdown/checkbox content in that export just confuses an ethics
// reviewer, who really just needs to know what was done and where to find
// the proof. One link per item id, scoped per product (see useProducts.ts)
// so product A's links never leak into product B's export.
const STORAGE_KEY = "ina-caif-evidence-links-v1";

type LinkMap = Record<string, string>;

export function useEvidenceLinks(productId: string = "default") {
  const [linkMap, setLinkMap] = useState<LinkMap>({});
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(false);
    try {
      const raw = window.localStorage.getItem(productScopedKey(STORAGE_KEY, productId));
      setLinkMap(raw ? (JSON.parse(raw) as LinkMap) : {});
    } catch {
      // Ignore malformed or inaccessible storage; defaults are used instead.
      setLinkMap({});
    } finally {
      setHydrated(true);
    }
  }, [productId]);

  const getLink = useCallback((itemId: string) => linkMap[itemId] ?? "", [linkMap]);

  const setLink = useCallback(
    (itemId: string, url: string) => {
      setLinkMap((current) => {
        const next = { ...current, [itemId]: url };
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

  return { getLink, setLink, linkMap, hydrated };
}
