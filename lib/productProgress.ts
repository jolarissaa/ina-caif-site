import { ChecklistStatus, checklistItems, isItemVisible, QualifyingAnswersLike } from "./checklistData";
import { productScopedKey } from "./productStorage";

// A light read-only summary of one product's progress for the /produk
// list page — how many of ITS visible checklist items are done, out of
// how many are visible for IT (visibility depends on that product's own
// qualifying-questionnaire answers, so this mirrors isItemVisible() rather
// than just counting every item). Reads localStorage directly instead of
// mounting the full hooks, since the list page needs this for every
// product at once, not just the active one.
export function getProductProgress(productId: string): { done: number; total: number } {
  try {
    const qualifyingRaw = window.localStorage.getItem(
      productScopedKey("ina-caif-qualifying-v1", productId)
    );
    const answers: Partial<QualifyingAnswersLike> = qualifyingRaw
      ? JSON.parse(qualifyingRaw)
      : {};
    const visible = checklistItems.filter((item) =>
      isItemVisible(item, {
        usesAi: answers.usesAi ?? null,
        continuousLearning: answers.continuousLearning ?? null,
        generative: answers.generative ?? null,
        importLocalValidation: answers.importLocalValidation ?? null,
      })
    );

    const statusRaw = window.localStorage.getItem(
      productScopedKey("ina-caif-checklist-v1", productId)
    );
    const statusMap: Record<string, ChecklistStatus> = statusRaw ? JSON.parse(statusRaw) : {};
    const done = visible.filter(
      (item) => (statusMap[item.id] ?? item.defaultStatus) === "selesai"
    ).length;

    return { done, total: visible.length };
  } catch {
    return { done: 0, total: checklistItems.length };
  }
}
