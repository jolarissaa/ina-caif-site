"use client";

import { useState } from "react";
import { ChecklistItem as ChecklistItemType, ChecklistStatus } from "@/lib/checklistData";
import StatusPill from "./StatusPill";
import CitationChip from "./CitationChip";
import SourceBadge from "./SourceBadge";

type Props = {
  item: ChecklistItemType;
  status: ChecklistStatus;
  onStatusChange: (status: ChecklistStatus) => void;
};

const STATUS_OPTIONS: { value: ChecklistStatus; label: string }[] = [
  { value: "belum", label: "Belum Dimulai" },
  { value: "berjalan", label: "Sedang Berjalan" },
  { value: "selesai", label: "Selesai" },
];

export default function ChecklistItem({ item, status, onStatusChange }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <div className="rounded-lg border border-border-subtle bg-surface">
      <div className="flex items-start gap-3 p-4">
        <input
          type="checkbox"
          checked={status === "selesai"}
          onChange={(e) => onStatusChange(e.target.checked ? "selesai" : "berjalan")}
          className="mt-1 h-4 w-4 flex-shrink-0 rounded-sm border-border-subtle text-brand focus:ring-brand"
          aria-label={`Tandai "${item.title}"`}
        />

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

              {item.breakdown && item.breakdown.length > 0 ? (
                <div className="rounded-md border border-border-subtle bg-surface-alt p-3">
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-ink-muted">
                    Rincian teknis
                  </p>
                  <ol className="mt-2 space-y-2.5">
                    {item.breakdown.map((step, i) => (
                      <li key={i} className="text-sm leading-[20px] text-ink">
                        <span className="text-ink-muted">{i + 1}. </span>
                        {step.text}
                        {step.source ? (
                          <div className="mt-1.5">
                            <SourceBadge {...step.source} />
                          </div>
                        ) : null}
                      </li>
                    ))}
                  </ol>
                </div>
              ) : null}

              <CitationChip label={item.citationLabel} type={item.citationType} url={item.citationUrl} />
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
