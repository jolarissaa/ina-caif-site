"use client";

import { useState } from "react";
import { ChecklistItem as ChecklistItemType, ChecklistStatus } from "@/lib/checklistData";
import StatusPill from "./StatusPill";
import CitationChip from "./CitationChip";
import SourceBadge from "./SourceBadge";
import { useBreakdownState } from "@/lib/useBreakdownState";

type Props = {
  item: ChecklistItemType;
  status: ChecklistStatus;
  onStatusChange: (status: ChecklistStatus) => void;
  // Optional computed-result block injected for specific items whose
  // content the qualifying questionnaire can now answer directly (e.g.
  // klasifikasi-1's SaMD/SiMD result, klinis-1's evidence tier) — see
  // app/checklist/page.tsx, which builds this from the questionnaire's
  // answers rather than leaving these items purely self-directed.
  resultBanner?: React.ReactNode;
  // Which product this item's breakdown checkboxes belong to — without
  // this, every product would silently share one browser-wide set of
  // breakdown checkboxes instead of each having its own. Defaults to
  // "default" so a caller that doesn't pass it (e.g. a future standalone
  // use of this component) still behaves the way the single-product
  // version of the site always did.
  productId?: string;
};

const STATUS_OPTIONS: { value: ChecklistStatus; label: string }[] = [
  { value: "belum", label: "Belum Dimulai" },
  { value: "berjalan", label: "Sedang Berjalan" },
  { value: "selesai", label: "Selesai" },
];

// What each OutputKind looks like: a left-edge accent color on the card
// plus a small pill naming it, so a reader can tell at a glance — before
// opening the item — whether it's a caution to keep in mind, a document to
// draft freeform, or a document with an actual template to go fill in. Per
// Jo: keep it small and simple (a border + a short label), not a wall of
// explanation.
const OUTPUT_KIND_CONFIG: Record<
  NonNullable<ChecklistItemType["outputKind"]>,
  { label: string; border: string; pillBg: string; pillText: string }
> = {
  peringatan: {
    label: "Perhatian — bukan dokumen",
    border: "border-l-amber-400",
    pillBg: "bg-amber-50",
    pillText: "text-amber-800",
  },
  "dokumen-bebas": {
    label: "Dokumen bebas — tanpa template resmi",
    border: "border-l-slate-400",
    pillBg: "bg-slate-100",
    pillText: "text-slate-700",
  },
  "dokumen-template": {
    label: "Dokumen — pakai template resmi",
    border: "border-l-emerald-500",
    pillBg: "bg-emerald-50",
    pillText: "text-emerald-800",
  },
};

export default function ChecklistItem({
  item,
  status,
  onStatusChange,
  resultBanner,
  productId = "default",
}: Props) {
  const [open, setOpen] = useState(false);
  const { isChecked, toggleStep } = useBreakdownState(productId);
  const outputConfig = item.outputKind ? OUTPUT_KIND_CONFIG[item.outputKind] : null;

  // A compound item (its real content is the breakdown) doesn't get its own
  // quick-toggle checkbox — checking off one box for "susun dokumen dengan 5
  // komponen" doesn't mean anything on its own. The status dropdown stays as
  // the item's overall tracker either way; the breakdown's own checkboxes
  // carry the actual checkable work when there is one.
  const hasActionableBreakdown = Boolean(
    item.breakdown?.some((step) => step.actionable !== false)
  );

  // How many of the breakdown's actionable sub-steps are checked, so
  // there's a visible "3/5 selesai" signal even while the item is
  // collapsed — the status dropdown alone doesn't track this, which is
  // exactly what Jo flagged as missing.
  let breakdownProgress: { done: number; total: number } | null = null;
  if (item.breakdown) {
    let total = 0;
    let done = 0;
    item.breakdown.forEach((step, i) => {
      if (step.actionable === false) return;
      total += 1;
      if (isChecked(item.id, i)) done += 1;
    });
    if (total > 0) breakdownProgress = { done, total };
  }

  return (
    <div
      className={`rounded-lg border border-border-subtle bg-surface border-l-4 ${
        outputConfig ? outputConfig.border : "border-l-border-subtle"
      }`}
    >
      <div className="flex items-start gap-3 p-4">
        {!hasActionableBreakdown ? (
          <input
            type="checkbox"
            checked={status === "selesai"}
            onChange={(e) => onStatusChange(e.target.checked ? "selesai" : "berjalan")}
            className="mt-1 h-4 w-4 flex-shrink-0 rounded-sm border-border-subtle text-brand focus:ring-brand"
            aria-label={`Tandai "${item.title}"`}
          />
        ) : null}

        <div className="min-w-0 flex-1">
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="flex w-full items-start justify-between gap-3 text-left"
          >
            <span className="text-[15px] leading-[22px] text-ink">{item.title}</span>
            <svg
              className={`mt-1 h-4 w-4 flex-shrink-0 text-ink-muted transition-transform ${
                open ? "rotate-180" : ""
              }`}
              viewBox="0 0 20 20"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <path d="M5 7.5L10 12.5L15 7.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>

          <div className="mt-2 flex flex-wrap items-center gap-2">
            <StatusPill status={status} />
            {outputConfig ? (
              <span
                className={`inline-flex items-center rounded-pill px-2.5 py-1 text-[11px] font-semibold ${outputConfig.pillBg} ${outputConfig.pillText}`}
              >
                {outputConfig.label}
              </span>
            ) : null}
            {breakdownProgress ? (
              <span
                className={`text-xs font-semibold ${
                  breakdownProgress.done === breakdownProgress.total
                    ? "text-status-done-text"
                    : "text-ink-muted"
                }`}
              >
                {breakdownProgress.done}/{breakdownProgress.total} langkah selesai
              </span>
            ) : null}
            <select
              value={status}
              onChange={(e) => onStatusChange(e.target.value as ChecklistStatus)}
              className="rounded-md border border-border-subtle bg-surface px-2 py-1 text-xs text-ink-muted"
              aria-label={`Ubah status "${item.title}"`}
            >
              {STATUS_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          {open ? (
            <div className="mt-3 space-y-3 border-t border-border-subtle pt-3">
              <p className="text-sm leading-[22px] text-ink-muted">{item.explanation}</p>

              {resultBanner}

              {item.breakdown && item.breakdown.length > 0 ? (
                <div className="rounded-md border border-border-subtle bg-surface-alt p-3">
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-ink-muted">
                    {hasActionableBreakdown ? "Rincian teknis — checklist" : "Rincian teknis"}
                  </p>
                  <ul className="mt-2 space-y-2.5">
                    {item.breakdown.map((step, i) => {
                      const checked = isChecked(item.id, i);
                      if (step.actionable === false) {
                        return (
                          <li key={i} className="flex gap-2 text-sm leading-[20px] text-ink-muted">
                            <span aria-hidden className="flex-shrink-0">
                              –
                            </span>
                            <span>
                              {step.text}
                              {step.source ? (
                                <div className="mt-1.5">
                                  <SourceBadge {...step.source} />
                                </div>
                              ) : null}
                            </span>
                          </li>
                        );
                      }
                      return (
                        <li key={i} className="flex gap-2">
                          <input
                            type="checkbox"
                            checked={checked}
                            onChange={() => toggleStep(item.id, i)}
                            className="mt-0.5 h-4 w-4 flex-shrink-0 rounded-sm border-border-subtle text-brand focus:ring-brand"
                            aria-label={step.text}
                          />
                          <span
                            className={`text-sm leading-[20px] ${
                              checked ? "text-ink-muted line-through decoration-ink-muted/50" : "text-ink"
                            }`}
                          >
                            {step.text}
                            {step.source ? (
                              <div className="mt-1.5">
                                <SourceBadge {...step.source} />
                              </div>
                            ) : null}
                          </span>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              ) : null}

              <div className="flex flex-wrap items-center gap-2">
                <CitationChip label={item.citationLabel} type={item.citationType} url={item.citationUrl} />
                {item.templateRef ? (
                  <a
                    href={item.templateRef.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-md border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-[12px] font-medium text-emerald-800 hover:opacity-80"
                  >
                    {item.templateRef.label} →
                  </a>
                ) : null}
              </div>

              {item.resources && item.resources.length > 0 ? (
                <div className="space-y-1">
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-ink-muted">
                    Ke mana harus pergi
                  </p>
                  <ul className="space-y-1">
                    {item.resources.map((resource) => (
                      <li key={resource.url}>
                        <a
                          href={resource.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[13px] font-medium text-brand hover:underline"
                        >
                          {resource.label} →
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
