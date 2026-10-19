"use client";

import { useCallback, useEffect, useState } from "react";
import { InformationRole, SeverityLevel } from "@/lib/classification";
import { productScopedKey } from "@/lib/productStorage";

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
// again every visit. Scoped per product (see useProducts.ts), so each AI
// product being tracked gets its own classification.

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
  // Which of the checklist's two purposes the person picked before
  // starting: tracking an izin edar submission, or preparing material for
  // a research ethics committee. Asked as an explicit choice at the start
  // of the questionnaire (see IntroNarration in QualifyingQuestionnaire) —
  // null only before that choice has been made.
  purpose: "izin-edar" | "etik" | null;
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
  purpose: null,
  completed: false,
};

export function useQualifyingAnswers(productId: string = "default") {
  const [answers, setAnswers] = useState<QualifyingAnswers>(DEFAULT_ANSWERS);
  const [hydrated, setHydrated] = useState(false);

  // Re-reads from storage whenever the active product changes, not just on
  // first mount, so switching products on /produk swaps to that product's
  // own questionnaire answers instead of keeping the previous one's.
  useEffect(() => {
    setHydrated(false);
    try {
      const raw = window.localStorage.getItem(productScopedKey(STORAGE_KEY, productId));
      if (raw) {
        setAnswers({ ...DEFAULT_ANSWERS, ...JSON.parse(raw) });
      } else {
        setAnswers(DEFAULT_ANSWERS);
      }
    } catch {
      // Ignore malformed or inaccessible storage; defaults are used instead.
      setAnswers(DEFAULT_ANSWERS);
    } finally {
      setHydrated(true);
    }
  }, [productId]);

  const persist = useCallback(
    (next: QualifyingAnswers) => {
      setAnswers(next);
      try {
        window.localStorage.setItem(productScopedKey(STORAGE_KEY, productId), JSON.stringify(next));
      } catch {
        // If storage is unavailable, state still updates for this session.
      }
    },
    [productId]
  );

  const setAnswer = useCallback(
    <K extends keyof Omit<QualifyingAnswers, "completed">>(
      field: K,
      value: QualifyingAnswers[K]
    ) => {
      setAnswers((current) => {
        const next = { ...current, [field]: value };
        try {
          window.localStorage.setItem(productScopedKey(STORAGE_KEY, productId), JSON.stringify(next));
        } catch {
          // If storage is unavailable, state still updates for this session.
        }
        return next;
      });
    },
    [productId]
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
          window.localStorage.setItem(productScopedKey(STORAGE_KEY, productId), JSON.stringify(next));
        } catch {
          // If storage is unavailable, state still updates for this session.
        }
        return next;
      });
    },
    [productId]
  );

  const markCompleted = useCallback(() => {
    setAnswers((current) => {
      const next = { ...current, completed: true };
      try {
        window.localStorage.setItem(productScopedKey(STORAGE_KEY, productId), JSON.stringify(next));
      } catch {
        // If storage is unavailable, state still updates for this session.
      }
      return next;
    });
  }, [productId]);

  // Reopens the questionnaire without discarding previous answers, so
  // "Ubah Jawaban Profil" on /checklist pre-fills what was already chosen.
  const reopen = useCallback(() => {
    setAnswers((current) => {
      const next = { ...current, completed: false };
      try {
        window.localStorage.setItem(productScopedKey(STORAGE_KEY, productId), JSON.stringify(next));
      } catch {
        // If storage is unavailable, state still updates for this session.
      }
      return next;
    });
  }, [productId]);

  const resetAll = useCallback(() => {
    persist(DEFAULT_ANSWERS);
  }, [persist]);

  return { answers, setAnswer, submit, markCompleted, reopen, resetAll, hydrated };
}
