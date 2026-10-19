// Shared helper so every per-product state hook (checklist status,
// qualifying answers, breakdown steps, ethics context) stores its data
// under a key scoped to the product it belongs to — with one deliberate
// exception: the fixed "default" product keeps using the ORIGINAL,
// unscoped key each hook already had. That means everything Jo tracked
// before this feature existed keeps working with zero migration — it's
// simply "default" product's data, same key as always. Only products
// added after this feature exists get a key of their own, so two
// different products' answers/checklists can never collide.

export function productScopedKey(baseKey: string, productId: string): string {
  return productId === "default" ? baseKey : `${baseKey}:${productId}`;
}

// Removes a product's own scoped storage across every base key it used.
// "default" is no exception: productScopedKey already maps it back to the
// original unscoped keys, so deleting it clears exactly those — the same
// permanent, no-undo removal as any other product. The confirm() dialog
// in app/produk/page.tsx is the only safety net before this runs.
export function clearProductStorage(baseKeys: string[], productId: string): void {
  for (const base of baseKeys) {
    try {
      window.localStorage.removeItem(productScopedKey(base, productId));
    } catch {
      // Ignore inaccessible storage.
    }
  }
}
