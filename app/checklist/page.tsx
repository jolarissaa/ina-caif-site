"use client";

import { useMemo, useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ChecklistItemRow from "@/components/ChecklistItem";
import ExportEthicsDialog from "@/components/ExportEthicsDialog";
import QualifyingQuestionnaire from "@/components/QualifyingQuestionnaire";
import RegulationQuote from "@/components/RegulationQuote";
import CategoryProgressBar from "@/components/CategoryProgressBar";
import CategoryProgressPanel from "@/components/CategoryProgressPanel";
import ClassificationSummary from "@/components/ClassificationSummary";
import EvidenceTierBadges from "@/components/EvidenceTierBadges";
import Link from "next/link";
import {
  categories,
  checklistItems,
  categoryQuotes,
  isItemVisible,
  KEMENKES_SUBMISSION_GUIDE_URL,
} from "@/lib/checklistData";
import { useChecklistState } from "@/lib/useChecklistState";
import { useQualifyingAnswers } from "@/lib/useQualifyingAnswers";
import { useProducts } from "@/lib/useProducts";
import { deriveClassification, deriveEvidenceTier } from "@/lib/classification";

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

  // What ex-"klasifikasi-1"/ex-"klinis-1" used to be — asking the reader to
  // work out what the questionnaire above already determined, with no
  // feedback until they did — is now just the questionnaire's own result,
  // shown via ClassificationSummary right above the checklist. Those two
  // items (and the auto-complete/result-banner logic that patched over
  // them) were removed from lib/checklistData.ts entirely rather than kept
  // around as a redundant auto-checked box.

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

  // Defensive: /checklist is normally only reached after a product exists
  // (from /produk's "Buka" or "Tambah & Mulai Checklist"), but a direct
  // visit, a stale tab, or deleting the only product while this page is
  // open can land here with nothing active. Rather than silently showing
  // (and writing into) a phantom "" product, send the visitor back to the
  // product list.
  if (productsHydrated && products.length === 0) {
    return (
      <>
        <Header />
        <main className="mx-auto max-w-content px-6 py-12">
          <div className="rounded-lg border border-dashed border-border-subtle p-6 text-center">
            <p className="text-sm text-ink-muted">
              Belum ada produk yang dipilih.{" "}
              <Link href="/produk" className="font-medium text-brand hover:underline">
                Buka Produk Saya
              </Link>{" "}
              untuk menambah atau memilih satu.
            </p>
          </div>
        </main>
        <Footer />
      </>
    );
  }

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
          <QualifyingQuestionnaire
            initialAnswers={answers}
            onSubmit={submit}
            onSkip={markCompleted}
            productId={activeProductId}
          />
        ) : (
          <>
            {classification ? (
              <ClassificationSummary
                classification={classification}
                severityLevel={answers.severityLevel}
                informationRole={answers.informationRole}
                evidenceTier={evidenceTier}
                activeCategories={categoriesWithVisibleItems}
              />
            ) : null}

            <div className="lg:hidden">
              <div className="mt-6 flex items-center justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <CategoryProgressBar
                    categories={categoriesWithVisibleItems}
                    visibleItems={visibleItems}
                    statusMap={statusMap}
                  />
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                type="button"
                onClick={reopen}
                className="no-print flex-shrink-0 text-xs font-medium text-ink-muted underline-offset-2 hover:text-brand hover:underline"
              >
                Ubah jawaban profil produk
              </button>
            </div>

            <div className="mt-4 grid gap-8 lg:grid-cols-[1fr_260px]">
              <div className="min-w-0 space-y-10">
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
                            productId={activeProductId}
                            resultBanner={
                              item.id === "klinis-2" && evidenceTier ? (
                                <EvidenceTierBadges evidenceTier={evidenceTier} />
                              ) : undefined
                            }
                          />
                        ))}
                      </div>
                    </section>
                  );
                })}

                <div className="no-print rounded-lg border border-border-subtle bg-surface-alt p-6">
                  <p className="text-xs font-semibold uppercase tracking-wide text-ink-muted">
                    Langkah selanjutnya
                  </p>
                  {answers.purpose === "etik" ? (
                    <>
                      <h3 className="mt-1 font-display text-base font-semibold text-ink">
                        Konteks untuk tim etik sudah terisi. Tinggal ekspor.
                      </h3>
                      <div className="mt-4 flex flex-wrap gap-3">
                        <Link
                          href="/checklist/cetak?etik=1"
                          className="rounded-md bg-brand px-4 py-2 text-sm font-semibold text-on-brand hover:bg-brand-dark"
                        >
                          Ekspor untuk Komite Etik
                        </Link>
                      </div>
                    </>
                  ) : (
                    <>
                      <h3 className="mt-1 font-display text-base font-semibold text-ink">
                        Checklist ini membantu Anda melacak progres, bukan pengganti penilaian
                        komite etik
                      </h3>
                      <p className="mt-2 max-w-2xl text-sm leading-[22px] text-ink-muted">
                        Keputusan akhir tetap ada pada Kemenkes dan komite etik penelitian
                        kesehatan (KEPKN). Sejak Februari 2022, pengajuan izin edar alat
                        kesehatan dimulai dari OSS RBA (oss.go.id) dulu, baru diteruskan ke
                        sistem Regalkes Kemenkes untuk Form A–E-nya.
                      </p>

                      <div className="mt-3 max-w-md overflow-hidden rounded-md border border-border-subtle">
                        <img
                          src="/images/oss-rba-flow.png"
                          alt="Alur perizinan: Pelaku Usaha mengajukan lewat OSS, diteruskan ke Regalkes, lalu disetujui atau ditolak"
                          className="w-full"
                        />
                      </div>
                      <p className="mt-2 max-w-2xl text-sm leading-[22px] text-ink-muted">
                        Lihat{" "}
                        <a
                          href="/docs/tata-cara-oss-rba.pdf"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-medium text-brand hover:underline"
                        >
                          alurnya lewat OSS RBA
                        </a>{" "}
                        dulu, baru pelajari pedoman lengkap Form A–E lewat tombol di bawah.
                      </p>

                      <div className="mt-4 flex flex-wrap gap-3">
                        <a
                          href={KEMENKES_SUBMISSION_GUIDE_URL}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="rounded-md bg-brand px-4 py-2 text-sm font-semibold text-on-brand hover:bg-brand-dark"
                        >
                          Cara Mengajukan Izin Edar
                        </a>
                        <button
                          type="button"
                          onClick={() => setExportDialogOpen(true)}
                          className="inline-flex items-center rounded-md border border-border-subtle px-4 py-2 text-sm font-semibold text-ink hover:border-brand hover:text-brand"
                        >
                          Siapkan Ringkasan untuk Komite Etik
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </div>

              <CategoryProgressPanel
                categories={categoriesWithVisibleItems}
                visibleItems={visibleItems}
                statusMap={statusMap}
              />
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
