"use client";

import { useCallback, useEffect, useState } from "react";
import { clearProductStorage } from "@/lib/productStorage";

// Lets a visitor track more than one AI product's compliance progress in
// the same browser, with no account or backend — each product just gets
// its own slice of localStorage (see lib/productStorage.ts). The first
// product, id "default", is special: it's the one every returning visitor
// already had progress under before this feature existed, so it reuses
// the original unscoped storage keys rather than a migration step.

export type Product = {
  id: string;
  name: string;
  createdAt: number;
};

const PRODUCTS_KEY = "ina-caif-products-v1";
const ACTIVE_KEY = "ina-caif-active-product-v1";

// Every localStorage base key that is namespaced per product. Kept here,
// next to useProducts, so removeProduct can clean all four up at once
// without the hooks needing to know about each other.
export const PRODUCT_SCOPED_BASE_KEYS = [
  "ina-caif-checklist-v1",
  "ina-caif-qualifying-v1",
  "ina-caif-breakdown-v1",
  "ina-caif-ethics-context-v1",
];

const DEFAULT_PRODUCT: Product = { id: "default", name: "Produk Saya", createdAt: 0 };

// The "default" product reuses the ORIGINAL unscoped storage keys (see
// productStorage.ts), so its presence is detected the same way: those keys
// existing means there's real checklist/questionnaire progress tracked
// before this products feature existed.
function hasLegacyDefaultProductData(): boolean {
  try {
    return (
      window.localStorage.getItem("ina-caif-checklist-v1") !== null ||
      window.localStorage.getItem("ina-caif-qualifying-v1") !== null
    );
  } catch {
    return false;
  }
}

function loadProducts(): Product[] {
  try {
    const raw = window.localStorage.getItem(PRODUCTS_KEY);
    // A products list was explicitly saved before (even an empty one, e.g.
    // after deleting the last product) — respect it as-is rather than
    // re-seeding anything.
    if (raw !== null) {
      const parsed = JSON.parse(raw) as Product[];
      if (Array.isArray(parsed)) return parsed;
    }
  } catch {
    // Ignore malformed or inaccessible storage; fall through below.
  }
  // No products list has ever been saved — first-ever visit to /produk.
  // Only seed the "default" product when there's real legacy progress to
  // show; a genuinely new visitor starts with an empty list (0 products),
  // not a pre-filled "Produk Saya" card — per Jo: "by default sblm apa
  // hrsnya 0 dlu produknya, jgn ada 'produk saya'".
  return hasLegacyDefaultProductData() ? [DEFAULT_PRODUCT] : [];
}

function saveProducts(products: Product[]) {
  try {
    window.localStorage.setItem(PRODUCTS_KEY, JSON.stringify(products));
  } catch {
    // Ignore.
  }
}

function makeProductId(): string {
  return `p${Date.now().toString(36)}${Math.random().toString(36).slice(2, 7)}`;
}

export function useProducts() {
  // Starts as an empty list rather than [DEFAULT_PRODUCT] — the server-
  // rendered/pre-hydration state should match what a brand-new visitor
  // sees, not assume Jo's own legacy data. The real list (possibly
  // including "default") is loaded from storage right after mount.
  const [products, setProducts] = useState<Product[]>([]);
  const [activeProductId, setActiveProductIdState] = useState<string>("");
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const loaded = loadProducts();
    setProducts(loaded);
    try {
      const activeRaw = window.localStorage.getItem(ACTIVE_KEY);
      if (activeRaw && loaded.some((p) => p.id === activeRaw)) {
        setActiveProductIdState(activeRaw);
      } else {
        // No valid stored active product — fall back to the first product
        // in the list, or "" (no active product) when the list is empty,
        // which is the normal state for a visitor who hasn't added one yet.
        setActiveProductIdState(loaded[0]?.id ?? "");
      }
    } catch {
      setActiveProductIdState(loaded[0]?.id ?? "");
    } finally {
      setHydrated(true);
    }
  }, []);

  const setActiveProductId = useCallback((id: string) => {
    setActiveProductIdState(id);
    try {
      window.localStorage.setItem(ACTIVE_KEY, id);
    } catch {
      // Ignore.
    }
  }, []);

  const addProduct = useCallback((name: string) => {
    const id = makeProductId();
    const next: Product = { id, name: name.trim() || "Produk Baru", createdAt: Date.now() };
    setProducts((current) => {
      const updated = [...current, next];
      saveProducts(updated);
      return updated;
    });
    return id;
  }, []);

  const renameProduct = useCallback((id: string, name: string) => {
    setProducts((current) => {
      const updated = current.map((p) =>
        p.id === id ? { ...p, name: name.trim() || p.name } : p
      );
      saveProducts(updated);
      return updated;
    });
  }, []);

  // Removing a product also clears its own scoped checklist/questionnaire/
  // breakdown/ethics-context storage, and — if it was the active one —
  // falls back to the "default" product when it still exists, otherwise
  // whatever's now first in the list, otherwise "" (empty list is a valid
  // state — see loadProducts above). "default" can be removed like any
  // other product now (per Jo) — there's nothing left protecting it beyond
  // the confirm() dialog in app/produk/page.tsx, so deleting it is
  // permanent: it wipes the only copy of whatever progress it held.
  const removeProduct = useCallback(
    (id: string) => {
      const updated = products.filter((p) => p.id !== id);
      setProducts(updated);
      saveProducts(updated);
      clearProductStorage(PRODUCT_SCOPED_BASE_KEYS, id);
      setActiveProductIdState((currentActive) => {
        if (currentActive !== id) return currentActive;
        const fallback = updated.some((p) => p.id === "default")
          ? "default"
          : updated[0]?.id ?? "";
        try {
          if (fallback) {
            window.localStorage.setItem(ACTIVE_KEY, fallback);
          } else {
            window.localStorage.removeItem(ACTIVE_KEY);
          }
        } catch {
          // Ignore.
        }
        return fallback;
      });
    },
    [products]
  );

  return {
    products,
    activeProductId,
    setActiveProductId,
    addProduct,
    renameProduct,
    removeProduct,
    hydrated,
  };
}
