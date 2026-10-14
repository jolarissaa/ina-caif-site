"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ChecklistItemRow from "@/components/ChecklistItem";
import ExportEthicsDialog from "@/components/ExportEthicsDialog";
import QualifyingQuestionnaire from "@/components/QualifyingQuestionnaire";
import RegulationQuote from "@/components/RegulationQuote";
import CategoryProgressBar from "@/components/CategoryProgressBar";
import ClassificationSummary from "@/components/ClassificationSummary";
import Link from "next/link";
import { categories, checklistItems, categoryQuotes, isItemVisible } from "@/lib/checklistData";
import { useChecklistState } from "@/lib/useChecklistState";
import { useQualifyingAnswers } from "@/lib/useQualifyingAnswers";
import { useProducts } from "@/lib/useProducts";
import {
  CLASSIFICATION_LABEL,
  CLASSIFICATION_RESULT_TEXT,
  INFORMATION_ROLE_LABEL,
  SEVERITY_LABEL,
  deriveClassification,
  deriveEvidenceTier,
} from "@/lib/classification";

export default function ChecklistPage() {
  const [exportDialogOpen, setExportDialogOpen] = useState(false);
  // Which product this checklist belongs to — set on /produk, persisted in
  // localStorage, and read here so switching products there actually swaps
  // the checklist, questionnaire, and export context shown below.
  const { products, activeProductId, hydrated: productsHydrated } = useProducts();
  const activeProduct = products.find((p) => p.id === activeProductId);
  const { statusMap, setStatus, resetAll, hydrated } = useChecklistState(activeProductId);
  const {
    answers,
    submit,
    markCompleted,
    reopen,
    hydrated: qualifyingHydrated,
  } = useQualifyingAnswers(activeProductId);

  // Computed once per render from the questionnaire's answers — see
  // lib/classification.ts. null while the classification gates haven't
  // all been answered yet (e.g. the questionnaire was skipped).
  const classification = useMemo(() => deriveClassification(answers), [answers]);
  const evidenceTier = useMemo(
    () => (classification === "SaMD" ? deriveEvidenceTier(answers.informationRole) : null),
    [classification, answers.informationRole]
  );

  // "klasifikasi-1" and "klinis-1" ask the reader to work out exactly what
  // the questionnaire above already determined — once there's a computed
  // answer, auto-mark them done instead of leaving them sitting at
  // "Belum Dimulai" with no feedback (per Jo: "kenapa masih ada ini ya?").
  // Each only fires once per page load, and only while the item is still
  // at its untouched default, so it never fights a status the person set
  // by hand afterwards.
  const autoCompletedClasifikasi = useRef(false);
  const autoCompletedKlinis = useRef(false);

  useEffect(() => {
    if (!hydrated || autoCompletedClasifikasi.current) return;
    if (classification && statusMap["klasifikasi-1"] === "belum") {
      autoCompletedClasifikasi.current = true;
      setStatus("klasifikasi-1", "selesai");
    }
  }, [classification, hydrated, statusMap, setStatus]);

  useEffect(() => {
    if (!hydrated || autoCompletedKlinis.current) return;
    if (classification === "SaMD" && evidenceTier && statusMap["klinis-1"] === "belum") {
      autoCompletedKlinis.current = true;
      setStatus("klinis-1", "selesai");
    }
  }, [classification, evidenceTier, hydrated, statusMap, setStatus]);

  // Injects the computed result straight into the two items the
  // questionnaire now answers, instead of leaving them purely
  // self-directed. Built once per render from the already-computed
  // classification/evidenceTier above.
  const itemResultBanners = useMemo(() => {
    const map: Record<string, React.ReactNode> = {};
    if (!classification) return map;

    map["klasifikasi-1"] = (
      <div className="rounded-md border border-brand/30 bg-brand/5 p-3">
        <p className="text-xs font-semibold uppercase tracking-wide text-brand">
          Hasil dari kuesioner profil produk Anda
        </p>
        <p className="mt-1 text-sm font-semibold text-ink">
          {CLASSIFICATION_LABEL[classification]}
        </p>
        <p className="mt-1 text-sm leading-[20px] text-ink-muted">
          {CLASSIFICATION_RESULT_TEXT[classification]}
        </p>
      </div>
    );

    if (classification === "SaMD" && evidenceTier && answers.severityLevel && answers.informationRole) {
      map["klinis-1"] = (
        <div className="rounded-md border border-brand/30 bg-brand/5 p-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-brand">
            Hasil dari kuesioner profil produk Anda
          </p>
          <p className="mt-1 text-sm text-ink">
            Tingkat keparahan: <strong>{SEVERITY_LABEL[answers.severityLevel]}</strong> · Peran
            keluaran: <strong>{INFORMATION_ROLE_LABEL[answers.informationRole]}</strong>
          </p>
          <p className="mt-2 text-sm leading-[20px] text-ink-muted">
            Bukti klinis yang wajib dipenuhi: kajian literatur ilmiah + perbandingan produk
            sejenis{evidenceTier.trial ? " + hasil uji klinik" : ""}.
          </p>
        </div>
      );
    } else if (classification !== "SaMD") {
      map["klinis-1"] = (
        <div className="rounded-md border border-border-subtle bg-surface-alt p-3">
          <p className="text-sm leading-[20px] text-ink-muted">
            Tabel 3.2 berlaku untuk produk yang terklasifikasi sebagai SaMD. Berdasarkan jawaban
            kuesioner profil produk Anda, produk ini saat ini terklasifikasi sebagai{" "}
            <strong>{CLASSIFICATION_LABEL[classification]}</strong>, sehingga item ini mungkin
            tidak berlaku secara langsung.
          </p>
        </div>
      );
    }

    return map;
  }, [classification, evidenceTier, answers.severityLevel, answers.informationRole]);

  const visibleItems = useMemo(
    () => checklistItems.filter((item) => isItemVisible(item, answers)),
    [answers]
  );

  // Every category with at least one visible item is always rendered, in
  // order — there's no more "pick one category to show" state. The
  // CategoryProgressBar below gives the quick-jump/overview function the
  // old pill buttons served, without hiding the rest of the page.
  const categoriesWithVisibleItems = useMemo(
    () =>
      categories.filter((category) =>
        visibleItems.some((item) => item.categoryId === category.id)
      ),
    [visibleItems]
  );

  const progress = useMemo(() => {
    const total = visibleItems.length;
    const done = visibleItems.filter((item) => statusMap[item.id] === "selesai").length;
    return { total, done };
  }, [visibleItems, statusMap]);

  const showQuestionnaire = qualifyingHydrated && !answers.completed;

  return (
    <>
      <Header />
      <main className="mx-auto max-w-content px-6 py-12">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <Link
              href="/produk"
              className="no-print text-xs font-medium text-ink-muted hover:text-brand"
            >
              ← Produk Saya
            </Link>
            <h1 className="mt-1 font-display text-2xl font-bold text-ink">
              Compliance Checker
              {productsHydrated && activeProduct ? (
                <span className="ml-2 text-ink-muted">— {activeProduct.name}</span>
              ) : null}
            </h1>
            <p className="mt-2 max-w-xl text-sm leading-[22px] text-ink-muted">
              Tandai setiap butir sesuai kondisi sistem Anda saat ini. Buka setiap butir untuk
              membaca penjelasan dan sumber rujukannya.
            </p>
          </div>
          {!showQuestionnaire ? (
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
              </div>
            </div>
          ) : null}
        </div>

        {showQuestionnaire ? (
          <QualifyingQuestionnaire initialAnswers={answers} onSubmit={submit} onSkip={markCompleted} />
        ) : (
          <>
            {classification ? (
              <ClassificationSummary
                classification={classification}
                severityLevel={answers.severityLevel}
                informationRole={answers.informationRole}
                evidenceTier={evidenceTier}
              />
            ) : null}

            <div className="mt-6 flex items-center justify-between gap-4">
              <div className="min-w-0 flex-1">
                <CategoryProgressBar
                  categories={categoriesWithVisibleItems}
                  visibleItems={visibleItems}
                  statusMap={statusMap}
                />
              </div>
              <button
                type="button"
                onClick={reopen}
                className="no-print flex-shrink-0 text-xs font-medium text-ink-muted underline-offset-2 hover:text-brand hover:underline"
              >
                Ubah jawaban profil produk
              </button>
            </div>

            <div className="mt-8 space-y-10">
              {categoriesWithVisibleItems.map((category) => {
                const itemsInCategory = visibleItems.filter(
                  (item) => item.categoryId === category.id
                );
                const quote = categoryQuotes[category.id];
                return (
                  <section key={category.id} id={category.id} className="scroll-mt-20">
                    <h2 className="font-display text-lg font-semibold text-ink">
                      {category.name}
                    </h2>
                    <p className="mt-1 text-sm leading-[22px] text-ink-muted">
                      {category.description}
                    </p>
                    {quote ? <RegulationQuote {...quote} /> : null}
                    <div className="mt-4 space-y-3">
                      {itemsInCategory.map((item) => (
                        <ChecklistItemRow
                          key={item.id}
                          item={item}
                          status={statusMap[item.id] ?? item.defaultStatus}
                          onStatusChange={(status) => setStatus(item.id, status)}
                          resultBanner={itemResultBanners[item.id]}
                        />
                      ))}
                    </div>
                  </section>
                );
              })}
            </div>

            <div className="no-print mt-10 rounded-lg border border-border-subtle bg-surface-alt p-6">
              <p className="text-xs font-semibold uppercase tracking-wide text-ink-muted">
                Langkah selanjutnya
              </p>
              <h3 className="mt-1 font-display text-base font-semibold text-ink">
                Checklist ini membantu Anda melacak progres — bukan pengganti penilaian komite
                etik
              </h3>
              <p className="mt-2 max-w-2xl text-sm leading-[22px] text-ink-muted">
                INA-CAIF membantu memperjelas dokumen dan bukti apa saja yang perlu disiapkan,
                berdasarkan jawaban kuesioner profil produk Anda. Keputusan akhir tetap ada pada
                komite etik penelitian kesehatan (KEPKN) dan proses pengajuan izin edar ke
                Kemenkes. Setelah checklist ini cukup lengkap, gunakan tombol di bawah untuk
                menyiapkan ringkasan yang bisa dikirim ke komite etik, atau pelajari kembali cara
                mengajukan izin edar.
              </p>
              <div className="mt-4 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() => setExportDialogOpen(true)}
                  className="rounded-md bg-brand px-4 py-2 text-sm font-semibold text-on-brand hover:bg-brand-dark"
                >
                  Siapkan Ringkasan untuk Komite Etik
                </button>
                <a
                  href="https://regalkes.kemkes.go.id"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center rounded-md border border-border-subtle px-4 py-2 text-sm font-semibold text-ink hover:border-brand hover:text-brand"
                >
                  Cara Mengajukan Izin Edar
                </a>
              </div>
            </div>
          </>
        )}
      </main>
      <Footer />
      <ExportEthicsDialog
        open={exportDialogOpen}
        onClose={() => setExportDialogOpen(false)}
        productId={activeProductId}
      />
    </>
  );
}
