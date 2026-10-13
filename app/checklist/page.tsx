"use client";

import { useMemo, useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ChecklistItemRow from "@/components/ChecklistItem";
import ExportEthicsDialog from "@/components/ExportEthicsDialog";
import QualifyingQuestionnaire from "@/components/QualifyingQuestionnaire";
import RegulationQuote from "@/components/RegulationQuote";
import { categories, checklistItems, categoryQuotes, isItemVisible } from "@/lib/checklistData";
import { useChecklistState } from "@/lib/useChecklistState";
import { useQualifyingAnswers } from "@/lib/useQualifyingAnswers";

const ALL_CATEGORY = "semua";

export default function ChecklistPage() {
  const [activeCategory, setActiveCategory] = useState<string>(ALL_CATEGORY);
  const [exportDialogOpen, setExportDialogOpen] = useState(false);
  const { statusMap, setStatus, resetAll, hydrated } = useChecklistState();
  const {
    answers,
    setAnswer,
    markCompleted,
    reopen,
    hydrated: qualifyingHydrated,
  } = useQualifyingAnswers();

  const visibleItems = useMemo(
    () => checklistItems.filter((item) => isItemVisible(item, answers)),
    [answers]
  );

  const categoriesWithVisibleItems = useMemo(
    () =>
      categories.filter((category) =>
        visibleItems.some((item) => item.categoryId === category.id)
      ),
    [visibleItems]
  );

  const visibleCategoriesToRender = useMemo(() => {
    if (activeCategory === ALL_CATEGORY) return categoriesWithVisibleItems;
    return categoriesWithVisibleItems.filter((category) => category.id === activeCategory);
  }, [activeCategory, categoriesWithVisibleItems]);

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
            <h1 className="font-display text-2xl font-bold text-ink">Compliance Checker</h1>
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
                <button
                  type="button"
                  onClick={() => setExportDialogOpen(true)}
                  className="rounded-md bg-brand px-3 py-1.5 text-xs font-semibold text-on-brand hover:bg-brand-dark"
                >
                  Ekspor PDF
                </button>
              </div>
            </div>
          ) : null}
        </div>

        {showQuestionnaire ? (
          <QualifyingQuestionnaire
            initialAnswers={answers}
            onSubmit={(values) => {
              setAnswer("usesAi", values.usesAi ?? false);
              if (values.usesAi) {
                setAnswer("continuousLearning", values.continuousLearning ?? false);
                setAnswer("generative", values.generative ?? false);
              }
              setAnswer("importLocalValidation", values.importLocalValidation ?? false);
              markCompleted();
            }}
            onSkip={markCompleted}
          />
        ) : (
          <>
            <div className="no-print mt-8 flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => setActiveCategory(ALL_CATEGORY)}
                className={`rounded-pill px-4 py-1.5 text-sm font-medium ${
                  activeCategory === ALL_CATEGORY
                    ? "bg-brand text-on-brand"
                    : "border border-border-subtle text-ink-muted hover:border-brand hover:text-brand"
                }`}
              >
                Semua
              </button>
              {categoriesWithVisibleItems.map((category) => (
                <button
                  key={category.id}
                  type="button"
                  onClick={() => setActiveCategory(category.id)}
                  className={`rounded-pill px-4 py-1.5 text-sm font-medium ${
                    activeCategory === category.id
                      ? "bg-brand text-on-brand"
                      : "border border-border-subtle text-ink-muted hover:border-brand hover:text-brand"
                  }`}
                >
                  {category.name}
                </button>
              ))}
              <button
                type="button"
                onClick={reopen}
                className="ml-auto text-xs font-medium text-ink-muted underline-offset-2 hover:text-brand hover:underline"
              >
                Ubah jawaban profil produk
              </button>
            </div>

            <div className="mt-8 space-y-10">
              {visibleCategoriesToRender.map((category) => {
                const itemsInCategory = visibleItems.filter(
                  (item) => item.categoryId === category.id
                );
                const quote = categoryQuotes[category.id];
                return (
                  <section key={category.id}>
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
                        />
                      ))}
                    </div>
                  </section>
                );
              })}
            </div>
          </>
        )}
      </main>
      <Footer />
      <ExportEthicsDialog open={exportDialogOpen} onClose={() => setExportDialogOpen(false)} />
    </>
  );
}
