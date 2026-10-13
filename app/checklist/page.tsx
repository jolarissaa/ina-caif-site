"use client";

import { useMemo, useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ChecklistItemRow from "@/components/ChecklistItem";
import ExportEthicsDialog from "@/components/ExportEthicsDialog";
import { categories, checklistItems } from "@/lib/checklistData";
import { useChecklistState } from "@/lib/useChecklistState";

const ALL_CATEGORY = "semua";

export default function ChecklistPage() {
  const [activeCategory, setActiveCategory] = useState<string>(ALL_CATEGORY);
  const [exportDialogOpen, setExportDialogOpen] = useState(false);
  const { statusMap, setStatus, resetAll, hydrated } = useChecklistState();

  const visibleItems = useMemo(() => {
    if (activeCategory === ALL_CATEGORY) return checklistItems;
    return checklistItems.filter((item) => item.categoryId === activeCategory);
  }, [activeCategory]);

  const progress = useMemo(() => {
    const total = checklistItems.length;
    const done = checklistItems.filter((item) => statusMap[item.id] === "selesai").length;
    return { total, done };
  }, [statusMap]);

  return (
    <>
      <Header />
      <main className="mx-auto max-w-content px-6 py-12">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="font-display text-2xl font-bold text-ink">Compliance Checker</h1>
            <p className="mt-2 max-w-xl text-sm leading-[22px] text-ink-muted">
              Tandai setiap butir sesuai kondisi sistem Anda saat ini. Buka setiap butir untuk
              membaca penjelasan dan sumber rujukannya.
            </p>
          </div>
          <div className="no-print flex flex-col items-end gap-2">
            <p className="text-sm font-medium text-ink-muted">
              {hydrated ? `${progress.done} / ${progress.total} selesai` : "Memuat..."}
            </p>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={resetAll}
                className="rounded-md border border-border-subtle px-3 py-1.5 text-xs font-medium text-ink-muted hover:border-brand hover:text-brand"
              >
                Atur Ulang
              </button>
              <button
                type="button"
                onClick={() => setExportDialogOpen(true)}
                className="rounded-md bg-brand px-3 py-1.5 text-xs font-semibold text-on-brand hover:bg-brand-dark"
              >
                Ekspor PDF
              </button>
            </div>
          </div>
        </div>

        <div className="no-print mt-8 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setActiveCategory(ALL_CATEGORY)}
            className={`rounded-pill px-4 py-1.5 text-sm font-medium ${
              activeCategory === ALL_CATEGORY
                ? "bg-brand text-on-brand"
                : "border border-border-subtle text-ink-muted hover:border-brand hover:text-brand"
            }`}
          >
            Semua
          </button>
          {categories.map((category) => (
            <button
              key={category.id}
              type="button"
              onClick={() => setActiveCategory(category.id)}
              className={`rounded-pill px-4 py-1.5 text-sm font-medium ${
                activeCategory === category.id
                  ? "bg-brand text-on-brand"
                  : "border border-border-subtle text-ink-muted hover:border-brand hover:text-brand"
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>

        <div className="mt-6 space-y-3">
          {visibleItems.map((item) => (
            <ChecklistItemRow
              key={item.id}
              item={item}
              status={statusMap[item.id] ?? item.defaultStatus}
              onStatusChange={(status) => setStatus(item.id, status)}
            />
          ))}
        </div>
      </main>
      <Footer />
      <ExportEthicsDialog open={exportDialogOpen} onClose={() => setExportDialogOpen(false)} />
    </>
  );
}
