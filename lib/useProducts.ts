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

function loadProducts(): Product[] {
  try {
    const raw = window.localStorage.getItem(PRODUCTS_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as Product[];
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch {
    // Ignore malformed or inaccessible storage; fall through to default.
  }
  return [DEFAULT_PRODUCT];
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
  const [products, setProducts] = useState<Product[]>([DEFAULT_PRODUCT]);
  const [activeProductId, setActiveProductIdState] = useState<string>("default");
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const loaded = loadProducts();
    setProducts(loaded);
    try {
      const activeRaw = window.localStorage.getItem(ACTIVE_KEY);
      if (activeRaw && loaded.some((p) => p.id === activeRaw)) {
        setActiveProductIdState(activeRaw);
      } else {
        setActiveProductIdState(loaded[0].id);
      }
    } catch {
      setActiveProductIdState(loaded[0].id);
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
  // falls back to whichever product is now first in the list. The
  // "default" product can never be removed: it's the only product
  // guaranteed to exist, and the one holding data with no scoping to clean
  // up safely.
  const removeProduct = useCallback(
    (id: string) => {
      if (id === "default") return;
      setProducts((current) => {
        if (current.length <= 1) return current;
        const updated = current.filter((p) => p.id !== id);
        saveProducts(updated);
        return updated;
      });
      clearProductStorage(PRODUCT_SCOPED_BASE_KEYS, id);
      setActiveProductIdState((currentActive) => {
        if (currentActive !== id) return currentActive;
        const fallback = "default";
        try {
          window.localStorage.setItem(ACTIVE_KEY, fallback);
        } catch {
          // Ignore.
        }
        return fallback;
      });
    },
    []
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
