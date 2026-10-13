"use client";

import { Category, ChecklistItem, ChecklistStatus } from "@/lib/checklistData";

type Props = {
  categories: Category[];
  visibleItems: ChecklistItem[];
  statusMap: Record<string, ChecklistStatus>;
};

// Replaces the old "Semua / Klasifikasi & Administrasi / ..." pill buttons.
// Those buttons filtered the page down to one category at a time, which (per
// Jo) made "Semua" painfully long and made switching categories feel like a
// redundant second way to do what scrolling already does. This instead
// always keeps every category's items on the page, and gives a sticky
// progress-bar overview: one segment per category, filled by how much of
// that category is done, that jumps you to the section via anchor link
// instead of hiding/showing content.
export default function CategoryProgressBar({ categories, visibleItems, statusMap }: Props) {
  return (
    <div className="no-print sticky top-0 z-10 -mx-6 border-b border-border-subtle bg-surface/95 px-6 py-3 backdrop-blur sm:mx-0 sm:rounded-lg sm:border sm:px-4">
      <div className="flex gap-1.5 overflow-x-auto sm:gap-2">
        {categories.map((category) => {
          const items = visibleItems.filter((item) => item.categoryId === category.id);
          const total = items.length;
          const done = items.filter((item) => statusMap[item.id] === "selesai").length;
          const pct = total > 0 ? Math.round((done / total) * 100) : 0;

          return (
            <a
              key={category.id}
              href={`#${category.id}`}
              title={`${category.name} — ${done}/${total} selesai`}
              className="group flex-shrink-0 basis-[88px] sm:flex-1"
            >
              <p className="truncate text-[10px] font-medium text-ink-muted group-hover:text-brand sm:text-[11px]">
                {category.name}
              </p>
              <div className="mt-1 h-1.5 w-full overflow-hidden rounded-pill bg-border-subtle">
                <div
                  className={`h-full rounded-pill ${pct === 100 ? "bg-status-done-text" : "bg-brand"}`}
                  style={{ width: `${pct}%` }}
                />
              </div>
            </a>
          );
        })}
      </div>
    </div>
  );
}
