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
// Deliberately refuses to touch anything for "default" — that product's
// data lives at the original unscoped keys and should never be wiped by
// a product-delete action.
export function clearProductStorage(baseKeys: string[], productId: string): void {
  if (productId === "default") return;
  for (const base of baseKeys) {
    try {
      window.localStorage.removeItem(productScopedKey(base, productId));
    } catch {
      // Ignore inaccessible storage.
    }
  }
}
