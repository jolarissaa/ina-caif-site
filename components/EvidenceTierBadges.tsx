import { EvidenceTier } from "@/lib/classification";

type Props = {
  evidenceTier: EvidenceTier;
};

// Shown inside klinis-2's expanded card (as its resultBanner — see
// ChecklistItem's resultBanner prop) right above the a/b/c breakdown. Per
// Jo: rather than a sentence telling the reader which of the three evidence
// types applies to their product, show it directly as a chip row — wajib
// (required) vs tidak wajib (not required) — computed straight from Tabel
// 3.2 via lib/classification.ts, sitting right where the breakdown items
// themselves are listed.
const ROWS: { key: keyof EvidenceTier; label: string }[] = [
  { key: "literature", label: "Kajian literatur ilmiah" },
  { key: "clinical", label: "Perbandingan produk sejenis" },
  { key: "trial", label: "Hasil uji klinik" },
];

export default function EvidenceTierBadges({ evidenceTier }: Props) {
  return (
    <div className="rounded-md border border-border-subtle bg-surface-alt p-3">
      <p className="text-[11px] font-semibold uppercase tracking-wide text-ink-muted">
        Wajib untuk produk Anda
      </p>
      <div className="mt-2 flex flex-wrap gap-1.5">
        {ROWS.map((row) => {
          const required = evidenceTier[row.key];
          return (
            <span
              key={row.key}
              className={`inline-flex items-center gap-1 rounded-pill px-2.5 py-1 text-xs font-medium ${
                required
                  ? "bg-status-done-bg text-status-done-text"
                  : "border border-border-subtle text-ink-muted line-through decoration-ink-muted/40"
              }`}
            >
              {required ? "✓" : "–"} {row.label}
            </span>
          );
        })}
      </div>
    </div>
  );
}
