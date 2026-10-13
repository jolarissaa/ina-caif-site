"use client";

import { useRef } from "react";
import { Category, ChecklistItem, ChecklistStatus } from "@/lib/checklistData";

type Props = {
  categories: Category[];
  visibleItems: ChecklistItem[];
  statusMap: Record<string, ChecklistStatus>;
};

const SCROLL_STEP = 220;

// Replaces the old "Semua / Klasifikasi & Administrasi / ..." pill buttons.
// Those buttons filtered the page down to one category at a time, which (per
// Jo) made "Semua" painfully long and made switching categories feel like a
// redundant second way to do what scrolling already does. This instead
// always keeps every category's items on the page, and gives a sticky
// progress-bar overview: one segment per category, filled by how much of
// that category is done, that jumps you to the section via anchor link
// instead of hiding/showing content. Segments keep a fixed, readable width
// and scroll via the two arrow buttons rather than a draggable scrollbar.
export default function CategoryProgressBar({ categories, visibleItems, statusMap }: Props) {
  const scrollerRef = useRef<HTMLDivElement>(null);

  const scrollBy = (delta: number) => {
    scrollerRef.current?.scrollBy({ left: delta, behavior: "smooth" });
  };

  return (
    <div className="no-print sticky top-0 z-10 -mx-6 flex items-center gap-1 border-b border-border-subtle bg-surface/95 px-6 py-3 backdrop-blur sm:mx-0 sm:rounded-lg sm:border sm:px-3">
      <button
        type="button"
        onClick={() => scrollBy(-SCROLL_STEP)}
        aria-label="Geser ke kiri"
        className="flex-shrink-0 rounded-sm p-1 text-ink-muted hover:bg-surface-alt hover:text-brand"
      >
        <svg width="14" height="14" viewBox="0 0 20 20" fill="currentColor" aria-hidden>
          <path d="M12.5 4L7 10l5.5 6V4z" />
        </svg>
      </button>

      <div ref={scrollerRef} className="scrollbar-hide flex gap-3 overflow-x-auto scroll-smooth">
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
              className="group block w-[118px] flex-shrink-0"
            >
              <p className="truncate text-[11px] font-medium text-ink-muted group-hover:text-brand">
                {category.name}
              </p>
              <div className="mt-1.5 h-2 w-full overflow-hidden rounded-pill bg-border-subtle">
                <div
                  className={`h-full rounded-pill ${pct === 100 ? "bg-status-done-text" : "bg-brand"}`}
                  style={{ width: `${pct}%` }}
                />
              </div>
            </a>
          );
        })}
      </div>

      <button
        type="button"
        onClick={() => scrollBy(SCROLL_STEP)}
        aria-label="Geser ke kanan"
        className="flex-shrink-0 rounded-sm p-1 text-ink-muted hover:bg-surface-alt hover:text-brand"
      >
        <svg width="14" height="14" viewBox="0 0 20 20" fill="currentColor" aria-hidden>
          <path d="M7.5 4L13 10l-5.5 6V4z" />
        </svg>
      </button>
    </div>
  );
}
