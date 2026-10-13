"use client";

import { useCallback, useEffect, useState } from "react";
import { InformationRole, SeverityLevel } from "@/lib/classification";

// Answers to the short qualifying questionnaire shown before the
// Compliance Checker. These decide which checklist categories/items are
// actually relevant to the product being assessed — see
// isItemVisible() in checklistData usage on /checklist — instead of
// showing all items to everyone regardless of what they're building, and
// (as of this round) drive the computed classification/evidence-tier
// result shown on /checklist — see lib/classification.ts for the
// derivation logic. `completed` tracks whether the person has been
// through the questionnaire at least once (including an explicit
// "lewati, tampilkan semua" skip), so returning visitors aren't asked
// again every visit.

export type QualifyingAnswers = {
  // Gambar 2.1 classification gates, asked in sequence — each is only
  // reachable (and thus only ever non-null) once the gate before it ruled
  // the product in. See lib/classification.ts for what each gate means.
  controlsDeviceFunction: boolean | null;
  actsOnIndividualPatientData: boolean | null;
  acquiresOrAnalyzesSignals: boolean | null;
  displaysContinuousSignals: boolean | null;
  providesRiskScoreOrTimeCritical: boolean | null;
  // Tabel 3.2 evidence-tier axes — only asked once classification resolves
  // to SaMD (SiMD and Bukan Alat Kesehatan don't go through Tabel 3.2).
  severityLevel: SeverityLevel | null;
  informationRole: InformationRole | null;
  // AI/ML profiling, unchanged from before this round.
  usesAi: boolean | null;
  continuousLearning: boolean | null;
  generative: boolean | null;
  importLocalValidation: boolean | null;
  completed: boolean;
};

const STORAGE_KEY = "ina-caif-qualifying-v1";

const DEFAULT_ANSWERS: QualifyingAnswers = {
  controlsDeviceFunction: null,
  actsOnIndividualPatientData: null,
  acquiresOrAnalyzesSignals: null,
  displaysContinuousSignals: null,
  providesRiskScoreOrTimeCritical: null,
  severityLevel: null,
  informationRole: null,
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
    <K extends keyof Omit<QualifyingAnswers, "completed">>(
      field: K,
      value: QualifyingAnswers[K]
    ) => {
      setAnswers((current) => {
        const next = { ...current, [field]: value };
        try {
          window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
        } catch {
          // If storage is unavailable, state still updates for this session.
        }
        return next;
      });
    },
    []
  );

  // Persists the whole questionnaire's worth of answers plus
  // completed:true in a single write. Used instead of several setAnswer
  // calls in a row for a submit: calling setAnswer repeatedly inside one
  // synchronous handler would have each call read the same
  // not-yet-re-rendered `answers`, so only the last call's change would
  // actually stick — this takes the full set of values from the
  // questionnaire at once and merges them in one go.
  const submit = useCallback(
    (values: Partial<Omit<QualifyingAnswers, "completed">>) => {
      setAnswers((current) => {
        const next = { ...current, ...values, completed: true };
        try {
          window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
        } catch {
          // If storage is unavailable, state still updates for this session.
        }
        return next;
      });
    },
    []
  );

  const markCompleted = useCallback(() => {
    setAnswers((current) => {
      const next = { ...current, completed: true };
      try {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch {
        // If storage is unavailable, state still updates for this session.
      }
      return next;
    });
  }, []);

  // Reopens the questionnaire without discarding previous answers, so
  // "Ubah Jawaban Profil" on /checklist pre-fills what was already chosen.
  const reopen = useCallback(() => {
    setAnswers((current) => {
      const next = { ...current, completed: false };
      try {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch {
        // If storage is unavailable, state still updates for this session.
      }
      return next;
    });
  }, []);

  const resetAll = useCallback(() => {
    persist(DEFAULT_ANSWERS);
  }, [persist]);

  return { answers, setAnswer, submit, markCompleted, reopen, resetAll, hydrated };
}
