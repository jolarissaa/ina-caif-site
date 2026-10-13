"use client";

import { useCallback, useEffect, useState } from "react";

// Answers to the short qualifying questionnaire shown before the
// Compliance Checker. These decide which checklist categories/items are
// actually relevant to the product being assessed — see
// isItemVisible() in checklistData usage on /checklist — instead of
// showing all items to everyone regardless of what they're building.
// `completed` tracks whether the person has been through the
// questionnaire at least once (including an explicit "lewati, tampilkan
// semua" skip), so returning visitors aren't asked again every visit.

export type QualifyingAnswers = {
  usesAi: boolean | null;
  continuousLearning: boolean | null;
  generative: boolean | null;
  importLocalValidation: boolean | null;
  completed: boolean;
};

const STORAGE_KEY = "ina-caif-qualifying-v1";

const DEFAULT_ANSWERS: QualifyingAnswers = {
  usesAi: null,
  continuousLearning: null,
  generative: null,
  importLocalValidation: null,
  completed: false,
};

export function useQualifyingAnswers() {
  const [answers, setAnswers] = useState<QualifyingAnswers>(DEFAULT_ANSWERS);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        setAnswers((current) => ({ ...current, ...JSON.parse(raw) }));
      }
    } catch {
      // Ignore malformed or inaccessible storage; defaults are used instead.
    } finally {
      setHydrated(true);
    }
  }, []);

  const persist = useCallback((next: QualifyingAnswers) => {
    setAnswers(next);
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      // If storage is unavailable, state still updates for this session.
    }
  }, []);

  const setAnswer = useCallback(
    (field: keyof Omit<QualifyingAnswers, "completed">, value: boolean) => {
      persist({ ...answers, [field]: value });
    },
    [answers, persist]
  );

  const markCompleted = useCallback(() => {
    persist({ ...answers, completed: true });
  }, [answers, persist]);

  // Reopens the questionnaire without discarding previous answers, so
  // "Ubah Jawaban Profil" on /checklist pre-fills what was already chosen.
  const reopen = useCallback(() => {
    persist({ ...answers, completed: false });
  }, [answers, persist]);

  const resetAll = useCallback(() => {
    persist(DEFAULT_ANSWERS);
  }, [persist]);

  return { answers, setAnswer, markCompleted, reopen, resetAll, hydrated };
}
