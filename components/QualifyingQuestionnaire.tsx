"use client";

import { useState } from "react";
import { QualifyingAnswers } from "@/lib/useQualifyingAnswers";

type Props = {
  initialAnswers: QualifyingAnswers;
  onSubmit: (answers: Pick<QualifyingAnswers, "usesAi" | "continuousLearning" | "generative" | "importLocalValidation">) => void;
  onSkip: () => void;
};

type YesNoFieldProps = {
  label: string;
  value: boolean | null;
  onChange: (value: boolean) => void;
};

function YesNoField({ label, value, onChange }: YesNoFieldProps) {
  return (
    <div className="rounded-md border border-border-subtle bg-surface p-4">
      <p className="text-sm leading-[22px] text-ink">{label}</p>
      <div className="mt-3 flex gap-2">
        <button
          type="button"
          onClick={() => onChange(true)}
          className={`rounded-pill px-4 py-1.5 text-sm font-medium ${
            value === true
              ? "bg-brand text-on-brand"
              : "border border-border-subtle text-ink-muted hover:border-brand hover:text-brand"
          }`}
        >
          Ya
        </button>
        <button
          type="button"
          onClick={() => onChange(false)}
          className={`rounded-pill px-4 py-1.5 text-sm font-medium ${
            value === false
              ? "bg-brand text-on-brand"
              : "border border-border-subtle text-ink-muted hover:border-brand hover:text-brand"
          }`}
        >
          Tidak
        </button>
      </div>
    </div>
  );
}

// A short qualifying step shown before the checklist itself: the answers
// decide which categories and items actually apply (e.g. the "Kecerdasan
// Buatan" category only matters if the product uses AI/ML at all), instead
// of presenting the full 33-item list to every visitor regardless of what
// they're building.
export default function QualifyingQuestionnaire({ initialAnswers, onSubmit, onSkip }: Props) {
  const [usesAi, setUsesAi] = useState<boolean | null>(initialAnswers.usesAi);
  const [continuousLearning, setContinuousLearning] = useState<boolean | null>(
    initialAnswers.continuousLearning
  );
  const [generative, setGenerative] = useState<boolean | null>(initialAnswers.generative);
  const [importLocalValidation, setImportLocalValidation] = useState<boolean | null>(
    initialAnswers.importLocalValidation
  );

  const canSubmit = usesAi !== null && importLocalValidation !== null;

  return (
    <div className="mt-8 max-w-2xl rounded-lg border border-border-subtle bg-surface-alt p-6">
      <h2 className="font-display text-lg font-semibold text-ink">
        Sebelum mulai, ceritakan tentang produk Anda
      </h2>
      <p className="mt-2 text-sm leading-[22px] text-ink-muted">
        Beberapa butir checklist hanya berlaku untuk karakteristik produk tertentu. Jawaban di
        bawah ini menyaring checklist supaya hanya menampilkan butir yang relevan untuk produk
        Anda — jawaban tersimpan di perangkat ini dan dapat diubah kapan saja.
      </p>

      <div className="mt-5 space-y-3">
        <YesNoField
          label="Apakah produk Anda menggunakan kecerdasan buatan / machine learning (termasuk model generatif atau LLM)?"
          value={usesAi}
          onChange={(value) => {
            setUsesAi(value);
            if (!value) {
              setContinuousLearning(null);
              setGenerative(null);
            }
          }}
        />

        {usesAi ? (
          <>
            <YesNoField
              label="Apakah model Anda terus belajar atau diperbarui setelah digunakan dalam pelayanan klinis (continuous machine learning)?"
              value={continuousLearning}
              onChange={setContinuousLearning}
            />
            <YesNoField
              label="Apakah model Anda bersifat generatif atau menggunakan Large Language Model (LLM)?"
              value={generative}
              onChange={setGenerative}
            />
          </>
        ) : null}

        <YesNoField
          label="Apakah produk Anda dikembangkan di luar Indonesia dan dilatih ulang dengan data populasi Indonesia, dan/atau menggunakan AI berisiko sedang–tinggi untuk diagnosis, skrining, atau keputusan klinis?"
          value={importLocalValidation}
          onChange={setImportLocalValidation}
        />
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-3">
        <button
          type="button"
          disabled={!canSubmit}
          onClick={() =>
            onSubmit({
              usesAi,
              continuousLearning,
              generative,
              importLocalValidation,
            })
          }
          className="rounded-md bg-brand px-4 py-2 text-sm font-semibold text-on-brand hover:bg-brand-dark disabled:cursor-not-allowed disabled:opacity-50"
        >
          Lihat Checklist
        </button>
        <button
          type="button"
          onClick={onSkip}
          className="text-sm font-medium text-ink-muted hover:text-brand"
        >
          Lewati, tampilkan semua butir
        </button>
      </div>
    </div>
  );
}
