"use client";

import { Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  categories,
  checklistItems,
  categoryQuotes,
  getOpenIssuesSummary,
  isItemVisible,
} from "@/lib/checklistData";
import { useChecklistState } from "@/lib/useChecklistState";
import { useEthicsContext } from "@/lib/useEthicsContext";
import { useQualifyingAnswers } from "@/lib/useQualifyingAnswers";
import { useBreakdownState } from "@/lib/useBreakdownState";
import StatusPill from "@/components/StatusPill";
import {
  CLASSIFICATION_LABEL,
  CLASSIFICATION_RESULT_TEXT,
  INFORMATION_ROLE_LABEL,
  SEVERITY_LABEL,
  deriveClassification,
  deriveEvidenceTier,
} from "@/lib/classification";

// Printable, single-column view meant to be opened and saved as PDF via the
// browser's own Print dialog. No navigation chrome; the .no-print class
// (see app/globals.css) hides controls that only make sense on screen.
// The "Konteks untuk Tim Etik" section only appears when the visitor chose
// "Ya" in the export dialog on /checklist (carried here as ?etik=1) and
// actually filled in at least one field there.
export default function ChecklistCetakPage() {
  return (
    <Suspense fallback={null}>
      <ChecklistCetakContent />
    </Suspense>
  );
}

function ChecklistCetakContent() {
  const { statusMap, hydrated } = useChecklistState();
  const { context } = useEthicsContext();
  const { answers } = useQualifyingAnswers();
  const { isChecked } = useBreakdownState();
  const searchParams = useSearchParams();
  const includeEthicsContext = searchParams.get("etik") === "1";

  const visibleItems = checklistItems.filter((item) => isItemVisible(item, answers));

  const classification = deriveClassification(answers);
  const evidenceTier =
    classification === "SaMD" ? deriveEvidenceTier(answers.informationRole) : null;

  const hasContext =
    includeEthicsContext &&
    (context.judulProyek ||
      context.institusi ||
      context.namaPenelitiUtama ||
      context.lokasi ||
      context.perkiraanWaktu ||
      context.ringkasan);

  return (
    <main className="mx-auto max-w-content px-6 py-12">
      <div className="no-print mb-8 flex items-center justify-between rounded-md border border-border-subtle bg-surface-alt p-4">
        <p className="text-sm text-ink-muted">
          Gunakan perintah Print pada browser (Ctrl/Cmd + P) dan pilih &quot;Save as PDF&quot;
          untuk menyimpan halaman ini.
        </p>
        <Link
          href="/checklist"
          className="rounded-md border border-border-subtle px-3 py-1.5 text-xs font-medium text-ink-muted hover:border-brand hover:text-brand"
        >
          Kembali
        </Link>
      </div>

      <header className="border-b border-border-subtle pb-6">
        <p className="text-xs font-semibold uppercase tracking-wide text-brand">
          INA-CAIF
        </p>
        <h1 className="mt-2 font-display text-2xl font-bold text-ink">
          Ringkasan Compliance Checker
        </h1>
        <p className="mt-1 text-sm text-ink-muted">
          Dicetak pada {new Date().toLocaleDateString("id-ID", { dateStyle: "long" })}
        </p>
      </header>

      {classification ? (
        <section className="mt-6 border-b border-border-subtle pb-6">
          <h2 className="font-display text-lg font-semibold text-ink">
            Hasil Kuesioner Profil Produk
          </h2>
          <p className="mt-2 text-sm leading-[22px] text-ink">
            Klasifikasi: <strong>{CLASSIFICATION_LABEL[classification]}</strong>
          </p>
          <p className="mt-1 text-sm leading-[22px] text-ink-muted">
            {CLASSIFICATION_RESULT_TEXT[classification]}
          </p>
          {classification === "SaMD" && evidenceTier && answers.severityLevel && answers.informationRole ? (
            <p className="mt-2 text-sm leading-[22px] text-ink">
              Tingkat keparahan: <strong>{SEVERITY_LABEL[answers.severityLevel]}</strong> · Peran
              keluaran: <strong>{INFORMATION_ROLE_LABEL[answers.informationRole]}</strong> · Bukti
              klinis wajib: kajian literatur + perbandingan produk sejenis
              {evidenceTier.trial ? " + hasil uji klinik" : ""}.
            </p>
          ) : null}
        </section>
      ) : null}

      {hasContext ? (
        <section className="mt-6 border-b border-border-subtle pb-6">
          <h2 className="font-display text-lg font-semibold text-ink">Konteks untuk Tim Etik</h2>
          <dl className="mt-3 grid gap-3 sm:grid-cols-2">
            <ContextRow label="Judul Proyek atau Sistem" value={context.judulProyek} />
            <ContextRow label="Institusi" value={context.institusi} />
            <ContextRow label="Nama Peneliti Utama" value={context.namaPenelitiUtama} />
            <ContextRow label="Lokasi" value={context.lokasi} />
            <ContextRow label="Perkiraan Waktu Pelaksanaan" value={context.perkiraanWaktu} />
          </dl>
          {context.ringkasan ? (
            <div className="mt-3">
              <p className="text-xs font-semibold uppercase tracking-wide text-ink-muted">
                Ringkasan Singkat
              </p>
              <p className="mt-1 text-sm leading-[22px] text-ink">{context.ringkasan}</p>
            </div>
          ) : null}
          <p className="mt-3 text-sm leading-[22px] text-ink">
            {hydrated ? getOpenIssuesSummary(statusMap, answers) : ""}
          </p>
          <p className="mt-3 text-xs italic text-ink-muted">
            Dokumen ini bersifat pelengkap ringkas dan tidak menggantikan protokol penelitian
            resmi yang diajukan ke komite etik (KEPKN).
          </p>
        </section>
      ) : null}

      <div className="mt-6 space-y-8">
        {categories.map((category) => {
          const itemsInCategory = visibleItems.filter(
            (item) => item.categoryId === category.id
          );
          if (itemsInCategory.length === 0) return null;
          const quote = categoryQuotes[category.id];
          return (
            <section key={category.id}>
              <h2 className="font-display text-lg font-semibold text-ink">{category.name}</h2>
              <p className="mt-1 text-sm text-ink-muted">{category.description}</p>
              {quote ? (
                <p className="mt-2 text-xs italic leading-[20px] text-ink-muted">
                  &ldquo;{quote.quote}&rdquo; — Sumber: {quote.sourceLabel}
                </p>
              ) : null}
              <ul className="mt-3 space-y-3">
                {itemsInCategory.map((item) => {
                  const actionableCount =
                    item.breakdown?.filter((step) => step.actionable !== false).length ?? 0;
                  const doneCount =
                    item.breakdown?.reduce(
                      (count, step, i) =>
                        step.actionable !== false && isChecked(item.id, i) ? count + 1 : count,
                      0
                    ) ?? 0;
                  return (
                  <li key={item.id} className="border-t border-border-subtle pt-3">
                    <div className="flex items-start justify-between gap-3">
                      <p className="text-sm leading-[22px] text-ink">{item.title}</p>
                      <div className="flex flex-shrink-0 items-center gap-2">
                        {actionableCount > 0 ? (
                          <span className="text-xs font-medium text-ink-muted">
                            {doneCount}/{actionableCount} langkah
                          </span>
                        ) : null}
                        <StatusPill status={statusMap[item.id] ?? item.defaultStatus} />
                      </div>
                    </div>
                    <p className="mt-1 text-sm leading-[22px] text-ink-muted">
                      {item.explanation}
                    </p>
                    <p className="mt-1 text-xs font-medium text-ink-muted">
                      Rujukan: {item.citationLabel}
                    </p>
                    {item.breakdown && item.breakdown.length > 0 ? (
                      <ul className="mt-2 space-y-1 border-l border-border-subtle pl-3">
                        {item.breakdown.map((step, i) => (
                          <li key={i} className="text-xs leading-[18px] text-ink-muted">
                            {step.actionable === false ? "– " : isChecked(item.id, i) ? "☑ " : "☐ "}
                            {step.text}
                            {step.source ? ` (Sumber: ${step.source.label})` : ""}
                          </li>
                        ))}
                      </ul>
                    ) : null}
                  </li>
                  );
                })}
              </ul>
            </section>
          );
        })}
      </div>
    </main>
  );
}

function ContextRow({ label, value }: { label: string; value: string }) {
  if (!value) return null;
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-wide text-ink-muted">{label}</p>
      <p className="text-sm text-ink">{value}</p>
    </div>
  );
}
