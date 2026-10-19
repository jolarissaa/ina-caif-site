"use client";

import { useState } from "react";
import { Category, ChecklistItem, ChecklistStatus } from "@/lib/checklistData";

type Props = {
  categories: Category[];
  visibleItems: ChecklistItem[];
  statusMap: Record<string, ChecklistStatus>;
};

const STATUS_DOT: Record<ChecklistStatus, string> = {
  selesai: "bg-status-done-text",
  berjalan: "bg-status-ongoing-text",
  belum: "bg-status-notyet-text",
};

// Replaces CategoryProgressBar as the default progress overview on
// /checklist (desktop) — per Jo, a single segmented bar across the top
// "kurang jelas": it shows how far along each category is, but not what's
// actually left in it. This sits as a sticky right-hand panel instead, one
// row per category with a click-to-expand list of its own items and their
// status dot, each linking straight to that item on the page. Kept as a
// floating side panel rather than inline so scanning progress never
// requires losing your place in the checklist itself.
export default function CategoryProgressPanel({ categories, visibleItems, statusMap }: Props) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  return (
    <div className="no-print hidden lg:block">
      <div className="lg:sticky lg:top-8 lg:w-[260px]">
        <p className="text-xs font-semibold uppercase tracking-wide text-ink-muted">
          Progres per tahap
        </p>
        <div className="mt-3 space-y-2">
          {categories.map((category) => {
            const items = visibleItems.filter((item) => item.categoryId === category.id);
            const total = items.length;
            const done = items.filter((item) => statusMap[item.id] === "selesai").length;
            const pct = total > 0 ? Math.round((done / total) * 100) : 0;
            const expanded = expandedId === category.id;

            return (
              <div
                key={category.id}
                className="overflow-hidden rounded-md border border-border-subtle bg-surface"
              >
                <button
                  type="button"
                  onClick={() => setExpandedId(expanded ? null : category.id)}
                  className="flex w-full items-center justify-between gap-2 px-3 py-2 text-left"
                  aria-expanded={expanded}
                >
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-xs font-semibold text-ink">
                      {category.name}
                    </span>
                    <span className="mt-1.5 block h-1.5 w-full overflow-hidden rounded-pill bg-border-subtle">
                      <span
                        className={`block h-full rounded-pill ${
                          pct === 100 ? "bg-status-done-text" : "bg-brand"
                        }`}
                        style={{ width: `${pct}%` }}
                      />
                    </span>
                  </span>
                  <span className="flex-shrink-0 text-[11px] font-semibold text-ink-muted">
                    {done}/{total}
                  </span>
                  <svg
                    className={`h-3 w-3 flex-shrink-0 text-ink-muted transition-transform ${
                      expanded ? "rotate-180" : ""
                    }`}
                    viewBox="0 0 20 20"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  >
                    <path d="M5 7.5L10 12.5L15 7.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
                {expanded ? (
                  <ul className="space-y-1.5 border-t border-border-subtle px-3 py-2.5">
                    {items.map((item) => {
                      const status = statusMap[item.id] ?? item.defaultStatus;
                      return (
                        <li key={item.id}>
                          <a
                            href={`#${item.id}`}
                            className="flex items-start gap-1.5 text-[11px] leading-[16px] text-ink-muted hover:text-brand"
                          >
                            <span
                              aria-hidden
                              className={`mt-0.5 h-1.5 w-1.5 flex-shrink-0 rounded-full ${STATUS_DOT[status]}`}
                            />
                            <span className="line-clamp-2">{item.title}</span>
                          </a>
                        </li>
                      );
                    })}
                  </ul>
                ) : null}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
