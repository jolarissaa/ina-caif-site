"use client";

import { useState } from "react";
import { ChecklistItem as ChecklistItemType, ChecklistStatus } from "@/lib/checklistData";
import StatusPill from "./StatusPill";
import CitationChip from "./CitationChip";
import SourceBadge from "./SourceBadge";
import FormBadge from "./FormBadge";
import { DocumentIcon, AlertIcon, BookmarkDownloadIcon } from "./icons";
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

// What each OutputKind looks like: a left-edge accent color on the card,
// plus an icon (no label text — see OUTPUT_KIND_ICON below) so a reader can
// tell at a glance, before opening the item, whether it's a caution to keep
// in mind or a document to produce. Per Jo: the old spelled-out pills
// ("Perhatian — bukan dokumen", "Dokumen bebas — tanpa template resmi")
// were too much text for what's really a quick visual cue — the icon, the
// border color, and (for document items) the "Simpan Template" button
// inside the item now carry that distinction instead.
const OUTPUT_KIND_BORDER: Record<NonNullable<ChecklistItemType["outputKind"]>, string> = {
  peringatan: "border-l-amber-400",
  "dokumen-bebas": "border-l-slate-400",
  "dokumen-template": "border-l-emerald-500",
};

const OUTPUT_KIND_ICON: Record<
  NonNullable<ChecklistItemType["outputKind"]>,
  { Icon: typeof AlertIcon; color: string; label: string }
> = {
  peringatan: { Icon: AlertIcon, color: "text-amber-600", label: "Prinsip yang perlu diperhatikan, bukan dokumen formal" },
  "dokumen-bebas": { Icon: DocumentIcon, color: "text-slate-500", label: "Dokumen yang perlu disiapkan" },
  "dokumen-template": { Icon: DocumentIcon, color: "text-emerald-600", label: "Dokumen dengan template resmi" },
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
  const outputBorder = item.outputKind ? OUTPUT_KIND_BORDER[item.outputKind] : null;
  const outputIcon = item.outputKind ? OUTPUT_KIND_ICON[item.outputKind] : null;

  // "peringatan" items are a caution to keep in mind, not a deliverable —
  // there's nothing that can be "sedang disiapkan" about a principle to
  // uphold. Per Jo: these need a visibly different control from the
  // document-type items' three-state tracker, not the same dropdown.
  const isAdvisory = item.outputKind === "peringatan";

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
      id={item.id}
      className={`scroll-mt-20 rounded-lg border border-border-subtle bg-surface border-l-4 ${
        outputBorder ?? "border-l-border-subtle"
      }`}
    >
      <div className="flex items-start gap-3 p-4">
        {!hasActionableBreakdown && !isAdvisory ? (
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
            data-tutorial={
              item.id === "klasifikasi-3"
                ? "item-expand-button"
                : item.id === "dasar-1"
                ? "item-dasar1-expand-button"
                : undefined
            }
            className="flex w-full items-start justify-between gap-3 text-left"
          >
            <span
              data-tutorial={item.id === "klasifikasi-2" ? "item-main-text" : undefined}
              className="text-[15px] leading-[22px] text-ink"
            >
              {item.title}
            </span>
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
            {outputIcon ? (
              <span title={outputIcon.label} aria-label={outputIcon.label} className={outputIcon.color}>
                <outputIcon.Icon className="h-4 w-4" />
              </span>
            ) : null}
            {item.regalkesForm ? (
              <span data-tutorial={item.id === "dasar-1" ? "item-form-badge" : undefined}>
                <FormBadge form={item.regalkesForm} />
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
            {isAdvisory ? (
              // Advisory items don't track "sedang berjalan" — a caution is
              // either noted or it isn't, so this is a plain two-state
              // toggle instead of the three-option dropdown document-type
              // items get below.
              <button
                type="button"
                onClick={() => onStatusChange(status === "selesai" ? "belum" : "selesai")}
                className={`inline-flex items-center rounded-pill px-3 py-1 text-xs font-semibold ${
                  status === "selesai"
                    ? "bg-status-done-bg text-status-done-text"
                    : "border border-border-subtle text-ink-muted hover:border-brand hover:text-brand"
                }`}
              >
                {status === "selesai" ? "✓ Sudah diperhatikan" : "Tandai sudah diperhatikan"}
              </button>
            ) : (
              <span
                data-tutorial={item.id === "klasifikasi-2" ? "item-status-control" : undefined}
                className="inline-flex items-center gap-2"
              >
                <StatusPill status={status} />
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
              </span>
            )}
          </div>

          {open ? (
            <div
              data-tutorial={item.id === "klasifikasi-3" ? "item-tkt9-detail" : undefined}
              className="mt-3 space-y-3 border-t border-border-subtle pt-3"
            >
              {/* The narrative/"storyline" framing Jo asked for: what this
                  item is about, grounded in its own citation right
                  underneath — mirroring RegulationQuote's category-level
                  quote boxes, but per item — before anything about what to
                  actually do with it. */}
              <blockquote className="rounded-md border-l-4 border-brand bg-brand/5 px-4 py-3">
                <p className="text-sm leading-[22px] text-ink">{item.explanation}</p>
                <footer
                  data-tutorial={item.id === "dasar-1" ? "item-dasar1-citation" : undefined}
                  className="mt-2 flex flex-wrap items-center gap-1.5"
                >
                  <CitationChip label={item.citationLabel} type={item.citationType} url={item.citationUrl} />
                </footer>
              </blockquote>

              {resultBanner}

              {item.breakdown && item.breakdown.length > 0 ? (
                <div
                  data-tutorial={item.id === "dasar-1" ? "item-rincian-teknis" : undefined}
                  className="rounded-md border border-border-subtle bg-surface-alt p-3"
                >
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
                                <div
                                  data-tutorial={item.id === "dasar-1" ? "item-iso-badge" : undefined}
                                  className="mt-1.5"
                                >
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

              {item.templateRef ? (
                <div className="flex flex-wrap items-center gap-2">
                  <a
                    href={item.templateRef.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-md border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-[12px] font-medium text-emerald-800 hover:opacity-80"
                  >
                    {item.templateRef.label} →
                  </a>
                </div>
              ) : null}

              {item.freeTemplateUrl ? (
                <div className="flex flex-wrap items-center gap-2">
                  <a
                    href={item.freeTemplateUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-md border border-slate-300 bg-slate-50 px-2.5 py-1.5 text-[12px] font-semibold text-slate-700 hover:border-brand hover:text-brand"
                  >
                    <BookmarkDownloadIcon className="h-3.5 w-3.5" />
                    Simpan Template
                  </a>
                  <span className="text-[11px] text-ink-muted">
                    Struktur ini merupakan saran penyusunan dan bukan formulir resmi Kemenkes
                  </span>
                </div>
              ) : null}

              {item.resources && item.resources.length > 0 ? (
                <div className="space-y-1">
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-ink-muted">
                    Kunjungi tautan berikut
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
