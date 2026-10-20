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
  ethicsRelevantItems,
} from "@/lib/checklistData";
import { useChecklistState } from "@/lib/useChecklistState";
import { useEthicsContext } from "@/lib/useEthicsContext";
import { useQualifyingAnswers } from "@/lib/useQualifyingAnswers";
import { useBreakdownState } from "@/lib/useBreakdownState";
import { useEvidenceLinks } from "@/lib/useEvidenceLinks";
import { useEthicsAssessment } from "@/lib/useEthicsAssessment";
import {
  AI_ETHICS_ASPECTS,
  CORE_ETHICS_STANDARDS,
  ETHICS_STATUS_LABEL,
  type EthicsStandardDef,
} from "@/lib/ethicsStandards";
import { useProducts } from "@/lib/useProducts";
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
  // Exports whichever product is currently active (set on /produk, same
  // value /checklist was just showing) rather than always exporting
  // "default" — so printing from product B's checklist never shows
  // product A's progress.
  const { products, activeProductId } = useProducts();
  const activeProduct = products.find((p) => p.id === activeProductId);
  const { statusMap, hydrated } = useChecklistState(activeProductId);
  const { context } = useEthicsContext(activeProductId);
  const { answers } = useQualifyingAnswers(activeProductId);
  const { isChecked } = useBreakdownState(activeProductId);
  const { getLink } = useEvidenceLinks(activeProductId);
  const { getValue: getEthicsStandardValue } = useEthicsAssessment(activeProductId);
  const searchParams = useSearchParams();
  const includeEthicsContext = searchParams.get("etik") === "1";

  const allVisibleItems = checklistItems.filter((item) => isItemVisible(item, answers));
  // When exporting for an ethics committee, the printed document is scoped
  // down to only the items that bear on ethics review (Bab IV.A — see
  // ChecklistItem.ethicsRelevant) — a reviewer evaluating whether ethical
  // steps A/B/C/D were done doesn't need the general izin-edar/admin items
  // mixed in. The normal (non-ethics) export still prints everything.
  const visibleItems = includeEthicsContext
    ? ethicsRelevantItems(allVisibleItems)
    : allVisibleItems;

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
          {includeEthicsContext ? "Ringkasan untuk Komite Etik" : "Ringkasan Compliance Checker"}
          {activeProduct ? <span className="text-ink-muted"> — {activeProduct.name}</span> : null}
        </h1>
        <p className="mt-1 text-sm text-ink-muted">
          Dicetak pada {new Date().toLocaleDateString("id-ID", { dateStyle: "long" })}
        </p>
        {includeEthicsContext ? (
          <p className="mt-2 text-xs italic text-ink-muted">
            Disusun mengacu pada Pedoman dan Standar Etik Penelitian dan Pengembangan Kesehatan
            Nasional (KEPPKN, Kemenkes RI, 2021), disesuaikan untuk produk AI kesehatan. Hanya
            menampilkan butir checklist yang relevan bagi penilaian etik (Bab IV.A — Etika &amp;
            Good Machine Learning Practice); butir administratif dan persyaratan izin edar
            lainnya tidak disertakan di sini.
          </p>
        ) : null}
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

      {includeEthicsContext ? (
        <section className="mt-6 border-b border-border-subtle pb-6">
          <h2 className="font-display text-lg font-semibold text-ink">
            Standar Kelaikan Etik Penelitian
          </h2>
          <p className="mt-1 text-xs text-ink-muted">
            Enam standar inti dari pedoman KEPPKN 2021, dinilai mandiri oleh pengembang.
          </p>
          <EthicsStandardTable defs={CORE_ETHICS_STANDARDS} getValue={getEthicsStandardValue} />

          <h2 className="mt-6 font-display text-lg font-semibold text-ink">
            Aspek Etik Penelitian Kecerdasan Buatan (AI) Kesehatan
          </h2>
          <p className="mt-1 text-xs text-ink-muted">
            Dirangkum dari Bab V.B.4 pedoman KEPPKN 2021, bagian yang membahas AI secara khusus.
          </p>
          <EthicsStandardTable defs={AI_ETHICS_ASPECTS} getValue={getEthicsStandardValue} />

          <p className="mt-3 text-xs italic leading-[18px] text-ink-muted">
            Kerangka ini disesuaikan untuk produk perangkat lunak/AI — standar dalam pedoman asli
            yang khusus untuk desain uji klinik dengan subjek manusia langsung (mis. randomisasi,
            plasebo, bahan biologik tersimpan) tidak disertakan karena tidak relevan di sini.
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
                  // Ethics export: a compact row per item — title, a short
                  // one-line explanation for orientation, status, and
                  // either the developer's own evidence link or a plain
                  // placeholder. Deliberately leaves out the breakdown/
                  // checkbox detail that the regular export below prints —
                  // per Jo, repeating every sub-question and checkbox here
                  // just confuses an ethics reviewer who mainly needs to
                  // know what's done and where the proof is, not retrace
                  // the developer's own working checklist.
                  if (includeEthicsContext) {
                    const link = getLink(item.id);
                    return (
                      <li key={item.id} className="border-t border-border-subtle pt-3">
                        <div className="flex items-start justify-between gap-3">
                          <p className="text-sm leading-[22px] text-ink">{item.title}</p>
                          <StatusPill status={statusMap[item.id] ?? item.defaultStatus} />
                        </div>
                        <p className="mt-1 text-sm leading-[22px] text-ink-muted">
                          {item.explanation}
                        </p>
                        <p className="mt-1.5 text-xs font-medium">
                          {link ? (
                            <a
                              href={link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-brand hover:underline"
                            >
                              Lihat dokumen/bukti →
                            </a>
                          ) : (
                            <span className="italic text-ink-muted">Belum ada tautan dokumen</span>
                          )}
                        </p>
                      </li>
                    );
                  }

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

      {includeEthicsContext ? (
        <section className="mt-8 border-t border-border-subtle pt-6">
          <h2 className="font-display text-lg font-semibold text-ink">Komitmen Etik</h2>
          <p className="mt-2 text-sm leading-[22px] text-ink">
            Pengembang menyatakan bahwa prinsip-prinsip dalam Pedoman dan Standar Etik Penelitian
            dan Pengembangan Kesehatan Nasional (KEPPKN, Kementerian Kesehatan RI, 2021) telah
            dipertimbangkan dalam pengembangan
            {activeProduct ? ` ${activeProduct.name}` : " produk ini"}, sejauh relevan untuk
            produk perangkat lunak/AI kesehatan yang bukan merupakan penelitian subjek manusia
            langsung.
          </p>
          <p className="mt-3 text-xs italic text-ink-muted">
            Ringkasan ini melengkapi, bukan menggantikan, protokol atau pernyataan komitmen etik
            resmi yang diajukan ke komite etik institusi Anda atau melalui portal KEPKN.
          </p>
        </section>
      ) : null}
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

function EthicsStandardTable({
  defs,
  getValue,
}: {
  defs: EthicsStandardDef[];
  getValue: (id: string) => { status: "ya" | "tidak" | "na" | null; note: string };
}) {
  return (
    <ul className="mt-3 space-y-3">
      {defs.map((def) => {
        const value = getValue(def.id);
        return (
          <li key={def.id} className="border-t border-border-subtle pt-3">
            <div className="flex items-start justify-between gap-3">
              <p className="text-sm leading-[22px] text-ink">{def.label}</p>
              <span className="flex-shrink-0 rounded-pill bg-surface-alt px-2.5 py-1 text-xs font-medium text-ink">
                {value.status ? ETHICS_STATUS_LABEL[value.status] : "Belum dinilai"}
              </span>
            </div>
            <p className="mt-1 text-xs leading-[18px] text-ink-muted">{def.helper}</p>
            {value.note ? (
              <p className="mt-1 text-xs leading-[18px] text-ink">
                Catatan: {value.note}
              </p>
            ) : null}
          </li>
        );
      })}
    </ul>
  );
}
